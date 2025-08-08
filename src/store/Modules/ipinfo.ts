import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// 定义company子对象类型
interface Company {
    name: string;
    abuser_score: string;
    domain: string;
    type: string;
    network: string;
    whois: string;
}

// abuse子对象类型
interface Abuse {
    name: string;
    address: string;
    email: string;
    phone: string;
}

// asn子对象类型
interface Asn {
    asn: number;
    abuser_score: string;
    route: string;
    descr: string;
    country: string;
    active: boolean;
    org: string;
    domain: string;
    abuse: string;
    type: string;
    updated: string;
    rir: string;
    whois: string;
}

// location子对象类型
interface Location {
    is_eu_member: boolean;
    calling_code: string;
    currency_code: string;
    continent: string;
    country: string;
    country_code: string;
    state: string;
    city: string;
    latitude: number;
    longitude: number;
    zip: string;
    timezone: string;
    local_time: string;
    local_time_unix: number;
    is_dst: boolean;
}

// 定义整个state类型
interface IpinfoState {
    ip: string;
    rir: string;
    is_bogon: boolean;
    is_mobile: boolean;
    is_satellite: boolean;
    is_crawler: boolean;
    is_datacenter: boolean;
    is_tor: boolean;
    is_proxy: boolean;
    is_vpn: boolean;
    is_abuser: boolean;
    company: Company;
    abuse: Abuse;
    asn: Asn;
    location: Location;
    elapsed_ms: number;
}

// 初始化State，示例数据用空或者合理默认值
const initialState: IpinfoState = {
    ip: '',
    rir: '',
    is_bogon: false,
    is_mobile: false,
    is_satellite: false,
    is_crawler: false,
    is_datacenter: false,
    is_tor: false,
    is_proxy: false,
    is_vpn: false,
    is_abuser: false,
    company: {
        name: '',
        abuser_score: '',
        domain: '',
        type: '',
        network: '',
        whois: '',
    },
    abuse: {
        name: '',
        address: '',
        email: '',
        phone: '',
    },
    asn: {
        asn: 0,
        abuser_score: '',
        route: '',
        descr: '',
        country: '',
        active: false,
        org: '',
        domain: '',
        abuse: '',
        type: '',
        updated: '',
        rir: '',
        whois: '',
    },
    location: {
        is_eu_member: false,
        calling_code: '',
        currency_code: '',
        continent: '',
        country: '',
        country_code: '',
        state: '',
        city: '',
        latitude: 0,
        longitude: 0,
        zip: '',
        timezone: '',
        local_time: '',
        local_time_unix: 0,
        is_dst: false,
    },
    elapsed_ms: 0,
};

const ipInfoSlice = createSlice({
    name: 'ipInfo',
    initialState,
    reducers: {
        setIpInfo(state, action: PayloadAction<Partial<IpinfoState>>) {
            Object.assign(state, action.payload);
          },
        updateIp(state, action: PayloadAction<string>) {
            state.ip = action.payload; // Immer 自动处理不可变性
        },
        updateCompany(state, action: PayloadAction<Company>) {
            state.company = action.payload;
        },
        updateLocation(state, action: PayloadAction<Location>) {
            state.location = action.payload;
        },
      },
});

export const { setIpInfo, updateIp, updateCompany } = ipInfoSlice.actions;

export default ipInfoSlice.reducer;