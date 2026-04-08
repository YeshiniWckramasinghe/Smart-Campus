package com.sliit.paf.smart_campus.ticketing.repository;

import com.sliit.paf.smart_campus.ticketing.entity.IncidentTicket;
import com.sliit.paf.smart_campus.ticketing.entity.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncidentTicketRepository extends JpaRepository<IncidentTicket, Long> {
    List<IncidentTicket> findByReporterId(String reporterId);
    List<IncidentTicket> findByStatus(TicketStatus status);
}
