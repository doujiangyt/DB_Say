/**
 * 网络的异步请求封装
 * Created by ${豆浆} on 2017/6/26.
 */
'use strict'
import queryString from 'query-string'
import _ from 'lodash'
import config from './config'
import Mock from 'mockjs'
let request = {}




request.get = (url,params)=>{
    if(params){
        url+= '?'+queryString.stringify(params)
    }

    return fetch(url)
        .then((response)=>response.json())
        .then((response)=>Mock.mock(response))   //将来到线上的环境时，将这个给删掉就可以了
}


request.post = (url,body)=>{
    let options = _.extend(config.header,{
        body:JSON.stringify(body)
    })

    return fetch(url,options)
        .then((response) =>response.json())
        .then((response) =>Mock.mock(response))
}

module.exports = request