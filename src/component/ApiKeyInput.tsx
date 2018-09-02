import * as React from 'react';
import { Input, message, Form } from 'antd';
import { ApiUtil } from '../util/ApiUtil';
import { connectStorage } from "../util/ChromeStorageContext";

export interface ApiKeyInputProps  {
    apiKey: string,
    onApiKeySubmit: (apiKey) => void
}

export class ApiKeyInputBase extends React.Component<ApiKeyInputProps> {

    render() {
        return <Form.Item label="Api Key">
            <Input.Search placeholder="Enter Blizzard api key"
                defaultValue={this.props.apiKey}
                enterButton="Submit"
                size="large"
                onSearch={this.props.onApiKeySubmit} />
        </Form.Item>
    }

}

export const ApiKeyInput = connectStorage((storage, items) => ({
    apiKey: items.apiKey,
    onApiKeySubmit: (newApiKey) => {
        const oldKey = items.apiKey;
        storage.setItems({ apiKey: newApiKey });
        ApiUtil.getRealmList()
            .then(() => {
                message.success('Your key is saved successfully');
            }, (err) => {
                console.error(err);
                message.error('Invalid Api key otherwise an unknown error occured. ');
                chrome.storage.sync.set({ oldKey });
            });
    }
}))(ApiKeyInputBase);