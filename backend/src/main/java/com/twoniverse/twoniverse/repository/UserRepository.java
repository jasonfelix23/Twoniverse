package com.twoniverse.twoniverse.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.twoniverse.twoniverse.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
}
