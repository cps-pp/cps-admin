import React, { useEffect, useState } from 'react';
import CardDataStats from '../components/CardDataStats';
import MonthChart from '../components/Charts/MonthChart';
import BarChart from '../components/Charts/BarChart';
import WeekChart from '../components/Charts/WeekChart';

const Dashboard: React.FC = () => {
  const [patients, setPatients] = useState<number | null>(null);
  const [filteredPatients, setFilteredPatients] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:4000/manager/patient`, {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Data received:', data); 
        
        // Set total number of patients
        setPatients(data.data.length);
        
        // Set filtered patients (in case you need it later)
        setFilteredPatients(data.data);
      } catch (error) {
        console.error('Error fetching patients:', error);
        setPatients(0);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        
        <CardDataStats title="ລາຍຮັບທັງໝົດ" total="60,000,000 ກີບ">
          <svg
            className="w-6 h-6 text-blue-500 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 3v4a1 1 0 0 1-1 1H5m4 10v-2m3 2v-6m3 6v-3m4-11v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z"
            />
          </svg>
        </CardDataStats>
        <CardDataStats title="ນັດໝາຍທັງໝົດ" total="30 ນັດໝາຍ">
          <svg
            className="w-9 h-6 text-blue-500 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="1.7em"
            height="1.7em"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 10h16m-8-3V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Zm3-7h.01v.01H8V13Zm4 0h.01v.01H12V13Zm4 0h.01v.01H16V13Zm-8 4h.01v.01H8V17Zm4 0h.01v.01H12V17Zm4 0h.01v.01H16V17Z"
            />
          </svg>
        </CardDataStats>
        <CardDataStats 
          title="ຄົນເຈັບທັງໝົດ" 
          total={patients !== null ? `${patients} ຄົນ` : "ກຳລັງໂຫຼດ..."}
        >
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
        <CardDataStats title="ທ່ານຫມໍທັງໝົດ" total="2 ຄົນ">
          <svg
            className="w-9 h-6 text-blue-500 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
              d="M16 19h4a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-2m-2.236-4a3 3 0 1 0 0-4M3 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
        </CardDataStats>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <MonthChart />
      </div>
    </>
  );
};

export default Dashboard;