/**
 * Created by admin on 2017/6/21.
 */
import React,{Component} from 'react';
import {
    Image,
    TextInput,
    ListView,
    Text,
    View,
    Dimensions,
    StyleSheet,
    ActivityIndicator,
    Modal,
    TouchableWithoutFeedback,
} from 'react-native';
import {CountDownText} from 'react-native-sk-countdown'
import CustomButton from '../component/CustomButton'
import Video from 'react-native-video'
import request from '../common/request'
import config from '../common/config'

let width = Dimensions.get('window').width
let closeIcon = require('../img/error.png')
let playIcon = require('../img/play.png')
let pauseIconT = require('../img/pauseT.png')
let playIconT = require('../img/playT.png')
let fullScreen = require('../img/fullScreen.png')

//数据缓存
let cachedResults = {
    nextPage:1,
    items:[],
    total:0,
}
export default class DetailScene extends Component{
    constructor(props){
        super(props);
        let data = this.props.navigation.state.params.rowData
        let ds = new ListView.DataSource({rowHasChanged:(r1,r2)=>r1!==r2})
        this.state={
            data:data,
            //movie
            rate:1,
            muted:false,
            resizeMode:'cover',
            repeat:false,

            videoLoaded:false, //视频是否加载完成
            loadFailed:false,
            isRePlay:false,//是否重复播放
            isPaused:false,  //是否暂停
            isPlaying:false, //是否正在播放
            //progress
            percent:0.01,
            currentTime:0,
            duration:0,

            //min&sec
            min:0,
            sec:0,

            //ListView部分
            dataSource:ds.cloneWithRows([]),
            isLoadingTail:false,


            //评论部分
            isSending:false,
            comments:'',
            modalVisible:false,
        }
    }
    _pausedMovie(){
        //点击后暂停播放视频
        console.log('点击了屏幕')
        this.setState({
            clickScreenShowShade:!this.state.clickScreenShowShade,
        })

    }
    _popupModal(){
        console.log('有焦点了')
        //弹出modal
        this.setState({
            modalVisible:true,
        })
    }
    _closeComment(){
        //关闭modal
        this.setState({
            modalVisible:false,
        })
    }
    _commitComment(){
        console.log('点击了评论')
        //点击提交评论,提交完成后关闭modal
        if(this.state.isSending){  //如果当前正在评论就直接返回
            alert('正在评论中,请稍后...')
            return
        }
        let url = config.api.base + config.api.comment
        let body = {
            accessToken:'abcd',
            creation:1234,
            content:this.state.comments
        }
        this.setState({
            isSending:true,
        },()=>{
            request.post(url,body)
                .then((data)=>{
                    if(data && data.success){
                        let items = cachedResults.items.slice()
                        items = [{
                            content:this.state.comments,
                            replyBy:{
                                avator:'http://dummyimage.com/640x640/618caf)',
                                nickname:'豆浆油条'
                            }
                        }].concat(items)
                        cachedResults.items = items
                        cachedResults.total +=1
                        this.setState({
                            isSending:false,
                            dataSource:this.state.dataSource.cloneWithRows(cachedResults.items)
                        })
                    }
                })
                .catch((error)=>{
                    alert('提交失败,请稍后重试...')
                    this.setState({
                        isSending:false,
                    })
                })
        })

        this._closeComment()
    }
    _onLoadStart(){
        console.log('_onLoadStart..')
        this.setState({
            loadFailed:false,
        })
    }
    _onLoad(){
        console.log('_onLoad..')
        if(!this.state.videoLoaded){
            this.setState({
                videoLoaded:true,
            })
        }
    }
    _onProgress(data){
        let currentTime = data.currentTime
        let duration = data.playableDuration
        let percent = Number((currentTime/duration).toFixed(2))
        this.setState({
            isRePlay:false,
            isPlaying:true,
            duration:duration,
            currentTime:Number(currentTime.toFixed(2)),
            percent:percent,
            //得到duration后，将之转化为分+秒的格式
            min:Number((duration/60).toFixed(0)),
            sec:Number((duration%60).toFixed(0))
        })
    }
    _onEnd(){
        console.log('_onEnd..')
        this.setState({
            percent:1,
            isPaused:true,
            isRePlay:true,
            isPlaying:false,
            clickScreenShowShade:true
        })

    }
    _onError(){
        console.log('_onError..')
        this.setState({
            loadFailed:true,
        })
    }
    _rePlay(){
        console.log('点击了rePlay')
        this.setState({
            isPaused:!this.state.isPaused
        })
        if(this.state.isRePlay){
            this.refs.videoPlayer.seek(0)
        }
    }

