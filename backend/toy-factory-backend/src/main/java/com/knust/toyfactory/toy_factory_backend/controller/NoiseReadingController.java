package com.knust.toyfactory.toy_factory_backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.knust.toyfactory.toy_factory_backend.model.NoiseReading;
import com.knust.toyfactory.toy_factory_backend.repository.NoiseReadingRepository;

@RestController
@RequestMapping("/api/noise-reading")
public class NoiseReadingController {

    @Autowired
    private NoiseReadingRepository noiseReadingRepository;

    @GetMapping
    public List<NoiseReading> getAllNoiseReadings() {
        return noiseReadingRepository.findAll();
    }

    @PostMapping
    public NoiseReading addNoiseReading(@RequestBody NoiseReading reading) {
        return noiseReadingRepository.save(reading);
    }
}