import React from 'react';



const PatientStatsCard = ({ patients }) => {
  // Calculate total number of patients
  const totalPatients = patients.length;

  // Calculate patients by gender
  const malePatients = patients.filter(
    (patient) => patient.gender === 'ຊາຍ',
  ).length;
  const femalePatients = patients.filter(
    (patient) => patient.gender === 'ຍິງ',
  ).length;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 2xl:gap-7.5 w-f">
      <div className="rounded-sm border border-stroke bg-white p-4  dark:border-strokedark dark:bg-boxdark">
        <div className="flex items-center">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-Third dark:bg-secondary">
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
          </div>
     
          <div className="ml-4">
            <h6 className="text-lg font-semibold text-strokedark">
              ຄົນເຈັບທັງໝົດ
            </h6>
            <p className="text-xl font-bold text-primary">
              {totalPatients} ຄົນ
            </p>
          </div>
        </div>
      </div>

      {/* Male Patients Card */}
      <div className="rounded-sm border border-stroke bg-white p-4  dark:border-strokedark dark:bg-boxdark">
        <div className="flex items-center">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full  bg-Third dark:bg-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1.7em"
              height="1.7em"
              viewBox="0 0 24 24"
              className="text-primary dark:text-white"
            >
              <path
                fill="currentColor"
                d="M16 2v2h3.586L16 7.586A6.963 6.963 0 0 0 12 6c-3.866 0-7 3.134-7 7s3.134 7 7 7s7-3.134 7-7a6.963 6.963 0 0 0-1.586-4l4.414-4.414V8h2V2h-6zm-4 16c-2.761 0-5-2.239-5-5s2.239-5 5-5s5 2.239 5 5s-2.239 5-5 5z"
              />
            </svg>
          </div>
          <div className="ml-4">
             <h6 className="text-lg font-semibold text-strokedark">
              ຄົນເຈັບເພດຊາຍ
            </h6>
            <p className="text-xl font-bold text-primary">
              {malePatients} ຄົນ
            </p>
          </div>
        </div>
      </div>

      {/* Female Patients Card */}
      <div className="rounded-sm border border-stroke bg-white p-4  dark:border-strokedark dark:bg-boxdark">
        <div className="flex items-center">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full  bg-Third dark:bg-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1.9em"
              height="1.9em"
              className="fill-current text-primary dark:text-white"
              viewBox="0 0 24 24"
            >
              <title>gender-female</title>
              <path d="M12,4A6,6 0 0,1 18,10C18,12.97 15.84,15.44 13,15.92V18H15V20H13V22H11V20H9V18H11V15.92C8.16,15.44 6,12.97 6,10A6,6 0 0,1 12,4M12,6A4,4 0 0,0 8,10A4,4 0 0,0 12,14A4,4 0 0,0 16,10A4,4 0 0,0 12,6Z" />
            </svg>
          </div>
          <div className="ml-4">
             <h6 className="text-lg font-semibold text-strokedark">
              ຄົນເຈັບເພດຍິງ
            </h6>
            <p className="text-xl font-bold text-primary">
              {femalePatients} ຄົນ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientStatsCard;
