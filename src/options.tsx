import * as React from 'react';
import * as ReactDom from 'react-dom';
import { ApiKeyInput } from './component/ApiKeyInput';
import { LocaleSelect } from './component/LocaleSelect';
import { RegionSelect } from './component/RegionSelect';
import { chromeStorage } from './util/ChromeStorage';
import { ChromeStorageProvider, ChromeStorageProviderProps, connectStorage } from './util/ChromeStorageContext';
import { RealmSelect } from './component/RealmSelect';

export interface OptionsProps {
    realms?: any
}

class Options extends React.Component<OptionsProps> {

    render() {
        return <div>
            <ApiKeyInput />
            <LocaleSelect />
            <RegionSelect />
            <RealmSelect />
        </div>
    }

}

ReactDom.render(
    <ChromeStorageProvider storage={chromeStorage}>
        <Options />
    </ChromeStorageProvider>,
    document.querySelector('div#root')
);