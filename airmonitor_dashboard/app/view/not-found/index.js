import React, { Component } from 'react';
import { Button } from '@bone/bone-web-ui';
import styles from './index.scss';

export default class NotFound extends Component {
    render() {
        return (
            <div className={styles['not-found']}>
                <div className={styles['not-found-img']} style={{backgroundImage: "url('https://img.alicdn.com/tfs/TB1kpZDfY_I8KJjy1XaXXbsxpXa-284-208.png')"}}></div>
                <p> 你要找的页面不存在 </p>
                <Button type="primary" component="a" href="/">
                    返回首页
                </Button>
            </div>
        );
    }
}