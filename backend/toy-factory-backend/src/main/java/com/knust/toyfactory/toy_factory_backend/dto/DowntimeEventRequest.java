package com.knust.toyfactory.toy_factory_backend.dto;

import java.time.LocalDateTime;

public class DowntimeEventRequest {
    private Long machineId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String cause;

    public Long getMachineId() { return machineId; }
    public void setMachineId(Long machineId) { this.machineId = machineId; }
    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }
    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }
    public String getCause() { return cause; }
    public void setCause(String cause) { this.cause = cause; }
}
