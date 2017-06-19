/**
 * Created by admin on 2017/6/19.
 */
import React,{Component} from 'react';

import {
    TabNavigator,
}from 'react-navigation';
import VideosScene from '../scene/VideosScene';
import DubScene from '../scene/DubScene';
import AccountScene from '../scene/AccountScene';
import Icon from 'react-native-vector-icons/FontAwesome';




const VideosHome = TabNavigator({
    Videos: {
        screen: VideosScene,
        navigationOptions: {
            tabBarIcon: ({focused, tintColor}) => (
                <Icon
                    name='ios-videocam-outline'
                    color={focused ? '#ff8857' : '#ffffff'}
                />
            ),
        },
    },
    Dub:{
        screen:DubScene,
        navigationOptions:{
            tabBarIcon:({focused,tintColor})=>(
                <Icon
                    name='ios-plus-outline'
                    color={focused ? '#ff8857' : '#ffffff'}

                />
            )
        }
    },
    Account:{
        screen:AccountScene,
        navigationOptions:{
            tabBarIcon:({focused,tintColor})=>(
                <Icon
                    name='ios-plus-outline'
                    color={focused ? '#ff8857' : '#ffffff'}
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
            borderColor: '#DDDDDD',
            backgroundColor: '#FFFFFF',
        },
        showLabel: false,//不显示文字
        showIcon: true,//显示icon
        indicatorStyle: {
            height: 0,
        },
    }
});

export default VideosHome;
