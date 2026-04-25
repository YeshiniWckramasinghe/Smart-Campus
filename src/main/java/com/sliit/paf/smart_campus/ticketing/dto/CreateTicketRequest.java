package com.sliit.paf.smart_campus.ticketing.dto;

import com.sliit.paf.smart_campus.ticketing.entity.IncidentCategory;
import com.sliit.paf.smart_campus.ticketing.entity.TicketPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

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

    public IncidentCategory getCategory() {
        return category;
    }

    public void setCategory(IncidentCategory category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public TicketPriority getPriority() {
        return priority;
    }

    public void setPriority(TicketPriority priority) {
        this.priority = priority;
    }

    public String getReporterId() {
        return reporterId;
    }

    public void setReporterId(String reporterId) {
        this.reporterId = reporterId;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public List<MultipartFile> getFiles() {
        return files;
    }

    public void setFiles(List<MultipartFile> files) {
        this.files = files;
    }
}
