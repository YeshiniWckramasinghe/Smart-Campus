package com.sliit.paf.smart_campus.ticketing.dto;

import com.sliit.paf.smart_campus.ticketing.entity.IncidentCategory;
import com.sliit.paf.smart_campus.ticketing.entity.TicketPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
public class CreateTicketRequest {

    @NotNull(message = "Category is required")
    private IncidentCategory category;

    @NotBlank(message = "Description cannot be empty")
    private String description;

    @NotNull(message = "Priority is required")
    private TicketPriority priority;

    @NotBlank(message = "Reporter ID is required")
    private String reporterId;

    @NotBlank(message = "Location is required")
    private String location;
    
    // We can also accept files here if passed in multipart forms
    private List<MultipartFile> files;
}
