import React from 'react';

interface Appointment {
  patientName: string;
  appointmentDate: string;
  status: string;
}

interface AppointCardProps {
  appointments: any[];
}

const AppointCard: React.FC<AppointCardProps> = ({ appointments }) => {
  const today = new Date().toISOString().split('T')[0]; // ใช้รูปแบบ YYYY-MM-DD
  const todaysAppointments = appointments.filter(
    (appointment) => appointment.appointmentDate === today
  );

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 w-full">
      {todaysAppointments.map((appointment, index) => (
        <div
          key={index}
          className="rounded-sm border border-stroke bg-white p-4 dark:border-strokedark dark:bg-boxdark"
        >
           <div className="flex items-center">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              {/* ไอคอนการนัดหมาย */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.7em"
                height="1.7em"
                viewBox="0 0 24 24"
                className="text-blue-500 dark:text-blue-300"
              >
                <g
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                >
                  <path d="M12 2v2h4v4h4v4h4v4h-4v4h-4v4h-4v-4h-4v-4h-4v-4h4v-4h4V2h4z" />
                </g>
              </svg>
            </div>
            <div className="ml-4">
              <h6 className="text-md font-medium text-gray-500 dark:text-gray-400">
                {appointment.patientName}
              </h6>
              <p className="text-lg font-bold text-strokedark dark:text-white">
                {appointment.appointmentDate}
              </p>
              <p className="text-md font-medium text-gray-500 dark:text-gray-400">
                สถานะ: {appointment.status}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AppointCard;
