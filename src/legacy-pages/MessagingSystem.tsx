/**
 * OUROZ Messaging System
 * Page 8 - Real-time communication between buyers and suppliers
 * 
 * PAGE OBJECTIVE:
 * Enable secure, real-time communication between buyers and suppliers
 * with built-in product sharing, RFQ discussions, order negotiations,
 * and attachment support.
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Search, MoreVertical, Paperclip, Send, Image, FileText,
    Star, Shield, CheckCircle, Clock, ChevronRight, Phone,
    Video, Package, DollarSign, AlertCircle, Smile, X, MapPin
} from 'lucide-react';

interface MessagingSystemProps {
    language: 'en' | 'ar' | 'fr';
    userId: string;
    userType: 'buyer' | 'supplier';
    onNavigate: (path: string) => void;
}

interface Conversation {
    id: string;
    participant: {
        id: string;
        name: string;
        avatar: string;
        type: 'buyer' | 'supplier';
        verificationLevel?: 'BASIC' | 'VERIFIED' | 'GOLD' | 'TRUSTED';
        location: string;
        isOnline: boolean;
    };
    lastMessage: {
        content: string;
        timestamp: string;
        isRead: boolean;
        sender: 'me' | 'them';
    };
    unreadCount: number;
    context?: {
        type: 'product' | 'rfq' | 'order';
        id: string;
        title: string;
        image?: string;
    };
}

interface Message {
    id: string;
    senderId: string;
    content: string;
    timestamp: string;
    type: 'text' | 'image' | 'file' | 'product' | 'rfq' | 'quote' | 'order';
    isRead: boolean;
    attachments?: { name: string; url: string; type: string; size: string }[];
    product?: { id: string; name: string; image: string; price: number };
    quote?: { unitPrice: number; quantity: number; leadTime: number };
}

// Mock Data
const MOCK_CONVERSATIONS: Conversation[] = [
    {
        id: 'conv_001',
        participant: {
            id: 'sup_001',
            name: 'Atlas Argan Trading Co.',
            avatar: 'https://ui-avatars.com/api/?name=Atlas+Argan&background=C4A052&color=fff',
            type: 'supplier',
            verificationLevel: 'GOLD',
            location: 'Agadir, Morocco',
            isOnline: true,
        },
        lastMessage: {
            content: 'Yes, we can offer private labeling for orders above 1000 units. Would you like to discuss the details?',
            timestamp: '10:45 AM',
            isRead: false,
            sender: 'them',
        },
        unreadCount: 2,
        context: {
            type: 'product',
            id: 'prod_001',
            title: 'Premium Argan Oil 100ml',
            image: 'https://picsum.photos/seed/argan/100',
        },
    },
    {
        id: 'conv_002',
        participant: {
            id: 'sup_002',
            name: 'Souss Organic Exports',
            avatar: 'https://ui-avatars.com/api/?name=Souss+Organic&background=2563EB&color=fff',
            type: 'supplier',
            verificationLevel: 'TRUSTED',
            location: 'Essaouira, Morocco',
            isOnline: false,
        },
        lastMessage: {
            content: 'I\'ve sent you a revised quote with the updated pricing.',
            timestamp: 'Yesterday',
            isRead: true,
            sender: 'them',
        },
        unreadCount: 0,
        context: {
            type: 'rfq',
            id: 'rfq_001',
            title: 'RFQ-2024-001542',
        },
    },
    {
        id: 'conv_003',
        participant: {
            id: 'sup_003',
            name: 'Fès Artisan Collective',
            avatar: 'https://ui-avatars.com/api/?name=Fes+Artisan&background=10B981&color=fff',
            type: 'supplier',
            verificationLevel: 'VERIFIED',
            location: 'Fès, Morocco',
            isOnline: true,
        },
        lastMessage: {
            content: 'Thank you for your interest! Here are the samples photos you requested.',
            timestamp: 'Jan 28',
            isRead: true,
            sender: 'them',
        },
        unreadCount: 0,
    },
];

const MOCK_MESSAGES: Message[] = [
    {
        id: 'msg_001',
        senderId: 'user',
        content: 'Hi, I\'m interested in your Argan Oil products. Can you provide bulk pricing for 5000 units?',
        timestamp: '10:30 AM',
        type: 'text',
        isRead: true,
    },
    {
        id: 'msg_002',
        senderId: 'sup_001',
        content: 'Hello! Thank you for your interest in our products. For 5000 units, we can offer:',
        timestamp: '10:35 AM',
        type: 'text',
        isRead: true,
    },
    {
        id: 'msg_003',
        senderId: 'sup_001',
        content: '',
        timestamp: '10:36 AM',
        type: 'quote',
        isRead: true,
        quote: { unitPrice: 7.50, quantity: 5000, leadTime: 14 },
    },
    {
        id: 'msg_004',
        senderId: 'user',
        content: 'That looks good. Is private labeling available?',
        timestamp: '10:40 AM',
        type: 'text',
        isRead: true,
    },
    {
        id: 'msg_005',
        senderId: 'sup_001',
        content: 'Yes, we can offer private labeling for orders above 1000 units. Would you like to discuss the details?',
        timestamp: '10:45 AM',
        type: 'text',
        isRead: false,
    },
];

const MessagingSystem: React.FC<MessagingSystemProps> = ({ language, userId, userType, onNavigate }) => {
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(MOCK_CONVERSATIONS[0]);
    const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
    const [newMessage, setNewMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;

        const message: Message = {
            id: `msg_${Date.now()}`,
            senderId: userId,
            content: newMessage,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'text',
            isRead: false,
        };

        setMessages([...messages, message]);
        setNewMessage('');
    };

    const filteredConversations = MOCK_CONVERSATIONS.filter(c =>
        c.participant.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const isRTL = language === 'ar';

    return (
        <div className={`h-screen bg-gray-50 flex ${isRTL ? 'flex-row-reverse' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Conversations List */}
            <aside className={`w-96 bg-white flex flex-col ${isRTL ? 'border-l' : 'border-r'}`}>
                {/* Header */}
                <div className="p-4 border-b">
                    <h1 className="text-xl font-bold text-gray-900 mb-4">Messages</h1>
                    <div className="relative">
                        <Search className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search conversations..."
                            className={`w-full py-2 bg-gray-100 rounded-lg ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
                        />
                    </div>
                </div>

                {/* Conversations */}
                <div className="flex-1 overflow-y-auto">
                    {filteredConversations.map(conv => (
                        <ConversationItem
                            key={conv.id}
                            conversation={conv}
                            isSelected={selectedConversation?.id === conv.id}
                            onClick={() => setSelectedConversation(conv)}
                            isRTL={isRTL}
                        />
                    ))}
                </div>
            </aside>

            {/* Chat Area */}
            {selectedConversation ? (
                <div className="flex-1 flex flex-col">
                    {/* Chat Header */}
                    <ChatHeader
                        conversation={selectedConversation}
                        onNavigate={onNavigate}
                        isRTL={isRTL}
                    />

                    {/* Context Banner */}
                    {selectedConversation.context && (
                        <ContextBanner
                            context={selectedConversation.context}
                            onNavigate={onNavigate}
                        />
                    )}

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {messages.map(msg => (
                            <MessageBubble
                                key={msg.id}
                                message={msg}
                                isOwn={msg.senderId === userId}
                                isRTL={isRTL}
                            />
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <MessageInput
                        value={newMessage}
                        onChange={setNewMessage}
                        onSend={handleSendMessage}
                        isRTL={isRTL}
                    />
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Send className="w-10 h-10 text-gray-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">Select a conversation</h2>
                        <p className="text-gray-500 mt-2">Choose a conversation to start messaging</p>
                    </div>
                </div>
            )}
        </div>
    );
};

const ConversationItem: React.FC<{
    conversation: Conversation;
    isSelected: boolean;
    onClick: () => void;
    isRTL: boolean;
}> = ({ conversation, isSelected, onClick, isRTL }) => {
    const verifyColors: Record<string, string> = {
        GOLD: 'text-amber-500',
        TRUSTED: 'text-purple-500',
        VERIFIED: 'text-green-500',
    };

    return (
        <div
            onClick={onClick}
            className={`p-4 flex gap-3 cursor-pointer transition ${isSelected ? 'bg-amber-50 border-amber-200' : 'hover:bg-gray-50'
                } ${isRTL ? 'flex-row-reverse' : ''}`}
        >
            <div className="relative">
                <img
                    src={conversation.participant.avatar}
                    alt=""
                    className="w-12 h-12 rounded-full"
                />
                {conversation.participant.isOnline && (
                    <span className={`absolute bottom-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full ${isRTL ? 'left-0' : 'right-0'}`} />
                )}
            </div>

            <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : ''}`}>
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <h3 className="font-semibold text-gray-900 truncate">{conversation.participant.name}</h3>
                    {conversation.participant.verificationLevel && conversation.participant.verificationLevel !== 'BASIC' && (
                        <Shield className={`w-4 h-4 ${verifyColors[conversation.participant.verificationLevel]}`} />
                    )}
                </div>
                <p className={`text-sm text-gray-500 truncate ${!conversation.lastMessage.isRead && conversation.lastMessage.sender === 'them' ? 'font-semibold text-gray-700' : ''}`}>
                    {conversation.lastMessage.content}
                </p>
            </div>

            <div className={`${isRTL ? 'text-left' : 'text-right'} flex-shrink-0`}>
                <p className="text-xs text-gray-400 mb-1">{conversation.lastMessage.timestamp}</p>
                {conversation.unreadCount > 0 && (
                    <span className={`inline-flex items-center justify-center w-5 h-5 bg-amber-500 text-white text-xs rounded-full ${isRTL ? 'ml-auto' : ''}`}>
                        {conversation.unreadCount}
                    </span>
                )}
            </div>
        </div>
    );
};

