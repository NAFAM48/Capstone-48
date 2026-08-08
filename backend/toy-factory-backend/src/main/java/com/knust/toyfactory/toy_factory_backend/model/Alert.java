package com.knust.toyfactory.toy_factory_backend.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "alerts")
public class Alert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "machine_id")
    private Machine machine;

    private LocalDateTime timestamp;
    private String message;      // e.g. "Machine temperature exceeded threshold"
    private String severity;     // e.g. "LOW", "MEDIUM", "HIGH"
    private Boolean resolved;    // true once someone has addressed it

    public Alert() {
    }

    public Alert(Machine machine, LocalDateTime timestamp, String message, String severity, Boolean resolved) {
        this.machine = machine;
        this.timestamp = timestamp;
        this.message = message;
        this.severity = severity;
        this.resolved = resolved;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Machine getMachine() { return machine; }
    public void setMachine(Machine machine) { this.machine = machine; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public Boolean getResolved() { return resolved; }
    public void setResolved(Boolean resolved) { this.resolved = resolved; }
}