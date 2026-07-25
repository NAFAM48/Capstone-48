package com.ampm.simulation;

import com.ampm.process.Machine;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class ProductionRecord {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    private Machine machine;

    private int goodUnits;
    private int defectiveUnits;
    private LocalDateTime recordedAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Machine getMachine() { return machine; }
    public void setMachine(Machine machine) { this.machine = machine; }

    public int getGoodUnits() { return goodUnits; }
    public void setGoodUnits(int goodUnits) { this.goodUnits = goodUnits; }

    public int getDefectiveUnits() { return defectiveUnits; }
    public void setDefectiveUnits(int defectiveUnits) { this.defectiveUnits = defectiveUnits; }

    public LocalDateTime getRecordedAt() { return recordedAt; }
    public void setRecordedAt(LocalDateTime recordedAt) { this.recordedAt = recordedAt; }
}
