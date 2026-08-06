package com.knust.toyfactory.toy_factory_backend.repository;

import com.knust.toyfactory.toy_factory_backend.model.SensorReading;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SensorReadingRepository extends JpaRepository<SensorReading, Long> {
}