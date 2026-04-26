package com.sliit.paf.smart_campus.facility.service;

import com.sliit.paf.smart_campus.facility.dto.FacilityOptionResponse;
import com.sliit.paf.smart_campus.facility.entity.Facility;
import com.sliit.paf.smart_campus.facility.entity.FacilityType;
import com.sliit.paf.smart_campus.facility.repository.FacilityRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Stream;

@Service
public class FacilityService {

    private final FacilityRepository facilityRepository;

    public FacilityService(FacilityRepository facilityRepository) {
        this.facilityRepository = facilityRepository;
    }

    public List<FacilityOptionResponse> getFacilityOptions() {
        return facilityRepository.findAllByOrderByNameAsc().stream()
            .map(facility -> new FacilityOptionResponse(
                facility.getId(),
                facility.getName(),
                facility.getLocation(),
                facility.getCapacity()
            ))
                .toList();
    }

    /**
     * Returns all facilities, optionally filtered by capacity and/or location.
     * The {@code type} parameter is accepted for API compatibility but ignored
     * because the Facility entity does not carry a type field.
     */
    public List<Facility> getAllFacilities(FacilityType type, Integer capacity, String location) {
        Stream<Facility> stream = facilityRepository.findAllByOrderByNameAsc().stream();
        if (capacity != null) {
            stream = stream.filter(f -> f.getCapacity() != null && f.getCapacity() >= capacity);
        }
        if (location != null && !location.isBlank()) {
            stream = stream.filter(f -> f.getLocation() != null &&
                    f.getLocation().equalsIgnoreCase(location));
        }
        return stream.toList();
    }

    public Facility getFacilityById(Long id) {
        return facilityRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Facility not found with id: " + id));
    }
}
