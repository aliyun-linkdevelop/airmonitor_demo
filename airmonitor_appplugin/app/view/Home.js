import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button, DataPanel } from '@bone/bone-mobile-ui';
import { APIGateway } from '@bone/sdk-base';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { PM10: 10, PM25Value: 12, CurrentTemperate: 25, RelativeHumidity: 50 };
  }

  componentDidMount() {
    this.queryData();
    setInterval(this.queryData.bind(this), 60000);
  }

  queryData() {
    const path = '/thing/device/properties/query';
    const options = {
        protocol: 'https',
        gateway: 'api.link.aliyun.com',
        version: '1.1.0',
        data: {
          "productKey": this.props.ProductKey || '',
          "deviceName": this.props.DeviceName || ''
        }
    }
    APIGateway.request(path, options).then((res) => {
      let data = res.data.reduce((o, v) => {
        o[v.attribute] = v.value;
        return o;
      }, {})
      this.setState({ ...data });
    });
  }

  render() {
    const { PM10, PM25Value, CurrentTemperate, RelativeHumidity } = this.state;

    return (
          <DataPanel
            themeColor='green'
            title='空气质量'
            defaultMainData={{
              value: 0,
              unit: 'μg/m³',
              controllable: false,
              desc: `空气 PM2.5 浓度`,
              descOutstanding: true,
            }}
            disabled={false}
            defaultStatusData={[
              {
                value: 0,
                unit: 'μg/m³',
                desc: 'PM10',
              },
              {
                value: 0,
                unit: '℃',
                desc: '温度',
              },
              {
                value: 0,
                unit: '%',
                desc: '湿度',
              },
            ]}
            mainValue={PM25Value}
            statusValue={[PM10, CurrentTemperate, RelativeHumidity ]}
          />
    );
  }
}

const styles = StyleSheet.create({
  home: {
    flex: 1,
    justifyContent: 'center'
  }
});
