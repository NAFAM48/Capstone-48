package com.knust.toyfactory.toy_factory_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.knust.toyfactory.toy_factory_backend.model.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByReadFalseOrderByCreatedAtDesc();
    List<Notification> findByMachineIdOrderByCreatedAtDesc(Long machineId);
    List<Notification> findAllByOrderByCreatedAtDesc();
}
