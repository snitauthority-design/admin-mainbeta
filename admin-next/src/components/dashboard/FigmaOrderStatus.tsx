import React from 'react';

interface FigmaOrderStatusProps {
  orderStats?: {
    pending?: number;
    confirmed?: number;
    courier?: number;
    delivered?: number;
    canceled?: number;
    returns?: number;
  };
}

const FigmaOrderStatus: React.FC<FigmaOrderStatusProps> = ({
  orderStats = {
    pending: 0,
    confirmed: 0,
    courier: 0,
    delivered: 0,
    canceled: 0,
    returns: 0
  }
}) => {
  const orderItems = [
    { label: 'Pending', value: orderStats.pending, bgColor: 'bg-amber-100', color: '#EAB308', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3.79399 12.03C4.33099 9.342 4.59999 8 5.48699 7.134C5.65092 6.97444 5.82824 6.82924 6.01699 6.7C7.03999 6 8.40999 6 11.15 6H12.853C15.592 6 16.961 6 17.983 6.7C18.173 6.83067 18.3497 6.97567 18.513 7.135C19.4 8 19.67 9.343 20.207 12.03C20.978 15.886 21.364 17.814 20.476 19.18C20.3153 19.4287 20.1287 19.6563 19.916 19.863C18.75 21 16.785 21 12.853 21H11.15C7.21699 21 5.25099 21 4.08499 19.862C3.87404 19.6556 3.68656 19.4266 3.52599 19.179C2.63799 17.813 3.02399 15.885 3.79599 12.029L3.79399 12.03Z" stroke="#B40080" strokeWidth="1.5"/>
<path d="M9 6V5C9 4.20435 9.31607 3.44129 9.87868 2.87868C10.4413 2.31607 11.2044 2 12 2C12.7956 2 13.5587 2.31607 14.1213 2.87868C14.6839 3.44129 15 4.20435 15 5V6M9.17 15C9.3766 15.5855 9.75974 16.0926 10.2666 16.4512C10.7735 16.8099 11.3791 17.0025 12 17.0025C12.6209 17.0025 13.2265 16.8099 13.7334 16.4512C14.2403 16.0926 14.6234 15.5855 14.83 15" stroke="#B40080" strokeWidth="1.5" strokeLinecap="round"/>
</svg>

    )},
    { label: 'Confirmed', value: orderStats.confirmed, bgColor: 'bg-green-100', color: '#16A34A', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="9" stroke="#16A34A" strokeWidth="2"/>
        <path d="M8 12L11 15L16 9" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )},
    { label: 'Courier', value: orderStats.courier, bgColor: 'bg-orange-100', color: '#D97706', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 3H14V15H1V3Z" fill="#D97706"/>
        <path d="M14 7H18L21 10V15H14V7Z" fill="#D97706"/>
        <circle cx="5" cy="15" r="2.5" fill="white" stroke="#D97706" strokeWidth="1.5"/>
        <circle cx="17" cy="15" r="2.5" fill="white" stroke="#D97706" strokeWidth="1.5"/>
      </svg>
    )},
    { label: 'Delivered', value: orderStats.delivered, bgColor: 'bg-pink-100', color: '#BE185D', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 8L12 4L20 8V16L12 20L4 16V8Z" stroke="#BE185D" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M12 12V20" stroke="#BE185D" strokeWidth="2"/>
        <path d="M12 12L20 8" stroke="#BE185D" strokeWidth="2"/>
        <path d="M12 12L4 8" stroke="#BE185D" strokeWidth="2"/>
      </svg>
    )},
    { label: 'Canceled', value: orderStats.canceled, bgColor: 'bg-red-100', color: '#DC2626', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="9" stroke="#DC2626" strokeWidth="2"/>
        <path d="M15 9L9 15M9 9L15 15" stroke="#DC2626" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )},
    { label: 'Returns', value: orderStats.returns, bgColor: 'bg-blue-100', color: '#1D4ED8', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="9" stroke="#1D4ED8" strokeWidth="2"/>
        <path d="M15 12H9M9 12L12 9M9 12L12 15" stroke="#1D4ED8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )}
  ];

return (
  <div className="px-2 xs:px-3 sm:px-4 md:px-5 lg:px-3 xl:px-4 w-full">
    <h2 className="text-black dark:text-white text-sm xs:text-base font-semibold mb-2 xs:mb-3 font-['Poppins']">Order</h2>
    
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 xs:gap-3 sm:gap-4">
      {orderItems.map((item, index) => (
        <div 
          key={index} 
          className={`w-full rounded-lg overflow-hidden shadow-[0px_2px_9.6px_rgba(0,0,0,0.08)] bg-white dark:bg-gray-800 flex items-center gap-2 xs:gap-3 px-2 xs:px-3 py-2 xs:py-2.5 min-h-[48px] transition-shadow hover:shadow-md active:scale-[0.98]`}
        >
          {/* Icon Container */}
          <div className={`w-8 h-8 xs:w-9 xs:h-9 flex-shrink-0 ${item.bgColor} rounded-lg flex items-center justify-center`}>
             {item.icon}
          </div>

          {/* Label + Value */}
          <div className="flex-1 min-w-0 flex items-center justify-between gap-1">
            <span className="text-[11px] xs:text-xs text-black dark:text-white font-medium font-['Poppins'] truncate">
              {item.label}
            </span>
            <span className="text-lg xs:text-xl sm:text-2xl font-medium text-black dark:text-white font-['Poppins'] flex-shrink-0 tabular-nums">
              {item.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);
};

export default FigmaOrderStatus;
