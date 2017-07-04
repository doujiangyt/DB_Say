/**
 * Created by ${豆浆} on 2017/7/4.
 */
import React,{Component} from 'react';
import {
    Text,
    View,
    StyleSheet,
    Dimensions,
} from 'react-native';
const width = Dimensions.get('window').width
export default class VideoSceneToolBar extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <View style={styles.container}>
                <Text style={styles.title}>逗比的日常</Text>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container:{
        width:width,
        height:50,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#ff8857'
    },
    title:{
        color:'#fff',
        fontSize:16,
        textAlign:'center'
    }

})