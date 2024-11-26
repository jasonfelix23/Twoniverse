package com.twoniverse.twoniverse.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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

    public LoginResponse signup(SignupRequest request){
        //check for duplicate username or email
        if(personRepository.findByUsername(request.getUsername()).isPresent()){
            throw new RuntimeException("Username is already taken");
        }
        if(personRepository.existsByEmail(request.getEmail())){
            throw new RuntimeException("Email is already taken");
        }

        Person user = Person.builder()
        .username(request.getUsername())
        .email(request.getEmail())
        .password(passwordEncoder.encode(request.getPassword()))
        .character(request.getCharacter())
        .build();

        personRepository.save(user);

        String token = jwtUtil.generateToken(user.getUsername());
        return new LoginResponse(token);
    }

    public LoginResponse login(LoginRequest request){
        Person user = personRepository.findByUsername(request.getUsername())
        .orElseThrow(() -> new RuntimeException("Invalid username or password"));

        if(!passwordEncoder.matches(request.getPassword(), user.getPassword())){
            throw new RuntimeException("Invalid username or password");
        }

        String token = jwtUtil.generateToken(user.getUsername());
        return new LoginResponse(token);
    }
}
