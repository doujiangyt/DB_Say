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
    Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const width = Dimensions.get('window').width
export default class ToolBar extends Component{
    constructor(props){
        super(props);
        let {params} = this.props.navigation.state;
        this.state   = {
            title: params.title,
            hasLeft:params.hasLeft,
            hasRight:params.hasRight,
            rightTitle:params.rightTitle,
            hasClick:params.click
        };
    }
    _back(){
        //回到逗逼说界面
    }
    render(){
       return(
            <View style={styles.container}>
                {
                    this.state.hasLeft ?
                        <View style={styles.leftContainer}>
                            <TouchableHighlight onPress={this._back.bind(this)} style={styles.leftArrow}>
                                <Icon
                                    name='ios-arrow-left'
                                />
                            </TouchableHighlight>
                            <Text style={styles.backTitle}>返回</Text>
                        </View>
                        : null
                }
                <View style={styles.title}>
                    <Text>{this.state.title}</Text>
                </View>
                {
                    this.state.hasRight ?
                        <View style={styles.rightContainer}>
                            <Text onPress={
                                this.state.hasClick ? this.props.click : null
                            } style={styles.rightText}>{this.state.rightTitle}</Text>
                        </View>
                        : null
                }
            </View>
       );
    }
}

const styles = StyleSheet.create({
    container:{
      flexDirection:'row',
      width:width,
      height:50,
    },
    leftContainer:{
      flexDirection:'row',
      justifyContent:'center',
      alignItems:'center',
      paddingLeft:10,
    },
    leftArrow:{
        alignSelf:'center',
    },
    backTitle:{
      fontSize:16,
      fontWeight:'300',
      textAlign:'center',
    },
    title:{
        fontSize:20,
        fontWeight:'600',
        color:'rgba(255,255,255,0.8)'
    },
    rightContainer:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        paddingRight:10,
    },
    rightText:{
        textAlign:'center',
        fontSize: 16,
        fontWeight:'300',
    }
})