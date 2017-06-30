/**
 * Created by Administrator on 2017/6/3.
 */
import React,{Component} from 'react';

import TabNavigator from 'react-native-tab-navigator';

import {Navigator} from 'react-native-deprecated-custom-components';
import {

    Image,
    View,
    StyleSheet
} from 'react-native';

import VideosScene from '../scene/VideosScene';
import DubScene from '../scene/DubScene';
import AccountScene from '../scene/AccountScene';
import ToolBar from "../component/ToolBar";

let videoIcon = require('../img/video.png')
let videoPressedIcon = require('../img/video_pressed.png')
let plusIcon = require('../img/plus.png')
let plusPressedIcon = require('../img/plus_pressed.png')
let moreIcon = require('../img/more.png')
let morePressedIcon = require('../img/more_pressed.png')

//底部导航
export default class CustomTabNavigator extends Component {
    constructor(props) {
        super(props);
        this.state={
            selectedTab:'VideosScene'
            //默认选择的界面
        }

    }

    //渲染listView组件
    render() {
        return (
            <TabNavigator tabBarStyle={styles.tabNavigator}>
                {this.renderTabBarItem('逗逼说','',false,false,videoIcon,videoPressedIcon,'VideosScene','VideosScene',VideosScene)}
                {this.renderTabBarItem('','',false,false,plusIcon,plusPressedIcon,'DubScene','DubScene',DubScene)}
                {this.renderTabBarItem('','',false,false,moreIcon,morePressedIcon,'AccountScene','AccountScene',AccountScene)}
                {/*<TabNavigator.Item
                    selected={this.state.selectedTab === '推荐电影'}
                    title="推荐电影"
                    selectedTitleStyle={{color:'white', alignSelf:'center'}}
                    titleStyle={{color:'rgba(255,255,255,0.3)'}}
                    renderIcon={() => <Image source={require('./image/ios7-star-outline.png')} style={styles.unPressIconColors }/>}
                    renderSelectedIcon={() =><Image source={require('./image/ios7-star.png')} style={styles.pressIconColors}/>}
                    //badgeText="1"
                    onPress={() => this.setState({ selectedTab: '推荐电影' })}>
                    <Featured/>
                </TabNavigator.Item>
                <TabNavigator.Item
                    selected={this.state.selectedTab === '北美票房'}
                    title="北美票房"
                    selectedTitleStyle={{color:'white'}}
                    titleStyle={{color:'rgba(255,255,255,0.3)'}}
                    renderIcon={() =><Image source={require('./image/hot_unpressed.png')} style={styles.unPressIconColors}/>}
                    renderSelectedIcon={() => <Image source={require('./image/hot_pressed.png')} style={styles.pressIconColors}/>}
                    //renderBadge={() => <USBox />}
                    onPress={() => this.setState({ selectedTab: '北美票房' })}>

                    <Hot/>
                </TabNavigator.Item>
                <TabNavigator.Item
                    selected={this.state.selectedTab === '搜索'}
                    title="搜索"
                    selectedTitleStyle={{color:'white'}}
                    titleStyle={{color:'rgba(255,255,255,0.3)'}}
                    renderIcon={() =><Image source={require('./image/ios7-search.png')} style={styles.unPressIconColors}/>}
                    renderSelectedIcon={() => <Image source={require('./image/ios7-search-strong.png')} style={styles.pressIconColors}/>}
                    //renderBadge={() => <USBox />}
                    onPress={() => this.setState({ selectedTab: '搜索' })}>

                    <Search/>
                </TabNavigator.Item>
                <TabNavigator.Item
                    selected={this.state.selectedTab === '我的'}
                    title="我的"
                    selectedTitleStyle={{color:'white'}}
                    titleStyle={{color:'rgba(255,255,255,0.3)'}}
                    renderIcon={() =><Image source={require('./image/ios7-person.png')} style={styles.unPressIconColors}/>}
                    renderSelectedIcon={() => <Image source={require('./image/ios7-person-outline.png')} style={styles.pressIconColors}/>}
                    //renderBadge={() => <USBox />}
                    onPress={() => this.setState({ selectedTab: '我的' })}>

                    <MyView/>
                </TabNavigator.Item>*/}
            </TabNavigator>

        );
    }
        renderTabBarItem(title,rightTitle,hasLeft,hasRight,icon,selectedIcon,selectedTab,componentName,component,badgeText){           //这是对TabNavigator.Item做了一个抽取。
        return(
        <TabNavigator.Item
            selected={this.state.selectedTab===selectedTab}
            title={title}
            //titleStyle={{color:'white'}}
            //selectedTitleStyle={styles.selectedTitleStyle} //tabBarItem选中的文字样式
            renderIcon={()=>
                <Image source={icon} style={styles.imageIcon}/>
            }
            renderSelectedIcon={()=>
                <Image source={selectedIcon} style={styles.imageIcon }/>
            }
            onPress={() => this.setState({ selectedTab: selectedTab })}>

        >
            <HeaderView/>

        </TabNavigator.Item>
        )
    }

}

let styles=StyleSheet.create({
    tabNavigator:{
        backgroundColor:'#ffffff',
    },
    imageIcon:{
        resizeMode:'cover',
        width:26,
        height:26,
    }
});