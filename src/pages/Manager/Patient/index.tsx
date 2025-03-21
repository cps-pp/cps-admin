import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PatientHeaders } from './column/patient';
import { iconAdd } from '@/configs/icon';
import Button from '@/components/Button';
import Search from '@/components/Forms/Search';
import axiosCreate from '@/api/axios';
import { TableAction } from '@/components/Tables/TableAction';
import ConfirmModal from '@/components/Modal';
import Alerts from '@/components/Alerts';

const PatientPage: React.FC = () => {
  const [patients, setPatients] = useState<any[]>([]); // Data ของผู้ป่วย
  const [filteredPatients, setFilteredPatients] = useState<any[]>([]); // Data ที่กรองแล้ว
  const [showModal, setShowModal] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(''); // ค่าของการค้นหาที่ผู้ใช้ป้อน
  const navigate = useNavigate();
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
        console.log('Data received:', data); // Debugging
        setPatients(data.data); // บันทึกข้อมูลผู้ป่วย
        setFilteredPatients(data.data); // เริ่มต้นให้ผลลัพธ์เป็นทั้งหมด
      } catch (error) {
        console.error('Error fetching patients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const openDeleteModal = (id: string) => () => {
    setSelectedPatientId(id);
    setShowModal(true); // เปิด modal การยืนยันการลบ
  };

  const handleDeletePatient = async () => {
    if (!selectedPatientId) return;

    try {
      const response = await fetch(
        `http://localhost:4000/manager/patient/${selectedPatientId}`,
        {
          method: 'DELETE',
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setPatients((prevPatients) =>
        prevPatients.filter(
          (patient) => patient.patient_id !== selectedPatientId,
        ),
      );
      setFilteredPatients((prevPatients) =>
        prevPatients.filter(
          (patient) => patient.patient_id !== selectedPatientId,
        ),
      );
      setShowModal(false);
    } catch (error) {
      console.error('Error deleting patient:', error);
    }
  };

  const handleSearch = async (query: string) => {
    try {
      const response = await fetch(
        `http://localhost:4000/manager/search/patient?patient_name=${query}&patient_surname=${query}&village=${query}&province=${query}&district=${query}`,
        {
          method: 'GET',
        }
      );

      if (response.ok) {
        const data = await response.json();
        setFilteredPatients(data.data); 
      } else {
        console.error('Error searching patients:', response.statusText);
      }
    } catch (error) {
      console.error('Error searching patients:', error);
    }
  };

  const handleEditPatient = (id: string) => {
    navigate(`/patient/edit/${id}`);
  };
  const handleViewPatient = (id: string) => {
    navigate(`/patient/detail/${id}`); // Directly navigate without fetching details
  };

  return (
    <div className="rounded bg-white pt-4 dark:bg-boxdark">
      <div className="flex items-center justify-between border-b border-stroke px-4 pb-4 dark:border-strokedark">
        <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3">ຈັດການຂໍ້ມູນຄົນເຈັບ</h1>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => navigate('/patient/create')}
            icon={iconAdd}
            className="bg-primary"
          >
            ເພີ່ມຂໍ້ມູນຜູ່ປ່ວຍ
          </Button>
        </div>
      </div>

      <div className="grid w-full gap-4 p-4">
        <Search
          type="text"
          name="search"
          placeholder="ຄົ້ນຫາຊື່ ຫຼື ເບີໂທຜູ້ປ່ວຍ..."
          className="rounded border border-stroke dark:border-strokedark"
          // value={searchQuery}
          onChange={(e) => {
            const query = e.target.value;
            setSearchQuery(query);
            handleSearch(query); // Trigger search on input change
          }}
        />
      </div>

      <div className="text-md text-strokedark dark:text-bodydark3" >
        <div className="overflow-x-auto">
          <table className="w-full min-w-max table-auto border-collapse ">
            <thead>
              <tr className="border-b border-gray-300 bg-gray-100 text-left dark:bg-meta-4 bg-blue-100">
                {PatientHeaders.map((header, index) => (
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
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient, index) => (
                  <tr
                    key={index}
                    className="border-b border-stroke dark:border-strokedark  hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    {/* <td className="px-4 py-4">{patient.patient_id}</td> */}
                    <td className="px-4 py-4">{patient.patient_name}</td>
                    <td className="px-4 py-4">{patient.patient_surname}</td>
                    <td className="px-4 py-4">{patient.gender}</td>
                    <td className="px-4 py-4">
                      {new Date(patient.dob).toLocaleDateString('th-TH', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-4">{patient.village}</td>
                    <td className="px-4 py-4">{patient.district}</td>
                    <td className="px-4 py-4">{patient.province}</td>
                    <td className="px-4 py-4">{patient.phone1}</td>
                    <td className="px-4 py-4">{patient.phone2}</td>
                    <td className="px-3 py-4 text-center">
                      <TableAction
                        onView={() => handleViewPatient(patient.patient_id)}
                        onDelete={openDeleteModal(patient.patient_id)} // Pass patient id
                        onEdit={() => handleEditPatient(patient.patient_id)} // Pass patient id
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-gray-500">
                    ບໍ່ມີຂໍ້ມູນທທ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        show={showModal}
        setShow={setShowModal}
        message="ທ່ານຕ້ອງການລົບຄົນເຈັບນີ້ອອກຈາກລະບົບບໍ່？"
        handleConfirm={handleDeletePatient} // Handle deletion on confirm
      />
    </div>
  );
};

export default PatientPage;
