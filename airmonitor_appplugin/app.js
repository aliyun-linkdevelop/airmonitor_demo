import Bone from '@bone/bone-mobile';
import HomePage from './app/page/HomePage';

const app = Bone.createApp({
  appName: 'bone-demo',
  router: {
    routes: [
      {
        path: '/',
        page: HomePage,
        initialProps: {
          title: 'Home',
        }
      }
    ]
  }
});

app.start();
