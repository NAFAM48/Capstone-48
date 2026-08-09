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

    @Operation(summary = "Get a machine by ID")
    @GetMapping("/{id}")
    public ResponseEntity<MachineResponse> getMachineById(@PathVariable Long id) {
        return machineRepository.findById(id)
            .map(machine -> ResponseEntity.ok(toResponse(machine)))
            .orElse(ResponseEntity.notFound().build());
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

    @Operation(summary = "Update a machine")
    @PutMapping("/{id}")
    public ResponseEntity<MachineResponse> updateMachine(@PathVariable Long id, @RequestBody MachineRequest request) {
        return machineRepository.findById(id)
            .map(machine -> {
                machine.setName(request.getName());
                machine.setStage(request.getStage());
                machine.setStatus(request.getStatus());
                return ResponseEntity.ok(toResponse(machineRepository.save(machine)));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Delete a machine")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMachine(@PathVariable Long id) {
        if (!machineRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        machineRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private MachineResponse toResponse(Machine machine) {
        return new MachineResponse(machine.getId(), machine.getName(), machine.getStage(), machine.getStatus());
    }
}