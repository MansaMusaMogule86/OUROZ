/**
 * OUROZ Business Details Card Component
 * Displays supplier business information in sidebar
 */

import React from 'react';
import { SupplierProfile } from '../../../types/supplier';

interface BusinessDetailsCardProps {
    supplier: SupplierProfile;
}

interface DetailRowProps {
    label: string;
    value: string | number | boolean;
    isBoolean?: boolean;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value, isBoolean = false }) => {
    const displayValue = isBoolean
        ? (value ? 'Verified ✓' : 'Not Verified')
        : String(value);

    const valueClass = isBoolean
        ? (value ? 'text-green-600' : 'text-red-500')
        : 'text-gray-900';

    return (
        <div className="flex justify-between">
            <span className="text-gray-500">{label}</span>
            <span className={`font-medium ${valueClass}`}>{displayValue}</span>
        </div>
    );
};

const BusinessDetailsCard: React.FC<BusinessDetailsCardProps> = ({ supplier }) => {
    // Format company type for display
    const formatCompanyType = (type: string) => {
        return type
            .replace(/_/g, ' ')
            .toLowerCase()
            .replace(/\b\w/g, c => c.toUpperCase());
    };

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Business Details</h3>
            <div className="space-y-3 text-sm">
                <DetailRow
                    label="Business Type"
                    value={formatCompanyType(supplier.companyType)}
                />
                <DetailRow
                    label="Year Established"
                    value={supplier.yearEstablished}
                />
                <DetailRow
                    label="Employees"
                    value={supplier.employeeCount}
                />
                <DetailRow
                    label="Annual Revenue"
                    value={supplier.annualRevenue}
                />
                <DetailRow
                    label="Location"
                    value={supplier.region}
                />
                <DetailRow
                    label="Export License"
                    value={supplier.hasExportLicense}
                    isBoolean
                />
                {supplier.freeZoneCertified && (
                    <DetailRow
                        label="Free Zone"
                        value={true}
                        isBoolean
                    />
                )}
            </div>
        </div>
    );
};

export default BusinessDetailsCard;
