package com.knust.toyfactory.toy_factory_backend.dto;

import java.time.LocalDateTime;

public class NotificationResponse {
    private Long id;
    private Long machineId;
    private String machineName;
    private String title;
    private String message;
    private String type;
    private String severity;
    private Boolean read;
    private LocalDateTime createdAt;

    public NotificationResponse() {}

    public NotificationResponse(Long id, Long machineId, String machineName, String title,
                                String message, String type, String severity, Boolean read, LocalDateTime createdAt) {
        this.id = id;
        this.machineId = machineId;
        this.machineName = machineName;
        this.title = title;
        this.message = message;
        this.type = type;
        this.severity = severity;
        this.read = read;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getMachineId() { return machineId; }
    public void setMachineId(Long machineId) { this.machineId = machineId; }
    public String getMachineName() { return machineName; }
    public void setMachineName(String machineName) { this.machineName = machineName; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }
    public Boolean getRead() { return read; }
    public void setRead(Boolean read) { this.read = read; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
