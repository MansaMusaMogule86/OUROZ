/**
 * OUROZ Certifications Card Component
 * Displays supplier certifications with verification status
 */

import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Certification } from '../../../types/supplier';

interface CertificationsCardProps {
    certifications: Certification[];
}

const CertificationsCard: React.FC<CertificationsCardProps> = ({ certifications }) => {
    if (certifications.length === 0) {
        return (
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">Certifications</h3>
                <p className="text-sm text-gray-500">No certifications listed.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Certifications</h3>
            <div className="space-y-3">
                {certifications.map((cert) => (
                    <div
                        key={cert.id}
                        className={`flex items-center gap-3 p-3 rounded-lg ${
                            cert.isVerified ? 'bg-green-50' : 'bg-gray-50'
                        }`}
                    >
                        <span className="text-2xl" aria-hidden="true">
                            {cert.icon || '📜'}
                        </span>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                                {cert.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {cert.issuer}
                            </p>
                        </div>
                        {cert.isVerified ? (
                            <CheckCircle
                                className="w-5 h-5 text-green-600 flex-shrink-0"
                                aria-label="Verified certification"
                            />
                        ) : (
                            <AlertCircle
                                className="w-5 h-5 text-gray-400 flex-shrink-0"
                                aria-label="Pending verification"
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CertificationsCard;
