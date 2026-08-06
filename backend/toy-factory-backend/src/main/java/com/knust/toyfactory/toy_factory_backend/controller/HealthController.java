package com.knust.toyfactory.toy_factory_backend.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/")
    public Map<String, Object> rootHealth() {
        return Map.of(
            "status", "UP",
            "service", "toy-factory-backend",
            "message", "Backend is running successfully"
        );
    }

    @GetMapping("/health")
    public Map<String, Object> health() {
        return Map.of(
            "status", "UP",
            "service", "toy-factory-backend",
            "message", "Backend health check passed"
        );
    }
}
