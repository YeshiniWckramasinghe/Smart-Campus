package com.sliit.paf.smart_campus.facility.service;

import com.sliit.paf.smart_campus.facility.dto.FacilityOptionResponse;
import com.sliit.paf.smart_campus.facility.repository.FacilityRepository;
import org.springframework.stereotype.Service;

import java.util.List;

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
}
