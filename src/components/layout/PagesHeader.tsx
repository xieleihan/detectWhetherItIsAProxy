import '@/styles/layout/Modules/PagesHeader.scss';
import github from '@/assets/icon/github.svg';
import { Popover } from 'antd';

const content = (
    <>
        点击访问项目
    </>
)

function PagesHeader() {
    return (
        <>
            <div className="header">
                <div className='titleAndDesc'>
                    <h1 className='title'>VPN代理检测<span className='desc'> --检测当前IP是否高风险</span></h1>
                </div>
                <div className="functionBox">
                    <Popover content={content}>
                        <a className='superlink' href="https://github.com/xieleihan/detectWhetherItIsAProxy">
                            <img src={github} alt="github" className='github' loading='lazy' />
                        </a>
                    </Popover>
                </div>
            </div>
        </>
    );
}

export default PagesHeader;