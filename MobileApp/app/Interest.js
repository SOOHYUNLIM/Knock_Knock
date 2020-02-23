import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    Button,
    FlatList,
    Image,
    CheckBox
} from 'react-native';
import * as Utils from './util/Util'


const Interest = ({ arr }) => {
    
    const { categoryList, interests } = arr
    
    let check = {}

    const updateInterest = () => {
        let interests = []
        for(code in check) {
            if(check[code])  interests.push(code)
        }
        
        Utils.putFetch("updateInterest", JSON.stringify(interests))
    }

    const handleChange = (code) => {
        check[code] = !check[code]
    }

    const checkBox = categoryList.map(({code, keyword}) => {
        let state = interests.indexOf(code) ? false : true
        check[code] = state
        return <View key={code}><CheckBox value={state} onChange={() => handleChange(code)}/><Text>{keyword}</Text></View>
    })
    
    return (
        <View>
            {checkBox}
            <Button title="확인" onPress={updateInterest}/>
        </View>
    )
}

export default Interest