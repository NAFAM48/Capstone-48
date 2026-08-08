package com.knust.toyfactory.toy_factory_backend.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.knust.toyfactory.toy_factory_backend.dto.SensorReadingRequest;
import com.knust.toyfactory.toy_factory_backend.dto.SensorReadingResponse;
import com.knust.toyfactory.toy_factory_backend.model.Machine;
import com.knust.toyfactory.toy_factory_backend.model.SensorReading;
import com.knust.toyfactory.toy_factory_backend.repository.MachineRepository;
import com.knust.toyfactory.toy_factory_backend.repository.SensorReadingRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/sensor-readings")
@Tag(name = "Sensor Readings", description = "Manage sensor reading records")
public class SensorReadingController {

    private final SensorReadingRepository sensorReadingRepository;
    private final MachineRepository machineRepository;

    public SensorReadingController(SensorReadingRepository sensorReadingRepository, MachineRepository machineRepository) {
        this.sensorReadingRepository = sensorReadingRepository;
        this.machineRepository = machineRepository;
    }

    @Operation(summary = "Get all sensor readings")
    @GetMapping
    public List<SensorReadingResponse> getAllReadings() {
        return sensorReadingRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Operation(summary = "Create a sensor reading")
    @PostMapping
    public SensorReadingResponse addReading(@RequestBody SensorReadingRequest request) {
        Machine machine = machineRepository.findById(request.getMachineId())
            .orElseThrow(() -> new IllegalArgumentException("Machine not found"));

        SensorReading reading = new SensorReading();
        reading.setMachine(machine);
        reading.setTimestamp(request.getTimestamp() != null ? request.getTimestamp() : LocalDateTime.now());
        reading.setOutputCount(request.getOutputCount());
        reading.setTemperature(request.getTemperature());

        return toResponse(sensorReadingRepository.save(reading));
    }

    private SensorReadingResponse toResponse(SensorReading reading) {
        return new SensorReadingResponse(
            reading.getId(),
            reading.getMachine() != null ? reading.getMachine().getId() : null,
            reading.getTimestamp(),
            reading.getOutputCount(),
            reading.getTemperature()
        );
    }
}