/**
 * 这里面是要将所有需要跳转的界面都写到这里来，相当于android中的androidManifest.xml文件，所有的activity都需要进行注册一样的
 * Created by admin on 2017/6/19.
 */
import {
    StackNavigator
}from 'react-navigation'
import React,{Component} from 'react';
import VideosHome from '../component/VideosHome';
import VideosDetailScene from '../scene/VideosScene';
import ToolBar from '../component/ToolBar'
const AppNav = StackNavigator({
    // 对应界面名称
    Videos: {
        screen: VideosHome,
        navigationOptions:({navigation})=>({
            header:(
                <ToolBar
                    rightTitle = ''
                    hasClick = {false}
                    hasLeft = {false}
                    inVideosScene = {true}
                    navigation={navigation}
                />
            ),
            headerTitle:'逗逼说'
        })
    },
    Detail: {
        screen: VideosDetailScene,
        navigationOptions:(navigation)=>({
            header:(
                <ToolBar
                    inVideosScene = {true}
                    navigation={navigation}
                />
            )
        })
    },
}, {
    headerMode: 'screen',
});

export default AppNav;