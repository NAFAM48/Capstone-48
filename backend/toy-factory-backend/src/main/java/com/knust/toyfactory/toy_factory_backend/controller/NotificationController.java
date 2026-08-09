package com.knust.toyfactory.toy_factory_backend.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.knust.toyfactory.toy_factory_backend.dto.NotificationRequest;
import com.knust.toyfactory.toy_factory_backend.dto.NotificationResponse;
import com.knust.toyfactory.toy_factory_backend.model.Machine;
import com.knust.toyfactory.toy_factory_backend.model.Notification;
import com.knust.toyfactory.toy_factory_backend.repository.MachineRepository;
import com.knust.toyfactory.toy_factory_backend.repository.NotificationRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/notifications")
@Tag(name = "Notifications", description = "Manage notifications")
public class NotificationController {

    private final NotificationRepository notificationRepository;
    private final MachineRepository machineRepository;

    public NotificationController(NotificationRepository notificationRepository, MachineRepository machineRepository) {
        this.notificationRepository = notificationRepository;
        this.machineRepository = machineRepository;
    }

    @Operation(summary = "Get all notifications (most recent first)")
    @GetMapping
    public List<NotificationResponse> getAll() {
        return notificationRepository.findAllByOrderByCreatedAtDesc().stream().map(this::toResponse).toList();
    }

    @Operation(summary = "Get unread notifications")
    @GetMapping("/unread")
    public List<NotificationResponse> getUnread() {
        return notificationRepository.findByReadFalseOrderByCreatedAtDesc().stream().map(this::toResponse).toList();
    }

    @Operation(summary = "Get notifications for a specific machine")
    @GetMapping("/machine/{machineId}")
    public List<NotificationResponse> getByMachine(@PathVariable Long machineId) {
        return notificationRepository.findByMachineIdOrderByCreatedAtDesc(machineId).stream().map(this::toResponse).toList();
    }

    @Operation(summary = "Create a notification")
    @PostMapping
    public NotificationResponse create(@RequestBody NotificationRequest request) {
        Machine machine = null;
        if (request.getMachineId() != null) {
            machine = machineRepository.findById(request.getMachineId())
                .orElseThrow(() -> new IllegalArgumentException("Machine not found"));
        }

        Notification notification = new Notification();
        notification.setMachine(machine);
        notification.setTitle(request.getTitle());
        notification.setMessage(request.getMessage());
        notification.setType(request.getType());
        notification.setSeverity(request.getSeverity());
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());

        return toResponse(notificationRepository.save(notification));
    }

    @Operation(summary = "Mark a notification as read")
    @PutMapping("/{id}/read")
    public ResponseEntity<NotificationResponse> markAsRead(@PathVariable Long id) {
        return notificationRepository.findById(id)
            .map(notification -> {
                notification.setRead(true);
                return ResponseEntity.ok(toResponse(notificationRepository.save(notification)));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Mark all notifications as read")
    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead() {
        List<Notification> unread = notificationRepository.findByReadFalseOrderByCreatedAtDesc();
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Delete a notification")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!notificationRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        notificationRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private NotificationResponse toResponse(Notification notification) {
        return new NotificationResponse(
            notification.getId(),
            notification.getMachine() != null ? notification.getMachine().getId() : null,
            notification.getMachine() != null ? notification.getMachine().getName() : null,
            notification.getTitle(),
            notification.getMessage(),
            notification.getType(),
            notification.getSeverity(),
            notification.getRead(),
            notification.getCreatedAt()
        );
    }
}
