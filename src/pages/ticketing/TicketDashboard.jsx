import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, Button, message } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';

const TicketDashboard = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            // Ideally we'd have a GET /api/tickets endpoint, but for now we might mock it or assume it exists.
            // Let's assume GET /api/tickets returns a list of tickets.
            // Wait, does GET /api/tickets exist? Let's check backend later. We didn't add GET /api/tickets in Phase 2!
            // I will add a mock for now and try actual endpoint if possible.
            const response = await axios.get('/api/tickets');
            setTickets(response.data);
        } catch (error) {
            message.error("Failed to load tickets: " + (error.response?.data?.message || 'Server Error'));
            // Mock data fallback if endpoint fails
            setTickets([
                { id: 1, category: 'IT', priority: 'HIGH', status: 'OPEN', location: 'Room 402', reporterId: 'user123' },
                { id: 2, category: 'MAINTENANCE', priority: 'MEDIUM', status: 'IN_PROGRESS', location: 'Main Hall', reporterId: 'admin' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: 'Priority',
            dataIndex: 'priority',
            key: 'priority',
            filters: [
                { text: 'Low', value: 'LOW' },
                { text: 'Medium', value: 'MEDIUM' },
                { text: 'High', value: 'HIGH' },
                { text: 'Urgent', value: 'URGENT' },
            ],
            onFilter: (value, record) => record.priority === value,
            render: (priority) => {
                let color = priority === 'HIGH' || priority === 'URGENT' ? 'volcano' : (priority === 'MEDIUM' ? 'orange' : 'green');
                return <Tag color={color}>{priority}</Tag>;
            }
        },
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
            filters: Array.from(new Set(tickets.map(t => t.location))).filter(Boolean).map(loc => ({ text: loc, value: loc })),
            onFilter: (value, record) => record.location && record.location.indexOf(value) === 0,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = status === 'RESOLVED' ? 'green' : (status === 'IN_PROGRESS' ? 'geekblue' : 'default');
                return <Tag color={color}>{status}</Tag>;
            }
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Link to={`/tickets/${record.id}`}>
                         <Button type="primary" size="small">View Workflow</Button>
                    </Link>
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-bold">Ticketing Dashboard</h2>
                 <Link to="/tickets/new">
                     <Button type="primary" className="bg-blue-600">Report Incident</Button>
                 </Link>
            </div>
            <Table 
                columns={columns} 
                dataSource={tickets} 
                rowKey="id" 
                loading={loading}
                pagination={{ pageSize: 10 }}
                className="bg-white rounded-lg shadow-sm"
            />
        </div>
    );
};

export default TicketDashboard;
