import firebase from 'react-native-firebase'

const basicUrl = "http://ec2-15-165-118-201.ap-northeast-2.compute.amazonaws.com:8080/kk/"

const Method = {GET: "GET", POST: "POST", PUT: "PUT", DELETE: "DELETE"}

const messaging = firebase.messaging()


export function comma(str) {
    str = String(str);
    return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
}

export async function getFCMToken() {
    await messaging.requestPermission()
    
    const fcmToken = await messaging.getToken()
    
    return fcmToken
}


export async function excuteFetch(url, method, data) {
    try {
        let response = await fetch(basicUrl + url, {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: data
        }
        )
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.log(error);
    }
}

export async function getFetch(url) {
    return excuteFetch(url, Method.GET)
}

export async function postFetch(url, data) {
    return excuteFetch(url, Method.POST, data)
}

export async function putFetch(url, data) {
    return excuteFetch(url, Method.PUT, data)
}