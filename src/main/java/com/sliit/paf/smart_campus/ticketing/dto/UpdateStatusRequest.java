package com.sliit.paf.smart_campus.ticketing.dto;

import com.sliit.paf.smart_campus.ticketing.entity.TicketStatus;
import jakarta.validation.constraints.NotNull;

public class UpdateStatusRequest {

    @NotNull(message = "Status cannot be null")
    private TicketStatus status;

    public TicketStatus getStatus() {
        return status;
    }

    public void setStatus(TicketStatus status) {
        this.status = status;
    }
}
