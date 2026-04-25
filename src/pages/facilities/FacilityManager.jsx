import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, InputNumber, message, Tag, Space, Card } from 'antd';
import axios from 'axios';

const { Option } = Select;

const FacilityManager = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();

  const fetchFacilities = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8082/api/admin/facilities');
      setFacilities(response.data);
    } catch (error) {
      message.error('Failed to fetch facilities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    form.setFieldsValue({ status: 'ACTIVE' }); // Default value
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8082/api/admin/facilities/${id}`);
      message.success('Facility deleted successfully');
      fetchFacilities();
    } catch (error) {
      message.error('Failed to delete facility');
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingId) {
        await axios.put(`http://localhost:8082/api/admin/facilities/${editingId}`, values);
        message.success('Facility updated successfully');
      } else {
        await axios.post('http://localhost:8082/api/admin/facilities', values);
        message.success('Facility added successfully');
      }
      setIsModalVisible(false);
      fetchFacilities();
    } catch (error) {
      console.error(error);
      message.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      filters: [
        { text: 'Lecture Hall', value: 'LECTURE_HALL' },
        { text: 'Lab', value: 'LAB' },
        { text: 'Meeting Room', value: 'MEETING_ROOM' },
        { text: 'Equipment', value: 'EQUIPMENT' },
      ],
      onFilter: (value, record) => record.type === value,
      render: (type) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: 'Capacity',
      dataIndex: 'capacity',
      key: 'capacity',
      sorter: (a, b) => a.capacity - b.capacity,
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'ACTIVE' ? 'success' : 'error'}>{status}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <Card
        title={<h2 className="text-2xl font-bold">Manage Facilities</h2>}
        extra={
          <Button type="primary" onClick={handleAdd}>
            + Add Facility
          </Button>
        }
      >
        <Table 
          dataSource={facilities} 
          columns={columns} 
          rowKey="id" 
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingId ? 'Edit Facility' : 'Add New Facility'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Facility Name"
            rules={[{ required: true, message: 'Please enter facility name' }]}
          >
            <Input placeholder="e.g. Main Auditorium" />
          </Form.Item>

          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: 'Please select type' }]}
          >
            <Select placeholder="Select facility type">
              <Option value="LECTURE_HALL">Lecture Hall</Option>
              <Option value="LAB">Lab</Option>
              <Option value="MEETING_ROOM">Meeting Room</Option>
              <Option value="EQUIPMENT">Equipment</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="capacity"
            label="Capacity"
            rules={[{ required: true, message: 'Please enter capacity' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} placeholder="e.g. 50" />
          </Form.Item>

          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true, message: 'Please enter location' }]}
          >
            <Input placeholder="e.g. Building A, 1st Floor" />
          </Form.Item>

          <Form.Item
            name="availabilityWindows"
            label="Availability Windows"
            rules={[{ required: true, message: 'Please enter availability window' }]}
          >
            <Input placeholder="e.g. 08:00-18:00" />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select>
              <Option value="ACTIVE">Active</Option>
              <Option value="OUT_OF_SERVICE">Out of Service</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FacilityManager;
