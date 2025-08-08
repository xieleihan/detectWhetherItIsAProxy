import '@/styles/layout/Modules/PagesContent.scss';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/index';
import JsonTable from '../JsonTable';
import { Button } from 'antd';
import { useState } from 'react';
import ListCom from '../ListCom';

function PagesContent() {
    // 获取Redux中的ipinfo状态
    const ipinfo = useSelector((state: RootState) => state.ipinfo);
    const [isOpenInfo, setIsOpenInfo] = useState(false);
    
    const handleToggleInfo = () => {
        setIsOpenInfo(!isOpenInfo);
    }

    return (
        <>
            <div className="container">
                <p>代理检测</p>

                <ListCom />

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