package org.util;

import org.jarvis.kk.service.FCMService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * FCMTests
 */
@SpringBootTest
public class FCMTests {

    @Autowired
    private FCMService fcmService;

    @Test
    public void allTest(){
        fcmService.pushAllFcm();
    }
}