package com.knust.toyfactory.toy_factory_backend.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.knust.toyfactory.toy_factory_backend.dto.OeeRequest;
import com.knust.toyfactory.toy_factory_backend.dto.OeeResponse;
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

    public OeeController(OeeCalculationService oeeService) {
        this.oeeService = oeeService;
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
}
