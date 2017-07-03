/**
 * Created by ${豆浆} on 2017/7/2.
 */
import React,{Component} from 'react';
import {
    TextInput,
    Text,
    View,
    StyleSheet,
    Dimensions,
} from 'react-native';
import Button from 'react-native-button'
import {CountDownText} from 'react-native-sk-countdown'

import config from '../common/config'
import request from '../common/request'
let width = Dimensions.get('window').width
export default class LoginScene extends Component{
    static navigationOptions = {
        header:(
            null
        ),
    }
    constructor(props){
        super(props);
        this.state={
            phoneNumber:'',
            verifyCode:'',
            codeSend:false,
            loading:false,
            countingDown:false,
        }
    }
    //倒计时结束的回调
    _countingDown(){
        this.setState({
            countingDown:true,
        })
    }
    //提交登录
    _submit(){
        let phoneNumber = this.state.phoneNumber
        let verifyCode = this.state.verifyCode
        if(!phoneNumber){
            alert('手机号码不能为空')
            return
        }
        if(!verifyCode){
            alert('验证码不能为空')
            return
        }

        //将手机号以及验证码一起post到服务器
        let loginUrl = config.api.base + config.api.verify
        let body = {
            phoneNumber:phoneNumber,
            verifyCode:verifyCode,
        }

        request.post(loginUrl,body)
            .then((data)=>{
                if(data && data.success){
                    //这里会返回一个data对象。将这个对象存储在asyncStorage中
                    /*let user = JSON.stringify(data)
                    AsyncStorage.setItem('user',user)
                    //跳转到主界面
                    this.props.navigation.navigate('VideosPage')*/
                    console.log('成功data'+data)
                    this.props.afterLogin(data.data)
                }else{
                    alert('验证码错误,请重新输入')
                }
            })
            .catch((error)=>{
                console.log('error:'+error)
                alert('登录失败,请检查网络是否正常2')
            })
    }

