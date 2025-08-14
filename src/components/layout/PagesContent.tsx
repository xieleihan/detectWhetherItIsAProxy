import '@/styles/layout/Modules/PagesContent.scss';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/index';
import JsonTable from '../JsonTable';
import { Button, Card, Spin, Statistic } from 'antd';
import { useState } from 'react';
import ListCom from '../ListCom';

function PagesContent() {
    // 获取Redux中的ipinfo状态
    const ipinfo = useSelector((state: RootState) => state.ipinfo);
    const [isOpenInfo, setIsOpenInfo] = useState(false);
    const [score,setScore] = useState(0); 
    
    const handleToggleInfo = () => {
        setIsOpenInfo(!isOpenInfo);
    }

    function changeScore(data:number) {
        setScore(data);
    }

    return (
        <>
            <div className="container">
                <p>代理检测</p>

                {/* 评分 */}
                <div className='score'>
                    <Card className='card'>
                        <Spin spinning={score === 0} size="large" >
                            <div>
                                <Statistic
                                    title="风控分数"
                                    value={score}
                                    precision={0}
                                    valueStyle={{ color: score < 50 ? '#3f8600' : '#cf1322' }}
                                    suffix="分"
                                    style={{ fontSize: '24px', textAlign: 'center' }}
                                />
                            </div>
                        </Spin>
                    </Card>
                </div>

                {/* 列表 */}
                <ListCom prop={changeScore} />

                <Button className='btnInfo' onClick={() => {
                    handleToggleInfo();
                }}>{ !isOpenInfo ? '查看详情' : '收起表格' }</Button>
                {isOpenInfo && (
                    <div className="table">
                        <JsonTable data={ipinfo as unknown as Record<string, boolean>} />
                    </div>
                )}
            </div>
        </>
    );
}

export default PagesContent;