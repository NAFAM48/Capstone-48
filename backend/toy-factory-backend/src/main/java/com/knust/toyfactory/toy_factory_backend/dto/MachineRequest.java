package com.knust.toyfactory.toy_factory_backend.dto;

public class MachineRequest {
    private String name;
    private String stage;
    private String status;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getStage() { return stage; }
    public void setStage(String stage) { this.stage = stage; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
