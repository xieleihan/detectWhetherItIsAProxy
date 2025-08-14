import { Layout } from 'antd';
import { Header, Content, Footer } from 'antd/es/layout/layout';
import '@/styles/layout/LayoutPages.scss';
import PagesHeader from '@/components/layout/PagesHeader';
import PagesContent from '@/components/layout/PagesContent';
import PagesFooter from '@/components/layout/PagesFooter';

function LayoutPages() {

    return (
        <>
            <Layout className='layout'>
                <Header>
                    <PagesHeader />
                </Header>
                <Content>
                    <PagesContent />
                </Content>
                <Footer>
                    <PagesFooter />
                </Footer>
            </Layout>
        </>
    );
}

export default LayoutPages;