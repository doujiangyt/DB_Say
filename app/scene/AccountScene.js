/**
 * Created by admin on 2017/6/19.
 */
import React,{Component} from 'react';
import {
    Image,
    Text,
    View,
    StyleSheet,
    Dimensions,
    AsyncStorage,
    TouchableOpacity,
} from 'react-native';
import ToolBar from '../component/ToolBar'
import ImagePicker from 'react-native-image-picker'
let upload = require('../img/upload_cloud.png')
let width = Dimensions.get('window').width

let photoOtions = {
    title: '选择头像',
    cancelButtonTitle:'取消',
    takePhotoButtonTitle:'拍照',
    chooseFromLibraryButtonTitle:'选择本地相册',
    quality:0.75,
    //allowsEditing:'true',
    //noData:'false',
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};



export default class AccountScene extends Component{
    static navigationOptions = {
        header:(
            <ToolBar
                title = '逗逼的账户'
                rightTitle = '退出登录'
                hasRight = {true}
                hasLeft = {false}
                onPress={()=>{
                    AccountScene.onPressCallBack()
                }}

            />
        ),
    }
    static onPressCallBack(){
        console.log('点击了退出登录按钮')
    }
    constructor(props){
        super(props);
        this.state={
            user:{},
            isUpload:false,
        }


    }
    componentDidMount(){
        //得到存储的数据
        AsyncStorage.getItem('user')
            .then((data)=>{
                let user
                if(data){
                    user = JSON.parse(data)
                }
                if(user && user.accessToken){
                    this.setState({
                        user:user,
                    })
                }
            })
            .catch((error)=>{
                alert('获取头像失败')
            })
    }
    _imagePicker(){
        ImagePicker.showImagePicker(photoOtions, (res) => {
            console.log('res='+res.data)
            if (res.didCancel) {
                return
            } else {
                let avatorData = 'data:image/jpeg;base64,' + res.data
                console.log('res.data='+res.data)
                let user = this.state.user
                user.avator = avatorData
                //这时候需要将这个图片post到cloudinary上。
                this.setState({
                    user: user,
                });
            }
        });
    }
    render(){
        return(
            <View style={styles.container}>
                {
                    this.state.isUpload
                    ? <Image style={styles.avatorArea} source={{uri:this.state.user.avator}}>
                        <TouchableOpacity onPress={this._imagePicker.bind(this)}>
                            <Image style={styles.avator} source={{uri:this.state.user.avator}}/>
                        </TouchableOpacity>
                        <Text style={styles.desAvator} onPress={this._imagePicker.bind(this)}>戳我更换头像</Text>
                    </Image>
                    : <View style={styles.avatorArea}>
                        <TouchableOpacity onPress={this._imagePicker.bind(this)}>
                            <View style={styles.avatorBox}>
                                <Image style={styles.noAvator} source={upload}/>
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.desAvator} onPress={this._imagePicker.bind(this)}>点我上传头像</Text>
                    </View>
                }

            </View>
        );
    }
}
const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    avatorArea:{
        width:width,
        height:width*0.4,
        backgroundColor:'#333',
        alignItems:'center',
        justifyContent:'center',
    },
    avatorBox:{
        marginTop:5,
        width:80,
        height:80,
        borderRadius:40,
        borderWidth:1,
        backgroundColor:'#fff',
        alignSelf:'center',
        alignItems:'center',
        justifyContent:'center',
    },
    noAvator:{
        width:46,
        height:32,
        alignSelf:'center'
    },
    avator:{
        marginTop:5,
        width:80,
        height:80,
        borderRadius:40,
        borderWidth:1,
        alignSelf:'center',
    },
    desAvator:{
        fontSize:14,
        color:'#ff8857',
        textAlign:'center',
        padding:5,

    }
})
