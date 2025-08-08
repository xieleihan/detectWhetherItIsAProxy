import { useEffect } from 'react'
import '@/App.scss'
import { getIpInfo } from '@/api/request';
import LayoutPages from '@/layout/LayoutPage';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/store/index';
import { setIpInfo } from '@/store/Modules/ipinfo';

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

function App() {
  // 初始化Redux
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    getIpInfo({}).then(async (response) => {
      const res: IpinfoState = response.data;
      console.log('res:', res);
      dispatch(setIpInfo(res));
    }).catch((err: unknown) => {
      console.error('err:', err);
    });
  }, []);

  return (
    <>
      <div className='app'>
        <LayoutPages />
      </div>
    </>
  )
}

export default App
