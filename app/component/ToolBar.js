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
    Dimensions,
} from 'react-native';
let leftArrow = require('../img/leftArrow.png')
const width = Dimensions.get('window').width
export default class ToolBar extends Component{
    constructor(props){
        super(props);
        this.state   = {
            title:this.props.title,
            hasLeft:this.props.hasLeft,
            hasRight:this.props.hasRight,
            rightTitle:this.props.rightTitle,

        };
    }
    _goBack(){
        this.props.navigation.goBack()
    }
    render(){

       return(
            <View style={this.state.hasLeft ? styles.containerWithOutBg : styles.container}>
                {
                    this.state.hasLeft ?
                        <View style={styles.leftContainer}>
                            <TouchableWithoutFeedback onPress={this._goBack.bind(this)} >
                                <View style={styles.leftView}>
                                    <Image source={leftArrow} style={{width:16,height:16}}/>
                                    <Text style={styles.backTitle}>返回</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                        : <View style = {styles.emptyView}/>
                }
                <View style = {styles.titleTextContainer}>
                    <Text style={
                            this.state.hasLeft  ?
                                [styles.title,{color:'rgba(0,0,0,0.8)'}]
                                :styles.title
                             }>
                        {this.state.title}
                        </Text>
                </View>
                {
                    this.state.hasRight ?
                        <View style={styles.rightContainer}>
                            <Text onPress={this.props.onPress} style={styles.rightText}>{this.state.rightTitle}</Text>
                        </View>
                        : <View style={styles.emptyView}/>
                }
            </View>
       );
    }
}

const styles = StyleSheet.create({
    containerWithOutBg:{
        flexDirection:'row',
        width:width,
        height:50,
        borderBottomWidth:0.5,
        borderBottomColor:'#dddddd',
        justifyContent:'center',
        alignItems:'center',
    },
    container:{
        backgroundColor:'#ff8857',
        flexDirection:'row',
        width:width,
        height:50,
        justifyContent:'center',
        alignItems:'center',
    },

    leftContainer:{
        width: width*0.2,
        justifyContent:'flex-start',
        alignItems:'center',
    },
    leftView:{
         flexDirection:'row',
         justifyContent:'center',
         alignItems:'center',
    },
    backTitle:{
        color:'rgba(0,0,0,0.8)',
        fontSize:14,
        paddingLeft:10,
        fontWeight:'300',
        textAlign:'center',
    },
    titleTextContainer:{
        flex:1,
        alignSelf:'center',
    },
    title:{
        fontSize:16,
        fontWeight:'300',
        color:'#fff',
        textAlign:'center',

    },
    rightContainer:{
        width: width*0.2,
        justifyContent:'center',
        alignItems:'center',
    },
    rightText:{
        color:'#fff',
        textAlign:'center',
        fontSize: 14,
        fontWeight:'300',
    },
    emptyView:{
        width:width*0.2,
    }
})