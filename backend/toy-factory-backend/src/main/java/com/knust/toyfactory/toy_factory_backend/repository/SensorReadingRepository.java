package com.knust.toyfactory.toy_factory_backend.repository;

import java.util.List;

import com.knust.toyfactory.toy_factory_backend.model.SensorReading;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SensorReadingRepository extends JpaRepository<SensorReading, Long> {
    List<SensorReading> findByMachineId(Long machineId);
}