package org.jarvis.kk.security;

import org.jarvis.kk.service.OAuth2MemberService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import lombok.RequiredArgsConstructor;

/**
 * SecurityConfig
 */
@RequiredArgsConstructor
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    private final OAuth2MemberService oauth2MemberService;
    private final RestAuthenticationEntryPoint restAuthenticationEntryPoint;
    private final RestAuthenticationLoginSuccessHandler restAuthenticationLoginSuccessHandler;
    private final RestAuthenticationLogoutSuccessHandler restAuthenticationLogoutSuccessHandler;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable().cors().and().exceptionHandling().authenticationEntryPoint(restAuthenticationEntryPoint).and().headers()
                .frameOptions().disable().and().authorizeRequests()
                .antMatchers("/privacy_policy.html", "/kk/pp","/app/**", "/kk/getInterestList","/kk/msg", "/kk/lprice", "/", "/kk/getInterestList").permitAll()
                .antMatchers("/css/**", "/js/**", "/vendor/**", "/webfonts/**", "/img/**").permitAll()
                .anyRequest().authenticated().and()
                .logout().logoutSuccessUrl("/kk/dropToken").logoutSuccessHandler(restAuthenticationLogoutSuccessHandler)
                .logoutUrl("/kk/logout").invalidateHttpSession(true).permitAll().and().oauth2Login()
                .successHandler(restAuthenticationLoginSuccessHandler).userInfoEndpoint()
                .userService(oauth2MemberService);
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedHeader("*");
        configuration.addAllowedMethod("*");
        configuration.addAllowedOrigin("*");
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

}