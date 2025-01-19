package com.twoniverse.twoniverse.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus; // Import statement added
import org.springframework.web.bind.annotation.*;

import com.twoniverse.twoniverse.service.UserService;
import com.twoniverse.twoniverse.util.JwtUtil;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    private String getUsernameFromToken(String token) {
        return jwtUtil.validateToken(token);
    }

    @PutMapping("/update-name")
    public ResponseEntity<?> updateName(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader, @RequestBody Map<String, String> request) {
        String token = authHeader.substring(7); // Remove "Bearer " prefix
        String username = getUsernameFromToken(token);
        if (username == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }
        String newName = request.get("newName");
        return userService.updateName(username, newName);
    }

    @PutMapping("/update-character")
    public ResponseEntity<?> updateCharacter(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader, @RequestBody Map<String, String> request) {
        String token = authHeader.substring(7); // Remove "Bearer " prefix
        String username = getUsernameFromToken(token);
        if (username == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }
        String newCharacter = request.get("newCharacter");
        return userService.updateCharacter(username, newCharacter);
    }
}
