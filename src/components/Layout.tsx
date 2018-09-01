import * as React from 'react';
import { Layout } from 'antd'
import { Sidebar, Chapter } from './Sidebar';
import { WenkuUtil } from '../util/WenkuUtil';

const { Content } = Layout;

export interface WenkuLayoutProps {
    content: string
}

export interface WenkuLayoutStates {
    chapters: Chapter[];
}

export class WenkuLayout extends React.Component<WenkuLayoutProps, WenkuLayoutStates> {

    constructor(props) {
        super(props);
        this.state = {
            chapters: []
        };
        WenkuUtil.getChapters()
            .then(chapters => this.setState({ chapters }))
            .catch(err => console.error(err));
    }

    render() {
        return (
            <Layout>
                <Sidebar chapters={this.state.chapters} />
                <Content dangerouslySetInnerHTML={{ __html: this.props.content }}>
                </Content>
            </Layout>
        );
    }
}