package com.sliit.paf.smart_campus.facility.controller;

import com.sliit.paf.smart_campus.facility.dto.FacilityOptionResponse;
import com.sliit.paf.smart_campus.facility.entity.Facility;
import com.sliit.paf.smart_campus.facility.entity.FacilityType;
import com.sliit.paf.smart_campus.facility.service.FacilityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/facilities")
public class FacilityController {

    private final FacilityService facilityService;

    public FacilityController(FacilityService facilityService) {
        this.facilityService = facilityService;
    }

    /** Dropdown options (id + name + location + capacity) */
    @GetMapping("/options")
    public ResponseEntity<List<FacilityOptionResponse>> getFacilityOptions() {
        return ResponseEntity.ok(facilityService.getFacilityOptions());
    }

    /** Full list with optional filters */
    @GetMapping
    public ResponseEntity<List<Facility>> getAllFacilities(
            @RequestParam(required = false) FacilityType type,
            @RequestParam(required = false) Integer capacity,
            @RequestParam(required = false) String location) {
        return ResponseEntity.ok(facilityService.getAllFacilities(type, capacity, location));
    }

    /** Single facility by id */
    @GetMapping("/{id}")
    public ResponseEntity<Facility> getFacilityById(@PathVariable Long id) {
        return ResponseEntity.ok(facilityService.getFacilityById(id));
    }
}
