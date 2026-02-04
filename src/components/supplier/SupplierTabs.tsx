/**
 * OUROZ Supplier Tabs Component
 * Animated tab navigation for supplier profile sections
 */

import React from 'react';
import { motion } from 'framer-motion';
import { TabId } from './SupplierProfilePage';

interface Tab {
    id: TabId;
    label: string;
}

interface SupplierTabsProps {
    tabs: Tab[];
    activeTab: TabId;
    onTabChange: (tabId: TabId) => void;
}

const SupplierTabs: React.FC<SupplierTabsProps> = ({ tabs, activeTab, onTabChange }) => {
    return (
        <nav className="flex border-b mt-8" role="tablist" aria-label="Supplier profile sections">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    aria-controls={`panel-${tab.id}`}
                    onClick={() => onTabChange(tab.id)}
                    className={`
                        px-6 py-4 font-medium transition relative
                        ${activeTab === tab.id
                            ? 'text-amber-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }
                    `}
                >
                    {tab.label}
                    {activeTab === tab.id && (
                        <motion.div
                            layoutId="activeSupplierTab"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500"
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                    )}
                </button>
            ))}
        </nav>
    );
};

export default SupplierTabs;
