package com.sliit.paf.smart_campus.booking.repository;

import com.sliit.paf.smart_campus.booking.entity.Booking;
import com.sliit.paf.smart_campus.booking.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collection;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByRequesterEmailOrderByCreatedAtDesc(String requesterEmail);

    List<Booking> findAllByOrderByCreatedAtDesc();

    boolean existsByResourceTypeAndBookingDateAndStatusInAndStartTimeLessThanAndEndTimeGreaterThan(
            String resourceType,
            LocalDate bookingDate,
            Collection<BookingStatus> statuses,
            LocalTime endTime,
            LocalTime startTime
    );
}
