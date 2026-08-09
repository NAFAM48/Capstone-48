package com.knust.toyfactory.toy_factory_backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.knust.toyfactory.toy_factory_backend.model.Alert;
import com.knust.toyfactory.toy_factory_backend.repository.AlertRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/alerts")
@Tag(name = "Alerts", description = "Manage alerts")
public class AlertController {

    private final AlertRepository alertRepository;

    public AlertController(AlertRepository alertRepository) {
        this.alertRepository = alertRepository;
    }

    @Operation(summary = "Get all alerts")
    @GetMapping
    public List<Alert> getAllAlerts() {
        return alertRepository.findAll();
    }

    @Operation(summary = "Create an alert")
    @PostMapping
    public Alert addAlert(@RequestBody Alert alert) {
        return alertRepository.save(alert);
    }

    @Operation(summary = "Resolve an alert")
    @PutMapping("/{id}/resolve")
    public ResponseEntity<Alert> resolveAlert(@PathVariable Long id) {
        return alertRepository.findById(id)
            .map(alert -> {
                alert.setResolved(true);
                return ResponseEntity.ok(alertRepository.save(alert));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Delete an alert")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAlert(@PathVariable Long id) {
        if (!alertRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        alertRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}