import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { WenkuLayout } from './components/Layout'

export class InitData {
    static title: string = (document.body.querySelector('#title') as HTMLElement).innerText;
};

const originalBody = document.body.innerHTML;
document.body.innerHTML = '';

const root: HTMLElement = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);

ReactDOM.render(<WenkuLayout content={originalBody} />, root);

console.log('Content Script Loaded!');