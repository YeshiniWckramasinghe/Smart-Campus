package com.sliit.paf.smart_campus.facility.controller;

import com.sliit.paf.smart_campus.facility.dto.FacilityOptionResponse;
import com.sliit.paf.smart_campus.facility.service.FacilityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/facility-options")
public class FacilityController {

    private final FacilityService facilityService;

    public FacilityController(FacilityService facilityService) {
        this.facilityService = facilityService;
    }

    @GetMapping
    public ResponseEntity<List<FacilityOptionResponse>> getFacilities() {
        return ResponseEntity.ok(facilityService.getFacilityOptions());
    }
}
