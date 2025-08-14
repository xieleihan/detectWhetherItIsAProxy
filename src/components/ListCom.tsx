import { List, Tag } from 'antd';
import '@/styles/ListCom.scss';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/index';
import { useState,useEffect } from 'react';
import { getBrowserNowTime } from '@/utils/getBrowserNowTime';
import { useGeolocation } from '@/hook/useGeolocation';
import { getLocalIPs } from '@/utils/getWebRTCInfo';

const checkRisk = (risk: boolean) => {
    return risk ? <Tag color="error">高风险</Tag> : <Tag color="success">低风险</Tag>;
}

const checkRiskAbuser = (risk: number) => {
    return risk > .2 ? <Tag color="error">高风险</Tag> : <Tag color="success">低风险</Tag>;
}

const checkRiskType = (type: string) => {
    return type === 'business' ? <Tag color="error">高风险</Tag> : <Tag color="success">低风险</Tag>;
}

function isPrivateIP(ip: string): boolean {
    const parts = ip.split('.').map(Number);
    const [a, b] = parts;
    return (
        a === 10 ||
        (a === 172 && b >= 16 && b <= 31) ||
        (a === 192 && b === 168) ||
        (a === 127) ||
        (a === 100 && b >= 64) ||
        (a === 169 && b === 254)
    );
  }

/**
 * 解析浏览器时间和服务器时间，计算时间差比率
 * @param browserTimeStr 
 * @param serverTimeStr 
 * @returns 
 */
function calculateTimeDiffRatio(browserTimeStr, serverTimeStr) {
    // 解析两个时间（自动处理时区，转换为 UTC 时间戳进行比较）
    const browserTime = new Date(browserTimeStr);
    const serverTime = new Date(serverTimeStr);

    

    // 计算时间差（单位：毫秒），取绝对值
    const diffMs = Math.abs(browserTime.getTime() - serverTime.getTime());

    // 转换为小时
    const diffHours = diffMs / (1000 * 60 * 60);

    // 定义范围：1 小时到 12 小时
    const minHours = 1;
    const maxHours = 12;

    // 归一化到 [0, 1]，超出范围则截断
    let ratio = (diffHours - minHours) / (maxHours - minHours);
    ratio = Math.max(0, Math.min(1, ratio)); // clamp to [0, 1]
    console.log(`浏览器时间: ${browserTimeStr}, 服务器时间: ${serverTimeStr}, 时间差比率: ${ratio}`);

    return ratio;
}

function riskToScore(risk: boolean | number | string): number {
    if (typeof risk === 'boolean') return risk ? 20 : 80;
    if (typeof risk === 'number') return Math.max(0, Math.min(100, 100 - risk * 100));
    if (typeof risk === 'string') return risk === 'business' ? 30 : 80;
    return 0;
}

