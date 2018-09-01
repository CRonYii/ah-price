import { Chapter } from "../components/Sidebar";

export class WenkuUtil {

    static getHtmlParser = (link: string) => {
        return fetch(link)
            .then(res => res.blob())
            .then(blob => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (e: any) => {
                        resolve(e.target.result);
                    };
                    reader.readAsText(blob, 'gbk');
                })
            })
            .then(html => {
                const parser = new DOMParser();
                return parser.parseFromString(html as string, "text/html");
            });
    }
    static getChapters = () => {
        return WenkuUtil.getHtmlParser(WenkuUtil.getLink())
            .then(parser => {
                const chapters: Chapter[] = [];
                let chap = {
                    name: '',
                    sections: []
                };
                parser.querySelectorAll('td').forEach(td => {
                    if (td.className == 'vcss') {
                        if (chap.sections.length !== 0) {
                            chapters.push(chap);
                            chap = {
                                name: '',
                                sections: []
                            };
                        }
                        chap.name = td.innerText
                    } else if (td.className == 'ccss') {
                        if (!td.querySelector('a'))
                            return;
                        chap.sections.push({
                            name: td.innerText,
                            link: td.querySelector('a').href
                        });
                    }
                });
                return chapters;
            });
    }

    static getLink = () => {
        const link = window.location.href;
        const lastIndex = link.lastIndexOf('/');
        return link.substring(0, lastIndex + 1);
    }

    static getSectionLink = () => {
        const link = window.location.href;
        const lastIndex = link.lastIndexOf('/');
        return link.substring(lastIndex + 1);
    }

}