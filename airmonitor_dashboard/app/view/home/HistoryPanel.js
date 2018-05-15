import React, { Component } from 'react';
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
HighchartsMore(Highcharts);
import styles from "./HistoryPanel.scss";
import IotGatway from '@bone/iot-gateway';

export default class HistoryPanel extends Component {
  componentDidMount() {
    this.createChart();
    this.queryStatusHistory();
    window.setInterval(() => {
      this.queryStatusHistory();
    }, 60000);
  }
  
  queryStatusHistory() {
    const { productKey, deviceName, showProp } = this.props;

    const options = {
      url: 'https://api.link.aliyun.com/thing/device/property/timeline/get',
      apiVer: '1.1.0',
      params: {
        "productKey": productKey,
        "deviceName": deviceName,
        "propertyIdentifier": showProp || "PM25Value",
        "start": new Date()*1-3600*24*1000,
        "end": new Date()*1,
        "pageSize": 1000,
        "ordered": true
      }
    };
    IotGatway.post(options).then(res => {
      const data = res.data.items.map(item => [item.timestamp, item.data]);
      this.chart.series[0].setData(data);
    })
  }

  createChart() {
    this.chart = Highcharts.chart(this.chartEl, {
      chart: {
        zoomType: 'x'
      },
      title: {
        text: ''
      },
      xAxis: {
        type: 'datetime'
      },
      yAxis: {
        title: {
          text: 'μg/m³'
        },
        min: 0
      },
      legend: {
        enabled: false
      },
      time: {
        useUTC: false,
      },
      plotOptions: {
        area: {
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1
            },
            stops: [
              [0, Highcharts.getOptions().colors[0]],
              [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
            ]
          },
          marker: {
            radius: 2
          },
          lineWidth: 1,
          states: {
            hover: {
              lineWidth: 1
            }
          },
          threshold: null
        }
      },

      series: [{
        type: 'area',
        name: 'PM2.5',
        data: []
      }]
    });
  }

  render() {
    return <div className={styles["panel"]}>
      <h2>{this.props.title}</h2>
      <div className={styles["chart"]} ref={el => { this.chartEl = el }}></div>
    </div>
  }
}