const $login = $('#login')
const $interest = $('#interest')
const $waiting = $('#waiting')

const $leftContent = $(".leftContent")
const $rightContent = $(".rightContent")
const $centerContent = $(".centerContent")
const $title = $(".title")
const $date = $(".date")

const Social = Object.freeze({
    google: 'http://ec2-15-165-118-201.ap-northeast-2.compute.amazonaws.com:8080/oauth2/authorization/google',
    naver: 'http://ec2-15-165-118-201.ap-northeast-2.compute.amazonaws.com:8080/oauth2/authorization/naver',
    kakao: 'http://ec2-15-165-118-201.ap-northeast-2.compute.amazonaws.com:8080/oauth2/authorization/kakao',
    facebook: 'http://ec2-15-165-118-201.ap-northeast-2.compute.amazonaws.com:8080/oauth2/authorization/facebook'
})
const Method = Object.freeze({
    GET: 'GET', POST: 'POST', PUT: 'PUT', DELETE: 'DELETE'
})

const HttpStatus = Object.freeze({
    OK: 200, MOVED_PERMANENTLY: 301, NO_CONTENT: 204, CREATED: 201
})

const messaging = (function () {
    const config = Object.freeze({
        apiKey: "AIzaSyB5h1dtyUXyYroO4ZengUlSKCa93-WoRnU",
        authDomain: "jarvis-77f82.firebaseapp.com",
        databaseURL: "https://jarvis-77f82.firebaseio.com",
        projectId: "jarvis-77f82",
        storageBucket: "jarvis-77f82.appspot.com",
        messagingSenderId: "172501072688",
        appId: "1:172501072688:web:17b57e04673ab8351ba6f5",
        measurementId: "G-WJ48JZCEDP"
    })

    firebase.initializeApp(config)

    return firebase.messaging()
})()

const basieUrl = "http://ec2-15-165-118-201.ap-northeast-2.compute.amazonaws.com:8080/kk/"
// const basieUrl = "http://localhost:8080/kk/"

var prevAjax = null
var checkingData = null

