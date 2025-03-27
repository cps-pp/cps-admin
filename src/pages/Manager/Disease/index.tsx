import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { iconAdd, iconCalendar } from '@/configs/icon';
import Button from '@/components/Button';
import Search from '@/components/Forms/Search';
import {OralHeaders } from './column/medicines';


const DiseasePage: React.FC = () => {
  const [patients, setPatients] = useState<any[]>([]);  // Ensure patients data is stored in state
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { control, watch } = useForm();
  const [selectedPatients, setSelectedPatients] = useState<string[]>([]);
  const [selectedBox, setSelectedBox] = useState<string[]>([]);
  const selectedDateRange = watch('appointment_date');

  const openDeleteModal = (ids: string) => () => {
    setSelectedBox([ids]);
    setShowModal(true);
  };

  const handleSelectPatient = (e: React.ChangeEvent<HTMLInputElement>, patientId: string) => {
    setSelectedPatients((prevSelected) =>
      e.target.checked ? [...prevSelected, patientId] : prevSelected.filter((id) => id !== patientId),
    );
  };

  return (
    <div className="rounded-xl bg-white pt-4 dark:bg-boxdark">
      <div className="flex items-center justify-between border-b border-stroke px-4 pb-4 dark:border-strokedark">
        <h1 className="text-xl font-bold">ຈັດການຂໍ້ມູນພະຍາດແຂ້ວ</h1>
        <div className="flex items-center gap-2">
          
          <Button onClick={() => navigate('/patient/create')} icon={iconAdd} className="bg-primary">
            ເພີ່ມຂໍ້ມູນພະຍາດແຂ້ວ
          </Button>
        </div>
      </div>

      <div className="grid w-full  gap-4 p-4">
        <Search
          type="text"
          name="search"
          placeholder="ຄົ້ນຫາຊື່ພະຍາດແຂ້ວ"
          className="rounded border-stroke"
        />

      
      </div>

      {/* <div className="text-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max table-auto">
            <thead>
              <tr className="border-b border-gray-300 bg-gray-2 text-left dark:bg-meta-4">
                {OralHeaders.map((header, index) => (
                  <th key={index} className="px-4 py-4 font-normal text-primarySecond dark:font-medium border-b border-stroke dark:text-gray-500">
                    {header.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {patients.length > 0 ? (
                patients.map((patient, index) => (
                  <tr key={index} className="border-b border-stroke dark:border-strokedark">
                    <td className="p-4 px-4">
                      <input
                        className="h-5 w-5"
                        type="checkbox"
                        onChange={(e) => handleSelectPatient(e, patient.patient_id.toString())}
                        checked={selectedPatients.includes(patient.patient_id.toString())}
                      />
                    </td>
                    <td className="px-4">{`${patient.patient_name} ${patient.patient_surname}`}</td>
                    <td className="px-4">{patient.phone1}</td>
                    <td className="px-4">{patient.dob}</td> 
                    <td className="px-4">{patient.gender}</td>
                    <td className="px-10">
                      <button onClick={openDeleteModal(patient.patient_id.toString())} className="text-red-500">
                        ລົບ
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-gray-500">
                    ບໍ່ມີຂໍ້ມູນ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div> */}
    </div>
  );
};

export default DiseasePage;
