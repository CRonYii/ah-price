import * as React from 'react';
import * as ReactDom from 'react-dom';
import { ApiKeyInput } from './component/ApiKeyInput';
import { LocaleSelect } from './component/LocaleSelect';
import { RegionSelect } from './component/RegionSelect';
import { chromeStorage } from './util/ChromeStorage';
import { ChromeStorageProvider, ChromeStorageProviderProps, connectStorage } from './util/ChromeStorageContext';
import { RealmSelect } from './component/RealmSelect';
import { Button, message } from "antd";
import { ApiUtil } from "./util/ApiUtil";
import { TaskProgress } from './component/TaskProgress';
import { ExtensionDatabase } from './db/ExtensionDatabase';

export interface OptionsProps {
    clearStorage: () => void
}

class Options extends React.Component<OptionsProps> {

    scanAuction = () => ApiUtil.getAuction()
        .then((updated) => updated ?
            message.success('Auction scanned finished!') :
            message.info('Auction data is already up to date.'));

    render() {
        return <div>
            <ApiKeyInput />
            <LocaleSelect />
            <RegionSelect />
            <RealmSelect />
            <Button type="primary" onClick={this.scanAuction}>Scan Auction</Button>
            <Button type="danger" onClick={this.props.clearStorage}>Clear Storage</Button>
            <TaskProgress />
        </div>
    }

}

export const OptionsPage = connectStorage((storage) => ({
    clearStorage: () => {
        storage.clearAllStorage()
            .then(() => {
                window.location.reload();
            });
    }
}))(Options);

ReactDom.render(
    <ChromeStorageProvider storage={chromeStorage}>
        <OptionsPage />
    </ChromeStorageProvider>,
    document.querySelector('div#root')
);