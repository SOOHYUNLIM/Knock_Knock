import React from 'react';
import {
    StyleSheet,
    View,
    Text
} from 'react-native';

import { WebView } from 'react-native-webview'
import * as Utils from './util/Util'


const About = ({ navigation }) => {
    Utils.getFetch("click?no="+String(navigation.getParam("no")))
    return (
        <View style={{flex:1}}>
            <Text>구매 페이지</Text>
            <WebView source={{ uri: navigation.getParam("url")}}/>
        </View>
    )
}

export default About