function ListCom({prop}: { prop: (data: number) => void }) {
    const ipinfo = useSelector((state: RootState) => state.ipinfo);
    const [browserNowTime, setBrowserNowTime] = useState<string>('');
    const { mylocation, openGeolocation } = useGeolocation();

    const [browserLatitude, setBrowserLatitude] = useState<number | null>(null);
    const [browserLongitude, setBrowserLongitude] = useState<number | null>(null);
    const [ips, setIPs] = useState<string[]>([]); // 存储本地IP地址列表

    useEffect(() => {
        const fetchData = async () => {
            setBrowserNowTime(getBrowserNowTime());
            openGeolocation();
            const ips = await getLocalIPs();
            setIPs(ips);
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (mylocation) {
            console.log('✅ 获取到地理位置:', mylocation);
            setBrowserLatitude(parseFloat(mylocation.latitude.toFixed(6)));
            setBrowserLongitude(parseFloat(mylocation.longitude.toFixed(6)));
        } 
    }, [mylocation]);

    // 计算各项风险分数
    const scores: number[] = [
        riskToScore(ipinfo.is_datacenter),
        riskToScore(ipinfo.is_tor),
        riskToScore(ipinfo.is_proxy),
        riskToScore(ipinfo.is_vpn),
        riskToScore(ipinfo.is_abuser),
        riskToScore(!ipinfo.is_mobile),
        riskToScore(ipinfo.is_satellite),
        riskToScore(ipinfo.is_crawler),
        riskToScore(parseFloat(ipinfo.company.abuser_score)),
        riskToScore(ipinfo.company.type)
    ];

    // 时间差分数
    const timeRatio = calculateTimeDiffRatio(browserNowTime, ipinfo.location.local_time.toString());
    const timeScore = Math.max(0, 100 - timeRatio * 100);
    scores.push(timeScore);

    // 地理位置分数
    let geoScore = 50;
    if (browserLatitude !== null && browserLongitude !== null) {
        const distance = Math.sqrt(
            Math.pow(ipinfo.location.latitude - browserLatitude, 2) +
            Math.pow(ipinfo.location.longitude - browserLongitude, 2)
        );
        geoScore = distance < 0.3 ? 80 : 30;
    }
    scores.push(geoScore);

    const totalScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    console.log('当前风险评分:', totalScore);

    // 通过回调函数将分数传递给父组件
    useEffect(() => {
        console.log('当前风险评分:', totalScore);
        prop(totalScore);
    }, [totalScore]);

    return (
        <>
            <List className='list'>
                <List.Item>
                    <List.Item.Meta
                        title="黑名单IP检测"
                        description="是否来自数据中心（如 AWS、Google Cloud、阿里云）"
                    />
                    {checkRisk(ipinfo.is_datacenter)}
                </List.Item>
                <List.Item>
                    <List.Item.Meta
                        title="是否Tor节点"
                        description="Tor匿名网络节点经常被滥用使得 Tor 出口节点的 IP 经常出现在威胁情报黑名单"
                    />
                    {checkRisk(ipinfo.is_tor)}
                </List.Item>
                <List.Item>
                    <List.Item.Meta
                        title="是否是代理服务器IP（HTTP/SOCKS 代理）"
                        description="不安全的代理协议可能会认为是高风险"
                    />
                    {checkRisk(ipinfo.is_proxy)}
                </List.Item>
                <List.Item>
                    <List.Item.Meta
                        title="是否是VPN服务商的IP"
                        description="对于海外流媒体以及跨境电商等业务，VPN IP可能会被列入黑名单"
                    />
                    {checkRisk(ipinfo.is_vpn)}
                </List.Item>
                <List.Item>
                    <List.Item.Meta
                        title="是否是滥用者IP"
                        description="如果IP被列入滥用者名单，可能会影响业务的正常运营"
                    />
                    {checkRisk(ipinfo.is_abuser)}
                </List.Item>
                <List.Item>
                    <List.Item.Meta
                        title="是否来自移动网络（蜂窝网络，如 4G/5G）"
                        description="通常移动蜂窝网络的IP被认为是低风险,包括漫游用户"
                    />
                    {checkRisk(!ipinfo.is_mobile)}
                </List.Item>
                <List.Item>
                    <List.Item.Meta
                        title="是否是卫星网络IP"
                        description="卫星网络的IP无法用于确认用户具体位置，可能会被认为是高风险"
                    />
                    {checkRisk(ipinfo.is_satellite)}
                </List.Item>
                <List.Item>
                    <List.Item.Meta
                        title="是否是爬虫IP"
                        description="正常的爬虫是低风险的，但如果是经常恶意爬虫可能会被认为是高风险"
                    />
                    {checkRisk(ipinfo.is_crawler)}
                </List.Item>
                <List.Item>
                    <List.Item.Meta
                        title="滥用评分"
                        description={"当前IP所属公司:"+ipinfo.company.name}
                    />
                    {checkRiskAbuser(parseFloat(ipinfo.company.abuser_score))}
                </List.Item>
                <List.Item>
                    <List.Item.Meta
                        title="网络类型"
                        description={'当前IP所属网络类型: ' + ipinfo.company.type+',如果是企业网络,属于高风险,应该尽量使用住宅IP'}
                    />
                    {checkRiskType(ipinfo.company.type)}
                </List.Item>
                <List.Item>
                    <List.Item.Meta
                        title="服务器与浏览器时间差比率"
                        description='有些平台可能会根据服务器时间来判断用户请求的合法性，浏览器时间与服务器时间差比率过大可能会被认为是高风险'
                    />
                    {(() => {
                        const ratio = calculateTimeDiffRatio(browserNowTime, ipinfo.location.local_time.toString());
                        return ratio > .5 ? <Tag color="error">高风险</Tag> : <Tag color="success">低风险</Tag>;
                    })()}
                </List.Item>
                <List.Item>
                    <List.Item.Meta
                        title="浏览器地理位置"
                        description={'当前浏览器地理位置: ' + (browserLatitude !== null ? `纬度 ${browserLatitude}, 经度 ${browserLongitude}` : '未获取到')}
                    />
                    {/* 对ipinfo.location的地理位置: {ipinfo.location.latitude}, {ipinfo.location.longitude}把小数点去掉后比较浏览器的,如果差距在30公里以内,则认为是低风险 */}
                    {(() => {
                        if (browserLatitude !== null && browserLongitude !== null) {
                            const distance = Math.sqrt(
                                Math.pow(ipinfo.location.latitude - browserLatitude, 2) +
                                Math.pow(ipinfo.location.longitude - browserLongitude, 2)
                            );
                            return distance < 0.3 ? <Tag color="success">低风险</Tag> : <Tag color="error">高风险</Tag>;
                        }
                        return <Tag color="warning">未获取到浏览器位置</Tag>;
                    })()}
                </List.Item>
                <List.Item>
                    <List.Item.Meta
                        title="WebRTC 检测到的本地 IP"
                        description="通过 WebRTC 获取的候选 IP 地址（可能包含局域网或公网 IP）"
                    />
                    {ips.length > 0 ? (
                        <div style={{ marginTop: '8px' }}>
                            {ips.map((ip, index) => (
                                <Tag key={index} color={isPrivateIP(ip) ? 'default' : 'geekblue'}>
                                    {ip}
                                </Tag>
                            ))}
                        </div>
                    ) : (
                        <Tag color="warning">未检测到 IP（可能浏览器屏蔽 WebRTC）</Tag>
                    )}
                </List.Item>
            </List>
        </>
    );
}

export default ListCom;