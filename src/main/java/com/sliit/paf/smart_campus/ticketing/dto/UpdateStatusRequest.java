package com.sliit.paf.smart_campus.ticketing.dto;

import com.sliit.paf.smart_campus.ticketing.entity.TicketStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateStatusRequest {

    @NotNull(message = "Status cannot be null")
    private TicketStatus status;
}
