import React, { Component } from 'react';
import SummaryPanel from './SummaryPanel';
import HistoryPanel from './HistoryPanel'
import styles from "./index.scss";

const summaryPanels = [
    { 'title': '客厅', 'productKey': '__YOUR_DEVICE_PRODUCT_KEY__', 'deviceName': '__YOUR_DEVICE_NAME__' },
    { 'title': '主卧', 'productKey': '__YOUR_DEVICE_PRODUCT_KEY__', 'deviceName': '__YOUR_DEVICE_NAME__' },
    { 'title': '次卧', 'productKey': '__YOUR_DEVICE_PRODUCT_KEY__', 'deviceName': '__YOUR_DEVICE_NAME__' },
];

const historyPanels = [
    { 'title': '客厅 PM2.5 历史', 'productKey': '__YOUR_DEVICE_PRODUCT_KEY__', 'deviceName': '__YOUR_DEVICE_NAME__', 'showProp': 'PM25Value' },
    { 'title': '客厅 PM1.0 历史', 'productKey': '__YOUR_DEVICE_PRODUCT_KEY__', 'deviceName': '__YOUR_DEVICE_NAME__', 'showProp': 'PM1' },
    { 'title': '客厅 PM10 历史', 'productKey': '__YOUR_DEVICE_PRODUCT_KEY__', 'deviceName': '__YOUR_DEVICE_NAME__', 'showProp': 'PM10' },
]

export default class Home extends Component {
    render() {
        return <div className={styles["container"]}>
            <div className={styles['left']}>
            {
                summaryPanels.map(p => <SummaryPanel key={p.title} {...p} />)
            }
            </div>
            <div className={styles['right']}>
            {
                historyPanels.map(p => <HistoryPanel key={p.title} {...p} />)
            }
            </div>
        </div>
    }
}
