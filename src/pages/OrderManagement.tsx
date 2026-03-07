/**
 * OUROZ Order Management System
 * Page 9 - Complete order lifecycle management
 * 
 * PAGE OBJECTIVE:
 * Manage the complete order lifecycle from creation to delivery,
 * including payment tracking, shipment updates, and dispute handling.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Package, Truck, CreditCard, CheckCircle, Clock, AlertCircle,
    ChevronRight, ChevronDown, MapPin, Calendar, FileText, Download,
    MessageCircle, Phone, Eye, Filter, Search, MoreVertical,
    Shield, Star, Box, Globe
} from 'lucide-react';

interface OrderManagementProps {
    language: 'en' | 'ar' | 'fr';
    userId: string;
    userType: 'buyer' | 'supplier';
    onNavigate: (path: string) => void;
}

interface Order {
    id: string;
    orderNumber: string;
    status: 'PENDING_PAYMENT' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'IN_TRANSIT' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED';

    // Parties
    buyer: { id: string; name: string; country: string };
    supplier: {
        id: string;
        name: string;
        logo: string;
        verificationLevel: 'BASIC' | 'VERIFIED' | 'GOLD' | 'TRUSTED';
        location: string;
    };

    // Items
    items: {
        id: string;
        name: string;
        image: string;
        quantity: number;
        unitPrice: number;
        total: number;
    }[];

    // Pricing
    subtotal: number;
    shippingCost: number;
    total: number;
    currency: string;

    // Payment
    paymentStatus: 'PENDING' | 'PARTIAL' | 'PAID' | 'REFUNDED';
    paymentMethod: string;
    tradeAssuranceProtected: boolean;

    // Shipping
    incoterm: string;
    shippingMethod: string;
    trackingNumber?: string;
    estimatedDelivery?: string;

    // Dates
    createdAt: string;
    paidAt?: string;
    shippedAt?: string;
    deliveredAt?: string;

    // Timeline
    timeline: {
        status: string;
        description: string;
        timestamp: string;
        completed: boolean;
    }[];
}

// Mock Data
const MOCK_ORDERS: Order[] = [
    {
        id: 'ord_001',
        orderNumber: 'ORD-2024-001542',
        status: 'IN_TRANSIT',
        buyer: { id: 'buy_001', name: 'Global Beauty Inc.', country: 'United States' },
        supplier: {
            id: 'sup_001',
            name: 'Atlas Argan Trading Co.',
            logo: 'https://ui-avatars.com/api/?name=Atlas+Argan&background=C4A052&color=fff',
            verificationLevel: 'GOLD',
            location: 'Agadir, Morocco',
        },
        items: [
            { id: 'item_001', name: 'Premium Argan Oil 100ml', image: 'https://picsum.photos/seed/argan1/100', quantity: 5000, unitPrice: 7.50, total: 37500 },
            { id: 'item_002', name: 'Rose Water Toner 200ml', image: 'https://picsum.photos/seed/rose/100', quantity: 2000, unitPrice: 4.50, total: 9000 },
        ],
        subtotal: 46500,
        shippingCost: 2850,
        total: 49350,
        currency: 'USD',
        paymentStatus: 'PAID',
        paymentMethod: 'Bank Transfer',
        tradeAssuranceProtected: true,
        incoterm: 'CIF',
        shippingMethod: 'Sea Freight',
        trackingNumber: 'MLAT1234567890',
        estimatedDelivery: '2024-02-15',
        createdAt: '2024-01-20',
        paidAt: '2024-01-22',
        shippedAt: '2024-01-28',
        timeline: [
            { status: 'Order Placed', description: 'Order confirmed and sent to supplier', timestamp: '2024-01-20 10:30 AM', completed: true },
            { status: 'Payment Received', description: 'Full payment received via bank transfer', timestamp: '2024-01-22 02:15 PM', completed: true },
            { status: 'In Production', description: 'Order is being processed by supplier', timestamp: '2024-01-24 09:00 AM', completed: true },
            { status: 'Shipped', description: 'Order shipped from Agadir port', timestamp: '2024-01-28 11:45 AM', completed: true },
            { status: 'In Transit', description: 'Currently at sea, ETA Feb 15', timestamp: '2024-01-30 08:00 AM', completed: true },
            { status: 'Delivered', description: 'Awaiting delivery confirmation', timestamp: '', completed: false },
            { status: 'Completed', description: 'Order completed and rated', timestamp: '', completed: false },
        ],
    },
    {
        id: 'ord_002',
        orderNumber: 'ORD-2024-001543',
        status: 'PENDING_PAYMENT',
        buyer: { id: 'buy_001', name: 'Global Beauty Inc.', country: 'United States' },
        supplier: {
            id: 'sup_002',
            name: 'Souss Organic Exports',
            logo: 'https://ui-avatars.com/api/?name=Souss+Organic&background=2563EB&color=fff',
            verificationLevel: 'TRUSTED',
            location: 'Essaouira, Morocco',
        },
        items: [
            { id: 'item_003', name: 'Organic Prickly Pear Oil 30ml', image: 'https://picsum.photos/seed/prickly/100', quantity: 1000, unitPrice: 28.00, total: 28000 },
        ],
        subtotal: 28000,
        shippingCost: 1200,
        total: 29200,
        currency: 'USD',
        paymentStatus: 'PENDING',
        paymentMethod: 'Trade Assurance',
        tradeAssuranceProtected: true,
        incoterm: 'FOB',
        shippingMethod: 'Air Freight',
        createdAt: '2024-01-29',
        timeline: [
            { status: 'Order Placed', description: 'Order confirmed, awaiting payment', timestamp: '2024-01-29 03:20 PM', completed: true },
            { status: 'Payment Pending', description: 'Awaiting payment from buyer', timestamp: '', completed: false },
        ],
    },
];

const STATUS_CONFIG = {
    PENDING_PAYMENT: { label: 'Pending Payment', bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock },
    PAID: { label: 'Paid', bg: 'bg-blue-100', text: 'text-blue-700', icon: CreditCard },
    PROCESSING: { label: 'Processing', bg: 'bg-blue-100', text: 'text-blue-700', icon: Package },
    SHIPPED: { label: 'Shipped', bg: 'bg-purple-100', text: 'text-purple-700', icon: Truck },
    IN_TRANSIT: { label: 'In Transit', bg: 'bg-purple-100', text: 'text-purple-700', icon: Globe },
    DELIVERED: { label: 'Delivered', bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
    COMPLETED: { label: 'Completed', bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
    CANCELLED: { label: 'Cancelled', bg: 'bg-red-100', text: 'text-red-600', icon: AlertCircle },
    DISPUTED: { label: 'Disputed', bg: 'bg-red-100', text: 'text-red-600', icon: AlertCircle },
};

const OrderManagement: React.FC<OrderManagementProps> = ({ language, userId, userType, onNavigate }) => {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredOrders = MOCK_ORDERS.filter(order => {
        if (filterStatus !== 'all' && order.status !== filterStatus) return false;
        if (searchQuery && !order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    if (selectedOrder) {
        return (
            <OrderDetail
                order={selectedOrder}
                onBack={() => setSelectedOrder(null)}
                onNavigate={onNavigate}
                userType={userType}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4">
                    <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
                    <p className="text-gray-500">Track and manage your orders</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                    {[
                        { label: 'Pending Payment', count: 2, color: 'amber' },
                        { label: 'Processing', count: 3, color: 'blue' },
                        { label: 'In Transit', count: 5, color: 'purple' },
                        { label: 'Delivered', count: 12, color: 'green' },
                        { label: 'Disputed', count: 0, color: 'red' },
                    ].map(stat => (
                        <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm">
                            <p className={`text-2xl font-bold text-${stat.color}-600`}>{stat.count}</p>
                            <p className="text-sm text-gray-500">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by order number..."
                            className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500"
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        title="Filter orders by status"
                        aria-label="Filter orders by status"
                        className="px-4 py-3 border rounded-xl bg-white focus:ring-2 focus:ring-amber-500"
                    >
                        <option value="all">All Orders</option>
                        <option value="PENDING_PAYMENT">Pending Payment</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="IN_TRANSIT">In Transit</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="COMPLETED">Completed</option>
                    </select>
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                    {filteredOrders.map(order => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            onClick={() => setSelectedOrder(order)}
                            onNavigate={onNavigate}
                        />
                    ))}
                </div>

                {filteredOrders.length === 0 && (
                    <div className="text-center py-16">
                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
                        <p className="text-gray-500">Try adjusting your filters or search query</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const OrderCard: React.FC<{
    order: Order;
    onClick: () => void;
    onNavigate: (path: string) => void;
}> = ({ order, onClick, onNavigate }) => {
    const config = STATUS_CONFIG[order.status];
    const StatusIcon = config.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onClick}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden"
        >
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <span className="font-mono text-gray-500">{order.orderNumber}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${config.bg} ${config.text}`}>
                        <StatusIcon className="w-4 h-4" />
                        {config.label}
                    </span>
                    {order.tradeAssuranceProtected && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            Protected
                        </span>
                    )}
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">${order.total.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Total Amount</p>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="flex gap-6">
                    {/* Items Preview */}
                    <div className="flex -space-x-3">
                        {order.items.slice(0, 3).map((item, i) => (
                            <img
                                key={item.id}
                                src={item.image}
                                alt=""
                                className={`w-14 h-14 rounded-lg border-2 border-white object-cover ${i === 0 ? 'z-30' : i === 1 ? 'z-20' : 'z-10'}`}
                            />
                        ))}
                        {order.items.length > 3 && (
                            <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600 border-2 border-white">
                                +{order.items.length - 3}
                            </div>
                        )}
                    </div>

                    {/* Order Info */}
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Supplier</p>
                            <div className="flex items-center gap-2">
                                <img src={order.supplier.logo} alt="" className="w-6 h-6 rounded-full" />
                                <span className="font-medium text-gray-900 truncate">{order.supplier.name}</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Items</p>
                            <p className="font-medium text-gray-900">
                                {order.items.reduce((sum, item) => sum + item.quantity, 0).toLocaleString()} units
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Order Date</p>
                            <p className="font-medium text-gray-900">{order.createdAt}</p>
                        </div>
                        {order.estimatedDelivery && (
                            <div>
                                <p className="text-sm text-gray-500">Est. Delivery</p>
                                <p className="font-medium text-gray-900">{order.estimatedDelivery}</p>
                            </div>
                        )}
                    </div>

                    {/* Action */}
                    <div className="flex items-center">
                        <ChevronRight className="w-6 h-6 text-gray-400" />
                    </div>
                </div>
            </div>

            {/* Progress */}
            {order.status !== 'PENDING_PAYMENT' && order.status !== 'CANCELLED' && (
                <div className="px-4 pb-4">
                    <div className="flex items-center gap-2">
                        {['Order Placed', 'Payment', 'Processing', 'Shipped', 'Delivered'].map((step, i) => (
                            <React.Fragment key={step}>
                                <div className={`flex-1 h-1 rounded-full ${i < order.timeline.filter(t => t.completed).length
                                    ? 'bg-amber-500'
                                    : 'bg-gray-200'
                                    }`} />
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            )}
        </motion.div>
    );
};

const OrderDetail: React.FC<{
    order: Order;
    onBack: () => void;
    onNavigate: (path: string) => void;
    userType: 'buyer' | 'supplier';
}> = ({ order, onBack, onNavigate, userType }) => {
    const config = STATUS_CONFIG[order.status];
    const StatusIcon = config.icon;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-2"
                    >
                        <ChevronRight className="w-5 h-5 rotate-180" />
                        Back to Orders
                    </button>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold text-gray-900">{order.orderNumber}</h1>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${config.bg} ${config.text}`}>
                                    <StatusIcon className="w-4 h-4" />
                                    {config.label}
                                </span>
                            </div>
                            <p className="text-gray-500">Placed on {order.createdAt}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => onNavigate(`/messages?order=${order.id}`)}
                                className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
                            >
                                <MessageCircle className="w-5 h-5" />
                                Contact
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition">
                                <Download className="w-5 h-5" />
                                Invoice
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Timeline */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Timeline</h2>
                            <div className="space-y-4">
                                {order.timeline.map((event, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${event.completed ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-400'
                                                }`}>
                                                {event.completed ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                            </div>
                                            {i < order.timeline.length - 1 && (
                                                <div className={`w-0.5 h-full mt-2 ${event.completed ? 'bg-amber-500' : 'bg-gray-200'}`} />
                                            )}
                                        </div>
                                        <div className="flex-1 pb-6">
                                            <p className={`font-semibold ${event.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                                                {event.status}
                                            </p>
                                            <p className="text-sm text-gray-500">{event.description}</p>
                                            {event.timestamp && (
                                                <p className="text-xs text-gray-400 mt-1">{event.timestamp}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Items */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
                            <div className="divide-y">
                                {order.items.map(item => (
                                    <div key={item.id} className="py-4 flex items-center gap-4">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-16 h-16 rounded-lg object-cover"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900">{item.name}</h3>
                                            <p className="text-sm text-gray-500">
                                                ${item.unitPrice.toFixed(2)} × {item.quantity.toLocaleString()}
                                            </p>
                                        </div>
                                        <p className="font-semibold text-gray-900">${item.total.toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t pt-4 space-y-2">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>${order.subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping ({order.incoterm})</span>
                                    <span>${order.shippingCost.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
                                    <span>Total</span>
                                    <span>${order.total.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Supplier Card */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Supplier</h3>
                            <div className="flex items-center gap-4">
                                <img
                                    src={order.supplier.logo}
                                    alt=""
                                    className="w-14 h-14 rounded-xl"
                                />
                                <div>
                                    <p className="font-semibold text-gray-900">{order.supplier.name}</p>
                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                        <MapPin className="w-4 h-4" />
                                        {order.supplier.location}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => onNavigate(`/supplier/${order.supplier.id}`)}
                                className="w-full mt-4 py-2 border rounded-lg text-amber-600 font-medium hover:bg-amber-50 transition"
                            >
                                View Supplier
                            </button>
                        </div>

                        {/* Payment Info */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Payment</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Status</span>
                                    <span className={`font-medium ${order.paymentStatus === 'PAID' ? 'text-green-600' :
                                        order.paymentStatus === 'PENDING' ? 'text-yellow-600' : 'text-gray-600'
                                        }`}>
                                        {order.paymentStatus}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Method</span>
                                    <span className="font-medium text-gray-900">{order.paymentMethod}</span>
                                </div>
                                {order.paidAt && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Paid On</span>
                                        <span className="font-medium text-gray-900">{order.paidAt}</span>
                                    </div>
                                )}
                            </div>
                            {order.tradeAssuranceProtected && (
                                <div className="mt-4 p-3 bg-green-50 rounded-lg flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-green-600" />
                                    <div>
                                        <p className="font-medium text-green-800 text-sm">Trade Assurance</p>
                                        <p className="text-xs text-green-600">Your payment is protected</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Shipping Info */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Shipping</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Method</span>
                                    <span className="font-medium text-gray-900">{order.shippingMethod}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Incoterm</span>
                                    <span className="font-medium text-gray-900">{order.incoterm}</span>
                                </div>
                                {order.trackingNumber && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Tracking</span>
                                        <span className="font-medium text-amber-600">{order.trackingNumber}</span>
                                    </div>
                                )}
                                {order.estimatedDelivery && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Est. Delivery</span>
                                        <span className="font-medium text-gray-900">{order.estimatedDelivery}</span>
                                    </div>
                                )}
                            </div>
                            {order.trackingNumber && (
                                <button className="w-full mt-4 py-2 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition">
                                    Track Shipment
                                </button>
                            )}
                        </div>

                        {/* Actions */}
                        {order.status === 'DELIVERED' && (
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h3 className="font-semibold text-gray-900 mb-4">Actions</h3>
                                <div className="space-y-3">
                                    <button className="w-full py-2 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition">
                                        Confirm Receipt
                                    </button>
                                    <button className="w-full py-2 border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition">
                                        Open Dispute
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderManagement;
