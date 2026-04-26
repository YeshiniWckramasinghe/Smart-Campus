import React, { useState, useEffect, useMemo } from 'react';
import { Table, Button, Modal, Form, Input, Select, InputNumber, message, Tag, Space, Descriptions, Tooltip } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined, AppstoreOutlined, BuildOutlined, CheckCircleOutlined, StopOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

const StatCard = ({ title, value, icon, gradient }) => (
  <div className={`rounded-2xl p-6 text-white shadow-lg ${gradient} transform hover:scale-105 transition duration-300`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-white/80 text-sm font-medium uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-4xl font-extrabold">{value}</h3>
      </div>
      <div className="text-5xl opacity-80">{icon}</div>
    </div>
  </div>
);

const FacilityManager = () => {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const isAdmin = user.role === 'ADMIN';

  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();
  
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [viewingFacility, setViewingFacility] = useState(null);
  const [searchText, setSearchText] = useState('');

  const fetchFacilities = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8082/api/facilities', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
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
    form.setFieldsValue({ status: 'ACTIVE' });
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleView = (record) => {
    setViewingFacility(record);
    setIsViewModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8082/api/admin/facilities/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
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
        await axios.put(`http://localhost:8082/api/admin/facilities/${editingId}`, values, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        message.success('Facility updated successfully');
      } else {
        await axios.post('http://localhost:8082/api/admin/facilities', values, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        message.success('Facility added successfully');
      }
      setIsModalVisible(false);
      fetchFacilities();
    } catch (error) {
      console.error(error);
      message.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const filteredFacilities = useMemo(() => {
    return facilities.filter(f => 
      f.name.toLowerCase().includes(searchText.toLowerCase()) || 
      f.location.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [facilities, searchText]);

  const stats = useMemo(() => {
    return {
      total: facilities.length,
      active: facilities.filter(f => f.status === 'ACTIVE').length,
      outOfService: facilities.filter(f => f.status === 'OUT_OF_SERVICE').length,
      capacity: facilities.reduce((sum, f) => sum + (f.capacity || 0), 0)
    };
  }, [facilities]);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => <span className="font-semibold text-gray-800">{text}</span>,
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
      render: (type) => {
        let color = 'blue';
        if (type === 'LAB') color = 'purple';
        if (type === 'MEETING_ROOM') color = 'cyan';
        if (type === 'EQUIPMENT') color = 'orange';
        return <Tag color={color} className="rounded-full px-3">{type}</Tag>;
      },
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
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text) => (
        <div className="max-w-xs truncate text-gray-500" title={text}>
          {text || '-'}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {status === 'ACTIVE' ? <><CheckCircleOutlined className="mr-1"/> ACTIVE</> : <><StopOutlined className="mr-1"/> OUT OF SERVICE</>}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button type="text" className="text-blue-500 hover:text-blue-700 hover:bg-blue-50" icon={<EyeOutlined />} onClick={() => handleView(record)} />
          </Tooltip>
          {isAdmin && (
            <>
              <Tooltip title="Edit">
                <Button type="text" className="text-orange-500 hover:text-orange-700 hover:bg-orange-50" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
              </Tooltip>
              <Tooltip title="Delete">
                <Button type="text" danger className="hover:bg-red-50" icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
              </Tooltip>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 pt-16 pb-24 px-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500 opacity-10 rounded-full blur-3xl -ml-10 -mb-10"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">Facility Hub</h1>
            <p className="text-blue-200 text-lg max-w-xl">Monitor, manage, and configure all campus facilities and resources from a central command center.</p>
          </div>
          {isAdmin && (
            <Button 
              type="primary" 
              size="large" 
              icon={<PlusOutlined />} 
              onClick={handleAdd}
              className="mt-6 md:mt-0 bg-blue-500 hover:bg-blue-400 border-none shadow-lg shadow-blue-500/50 h-12 px-8 rounded-full text-white font-semibold transition-all duration-300 hover:scale-105"
            >
              New Facility
            </Button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Facilities" value={stats.total} icon={<AppstoreOutlined />} gradient="bg-gradient-to-r from-blue-500 to-blue-600" />
          <StatCard title="Active Status" value={stats.active} icon={<CheckCircleOutlined />} gradient="bg-gradient-to-r from-emerald-400 to-emerald-500" />
          <StatCard title="Out of Service" value={stats.outOfService} icon={<StopOutlined />} gradient="bg-gradient-to-r from-rose-400 to-rose-500" />
          <StatCard title="Total Capacity" value={stats.capacity} icon={<BuildOutlined />} gradient="bg-gradient-to-r from-indigo-500 to-purple-500" />
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white">
            <h2 className="text-xl font-bold text-gray-800 m-0">Directory</h2>
            <Input 
              placeholder="Search by name or location..." 
              prefix={<SearchOutlined className="text-gray-400" />}
              className="max-w-xs rounded-full"
              size="large"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
          </div>
          <div className="p-0">
            <Table 
              dataSource={filteredFacilities} 
              columns={columns} 
              rowKey="id" 
              loading={loading}
              pagination={{ pageSize: 10, className: 'px-6' }}
              className="custom-table"
              rowClassName="hover:bg-blue-50/30 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        title={
          <div className="flex items-center space-x-2 text-xl pb-2">
            <span className="bg-blue-100 text-blue-600 p-2 rounded-lg"><BuildOutlined /></span>
            <span>{editingId ? 'Edit Facility' : 'Add New Facility'}</span>
          </div>
        }
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        destroyOnClose
        width={600}
        okText={editingId ? 'Save Changes' : 'Create Facility'}
        okButtonProps={{ className: 'bg-blue-600 hover:bg-blue-500 rounded-lg' }}
        cancelButtonProps={{ className: 'rounded-lg' }}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="name"
            label={<span className="font-medium text-gray-700">Facility Name</span>}
            rules={[{ required: true, message: 'Please enter facility name' }]}
          >
            <Input size="large" placeholder="e.g. Main Auditorium" className="rounded-lg" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="type"
              label={<span className="font-medium text-gray-700">Type</span>}
              rules={[{ required: true, message: 'Please select type' }]}
            >
              <Select size="large" placeholder="Select type" className="rounded-lg">
                <Option value="LECTURE_HALL">Lecture Hall</Option>
                <Option value="LAB">Lab</Option>
                <Option value="MEETING_ROOM">Meeting Room</Option>
                <Option value="EQUIPMENT">Equipment</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="capacity"
              label={<span className="font-medium text-gray-700">Capacity</span>}
              rules={[{ required: true, message: 'Please enter capacity' }]}
            >
              <InputNumber size="large" min={1} style={{ width: '100%' }} placeholder="e.g. 50" className="rounded-lg" />
            </Form.Item>
          </div>

          <Form.Item
            name="location"
            label={<span className="font-medium text-gray-700">Location</span>}
            rules={[{ required: true, message: 'Please enter location' }]}
          >
            <Input size="large" placeholder="e.g. Building A, 1st Floor" className="rounded-lg" />
          </Form.Item>

          <Form.Item
            name="description"
            label={<span className="font-medium text-gray-700">Description</span>}
            rules={[{ required: true, message: 'Please enter a description' }]}
          >
            <Input.TextArea size="large" rows={4} placeholder="e.g. Spacious lecture hall with 2 projectors" className="rounded-lg" />
          </Form.Item>

          <Form.Item
            name="status"
            label={<span className="font-medium text-gray-700">Status</span>}
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select size="large" className="rounded-lg">
              <Option value="ACTIVE"><div className="flex items-center text-green-600"><CheckCircleOutlined className="mr-2"/> Active</div></Option>
              <Option value="OUT_OF_SERVICE"><div className="flex items-center text-red-600"><StopOutlined className="mr-2"/> Out of Service</div></Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Details Modal */}
      <Modal
        title={
          <div className="flex items-center space-x-2 text-xl pb-2 border-b">
            <span className="bg-indigo-100 text-indigo-600 p-2 rounded-lg"><EyeOutlined /></span>
            <span>Facility Details</span>
          </div>
        }
        open={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setIsViewModalVisible(false)} className="bg-indigo-600 rounded-lg">
            Done
          </Button>
        ]}
        width={700}
      >
        {viewingFacility && (
          <div className="mt-6 mb-2">
            <Descriptions column={2} bordered size="middle" labelStyle={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>
              <Descriptions.Item label="ID" span={2}>#{viewingFacility.id}</Descriptions.Item>
              <Descriptions.Item label="Name" span={2}><span className="text-lg font-semibold">{viewingFacility.name}</span></Descriptions.Item>
              <Descriptions.Item label="Type"><Tag color="blue" className="rounded-full">{viewingFacility.type}</Tag></Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={viewingFacility.status === 'ACTIVE' ? 'success' : 'error'} className="rounded-full">
                  {viewingFacility.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Capacity">{viewingFacility.capacity} people/units</Descriptions.Item>
              <Descriptions.Item label="Location">{viewingFacility.location}</Descriptions.Item>
              <Descriptions.Item label="Description" span={2}>
                <div className="bg-gray-50 p-3 rounded-md border text-gray-700">
                  {viewingFacility.description}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Created At" span={2}>{new Date(viewingFacility.createdAt).toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="Last Updated" span={2}>{new Date(viewingFacility.updatedAt).toLocaleString()}</Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FacilityManager;
