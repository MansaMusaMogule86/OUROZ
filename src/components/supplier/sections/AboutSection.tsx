/**
 * OUROZ About Section Component
 * Displays company overview, performance metrics, and export markets
 */

import React from 'react';
import { Truck, Package, Users, Globe } from 'lucide-react';
import { SupplierProfile } from '../../../types/supplier';

interface AboutSectionProps {
    supplier: SupplierProfile;
}

interface MetricCardProps {
    label: string;
    value: string | number;
    icon: React.FC<{ className?: string }>;
    color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, icon: Icon, color }) => (
    <div className="text-center p-4 bg-gray-50 rounded-xl">
        <Icon className={`w-8 h-8 mx-auto mb-2 ${color}`} />
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
    </div>
);

const AboutSection: React.FC<AboutSectionProps> = ({ supplier }) => {
    return (
        <div className="space-y-6">
            {/* Company Description */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Company Overview</h2>
                {supplier.description ? (
                    <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                        {supplier.description}
                    </p>
                ) : (
                    <p className="text-gray-400 italic">No description provided.</p>
                )}
            </div>

            {/* Performance Metrics */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <MetricCard
                        label="On-time Delivery"
                        value={`${supplier.onTimeDelivery}%`}
                        icon={Truck}
                        color="text-green-500"
                    />
                    <MetricCard
                        label="Total Transactions"
                        value={supplier.totalTransactions.toLocaleString()}
                        icon={Package}
                        color="text-blue-500"
                    />
                    <MetricCard
                        label="Repeat Buyers"
                        value={`${supplier.repeatBuyerRate}%`}
                        icon={Users}
                        color="text-purple-500"
                    />
                    <MetricCard
                        label="Export Experience"
                        value={`${supplier.exportExperience} years`}
                        icon={Globe}
                        color="text-amber-500"
                    />
                </div>
            </div>

            {/* Export Markets */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Export Markets</h2>
                {supplier.exportCountries.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {supplier.exportCountries.map(code => (
                            <span
                                key={code}
                                className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
                            >
                                {code}
                            </span>
                        ))}
                        {/* Show "more countries" badge if many */}
                        {supplier.exportCountries.length >= 5 && (
                            <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                                +{Math.max(40 - supplier.exportCountries.length, 0)} more countries
                            </span>
                        )}
                    </div>
                ) : (
                    <p className="text-gray-400 italic">No export countries listed.</p>
                )}
            </div>
        </div>
    );
};

export default AboutSection;
