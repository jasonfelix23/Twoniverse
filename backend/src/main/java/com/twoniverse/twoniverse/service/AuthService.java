package com.twoniverse.twoniverse.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.twoniverse.twoniverse.dto.ErrorResponse;
import com.twoniverse.twoniverse.dto.LoginRequest;
import com.twoniverse.twoniverse.dto.LoginResponse;
import com.twoniverse.twoniverse.dto.SignupRequest;
import com.twoniverse.twoniverse.model.Person;
import com.twoniverse.twoniverse.repository.PersonRepository;
import com.twoniverse.twoniverse.util.JwtUtil;

@Service
public class AuthService {
    
    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public ResponseEntity<?> signup(SignupRequest request){
        //check for duplicate username or email
        if(personRepository.findByUsername(request.getUsername()).isPresent()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(new ErrorResponse("Username already exists"));
        }
        if(personRepository.existsByEmail(request.getEmail())){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(new ErrorResponse("Email is already taken"));
        }

        Person user = Person.builder()
        .username(request.getUsername())
        .email(request.getEmail())
        .password(passwordEncoder.encode(request.getPassword()))
        .character(request.getCharacter())
        .build();

        personRepository.save(user);

        String token = jwtUtil.generateToken(user.getUsername());
        return ResponseEntity.ok(new LoginResponse(token));
    }

    public ResponseEntity<?> login(LoginRequest request){
        Person user = personRepository.findByUsername(request.getUsername())
        .orElse(null);

        if(user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(new ErrorResponse("Invalid username or password"));
        }

        String token = jwtUtil.generateToken(user.getUsername());
        return ResponseEntity.ok(new LoginResponse(token));
    }
}
