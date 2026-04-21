package com.sliit.paf.smart_campus.ticketing.service;

import com.sliit.paf.smart_campus.ticketing.entity.Comment;
import com.sliit.paf.smart_campus.ticketing.entity.IncidentTicket;
import com.sliit.paf.smart_campus.ticketing.entity.TicketStatus;
import com.sliit.paf.smart_campus.ticketing.repository.CommentRepository;
import com.sliit.paf.smart_campus.ticketing.repository.IncidentTicketRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
public class IncidentTicketService {

    private final IncidentTicketRepository ticketRepository;
    private final CommentRepository commentRepository;
    private final FileStorageService fileStorageService;

    public IncidentTicketService(IncidentTicketRepository ticketRepository,
                                 CommentRepository commentRepository,
                                 FileStorageService fileStorageService) {
        this.ticketRepository = ticketRepository;
        this.commentRepository = commentRepository;
        this.fileStorageService = fileStorageService;
    }

    @Transactional
    public IncidentTicket createTicket(IncidentTicket ticket, List<MultipartFile> files) {
        if (files != null && files.size() > 3) {
            throw new IllegalArgumentException("A maximum of 3 attachments are allowed per ticket.");
        }

        List<String> filePaths = new ArrayList<>();
        if (files != null) {
            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    String contentType = file.getContentType();
                    if (contentType == null || (!contentType.equals("image/jpeg") && !contentType.equals("image/png"))) {
                         throw new IllegalArgumentException("Only JPEG and PNG images are allowed.");
                    }
                    String path = fileStorageService.storeFile(file);
                    filePaths.add(path);
                }
            }
        }
        
        ticket.setAttachmentPaths(filePaths);
        ticket.setStatus(TicketStatus.OPEN);
        return ticketRepository.save(ticket);
    }

    @Transactional
    public IncidentTicket updateTicketStatus(Long ticketId, TicketStatus newStatus) {
        IncidentTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found with id: " + ticketId));

        TicketStatus currentStatus = ticket.getStatus();

        // Enforce transition rules: OPEN -> IN_PROGRESS -> RESOLVED
        if (currentStatus == TicketStatus.OPEN && newStatus != TicketStatus.IN_PROGRESS) {
            throw new IllegalStateException("Ticket must transition to IN_PROGRESS from OPEN.");
        }
        if (currentStatus == TicketStatus.IN_PROGRESS && newStatus != TicketStatus.RESOLVED) {
            throw new IllegalStateException("Ticket must transition to RESOLVED from IN_PROGRESS.");
        }
        if (currentStatus == TicketStatus.RESOLVED) {
            throw new IllegalStateException("Ticket is already RESOLVED and cannot be changed.");
        }

        ticket.setStatus(newStatus);
        return ticketRepository.save(ticket);
    }

    @Transactional
    public Comment addComment(Long ticketId, String content, String authorId) {
        IncidentTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found with id: " + ticketId));

        Comment comment = new Comment();
        comment.setContent(content);
        comment.setAuthorId(authorId);
        comment.setTicket(ticket);
        
        return commentRepository.save(comment);
    }

    public List<IncidentTicket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public List<IncidentTicket> getTicketsByReporterId(String reporterId) {
        return ticketRepository.findByReporterId(reporterId);
    }

    public IncidentTicket getTicketById(Long ticketId) {
        return ticketRepository.findById(ticketId)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found with id: " + ticketId));
    }

    @Transactional
    public void deleteComment(Long ticketId, Long commentId, String requestUserId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found with id: " + commentId));

        if (!comment.getTicket().getId().equals(ticketId)) {
            throw new IllegalArgumentException("Comment does not belong to the specified ticket.");
        }

        if (!comment.getAuthorId().equals(requestUserId)) {
            throw new IllegalStateException("You are not authorized to delete this comment.");
        }

        commentRepository.delete(comment);
    }
}
