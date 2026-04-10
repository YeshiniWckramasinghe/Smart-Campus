import React, { useState } from 'react';
import { Form, Input, Select, Upload, Button, message, Card } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Option } = Select;
const { TextArea } = Input;
const { Dragger } = Upload;

const TicketReportForm = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState([]);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('category', values.category);
            formData.append('description', values.description);
            formData.append('priority', values.priority);
            formData.append('location', values.location);
            // Replace with actual user ID mechanism
            formData.append('reporterId', 'user123'); 
            
            fileList.forEach(file => {
                formData.append('files', file.originFileObj);
            });

            const res = await axios.post('/api/tickets', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            message.success('Incident Ticket created successfully!');
            navigate(`/tickets/${res.data.id}`);
        } catch (error) {
            message.error('Failed to create ticket. ' + (error.response?.data?.message || 'Server Error'));
        } finally {
            setLoading(false);
        }
    };

    const uploadProps = {
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: (file) => {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                message.error('You can only upload JPG/PNG file!');
                return Upload.LIST_IGNORE;
            }
            if (fileList.length >= 3) {
                message.error('A maximum of 3 attachments are allowed.');
                return Upload.LIST_IGNORE;
            }
            setFileList([...fileList, file]);
            return false;
        },
        fileList,
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <Card title={<span className="text-xl font-bold">Report an Incident</span>} className="shadow-md rounded-lg">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    requiredMark={true}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item
                            name="category"
                            label="Incident Category"
                            rules={[{ required: true, message: 'Please select a category' }]}
                        >
                            <Select placeholder="Select Category">
                                <Option value="IT">IT</Option>
                                <Option value="MAINTENANCE">Maintenance</Option>
                                <Option value="SECURITY">Security</Option>
                                <Option value="ADMINISTRATIVE">Administrative</Option>
                                <Option value="OTHER">Other</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="priority"
                            label="Priority Level"
                            rules={[{ required: true, message: 'Please select priority' }]}
                        >
                            <Select placeholder="Select Priority">
                                <Option value="LOW">Low</Option>
                                <Option value="MEDIUM">Medium</Option>
                                <Option value="HIGH">High</Option>
                                <Option value="URGENT">Urgent</Option>
                            </Select>
                        </Form.Item>
                    </div>

                    <Form.Item
                        name="location"
                        label="Location"
                        rules={[{ required: true, message: 'Minimum description of location is required' }]}
                    >
                        <Input placeholder="e.g. Building A, Room 301" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Detailed Description"
                        rules={[{ required: true, message: 'Please provide incident details' }]}
                    >
                        <TextArea rows={4} placeholder="Describe the issue in detail..." />
                    </Form.Item>

                    <Form.Item label="Evidence Attachments (Max 3 Images)">
                        <Dragger {...uploadProps} maxCount={3} multiple>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">Click or drag images to this area to upload</p>
                            <p className="ant-upload-hint">
                                Support for a single or bulk upload. Strict limit of 3 attachments (JPEG or PNG only).
                            </p>
                        </Dragger>
                    </Form.Item>

                    <Form.Item className="mt-6 flex justify-end">
                        <Button type="primary" htmlType="submit" loading={loading} className="bg-blue-600 px-8">
                            Submit Ticket
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default TicketReportForm;
