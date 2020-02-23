import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    TextInput,
    Button,
    Image,
    Alert
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/Ionicons'
import Menu from './Menu'
import * as Utils from './util/Util'


const Pick = ({ navigation }) => {

    const [text, setText] = useState("")

    const [info, setInfo] = useState({})

    const [product, setProduct] = useState(<Text>원하시는 상품명을 입력해주세요.</Text>)

    const { title, link, image, price, fee } = info
    
    useEffect(() => {
        console.log(info);
        if (Object.keys(info).length !== 0)
            setProduct(
            <View>
                <Text>{title}</Text>
                <Image style={{ width: 300, height: 300 }} source={{ uri: image }} />
                <Text onPress={()=> navigation.navigate('About', { url: link })}>구매하러 가기</Text>
                <Text><Icon name="md-pricetags" size={20} color="red" />{Utils.comma(price)}</Text>
                <Text><Icon name="md-boat" size={20} color="gray" />{fee == 0 ? '무료' : Utils.comma(fee)}</Text>
            </View>)
    }, [info])

    const handlePress = () => {
        const pick = {product: {title, price, fee, link, image}, wantedPrice: text}
        Object.keys(info).length === 0 ? Utils.getFetch("navershopping/"+text).then(result=>setInfo(result)) : Utils.postFetch("pick", JSON.stringify(pick)).then(result=>Alert.alert("PICK", result===201? "등록 성공!" : "이미 등록되어 있습니다."))
        setText("")
    }

    return (
        <LinearGradient colors={['#FFFFFF', '#FFEFBA']} style={style.container}>
            <Menu openDrawer={navigation.openDrawer} title={"최저가 검색"}></Menu>
            <View style={style.main}>
                {product}
                <TextInput
                    style={style.input}
                    onChangeText={(text) => setText(text)}
                    value={text}
                />
                <Button title="찾기" onPress={handlePress} />
            </View>
        </LinearGradient>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
    },
    main: {
        justifyContent: "center",
        textAlign: "center",
        alignContent: "center",
        alignSelf: "center",
        alignItems: "center"
    },
    input: {
        width: 300,
        height: 40, 
        borderColor: 'gray',
        borderWidth: 1
    }
})

export default Pick