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
import Modal from 'react-native-simple-modal'
import { WebView } from 'react-native-webview'
import LoginBtn from './LoginBtn'




const Login = ({ navigation }) => {

    const [socialLogin, setSocialLogin] = useState("")

    const [modal, setModal] = useState(false)

    const handlePress = (url) => {
        setSocialLogin(url)
        setModal(true)
    }

    const success = () => {
        //토큰 쏘기
        setModal(false)
        navigation.navigate("HOME")
    }

    return (
        <View style={style.container}>
            <Text style={style.title}>Login</Text>
            <Image style={{ width: '100%', height: 300 }} source={require('./img/mark.png')} />
            <View style={{ flexDirection: 'row' }}>
                <LoginBtn api="naver" fn={handlePress} />
                <LoginBtn api="kakao" fn={handlePress} />
                <LoginBtn api="facebook" fn={handlePress} />
                <LoginBtn api="google" fn={handlePress} />
            </View>

            <Modal style={style.md} open={modal} closeOnTouchOutside={false}>
                <View style={{ width:300, height:300 }}>
                    <WebView source={{ uri: socialLogin }} onMessage={(e)=>console.log("=====",e.nativeEvent.data)} />
                </View>
            </Modal>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    title: {
        fontSize: 50
    },
    md: {
        flex: 1
    }
})

export default Login