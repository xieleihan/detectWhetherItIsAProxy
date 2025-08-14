import { useEffect } from "react";

// 声明 window.adsbygoogle 类型
declare global {
    interface Window {
        adsbygoogle?: unknown[];
    }
}

interface GoogleAdProps {
    slot: string; // 广告单元ID
}

export default function GoogleAd({ slot }: GoogleAdProps) {
    useEffect(() => {
        try {
            if (process.env.NODE_ENV === 'production') {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            }
        } catch (e) {
            console.error("AdSense error", e);
        }
    }, []);

    return (
        <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client="ca-pub-2212558447659235"
            data-ad-slot={slot}
            data-ad-format="auto"
            data-full-width-responsive="true"
        ></ins>
    );
}