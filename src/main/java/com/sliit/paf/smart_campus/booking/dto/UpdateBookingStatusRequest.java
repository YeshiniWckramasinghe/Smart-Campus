package com.sliit.paf.smart_campus.booking.dto;

import com.sliit.paf.smart_campus.booking.entity.BookingStatus;
import jakarta.validation.constraints.NotNull;

public class UpdateBookingStatusRequest {

    @NotNull(message = "Status is required")
    private BookingStatus status;

    private String reason;

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
