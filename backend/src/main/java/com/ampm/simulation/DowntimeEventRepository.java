package com.ampm.simulation;

import org.springframework.data.jpa.repository.JpaRepository;

public interface DowntimeEventRepository extends JpaRepository<DowntimeEvent, Long> {
}