    _playAndPause(){
        console.log('点击了播放&暂停')
        this.setState({
            isPaused:!this.state.isPaused
        })
        if(this.state.isRePlay){
            this.refs.videoPlayer.seek(0)
        }
    }
    _fullScreen(){
        console.log('点击了全屏')
        this.refs.videoPlayer.presentFullscreenPlayer();
    }

    //ListView部分
    _renderRow(rowData){
        return(
            <View key={rowData._id}    //这个key是用来表示用户的唯一的
                  style={styles.itemBox}>
                <View style={styles.replyByBox}>
                    <Image style={styles.replyByAvator} source={{uri:rowData.replyBy.avator}}/>
                    <Text style={styles.replyByNickname}>{rowData.replyBy.nickname}</Text>
                </View>
                <Text style={styles.comment}>{rowData.content}</Text>
            </View>
        )
    }
    componentDidMount(){
        this._fetchData()
    }

    _fetchData(){
        let that = this
        this.setState({
            isLoadingTail:true,
        })
        //请求数据
        request.get(config.api.base+config.api.comment,{
            accessToken:'abc',
            creation:123,
        })
            .then((data)=>{
                if(data.success){
                    let items = cachedResults.items.slice()  //对cachedResults里面的items数组进行复制
                    items = items.concat(data.data)  //将请求回来的数据追加到items数组中。
                    cachedResults.nextPage += 1      //每次请求完成后，page+1
                    cachedResults.items = items
                    cachedResults.total = data.total
                    setTimeout(()=>{                     //这里有了一个setTimeout，就需要对this的指向，重新定义
                        that.setState({
                            isLoadingTail:false,
                            dataSource:that.state.dataSource.cloneWithRows(cachedResults.items)
                        })
                    },20)
                }
            })
            .catch((error)=>{
                this.setState({
                    isLoadingTail:false,
                    loadDataFailed:true,
                })
                console.error('错误信息是：'+error)
            })
            .done();
    }

    _renderHeader(){
        let data = this.props.navigation.state.params.rowData
        return (
            <View style={styles.listViewHeaderBox}>
                <View style={styles.playTitleBox}>
                    <View style={styles.bdBox}>
                        <Text style={styles.bdText}>播单</Text>
                    </View>
                    <Text style={styles.videoTitle} numberOfLines={1}>{data.title}</Text>
                </View>
                <View style={styles.userBox}>
                    <View style={styles.authorBox}>
                        <Image style={styles.avatorImage} source={{uri:data.author.avator}}/>
                        <Text style={styles.authorText}>{data.author.nickname}</Text>
                    </View>
                    <Text style={styles.synopsis}>{data.synopsis}</Text>
                </View>
                <Text style={styles.commentTitle}>评论</Text>
                <Text style={styles.commentInput} onPress={this._popupModal.bind(this)}>评论一下这个逗比...</Text>
                <Text style={styles.otherCommentTitle}>精彩评论</Text>
            </View>
        )
    }

    _hasMore(){
        return cachedResults.items.length !== cachedResults.total
    }
    _fetchMoreData(){
        if(!this._hasMore() || this.state.isLoadingTail){  //如果没有更多数据或者正在刷新的时候
            return
        }
        this._fetchData()
    }
    _renderFooter(){
        return (
            !this._hasMore() && !this.state.isLoadingTail?
                <View style={styles.loadingMore}>
                    <Text style={styles.loadingMoreText}>没有更多数据了</Text>
                </View>
                : <View style={styles.loadingMore}>
                <ActivityIndicator color={'#ff8857'}/>
                <Text style={styles.loadingMoreText}>正在刷新中...</Text>
            </View>
        )
    }

