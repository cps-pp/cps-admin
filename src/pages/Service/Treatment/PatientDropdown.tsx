import { FC } from 'react';

type Patient = {
  patient_id: string;
  patient_name: string;
  patient_surname:string;
};

type PatientDropdownProps = {
  patients: Patient[];
  onSelect: (patient: Patient) => void;
};

const PatientDropdown: FC<PatientDropdownProps> = ({ patients, onSelect }) => {
  if (patients.length === 0) return null;

  return (
    <div
      className={`
        absolute z-50 w-full left-0
        transition-all duration-300 origin-top
        ${patients.length > 0 ? 'scale-y-100 opacity-100' : 'scale-y-95 opacity-0 pointer-events-none'}
      `}
      style={{ transformOrigin: 'top' }}
    >
      <ul className="bg-white dark:bg-form-input border border-bodydark1 dark:border-gray-700 rounded mt-1 shadow max-h-60 overflow-auto ">
        {patients.map((patient) => (
          <li
            key={patient.patient_id}
            onClick={() => onSelect(patient)}
            className="px-4 py-2 text-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
          >
            {patient.patient_id} - {patient.patient_name} - {patient.patient_surname}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PatientDropdown;
