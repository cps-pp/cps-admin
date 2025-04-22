import React, { ReactNode } from 'react';

interface CardDataStatsProps {
  title?: string;
  total?: string | number;
  children: ReactNode;
}

const CardDataStats: React.FC<CardDataStatsProps> = ({
  title,
  total,
  children,
}) => {
  return (
    <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-lg dark:border-strokedark dark:bg-boxdark">
      <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
        {children}
      </div>
      <h6 className="text-sm font-medium mb-[-12px] mt-1">{title}</h6>

      <div className="mt-4 flex items-end w-full">
        <div>
          <h4 className="text-title-md font-bold text-graydark dark:text-white whitespace-nowrap">
            {total}
          </h4>
        </div>
      </div>
    </div>
  );
};

export default CardDataStats;
