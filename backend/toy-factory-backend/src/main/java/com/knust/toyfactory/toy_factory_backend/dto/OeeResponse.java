package com.knust.toyfactory.toy_factory_backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "OeeResponse", description = "Calculated OEE metrics")
public class OeeResponse {

    @Schema(description = "Availability metric", example = "0.96")
    private Double availability;

    @Schema(description = "Performance metric", example = "0.95")
    private Double performance;

    @Schema(description = "Quality metric", example = "0.975")
    private Double quality;

    @Schema(description = "Overall OEE value", example = "0.8874")
    private Double oee;

    public OeeResponse() {}

    public OeeResponse(Double availability, Double performance, Double quality, Double oee) {
        this.availability = availability;
        this.performance = performance;
        this.quality = quality;
        this.oee = oee;
    }

    public Double getAvailability() { return availability; }
    public void setAvailability(Double availability) { this.availability = availability; }
    public Double getPerformance() { return performance; }
    public void setPerformance(Double performance) { this.performance = performance; }
    public Double getQuality() { return quality; }
    public void setQuality(Double quality) { this.quality = quality; }
    public Double getOee() { return oee; }
    public void setOee(Double oee) { this.oee = oee; }
}
