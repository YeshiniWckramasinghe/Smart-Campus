package com.sliit.paf.smart_campus.facility.repository;

import com.sliit.paf.smart_campus.facility.entity.Facility;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FacilityRepository extends JpaRepository<Facility, Long> {
    List<Facility> findAllByOrderByNameAsc();
    Optional<Facility> findByNameIgnoreCase(String name);
    Optional<Facility> findByNameIgnoreCaseAndLocationIgnoreCase(String name, String location);
}
