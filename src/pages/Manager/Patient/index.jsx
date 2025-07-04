import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PatientHeaders } from './column/patient';
import { iconAdd } from '@/configs/icon';
import Button from '@/components/Button';
import { TableAction } from '@/components/Tables/TableAction';
import ConfirmModal from '@/components/Modal';
import Alerts from '@/components/Alerts';
import PatientStatsCard from './column/PatientStatsCard';
import CreatePatient from './create';
import EditPatient from './edit';
import TablePaginationDemo from '@/components/Tables/Pagination_two';
import { useAppDispatch } from '@/redux/hook';
import { openAlert } from '@/redux/reducer/alert';
import SearchBox from '../../../components/Forms/Search_New';
import { Empty } from 'antd';

const PatientPage = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [existingIds, setExistingIds] = useState([]);
  const [existingPhones1, setExistingPhones1] = useState([]);
  const [existingPhones2, setExistingPhones2] = useState([]);
  // ✅ เก็บ reference ของ handleCloseForm จาก CreateCategory
  const [createFormCloseHandler, setCreateFormCloseHandler] = useState(null);
  
  // ✅ เพิ่ม state สำหรับการเรียงลำดับ ID (คัดลอกจาก CategoryPage)
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' หรือ 'desc'

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/src/manager/patientP');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setPatients(data.data);
      setFilteredPatients(data.data);
      // ✅ เก็บรหัสทั้งหมดไว้
      const ids = data.data.map((patient) => patient.patient_id);
      const phones1 = data.data.map((patient) => patient.phone1); // เพิ่มตรงนี้
      const phones2 = data.data.map((patient) => patient.phone2); // เพิ่มตรงนี้
      setExistingIds(ids);
      setExistingPhones1(phones1); // <- ต้องเพิ่ม state นี้ด้วย
      setExistingPhones2(phones2); // <- ต้องเพิ่ม state นี้ด้วย
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);
  
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPatients(patients);
    } else {
      const filtered = patients.filter((patient) => 
        patient.patient_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.patient_surname.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPatients(filtered);
    }
  }, [searchQuery, patients]);

  // ✅ ฟังก์ชันสำหรับเรียงลำดับ ID (คัดลอกจาก CategoryPage)
  const handleSortById = () => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newSortOrder);
    
    const sortedPatients = [...patients].sort((a, b) => {
      const extractNumber = (id) => {
        const match = id.match(/\d+/);
        return match ? parseInt(match[0]) : 0;
      };
      
      const numA = extractNumber(a.patient_id);
      const numB = extractNumber(b.patient_id);
      
      if (newSortOrder === 'asc') {
        return numA - numB; 
      } else {
        return numB - numA; 
      }
    });
    
    setPatients(sortedPatients);
    
    if (searchQuery.trim() !== '') {
      const filtered = sortedPatients.filter((patient) => {
        const patientDataString = Object.values(patient)
          .filter((v) => v !== null && v !== undefined)
          .map((v) => String(v).toLowerCase())
          .join(' ');

        return patientDataString.includes(searchQuery.toLowerCase());
      });
      setFilteredPatients(filtered);
    } else {
      setFilteredPatients(sortedPatients);
    }
  };

  const openDeleteModal = (id) => () => {
    setSelectedPatientId(id);
    setShowModal(true);
  };

  const handleDeletePatient = async () => {
    if (!selectedPatientId) return;

    try {
      const response = await fetch(
        `http://localhost:4000/src/manager/patient/${selectedPatientId}`,
        { method: 'DELETE' },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setPatients((prev) =>
        prev.filter((p) => p.patient_id !== selectedPatientId),
      );
      setFilteredPatients((prev) =>
        prev.filter((p) => p.patient_id !== selectedPatientId),
      );
      setShowModal(false);

      dispatch(
        openAlert({
          type: 'success',
          title: 'ລົບຂໍ້ມູນສຳເລັດ',
          message: 'ລົບຂໍ້ມູນຄົນເຈັບສຳເລັດແລ້ວ',
        }),
      );
    } catch (error) {
      dispatch(
        openAlert({
          type: 'error',
          title: 'ລົບຂໍ້ມູນບໍ່ສຳເລັດ',
          message: 'ເກີດຂໍ້ຜິດພາດໃນການລົບຂໍ້ມູນ',
        }),
      );
    }
  };

  const handleEdit = (id) => {
    setSelectedId(id);
    setShowEditModal(true);
  };

  const handlePageChange = (_, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // ✅ Handler สำหรับปุ่ม X ที่จะใช้ฟังก์ชันจาก CreateCategory
  const handleCloseAddModal = () => {
    if (createFormCloseHandler) {
      // เรียกใช้ฟังก์ชันที่ได้รับมาจาก CreateCategory
      createFormCloseHandler();
    } else {
      // fallback ถ้าไม่มี handler
      setShowAddModal(false); // ✅ แก้ไขชื่อตัวแปรให้ถูกต้อง
    }
  };

  const paginatedPatients = filteredPatients.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );
  const navigate = useNavigate();

  const handleViewPatient = (id) => {
    navigate(`/patient/detail/${id}`);
  };

  return (
    <>
      <div className="pb-4">
        <Alerts />
        <PatientStatsCard patients={filteredPatients} />
      </div>
      <div className="rounded bg-white pt-4 dark:bg-boxdark">
        <div className="flex items-center justify-between border-b border-stroke px-4 pb-4 dark:border-strokedark">
          <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark ">
            ຈັດການຂໍ້ມູນຄົນເຈັບ
          </h1>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowAddModal(true)}
              icon={iconAdd}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              ເພີ່ມຂໍ້ມູນຜູ່ປ່ວຍ
            </Button>
          </div>
        </div>

        <div className="grid w-full gap-4 p-4">
          <SearchBox
            type="text"
            name="search"
            placeholder="ຄົ້ນຫາຊື່..."
            className="rounded border border-stroke dark:border-strokedark"
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
          />
        </div>

        <div className="overflow-x-auto  shadow-md">
          <table className="w-full min-w-max table-auto  ">
            <thead>
              <tr className="text-left bg-gray border border-stroke ">
                {PatientHeaders.map((header, index) => (
                  <th
                    key={index}
                    className={`px-4 py-3 tracking-wide text-form-input font-semibold ${
                      header.id === 'id'
                        ? 'cursor-pointer hover:bg-gray-100 hover:text-gray-800 select-none'
                        : ''
                    }`}
                    onClick={header.id === 'id' ? handleSortById : undefined}
                  >
                    <div className="flex items-center gap-2">
                      {header.name}
                      {header.id === 'id' && (
                        <span
                          className={`ml-1 inline-block text-md font-semibold transition-colors duration-200 ${
                            sortOrder === 'asc'
                              ? 'text-green-500'
                              : 'text-black'
                          }`}
                        >
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedPatients.length > 0 ? (
                paginatedPatients.map((patient, index) => (
                  <tr key={index} className="text-left  border border-stroke">
                    <td className="px-4 py-4  ">{patient.patient_id}</td>
                    <td className="px-4 py-3 ">{patient.patient_name}</td>
                    <td className="px-4 py-3 ">{patient.patient_surname}</td>
                    <td className="px-4 py-3  ">{patient.gender}</td>
                    <td className="px-4 py-3  ">
                      {new Date(patient.dob).toLocaleDateString('en-US', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-3 ">{patient.village}</td>
                    <td className="px-4 py-3 ">{patient.district}</td>
                    <td className="px-4 py-3 ">{patient.province}</td>
                    <td className="px-4 py-3 ">{patient.phone1}</td>
                    <td className="px-4 py-3 ">{patient.phone2}</td>
                    <td className="px-4 py-3  ">
                      <TableAction
                        onDelete={openDeleteModal(patient.patient_id)}
                        onEdit={() => handleEdit(patient.patient_id)}
                        onView={() => handleViewPatient(patient.patient_id)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={11} className="px-4 py-6  text-gray-500">
                     <div className="text-center ">
                      <div className="w-32 h-32 flex items-center justify-center mx-auto">
                        <Empty description={false} />
                      </div>
                      <p className="text-lg">ບໍ່ພົບຂໍ້ມູນ</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
            <div
              className="    rounded
        w-full max-w-lg     
        md:max-w-2xl        
        lg:max-w-4xl 
        xl:max-w-5xl      
        relative
        overflow-auto
        max-h-[90vh]"
            >
              {/* ✅ ปุ่ม X ที่ใช้ฟังก์ชันป้องกันจาก CreateCategory */}
              <button
                onClick={handleCloseAddModal}
                className="absolute px-4 top-3 right-3 text-gray-500 hover:text-gray-700 z-10"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <CreatePatient
                setShow={setShowAddModal}
                getList={fetchPatients}
                existingIds={existingIds} // ✅ เพิ่มบรรทัดน
                existingPhones1={existingPhones1}
                existingPhones2={existingPhones2}
                onCloseCallback={setCreateFormCloseHandler} // ✅ ส่ง callback function
              />
            </div>
          </div>
        )}

        {showEditModal && selectedId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
            <div
              className="    rounded
        w-full max-w-lg     
        md:max-w-2xl        
       lg:max-w-4xl 
        xl:max-w-5xl      
        relative
        overflow-auto
        max-h-[90vh]"
            >
              <button
                onClick={() => setShowEditModal(false)}
                className="absolute  top-4 right-2 text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <EditPatient
                id={selectedId}
                onClose={() => setShowEditModal(false)}
                setShow={setShowEditModal}
                getList={fetchPatients}
                
              />
            </div>
          </div>
        )}
      </div>
      <TablePaginationDemo
        count={filteredPatients.length}
        page={page}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
      <ConfirmModal
        show={showModal}
        setShow={setShowModal}
        message="ທ່ານຕ້ອງການລົບຄົນເຈັບນີ້ອອກຈາກລະບົບບໍ່？"
        handleConfirm={handleDeletePatient} // Handle deletion on confirm
      />
    </>
  );
};

export default PatientPage;

