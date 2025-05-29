import React, { useEffect, useState } from 'react';
import CardDataStats from '../components/CardDataStats';
import MonthChart from '../components/Charts/MonthChart';
import { getAppointments } from '@/api/getAppointments';

const Dashboard = () => {
  const [patients, setPatients] = useState(null);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [patientName, setPatientName] = useState([]);
  const [empName, setEmpName] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [doneCount, setDoneCount] = useState(0);
  const [waitingCount, setWaitingCount] = useState(0);
  const [doctorCount, setDoctorCount] = useState(0);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          'http://localhost:4000/src/manager/patient',
        );
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
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
        const response = await fetch('http://localhost:4000/src/manager/emp');
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
      setDoneCount(data.filter((item) => item.status === 'ກວດແລ້ວ').length);
      setWaitingCount(data.filter((item) => item.status === 'ລໍຖ້າ').length);
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          'http://localhost:4000/src/manager/patient',
        );
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setPatientName(data.data);
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
        const response = await fetch('http://localhost:4000/src/manager/emp');
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setEmpName(data.data);
      } catch (error) {
        console.error('Error fetching doctor data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, []);

  const getPatientName = (patient_id) => {
    const patient = patientName.find((pat) => pat.patient_id === patient_id);
    return patient
      ? `${patient.patient_name} ${patient.patient_surname}`
      : 'ບໍ່ພົບຊື່';
  };

  const getDoctorName = (emp_id) => {
    const emp = empName.find((employee) => employee.emp_id === emp_id);
    return emp ? `${emp.emp_name} ${emp.emp_surname}` : 'ບໍ່ພົບຊື່';
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats title="ລາຍຮັບທັງໝົດ" total="60,000,000 ກີບ">
          <svg
            className="w-6 h-6 text-primary dark:text-white"
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
            className="w-9 h-6 text-primary dark:text-white"
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
            className="text-primary dark:text-white"
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
          title="ຄົນເຈັບທັງໝົດ"
          total={patients !== null ? `${patients} ຄົນ` : 'ກຳລັງໂຫຼດ...'}
        >
          <svg xmlns="http://www.w3.org/2000/svg"
            className="text-primary dark:text-white"
            width="1.7em"
            height="1.7em"
            viewBox="0 0 24 24"
          >
            <path d="M14.84,16.26C17.86,16.83 20,18.29 20,20V22H4V20C4,18.29 6.14,16.83 9.16,16.26L12,21L14.84,16.26M8,8H16V10A4,4 0 0,1 12,14A4,4 0 0,1 8,10V8M8,7L8.41,2.9C8.46,2.39 8.89,2 9.41,2H14.6C15.11,2 15.54,2.39 15.59,2.9L16,7H8M12,3H11V4H10V5H11V6H12V5H13V4H12V3Z" />
          </svg>
         
        </CardDataStats>
      </div>
      <div className="mb-4 mt-6">
        <MonthChart
          appointments={filteredAppointments}
          getPatientName={getPatientName}
          getDoctorName={getDoctorName}
        />
      </div>
      <div className="mb-4 mt-6"></div>
    </>
  );
};

export default Dashboard;
