package com.knust.toyfactory.toy_factory_backend.dto;

import java.time.LocalDateTime;

public class SensorReadingRequest {
    private Long machineId;
    private LocalDateTime timestamp;
    private Integer outputCount;
    private Double temperature;

    public Long getMachineId() { return machineId; }
    public void setMachineId(Long machineId) { this.machineId = machineId; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    public Integer getOutputCount() { return outputCount; }
    public void setOutputCount(Integer outputCount) { this.outputCount = outputCount; }
    public Double getTemperature() { return temperature; }
    public void setTemperature(Double temperature) { this.temperature = temperature; }
}
