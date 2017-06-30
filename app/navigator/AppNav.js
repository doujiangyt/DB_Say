/**
 * 这里面是要将所有需要跳转的界面都写到这里来，相当于android中的androidManifest.xml文件，所有的activity都需要进行注册一样的
 * Created by admin on 2017/6/19.
 */
import {
    StackNavigator
}from 'react-navigation'
import React from 'react';
import VideosHome from '../component/VideosHome';
import ToolBar from '../component/ToolBar'
import DetailScene from '../scene/DetailScene'
import VideosScene from '../scene/VideosScene'
import AccountScene from '../scene/AccountScene'
import SplashScene from '../scene/SplashScene'
const AppNav = StackNavigator({
    SplashPage:{
      screen:SplashScene,
    },
    // 对应界面名称
    VideosPage: {
        screen: VideosHome,
    },
    DetailPage:{
        screen:DetailScene,
        navigationOptions:({navigation})=>({
            header:(
                <ToolBar
                    title = '逗逼秀'
                    rightTitle = '返回'
                    hasLeft = {true}
                    navigation={navigation}
                />
            )
        })
    },
}, {
    headerMode:'screen',
    initialRouteName:'SplashPage',
});

export default AppNav;