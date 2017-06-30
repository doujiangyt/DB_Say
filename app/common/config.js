/**
 * Created by ${豆浆} on 2017/6/26.
 */
'use strict'

module.exports ={
    header:{
        method:'POST',
        header:{
            'Accept':'application/json',
            'Content-Type':'application/json'
        }
    },
    api:{
        base:'http://rapapi.org/mockjs/21287/',
        creations:'api/creations',
        isLike:'api/isLike',
        comment:'api/comments'
    }
}

