package com.ampm.process;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class Machine {

    @Id
    @GeneratedValue
    private Long id;

    private String name;
    private String lineId;
    private String status;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getLineId() { return lineId; }
    public void setLineId(String lineId) { this.lineId = lineId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
