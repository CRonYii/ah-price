import * as React from 'react';
import * as ReactDom from 'react-dom';
import { ItemSearch } from './component/ItemSearch';

class Popup extends React.Component {
    render() {
        return <div>
            <ItemSearch />
        </div>
    }

}
ReactDom.render(<Popup />, document.querySelector('div#root'));