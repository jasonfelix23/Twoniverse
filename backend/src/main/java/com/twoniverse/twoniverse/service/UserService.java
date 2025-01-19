package com.twoniverse.twoniverse.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.twoniverse.twoniverse.dto.ErrorResponse;
import com.twoniverse.twoniverse.model.Person;
import com.twoniverse.twoniverse.repository.PersonRepository;

@Service
public class UserService {

    @Autowired
    private PersonRepository personRepository;

    public ResponseEntity<?> updateName(String username, String newName) {
        Person user = personRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse("User not found"));
        }
        user.setUsername(newName);
        personRepository.save(user);
        return ResponseEntity.ok("Name updated successfully");
    }

    public ResponseEntity<?> updateCharacter(String username, String newCharacter) {
        Person user = personRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse("User not found"));
        }
        user.setCharacter(newCharacter);
        personRepository.save(user);
        return ResponseEntity.ok("Character updated successfully");
    }
}
