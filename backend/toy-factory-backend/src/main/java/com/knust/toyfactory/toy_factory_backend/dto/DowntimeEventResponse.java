package com.knust.toyfactory.toy_factory_backend.dto;

import java.time.LocalDateTime;

public class DowntimeEventResponse {
    private Long id;
    private Long machineId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String cause;

    public DowntimeEventResponse() {}

    public DowntimeEventResponse(Long id, Long machineId, LocalDateTime startTime, LocalDateTime endTime, String cause) {
        this.id = id;
        this.machineId = machineId;
        this.startTime = startTime;
        this.endTime = endTime;
        this.cause = cause;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getMachineId() { return machineId; }
    public void setMachineId(Long machineId) { this.machineId = machineId; }
    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }
    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }
    public String getCause() { return cause; }
    public void setCause(String cause) { this.cause = cause; }
}
