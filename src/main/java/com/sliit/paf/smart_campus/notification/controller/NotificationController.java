package com.sliit.paf.smart_campus.notification.controller;

import com.sliit.paf.smart_campus.notification.dto.NotificationRequest;
import com.sliit.paf.smart_campus.notification.dto.NotificationResponse;
import com.sliit.paf.smart_campus.notification.model.Notification;
import com.sliit.paf.smart_campus.notification.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    // Admin send notification to lecturer/technician
    @PostMapping("/send")
    public ResponseEntity<Notification> send(@RequestBody NotificationRequest request) {
        return ResponseEntity.ok(notificationService.sendNotification(request));
    }

    // Get all notifications for a user
    @GetMapping("/{email}")
    public ResponseEntity<List<NotificationResponse>> getAll(@PathVariable String email) {
        return ResponseEntity.ok(notificationService.getNotifications(email));
    }

    // Get unread notifications
    @GetMapping("/{email}/unread")
    public ResponseEntity<List<NotificationResponse>> getUnread(@PathVariable String email) {
        return ResponseEntity.ok(notificationService.getUnreadNotifications(email));
    }

    // Get unread count (for bell icon 🔔)
    @GetMapping("/{email}/unread/count")
    public ResponseEntity<Long> getUnreadCount(@PathVariable String email) {
        return ResponseEntity.ok(notificationService.getUnreadCount(email));
    }

    // Mark single notification as read
    @PutMapping("/{id}/read")
    public ResponseEntity<Notification> markRead(@PathVariable Long id) {
        return ResponseEntity.ok(notificationService.markAsRead(id));
    }

    // Mark all as read
    @PutMapping("/{email}/read-all")
    public ResponseEntity<Void> markAllRead(@PathVariable String email) {
        notificationService.markAllAsRead(email);
        return ResponseEntity.ok().build();
    }
}