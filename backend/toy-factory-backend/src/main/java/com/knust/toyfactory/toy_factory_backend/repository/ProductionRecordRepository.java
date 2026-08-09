package com.knust.toyfactory.toy_factory_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.knust.toyfactory.toy_factory_backend.model.ProductionRecord;

public interface ProductionRecordRepository extends JpaRepository<ProductionRecord, Long> {
    List<ProductionRecord> findByMachineId(Long machineId);
}
