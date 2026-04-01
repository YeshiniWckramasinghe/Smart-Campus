package com.sliit.paf.smart_campus.notification.service;

import com.sliit.paf.smart_campus.notification.dto.NotificationRequest;
import com.sliit.paf.smart_campus.notification.dto.NotificationResponse;
import com.sliit.paf.smart_campus.notification.model.Notification;
import com.sliit.paf.smart_campus.notification.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public Notification sendNotification(NotificationRequest request) {
        Notification notification = new Notification();
        notification.setTitle(request.getTitle());
        notification.setMessage(request.getMessage());
        notification.setRecipientEmail(request.getRecipientEmail());
        notification.setType(request.getType());
        return notificationRepository.save(notification);
    }

    public List<NotificationResponse> getNotifications(String email) {
        return notificationRepository
                .findByRecipientEmailOrderByCreatedAtDesc(email)
                .stream()
                .map(n -> new NotificationResponse(
                        n.getId(), n.getTitle(), n.getMessage(),
                        n.isRead(), n.getType(), n.getCreatedAt()))
                .collect(Collectors.toList());
    }

    public List<NotificationResponse> getUnreadNotifications(String email) {
        return notificationRepository
                .findByRecipientEmailAndIsReadOrderByCreatedAtDesc(email, false)
                .stream()
                .map(n -> new NotificationResponse(
                        n.getId(), n.getTitle(), n.getMessage(),
                        n.isRead(), n.getType(), n.getCreatedAt()))
                .collect(Collectors.toList());
    }

    public long getUnreadCount(String email) {
        return notificationRepository.countByRecipientEmailAndIsRead(email, false);
    }

    public Notification markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    public void markAllAsRead(String email) {
        List<Notification> unread = notificationRepository
                .findByRecipientEmailAndIsReadOrderByCreatedAtDesc(email, false);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }
}