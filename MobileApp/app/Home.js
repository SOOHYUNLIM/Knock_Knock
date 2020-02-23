import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Button,
    Alert
} from 'react-native';
import { NavigationEvents } from 'react-navigation'
import LinearGradient from 'react-native-linear-gradient'
import Menu from './Menu'
import TodoList from './TodoList';
import * as Utils from './util/Util'


const Home = ({ navigation }) => {

    const fcmToken = Utils.getFCMToken()

    console.log(fcmToken);
    

    const [arr, setArr] = useState([])

    const { navigate } = navigation

    useEffect(() => {
        Utils.getFetch("list").then(result => result.status===401 ? navigate('Login') : setArr(result))
    }, [])

    return (
        <LinearGradient colors={['#FFEEEE', '#DDEFBB']} style={style.container}>
            <Menu openDrawer={navigation.openDrawer} title={"Knock Knock"} />
            <View>
                </View>
            <View style={style.content}>
                <NavigationEvents onWillFocus={() => Utils.getFetch("list").then(result => result.status===401 ? navigate('Login') : setArr(result))} />
                <TodoList arr={arr} navigate={navigate}></TodoList>
            </View>
        </LinearGradient>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flex: 1,
        flexDirection: 'row',
        alignItems: "center",
        alignContent: "center"
    },
    title: {
        fontSize: 50,
        textAlign: "center",
    },
    content: {
        flex: 9,
    }
})

export default Home