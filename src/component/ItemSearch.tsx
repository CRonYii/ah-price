import * as React from 'react';
import { Input } from 'antd';

export class ItemSearch extends React.Component {

    onItemSerch = (id) => {
        window.open(`https://theunderminejournal.com/#us/illidan/item/${id}`);
    }

    render() {
        return <Input.Search placeholder="Enter Item ID"
                enterButton="Search"
                size="large"
                type="number"
                onSearch={this.onItemSerch} />
    }

}