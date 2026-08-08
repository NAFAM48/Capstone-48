package com.knust.toyfactory.toy_factory_backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
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

    @Operation(summary = "Create a downtime event")
    @PostMapping
    public DowntimeEventResponse addDowntimeEvent(@RequestBody DowntimeEventRequest request) {
        Machine machine = machineRepository.findById(request.getMachineId())
            .orElseThrow(() -> new IllegalArgumentException("Machine not found"));

        DowntimeEvent event = new DowntimeEvent();
        event.setMachine(machine);
        event.setStartTime(request.getStartTime());
        event.setEndTime(request.getEndTime());
        event.setCause(request.getCause());

        return toResponse(downtimeEventRepository.save(event));
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
