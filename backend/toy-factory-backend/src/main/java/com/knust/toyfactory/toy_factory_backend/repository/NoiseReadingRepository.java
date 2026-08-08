package com.knust.toyfactory.toy_factory_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.knust.toyfactory.toy_factory_backend.model.NoiseReading;

public interface NoiseReadingRepository extends JpaRepository<NoiseReading, Long> {
}