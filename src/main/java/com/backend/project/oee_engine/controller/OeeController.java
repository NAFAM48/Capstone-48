package com.backend.project.oee_engine.controller;

import com.backend.project.oee_engine.service.OeeCalculationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class OeeController {

    @Autowired
    private OeeCalculationService oeeService;

    @GetMapping("/calculate-oee")
    public double calculateOee(
            @RequestParam double operatingTime,
            @RequestParam double plannedProductionTime,
            @RequestParam double idealCycleTime,
            @RequestParam double totalCount,
            @RequestParam double goodCount) {

        double availability = oeeService.calculateAvailability(operatingTime, plannedProductionTime);
        double performance = oeeService.calculatePerformance(idealCycleTime, totalCount, operatingTime);
        double quality = oeeService.calculateQuality(goodCount, totalCount);

        return oeeService.calculateOEE(availability, performance, quality);
    }
}