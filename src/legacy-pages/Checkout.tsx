/**
 * OUROZ Checkout & Payment System
 * Page 10 - Complete checkout flow with Trade Assurance
 * 
 * PAGE OBJECTIVE:
 * Secure, multi-step checkout with Trade Assurance payment protection,
 * multiple payment methods, shipping calculator, and order confirmation.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShoppingCart, CreditCard, Truck, Shield, CheckCircle,
    ChevronRight, ChevronDown, Lock, AlertCircle, Info,
    MapPin, Calendar, Package, Globe, Building2, Clock
} from 'lucide-react';

interface CheckoutProps {
    language: 'en' | 'ar' | 'fr';
    userId: string;
    onNavigate: (path: string) => void;
}

interface CartItem {
    id: string;
    productId: string;
    name: string;
    image: string;
    quantity: number;
    unitPrice: number;
    total: number;
    supplier: {
        id: string;
        name: string;
        logo: string;
        verificationLevel: 'BASIC' | 'VERIFIED' | 'GOLD' | 'TRUSTED';
        hasTradeAssurance: boolean;
        location: string;
    };
    leadTime: number;
}

interface ShippingAddress {
    id: string;
    name: string;
    company: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
    isDefault: boolean;
}

// Mock Data
const MOCK_CART_ITEMS: CartItem[] = [
    {
        id: 'cart_001',
        productId: 'prod_001',
        name: 'Premium Organic Argan Oil 100ml',
        image: 'https://picsum.photos/seed/argan/200',
        quantity: 5000,
        unitPrice: 7.50,
        total: 37500,
        supplier: {
            id: 'sup_001',
            name: 'Atlas Argan Trading Co.',
            logo: 'https://ui-avatars.com/api/?name=Atlas+Argan&background=C4A052&color=fff',
            verificationLevel: 'GOLD',
            hasTradeAssurance: true,
            location: 'Agadir, Morocco',
        },
        leadTime: 14,
    },
    {
        id: 'cart_002',
        productId: 'prod_002',
        name: 'Rose Water Toner 200ml',
        image: 'https://picsum.photos/seed/rose/200',
        quantity: 2000,
        unitPrice: 4.50,
        total: 9000,
        supplier: {
            id: 'sup_001',
            name: 'Atlas Argan Trading Co.',
            logo: 'https://ui-avatars.com/api/?name=Atlas+Argan&background=C4A052&color=fff',
            verificationLevel: 'GOLD',
            hasTradeAssurance: true,
            location: 'Agadir, Morocco',
        },
        leadTime: 14,
    },
];

const MOCK_ADDRESSES: ShippingAddress[] = [
    {
        id: 'addr_001',
        name: 'John Smith',
        company: 'Global Beauty Inc.',
        address1: '123 Commerce Street',
        address2: 'Suite 500',
        city: 'Los Angeles',
        state: 'CA',
        postalCode: '90001',
        country: 'United States',
        phone: '+1 (555) 123-4567',
        isDefault: true,
    },
];

const PAYMENT_METHODS = [
    { id: 'trade_assurance', name: 'Trade Assurance', icon: Shield, description: 'Secure payment with buyer protection', fee: 0, recommended: true },
    { id: 'credit_card', name: 'Credit Card', icon: CreditCard, description: 'Visa, Mastercard, American Express', fee: 2.9 },
    { id: 'bank_transfer', name: 'Bank Transfer', icon: Building2, description: 'Direct bank wire transfer', fee: 0 },
    { id: 'paypal', name: 'PayPal', icon: Globe, description: 'Pay with your PayPal account', fee: 3.9 },
];

const INCOTERMS = [
    { id: 'EXW', name: 'EXW - Ex Works', description: 'Buyer collects from supplier location' },
    { id: 'FOB', name: 'FOB - Free on Board', description: 'Supplier delivers to port of shipment' },
    { id: 'CIF', name: 'CIF - Cost, Insurance & Freight', description: 'Supplier pays for shipping and insurance' },
    { id: 'DDP', name: 'DDP - Delivered Duty Paid', description: 'Full door-to-door delivery included' },
];

const Checkout: React.FC<CheckoutProps> = ({ language, userId, onNavigate }) => {
    const [step, setStep] = useState(1);
    const [cartItems] = useState<CartItem[]>(MOCK_CART_ITEMS);
    const [selectedAddress, setSelectedAddress] = useState<string>(MOCK_ADDRESSES[0]?.id || '');
    const [selectedPayment, setSelectedPayment] = useState('trade_assurance');
    const [selectedIncoterm, setSelectedIncoterm] = useState('CIF');
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
    const shippingEstimate = Math.round(subtotal * 0.06); // ~6% shipping estimate
    const paymentFee = PAYMENT_METHODS.find(p => p.id === selectedPayment)?.fee || 0;
    const processingFee = Math.round(subtotal * (paymentFee / 100));
    const total = subtotal + shippingEstimate + processingFee;

    const steps = [
        { id: 1, title: 'Review Order', icon: ShoppingCart },
        { id: 2, title: 'Shipping', icon: Truck },
        { id: 3, title: 'Payment', icon: CreditCard },
        { id: 4, title: 'Confirm', icon: CheckCircle },
    ];

    const handlePlaceOrder = async () => {
        setIsProcessing(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsProcessing(false);
        setStep(5); // Success step
    };

    if (step === 5) {
        return <OrderSuccess orderNumber="ORD-2024-001550" onNavigate={onNavigate} />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-900">Secure Checkout</h1>
                        <div className="flex items-center gap-2 text-green-600">
                            <Lock className="w-5 h-5" />
                            <span className="text-sm font-medium">SSL Secured</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex justify-center">
                        <div className="flex items-center gap-4">
                            {steps.map((s, i) => (
                                <React.Fragment key={s.id}>
                                    <div
                                        className={`flex items-center gap-2 cursor-pointer ${step >= s.id ? 'text-amber-600' : 'text-gray-400'}`}
                                        onClick={() => step > s.id && setStep(s.id)}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step > s.id ? 'bg-amber-500 text-white' :
                                                step === s.id ? 'bg-amber-500 text-white' :
                                                    'bg-gray-200'
                                            }`}>
                                            {step > s.id ? <CheckCircle className="w-5 h-5" /> : <s.icon className="w-4 h-4" />}
                                        </div>
                                        <span className={`font-medium hidden md:inline ${step >= s.id ? 'text-gray-900' : ''}`}>
                                            {s.title}
                                        </span>
                                    </div>
                                    {i < steps.length - 1 && (
                                        <div className={`w-12 h-0.5 ${step > s.id ? 'bg-amber-500' : 'bg-gray-200'}`} />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <ReviewOrderStep
                                        cartItems={cartItems}
                                        onContinue={() => setStep(2)}
                                        onNavigate={onNavigate}
                                    />
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <ShippingStep
                                        addresses={MOCK_ADDRESSES}
                                        selectedAddress={selectedAddress}
                                        setSelectedAddress={setSelectedAddress}
                                        selectedIncoterm={selectedIncoterm}
                                        setSelectedIncoterm={setSelectedIncoterm}
                                        onBack={() => setStep(1)}
                                        onContinue={() => setStep(3)}
                                    />
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <PaymentStep
                                        paymentMethods={PAYMENT_METHODS}
                                        selectedPayment={selectedPayment}
                                        setSelectedPayment={setSelectedPayment}
                                        onBack={() => setStep(2)}
                                        onContinue={() => setStep(4)}
                                    />
                                </motion.div>
                            )}

                            {step === 4 && (
                                <motion.div
                                    key="step4"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <ConfirmStep
                                        cartItems={cartItems}
                                        address={MOCK_ADDRESSES.find(a => a.id === selectedAddress)}
                                        paymentMethod={PAYMENT_METHODS.find(p => p.id === selectedPayment)}
                                        incoterm={INCOTERMS.find(i => i.id === selectedIncoterm)}
                                        agreedToTerms={agreedToTerms}
                                        setAgreedToTerms={setAgreedToTerms}
                                        isProcessing={isProcessing}
                                        onBack={() => setStep(3)}
                                        onPlaceOrder={handlePlaceOrder}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div>
                        <OrderSummary
                            cartItems={cartItems}
                            subtotal={subtotal}
                            shippingEstimate={shippingEstimate}
                            processingFee={processingFee}
                            total={total}
                            selectedPayment={selectedPayment}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Step Components
const ReviewOrderStep: React.FC<{
    cartItems: CartItem[];
    onContinue: () => void;
    onNavigate: (path: string) => void;
}> = ({ cartItems, onContinue, onNavigate }) => (
    <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Review Your Order</h2>

        {/* Group by supplier */}
        <div className="space-y-6">
            {cartItems.map(item => (
                <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <img src={item.supplier.logo} alt="" className="w-5 h-5 rounded-full" />
                            <span>{item.supplier.name}</span>
                            {item.supplier.hasTradeAssurance && (
                                <Shield className="w-4 h-4 text-green-600" />
                            )}
                        </div>
                        <div className="flex items-center justify-between mt-3">
                            <div className="text-sm">
                                <span className="text-gray-500">Qty: </span>
                                <span className="font-medium">{item.quantity.toLocaleString()}</span>
                                <span className="text-gray-500 mx-2">×</span>
                                <span className="font-medium">${item.unitPrice.toFixed(2)}</span>
                            </div>
                            <p className="text-lg font-bold text-gray-900">${item.total.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* Trade Assurance Info */}
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-green-600 mt-0.5" />
                <div>
                    <p className="font-semibold text-green-800">Trade Assurance Eligible</p>
                    <p className="text-sm text-green-600 mt-1">
                        This order is eligible for Trade Assurance protection. Your payment is secured until you confirm receipt of goods.
                    </p>
                </div>
            </div>
        </div>

        <button
            onClick={onContinue}
            className="w-full mt-6 py-4 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition flex items-center justify-center gap-2"
        >
            Continue to Shipping
            <ChevronRight className="w-5 h-5" />
        </button>
    </div>
);

const ShippingStep: React.FC<{
    addresses: ShippingAddress[];
    selectedAddress: string;
    setSelectedAddress: (id: string) => void;
    selectedIncoterm: string;
    setSelectedIncoterm: (term: string) => void;
    onBack: () => void;
    onContinue: () => void;
}> = ({ addresses, selectedAddress, setSelectedAddress, selectedIncoterm, setSelectedIncoterm, onBack, onContinue }) => (
    <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Address</h2>

            <div className="space-y-4">
                {addresses.map(addr => (
                    <label
                        key={addr.id}
                        className={`block p-4 border-2 rounded-xl cursor-pointer transition ${selectedAddress === addr.id
                                ? 'border-amber-500 bg-amber-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <div className="flex items-start gap-3">
                            <input
                                type="radio"
                                name="address"
                                checked={selectedAddress === addr.id}
                                onChange={() => setSelectedAddress(addr.id)}
                                className="mt-1 w-4 h-4 text-amber-500"
                            />
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="font-semibold text-gray-900">{addr.name}</p>
                                    {addr.isDefault && (
                                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">Default</span>
                                    )}
                                </div>
                                <p className="text-gray-600">{addr.company}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {addr.address1}{addr.address2 && `, ${addr.address2}`}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {addr.city}, {addr.state} {addr.postalCode}
                                </p>
                                <p className="text-sm text-gray-500">{addr.country}</p>
                                <p className="text-sm text-gray-500 mt-1">{addr.phone}</p>
                            </div>
                        </div>
                    </label>
                ))}

                <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-amber-500 hover:text-amber-600 transition">
                    + Add New Address
                </button>
            </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Terms (Incoterm)</h2>

            <div className="space-y-3">
                {INCOTERMS.map(term => (
                    <label
                        key={term.id}
                        className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition ${selectedIncoterm === term.id
                                ? 'border-amber-500 bg-amber-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <input
                            type="radio"
                            name="incoterm"
                            checked={selectedIncoterm === term.id}
                            onChange={() => setSelectedIncoterm(term.id)}
                            className="w-4 h-4 text-amber-500"
                        />
                        <div>
                            <p className="font-semibold text-gray-900">{term.name}</p>
                            <p className="text-sm text-gray-500">{term.description}</p>
                        </div>
                    </label>
                ))}
            </div>
        </div>

        <div className="flex gap-4">
            <button
                onClick={onBack}
                className="flex-1 py-4 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition"
            >
                Back
            </button>
            <button
                onClick={onContinue}
                className="flex-1 py-4 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition flex items-center justify-center gap-2"
            >
                Continue to Payment
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    </div>
);

const PaymentStep: React.FC<{
    paymentMethods: typeof PAYMENT_METHODS;
    selectedPayment: string;
    setSelectedPayment: (id: string) => void;
    onBack: () => void;
    onContinue: () => void;
}> = ({ paymentMethods, selectedPayment, setSelectedPayment, onBack, onContinue }) => (
    <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>

            <div className="space-y-3">
                {paymentMethods.map(method => (
                    <label
                        key={method.id}
                        className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition ${selectedPayment === method.id
                                ? 'border-amber-500 bg-amber-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <input
                            type="radio"
                            name="payment"
                            checked={selectedPayment === method.id}
                            onChange={() => setSelectedPayment(method.id)}
                            className="w-4 h-4 text-amber-500"
                        />
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${method.id === 'trade_assurance' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                            }`}>
                            <method.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <p className="font-semibold text-gray-900">{method.name}</p>
                                {method.recommended && (
                                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">Recommended</span>
                                )}
                            </div>
                            <p className="text-sm text-gray-500">{method.description}</p>
                        </div>
                        {method.fee > 0 && (
                            <span className="text-sm text-gray-500">+{method.fee}% fee</span>
                        )}
                    </label>
                ))}
            </div>

            {selectedPayment === 'trade_assurance' && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <h3 className="font-semibold text-green-800 mb-2">🛡️ Trade Assurance Benefits</h3>
                    <ul className="text-sm text-green-700 space-y-1">
                        <li>✓ 100% payment protection until goods received</li>
                        <li>✓ Full refund if products don't match description</li>
                        <li>✓ OUROZ dispute resolution support</li>
                        <li>✓ Secure escrow payment system</li>
                    </ul>
                </div>
            )}

            {selectedPayment === 'credit_card' && (
                <div className="mt-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                        <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Expiry</label>
                            <input
                                type="text"
                                placeholder="MM/YY"
                                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">CVC</label>
                            <input
                                type="text"
                                placeholder="123"
                                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>

        <div className="flex gap-4">
            <button
                onClick={onBack}
                className="flex-1 py-4 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition"
            >
                Back
            </button>
            <button
                onClick={onContinue}
                className="flex-1 py-4 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition flex items-center justify-center gap-2"
            >
                Review Order
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    </div>
);

const ConfirmStep: React.FC<{
    cartItems: CartItem[];
    address?: ShippingAddress;
    paymentMethod?: typeof PAYMENT_METHODS[0];
    incoterm?: typeof INCOTERMS[0];
    agreedToTerms: boolean;
    setAgreedToTerms: (agreed: boolean) => void;
    isProcessing: boolean;
    onBack: () => void;
    onPlaceOrder: () => void;
}> = ({ cartItems, address, paymentMethod, incoterm, agreedToTerms, setAgreedToTerms, isProcessing, onBack, onPlaceOrder }) => (
    <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Confirm Your Order</h2>

            {/* Order Summary */}
            <div className="space-y-4 mb-6">
                {cartItems.map(item => (
                    <div key={item.id} className="flex items-center gap-4">
                        <img src={item.image} alt="" className="w-16 h-16 rounded-lg object-cover" />
                        <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-500">{item.quantity.toLocaleString()} × ${item.unitPrice}</p>
                        </div>
                        <p className="font-semibold">${item.total.toLocaleString()}</p>
                    </div>
                ))}
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-6 pt-6 border-t">
                <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Ship To</h3>
                    {address && (
                        <div className="text-sm text-gray-600">
                            <p className="font-medium">{address.name}</p>
                            <p>{address.company}</p>
                            <p>{address.address1}</p>
                            <p>{address.city}, {address.state} {address.postalCode}</p>
                            <p>{address.country}</p>
                        </div>
                    )}
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Payment</h3>
                    <div className="text-sm text-gray-600">
                        <p className="font-medium">{paymentMethod?.name}</p>
                        <p>{incoterm?.name}</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Terms */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
            <label className="flex items-start gap-3 cursor-pointer">
                <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 w-5 h-5 text-amber-500 rounded"
                />
                <span className="text-sm text-gray-600">
                    I have read and agree to the <a href="#" className="text-amber-600 underline">Terms & Conditions</a>,
                    <a href="#" className="text-amber-600 underline"> Trade Assurance Agreement</a>, and
                    <a href="#" className="text-amber-600 underline"> Privacy Policy</a>.
                </span>
            </label>
        </div>

        <div className="flex gap-4">
            <button
                onClick={onBack}
                disabled={isProcessing}
                className="flex-1 py-4 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
            >
                Back
            </button>
            <button
                onClick={onPlaceOrder}
                disabled={!agreedToTerms || isProcessing}
                className="flex-1 py-4 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isProcessing ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                    </>
                ) : (
                    <>
                        <Lock className="w-5 h-5" />
                        Place Order
                    </>
                )}
            </button>
        </div>
    </div>
);

const OrderSummary: React.FC<{
    cartItems: CartItem[];
    subtotal: number;
    shippingEstimate: number;
    processingFee: number;
    total: number;
    selectedPayment: string;
}> = ({ cartItems, subtotal, shippingEstimate, processingFee, total, selectedPayment }) => (
    <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

        <div className="space-y-3 text-sm">
            <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
                <span className="font-medium">${subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-600">Shipping Estimate</span>
                <span className="font-medium">${shippingEstimate.toLocaleString()}</span>
            </div>
            {processingFee > 0 && (
                <div className="flex justify-between">
                    <span className="text-gray-600">Processing Fee</span>
                    <span className="font-medium">${processingFee.toLocaleString()}</span>
                </div>
            )}
            <div className="pt-3 border-t">
                <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-amber-600">${total.toLocaleString()}</span>
                </div>
            </div>
        </div>

        {/* Lead Time */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">Est. Lead Time: 14-21 days</span>
        </div>

        {/* Trade Assurance */}
        {selectedPayment === 'trade_assurance' && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                <div className="text-sm">
                    <p className="font-medium text-green-800">Protected by Trade Assurance</p>
                    <p className="text-green-600 text-xs">Up to $500,000 coverage</p>
                </div>
            </div>
        )}

        {/* Secure Payment */}
        <div className="mt-4 flex items-center justify-center gap-4 text-gray-400">
            <Lock className="w-4 h-4" />
            <span className="text-xs">256-bit SSL Encryption</span>
        </div>
    </div>
);

const OrderSuccess: React.FC<{
    orderNumber: string;
    onNavigate: (path: string) => void;
}> = ({ orderNumber, onNavigate }) => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-lg text-center">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 15 }}
                className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
                <CheckCircle className="w-12 h-12 text-green-600" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
            <p className="text-gray-600 mb-6">
                Thank you for your order. We've sent a confirmation email with all the details.
            </p>
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                <p className="text-gray-500">Order Number</p>
                <p className="text-2xl font-mono font-bold text-amber-600">{orderNumber}</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8">
                <div className="flex items-center justify-center gap-2 text-green-700">
                    <Shield className="w-5 h-5" />
                    <span className="font-medium">Your payment is protected by Trade Assurance</span>
                </div>
            </div>
            <div className="flex gap-4">
                <button
                    onClick={() => onNavigate('/orders')}
                    className="flex-1 py-3 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition"
                >
                    View Order
                </button>
                <button
                    onClick={() => onNavigate('/marketplace')}
                    className="flex-1 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                    Continue Shopping
                </button>
            </div>
        </div>
    </div>
);

export default Checkout;
