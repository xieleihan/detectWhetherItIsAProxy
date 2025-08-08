import { configureStore } from '@reduxjs/toolkit';
// 导入ipinfo.ts文件
import ipinfoStore from './Modules/ipinfo.ts';

// 创建store
const store = configureStore({
    reducer: {
        ipinfo: ipinfoStore,
    }
})

// 定义RootState和AppDispatch类型
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;