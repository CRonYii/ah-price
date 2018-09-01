import { Layout, Menu } from 'antd';
import * as React from 'react';
import { WenkuUtil } from '../util/WenkuUtil';

const { Sider } = Layout;

export interface Chapter {
    name: string,
    sections: Section[]
}

export interface Section {
    name: string,
    link: string
}

interface Props {
    chapters: Chapter[]
}

export class Sidebar extends React.Component<Props> {

    getCurrentChapter = () => {
        const link = WenkuUtil.getSectionLink();
        const chap = this.props.chapters.filter(chapter => {
            return chapter.sections.filter(section => section.link.indexOf(link) > 0).length > 0;
        });
        return chap.length === 1 ? chap[0].name : '';
    }

    getCurrentSection = () => {
        const link = WenkuUtil.getSectionLink();
        for (let i = 0; i < this.props.chapters.length; i++) {
            const chapter = this.props.chapters[i];
            const section = chapter.sections.filter(section => section.link.indexOf(link) > 0);
            if (section.length === 1)
                return section[0].name;
        }
        return '';
    }

    render() {
        return (
            <Sider
                theme='light'
                collapsible>
                <Menu
                    mode="inline"
                    defaultSelectedKeys={[this.getCurrentSection()]}
                    defaultOpenKeys={[this.getCurrentChapter()]}>
                    {
                        this.props.chapters.map((chapter: Chapter, index) => {
                            return <Menu.SubMenu key={`chap-${index}`} title={chapter.name}>
                                {chapter.sections.map((section: Section, index) => {
                                    return <Menu.Item key={`sec-${index}`} onClick={() => window.location.href = section.link}>
                                        {section.name}
                                    </Menu.Item>
                                })}
                            </Menu.SubMenu>
                        })
                    }
                </Menu>
            </Sider>
        );
    }
}