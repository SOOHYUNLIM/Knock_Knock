import React from 'react';
import {
    StyleSheet,
    View,
    Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'

const Menu = ({ openDrawer, title }) => {

    return (
        <View style={style.header}>
            <Icon name="md-apps" size={50} color="black" onPress={openDrawer} style={style.menu} />
            <Text style={style.title}>{title}</Text>
        </View>
    )
}
const style = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "flex-start"
    },
    title: {
        fontSize: 50,
        fontStyle: "italic",
        textAlign: "center",
        fontFamily: "sans-serif-medium",
        fontWeight: "900",
        textShadowColor: 'gray',
        textShadowOffset: { width: 2, heighSSSt: 2 },
        textShadowRadius: 3
    },
    menu: {
        backgroundColor: "rgba(255,223,186, 0.5)",
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 10
    }
})
export default Menu