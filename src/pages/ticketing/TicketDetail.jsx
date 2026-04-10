import React, { useState, useEffect } from 'react';
import { Steps, Card, Spin, message, Button, Tag } from 'antd';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import TicketComments from '../../components/ticketing/TicketComments';

const TicketDetail = () => {
    const { id } = useParams();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);

    // Read user role from localStorage (set during JWT login)
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isStaff = user.role === 'ADMIN' || user.role === 'TECHNICIAN';

    useEffect(() => {
        fetchTicketDetails();
    }, [id]);

    const fetchTicketDetails = async () => {
        try {
            const res = await axios.get(`/api/tickets/${id}`);
            setTicket(res.data);
        } catch (error) {
            message.error("Error fetching ticket details");
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (newStatus) => {
        try {
            const res = await axios.patch(`/api/tickets/${id}/status`, { status: newStatus });
            setTicket(res.data);
            message.success(`Status updated to ${newStatus}`);
        } catch (error) {
            message.error("Failed to update status. Remember state must jump correctly!");
        }
    };

    if (loading) return <div className="flex justify-center p-20"><Spin size="large" /></div>;
    if (!ticket) return <div className="p-10 text-center text-red-500">Ticket not found</div>;

    const getStepCurrent = (status) => {
        switch (status) {
            case 'OPEN': return 0;
            case 'IN_PROGRESS': return 1;
            case 'RESOLVED': return 2;
            default: return 0;
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold">Ticket Workflow: #{ticket.id}</h2>

            <Card className="shadow-sm">
                <Steps
                    current={getStepCurrent(ticket.status)}
                    items={[
                        { title: 'Open', description: 'Ticket created and waiting for review.' },
                        { title: 'In Progress', description: 'Assigned and being worked on.' },
                        { title: 'Resolved', description: 'Issue has been addressed.' },
                    ]}
                />
                
                <div className="mt-8 flex flex-col items-center space-y-3">
                    {/* RBAC: Only ADMIN or TECHNICIAN can transition ticket state */}
                    {isStaff ? (
                        <div className="flex space-x-4">
                            {ticket.status === 'OPEN' && (
                                <Button type="primary" onClick={() => updateStatus('IN_PROGRESS')}>
                                    Assign & Mark IN PROGRESS
                                </Button>
                            )}
                            {ticket.status === 'IN_PROGRESS' && (
                                <Button type="primary" style={{backgroundColor:'#16a34a'}} onClick={() => updateStatus('RESOLVED')}>
                                    Mark as RESOLVED
                                </Button>
                            )}
                            {ticket.status === 'RESOLVED' && (
                                <span className="text-green-600 font-semibold">✅ This ticket is resolved.</span>
                            )}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-sm italic">
                            🔒 Only Admins and Technicians can update the ticket status.
                        </p>
                    )}
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card title="Incident Details" className="md:col-span-2 shadow-sm h-full">
                    <p><strong>Category:</strong> {ticket.category}</p>
                    <p><strong>Location:</strong> {ticket.location}</p>
                    <p><strong>Priority:</strong> <Tag color="red">{ticket.priority}</Tag></p>
                    <div className="mt-4 p-4 bg-gray-50 rounded border">
                        <p className="whitespace-pre-wrap">{ticket.description}</p>
                    </div>

                    {ticket.attachmentPaths && ticket.attachmentPaths.length > 0 && (
                        <div className="mt-6">
                            <h4 className="font-semibold mb-2">Attachments ({ticket.attachmentPaths.length}/3)</h4>
                            <div className="flex gap-4">
                                {ticket.attachmentPaths.map((path, idx) => (
                                    <div key={idx} className="w-24 h-24 bg-gray-200 flex items-center justify-center rounded overflow-hidden">
                                         {/* In real app, serve static files or secure S3 objects */}
                                         <span className="text-xs text-gray-500">Image {idx+1}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </Card>

                <Card title="Communication" className="md:col-span-1 shadow-sm h-full">
                    <TicketComments ticketId={ticket.id} initialComments={ticket.comments} onUpdate={fetchTicketDetails} />
                </Card>
            </div>
        </div>
    );
};

export default TicketDetail;
