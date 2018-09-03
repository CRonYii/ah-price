import { Progress } from 'antd';
import { connectStorage } from '../util/ChromeStorageContext';

const calculateDisplay = (progress: number) => {
    if (progress === 0) {
        return { display: "none" };
    } else {
        return {};
    }
}

export const TaskProgress = connectStorage((storage, items) => ({
    percent: items.uiData.progress.percent,
    style: calculateDisplay(items.uiData.progress.percent)
}))(Progress);