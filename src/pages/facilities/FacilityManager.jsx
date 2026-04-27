import React, { useState, useEffect, useMemo } from 'react';
import { Table, Button, Modal, Form, Input, Select, InputNumber, message, Tag, Space, Descriptions, Tooltip } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined, AppstoreOutlined, BuildOutlined, CheckCircleOutlined, StopOutlined, CalendarOutlined, FilePdfOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  const navigate = useNavigate();
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

  const generateReport = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(31, 41, 55);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Smart Campus', 14, 20);
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('Facility Management Report', 14, 30);
    
    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
    doc.setFontSize(10);
    doc.setTextColor(200, 200, 200);
    doc.text(`Generated: ${date}`, 120, 30);

    // Summary Statistics
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Facility Summary Overview', 14, 50);

    const drawStatBox = (x, y, title, value, color) => {
      doc.setDrawColor(color[0], color[1], color[2]);
      doc.setFillColor(color[0], color[1], color[2]);
      doc.rect(x, y, 42, 20, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.text(title, x + 21, y + 8, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(value?.toString() || '0', x + 21, y + 16, { align: 'center' });
    };

    drawStatBox(14, 55, 'Total Facilities', stats.total, [59, 130, 246]);
    drawStatBox(60, 55, 'Active', stats.active, [16, 185, 129]);
    drawStatBox(106, 55, 'Out of Service', stats.outOfService, [239, 68, 68]);
    drawStatBox(152, 55, 'Total Capacity', stats.capacity, [139, 92, 246]);

    // Table
    const tableColumn = ["ID", "Name", "Type", "Capacity", "Location", "Status"];
    const tableRows = [];

    facilities.forEach(facility => {
      const facilityData = [
        facility.id,
        facility.name,
        facility.type?.replace('_', ' ') || '-',
        facility.capacity,
        facility.location,
        facility.status?.replace('_', ' ') || '-'
      ];
      tableRows.push(facilityData);
    });

    autoTable(doc, {
      startY: 85,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [240, 248, 255] },
      styles: { fontSize: 9, cellPadding: 4 },
      columnStyles: {
        0: { cellWidth: 15 },
        1: { fontStyle: 'bold' },
        3: { halign: 'center' },
        5: { fontStyle: 'bold' }
      },
      didParseCell: function(data) {
        if (data.section === 'body' && data.column.index === 5) {
          if (data.cell.raw === 'ACTIVE') {
            data.cell.styles.textColor = [22, 163, 74];
          } else {
            data.cell.styles.textColor = [220, 38, 38];
          }
        }
      }
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
      doc.text('Smart Campus Management System', 14, doc.internal.pageSize.height - 10);
    }

    doc.save(`Facility_Report_${new Date().getTime()}.pdf`);
    message.success('Report generated successfully!');
  };

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
      ],
      onFilter: (value, record) => record.type === value,
      render: (type) => {
        let color = 'blue';
        if (type === 'LAB') color = 'purple';
        if (type === 'MEETING_ROOM') color = 'cyan';
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
          {!isAdmin && (
            <Tooltip title="Book Now">
              <Button type="text" className="text-green-500 hover:text-green-700 hover:bg-green-50" icon={<CalendarOutlined />} onClick={() => navigate('/bookings/new', { state: { facilityId: record.id } })} />
            </Tooltip>
          )}
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
            <div className="flex flex-col sm:flex-row mt-6 md:mt-0 gap-4">
              <Button 
                type="default" 
                size="large" 
                icon={<FilePdfOutlined />} 
                onClick={generateReport}
                className="bg-white/10 hover:bg-white/20 border-white/20 text-white shadow-lg h-12 px-6 rounded-full font-semibold transition-all duration-300 hover:scale-105 backdrop-blur-sm"
              >
                Generate Report
              </Button>
              <Button 
                type="primary" 
                size="large" 
                icon={<PlusOutlined />} 
                onClick={handleAdd}
                className="bg-blue-500 hover:bg-blue-400 border-none shadow-lg shadow-blue-500/50 h-12 px-8 rounded-full text-white font-semibold transition-all duration-300 hover:scale-105"
              >
                New Facility
              </Button>
            </div>
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
              </Select>
            </Form.Item>

            <Form.Item
              name="capacity"
              label={<span className="font-medium text-gray-700">Capacity</span>}
              rules={[
                { required: true, message: 'Please enter capacity' },
                { type: 'integer', min: 1, message: 'Only valid numbers are allowed' }
              ]}
            >
              <InputNumber 
                size="large" 
                min={1} 
                style={{ width: '100%' }} 
                placeholder="e.g. 50" 
                className="rounded-lg" 
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
              />
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
          !isAdmin ? (
            <Button key="book" type="primary" onClick={() => navigate('/bookings/new', { state: { facilityId: viewingFacility?.id } })} className="bg-green-600 hover:bg-green-500 rounded-lg">
              Book Now
            </Button>
          ) : null,
          <Button key="close" type="default" onClick={() => setIsViewModalVisible(false)} className="rounded-lg">
            Close
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
