package com.twoniverse.twoniverse.service;

import org.springframework.stereotype.Service;

@Service
public class PingService {
    
    public String ping() {
        return "pong!";
    }
}
