import { Form, message, Select } from 'antd';
import * as React from 'react';
import { connectStorage } from '../util/ChromeStorageContext';
import { ChromeStorage } from "../util/ChromeStorage";

export interface Realm {
    name: string,
    value: string
}

export interface RealmSelectProps {
    realm: string,
    setRealm: (realm) => void,
    realms: Array<Realm>
}

export class RealmSelectBase extends React.Component<RealmSelectProps> {

    getOptions = () => {
        return this.props.realms.map(realm => <Select.Option key={realm.value} value={realm.value}>{realm.name}</Select.Option>)
    };

    render() {
        return <Form.Item label="Realm">
            <Select showSearch
                value={this.props.realm}
                style={{ width: "100%" }}
                placeholder="Please Select a Realm"
                onChange={this.props.setRealm}
            >
                {this.getOptions()}
            </Select>
        </Form.Item>;
    }
}

export const RealmSelect = connectStorage((storage, items) => ({
    realm: items.realm,
    realms: items.realms,
    setRealm: (realm) => {
        storage.setItems({ realm })
            .then(() => {
                message.success(`Realm changed successfully`);
            });
    }
}))(RealmSelectBase);