package com.knust.toyfactory.toy_factory_backend.repository;

import com.knust.toyfactory.toy_factory_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}