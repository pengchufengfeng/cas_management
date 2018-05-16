package com.bucg.sso;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


/**
 * Spring Boot 启动类
 */
@SpringBootApplication
@MapperScan("com.bucg.sso.mapper")
public class Application {

	
	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

	

	

}
