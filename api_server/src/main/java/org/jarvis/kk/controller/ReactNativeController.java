package org.jarvis.kk.controller;

import java.nio.charset.Charset;
import java.util.List;

import org.jarvis.kk.domain.CommunityCrawling;
import org.jarvis.kk.domain.Token;
import org.jarvis.kk.repositories.CommunityCrawlingRepository;
import org.jarvis.kk.repositories.TokenRepository;
import org.jarvis.kk.service.FCMService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * RestController
 */
@CrossOrigin("*")
@RestController
@RequestMapping("/app")
@RequiredArgsConstructor
@Slf4j
public class ReactNativeController {

    private final CommunityCrawlingRepository communityCrawlingRepository;

    private final TokenRepository tokenRepository;

    private final FCMService fcmService;

    @PostMapping("/token")
    public ResponseEntity<String> registerToken(@RequestBody String token) {
        log.info(token);
        fcmService.addAllTopics(token);
        tokenRepository.save(Token.builder().token(token).mid("tjsvndrlskfk@gmail.com").build());
        return new ResponseEntity<>("SUCCESS", HttpStatus.CREATED);
    }

    @GetMapping("/appFind/{title}")
    public ResponseEntity<Object> appFind(@PathVariable String title) {
        log.info(title);
        RestTemplate template = new RestTemplate();
        template.getMessageConverters().add(0, new StringHttpMessageConverter(Charset.forName("UTF-8")));

        Object response = template.getForObject(
                "https://773hnhyh4j.execute-api.ap-northeast-2.amazonaws.com/Knock-Knock/navershopping/" + title,
                Object.class);

        return new ResponseEntity<>(response, HttpStatus.OK); 
    }

    @GetMapping("/appList")
    public ResponseEntity<List<CommunityCrawling>> getAppList() {
        return new ResponseEntity<>(communityCrawlingRepository.findAll(PageRequest.of(1, 50, Direction.DESC, "no")).getContent(), HttpStatus.OK);
    }
}