const ChatHeader: React.FC<{
    conversation: Conversation;
    onNavigate: (path: string) => void;
    isRTL: boolean;
}> = ({ conversation, onNavigate, isRTL }) => (
    <div className={`bg-white border-b p-4 flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <img
            src={conversation.participant.avatar}
            alt=""
            className="w-12 h-12 rounded-full cursor-pointer"
            onClick={() => onNavigate(`/supplier/${conversation.participant.id}`)}
        />
        <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <h2 className="font-semibold text-gray-900">{conversation.participant.name}</h2>
                {conversation.participant.verificationLevel && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${conversation.participant.verificationLevel === 'GOLD' ? 'bg-amber-100 text-amber-700' :
                        conversation.participant.verificationLevel === 'TRUSTED' ? 'bg-purple-100 text-purple-700' :
                            'bg-green-100 text-green-700'
                        }`}>
                        {conversation.participant.verificationLevel}
                    </span>
                )}
            </div>
            <div className={`flex items-center gap-2 text-sm text-gray-500 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <MapPin className="w-4 h-4" />
                <span>{conversation.participant.location}</span>
                <span>•</span>
                <span className={conversation.participant.isOnline ? 'text-green-500' : ''}>
                    {conversation.participant.isOnline ? 'Online' : 'Offline'}
                </span>
            </div>
        </div>
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <button title="Voice call" aria-label="Voice call" className="p-2 hover:bg-gray-100 rounded-lg transition">
                <Phone className="w-5 h-5 text-gray-500" />
            </button>
            <button title="Video call" aria-label="Video call" className="p-2 hover:bg-gray-100 rounded-lg transition">
                <Video className="w-5 h-5 text-gray-500" />
            </button>
            <button title="More options" aria-label="More options" className="p-2 hover:bg-gray-100 rounded-lg transition">
                <MoreVertical className="w-5 h-5 text-gray-500" />
            </button>
        </div>
    </div>
);

const ContextBanner: React.FC<{
    context: NonNullable<Conversation['context']>;
    onNavigate: (path: string) => void;
}> = ({ context, onNavigate }) => (
    <div
        onClick={() => onNavigate(`/${context.type}/${context.id}`)}
        className="bg-amber-50 border-b border-amber-100 px-4 py-3 flex items-center gap-4 cursor-pointer hover:bg-amber-100 transition"
    >
        {context.image && (
            <img src={context.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
        )}
        <div className="flex-1">
            <p className="text-xs text-amber-600 font-medium">
                {context.type === 'product' ? 'Product Discussion' :
                    context.type === 'rfq' ? 'RFQ Discussion' : 'Order Discussion'}
            </p>
            <p className="font-medium text-gray-900">{context.title}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-amber-600" />
    </div>
);

const MessageBubble: React.FC<{
    message: Message;
    isOwn: boolean;
    isRTL: boolean;
}> = ({ message, isOwn, isRTL }) => {
    if (message.type === 'quote') {
        return (
            <div className={`flex ${isOwn ? (isRTL ? 'justify-start' : 'justify-end') : (isRTL ? 'justify-end' : 'justify-start')}`}>
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-2xl p-4 max-w-md">
                    <div className="flex items-center gap-2 mb-3">
                        <DollarSign className="w-5 h-5 text-amber-600" />
                        <span className="font-semibold text-amber-800">Price Quote</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-2xl font-bold text-gray-900">${message.quote?.unitPrice}</p>
                            <p className="text-xs text-gray-500">per unit</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{message.quote?.quantity}</p>
                            <p className="text-xs text-gray-500">units</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{message.quote?.leadTime}</p>
                            <p className="text-xs text-gray-500">days</p>
                        </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-amber-200 flex justify-between items-center">
                        <span className="font-bold text-amber-700">
                            Total: ${((message.quote?.unitPrice || 0) * (message.quote?.quantity || 0)).toLocaleString()}
                        </span>
                        <button className="text-sm text-amber-600 hover:text-amber-700 font-medium">
                            Accept Quote
                        </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">{message.timestamp}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex ${isOwn ? (isRTL ? 'justify-start' : 'justify-end') : (isRTL ? 'justify-end' : 'justify-start')}`}>
            <div className={`max-w-md ${isOwn ? 'order-1' : ''}`}>
                <div className={`px-4 py-3 rounded-2xl ${isOwn
                    ? 'bg-amber-500 text-white rounded-br-sm'
                    : 'bg-white text-gray-900 shadow-sm rounded-bl-sm'
                    }`}>
                    <p className="leading-relaxed">{message.content}</p>
                    {message.attachments?.map((att, i) => (
                        <div key={i} className="mt-2 flex items-center gap-2 text-sm opacity-80">
                            <FileText className="w-4 h-4" />
                            <span>{att.name}</span>
                        </div>
                    ))}
                </div>
                <div className={`flex items-center gap-2 mt-1 text-xs text-gray-400 ${isOwn ? (isRTL ? 'justify-start' : 'justify-end') : ''}`}>
                    <span>{message.timestamp}</span>
                    {isOwn && message.isRead && <CheckCircle className="w-3 h-3 text-blue-500" />}
                </div>
            </div>
        </div>
    );
};

