/**
 * Created by admin on 2017/6/21.
 * essus:在onPress里的方法需要加上一个()=>指向，不然会自动调用
 */
import React,{Component} from 'react';
import {
    Image,
    TextInput,
    ListView,
    Text,
    View,
    Modal,
    StyleSheet,
    ActivityIndicator,
    Dimensions,
    TouchableWithoutFeedback,
    Alert
} from 'react-native';
import config from '../common/config'
import request from '../common/request'
let playIcon = require('../img/play.png')
let likeIcon = require('../img/heart.png')
let likePressedIcon = require('../img/heart_pressed.png')
let commentIcon = require('../img/comment.png')
let closeIcon = require('../img/error.png')

const width = Dimensions.get('window').width
export default class Item extends Component{
    constructor(props){
        super(props);

        this.rowData = this.props.rowData
        this.navigation=this.props.navigation
        this.state={
            isLike:this.rowData.voted,
            modalVisible:false,
            comment:'',
        }
    }
    _like(){
        //点赞后需要将状态同步到服务器。
        let isLike = !this.state.isLike
        let rowData = this.rowData
        let url = config.api.base + config.api.isLike

        let body = {
            id : rowData._id,
            isLike: isLike ? 'yes' : 'no',
            accessToken: 'abcd',
        }

        request.post(url,body)
            .then((data)=>{
                data&&data.success ?
                    this.setState({
                        isLike:isLike,
                    })
                    : Alert.alert('请求失败,请稍后重试1')
                })
            .catch((error)=>{
                Alert.alert('请求失败,请稍后重试2')
        })
    }
    _comment(){
        //评论功能
        this.setState({
            modalVisible:true,
        })
    }
    _closeComment(){
        this.setState({
            modalVisible:false,
        })
    }
    _commitComment(){
        //提交评论，这里需要将评论上传到服务器，然后关闭评论，
        //TODO 上传到服务器
        this._closeComment()
    }
    _playVideo(rowData){
     this.navigation.navigate('DetailPage',{rowData:rowData})
     }
    render(){
       return(
           <View style={styles.itemContainer}>
               <Text style={styles.title} numberOfLines={2}>{this.rowData.title}</Text>
               <TouchableWithoutFeedback  onPress={()=>{this._playVideo(this.props.rowData)}}>
                   <View style={styles.touchableArea}>
                       <Image source={{uri:this.rowData.thumb}} style={styles.imageStyle}/>
                       <View style={styles.play}>
                           <Image
                               source={playIcon}
                               style={styles.playIcon}
                           />
                       </View>
                   </View>
               </TouchableWithoutFeedback>

               <View style={styles.BottomContent}>

                   <View style={styles.content}>
                       <TouchableWithoutFeedback onPress={this._like.bind(this)}>
                           <Image
                               style={styles.like}
                               source={this.state.isLike ? likePressedIcon : likeIcon}
                           />
                       </TouchableWithoutFeedback>
                       <Text style={styles.contentText}>喜欢</Text>
                   </View>

                   <View style={styles.divider}/>

                   <View style={styles.content}>
                       <TouchableWithoutFeedback onPress={this._comment.bind(this)}>
                           <Image
                               style={styles.like}
                               source={commentIcon}
                           />
                       </TouchableWithoutFeedback>
                       <Text style={[styles.contentText,styles.rightText]}>评论</Text>
                   </View>

               </View>
               {/*<Modal
                   animationType={"slide"}
                   transparent={false}
                   visible={this.state.modalVisible}
                   onRequestClose={()=>{this._closeComment()}}
                   >
                   <View style={styles.commentContainer}>

                           <TouchableWithoutFeedback onPress={this._closeComment.bind(this)}>
                               <Image style={styles.closeImage} source={closeIcon}/>
                           </TouchableWithoutFeedback>

                       <View style={styles.commentArea}>
                           <Text style={styles.commentTitle}>评论一个</Text>
                           <TextInput
                                autoFocus={true}        //自动获取焦点
                                placeholder='快夸赞一下这个逗逼...' //占位符
                                returnKeyType='send'
                                underlineColorAndroid='transparent'
                                onChangeText={(comment)=>{        //当输入框中的文字发生改变时，将改变后的值赋值给初始的query
                            this.setState({
                                    comment
                                })
                            }}
                            onSubmitEditing={
                            //按下回车后，就相当于按下了评论按钮。
                                ()=>{this._commitComment()}
                            }
                        />
                       </View>


                   </View>
               </Modal>*/}
           </View>

       );
    }
}
const styles = StyleSheet.create({
    title:{
        textAlign:'center',
        fontSize:14,
        fontWeight:'300',
        alignSelf:'center',
        padding:6,
    },
    imageStyle:{
        width:width,
        height:width *0.56,
    },
    like:{
        width:20,
        height:20,
        alignSelf:'center',
        marginRight:6,
    },
    divider:{
        backgroundColor: '#dddddd',
        height: 20,
        width: 1,
        alignSelf:'center',
    },
    itemContainer:{
        justifyContent:'center',
        alignItems:'center',
        width:width,
        height:width * 0.56+88,
    },
    touchableArea:{
        width:width,
        height:width *0.56,
    },
    play:{
        position:'absolute',
        left:width/2-23,
        top:width*0.28-23,
        borderWidth:1.5,
        borderColor:'rgba(255,255,255,0.5)',
        borderRadius:23,
        width:46,
        height:46,
    },
    playIcon:{
        position:'absolute',
        top:8,
        left:11,
        width:28,
        height:28,

    },
    BottomContent:{
        height:40,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        borderBottomWidth:1,
        borderColor:'#dddddd'
    },
    content:{
        flex:1,
        flexDirection:'row',
        justifyContent:'center'

    },
    contentText:{
        fontSize:16,
        fontWeight:'300',

    },
    rightText:{
        color:'#787878',
    },
/*    closeImage:{
        alignSelf:'center',
        width:26,
        height:26,
    },
    commentContainer:{
        position:'absolute',
        left:0,
        top:30,
        flex:1,

        justifyContent:'center',
        alignItems:'center',

    },*/
/*    commentArea:{
        alignSelf:'center',
        paddingTop:6,
        paddingBottom:20,
        width:width,
        height:100,
        borderWidth:1,
        margin:20,
        marginRight:20,
        borderColor:'#dddddd'
    },*/
/*
    commentTitle:{

        fontWeight:'500',
        alignSelf:'flex-start',
    },
*/




})