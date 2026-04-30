package com.sliit.paf.smart_campus.ticketing.controller;

import com.sliit.paf.smart_campus.ticketing.dto.CreateCommentRequest;
import com.sliit.paf.smart_campus.ticketing.dto.CreateTicketRequest;
import com.sliit.paf.smart_campus.ticketing.dto.UpdateStatusRequest;
import com.sliit.paf.smart_campus.ticketing.entity.Comment;
import com.sliit.paf.smart_campus.ticketing.entity.IncidentTicket;
import com.sliit.paf.smart_campus.ticketing.service.IncidentTicketService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class IncidentTicketController {

    private final IncidentTicketService ticketService;

    public IncidentTicketController(IncidentTicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping
    public ResponseEntity<IncidentTicket> createTicket(
            @Valid @ModelAttribute CreateTicketRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        IncidentTicket ticket = new IncidentTicket();
        ticket.setCategory(request.getCategory());
        ticket.setDescription(request.getDescription());
        ticket.setPriority(request.getPriority());
        if (userDetails != null) {
            ticket.setReporterId(userDetails.getUsername());
        } else {
            ticket.setReporterId(request.getReporterId());
        }
        ticket.setLocation(request.getLocation());

        IncidentTicket createdTicket = ticketService.createTicket(ticket, request.getFiles());

        return ResponseEntity.status(HttpStatus.CREATED).body(createdTicket);
    }

    @GetMapping
    public ResponseEntity<List<IncidentTicket>> getTickets(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        boolean canViewAll = userDetails.getAuthorities().stream()
                .anyMatch(a -> "ADMIN".equals(a.getAuthority()) || "TECHNICIAN".equals(a.getAuthority()));

        List<IncidentTicket> tickets = canViewAll
                ? ticketService.getAllTickets()
                : ticketService.getTicketsByReporterId(userDetails.getUsername());

        return ResponseEntity.ok(tickets);
    }

    @GetMapping("/my")
    public ResponseEntity<List<IncidentTicket>> getMyTickets(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.ok(ticketService.getTicketsByReporterId(userDetails.getUsername()));
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

    @PostMapping("/{id}/comments")
    public ResponseEntity<Comment> addComment(
            @PathVariable Long id,
            @Valid @RequestBody CreateCommentRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        String authorId = (userDetails != null) ? userDetails.getUsername() : "anonymousUser";
        Comment createdComment = ticketService.addComment(id, request.getContent(), authorId);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdComment);
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