const MessageInput: React.FC<{
    value: string;
    onChange: (value: string) => void;
    onSend: () => void;
    isRTL: boolean;
}> = ({ value, onChange, onSend, isRTL }) => (
    <div className="bg-white border-t p-4">
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <button title="Attach file" aria-label="Attach file" className="p-2 hover:bg-gray-100 rounded-lg transition">
                <Paperclip className="w-5 h-5 text-gray-500" />
            </button>
            <button title="Send image" aria-label="Send image" className="p-2 hover:bg-gray-100 rounded-lg transition">
                <Image className="w-5 h-5 text-gray-500" />
            </button>
            <button title="Share product" aria-label="Share product" className="p-2 hover:bg-gray-100 rounded-lg transition">
                <Package className="w-5 h-5 text-gray-500" />
            </button>

            <div className="flex-1 relative">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && onSend()}
                    placeholder="Type a message..."
                    className={`w-full px-4 py-3 bg-gray-100 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white transition ${isRTL ? 'text-right' : ''}`}
                />
                <button title="Add emoji" aria-label="Add emoji" className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-3' : 'right-3'}`}>
                    <Smile className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                </button>
            </div>

            <button
                onClick={onSend}
                disabled={!value.trim()}
                title="Send message"
                aria-label="Send message"
                className="p-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Send className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
            </button>
        </div>
    </div>
);

export default MessagingSystem;
