export interface ProgressData {
    show: boolean,
    percent: number
}

export class UIData {
    progress: ProgressData = { show: false, percent: 0 }
}