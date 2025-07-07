package com.tallerjj.apirest;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.tallerjj.apirest")
public class ApirestApplication {

	public static void main(String[] args) {
		SpringApplication.run(ApirestApplication.class, args);
	}

}
