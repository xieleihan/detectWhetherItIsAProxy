import { StrictMode,Suspense,lazy } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
const App = lazy(() => import('./App'));
// 导入Store
import store from "./store/index";
import { Provider } from "react-redux";
import { Spin } from "antd";

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <StrictMode>
      <Suspense fallback={<Spin size="large" />}>
        <App />
      </Suspense>
    </StrictMode>
  </Provider>,
)
