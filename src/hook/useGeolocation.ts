import { useState } from 'react';
import { message } from 'antd';

type Location = {
    latitude: number;
    longitude: number;
} | null;

export function useGeolocation(options = {}) {
    const [location, setLocation] = useState<Location>(null);
    const [error, setError] = useState<string | null>(null);
    // const [address, setAddress] = useState(null);
    const [loading, setLoading] = useState(false); // 初始为 false，因为还没开始

    const openGeolocation = () => {
        // 如果已经在加载中，防止重复请求
        if (loading) return;

        if (!navigator.geolocation) {
            setError('地理信息不支持');
            message.error('地理信息不支持');
            return;
        }

        setLoading(true);
        setError(null); // 清除旧错误

        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log('获取地理位置成功:', position);
                const { latitude, longitude } = position.coords;
                setLocation({ latitude, longitude });
                setLoading(false);
                message.success('获取地理位置成功');
            },
            (error) => {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        console.log('用户拒绝了地理位置请求', error);
                        setError('用户拒绝了地理位置请求。');
                        message.error('用户拒绝了地理位置请求');
                        break;
                    case error.POSITION_UNAVAILABLE:
                        setError('无法获取当前位置。');
                        message.error('无法获取当前位置');
                        break;
                    case error.TIMEOUT:
                        setError('获取位置超时。');
                        message.error('获取位置超时');
                        break;
                    default:
                        setError('未知错误');
                        break;
                }
                setLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000,
                ...options // 合并传入的 options
            }
        );
    };

    return { mylocation: location, error, loading, openGeolocation };
}