/**
 * OUROZ Contact Card Component
 * Displays supplier contact information
 */

import React from 'react';
import { SupplierProfile } from '../../../types/supplier';

interface ContactCardProps {
    supplier: SupplierProfile;
}

const ContactCard: React.FC<ContactCardProps> = ({ supplier }) => {
    // Generate avatar URL if not provided
    const contactInitial = supplier.contactName?.charAt(0) || '?';

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="space-y-4">
                {/* Contact Person */}
                {supplier.contactName && (
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-xl font-semibold">
                            {contactInitial}
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">
                                {supplier.contactName}
                            </p>
                            {supplier.contactTitle && (
                                <p className="text-sm text-gray-500">
                                    {supplier.contactTitle}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Details */}
                <div className="pt-3 border-t space-y-2 text-sm">
                    {supplier.languages.length > 0 && (
                        <p className="text-gray-600">
                            <strong className="text-gray-700">Languages:</strong>{' '}
                            {supplier.languages.join(', ')}
                        </p>
                    )}
                    {supplier.fullAddress && (
                        <p className="text-gray-600">
                            <strong className="text-gray-700">Address:</strong>{' '}
                            {supplier.fullAddress}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContactCard;
