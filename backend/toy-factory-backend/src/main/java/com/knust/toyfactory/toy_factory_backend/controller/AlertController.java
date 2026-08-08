package com.knust.toyfactory.toy_factory_backend.controller;

import com.knust.toyfactory.toy_factory_backend.model.Alert;
import com.knust.toyfactory.toy_factory_backend.repository.AlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
public class AlertController {

    @Autowired
    private AlertRepository alertRepository;

    @GetMapping
    public List<Alert> getAllAlerts() {
        return alertRepository.findAll();
    }

    @PostMapping
    public Alert addAlert(@RequestBody Alert alert) {
        return alertRepository.save(alert);
    }
}