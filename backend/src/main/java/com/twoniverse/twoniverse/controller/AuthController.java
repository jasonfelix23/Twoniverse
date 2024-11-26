package com.twoniverse.twoniverse.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.twoniverse.twoniverse.dto.LoginRequest;
import com.twoniverse.twoniverse.dto.LoginResponse;
import com.twoniverse.twoniverse.dto.SignupRequest;
import com.twoniverse.twoniverse.service.AuthService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/signup")
    public LoginResponse postMethodName(@RequestBody SignupRequest request) {
        return authService.signup(request);
    }
    
    

}
