import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, Button, message } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const TicketDashboard = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const endpoint = location.pathname === '/tickets/all' ? '/api/tickets' : '/api/tickets/my';
            const response = await axios.get(endpoint);
            setTickets(response.data);
        } catch (error) {
            message.error("Failed to load tickets: " + (error.response?.data?.message || 'Server Error'));
            setTickets([]);
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
