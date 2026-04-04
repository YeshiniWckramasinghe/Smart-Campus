package com.sliit.paf.smart_campus.notification.dto;

import com.sliit.paf.smart_campus.notification.model.NotificationType;
import java.time.LocalDateTime;

public class NotificationResponse {
    private Long id;
    private String title;
    private String message;
    private boolean isRead;
    private NotificationType type;
    private LocalDateTime createdAt;

    public NotificationResponse(Long id, String title, String message,
                                 boolean isRead, NotificationType type,
                                 LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.message = message;
        this.isRead = isRead;
        this.type = type;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getMessage() { return message; }
    public boolean isRead() { return isRead; }
    public NotificationType getType() { return type; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}