package com.knust.toyfactory.toy_factory_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.knust.toyfactory.toy_factory_backend.model.DowntimeEvent;

public interface DowntimeEventRepository extends JpaRepository<DowntimeEvent, Long> {
    List<DowntimeEvent> findByMachineId(Long machineId);
}