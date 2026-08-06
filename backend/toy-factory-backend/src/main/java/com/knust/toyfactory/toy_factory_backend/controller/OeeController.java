package com.knust.toyfactory.toy_factory_backend.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import com.knust.toyfactory.toy_factory_backend.service.OeeCalculationService;

@RestController
@RequestMapping("/api/oee")
@Tag(name = "OEE", description = "Calculate OEE metrics")
public class OeeController {

    @Autowired
    private OeeCalculationService oeeService;

    @Operation(summary = "Calculate OEE from production metrics")
    @PostMapping("/calculate")
    public Map<String, Double> calculateOee(@RequestBody Map<String, Double> input) {
        double availability = oeeService.calculateAvailability(
            input.get("operatingTime"), input.get("plannedProductionTime"));
        double performance = oeeService.calculatePerformance(
            input.get("idealCycleTime"), input.get("totalCount"), input.get("operatingTime"));
        double quality = oeeService.calculateQuality(
            input.get("goodCount"), input.get("totalCount"));
        double oee = oeeService.calculateOEE(availability, performance, quality);

        return Map.of(
            "availability", availability,
            "performance", performance,
            "quality", quality,
            "oee", oee
        );
    }
}
