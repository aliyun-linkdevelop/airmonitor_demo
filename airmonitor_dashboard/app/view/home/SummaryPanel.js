import React, { Component } from 'react';
import styles from "./SummaryPanel.scss";
import IotGatway from '@bone/iot-gateway';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en'
TimeAgo.locale(en);
const timeAgo = new TimeAgo('en-US');

export default class SummaryPanel extends Component {
  constructor(props) {
    super(props);
    this.state = { props: [] };
  }

  componentDidMount() {
    this.queryDeviceStatus();
    window.setInterval(() => {
      this.queryDeviceStatus();
    }, 60000);
  }

  queryDeviceStatus() {
    const { productKey, deviceName } = this.props;

    const options = {
      url: 'https://api.link.aliyun.com/thing/device/properties/query',
      apiVer: '1.1.0',
      params: {"productKey": productKey, "deviceName": deviceName }
    };
    IotGatway.post(options).then(res => {
      this.setState({ props: res.data });
    })
  }

  render() {
    return <div className={styles["panel"]}>
      <h2>{this.props.title}</h2>
      <div className={styles["content"]}>
        {
          this.state.props.map((prop) => {
            switch(prop.attribute) {
              case 'PM25Value':
              case 'PM1':
              case 'PM10':
                return <div key={prop.attribute}>
                  <img src="https://img.alicdn.com/tfs/TB1CFl1X4GYBuNjy0FnXXX5lpXa-128-128.png" width="24" height="24" />
                  <span>{prop.attribute}<br /><em>{timeAgo.format(new Date(prop.gmtModified))}</em></span>
                  <span className="value">{prop.value}μg/m³</span>
                  </div>
                break;
              case 'CurrentTemperature':
                return <div key={prop.attribute}>
                  <img src="https://img.alicdn.com/tfs/TB1xvRZXWmWBuNjy1XaXXXCbXXa-128-128.png" width="24" height="24" />
                  <span>湿度<br /><em>{timeAgo.format(new Date(prop.gmtModified))}</em></span>
                  <span className="value">{prop.value}°C</span>
                  </div>
                break;
              case 'RelativeHumidity':
                return <div key={prop.attribute}>
                  <img src="https://img.alicdn.com/tfs/TB1svVZXWmWBuNjy1XaXXXCbXXa-128-128.png" width="24" height="24" />
                  <span>湿度<br /><em>{timeAgo.format(new Date(prop.gmtModified))}</em></span>
                  <span className="value">{prop.value}%</span>
                  </div>
                break;
            }
          })
        }
      </div>
    </div>
  }
}