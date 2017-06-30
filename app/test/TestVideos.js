/**
 * Created by admin on 2017/6/23.
 */
import React,{Component} from 'react';
import {
    Image,
    TextInput,
    ListView,
    Text,
    View,
    ActivityIndicator,
    TouchableHighlight,
    StyleSheet,
} from 'react-native';
import Video from 'react-native-video'
export default class TestVideos extends Component{
    constructor(props){
        super(props);
    }

    render(){
       return(
           <View style={styles.container}>
           <Video source={require('../video/wx_camera.mp4')} // Looks for .mp4 file (background.mp4) in the given expansion version.
                  ref='player'
                  rate={1.0}                   // 0 is paused, 1 is normal.
                  volume={1.0}                 // 0 is muted, 1 is normal.
                  muted={false}                // Mutes the audio entirely.
                  paused={false}               // Pauses playback entirely.
                  resizeMode="cover"           // Fill the whole screen at aspect ratio.
                  repeat={false}                // Repeat forever.
                  //onLoadStart={this.loadStart} // Callback when video starts to load
                  //onLoad={this.setDuration}    // Callback when video loads
                  //onProgress={this.setTime}    // Callback every ~250ms with currentTime
                  //onEnd={this.onEnd}           // Callback when playback finishes
                  //onError={this.videoError}    // Callback when video cannot be loaded
                  style={styles.backgroundVideo} />
           </View>

       );
    }
}
const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,

    },
})