package com.knust.toyfactory.toy_factory_backend.controller;

import com.knust.toyfactory.toy_factory_backend.model.SensorReading;
import com.knust.toyfactory.toy_factory_backend.repository.SensorReadingRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sensor-readings")
@Tag(name = "Sensor Readings", description = "Manage sensor reading records")
public class SensorReadingController {

    @Autowired
    private SensorReadingRepository sensorReadingRepository;

    @Operation(summary = "Get all sensor readings")
    @GetMapping
    public List<SensorReading> getAllReadings() {
        return sensorReadingRepository.findAll();
    }

    @Operation(summary = "Create a sensor reading")
    @PostMapping
    public SensorReading addReading(@RequestBody SensorReading reading) {
        return sensorReadingRepository.save(reading);
    }
}