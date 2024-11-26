package com.twoniverse.twoniverse.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.twoniverse.twoniverse.model.Person;

@Repository
public interface PersonRepository extends JpaRepository<Person, Long> {
    Optional<Person> findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
