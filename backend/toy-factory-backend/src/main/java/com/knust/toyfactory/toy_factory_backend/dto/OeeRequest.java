package com.knust.toyfactory.toy_factory_backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "OeeRequest", description = "Payload for OEE calculation")
public class OeeRequest {

    @Schema(description = "Total operating time in minutes", example = "480")
    private Double operatingTime;

    @Schema(description = "Planned production time in minutes", example = "500")
    private Double plannedProductionTime;

    @Schema(description = "Ideal cycle time per unit", example = "2")
    private Double idealCycleTime;

    @Schema(description = "Total number of units produced", example = "200")
    private Double totalCount;

    @Schema(description = "Number of good units produced", example = "195")
    private Double goodCount;

    public Double getOperatingTime() { return operatingTime; }
    public void setOperatingTime(Double operatingTime) { this.operatingTime = operatingTime; }
    public Double getPlannedProductionTime() { return plannedProductionTime; }
    public void setPlannedProductionTime(Double plannedProductionTime) { this.plannedProductionTime = plannedProductionTime; }
    public Double getIdealCycleTime() { return idealCycleTime; }
    public void setIdealCycleTime(Double idealCycleTime) { this.idealCycleTime = idealCycleTime; }
    public Double getTotalCount() { return totalCount; }
    public void setTotalCount(Double totalCount) { this.totalCount = totalCount; }
    public Double getGoodCount() { return goodCount; }
    public void setGoodCount(Double goodCount) { this.goodCount = goodCount; }
}
