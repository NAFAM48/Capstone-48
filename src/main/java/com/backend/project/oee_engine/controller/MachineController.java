package com.backend.project.oee_engine.controller;

import com.backend.project.oee_engine.model.Machine;
import com.backend.project.oee_engine.service.MachineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/machines")
public class MachineController {

    @Autowired
    private MachineService machineService;

    @GetMapping
    public List<Machine> getAllMachines() {
        return machineService.getAllMachines();
    }

    @PostMapping
    public Machine createMachine(@RequestBody Machine machine) {
        return machineService.saveMachine(machine);
    }

    @DeleteMapping("/{id}")
    public void deleteMachine(@PathVariable Long id) {
        machineService.deleteMachine(id);
    }
    @PutMapping("/{id}")
    public Machine updateMachine(@PathVariable Long id, @RequestBody Machine machineDetails) {
        return machineService.updateMachine(id, machineDetails);
    }
}