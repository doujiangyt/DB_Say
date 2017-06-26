/**
 * Created by admin on 2017/6/19.
 */
import React,{Component} from 'react';
import {
    Image,
    TextInput,
    Text,
    View,
    ListView,

    FlatList,
    ActivityIndicator,
    TouchableWithoutFeedback,
    StyleSheet,
    Dimensions,
} from 'react-native';

import {StackNavigator} from 'react-navigation'
import Item from '../component/Item'
import ToolBar from '../component/ToolBar'
import VideoSceneToolBar from '../component/VideoSceneToolBar'


import request from '../common/request'
import config from '../common/config'

let onePic = require('../img/one.jpg')
let twoPic = require('../img/two.jpg')
let threePic = require('../img/three.jpg')
let fourPic = require('../img/four.jpg')
const width = Dimensions.get('window').width
let imageSource = [onePic,twoPic,threePic,fourPic]

let cachedResults = {
    nextPage:1,
    items:[],
    total:0,
}


export default class VideosScene extends Component{
/*    static navigationOptions = {
        header:(
            <ToolBar
                title = '逗逼说'
                rightTitle = ''
                hasLeft = {false}
            />
        ),
    }*/
    static navigationOptions = {
        header:(
            <VideoSceneToolBar/>
        )
    }
    constructor(props){
        super(props);
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        console.log('路由的名字是：'+this.props.navigation.state.routeName)
        this.state={
            isLoadingTail:false,
            //dataSource:ds.cloneWithRows(imageSource),
            dataSource:ds.cloneWithRows([])
        }
    }

    _renderLoading(){
        return(
            <View style={styles.loadingContainer}>
                <ActivityIndicator
                    style={styles.loading}
                    size="large"
                    color='#ff8857'
                />
                <Text style={styles.text}>正在加载视频中...</Text>
            </View>
        )
    }
    _renderFl(){
        return(
            <View style={styles.container}>

                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={(rowData) => this._renderRow(rowData)}
                    onEndReachedThreshold={20}  //等到快要滑动到距离底部20的时候就加载数据
                    onEndReached={this._fetchMoreData.bind(this)}
                    renderFooter={this._renderFooter.bind(this)}

                    enableEmptySections={true}
                />
            </View>
        )
    }
    componentDidMount(){
        this._fetchData(1)
    }
    _fetchData(page){
        let that = this
        this.setState({
            isLodingTail:true
        })
        //请求数据
        request.get(config.api.base+config.api.creations,{
            accessToken:'abc',
            page:page
        })
            .then((data)=>{
                if(data.success){
                    let items = cachedResults.items.slice()  //对cachedResults里面的items数组进行复制
                    items = items.concat(data.data)  //将请求回来的数据追加到items数组中。
                    cachedResults.items = items
                    cachedResults.total = data.total
                    setTimeout(()=>{                     //这里有了一个setTimeout，就需要对this的指向，重新定义
                        that.setState({
                        isLoadingTail:false,
                        dataSource:that.state.dataSource.cloneWithRows(cachedResults.items)
                    })
                    },2000)
                    /*this.setState({
                        isLoadingTail: false,
                        dataSource: this.state.dataSource.cloneWithRows(cachedResults.items)
                    })*/
                }

            })
            .catch((error)=>{
                this.setState({
                    isLoadingTail:false
                })
                console.error(error)
            })
            .done();
    }
    _hasMore(){
        return cachedResults.items !== cachedResults.total
    }
    _fetchMoreData(){
        if(!this._hasMore() || this.state.isLoadingTail){  //如果没有更多数据或者正在刷新的时候
            return
        }
        let page = cachedResults.nextPage
        this._fetchData(page)
    }
    _renderFooter(){
        //
        return (
                !this._hasMore() ?
                    <View style={styles.loadingMore}>
                        <Text style={styles.loadingMoreText}>没有更多数据了</Text>
                    </View>
                    : <View style={styles.loadingMore}>
                    <ActivityIndicator/>
                    <Text style={styles.loadingMoreText}>正在刷新中...</Text>
                </View>
        )
    }
    _playVideo(){
        this.props.navigation.navigate('DetailPage')
    }

    _renderRow(rowData){
        return(
           <Item
               rowData = {rowData}
               playVideo = {this._playVideo.bind(this)}
           />
        )
    }
    render(){
       return(
        this.state.dataSource ? this._renderFl() : this._renderLoading()
       );
    }
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#f5fcff'
    },
    loadingContainer:{
        flex:1,
        alignItems:'center',      //这两个属性是给容器用的
        justifyContent:'center',
        alignSelf:'center'
    },
    loading:{
        alignSelf:'center',         //这个属性是给子控件用的
    },
    text:{
        fontSize:12,
        color:'#ff8857',
        fontWeight:'600',
        textAlign:'center',
    },
    header:{

    },
    title:{

    },
    loadingMore:{
        marginVertical:5
    },
    loadingMoreText:{
        color:'#777',
        textAlign:'center'
    }


})
/*const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },
    title:{
        padding:6,
        fontSize:16,
        fontWeight:'300',
        alignSelf:'center',
    },
    imageStyle:{
        width:width,
        height:width *0.56,
    },
    loading:{
        alignSelf:'center',         //这个属性是给子控件用的
    },
    like:{
        width:20,
        height:20,
        alignSelf:'center',
        marginRight:6,
    },
    text:{
        fontSize:12,
        color:'#ff8857',
        fontWeight:'600',
        textAlign:'center',
    },
    itemContainer:{
        borderBottomWidth:0.8,
        borderBottomColor:'#dddddd',
        justifyContent:'center',
        alignItems:'center',
        width:width,
        height:width * 0.56+80,
    },
    touchableArea:{

        width:width,
        height:width *0.56,
    },
    play:{
        position:'absolute',
        right:20,
        bottom:20,
    },
    playIcon:{
        width:40,
        height:40,
    },
    BottomContent:{
        height:40,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',

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
    }

})*/

/*
    <View style={styles.itemContainer}>
<Text style={styles.title}>逗逼秀现在开始了</Text>
<TouchableWithoutFeedback  onPress={this._playVideo.bind(this)}>
<View style={styles.touchableArea}>
<Image source={rowData} style={styles.imageStyle}/>
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

</View>*/
