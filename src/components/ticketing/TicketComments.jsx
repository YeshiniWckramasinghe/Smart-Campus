import React, { useState } from 'react';
import { List, Button, message, Avatar, Popconfirm, Input } from 'antd';
import { UserOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

const TicketComments = ({ ticketId, initialComments, onUpdate }) => {
    const comments = initialComments || [];
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const currentUserId = currentUser.email || currentUser.name || 'anonymousUser';

    const handleAdd = async () => {
        const content = newComment.trim();
        if (!content) {
            message.warning('Please enter a comment.');
            return;
        }

        setSubmitting(true);
        try {
            await axios.post(`/api/tickets/${ticketId}/comments`, { content });
            message.success('Comment added');
            setNewComment('');
            if (onUpdate) onUpdate();
        } catch (error) {
            message.error('Failed to add comment. Please sign in again.');
        } finally {
            setSubmitting(false);
        }
    };

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
                        actions={item.authorId === currentUserId ? [
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
                <Input.TextArea
                    rows={3}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                />
                <div className="mt-3 flex justify-end">
                    <Button type="primary" onClick={handleAdd} loading={submitting}>
                        Send
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default TicketComments;
