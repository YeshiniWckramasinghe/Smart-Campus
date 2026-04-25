import React, { useState } from 'react';
import { Card, Form, Input, DatePicker, TimePicker, Select, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;

const ResourceBookingForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem('token');

  const onFinish = async () => {
    if (!token) {
      message.error('Please sign in before creating a booking.');
      navigate('/login');
      return;
    }

    setSubmitting(true);
    try {
      // Backend endpoints for bookings are not wired in this repo yet.
      // For now, we just confirm submission and return to dashboard.
      message.success('Booking request submitted!');
      navigate('/dashboard');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card
        title={<span className="text-xl font-bold">New Resource Booking</span>}
        className="shadow-md rounded-lg"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="resourceType"
              label="Resource Type"
              rules={[{ required: true, message: 'Please select a resource type' }]}
            >
              <Select placeholder="Select type">
                <Select.Option value="LAB">Lab</Select.Option>
                <Select.Option value="LECTURE_HALL">Lecture Hall</Select.Option>
                <Select.Option value="MEETING_ROOM">Meeting Room</Select.Option>
                <Select.Option value="OTHER">Other</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="resourceName"
              label="Resource / Room"
              rules={[{ required: true, message: 'Please enter the resource/room name' }]}
            >
              <Input placeholder="e.g. Lab A-101" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="date"
              label="Date"
              rules={[{ required: true, message: 'Please select a date' }]}
            >
              <DatePicker className="w-full" />
            </Form.Item>

            <Form.Item
              name="timeRange"
              label="Time"
              rules={[{ required: true, message: 'Please select a time range' }]}
            >
              <TimePicker.RangePicker className="w-full" format="HH:mm" />
            </Form.Item>
          </div>

          <Form.Item
            name="purpose"
            label="Purpose"
            rules={[{ required: true, message: 'Please provide the purpose' }]}
          >
            <TextArea rows={4} placeholder="Describe the purpose of this booking..." />
          </Form.Item>

          <div className="flex justify-end gap-2 mt-6">
            <Button onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={submitting} className="bg-blue-600 px-8">
              Submit Booking
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default ResourceBookingForm;
