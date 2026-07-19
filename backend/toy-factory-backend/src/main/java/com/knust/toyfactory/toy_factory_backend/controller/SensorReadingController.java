package com.knust.toyfactory.toy_factory_backend.controller;

import com.knust.toyfactory.toy_factory_backend.model.SensorReading;
import com.knust.toyfactory.toy_factory_backend.repository.SensorReadingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sensor-readings")
public class SensorReadingController {

    @Autowired
    private SensorReadingRepository sensorReadingRepository;

    @GetMapping
    public List<SensorReading> getAllReadings() {
        return sensorReadingRepository.findAll();
    }

    @PostMapping
    public SensorReading addReading(@RequestBody SensorReading reading) {
        return sensorReadingRepository.save(reading);
    }
}