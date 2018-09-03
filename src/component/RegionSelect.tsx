import * as React from 'react';
import { Select, Form, message } from 'antd';
import { Host } from '../entity/DataResource';
import { connectStorage } from '../util/ChromeStorageContext';
import { ApiUtil } from '../util/ApiUtil';

export interface RegionSelectProps {
    region: Host,
    setRegion: (region: Host) => void
}

class RegionSelectBase extends React.Component<RegionSelectProps> {

    getOptions = () => {
        const arr = [];
        for (const region in Host) {
            arr.push(<Select.Option key={region} value={Host[region]}>{region}</Select.Option>);
        }
        return arr;
    };

    render() {
        return <Form.Item label="Region">
            <Select showSearch
                value={this.props.region}
                style={{ width: "100%" }}
                placeholder="Please Select a Region"
                onChange={this.props.setRegion}
            >
                {this.getOptions()}
            </Select>
        </Form.Item>;
    }
}

export const RegionSelect = connectStorage((storage, items) => ({
    region: items.region,
    setRegion: (region) => {
        storage.setItems({ region })
            .then(() => {
                message.success(`Region changed successfully`);
                ApiUtil.getRealmList()
                    .then(() => {
                        storage.setItems({ realm: '' });
                        message.success('Updated Realms List!');
                    });
            });
    }
}))(RegionSelectBase);