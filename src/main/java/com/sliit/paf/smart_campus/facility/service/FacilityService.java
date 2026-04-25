package com.sliit.paf.smart_campus.facility.service;

import com.sliit.paf.smart_campus.facility.dto.FacilityRequest;
import com.sliit.paf.smart_campus.facility.entity.Facility;
import com.sliit.paf.smart_campus.facility.entity.FacilityStatus;
import com.sliit.paf.smart_campus.facility.entity.FacilityType;
import com.sliit.paf.smart_campus.facility.repository.FacilityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FacilityService {

    private final FacilityRepository facilityRepository;

    @Autowired
    public FacilityService(FacilityRepository facilityRepository) {
        this.facilityRepository = facilityRepository;
    }

    public Facility createFacility(FacilityRequest request) {
        Facility facility = new Facility();
        facility.setName(request.getName());
        facility.setType(request.getType());
        facility.setCapacity(request.getCapacity());
        facility.setLocation(request.getLocation());
        facility.setDescription(request.getDescription());
        if (request.getStatus() != null) {
            facility.setStatus(request.getStatus());
        }
        return facilityRepository.save(facility);
    }

    public List<Facility> getAllFacilities(FacilityType type, Integer capacity, String location) {
        List<Facility> facilities = facilityRepository.findAll();
        
        if (type != null) {
            facilities = facilities.stream().filter(f -> f.getType() == type).collect(Collectors.toList());
        }
        if (capacity != null) {
            facilities = facilities.stream().filter(f -> f.getCapacity() >= capacity).collect(Collectors.toList());
        }
        if (location != null && !location.isEmpty()) {
            facilities = facilities.stream().filter(f -> f.getLocation().toLowerCase().contains(location.toLowerCase())).collect(Collectors.toList());
        }
        
        return facilities;
    }

    public Facility getFacilityById(Long id) {
        return facilityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Facility not found with ID: " + id));
    }

    public Facility updateFacility(Long id, FacilityRequest request) {
        Facility facility = getFacilityById(id);
        
        facility.setName(request.getName());
        facility.setType(request.getType());
        facility.setCapacity(request.getCapacity());
        facility.setLocation(request.getLocation());
        facility.setDescription(request.getDescription());
        if (request.getStatus() != null) {
            facility.setStatus(request.getStatus());
        }
        
        return facilityRepository.save(facility);
    }

    public void deleteFacility(Long id) {
        Facility facility = getFacilityById(id);
        facilityRepository.delete(facility);
    }
}
