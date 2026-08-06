package com.knust.toyfactory.toy_factory_backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.knust.toyfactory.toy_factory_backend.model.Machine;
import com.knust.toyfactory.toy_factory_backend.repository.MachineRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/machines")
@Tag(name = "Machines", description = "Manage machine data")
public class MachineController {

    @Autowired
    private MachineRepository machineRepository;

    @Operation(summary = "Get all machines")
    @GetMapping
    public List<Machine> getAllMachines() {
        return machineRepository.findAll();
    }

    @Operation(summary = "Create a machine")
    @PostMapping
    public Machine addMachine(@RequestBody Machine machine) {
        return machineRepository.save(machine);
    }
}