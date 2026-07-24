package com.ampm.simulation;

import com.ampm.process.Machine;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class DowntimeEvent {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    private Machine machine;

    private String reasonCode; // "Changeover", "Breakdown", "Maintenance"

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Machine getMachine() { return machine; }
    public void setMachine(Machine machine) { this.machine = machine; }

    public String getReasonCode() { return reasonCode; }
    public void setReasonCode(String reasonCode) { this.reasonCode = reasonCode; }

    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }
}
