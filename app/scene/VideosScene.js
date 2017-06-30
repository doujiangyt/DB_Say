/**
 * Created by admin on 2017/6/19.
 */
import React,{Component} from 'react';
import {
    Image,
    Text,
    View,
    ListView,
    ActivityIndicator,
    StyleSheet,
    Dimensions,
    RefreshControl
} from 'react-native';

import Item from '../component/Item'
import VideoSceneToolBar from '../component/VideoSceneToolBar'

import request from '../common/request'
import config from '../common/config'

let failImage = require('../img/failImage.png')
const width = Dimensions.get('window').width
const height = Dimensions.get('window').height
let cachedResults = {
    nextPage:1,
    items:[],
    total:0,
}


export default class VideosScene extends Component{
    static navigationOptions = {
        header:(
            <VideoSceneToolBar/>
        )
    }
    constructor(props){
        super(props);
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state={
            isRefreshing:false,
            isLoadingTail:false,
            loadDataFailed:false,
            dataSource:ds.cloneWithRows([])
        }
    }
    _renderRow(rowData){
        return(
            <Item
                rowData = {rowData}
                navigation={this.props.navigation}
            />
        )
    }
    render(){
          return  !this.state.dataSource ? this._renderLoading() : this._renderFl()
    }
    _renderLoading(){
        return(
            <View style={styles.loadingContainer}>
                <ActivityIndicator
                    style={styles.loading}
                    size="large"
                    color='#ff8857'
                />
                <Text style={styles.text}>正在加载中...</Text>
            </View>
        )
    }
    _renderFl(){
        return(
            <View style={styles.container}>
            {
                this.state.loadDataFailed ?
                    <View style={styles.failedBox}>
                        <Image source={failImage} style={styles.fialImage} resizeMethod={'auto'}/>
                    </View>
                    :<ListView
                    dataSource={this.state.dataSource}
                    renderRow={(rowData) => this._renderRow(rowData)}
                    onEndReachedThreshold={20}  //等到快要滑动到距离底部20的时候就加载数据
                    onEndReached={this._fetchMoreData.bind(this)}
                    renderFooter={this._renderFooter.bind(this)}
                    showsVerticalScrollIndicator={false} //隐藏滑动条
                    enableEmptySections={true}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this._onRefresh.bind(this)}
                            tintColor="#ff0000"
                            title="拼命加载中..."
                            titleColor="#ff8857"
                            colors={['#ff0000', '#00ff00', '#0000ff']}
                            progressBackgroundColor="#ffff00"
                        />
                    }
                />
            }
            </View>
        )
    }
    componentDidMount(){
        this._fetchData(1)
    }
    _fetchData(page){
        let that = this
        page !== 0 ?
        this.setState({
            isLoadingTail:true,
        })
        :this.setState({
            isRefreshing:true,
        })
        //请求数据
        request.get(config.api.base+config.api.creations,{
            accessToken:'abc',
            page:page
        })
            .then((data)=>{
                if(data.success){
                    let items = cachedResults.items.slice()  //对cachedResults里面的items数组进行复制
                    if(page!==0){    //上拉加载
                        items = items.concat(data.data)  //将请求回来的数据追加到items数组中。
                        cachedResults.nextPage += 1      //每次请求完成后，page+1
                    }else{         //下拉刷新
                        items = data.data.concat(items)  //因为这个时候items为空，所以在新请求回来的数据后面追加items,他不用page+1,因为每次下拉刷新的page为0
                    }
                    cachedResults.items = items
                    cachedResults.total = data.total
                    setTimeout(()=>{                     //这里有了一个setTimeout，就需要对this的指向，重新定义
                        if(page!==0){
                            that.setState({
                                isLoadingTail:false,
                                dataSource:that.state.dataSource.cloneWithRows(cachedResults.items)
                            })
                        }else{
                            that.setState({
                                isRefreshing:false,
                                dataSource:that.state.dataSource.cloneWithRows(cachedResults.items)
                            })
                        }
                    },20)
                }
            })
            .catch((error)=>{
                page !==0 ?
                 this.setState({
                    isLoadingTail:false,
                    loadDataFailed:true,
                 })
                 :this.setState({
                    isRefreshing:false,
                    loadDataFailed:true,
                 })
                console.error('错误信息是：'+error)
            })
            .done();
    }
    _onRefresh(){
        if(!this._hasMore() || this.state.isRefreshing){
            return
        }
        this._fetchData(0)
    }
    _hasMore(){
        return cachedResults.items.length !== cachedResults.total
    }
    _fetchMoreData(){
        if(!this._hasMore() || this.state.isLoadingTail){  //如果没有更多数据或者正在刷新的时候
            return
        }
        let page = cachedResults.nextPage
        this._fetchData(page)
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
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#f5fcff'
    },
    failedBox:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    fialImage:{
        flex:1,
        width:width,
        height:height-50
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
    loadingMore:{
        marginVertical:10
    },
    loadingMoreText:{
        color:'#777',
        textAlign:'center'
    }


})
