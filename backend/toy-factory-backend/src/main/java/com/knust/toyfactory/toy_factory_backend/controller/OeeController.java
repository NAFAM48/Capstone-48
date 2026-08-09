package com.knust.toyfactory.toy_factory_backend.controller;

import java.time.Duration;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.knust.toyfactory.toy_factory_backend.dto.OeeRequest;
import com.knust.toyfactory.toy_factory_backend.dto.OeeResponse;
import com.knust.toyfactory.toy_factory_backend.model.DowntimeEvent;
import com.knust.toyfactory.toy_factory_backend.model.ProductionRecord;
import com.knust.toyfactory.toy_factory_backend.repository.DowntimeEventRepository;
import com.knust.toyfactory.toy_factory_backend.repository.MachineRepository;
import com.knust.toyfactory.toy_factory_backend.repository.ProductionRecordRepository;
import com.knust.toyfactory.toy_factory_backend.service.OeeCalculationService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/oee")
@Tag(name = "OEE", description = "Calculate OEE metrics")
public class OeeController {

    private final OeeCalculationService oeeService;
    private final MachineRepository machineRepository;
    private final ProductionRecordRepository productionRecordRepository;
    private final DowntimeEventRepository downtimeEventRepository;

    public OeeController(OeeCalculationService oeeService, MachineRepository machineRepository,
                         ProductionRecordRepository productionRecordRepository,
                         DowntimeEventRepository downtimeEventRepository) {
        this.oeeService = oeeService;
        this.machineRepository = machineRepository;
        this.productionRecordRepository = productionRecordRepository;
        this.downtimeEventRepository = downtimeEventRepository;
    }

    @Operation(summary = "Calculate OEE from production metrics", responses = {
        @ApiResponse(responseCode = "200", description = "OEE calculated successfully", content = @Content(schema = @Schema(implementation = OeeResponse.class)))
    })
    @PostMapping("/calculate")
    public OeeResponse calculateOee(@RequestBody OeeRequest input) {
        double availability = oeeService.calculateAvailability(
            input.getOperatingTime(), input.getPlannedProductionTime());
        double performance = oeeService.calculatePerformance(
            input.getIdealCycleTime(), input.getTotalCount(), input.getOperatingTime());
        double quality = oeeService.calculateQuality(
            input.getGoodCount(), input.getTotalCount());
        double oee = oeeService.calculateOEE(availability, performance, quality);

        return new OeeResponse(availability, performance, quality, oee);
    }

    @Operation(summary = "Calculate OEE for a specific machine from stored production and downtime data")
    @GetMapping("/machine/{machineId}")
    public ResponseEntity<OeeResponse> getOeeForMachine(@PathVariable Long machineId) {
        if (!machineRepository.existsById(machineId)) {
            return ResponseEntity.notFound().build();
        }

        List<ProductionRecord> records = productionRecordRepository.findByMachineId(machineId);
        List<DowntimeEvent> downtimeEvents = downtimeEventRepository.findByMachineId(machineId);

        if (records.isEmpty()) {
            return ResponseEntity.ok(new OeeResponse(0.0, 0.0, 0.0, 0.0));
        }

        double totalPlannedTime = records.stream()
            .mapToDouble(r -> r.getPlannedProductionTime() != null ? r.getPlannedProductionTime() : 480.0)
            .sum();

        double totalDowntimeMinutes = downtimeEvents.stream()
            .filter(e -> e.getStartTime() != null && e.getEndTime() != null)
            .mapToDouble(e -> Duration.between(e.getStartTime(), e.getEndTime()).toMinutes())
            .sum();

        double operatingTime = totalPlannedTime - totalDowntimeMinutes;
        if (operatingTime < 0) operatingTime = 0;

        int totalGood = records.stream().mapToInt(r -> r.getGoodUnits() != null ? r.getGoodUnits() : 0).sum();
        int totalDefective = records.stream().mapToInt(r -> r.getDefectiveUnits() != null ? r.getDefectiveUnits() : 0).sum();
        int totalCount = totalGood + totalDefective;

        double avgIdealCycleTime = records.stream()
            .filter(r -> r.getIdealCycleTime() != null)
            .mapToDouble(ProductionRecord::getIdealCycleTime)
            .average()
            .orElse(1.0);

        double availability = oeeService.calculateAvailability(operatingTime, totalPlannedTime);
        double performance = oeeService.calculatePerformance(avgIdealCycleTime, totalCount, operatingTime);
        double quality = oeeService.calculateQuality(totalGood, totalCount);
        double oee = oeeService.calculateOEE(availability, performance, quality);

        return ResponseEntity.ok(new OeeResponse(availability, performance, quality, oee));
    }
}
