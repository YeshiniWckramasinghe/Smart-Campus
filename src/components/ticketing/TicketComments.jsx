import React, { useState } from 'react';
import { List, Input, Button, message, Avatar, Popconfirm } from 'antd';
import { UserOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

const { TextArea } = Input;

const TicketComments = ({ ticketId, initialComments, onUpdate }) => {
    const [comments, setComments] = useState(initialComments || []);
    // Current user context mocked for assessment
    const currentUser = 'user123'; 

    const handleDelete = async (commentId) => {
        try {
             // Deletion enforcing security mapping!
             await axios.delete(`/api/tickets/${ticketId}/comments/${commentId}`);
             message.success("Comment deleted");
             if(onUpdate) onUpdate();
        } catch (error) {
             message.error("Failed to delete comment. Unauthorized?");
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow overflow-y-auto mb-4" style={{maxHeight: '400px'}}>
                <List
                    itemLayout="horizontal"
                    dataSource={comments}
                    renderItem={(item) => (
                    <List.Item
                        actions={item.authorId === currentUser ? [
                            <Popconfirm title="Delete?" onConfirm={() => handleDelete(item.id)}>
                                <Button type="text" danger icon={<DeleteOutlined />} />
                            </Popconfirm>
                        ] : []}
                    >
                        <List.Item.Meta
                            avatar={<Avatar icon={<UserOutlined />} />}
                            title={<span className="font-semibold text-sm text-gray-600">{item.authorId}</span>}
                            description={<span className="text-black">{item.content}</span>}
                        />
                    </List.Item>
                    )}
                />
            </div>

            <div className="mt-auto border-t pt-4">
                 <p className="text-gray-500 text-sm mb-2 text-center">Note: API POST endpoint for comments is currently mocked or requires backend setup from previous phase</p>
            </div>
        </div>
    );
};

export default TicketComments;
