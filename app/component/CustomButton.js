/**
 * 自定义Button
 * Created by admin on 2017/6/23.
 */
import React,{Component} from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableWithoutFeedback
} from 'react-native';

export default class CustomButton extends Component{
    constructor(props){
        super(props);
    }
    render(){
       return(
           <TouchableWithoutFeedback onPress={this.props.onPress}>
                <View style={[styles.container,{width:this.props.width}]}>
                    <Text style={styles.name}>{this.props.name}</Text>
                </View>
           </TouchableWithoutFeedback>
       );
    }
}
const styles = StyleSheet.create({
    container:{
        height:50,
        borderWidth:1,
        borderColor:'#ff8857',
        borderRadius:5,
        justifyContent:'center',
        alignItems:'center',
    },
    name:{
        textAlign:'center',
        color:'#ff8857',
    }
})