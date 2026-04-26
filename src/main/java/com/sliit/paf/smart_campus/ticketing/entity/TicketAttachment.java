package com.sliit.paf.smart_campus.ticketing.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "ticket_attachments")
public class TicketAttachment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "file_path", nullable = false)
    private String filePath;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id", nullable = false)
    private IncidentTicket ticket;

    public TicketAttachment() {}

    public TicketAttachment(String filePath, IncidentTicket ticket) {
        this.filePath = filePath;
        this.ticket = ticket;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }
    public IncidentTicket getTicket() { return ticket; }
    public void setTicket(IncidentTicket ticket) { this.ticket = ticket; }
}
