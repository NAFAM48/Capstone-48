package com.knust.toyfactory.toy_factory_backend.dto;

public class MachineResponse {
    private Long id;
    private String name;
    private String stage;
    private String status;

    public MachineResponse() {}

    public MachineResponse(Long id, String name, String stage, String status) {
        this.id = id;
        this.name = name;
        this.stage = stage;
        this.status = status;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getStage() { return stage; }
    public void setStage(String stage) { this.stage = stage; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
