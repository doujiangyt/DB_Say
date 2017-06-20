/**
 * Created by admin on 2017/6/19.
 */
import React,{Component} from 'react';
import {
    Image,
    StyleSheet,
}from 'react-native'
import {
    TabNavigator,
}from 'react-navigation';
import VideosScene from '../scene/VideosScene';
import DubScene from '../scene/DubScene';
import AccountScene from '../scene/AccountScene';
let videoIcon = require('../img/video.png')
let videoPressedIcon = require('../img/video_pressed.png')
let plusIcon = require('../img/plus.png')
let plusPressedIcon = require('../img/plus_pressed.png')
let moreIcon = require('../img/more.png')
let morePressedIcon = require('../img/more_pressed.png')
const VideosHome = TabNavigator({
    Videos: {
        screen: VideosScene,
        navigationOptions: {
            tabBarIcon: ({focused, tintColor}) => (
                <Image
                    source={focused ? videoPressedIcon : videoIcon}
                    style = {[styles.imageIcon,{width:26,height:26}]}
                />
            ),
        },
    },
    Dub:{
        screen:DubScene,
        navigationOptions:{
            tabBarIcon:({focused,tintColor})=>(
                <Image
                    source={focused ? plusPressedIcon : plusIcon}
                    style = {[styles.imageIcon,{width:26,height:26}]}
                />
            )
        }
    },
    Account:{
        screen:AccountScene,
        navigationOptions:{
            tabBarIcon:({focused,tintColor})=>(
                <Image
                    source={focused ? morePressedIcon : moreIcon}
                    style = {[styles.imageIcon,{width:26,height:26}]}
                />
            )
        }
    }
}, {
    lazy: true,
    initialRouteName: 'Videos',
    tabBarPosition: 'bottom',//tabbar放在底部
    swipeEnabled: false,//不能滑动切换
    animationEnabled: false,//不要切换动画
    tabBarOptions: {
        style: {
            height: 50,
            borderTopWidth: 0.5,
            borderColor: '#dddddd',
            backgroundColor: '#FFFFFF',
        },
        showLabel: false,//不显示文字
        showIcon: true,//显示icon
        indicatorStyle: {
            height: 0,
        },
    }
});
let styles = StyleSheet.create({
    imageIcon:{
        resizeMode:'cover',
    }
})

export default VideosHome;
