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

export default class AccountScene extends Component{
    constructor(props){
        super(props);
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
        alignItems:'center',
        justifyContent:'center',
    },
    text:{
        alignSelf:'center',
        fontSize:18,
        fontWeight:'600',
    }
})
