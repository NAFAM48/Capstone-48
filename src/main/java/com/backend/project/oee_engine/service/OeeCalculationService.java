package com.backend.project.oee_engine.service;



import org.springframework.stereotype.Service;

@Service
public class OeeCalculationService {

    public double calculateAvailability(double operatingTime, double plannedProductionTime) {
        if (plannedProductionTime == 0) return 0.0;
        return (operatingTime / plannedProductionTime) * 100;
    }

    public double calculatePerformance(double idealCycleTime, double totalCount, double operatingTime) {
        if (operatingTime == 0) return 0.0;
        return ((idealCycleTime * totalCount) / operatingTime) * 100;
    }

    public double calculateQuality(double goodCount, double totalCount) {
        if (totalCount == 0) return 0.0;
        return ((double) goodCount / totalCount) * 100;
    }

    public double calculateOEE(double availability, double performance, double quality) {
        // OEE is typically expressed as a percentage or a fraction
        return (availability / 100) * (performance / 100) * (quality / 100) * 100;
    }
}
