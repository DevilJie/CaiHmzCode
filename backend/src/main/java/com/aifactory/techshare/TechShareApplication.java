package com.aifactory.techshare;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * 技术分享网站后端服务启动类
 *
 * @author AI Factory
 */
@SpringBootApplication
@EnableCaching
@EnableScheduling
public class TechShareApplication {

    public static void main(String[] args) {
        SpringApplication.run(TechShareApplication.class, args);
    }

}
