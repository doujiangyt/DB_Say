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
    Slider
} from 'react-native';
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
let volume = require('../img/volume.png')
let volumeMute = require('../img/volume_mute.png')
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

            value:0,

            //是否有声音
            volume:1,
            isVolume:true,

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
            min:'00',
            sec:'00',
            videoMin:'00',
            videoSec:'00',
            //ListView部分
            dataSource:ds.cloneWithRows([]),
            isLoadingTail:false,


            //评论部分
            isSending:false,
            comments:'',
            modalVisible:false,

        }
    }

    render(){
        let data = this.props.navigation.state.params.rowData
        return(
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={this._pausedMovie.bind(this)}>
                    <View style={[styles.movieContent,this.state.clickScreenShowShade ? {opacity:0.7}:null]}>
                        <Video source={//{uri:data.video}
                            require('../.././android/app/src/main/res/raw/wx_camera.mp4')
                            //{uri: "wx_camera", mainVer: 1, patchVer: 0}
                        } // Looks for .mp4 file (background.mp4) in the given expansion version.
                               ref={'videoPlayer'}
                               rate={this.state.rate}                   //
                               volume={this.state.volume}                 // 0 is muted, 1 is normal.
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

                                    <Text style={styles.cd}>{this.state.videoMin}:{this.state.videoSec}</Text>

                                    {/*<View style={styles.progressBoxT}>
                                        <View style={[styles.progressT,{width:width*0.5*this.state.percent}]}/>
                                    </View>*/}
                                    <Slider
                                        style={styles.slider}
                                        value={this.state.value}
                                        onValueChange={(value)=>this._onValueChange(value)}
                                        minimumTrackTintColor={'#ff8857'}
                                        maximumTrackTintColor={'#ff8857'}
                                        thumbTintColor={'#fff'}
                                        thumbStyle={styles.thumbStyle}
                                    />

                                    <Text style={styles.totalTime}>{this.state.min}:{this.state.sec}</Text>

                                    <View style={styles.volumeBox}>
                                        <TouchableWithoutFeedback onPress={this._volumeBox.bind(this)}>
                                            <Image style={styles.volumeImage} source={this.state.isVolume ? volume:volumeMute}/>
                                        </TouchableWithoutFeedback>
                                    </View>

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
    _changeTimes(min,sec){
        if(sec < 10){
            sec = '0' + sec;
        }
        if (sec > 59){
            min++;
            if (min < 9){
                min = '0' + min++;
            } else {
                min = min++;
            }
            sec = '00';
        }
        this.setState({
            videoMin:min,
            videoSec:sec
        })
    }

    _onValueChange(value){
        let duration = this.state.duration
        let videoMin = Math.trunc((duration*value/60))
        let videoSec = Number((duration*value%60).toFixed(0))
        this._changeTimes(videoMin,videoSec)
        this.setState({
            value:value,
            isPaused:false,
            //播放时间就等于总时长*value值
            //videoMin:videoMin,
            //videoSec:videoSec
        })
        if(this.reIntervar){
            this.reIntervar && clearInterval(this.reIntervar)
        }
        if(this.setIntervar){
            this._stopTimer()
        }
        //然后就是从这个时间开始计时
        this.reIntervar = setInterval(()=>{
            let secTime = ++this.state.videoSec;
            let minTime = this.state.videoMin;

            if(secTime < 10){
                secTime = '0' + secTime;
            }
            if (secTime > 59){
                minTime++;
                if (minTime < 9){
                    minTime = '0' + minTime++;
                } else {
                    minTime = minTime++;
                }
                secTime = '00';
            }
            let videoTime = minTime * 60 + secTime;
            let videoAllTime = Number(this.state.duration.toFixed(0))

            if(videoTime > videoAllTime){
                this.reIntervar && clearInterval(this.reIntervar)
            }
            //更新状态机
            this.setState({
                videoSec:secTime,
                videoMin:minTime,
            });

        },1000);

        //指向滚动条的位置播放
        this.refs.videoPlayer.seek(value)

    }
    _pausedMovie(){
        //点击后暂停播放视频
        console.log('点击了屏幕')
        this.setState({
            clickScreenShowShade:!this.state.clickScreenShowShade,
        })

    }
    //弹出modal
    _popupModal(){
        console.log('有焦点了')
        this.setState({
            modalVisible:true,
        })
    }
    //关闭modal
    _closeComment(){
        this.setState({
            modalVisible:false,
        })
    }
    //点击提交评论,提交完成后关闭modal
    _commitComment(){
        console.log('点击了评论')
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
    //video开始下载
    _onLoadStart(){
        console.log('_onLoadStart..')
        this.setState({
            loadFailed:false,
        })
    }
    //video下载完成
    _onLoad(){
        console.log('_onLoad..')
        if(!this.state.videoLoaded){
            this.setState({
                videoLoaded:true,
            })
        }
        this._startTimer()
    }


    _onProgress(data){
        let currentTime = data.currentTime
        let duration = data.playableDuration
        let percent = Number((currentTime/duration).toFixed(2))
        //let min = Number((duration/60).toFixed(0))
        let min = Math.trunc(duration/60)
        min = min <10 ?`0${min}`:min
        this.setState({
            isRePlay:false,
            isPlaying:true,
            duration:duration,
            currentTime:Number(currentTime.toFixed(2)),
            percent:percent,
            value:percent,
            //得到duration后，将之转化为分+秒的格式
            min:min,
            sec:Number((duration%60).toFixed(0))
        })
    }
    _onEnd(){
        //原则是分钟取舍，秒钟取入
        console.log('_onEnd..')
        let duration = this.state.duration
        let videoMin = Math.trunc(duration/60)
        let videoSec = Number((duration%60).toFixed(0))

        if(videoSec < 10){
            videoSec = '0' + videoSec;
        }
        if (videoSec > 59){
            videoMin++;
            if (videoMin < 9){
                videoMin = '0' + videoMin++;
            } else {
                videoMin = videoMin++;
            }
            videoSec = '00';
        }
        this.setState({
            percent:1,
            value:1,
            isPaused:true,
            isRePlay:true,
            isPlaying:false,
            clickScreenShowShade:true,

            videoMin:this.state.min,
            videoSec:this.state.sec
        })
        //在播放结束时，时间都要对上，且要停止自动计时
        if(this.setIntervar){
            this._stopTimer()
        }
        if(this.reIntervar){
            this.reIntervar && clearInterval(this.reIntervar)
        }
    }
    _onError(){
        console.log('_onError..')
        this.setState({
            loadFailed:true,
        })
    }
    //重新播放
    _rePlay(){
        console.log('点击了rePlay')
        this.setState({
            isPaused:!this.state.isPaused,
            videoSec:'00',
            videoMin:'00',
        })
        if(this.state.isRePlay){
            this.refs.videoPlayer.seek(0)
        }
        this._startTimer()
    }
    //点击了遮罩框的播放和暂停按钮
    _playAndPause(){
        console.log('点击了播放&暂停')
        this.setState({
            isPaused:!this.state.isPaused
        })
        if(this.state.isPaused){
            this.setState({
                videoMin:'00',
                videoSec:'00'
            })
        }
        if(this.state.isRePlay){
            this.refs.videoPlayer.seek(0)
            this._startTimer()
        }
    }
    //点击后是否静音
    _volumeBox(){
        this.setState({
            isVolume:!this.state.isVolume
        })
        !this.state.isVolume ?
            this._startVolume():this._stopVolume()
    }
    //开启声音
    _startVolume(){
        this.setState({
            volume:1,
        })
    }
    //关闭声音
    _stopVolume(){
        this.setState({
            volume:0,
        })
    }
    //全屏
    _fullScreen(){
        console.log('点击了全屏')
        this.refs.videoPlayer.presentFullscreenPlayer();
    }
    //开启定时器
    _startTimer(){
        //每次开启之前都清空一下计时器
        if(this.setIntervar){
            this._stopTimer()
        }
        //自动计时
        this.setIntervar = setInterval(()=>{
            let secTime = ++this.state.videoSec;
            let minTime = this.state.videoMin;
            if(secTime < 10){
                secTime = '0' + secTime;
            }
            if (secTime > 59){
                minTime++;
                if (minTime < 9){
                    minTime = '0' + minTime++;
                } else {
                    minTime = minTime++;
                }
                secTime = '00';
            }
            let videoTime = minTime * 60 + secTime;
            let videoAllTime = Number(this.state.duration.toFixed(0))

            if(videoTime > videoAllTime){
                this._stopTimer()
            }
            //更新状态机
            this.setState({
                videoSec:secTime,
                videoMin:minTime,
            });
        },1000);
    }
    // 关闭定时器
    _stopTimer(){
        this.setIntervar && clearInterval(this.setIntervar);
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
    //加载数据
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
    //ListView的Header
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
    //是否还有更多数据
    _hasMore(){
        return cachedResults.items.length !== cachedResults.total
    }
    //加载更多数据
    _fetchMoreData(){
        if(!this._hasMore() || this.state.isLoadingTail){  //如果没有更多数据或者正在刷新的时候
            return
        }
        this._fetchData()
    }
    //ListView的footer
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
    slider:{
        width:width*0.5,
    },
    thumbStyle:{
        width:1,
        height:1,
        borderWidth:3,
        borderRadius:6,
        borderColor:'#fff'
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
    volumeBox:{
        justifyContent:'center',
        alignItems:'center',
        flex:0.5,
    },
    volumeImage:{
        width:18,
        height:18,
        alignSelf:'center'
    },

    fullScreenBox:{
        justifyContent:'center',
        alignItems:'center',
        flex:0.8,
    },
    fullScreen:{
        width:14,
        height:14,
        alignSelf:'center'
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
        justifyContent:'space-between',
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
        textAlign:'center',
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
