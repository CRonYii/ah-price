import * as React from 'react';
import { Input, message, Form } from 'antd';
import { ApiUtil } from '../util/ApiUtil';

export interface ApiKeyInputStates {
    apiKey: string
};

export class ApiKeyInput extends React.Component<{}, ApiKeyInputStates> {

    constructor(props) {
        super(props);
        this.state = { apiKey: "" };
        chrome.storage.sync.get({ apiKey: "" }, ({ apiKey }) => {
            this.setState({ apiKey });
        });
    }

    onApiKeySubmit = (newApiKey) => {
        chrome.storage.sync.get({ apiKey: "" }, ({ apiKey }) => {
            chrome.storage.sync.set({ apiKey: newApiKey }, () => {
                ApiUtil.getRealmList()
                    .then(() => {
                        message.success('Your key is saved succesfully');
                    }, (err) => {
                        message.error('Invalid Api key otherwise an unknown error occured. ');
                        chrome.storage.sync.set({ apiKey });
                    });
            });
        });
    }

    render() {
        return <Form.Item label="Api Key">
            <Input.Search placeholder="Enter Blizzard api key"
                onChange={(event) => this.setState({ apiKey: event.target.value })}
                value={this.state.apiKey}
                enterButton="Submit"
                size="large"
                onSearch={this.onApiKeySubmit} />
        </Form.Item>
    }

}