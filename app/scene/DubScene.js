/**
 * Created by admin on 2017/6/19.
 */
import React,{Component} from 'react';
import {
    Image,
    Text,
    View,
    TouchableWithoutFeedback,
    StyleSheet,
} from 'react-native';
import ToolBar from '../component/ToolBar'
let videoImage = require('../img/dub.png')
export default class DubScene extends Component{
    static navigationOptions = {
        header:(
            <ToolBar
                title = '进入逗逼的世界'
                rightTitle = ''
                hasLeft = {false}
            />
        ),
    }

    constructor(props){
        super(props);
        console.log('路由的名字是：'+this.props.navigation.state.routeName)
    }

    _uploadVideo(){
        console.log('点击了上传视频')
    }
    render(){
       return(
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={this._uploadVideo.bind(this)} >
                    <View style={styles.touchableArea}>
                        <Image source={videoImage} style={styles.videoImage}/>
                        <Text style={styles.uploadText}>点我上传视频</Text>
                        <Text style={styles.uploadDuration}>建议时长不超过20s</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
       );
    }
}
const styles = StyleSheet.create({
    container:{
        alignItems:'center',
        flex:1,
    },
    touchableArea:{
        alignItems:'center',
        marginTop:50,
        borderWidth:0.8,
        borderColor:'#ff8857',
        borderRadius:5,
        width:300,
        height:240,

    },
    videoImage:{
        alignSelf:'center',
        marginTop:10,
        width:160,
        height:160,

    },
    uploadText:{
        fontSize:16,
        fontWeight:'600',
        alignSelf:'center',
        paddingTop:10,
    },
    uploadDuration:{
        padding:10,
        color:"#bbbbbb",
        alignSelf:'center'
    },
})