package com.twoniverse.twoniverse.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.twoniverse.twoniverse.service.PingService;

@RestController
@RequestMapping("/api/v1")
public class PingController {
    
    @Autowired
    private PingService pingService;

    @GetMapping("/ping")
    public String ping() {
        return pingService.ping();
    }
}
