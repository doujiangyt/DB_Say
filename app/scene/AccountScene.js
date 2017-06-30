/**
 * Created by admin on 2017/6/19.
 */
import React,{Component} from 'react';
import {
    Image,
    TextInput,
    ListView,
    Text,
    View,
    StyleSheet,
    ActivityIndicator,
    TouchableHighlight,
} from 'react-native';
import ToolBar from '../component/ToolBar'
export default class AccountScene extends Component{
/*    static navigationOptions = {
        header:(
            <ToolBar
                title = '逗逼的账户'
                rightTitle = '退出登录'
                hasRight = {true}
                hasLeft = {false}
                onPress={()=>{
                    AccountScene.onPressCallBack()
                }}

            />
        ),
    }*/
    static onPressCallBack(){
        console.log('点击了退出登录按钮')
    }
    constructor(props){
        super(props);
        console.log('路由的名字是：'+this.props.navigation.state.routeName)
    }

    render(){
        return(
            <View style={styles.container}>
                <Text style={styles.text}>AccountScene</Text>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#555555'
    },
    text:{
        alignSelf:'center',
        fontSize:18,
        fontWeight:'600',
    }
})
