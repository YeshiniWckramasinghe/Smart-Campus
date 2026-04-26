package com.sliit.paf.smart_campus.facility.repository;

import com.sliit.paf.smart_campus.facility.entity.Facility;
import com.sliit.paf.smart_campus.facility.entity.FacilityType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FacilityRepository extends JpaRepository<Facility, Long> {
    List<Facility> findByType(FacilityType type);
    List<Facility> findByCapacityGreaterThanEqual(Integer capacity);
    List<Facility> findByLocationContainingIgnoreCase(String location);
    List<Facility> findAllByOrderByNameAsc();
}
