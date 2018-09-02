import * as React from 'react';
import { Select, Form, message } from 'antd';
import { ApiLocale } from '../entity/DataResource';
import { connectStorage } from '../util/ChromeStorageContext';

export interface LocaleSelectProps {
    locale: ApiLocale,
    setLocale: (locale) => void
}

export class LocaleSelectBase extends React.Component<LocaleSelectProps> {

    getOptions = () => {
        const arr = [];
        for (const locale in ApiLocale) {
            arr.push(<Select.Option key={locale} value={ApiLocale[locale]}>{locale}</Select.Option>);
        }
        return arr;
    };

    render() {
        return <Form.Item label="Language">
            <Select showSearch
                value={this.props.locale}
                style={{ width: "100%" }}
                placeholder="Please Select a Language"
                onChange={this.props.setLocale}
            >
                {this.getOptions()}
            </Select>
        </Form.Item>;
    }
}

export const LocaleSelect = connectStorage((storage, items) => ({
    locale: items.locale,
    setLocale: (locale) => {
        storage.setItems({ locale })
            .then(() => {
                message.success(`Language changed successfully`);
            });
    }
}))(LocaleSelectBase);