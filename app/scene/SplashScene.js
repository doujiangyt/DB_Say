/**
 * Created by admin on 2017/6/27.
 */
import React,{Component} from 'react';
import {
    Text,
    View,
    StyleSheet,
    Dimensions,
} from 'react-native';
import Video from "react-native-video";

let width = Dimensions.get('window').width
let height = Dimensions.get('window').height
export default class SplashScene extends Component{
    static navigationOptions = {
        header:(
            null
        ),
    }
    constructor(props){
        super(props);

    }
    _goApp(){
        this.props.navigation.navigate('VideosPage')
    }

    render(){
       return(
            <View style={styles.container}>
                <Video source={
                    require('../.././android/app/src/main/res/raw/splash_video.mp4')
                    //{uri: "splash_video", mainVer: 1, patchVer: 0}
                } // Looks for .mp4 file (background.mp4) in the given expansion version.
                       ref={(ref) => {
                           this.video = ref
                       }}
                       rate={1.0}                   // 表示默认速率
                       volume={1.0}                 // 0 is muted, 1 is normal.
                       muted={false}                // Mutes the audio entirely.
                       paused={false}               // Pauses playback entirely.
                       resizeMode="cover"           // Fill the whole screen at aspect ratio.
                       repeat={true}                // Repeat forever.
                       style={styles.backgroundVideo}
                />
                <View style={styles.textContent}>
                    <Text style={styles.text} onPress={this._goApp.bind(this)}>进入逗逼的世界</Text>
                </View>
            </View>
       );
    }
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center'
    },
    backgroundVideo:{
        width:width,
        height:height,
    },
    textContent:{
        position:'absolute',
        bottom:height*0.10,
        width:width*0.4,
        height:40,
        borderWidth:1,
        borderRadius:6,
        borderColor:'#ff8857',
        justifyContent:'center',
        alignItems:'center',
        alignSelf:'center'

    },
    text:{
        fontSize:16,
        color:'#ff8857',
        textAlign:'center'
    }
})