    render(){
       let data = this.props.navigation.state.params.rowData
        console.log('nickname:'+data.author.nickname)
       return(
           <View style={styles.container}>
                   <TouchableWithoutFeedback onPress={this._pausedMovie.bind(this)}>
                       <View style={[styles.movieContent,this.state.clickScreenShowShade ? {opacity:0.7}:null]}>
                        <Video source={//{uri:data.video}
                                require('../video/wx_camera.mp4')
                                        } // Looks for .mp4 file (background.mp4) in the given expansion version.
                               ref={'videoPlayer'}
                               rate={this.state.rate}                   //
                               volume={5}                 // 0 is muted, 1 is normal.
                               muted={this.state.muted}                // 是否静音
                               paused={this.state.isPaused}               // Pauses playback entirely.
                               resizeMode={this.state.resizeMode}          // Fill the whole screen at aspect ratio.
                               repeat={this.state.repeat}                // 是否重复播放
                               style={styles.backgroundVideo}

                               onLoadStart={this._onLoadStart.bind(this)} // Callback when video starts to load
                               onLoad={this._onLoad.bind(this)}    // Callback when video loads
                               onProgress={this._onProgress.bind(this)}    // Callback every ~250ms with currentTime
                               onEnd={this._onEnd.bind(this)}           // Callback when playback finishes
                               onError={this._onError.bind(this)}    // Callback when video cannot be loaded
                            />
                           {
                               this.state.clickScreenShowShade ?
                               <View style={styles.stateContainer}>
                                   <View style={styles.playStateBox}>
                                       <TouchableWithoutFeedback onPress={this._playAndPause.bind(this)}>
                                            <Image style={styles.playState} source={this.state.isPaused ? playIconT : pauseIconT}/>
                                       </TouchableWithoutFeedback>
                                   </View>
                                   <CountDownText // 倒计时
                                       style={styles.cd}
                                       countType='date' // 计时类型：seconds / date
                                       auto={true} // 自动开始
                                       afterEnd={() => {}} // 结束回调
                                       timeLeft={0} // 正向计时 时间起点为0秒
                                       step={1} // 计时步长，以秒为单位，正数则为正计时，负数为倒计时
                                       intervalText={(min, sec) =>  min + ':' + sec} // 定时的文本回调
                                   />
                                   <View style={styles.progressBoxT}>
                                       <View style={[styles.progressT,{width:width*0.5*this.state.percent}]}/>
                                   </View>
                                   <Text style={styles.totalTime}>{this.state.min}:{this.state.sec}</Text>
                                   <View style={styles.fullScreenBox}>
                                       <TouchableWithoutFeedback onPress={this._fullScreen.bind(this)}>
                                            <Image style={styles.fullScreen} source={fullScreen}/>
                                       </TouchableWithoutFeedback>
                                   </View>
                               </View>
                               :null
                           }
                           {
                               //加载视频失败的容错机制
                               this.state.loadFailed ?
                                   <View style={styles.loadFailedBox}>
                                       <Text style={styles.loadFaildText}>视频加载出错了,请稍后重试</Text>
                                   </View>
                                   :null
                           }
                           {
                               //加载图
                               !this.state.videoLoaded &&
                               <View style={styles.videoPre}>
                                   <ActivityIndicator/>
                               </View>
                           }
                           {
                                this.state.isPaused && this.state.videoLoaded ?
                                    <TouchableWithoutFeedback onPress={this._rePlay.bind(this)}>
                                        <View style={styles.pauseIconContainer}>
                                                <Image style={styles.pauseIcon} source={playIcon}/>
                                        </View>
                                    </TouchableWithoutFeedback>
                                    :null
                           }
                       </View>
                   </TouchableWithoutFeedback>
                   <ListView
                       dataSource={this.state.dataSource}
                       renderRow={(rowData) => this._renderRow(rowData)}
                       onEndReachedThreshold={20}
                       renderHeader={this._renderHeader.bind(this)}
                       onEndReached={this._fetchMoreData.bind(this)}
                       renderFooter={this._renderFooter.bind(this)}
                       showsVerticalScrollIndicator={false} //隐藏滑动条
                       enableEmptySections={true}
                   />

               <Modal
                   animationType={"fade"}
                   transparent={false}
                   visible={this.state.modalVisible}
                   onRequestClose={()=>{this._closeComment.bind(this)}}>

                   <View style={styles.commentContainer}>
                       <TouchableWithoutFeedback onPress={this._closeComment.bind(this)}>
                           <Image style={styles.closeImage} source={closeIcon}/>
                       </TouchableWithoutFeedback>
                       <View style={styles.commentArea}>
                           <Text style={styles.commentTitles}>评论一个</Text>
                           <TextInput
                               style={styles.inPut}
                               multiline={true}
                               numberOfLines={5}
                               autoFocus={true}        //自动获取焦点
                               placeholder='快夸赞一下这个逗逼...' //占位符
                               returnKeyType='send'
                               underlineColorAndroid='transparent'
                               defaultValue='评论'
                               onChangeText={(comments)=>{        //当输入框中的文字发生改变时，将改变后的值赋值给初始的comments
                                   this.setState({
                                       comments
                                   })
                               }}
                           />
                       </View>
                       <CustomButton
                            name='评论'
                            width={width*0.9}
                            onPress={()=>this._commitComment()}
                       />
                   </View>
               </Modal>
           </View>
       );
    }
}
const styles = StyleSheet.create({
    container:{
        flex:1,
    },

    //视频加载失败  -- start --
    loadFailedBox:{
        alignSelf:'center',
        justifyContent:'center',
        alignItems:'center',
    },
    loadFailedText:{
        textAlign:'center',
        fontSize:14,
        color:'#fff'
    },
    //视频加载失败  -- end --

    //遮罩框部分 --start--
    stateContainer:{
        position:'absolute',
        bottom:10,
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'row',
        width:width,
        height:width*0.04
    },
    playStateBox:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    playState:{
        width:20,
        height:20,
        paddingTop:2,
        alignSelf:'center',
    },
    cd:{
        flex:1,
        textAlign:'center',
        color:'#fff',
        fontSize:12,
    },
    progressBoxT:{
        flex:4,
        width:width*0.5,
        height:2,
        backgroundColor:'#666666'
    },
    progressT:{
        height:1.5,
        backgroundColor:'#ff8857'
    },
    totalTime:{
        flex:1,
        textAlign:'center',
        color:'#fff',
        fontSize:12,
    },
    fullScreenBox:{
        justifyContent:'center',
        alignItems:'center',
        flex:1,
    },
    fullScreen:{
        width:14,
        height:14,
    },
    //遮罩框部分 --end--

    //视频区域部分
    movieContent:{
        backgroundColor:'#000',
        width:width,
        height:width*0.56
    },
    progressBox:{
        width:width,
        height:2,
        backgroundColor:'#666'
    },
    progress:{
        height:1.5,
        backgroundColor:'#ff8857'
    },
    videoPre:{
        position:'absolute',
        left:width/2-23,
        top:width*0.28-23,
        width:46,
        height:46,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#000'
    },
    pauseIconContainer:{
        position:'absolute',
        left:width/2-23,
        top:width*0.28-23,
        borderWidth:1.5,
        borderColor:'rgba(255,255,255,0.5)',
        borderRadius:23,
        width:46,
        height:46,
    },
    pauseIcon:{
        position:'absolute',
        top:8,
        left:10,
        width:28,
        height:28,
    },
    backgroundVideo:{
        flex:1,
    },
    VideosHome:{
        position:'absolute',
        bottom:0,
        right:0,
    },

    //ListView部分
    //header
    listViewHeaderBox:{
        flex:1,
       width:width,
       justifyContent:'center',
       padding:6,
    },
    playTitleBox:{
        flexDirection:'row',
        alignItems:'center',
        width:width,
        height:30,
        justifyContent:'center',
    },
    bdBox:{
        justifyContent:'center',
        alignItems:'center',
        position:'absolute',
        top:6,
        left:6,
    },
    bdText:{
        backgroundColor:'#ff8857',
        color:'#fff',
        fontSize:12,
        textAlign:'center',
    },
    videoTitle:{
        fontSize:12,
        textAlign:'center',
        alignSelf:'center'
    },
    userBox:{
        width:width,
        flexDirection:'row',
        alignItems:'center',
        marginTop:6,
        marginBottom:6,
    },
    authorBox:{
        justifyContent:'flex-start'
    },
    avatorImage:{
        width:50,
        height:50,
        borderWidth:1,
        borderRadius:23,
        alignSelf:'center',
    },
    authorText:{
        fontSize:12,
        textAlign:'center'
    },
    synopsis:{
        fontSize:14,
        textAlign:'center',
    },
    commentTitle:{
        fontSize:16,
    },
    commentInput:{
        marginTop:3,
        borderWidth:0.8,
        borderColor:'#999',
        color:'#999',
        fontSize:14,
        height:60,
        marginBottom:3,
    },
    otherCommentTitle:{
        fontSize:14,
    },

    //视频评论区域样式
    itemBox:{
        width:width,
        flexDirection:'row',
        alignItems:'center',
        marginTop:6,
    },
    replyByBox:{
        justifyContent:'flex-start',
        width:width*0.22
    },
    replyByAvator:{
        width:40,
        height:40,
        borderWidth:1,
        borderRadius:23,
        alignSelf:'center',
    },
    replyByNickname:{
        fontSize:10,
        color:'#888',
        textAlign:'center'
    },
    comment:{
        fontSize:12,
        textAlign:'center'
    },

    //评论人ListView的上拉加载
    loadingMore:{
        marginVertical:10
    },
    loadingMoreText:{
        color:'#777',
        textAlign:'center'
    },

    //modal弹窗部分
    commentContainer:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        alignSelf:'flex-start',
        width:width,
        position:'absolute',
        top:30,
        left:0,
    },
    commentText:{
        color:'rgba(0,0,0,0.5)'
    },
    inPut:{
        borderWidth:0.8,
        borderColor:'#aaaaaa',
        height:80,
        width:width*0.9,
        marginTop:6,
        marginBottom:20,
    },
    closeImage:{
        alignSelf:'center',
        width:26,
        height:26,
    },
    commentArea:{
        alignSelf:'center',
        width:width*0.9,
    },
    commentTitles:{
        fontWeight:'500',
        alignSelf:'flex-start',
    },
})
