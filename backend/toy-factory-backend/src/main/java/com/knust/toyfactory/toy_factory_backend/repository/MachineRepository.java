package com.knust.toyfactory.toy_factory_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.knust.toyfactory.toy_factory_backend.model.Machine;

public interface MachineRepository extends JpaRepository<Machine, Long> {
}