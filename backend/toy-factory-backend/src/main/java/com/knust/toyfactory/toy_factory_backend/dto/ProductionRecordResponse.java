package com.knust.toyfactory.toy_factory_backend.dto;

import java.time.LocalDateTime;

public class ProductionRecordResponse {
    private Long id;
    private Long machineId;
    private Integer goodUnits;
    private Integer defectiveUnits;
    private Double idealCycleTime;
    private Double plannedProductionTime;
    private LocalDateTime recordedAt;

    public ProductionRecordResponse() {}

    public ProductionRecordResponse(Long id, Long machineId, Integer goodUnits, Integer defectiveUnits,
                                    Double idealCycleTime, Double plannedProductionTime, LocalDateTime recordedAt) {
        this.id = id;
        this.machineId = machineId;
        this.goodUnits = goodUnits;
        this.defectiveUnits = defectiveUnits;
        this.idealCycleTime = idealCycleTime;
        this.plannedProductionTime = plannedProductionTime;
        this.recordedAt = recordedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getMachineId() { return machineId; }
    public void setMachineId(Long machineId) { this.machineId = machineId; }
    public Integer getGoodUnits() { return goodUnits; }
    public void setGoodUnits(Integer goodUnits) { this.goodUnits = goodUnits; }
    public Integer getDefectiveUnits() { return defectiveUnits; }
    public void setDefectiveUnits(Integer defectiveUnits) { this.defectiveUnits = defectiveUnits; }
    public Double getIdealCycleTime() { return idealCycleTime; }
    public void setIdealCycleTime(Double idealCycleTime) { this.idealCycleTime = idealCycleTime; }
    public Double getPlannedProductionTime() { return plannedProductionTime; }
    public void setPlannedProductionTime(Double plannedProductionTime) { this.plannedProductionTime = plannedProductionTime; }
    public LocalDateTime getRecordedAt() { return recordedAt; }
    public void setRecordedAt(LocalDateTime recordedAt) { this.recordedAt = recordedAt; }
}
