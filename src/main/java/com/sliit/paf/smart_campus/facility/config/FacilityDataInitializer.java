package com.sliit.paf.smart_campus.facility.config;

import com.sliit.paf.smart_campus.facility.entity.Facility;
import com.sliit.paf.smart_campus.facility.repository.FacilityRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;
import java.util.Map;

@Configuration
public class FacilityDataInitializer {

    @Bean
    CommandLineRunner seedFacilities(FacilityRepository facilityRepository) {
        return args -> {
            Map<String, Facility> defaults = Map.of(
                    "Library", new Facility("Library", "Main Library Building", 200),
                    "New Building", new Facility("New Building", "North Campus Block", 300),
                    "Lab", new Facility("Lab", "Engineering Building", 40),
                    "Lecture Hall", new Facility("Lecture Hall", "Main Academic Block", 120),
                    "Meeting Room", new Facility("Meeting Room", "Administration Block", 20),
                    "Other", new Facility("Other", "Campus", 50)
            );

            for (Facility defaultFacility : defaults.values()) {
                Facility facility = facilityRepository.findByNameIgnoreCase(defaultFacility.getName())
                        .orElseGet(() -> new Facility(defaultFacility.getName()));

                if (facility.getLocation() == null || facility.getLocation().isBlank()) {
                    facility.setLocation(defaultFacility.getLocation());
                }

                if (facility.getCapacity() == null || facility.getCapacity() <= 0) {
                    facility.setCapacity(defaultFacility.getCapacity());
                }

                facilityRepository.save(facility);
            }
        };
    }
}
