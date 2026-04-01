package com.sliit.paf.smart_campus.notification.dto;

import com.sliit.paf.smart_campus.notification.model.NotificationType;

public class NotificationRequest {
    private String recipientEmail;
    private String title;
    private String message;
    private NotificationType type;

    public String getRecipientEmail() { return recipientEmail; }
    public void setRecipientEmail(String email) { this.recipientEmail = email; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public NotificationType getType() { return type; }
    public void setType(NotificationType type) { this.type = type; }
}