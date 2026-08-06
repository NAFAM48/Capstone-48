package com.knust.toyfactory.toy_factory_backend.controller;

import com.knust.toyfactory.toy_factory_backend.model.User;
import com.knust.toyfactory.toy_factory_backend.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "User sign up and sign in endpoints")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Register a new user
    @Operation(summary = "Register a new user")
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");
        String role = request.getOrDefault("role", "OPERATOR");

        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body("Email already registered");
        }

        String hashedPassword = passwordEncoder.encode(password);
        User user = new User(email, hashedPassword, role);
        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully");
    }

    // Log in an existing user
    @Operation(summary = "Sign in an existing user")
    @PostMapping("/signin")
    public ResponseEntity<?> signin(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body("Invalid email or password");
        }

        User user = userOpt.get();

        if (!passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.status(401).body("Invalid email or password");
        }

        return ResponseEntity.ok(Map.of(
            "message", "Login successful",
            "email", user.getEmail(),
            "role", user.getRole()
        ));
    }
}
