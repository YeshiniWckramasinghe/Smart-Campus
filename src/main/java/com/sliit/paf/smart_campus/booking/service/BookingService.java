package com.sliit.paf.smart_campus.booking.service;

import com.sliit.paf.smart_campus.booking.dto.CreateBookingRequest;
import com.sliit.paf.smart_campus.booking.dto.UpdateBookingStatusRequest;
import com.sliit.paf.smart_campus.booking.entity.Booking;
import com.sliit.paf.smart_campus.booking.entity.BookingStatus;
import com.sliit.paf.smart_campus.booking.repository.BookingRepository;
import com.sliit.paf.smart_campus.facility.entity.Facility;
import com.sliit.paf.smart_campus.facility.repository.FacilityRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Set;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final FacilityRepository facilityRepository;

    public BookingService(BookingRepository bookingRepository, FacilityRepository facilityRepository) {
        this.bookingRepository = bookingRepository;
        this.facilityRepository = facilityRepository;
    }

    @Transactional
    public Booking createBooking(CreateBookingRequest request, String requesterEmail) {
        LocalDate bookingDate = parseDate(request.getDate());
        LocalTime startTime = parseTime(request.getStartTime());
        LocalTime endTime = parseTime(request.getEndTime());

        if (startTime.compareTo(endTime) >= 0) {
            throw new IllegalArgumentException("End time must be after start time.");
        }

        validateExpectedCapacity(request.getResourceType(), request.getExpectedCapacity());

        boolean hasConflict = bookingRepository
                .existsByResourceTypeAndBookingDateAndStatusInAndStartTimeLessThanAndEndTimeGreaterThan(
                        request.getResourceType(),
                bookingDate,
                        Set.of(BookingStatus.PENDING, BookingStatus.APPROVED),
                endTime,
                startTime
                );

        if (hasConflict) {
            throw new IllegalStateException("A conflicting booking already exists for this resource and time range.");
        }

        Booking booking = new Booking();
        booking.setResourceType(request.getResourceType());
        booking.setBookingDate(bookingDate);
        booking.setStartTime(startTime);
        booking.setEndTime(endTime);
        booking.setExpectedCapacity(request.getExpectedCapacity());
        booking.setPurpose(request.getPurpose());
        booking.setStatus(BookingStatus.PENDING);
        booking.setRequesterEmail(requesterEmail);

        return bookingRepository.save(booking);
    }

    private void validateExpectedCapacity(String resourceType, Integer expectedCapacity) {
        if (expectedCapacity == null || expectedCapacity <= 0 || resourceType == null || resourceType.isBlank()) {
            return;
        }

        String[] parts = resourceType.split(" - ", 2);
        Facility facility = null;

        if (parts.length == 2) {
            facility = facilityRepository
                    .findByNameIgnoreCaseAndLocationIgnoreCase(parts[0].trim(), parts[1].trim())
                    .orElse(null);
        }

        if (facility == null) {
            facility = facilityRepository.findByNameIgnoreCase(resourceType.trim()).orElse(null);
        }

        if (facility != null && facility.getCapacity() != null && expectedCapacity > facility.getCapacity()) {
            throw new IllegalArgumentException("Expected capacity cannot exceed facility capacity (" + facility.getCapacity() + ").");
        }
    }

    private LocalDate parseDate(String rawDate) {
        if (rawDate == null || rawDate.isBlank()) {
            throw new IllegalArgumentException("Date is required.");
        }

        List<DateTimeFormatter> formatters = List.of(
                DateTimeFormatter.ISO_LOCAL_DATE,
                DateTimeFormatter.ofPattern("M/d/yyyy"),
                DateTimeFormatter.ofPattern("MM/dd/yyyy")
        );

        for (DateTimeFormatter formatter : formatters) {
            try {
                return LocalDate.parse(rawDate.trim(), formatter);
            } catch (DateTimeParseException ignored) {
            }
        }

        throw new IllegalArgumentException("Invalid date format. Use YYYY-MM-DD.");
    }

    private LocalTime parseTime(String rawTime) {
        if (rawTime == null || rawTime.isBlank()) {
            throw new IllegalArgumentException("Time is required.");
        }

        List<DateTimeFormatter> formatters = List.of(
                DateTimeFormatter.ofPattern("H:mm"),
                DateTimeFormatter.ofPattern("HH:mm"),
                DateTimeFormatter.ofPattern("h:mm a"),
                DateTimeFormatter.ofPattern("hh:mm a")
        );

        for (DateTimeFormatter formatter : formatters) {
            try {
                return LocalTime.parse(rawTime.trim().toUpperCase(), formatter);
            } catch (DateTimeParseException ignored) {
            }
        }

        throw new IllegalArgumentException("Invalid time format. Use HH:mm.");
    }

    public List<Booking> getMyBookings(String requesterEmail) {
        return bookingRepository.findByRequesterEmailOrderByCreatedAtDesc(requesterEmail);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional
    public Booking updateBookingStatus(Long id, UpdateBookingStatusRequest request) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found with id: " + id));

        BookingStatus currentStatus = booking.getStatus();
        BookingStatus nextStatus = request.getStatus();

        if (currentStatus == BookingStatus.PENDING
                && nextStatus != BookingStatus.APPROVED
                && nextStatus != BookingStatus.REJECTED) {
            throw new IllegalStateException("Pending bookings can only be APPROVED or REJECTED.");
        }

        if (currentStatus == BookingStatus.APPROVED && nextStatus != BookingStatus.CANCELLED) {
            throw new IllegalStateException("Approved bookings can only be CANCELLED.");
        }

        if (currentStatus == BookingStatus.REJECTED || currentStatus == BookingStatus.CANCELLED) {
            throw new IllegalStateException("This booking is already finalized and cannot transition.");
        }

        if (nextStatus == BookingStatus.REJECTED) {
            String reason = request.getReason();
            if (reason == null || reason.isBlank()) {
                throw new IllegalArgumentException("A rejection reason is required.");
            }
            booking.setAdminReason(reason.trim());
        }

        booking.setStatus(nextStatus);
        return bookingRepository.save(booking);
    }
}
