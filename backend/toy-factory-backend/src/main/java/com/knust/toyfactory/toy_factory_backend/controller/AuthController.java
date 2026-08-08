package com.knust.toyfactory.toy_factory_backend.controller;

import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.knust.toyfactory.toy_factory_backend.dto.AuthResponse;
import com.knust.toyfactory.toy_factory_backend.dto.AuthSigninRequest;
import com.knust.toyfactory.toy_factory_backend.dto.AuthSignupRequest;
import com.knust.toyfactory.toy_factory_backend.model.User;
import com.knust.toyfactory.toy_factory_backend.repository.UserRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "User sign up and sign in endpoints")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Register a new user
    @Operation(summary = "Register a new user", responses = {
        @ApiResponse(responseCode = "200", description = "User registered successfully", content = @Content(schema = @Schema(implementation = String.class))),
        @ApiResponse(responseCode = "400", description = "Email already registered")
    })
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody AuthSignupRequest request) {
        String email = request.getEmail();
        String password = request.getPassword();
        String role = request.getRole() != null ? request.getRole() : "OPERATOR";

        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body("Email already registered");
        }

        String hashedPassword = passwordEncoder.encode(password);
        User user = new User(email, hashedPassword, role);
        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully");
    }

    // Log in an existing user
    @Operation(summary = "Sign in an existing user", responses = {
        @ApiResponse(responseCode = "200", description = "Login successful", content = @Content(schema = @Schema(implementation = AuthResponse.class))),
        @ApiResponse(responseCode = "401", description = "Invalid email or password")
    })
    @PostMapping("/signin")
    public ResponseEntity<?> signin(@RequestBody AuthSigninRequest request) {
        String email = request.getEmail();
        String password = request.getPassword();

        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body("Invalid email or password");
        }

        User user = userOpt.get();

        if (!passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.status(401).body("Invalid email or password");
        }

        return ResponseEntity.ok(new AuthResponse("Login successful", user.getEmail(), user.getRole()));
    }
}
