import React, { useEffect, useState } from 'react';
import CardDataStats from '../components/CardDataStats';
import MonthChart from '../components/Charts/MonthChart';
import BarChart from '../components/Charts/BarChart';
import WeekChart from '../components/Charts/WeekChart';
import { getAppointments } from '@/api/getAppointments';
import { FollowHeaders } from './Follow/column/follow';
import { TableAction } from '@/components/Tables/TableAction';

const Dashboard: React.FC = () => {
  const [patients, setPatients] = useState<number | null>(null);
  const [filteredPatients, setFilteredPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredAppointments, setFilteredAppointments] = useState<any[]>([]);
  const [patientName, setPatientName] = useState<any[]>([]);
  const [empName, setEmpName] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [doneCount, setDoneCount] = useState(0);
  const [waitingCount, setWaitingCount] = useState(0);

  const [doctorCount, setDoctorCount] = useState(0);
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
        setPatients(data.data.length);
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
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('http://localhost:4000/manager/emp');
        const data = await response.json();
        setDoctorCount(data.data.length);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getAppointments();
      setAppointments(data);
      setFilteredAppointments(data);
      setTotalCount(data.length);
      setDoneCount(
        data.filter((item: { status: string }) => item.status === 'ກວດແລ້ວ')
          .length,
      );
      setWaitingCount(
        data.filter((item: { status: string }) => item.status === 'ລໍຖ້າ')
          .length,
      );
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:4000/manager/patient', {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setPatientName(data.data); // Populate patientName state
      } catch (error) {
        console.error('Error fetching patient data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, []);
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:4000/manager/emp', {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setEmpName(data.data); // Populate patientName state
      } catch (error) {
        console.error('Error fetching patient data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, []);

  const getPatientName = (patient_id: number) => {
    const patient = patientName.find((pat) => pat.patient_id === patient_id);
    return patient
      ? `${patient.patient_name} ${patient.patient_surname}`
      : 'ບໍ່ພົບຊື່';
  };
  const getDoctorName = (emp_id: number) => {
    const emp = empName.find((employee) => employee.emp_id === emp_id);
    return emp ? `${emp.emp_name} ${emp.emp_surname}` : 'ບໍ່ພົບຊື່';
  };

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
          total={patients !== null ? `${patients} ຄົນ` : 'ກຳລັງໂຫຼດ...'}
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
        <CardDataStats
          title="ທ່ານຫມໍທັງໝົດ"
          total={loading ? 'ກຳລັງໂຫຼດ...' : `${doctorCount} ຄົນ`}
        >
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

      <div className="rounded bg-white pt-4 dark:bg-boxdark mt-8 shadow-lg">
        <div className="flex items-center justify-between border-b border-stroke px-4 pb-4 dark:border-strokedark">
          <h1 className="text-md md:text-lg lg:text-xl font-semibold text-strokedark dark:text-bodydark3">
            ຕາຕະລາງນັດໝາຍ
          </h1>
        </div>

        <div className="text-md text-strokedark dark:text-bodydark3">
          <div className="overflow-x-auto">
            <table className="w-full min-w-max table-auto border-collapse ">
              <thead>
                <tr className="border-b border-gray-300 bg-gray-100 text-left dark:bg-meta-4 bg-blue-100">
                  {FollowHeaders.map((header, index) => (
                    <th
                      key={index}
                      className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 "
                    >
                      {header.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((appointment, index) => (
                    <tr
                      key={index}
                      className="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="px-4 py-4">{appointment.appoint_id}</td>
                      <td className="px-4 py-4">
                        {getPatientName(appointment.patient_id)}{' '}
                        {/* Corrected here */}
                      </td>
                      <td className="px-4 py-4">
                        {new Date(appointment.date_addmintted).toLocaleString(
                          'lo-LA',
                          {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                          },
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
                            appointment.status === 'ກວດແລ້ວ'
                              ? 'bg-green-100 text-green-700'
                              : appointment.status === 'ລໍຖ້າ'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {getDoctorName(appointment.emp_id)}{' '}
                      </td>
                      <td className="px-4 py-4">{appointment.description}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={FollowHeaders.length}
                      className="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
                    >
                      ບໍ່ມີຂໍ້ມູນການນັດໝາຍ
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
