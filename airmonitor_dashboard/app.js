// 导入框架 构建成包后，直接安装引用
import Bone from '@bone/bone-web-sdk';
// 导入页面
import HomePage from './app/page/home';
import NotFound from './app/view/not-found';

// 函数式初始化
const app = Bone.createApp({
    id: "#__YOUR_WEB_APP_ID__",
    type: "app",
    // 是否自动启动
    autoStart: true,
    page: {
        // 路由配置
        routes: [
            {
                path: "/",
                namespace: "home",
                classes: HomePage
            },
            // 配置404页面
            {
                path: "*",
                classes: NotFound
            }
        ]
    }
});
