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
    ActivityIndicator,
    TouchableHighlight,
    StyleSheet,
} from 'react-native';

export default class DubScene extends Component{
    constructor(props){
        super(props);
    }

    render(){
       return(
            <View style={styles.container}>
                <Text style={styles.text}>DubScene</Text>
            </View>
       );
    }
}
const styles = StyleSheet.create({
    container:{
        alignItems:'center',
        justifyContent:'center',
    },
    text:{
        alignSelf:'center',
        fontSize:18,
        fontWeight:'600',
    }
})