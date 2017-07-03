/**
 * 这里面是要将所有需要跳转的界面都写到这里来，相当于android中的androidManifest.xml文件，所有的activity都需要进行注册一样的
 * Created by admin on 2017/6/19.
 */
import {
    StackNavigator
}from 'react-navigation'
import React,{Component} from 'react'
import {
    AsyncStorage
}from 'react-native'
import VideosHome from '../component/VideosHome';
import ToolBar from '../component/ToolBar'
import DetailScene from '../scene/DetailScene'
import SplashScene from '../scene/SplashScene'
import LoginScene from '../scene/LoginScene'

class AppNav extends Component{
    constructor(props){
        super(props)
        this.state={
            user:null,
            loaded:false,
        }
    }
    componentDidMount(){
        this._asynAppStatus()
    }
    _asynAppStatus(){
        AsyncStorage.getItem('user')
            .then((data)=>{
                let user={}
                let newState={}
                if(data){
                    user=JSON.parse(data)
                }
                if(user && user.accessToken){
                    newState.user = user,
                        newState.loaded = true
                }else{
                    newState.load = false
                }
                this.setState(newState)
            })
    }
    _afterLogin(user){
        user = JSON.stringify(user)
        AsyncStorage.setItem('user',user)
            .then(()=>{
                this.setState({
                    loaded:true,
                    user:user
                })
            })
            .catch((error)=>{
                alert('存储登录信息失败')
            })
    }
    render(){
        return(
            this.state.loaded
            ? <AppStackNavigator/>
            :<LoginScene afterLogin={(user)=>{this._afterLogin(user)}}/>
        )

    }
}
const AppStackNavigator = StackNavigator({
    //splash界面
    SplashPage:{
      screen:SplashScene,
    },
    //注册登录界面
    LoginPage:{
      screen:LoginScene,
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