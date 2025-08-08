import { getOut } from './index';

export const getIpInfo = (params: Record<string, unknown> = {}) => { 
    return getOut('https://proxy.incolumitas.com/',params);
}