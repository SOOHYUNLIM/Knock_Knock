package org.jarvis.kk.service;

import java.io.FileInputStream;
import java.util.Arrays;
import java.util.List;

import javax.annotation.PostConstruct;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.AndroidConfig;
import com.google.firebase.messaging.AndroidNotification;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Message.Builder;
import com.google.firebase.messaging.Notification;
import com.google.firebase.messaging.WebpushConfig;
import com.google.firebase.messaging.WebpushFcmOptions;

import org.jarvis.kk.domain.Pick;
import org.jarvis.kk.domain.Token;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

/**
 * FCMConfig
 */
@Service
@Slf4j
public final class FCMService {

    private FirebaseApp firebaseApp;

    @PostConstruct
    public void init() {
        try {
            // C:/Users/SH/FireBaseDB/serviceAccountKey.json
            // /home/ec2-user/app/serviceAccountKey.json
            FileInputStream serviceAccount = new FileInputStream("C:/Users/SH/FireBaseDB/serviceAccountKey.json");
            FirebaseOptions options = new FirebaseOptions.Builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .setDatabaseUrl("https://jarvis-77f82.firebaseio.com").build();
            FirebaseApp.initializeApp(options, "options");
        } catch (Exception e) {
            // spring boot 재시작 시 bean이 생성된 상태에서 또다시 호출되는 듯
            // 따라서 이미 option이 있음에도 또다시 같은 이름으로 초기화 하려 하니 오류발생!
            // e.printStackTrace();
        }

        this.firebaseApp = FirebaseApp.getInstance("options");
    }

    public void addAllTopics(String token) {
        try {
            FirebaseMessaging.getInstance(firebaseApp).subscribeToTopic(Arrays.asList(token), "All");
            log.info("토큰이가 all에 들어갔냐=======" + token);
        } catch (FirebaseMessagingException e) {
            e.printStackTrace();
        }
    }

    public void pushAllFcm() {
        Notification notification = Notification.builder().setTitle("Knock Knock").setBody("특가 정보가 도착했습니다!")
                .setImage("chrome-extension://mlhkbmlfdcfddjhpnkbicoenngmcbaaf/msgImg.png").build();
        AndroidNotification androidNotification = AndroidNotification.builder().setTitle("Knock Knock")
                .setBody("특가 정보가 도착했습니다!").setColor("#f45342").setSound("src/res/raw/koong.MP3").build();

        Message webMessage = Message.builder().setWebpushConfig(WebpushConfig.builder()
                .setFcmOptions(WebpushFcmOptions
                        .withLink("http://ec2-15-165-118-201.ap-northeast-2.compute.amazonaws.com:8080"))
                .build()).setNotification(notification)
                .setAndroidConfig(AndroidConfig.builder().setPriority(AndroidConfig.Priority.NORMAL).setNotification(androidNotification).build())
                .setTopic("All").build();

        // Message androidMessage = Message.builder().setAndroidConfig(AndroidConfig.builder().setPriority(AndroidConfig.Priority.NORMAL).setNotification(androidNotification).build()).setTopic("All").build();
        try {
            FirebaseMessaging.getInstance(firebaseApp).send(webMessage);
            // FirebaseMessaging.getInstance(firebaseApp).send(androidMessage);
        } catch (FirebaseMessagingException e) {
            e.printStackTrace();
        }
    }

    public void pushOneFcm(Pick pick, List<Token> tokens) {
        Notification notification = Notification.builder().setTitle("Knock Knock").setBody(pick.getProduct().getTitle())
                .setImage(pick.getProduct().getImage()).build();

        AndroidNotification androidNotification = AndroidNotification.builder().setTitle("Knock Knock")
                .setBody("특가 정보가 도착했습니다!").setColor("#f45342").build();

        Builder webMessage = Message.builder()
                .setWebpushConfig(WebpushConfig.builder()
                        .setFcmOptions(WebpushFcmOptions.withLink(pick.getProduct().getLink())).build())
                .setNotification(notification);

        // Builder androidMessage = Message.builder()
        //         .setWebpushConfig(WebpushConfig.builder()
        //                 .setFcmOptions(WebpushFcmOptions.withLink(pick.getProduct().getLink())).build())
        //         .setNotification(androidNotification);

        for (Token token : tokens) {
            try {
                FirebaseMessaging.getInstance(firebaseApp).send(webMessage.setToken(token.getToken()).build());
            } catch (FirebaseMessagingException e) {
                e.printStackTrace();
            }
        }
    }

}