package com.sliit.paf.smart_campus.facility.controller;

import com.sliit.paf.smart_campus.facility.dto.FacilityOptionResponse;
import com.sliit.paf.smart_campus.facility.entity.Facility;
import com.sliit.paf.smart_campus.facility.entity.FacilityType;
import com.sliit.paf.smart_campus.facility.service.FacilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/facilities")
public class FacilityPublicController {

    private final FacilityService facilityService;

    @Autowired
    public FacilityPublicController(FacilityService facilityService) {
        this.facilityService = facilityService;
    }

    @GetMapping
    public ResponseEntity<List<Facility>> getAllFacilities(
            @RequestParam(required = false) FacilityType type,
            @RequestParam(required = false) Integer capacity,
            @RequestParam(required = false) String location) {
        
        List<Facility> facilities = facilityService.getAllFacilities(type, capacity, location);
        return ResponseEntity.ok(facilities);
    }

    @GetMapping("/options")
    public ResponseEntity<List<FacilityOptionResponse>> getFacilityOptions() {
        return ResponseEntity.ok(facilityService.getFacilityOptions());
    }
}
