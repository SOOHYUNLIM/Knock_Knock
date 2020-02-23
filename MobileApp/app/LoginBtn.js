import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    Image,
    TouchableHighlight
} from 'react-native';

const LoginBtn = ({ api, fn }) => {

    const url = {
        google: 'http://ec2-15-165-118-201.ap-northeast-2.compute.amazonaws.com:8080/oauth2/authorization/google',
        naver: 'http://ec2-15-165-118-201.ap-northeast-2.compute.amazonaws.com:8080/oauth2/authorization/naver',
        kakao: 'http://ec2-15-165-118-201.ap-northeast-2.compute.amazonaws.com:8080/oauth2/authorization/kakao',
        facebook: 'http://ec2-15-165-118-201.ap-northeast-2.compute.amazonaws.com:8080/oauth2/authorization/facebook'
    }

    const location = {
        naver: require('./img/naver.png'),
        kakao: require('./img/kakao.png'),
        google: require('./img/google.png'),
        facebook: require('./img/facebook.png')
    }

    return (
        <TouchableHighlight onPress={() => fn(url[api])}>
            <Image style={style.socialImg} source={location[api]} />
        </TouchableHighlight>
    )
}

const style = StyleSheet.create({
    socialImg: {
        width: 60,
        height: 60,
        marginLeft: 10,
        marginRight: 10
    },
})

export default LoginBtn