$(document).ready(function () {

    $(".socialLogin").on('click', function (event) {
        socialLogin(Social[this.getAttribute('data-site')])
    })

    $("#checkBtn").on('click', function (event) {
        $("#main").addClass("pick");
        $title.html("<span class=\"ptit3\">잠시만 기다려주세요!</span>")
        $date.text("Sorry! Just a moment plz.")
        resetContent()
        resetActive()
        event.target.setAttribute("class", "active")
        setTimeout(() =>
                getCurrentTabUrl(url => new AjaxBuilder().url("check").method(Method.GET).data({url: encodeURIComponent(url)})
                    .success((data, status, xhr) => {
                        if (xhr.status === HttpStatus.OK) {
                            pickMe(data)
                        } else {
                            $title.html("<span class=\"ptit3\">지원하지 않는 쇼핑몰 입니다.</span>")
                            $date.html("<span class=\"ddate\">원하시는 상품명을 입력해주세요.</span>")
                            $centerContent.html('<div class="exp01"><input type="text" class="wantedTitle" placeholder="1~20자 내로 입력해주세요."><span class="naverBtn">찾기</span></div>')
                        }
                    })
                    .build())
            , 100)
    })

    $(".content").on('click', '.pickBtn', function (event) {
        checkingData.wantedPrice = uncomma(document.getElementsByClassName('wantedPrice')[0].value)
        let pick = {
            product: {
                title: checkingData.title,
                price: checkingData.price,
                fee: checkingData.fee,
                link: checkingData.link,
                image: checkingData.image
            }, wantedPrice: checkingData.wantedPrice
        }
        new AjaxBuilder().method(Method.POST).url("pick").data(JSON.stringify(pick)).success(status => status === HttpStatus.CREATED ? swal("Pick 완료!", "", "success", {className: 'swalSize'}) : swal("이미 등록되어있습니다!", "", "error")).build()
    }).on('keyup', '.wantedPrice', function (event) {
        inputNumberFormat(this)
    }).on('click', '.productTitle', function (event) {
        new AjaxBuilder().method(Method.GET).url("click").data({no: this.getAttribute("data-no")}).build()
    }).on('click', '.naverBtn', event => {
        $waiting.css('display', 'block')
        let title = document.getElementsByClassName('wantedTitle')[0].value
        setTimeout(function () {
            new AjaxBuilder().method(Method.GET).url("navershopping/" + title).success(data => pickMe(data)).build()
        }, 500)
    }).on('click', '#logout', event => {
            getThisToken()
        }
    ).on('click', '#interestBtn', event => {
        new AjaxBuilder().url("getInterestList").method(Method.GET)
            .success(data => {
                let $leftInterest = $(".leftInterest")
                let $rightInterest = $(".rightInterest")
                $leftInterest.html('')
                $rightInterest.html('')
                let cnt = 0
                Array.from(data.categoryList).forEach(category => {
                    cnt++ % 2 === 0 ? $leftInterest.append(setTemplate("#interestTemplate", category)) : $rightInterest.append(setTemplate("#interestTemplate", category))
                })
                $("input:checkbox[name=category]").filter(function () {
                    return data.interests.indexOf(this.value) !== -1
                }).attr("checked", true);
                $(".centerInterest").html('<a href=\"#none\" id="saveInterestBtn">저장</a>')
                $interest.css('display', 'block')
            })
            .build()
    }).on('click', '#pickListBtn', event => {
        $leftContent.html('')
        $rightContent.html('')
        new AjaxBuilder().url("pickList").method(Method.GET).success(list => {
            let count = 0
            Array.from(list).forEach(item => count++ % 2 == 0 ? appendLeftContent("#pickListTemplate", item) : appendRightContent("#pickListTemplate", item))
        }).build()
    }).on('click', '.dropPick', function (event) {
        let $this = $(this)
        new AjaxBuilder().url("dropPick/" + $this.attr('data-no')).method(Method.DELETE).success(data => {
            swal("삭제 완료!", "", "success", {className: 'swalSize'})
            $this.parents(".container").remove()
        }).build()
    })
    $(".centerInterest").on('click', '#saveInterestBtn', event => {
        console.log("saveInterestBtn..............");
        let interests = new Array();
        $("input:checkbox[name=category]:checked").each((index, item) => interests.push(item.value))
        interests.length > 0 ? new AjaxBuilder().method(Method.PUT).url("updateInterest").data(JSON.stringify(interests)).success(status => {
            swal('설정 완료!', '', 'success', {className: 'swalSize'});
            $interest.css('display', 'none')
        }).build() : alert('하나 이상 선택해주세요!')
    })

    $("#infoSetBtn").on('click', event => {
        $("#main").removeClass("pick");
        resetContent()
        resetActive()
        event.target.setAttribute("class", "active")
        $title.text("My Page")
        $date.text("")
        $centerContent.html("<button class='snip1535' id='pickListBtn'>Pick 목록</button><button class='snip1535' id='interestBtn'>관심사 설정</button><button class='snip1535' id='logout'>로그아웃</button>")
    })

    $("#listBtn").on('click', event =>
        new AjaxBuilder().method(Method.GET).url("list").success(list => {
            let now = new Date()
            let hour = now.getHours()
            $title.html("<span class=\"ptit1\">Knock</span> <span class=\"ptit2\">Knock</span>")
            $date.html("<span class=\"pdate\">" + now.toLocaleDateString().replace(/ /gi, '').slice(0, -1) + (hour >= 12 ? ' PM ' + (hour - 12) : ' AM ' + hour) + '시 특가!</span>')
            resetContent()
            resetActive()
            event.target.setAttribute("class", "active")
            Array.from(list).forEach(item => item.no % 2 == 0 ? appendLeftContent("#listTemplate", item) : appendRightContent("#listTemplate", item))
        }).build())

    let modal = document.getElementById('interest');
    Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
            console.log('Notification permission granted.');
            // TODO(developer): Retrieve an Instance ID token for use with FCM.
            // ...
        } else {
            console.log('Unable to get permission to notify.');
        }
    });
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
    $("#listBtn").trigger('click')

    // new AjaxBuilder().url("getInterestList").method(Method.GET)
    //     .success(data=> {
    //         let $leftInterest = $(".leftInterest")
    //         let $rightInterest = $(".rightInterest")
    //         $leftInterest.html('')
    //         $rightInterest.html('')
    //         let cnt = 0
    //         Array.from(data.categoryList).forEach(category => {
    //             cnt++ % 2 === 0 ? $leftInterest.append(setTemplate("#interestTemplate", category)) : $rightInterest.append(setTemplate("#interestTemplate", category))
    //         })
    //     }).build()
})

function resetActive() {
    $("#listBtn").attr("class", "")
    $("#infoSetBtn").attr("class", "")
    $("#checkBtn").attr("class", "")
}


function comma(str) {
    str = String(str);
    return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
}

function uncomma(str) {
    str = String(str);
    return str.replace(/[^\d]+/g, '');
}

function inputNumberFormat(obj) {
    obj.value = comma(uncomma(obj.value));
}

function setTemplate(templateName, data) {
    let template = $(templateName).html();
    Mustache.parse(template);
    let rendered = Mustache.render(template, data);

    return rendered
}

