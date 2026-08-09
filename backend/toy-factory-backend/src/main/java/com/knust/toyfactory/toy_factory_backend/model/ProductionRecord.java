package com.knust.toyfactory.toy_factory_backend.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "production_records")
public class ProductionRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "machine_id")
    private Machine machine;

    private Integer goodUnits;
    private Integer defectiveUnits;
    private Double idealCycleTime;
    private Double plannedProductionTime;
    private LocalDateTime recordedAt;

    public ProductionRecord() {
    }

    public ProductionRecord(Machine machine, Integer goodUnits, Integer defectiveUnits,
                            Double idealCycleTime, Double plannedProductionTime, LocalDateTime recordedAt) {
        this.machine = machine;
        this.goodUnits = goodUnits;
        this.defectiveUnits = defectiveUnits;
        this.idealCycleTime = idealCycleTime;
        this.plannedProductionTime = plannedProductionTime;
        this.recordedAt = recordedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Machine getMachine() { return machine; }
    public void setMachine(Machine machine) { this.machine = machine; }

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
