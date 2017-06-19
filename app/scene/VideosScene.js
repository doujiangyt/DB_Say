/**
 * Created by admin on 2017/6/19.
 */
import React,{Component} from 'react';
import {
    Image,
    TextInput,
    Text,
    View,
    FlatList,
    ActivityIndicator,
    TouchableHighlight,
    StyleSheet,
    Dimensions,
    PixelRatio,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const width = Dimensions.get('window').width


export default class VideosScene extends Component{
    constructor(props){
        super(props);

        this.state={
            data:null,
            isLike:false,
        }
    }

    _renderLoading(){
        return(
            <View style={styles.container}>
                <ActivityIndicator
                    style={styles.loading}
                    size="large"
                />
                <Text style={styles.text}>正在加载视频中...</Text>
            </View>
        )
    }
    _renderFl(){
        return(
            <FlatList
                data={this.state.data}
                renderItem={this._renderItem(data)}
            />
        )
    }
    _playVideo(){
        //点击后进入播放详情界面
    }
    _like(){
        this.setState({
            isLike:!this.state.isLike,
        })
    }



    _renderItem(rowData){
        return(
            <View style={styles.itemContainer}>
                <TouchableHighlight style={styles.touchableArea} onPress={this._playVideo.bind(this)}>
                        <Image source={{uri:rowData}}/>
                        <View style={styles.play}>
                            <Icon
                                name='ios-play-outline'
                                color={'#ff8857'}
                                style={styles.playIcon}
                            />
                        </View>
                </TouchableHighlight>

                <View style={styles.BottomContent}>
                    <View style={styles.content}>
                        <Icon
                            name='ios-heart-outline'
                            color={this.state.isLike ? '#ff8857' : null}
                            onPress={this._like.bind(this)}
                        />
                        <Text style={[styles.contentText,{color: this.state.isLike ? '#ff8857': null} ]}>喜欢</Text>
                    </View>
                    <View style={styles.content}>
                        <Icon
                            name='ios-chatbubble-outline'
                        />
                        <Text style={[styles.contentText,styles.rightText]}>评论</Text>
                    </View>
                </View>
            </View>
        )
    }
    render(){
       return(
        this.state.data ? this._renderLoading() : this._renderFl()
       );
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',      //这两个属性是给容器用的
        justifyContent:'center',
    },
    loading:{
        color:'#ff8857',
        alignSelf:'center',         //这个属性是给子控件用的
    },
    text:{
        fontSize:18,
        color:'#ff8857',
        fontWeight:'600',
        textAlign:'center',
    },
    itemContainer:{
        width:width,
        height:width * 0.56,
    },
    touchableArea:{
        
    },
    play:{
        position:'absolute',
        right:20,
        bottom:20,
        width:60,
        height:60,
        borderRadius:90/PixelRatio.get()
    },
    playIcon:{
        width:10,
        height:10,
    },
    BottomContent:{
        flexDirection:'row',
    },
    content:{
        flex:1,
        flexDirection:'row'

    },
    contentText:{
        fontSize:18,
        fontWeight:'600',

    },
    rightText:{
        color:'#787878',
    }

})