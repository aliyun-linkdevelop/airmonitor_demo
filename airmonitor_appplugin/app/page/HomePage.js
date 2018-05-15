import React from 'react';
import Home from '../view/Home';
import { View } from 'react-native';
import { Navbar } from '@bone/bone-mobile-ui';

export default class HomePage extends Bone.Page {
  render() {
    const params = Bone.query;
    return <View>
      <Navbar
        titleContent='空气监测站'
      />
      <Home {...params} />
    </View>;
  }
}
