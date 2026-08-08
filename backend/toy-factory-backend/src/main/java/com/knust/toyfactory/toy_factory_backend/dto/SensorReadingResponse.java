package com.knust.toyfactory.toy_factory_backend.dto;

import java.time.LocalDateTime;

public class SensorReadingResponse {
    private Long id;
    private Long machineId;
    private LocalDateTime timestamp;
    private Integer outputCount;
    private Double temperature;

    public SensorReadingResponse() {}

    public SensorReadingResponse(Long id, Long machineId, LocalDateTime timestamp, Integer outputCount, Double temperature) {
        this.id = id;
        this.machineId = machineId;
        this.timestamp = timestamp;
        this.outputCount = outputCount;
        this.temperature = temperature;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getMachineId() { return machineId; }
    public void setMachineId(Long machineId) { this.machineId = machineId; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    public Integer getOutputCount() { return outputCount; }
    public void setOutputCount(Integer outputCount) { this.outputCount = outputCount; }
    public Double getTemperature() { return temperature; }
    public void setTemperature(Double temperature) { this.temperature = temperature; }
}
