package com.knust.toyfactory.toy_factory_backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.knust.toyfactory.toy_factory_backend.dto.MachineRequest;
import com.knust.toyfactory.toy_factory_backend.dto.MachineResponse;
import com.knust.toyfactory.toy_factory_backend.model.Machine;
import com.knust.toyfactory.toy_factory_backend.repository.MachineRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/machines")
@Tag(name = "Machines", description = "Manage machine data")
public class MachineController {

    private final MachineRepository machineRepository;

    public MachineController(MachineRepository machineRepository) {
        this.machineRepository = machineRepository;
    }

    @Operation(summary = "Get all machines")
    @GetMapping
    public List<MachineResponse> getAllMachines() {
        return machineRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Operation(summary = "Create a machine")
    @PostMapping
    public MachineResponse addMachine(@RequestBody MachineRequest request) {
        Machine machine = new Machine();
        machine.setName(request.getName());
        machine.setStage(request.getStage());
        machine.setStatus(request.getStatus());
        return toResponse(machineRepository.save(machine));
    }

    private MachineResponse toResponse(Machine machine) {
        return new MachineResponse(machine.getId(), machine.getName(), machine.getStage(), machine.getStatus());
    }
}