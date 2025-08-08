import React from "react";
import { Table } from "antd";

const keyTranslations: Record<string, string> = {
    ip: "IP地址",
    rir: "区域注册机构",
    is_bogon: "是否为Bogon",
    is_mobile: "是否为移动设备",
    is_satellite: "是否为卫星设备",
    is_crawler: "是否为爬虫",
    is_datacenter: "是否为数据中心",
    is_tor: "是否为TOR节点",
    is_proxy: "是否为代理",
    is_vpn: "是否为VPN",
    is_abuser: "是否为滥用者",

    company: "公司信息",
    name: "公司名称",
    abuser_score: "滥用评分",
    domain: "域名",
    type: "类型",
    network: "网络范围",
    whois: "Whois信息",

    abuse: "滥用联系人",
    address: "地址",
    email: "邮箱",
    phone: "电话",

    asn: "ASN编号",
    route: "路由",
    descr: "描述",
    country: "国家",
    active: "活跃状态",
    org: "组织",
    updated: "更新时间",

    location: "地理位置",
    is_eu_member: "是否欧盟成员",
    calling_code: "电话区号",
    currency_code: "货币代码",
    continent: "大陆/洲",
    country_code: "国家代码",
    state: "省份/州",
    city: "城市",
    latitude: "纬度",
    longitude: "经度",
    zip: "邮编",
    timezone: "时区",
    local_time: "本地时间",
    local_time_unix: "本地时间Unix时间戳",
    is_dst: "是否夏令时",

    elapsed_ms: "耗时毫秒"
  };

function translateKey(path: string): string {
    const parts = path.split(".");
    const last = parts.pop()!;
    const translatedLast = keyTranslations[last] || last;
    if (parts.length === 0) {
        return translatedLast; // 只有一个字段，直接返回翻译
    } else {
        return translatedLast; // 保留路径，只翻译最后字段
    }
  }

type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];
interface JsonObject {
    [key: string]: JsonValue;
}

interface DataRow {
    key: string;
    attribute: string;
    value: string;
}

//  递归把对象转换成表格需要的数据数组，key是完整路径
function jsonToTableRows(
    obj: JsonObject,
    prefix = ""
): DataRow[] {
    let rows: DataRow[] = [];

    Object.entries(obj).forEach(([k, v]) => {
        const path = prefix ? `${prefix}.${k}` : k;

        if (v && typeof v === "object" && !Array.isArray(v)) {
            // 嵌套对象，递归展开
            rows = rows.concat(jsonToTableRows(v as JsonObject, path));
        } else {
            // 基础值，直接放入
            let displayValue = v;
            if (typeof v === "boolean") {
                displayValue = v ? "是" : "否";
            }
            rows.push({
                key: path,
                attribute: translateKey(path),
                value: String(displayValue),
            });
        }
    });

    return rows;
}

interface JsonTableProps {
    data: JsonObject;
}

const JsonTable: React.FC<JsonTableProps> = ({ data }) => {
    const dataSource = jsonToTableRows(data);

    const columns = [
        {
            title: "属性",
            dataIndex: "attribute",
            key: "attribute",
            width: "40%",
        },
        {
            title: "值",
            dataIndex: "value",
            key: "value",
            width: "60%",
        },
    ];

    return (
        <Table<DataRow>
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            rowKey="key"
            bordered
            size="small"
            style={{ width: "100%" }}
        />
    );
};

export default JsonTable;