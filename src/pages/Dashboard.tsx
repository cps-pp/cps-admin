import React from 'react';
import CardDataStats from '../components/CardDataStats';
import MonthChart from '../components/Charts/MonthChart';
import BarChart from '../components/Charts/BarChart';
import WeekChart from '../components/Charts/WeekChart';

const Dashboard: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats title="ຄົນເຈັບທັງໝົດ" total="60">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.7em"
            height="1.7em"
            className="text-blue-500 dark:text-white"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M20 17q.86 0 1.45.6t.58 1.4L14 22l-7-2v-9h1.95l7.27 2.69q.78.31.78 1.12q0 .47-.34.82t-.86.37H13l-1.75-.67l-.33.94L13 17zM16 3.23Q17.06 2 18.7 2q1.36 0 2.3 1t1 2.3q0 1.03-1 2.46t-1.97 2.39T16 13q-2.08-1.89-3.06-2.85t-1.97-2.39T10 5.3q0-1.36.97-2.3t2.34-1q1.6 0 2.69 1.23M.984 11H5v11H.984z"
            />
          </svg>
        </CardDataStats>
        <CardDataStats title="ການນັດໝາຍທັງໝົດ" total="3,000">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.7em"
            height="1.7em"
            viewBox="0 0 24 24"
            className="text-blue-500 dark:text-white"
          >
            <g
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              color="currentColor"
            >
              <path d="M14 3.5c3.771 0 5.657 0 6.828 1.245S22 7.993 22 12s0 6.01-1.172 7.255S17.771 20.5 14 20.5h-4c-3.771 0-5.657 0-6.828-1.245S2 16.007 2 12s0-6.01 1.172-7.255S6.229 3.5 10 3.5z" />
              <path d="M5 15.5c1.609-2.137 5.354-2.254 7 0m-1.751-5.25a1.75 1.75 0 1 1-3.5 0a1.75 1.75 0 0 1 3.5 0M15 9.5h4m-4 4h2" />
            </g>
          </svg>
        </CardDataStats>
        <CardDataStats title="Youth Ambassadors" total="300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.7em"
            height="1.7em"
            className="text-blue-500 dark:text-white"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M20 17q.86 0 1.45.6t.58 1.4L14 22l-7-2v-9h1.95l7.27 2.69q.78.31.78 1.12q0 .47-.34.82t-.86.37H13l-1.75-.67l-.33.94L13 17zM16 3.23Q17.06 2 18.7 2q1.36 0 2.3 1t1 2.3q0 1.03-1 2.46t-1.97 2.39T16 13q-2.08-1.89-3.06-2.85t-1.97-2.39T10 5.3q0-1.36.97-2.3t2.34-1q1.6 0 2.69 1.23M.984 11H5v11H.984z"
            />
          </svg>
        </CardDataStats>
        <CardDataStats title="Skills trained" total="32">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.7em"
            height="1.7em"
            className="text-blue-500 dark:text-white"
            viewBox="0 0 32 32"
          >
            <path
              fill="currentColor"
              d="M2 7.25A3.25 3.25 0 0 1 5.25 4h21.5A3.25 3.25 0 0 1 30 7.25v14.5A3.25 3.25 0 0 1 26.75 25H13.5v-1.893l.063-.107H26.75c.69 0 1.25-.56 1.25-1.25V7.25C28 6.56 27.44 6 26.75 6H5.25C4.56 6 4 6.56 4 7.25v6.187a7 7 0 0 0-2 1.732zM13 19.5a5.5 5.5 0 1 1-11 0a5.5 5.5 0 0 1 11 0m-1 5.362A6.97 6.97 0 0 1 7.5 26.5A6.97 6.97 0 0 1 3 24.862V29a1 1 0 0 0 1.528.849l2.972-1.85l2.972 1.85a1 1 0 0 0 1.528-.85zM8 11a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1m9 6a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2z"
            />
          </svg>
        </CardDataStats>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <BarChart />
        <WeekChart />
        <MonthChart />
      </div>
    </>
  );
};

export default Dashboard;
