package com.twoniverse.twoniverse;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan(basePackages = "com.twoniverse.twoniverse.model") 
public class TwoniverseBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(TwoniverseBackendApplication.class, args);
	}

}
