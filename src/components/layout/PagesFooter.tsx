import { useState, useEffect } from 'react';
import '@/styles/layout/Modules/PagesFooter.scss';

// 假设你在 .env 中定义了：VITE_CREATION_TIME="2025-01-01T00:00:00+08:00"
const CREATION_TIME =  '2025-08-08T18:00:00+08:00';

function PagesFooter() {
    const [time, setTime] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    const [voyager, setVoyager] = useState({
        distance: 0, // 千米
        au: 0,       // 天文单位
    });

    useEffect(() => {
        const startTime = new Date(CREATION_TIME).getTime();

        const timer = setInterval(() => {
            const now = Date.now();
            const runTimeSeconds = Math.floor((now - startTime) / 1000);

            // 更新运行时间
            setTime({
                days: Math.floor(runTimeSeconds / (60 * 60 * 24)),
                hours: Math.floor((runTimeSeconds / (60 * 60)) % 24),
                minutes: Math.floor((runTimeSeconds / 60) % 60),
                seconds: Math.floor(runTimeSeconds % 60),
            });

            // 计算旅行者一号距离（模拟增长）
            // 初始距离 23,400,000,000 km，每秒增加约 17 km（约 3.6 AU/年）
            const baseDistance = 23400000000;
            const speedKmPerSecond = 17;
            const distance = baseDistance + runTimeSeconds * speedKmPerSecond;
            const au = distance / 149600000; // 1 AU ≈ 149,600,000 km

            setVoyager({
                distance: Math.round(distance),
                au: parseFloat(au.toFixed(6)),
            });
        }, 1000);

        // 清理定时器
        return () => {
            if (timer) {
                clearInterval(timer);
            }
        };
    }, []);

    return (
        <div className="footer">
            <div className="left">
                <div className="copyright">
                    Copyright© 2025 SouthAki, All Rights Reserved.
                </div>
                <div className="icp">
                    ICP备20231229号 | 网盾星球,提供CDN支持
                </div>
            </div>
            <div className="right">
                <p>
                    本站已经安全运行：{time.days}天{time.hours}时{time.minutes}分{time.seconds}秒
                </p>
                <p>
                    现在旅行者一号距离地球{voyager.distance.toLocaleString()}千米，约为{voyager.au}个天文单位🚀
                </p>
            </div>
        </div>
    );
}

export default PagesFooter;