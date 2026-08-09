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

import com.knust.toyfactory.toy_factory_backend.dto.DowntimeEventRequest;
import com.knust.toyfactory.toy_factory_backend.dto.DowntimeEventResponse;
import com.knust.toyfactory.toy_factory_backend.model.DowntimeEvent;
import com.knust.toyfactory.toy_factory_backend.model.Machine;
import com.knust.toyfactory.toy_factory_backend.repository.DowntimeEventRepository;
import com.knust.toyfactory.toy_factory_backend.repository.MachineRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/downtime-events")
@Tag(name = "Downtime Events", description = "Manage downtime event records")
public class DowntimeEventController {

    private final DowntimeEventRepository downtimeEventRepository;
    private final MachineRepository machineRepository;

    public DowntimeEventController(DowntimeEventRepository downtimeEventRepository, MachineRepository machineRepository) {
        this.downtimeEventRepository = downtimeEventRepository;
        this.machineRepository = machineRepository;
    }

    @Operation(summary = "Get all downtime events")
    @GetMapping
    public List<DowntimeEventResponse> getAllDowntimeEvents() {
        return downtimeEventRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Operation(summary = "Get a downtime event by ID")
    @GetMapping("/{id}")
    public ResponseEntity<DowntimeEventResponse> getDowntimeEventById(@PathVariable Long id) {
        return downtimeEventRepository.findById(id)
            .map(event -> ResponseEntity.ok(toResponse(event)))
            .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Create a downtime event (sets machine status to DOWN)")
    @PostMapping
    public DowntimeEventResponse addDowntimeEvent(@RequestBody DowntimeEventRequest request) {
        Machine machine = machineRepository.findById(request.getMachineId())
            .orElseThrow(() -> new IllegalArgumentException("Machine not found"));

        machine.setStatus("DOWN");
        machineRepository.save(machine);

        DowntimeEvent event = new DowntimeEvent();
        event.setMachine(machine);
        event.setStartTime(request.getStartTime());
        event.setEndTime(request.getEndTime());
        event.setCause(request.getCause());

        return toResponse(downtimeEventRepository.save(event));
    }

    @Operation(summary = "Update a downtime event")
    @PutMapping("/{id}")
    public ResponseEntity<DowntimeEventResponse> updateDowntimeEvent(@PathVariable Long id, @RequestBody DowntimeEventRequest request) {
        return downtimeEventRepository.findById(id)
            .map(event -> {
                Machine machine = machineRepository.findById(request.getMachineId())
                    .orElseThrow(() -> new IllegalArgumentException("Machine not found"));

                event.setMachine(machine);
                event.setStartTime(request.getStartTime());
                event.setEndTime(request.getEndTime());
                event.setCause(request.getCause());

                if (request.getEndTime() != null) {
                    machine.setStatus("RUNNING");
                    machineRepository.save(machine);
                }

                return ResponseEntity.ok(toResponse(downtimeEventRepository.save(event)));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Delete a downtime event (sets machine status back to RUNNING)")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDowntimeEvent(@PathVariable Long id) {
        return downtimeEventRepository.findById(id)
            .map(event -> {
                Machine machine = event.getMachine();
                if (machine != null) {
                    machine.setStatus("RUNNING");
                    machineRepository.save(machine);
                }
                downtimeEventRepository.deleteById(id);
                return ResponseEntity.noContent().<Void>build();
            })
            .orElse(ResponseEntity.notFound().build());
    }

    private DowntimeEventResponse toResponse(DowntimeEvent event) {
        return new DowntimeEventResponse(
            event.getId(),
            event.getMachine() != null ? event.getMachine().getId() : null,
            event.getStartTime(),
            event.getEndTime(),
            event.getCause()
        );
    }
}
