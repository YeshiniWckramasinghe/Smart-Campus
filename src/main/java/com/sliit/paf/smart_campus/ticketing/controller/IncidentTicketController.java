package com.sliit.paf.smart_campus.ticketing.controller;

import com.sliit.paf.smart_campus.ticketing.dto.CreateTicketRequest;
import com.sliit.paf.smart_campus.ticketing.dto.UpdateStatusRequest;
import com.sliit.paf.smart_campus.ticketing.entity.IncidentTicket;
import com.sliit.paf.smart_campus.ticketing.service.IncidentTicketService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tickets")
public class IncidentTicketController {

    private final IncidentTicketService ticketService;

    public IncidentTicketController(IncidentTicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping
    public ResponseEntity<IncidentTicket> createTicket(
            @Valid @ModelAttribute CreateTicketRequest request) {

        IncidentTicket ticket = new IncidentTicket();
        ticket.setCategory(request.getCategory());
        ticket.setDescription(request.getDescription());
        ticket.setPriority(request.getPriority());
        ticket.setReporterId(request.getReporterId());
        ticket.setLocation(request.getLocation());

        IncidentTicket createdTicket = ticketService.createTicket(ticket, request.getFiles());

        return ResponseEntity.status(HttpStatus.CREATED).body(createdTicket);
    }

    @GetMapping("/{id}")
    public ResponseEntity<IncidentTicket> getTicket(@PathVariable Long id) {
        IncidentTicket ticket = ticketService.getTicketById(id);
        return ResponseEntity.ok(ticket);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<IncidentTicket> updateTicketStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateStatusRequest request) {

        IncidentTicket updatedTicket = ticketService.updateTicketStatus(id, request.getStatus());
        return ResponseEntity.ok(updatedTicket);
    }

    @DeleteMapping("/{id}/comments/{cid}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long id,
            @PathVariable Long cid,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        // In a real scenario, extracting username/ID from the JWT principal securely:
        String currentUserId = (userDetails != null) ? userDetails.getUsername() : "anonymousUser";
        
        try {
            ticketService.deleteComment(id, cid, currentUserId);
            return ResponseEntity.noContent().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
}
