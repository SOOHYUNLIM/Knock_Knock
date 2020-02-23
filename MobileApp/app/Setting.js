import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    Button,
    BackHandler,
    Alert
} from 'react-native';
import Interest from './Interest'
import TodoList from './TodoList';
import Menu from './Menu'
import * as Utils from './util/Util'


const Setting = ({ navigation }) => {

    const [content, setContent] = useState(null)

    const handlePress = (btn) => {
        if (btn === "PICK") Utils.getFetch("pickList").then(result=>setContent(<TodoList arr={result} navigate={navigation.navigate}/>))
        else if (btn === "SET") Utils.getFetch("getInterestList").then(result=>setContent(<Interest arr={result}/>))
        else if (btn === "LOGOUT")
            Utils.postFetch("logout?token=" + decodeURIComponent(Utils.getFCMToken()))
                .then(() => {
                    Alert.alert("LOGOUT", "앱을 종료합니다!")
                    BackHandler.exitApp()
                })
    }

    return (
        <View style={style.container}>
            <Menu openDrawer={navigation.openDrawer}></Menu>
            <View style={style.btns}>
                <Button title={"PICK 목록"} onPress={() => handlePress("PICK")} />
                <Button title={"관심사 설정"} onPress={() => handlePress("SET")} />
                <Button title={"로그아웃"} onPress={() => handlePress("LOGOUT")} />
            </View>
            <View>
                {content}
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'skyblue'
    },
    btns: {
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: "center",
        justifyContent: "center"
    }
})

export default Setting