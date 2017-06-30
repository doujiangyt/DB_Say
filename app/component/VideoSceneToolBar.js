/**
 * Created by admin on 2017/6/26.
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
               <Text style={styles.title}>逗逼说</Text>
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