package com.knust.toyfactory.toy_factory_backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "noise_readings")
public class NoiseReading {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "machine_id")
    private Machine machine;

    private LocalDateTime timestamp;
    private Double noiseLevel;      // raw noise value (e.g. decibels or vibration units)
    private Boolean isAnomaly;      // true if this reading looks abnormal

    public NoiseReading() {
    }

    public NoiseReading(Machine machine, LocalDateTime timestamp, Double noiseLevel, Boolean isAnomaly) {
        this.machine = machine;
        this.timestamp = timestamp;
        this.noiseLevel = noiseLevel;
        this.isAnomaly = isAnomaly;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Machine getMachine() { return machine; }
    public void setMachine(Machine machine) { this.machine = machine; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public Double getNoiseLevel() { return noiseLevel; }
    public void setNoiseLevel(Double noiseLevel) { this.noiseLevel = noiseLevel; }

    public Boolean getIsAnomaly() { return isAnomaly; }
    public void setIsAnomaly(Boolean isAnomaly) { this.isAnomaly = isAnomaly; }
}