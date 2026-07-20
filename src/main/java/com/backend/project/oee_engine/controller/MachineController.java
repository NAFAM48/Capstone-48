package com.backend.project.oee_engine.controller;

import com.backend.project.oee_engine.model.Machine;
import com.backend.project.oee_engine.repository.MachineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/machines")
public class MachineController {

    @Autowired
    private MachineRepository machineRepository;

    @GetMapping
    public List<Machine> getAllMachines() {
        return machineRepository.findAll();
    }

    @PostMapping
    public Machine createMachine(@RequestBody Machine machine) {
        return machineRepository.save(machine);
    }
}