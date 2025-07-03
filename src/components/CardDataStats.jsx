import React from 'react';

const CardDataStats = ({ title, total, children }) => {
  return (
    <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-md ">
      <div className="flex items-center gap-2 mb-2">
           <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-100 to-purple-100 text-indigo-600 shadow-inner">
          {children}
        </div>
        <h6 className="text-lg font-semibold text-primary">{title}</h6>
      </div>

      <div className="mt-2 flex items-end w-full">
        <div>
          <h4 className="text-xl md:text-xl lg:text-2xl font-bold text-graydark dark:text-white whitespace-nowrap">
            {total}
          </h4>
        </div>
      </div>
    </div>
  );
};

export default CardDataStats;