    //验证是不是正确的手机号
    _checkIsPhoneNum(phoneNum){
        let length = phoneNum.length;
        if(length === 11 && /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(14[0-9]{1})|)+\d{8})$/.test(phoneNum) )
        {
            return true;
        }else{
            return false;
        }
    }
    _showVerifyCode(){
        this.setState({
            loading:true,
            codeSend:true,
        })
    }
    //重新得到验证码
    _reGetVerifyCode(){
        this.setState({
            countingDown:false,
        })
        this._sendVerifyCode()
    }
    //发送验证码
    _sendVerifyCode(){
        //先post手机号
        if(this.state.phoneNumber){
            if(!this._checkIsPhoneNum(this.state.phoneNumber)){
                alert('请输入正确的手机号')
                return
            }
        }else{
            alert('手机号不能为空')
            return
        }
        let url = config.api.base + config.api.signup
        let body ={
            phoneNumber:this.state.phoneNumber
        }
        request.post(url,body)
            .then((data)=>{
                if(data && data.success){
                    this._showVerifyCode()
                }else{
                    alert('验证码发送失败,请检查手机号是否正确')
                }
            })
            .catch((error)=>{
                alert('验证码发送失败,请检查网络是否正常1')
            })
    }
    render(){
       return(
            <View style={styles.container}>
                <View style={styles.signupBox}>
                    <Text style={styles.title}>快速登录</Text>
                    <View style={styles.phoneNumBox}>
                        <Text style={styles.zoneText}>+86</Text>
                        <View style={styles.verticalLine}/>
                        <TextInput
                            placeholder={'请输入手机号码...'}
                            style={styles.phoneNumInput}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            underlineColorAndroid={'transparent'}
                            keyboardType={'number-pad'}
                            onChangeText={(phoneNumber)=>{
                                this.setState({
                                    phoneNumber:phoneNumber
                                })
                            }}
                        />
                    </View>
                </View>
                {
                    this.state.codeSend
                    ?<View style={styles.verifyBox}>
                        <TextInput
                            placeholder={'请输入验证码'}
                            style={styles.verifyInput}
                            autoCapitalize={'none'} //不纠正大小写
                            autoCorrect={false}    //不纠正内容的对与错
                            keyboardType={'number-pad'}
                            underlineColorAndroid={'transparent'}
                            secureTextEntry={true}
                            onChangeText={(verifyCode)=>{
                                this.setState({
                                    verifyCode:verifyCode
                                })
                            }}
                        />
                        {
                            this.state.countingDown
                            ?<Button onPress={this._reGetVerifyCode.bind(this)} title={''} style={styles.getVerifyCode}>获取验证码</Button>
                            :<CountDownText
                                style={styles.cd}
                                countType='seconds' // 计时类型：seconds / date
                                auto={true} // 自动开始
                                afterEnd={this._countingDown.bind(this)} // 结束回调
                                timeLeft={60} // 正向计时 时间起点为0秒
                                step={-1} // 计时步长，以秒为单位，正数则为正计时，负数为倒计时
                                startText='获取验证码' // 开始的文本
                                endText='获取验证码' // 结束的文本
                                intervalText={(sec) => sec + '秒重新获取'} // 定时的文本回调
                            />
                        }
                    </View>
                    :null
                }
                {
                    this.state.codeSend ?
                        <Button onPress={this._submit.bind(this)} title={''} style={styles.login} >登录</Button>
                        :<Button onPress={this._sendVerifyCode.bind(this)} title={''} style={styles.sendVerifyCode} >获取验证码</Button>
                }
            </View>
       );
    }
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        padding:10,
        backgroundColor:'#f9f9f9'
    },
    signupBox:{
        alignItems:'center',
        justifyContent:'center',
        marginTop:10,
    },
    title:{
        marginBottom:20,
        textAlign:'center',
        fontSize:16,
        color:'#333'
    },
    phoneNumBox:{
        flexDirection:'row',
        width:width*0.9,
        backgroundColor:'#fff',
        height:40,
        borderRadius:4,
        padding:5,
        alignItems:'center',
        justifyContent:'center'
    },
    phoneNumInput:{
        color:'#666',
        width:width*0.9-width/7,
        height:40,
        fontSize:14,
        alignSelf:'center'
    },
    //区号
    zoneText:{
        width:width/7,
        height:40,
        color:'#888',
        fontSize:14,
        padding:10,
        alignSelf:'center',
        justifyContent:'center'
    },
    //竖线
    verticalLine:{
        width:1,
        height:20,
        backgroundColor:'#aaa',
        alignSelf:'center',
        marginRight:5,
    },
    //验证码
    verifyBox:{
        width:width*0.9,
        marginTop:10,
        flexDirection:'row',
        justifyContent:'space-between',
        alignSelf:'center'
    },
    verifyInput:{
        backgroundColor:'#fff',
        color:'#666',
        width:width*0.9-120,
        height:40,
        fontSize:14,
        borderRadius:4,
        padding:5,
    },
    getVerifyCode:{
        backgroundColor:'#ff8857',
        color:'#fff',
        padding:10,
        justifyContent:'center',
        fontSize:14
    },
    //倒计时
    cd:{
        width:110,
        height:40,
        backgroundColor:'#ff8857',
        color:'#fff',
        padding:10,
        textAlign:'center',
        alignSelf:'center',
    },
    //登录按钮
    login:{
        marginTop:20,
        height:40,
        width:width*0.9,
        padding:10,
        borderColor:'#ff8857',
        borderWidth:1,
        borderRadius:5,
        color:'#ff8857',
        fontSize:14,
        alignSelf:'center',
        justifyContent:'center'
    },
    //发送验证码按钮
    sendVerifyCode:{
        marginTop:20,
        height:40,
        width:width*0.9,
        padding:10,
        borderColor:'#ff8857',
        borderWidth:1,
        borderRadius:5,
        color:'#ff8857',
        fontSize:14,
        alignSelf:'center',
        justifyContent:'center'
    }
})