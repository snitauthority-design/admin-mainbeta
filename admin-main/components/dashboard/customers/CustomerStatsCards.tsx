import React from 'react';
import { Users, Star, RefreshCw, Ban } from 'lucide-react';

interface CustomerStatsCardsProps {
  totalCustomers: number;
  totalReviews: number;
  repeatCustomers: number;
  blockedCustomers: number;
}

const CustomerStatsCards: React.FC<CustomerStatsCardsProps> = ({
  totalCustomers,
  totalReviews,
  repeatCustomers,
  blockedCustomers,
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
    <div className="bg-[#F0F9FF] rounded-xl p-5 flex items-start justify-between">
      <div className="space-y-1">
        <h3 className="text-stone-900 text-base font-medium">Customer</h3>
        <p className="text-3xl font-bold text-gray-900">{totalCustomers}</p>
        <p className="text-gray-500 text-xs font-medium">Total user</p>
      </div>
      <div className="w-12 h-12 bg-[#0095FF] rounded-lg flex items-center justify-center shadow-sm">
        <Users className="w-6 h-6 text-white" />
      </div>
    </div>

    <div className="bg-[#FFF7ED] rounded-xl p-5 flex items-start justify-between">
      <div className="space-y-1">
        <h3 className="text-stone-900 text-base font-medium">Review</h3>
        <p className="text-3xl font-bold text-gray-900">{totalReviews}</p>
        <p className="text-gray-500 text-xs font-medium">Consumers review</p>
      </div>
      <div className="w-12 h-12 bg-[#F97316] rounded-lg flex items-center justify-center shadow-sm">
        <Star className="w-6 h-6 text-white" fill="currentColor" />
      </div>
    </div>

    <div className="bg-[#F0FDF4] rounded-xl p-5 flex items-start justify-between">
      <div className="space-y-1">
        <h3 className="text-stone-900 text-base font-medium">Recurring customers</h3>
        <p className="text-3xl font-bold text-gray-900">{repeatCustomers}</p>
        <p className="text-gray-500 text-xs font-medium">Repeat customers</p>
      </div>
      <div className="w-12 h-12 bg-[#22C55E] rounded-lg flex items-center justify-center shadow-sm">
        <RefreshCw className="w-6 h-6 text-white" />
      </div>
    </div>

    <div className="bg-[#FEF2F2] rounded-xl p-5 flex items-start justify-between">
      <div className="space-y-1">
        <h3 className="text-stone-900 text-base font-medium">Blocked</h3>
        <p className="text-3xl font-bold text-gray-900">{blockedCustomers}</p>
        <p className="text-gray-500 text-xs font-medium">Blocked users</p>
      </div>
      <div className="w-12 h-12 bg-[#EF4444] rounded-lg flex items-center justify-center shadow-sm">
        <Ban className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

export default CustomerStatsCards;
