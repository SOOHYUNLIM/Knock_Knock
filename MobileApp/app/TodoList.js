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
    Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import * as Utils from './util/Util'

const TodoList = ({ arr, navigate }) => {

    const handlePress = (link, no) => {
        navigate('About', { url: link, no: no })
    }

    const list = arr.map(({no, product }) =>
        <View key={no} style={style.list}><Image style={{ width: 150, height: 150 }} source={{ uri: product.image }} />
            <View style={style.info}>
                <Text numberOfLines={2} style={style.title} onPress={() => handlePress(product.link, no)}>{product.title}</Text>
                <Text><Icon name="md-pricetags" size={20} color="red"/>{Utils.comma(product.price)}</Text>
                <Text><Icon name="md-boat" size={20} color="gray"/>{product.fee == 0 ? '무료' : Utils.comma(product.fee)}</Text>
            </View>
        </View>)

    return (
        <ScrollView
            contentInsetAdjustmentBehavior="automatic">
            {list}
        </ScrollView>
    )
}
const style = StyleSheet.create({
    list: {
        flex: 1,
        flexDirection: 'row',
        // backgroundColor: 'rgba(255, 255, 255, 0.3)',
        marginLeft: 20,
        marginRight: 20
    },
    info: {
        alignSelf: "center",
        margin: 10,
    },
    title: {
        fontSize: 20,
        fontFamily: "monospace",
        fontWeight: "900",
        width:'40%'
    }
})

export default TodoList