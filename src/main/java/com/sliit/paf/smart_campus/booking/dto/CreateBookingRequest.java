package com.sliit.paf.smart_campus.booking.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateBookingRequest {

    @NotBlank(message = "Resource type is required")
    private String resourceType;

    @NotBlank(message = "Date is required")
    private String date;

    @NotBlank(message = "Start time is required")
    private String startTime;

    @NotBlank(message = "End time is required")
    private String endTime;

    @NotNull(message = "Expected capacity is required")
    @Min(value = 1, message = "Expected capacity must be at least 1")
    private Integer expectedCapacity;

    @NotBlank(message = "Purpose is required")
    private String purpose;

    public String getResourceType() {
        return resourceType;
    }

    public void setResourceType(String resourceType) {
        this.resourceType = resourceType;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public Integer getExpectedCapacity() {
        return expectedCapacity;
    }

    public void setExpectedCapacity(Integer expectedCapacity) {
        this.expectedCapacity = expectedCapacity;
    }

    public String getPurpose() {
        return purpose;
    }

    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }
}
