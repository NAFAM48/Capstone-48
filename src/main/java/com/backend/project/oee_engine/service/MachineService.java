package com.backend.project.oee_engine.service;

import com.backend.project.oee_engine.model.Machine;
import com.backend.project.oee_engine.repository.MachineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MachineService {

    @Autowired
    private MachineRepository machineRepository;

    public List<Machine> getAllMachines() {
        return machineRepository.findAll();
    }

    public Optional<Machine> getMachineById(Long id) {
        return machineRepository.findById(id);
    }

    public Machine saveMachine(Machine machine) {
        return machineRepository.save(machine);
    }

    public void deleteMachine(Long id) {
        machineRepository.deleteById(id);
    }
    public Machine updateMachine(Long id, Machine machineDetails) {
        Machine machine = machineRepository.findById(id).orElseThrow(() -> new RuntimeException("Machine not found with id " + id));
        machine.setName(machineDetails.getName());
        return machineRepository.save(machine);
    }
}