function pickScrean(data) {
    $waiting.css('display', 'none')
    data.price = comma(data.price)
    data.fee = data.fee === 0 ? '무료' : comma(data.fee)
    return setTemplate("#pickTemplate", data)
}

function content(template, data) {
    let product = data.product
    product.pno = data.pno
    product.no = data.no
    product.fee = product.fee === 0 ? '무료' : comma(product.fee)
    product.price = comma(product.price)
    return setTemplate(template, product)
}

function pickMe(data) {
    resetContent()
    checkingData = $.extend(true, {}, data)
    $title.text("Pick Me!")
    $date.text("")
    $leftContent.html('<img src="' + data.image + '" style="width: auto; height: 200px;">')
    $rightContent.html(pickScrean((data)))

}

function resetContent() {
    $centerContent.html('')
    $leftContent.html('')
    $rightContent.html('')
}

function appendLeftContent(template, data) {
    $leftContent.append(content(template, data))
}

function appendRightContent(template, data) {
    $rightContent.append(content(template, data))
}

function registerClientToken() {
    messaging.requestPermission()
        .then(() => messaging.getToken())
        .then(token =>
            new AjaxBuilder().method(Method.POST).url("token").data(decodeURIComponent(token)).build()
        )
        .catch(err => console.log("Error Occured" + err))
}

function getThisToken() {
    messaging.requestPermission()
        .then(() => messaging.getToken())
        .then(token =>
            new AjaxBuilder().url("logout?token=" + decodeURIComponent(token)).method(Method.POST).success(data => {
                swal("LOGOUT!", "", "info", {button: '종료', className: 'swalSize'}).then(() => window.close())
                // $login.css('display','block')
            }).build()
        )
        .catch(err => console.log("Error Occured" + err))
}

function socialLogin(url) {
    const loginPopup = window.open(url, '_black', 'width=auto, height=auto')

    let interval = window.setInterval(() => {
        if (loginPopup.closed) {
            window.clearInterval(interval)
            registerClientToken()

            new AjaxBuilder().url("getInterestList").method(Method.GET)
                .success(data => {
                    let $leftInterest = $(".leftInterest")
                    let $rightInterest = $(".rightInterest")
                    $leftInterest.html('')
                    $rightInterest.html('')
                    let cnt = 0
                    Array.from(data.categoryList).forEach(category => {
                        cnt++ % 2 === 0 ? $leftInterest.append(setTemplate("#interestTemplate", category)) : $rightInterest.append(setTemplate("#interestTemplate", category))
                    })
                    $(".centerInterest").html('<a href=\"#none\" id="saveInterestBtn">저장</a>')
                }).build()

            new AjaxBuilder().method(Method.GET).url("interestChecking")
                .success(status => status === HttpStatus.MOVED_PERMANENTLY ? $interest.css('display', 'block') : executeAjax(prevAjax)).build()

            $login.css('display', 'none')
        }
    }, 1000);
}

function executeAjax(ajax) {
    // let CSRF_Token = $("meta[name='_csrf']").attr("content")
    // let header = $("meta[name='_csrf_header']").attr("content")
    //
    // let sendCSRF = ajax.method === Method.POST ? function (xhr) {xhr.setRequestHeader(header, CSRF_Token); console.log(xhr)} : null

    $.ajax({
        url: ajax.url,
        type: ajax.method,
        data: ajax.data,
        contentType: "application/json",
        // beforeSend: sendCSRF,
        async: false,
        success: function (response, status, xhr) {
            ajax.success(response, status, xhr)
        },
        error: function (error) {
            if (ajax.url === basieUrl + 'token') return
            let status = error.responseJSON.status
            prevAjax = ajax
            status === 401 ? $login.css('display', 'block') : console.log("Error :" + status)
        }
    })
}

function getCurrentTabUrl(callback) {
    let queryInfo = {active: true, currentWindow: true}
    chrome.tabs.query(queryInfo, function (tabs) {
        console.log(tabs[0].url)
        let tab = tabs[0]
        let url = tab.url
        console.log(url)
        callback(url)
    })
}

class Ajax {
    constructor(url, method, data, success) {
        this.url = url;
        this.method = method;
        this.data = data;
        this.success = success;
    }
}

class AjaxBuilder {

    constructor() {
        this.ajax = new Ajax()
    }

    url(url) {
        this.ajax.url = basieUrl + url
        return this
    }

    method(method) {
        this.ajax.method = method
        return this
    }

    data(data) {
        this.ajax.data = data
        return this
    }

    success(success) {
        this.ajax.success = success
        return this
    }

    build() {
        executeAjax(this.ajax)
        return this.ajax
    }
}
