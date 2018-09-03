import { Input } from 'antd';
import * as React from 'react';
import { extensionDatabase } from '../db/ExtensionDatabase';

export class ItemSearch extends React.Component {

    onItemSerch = (id) => {
        extensionDatabase.auctionStore.getItemsById(parseInt(id))
            .then(console.log);
    };

    render() {
        return <Input.Search placeholder="Enter Item ID"
            enterButton="Search"
            size="large"
            type="number"
            onSearch={this.onItemSerch} />
    }

}