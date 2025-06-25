import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { iconAdd } from '@/configs/icon';
import Button from '@/components/Button';
import Search from '@/components/Forms/Search';
import { TableAction } from '@/components/Tables/TableAction';
import ConfirmModal from '@/components/Modal';
import Alerts from '@/components/Alerts';
import { DiseaseHeaders } from './column/disease';
import CreateDisease from './create';
import EditDisease from './edit';
import { openAlert } from '@/redux/reducer/alert';
import { useAppDispatch } from '@/redux/hook';
import TablePaginationDemo from '@/components/Tables/Pagination_two';

const DiseasePage = () => {
  const [diseases, setDiseases] = useState([]);
  const [filteredDiseases, setFilteredDiseases] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDiseaseId, setSelectedDiseaseId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddDiseaseModal, setShowAddDiseaseModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [existingIds, setExistingIds] = useState([]);
   // ✅ เก็บ reference ของ handleCloseForm จาก CreateCategory
    const [createFormCloseHandler, setCreateFormCloseHandler] = useState(null);

    // ✅ เพิ่ม state สำหรับการเรียงลำดับ ID
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' หรือ 'desc'


  const fetchDiseases = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:4000/src/manager/disease`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setDiseases(data.data);
      setFilteredDiseases(data.data);
      // ✅ เก็บรหัสทั้งหมดไว้
      const ids = data.data.map((disease) => disease.disease_id);
      setExistingIds(ids);

    } catch (error) {
      console.error('Error fetching diseases:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiseases();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredDiseases(diseases);
    } else {
      const filtered = diseases.filter((disease) =>
        disease.disease_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        disease.disease_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDiseases(filtered);
    }
  }, [searchQuery, diseases]);

  const openDeleteModal = (id) => () => {
    setSelectedDiseaseId(id);
    setShowModal(true);
  };

  // ✅ ฟังก์ชันสำหรับเรียงลำดับ ID (แก้ไขแล้ว)
const handleSortById = () => {
  const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
  setSortOrder(newSortOrder);
  
  const sortedDiseases = [...diseases].sort((a, b) => { // ✅ แก้จาก disease เป็น diseases
    const extractNumber = (id) => {
      const match = id.match(/\d+/);
      return match ? parseInt(match[0]) : 0;
    };

// ✅ แก้ไขส่วน TablePaginationDemo count ด้วย
// เปลี่ยนจาก count={paginatedDiease.length} เป็น count={filteredDiseases.length}
    
    const numA = extractNumber(a.disease_id);
    const numB = extractNumber(b.disease_id);
    
    if (newSortOrder === 'asc') {
      return numA - numB; 
    } else {
      return numB - numA; 
    }
  });
  
  setDiseases(sortedDiseases);
  
  if (searchQuery.trim() !== '') {
    const filtered = sortedDiseases.filter(disease =>
      disease.disease_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      disease.disease_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredDiseases(filtered);
  } else {
    setFilteredDiseases(sortedDiseases);
  }
};

  const handleDeleteDisease = async () => {
    if (!selectedDiseaseId) return;
    try {
      const response = await fetch(`http://localhost:4000/src/manager/disease/${selectedDiseaseId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      setDiseases((prev) => prev.filter((d) => d.disease_id !== selectedDiseaseId));
      setShowModal(false);
      setSelectedDiseaseId(null);

      dispatch(openAlert({
        type: 'success',
        title: 'ລົບຂໍ້ມູນສຳເລັດ',
        message: 'ລົບຂໍ້ມູນພະຍາດແຂ້ວສຳເລັດແລ້ວ',
      }));
    } catch (error) {
      dispatch(openAlert({
        type: 'error',
        title: 'ລົບຂໍ້ມູນບໍ່ສຳເລັດ',
        message: 'ເກີດຂໍ້ຜິດພາດໃນການລົບຂໍ້ມູນ',
      }));
    }
  };

  const handleEditDisease = (id) => {
    setSelectedId(id);
    setShowEditModal(true);
  };

  const handlePageChange = (event, newPage) => {
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
      setShowAddDiseaseModal(false); // ✅ แก้ไขชื่อตัวแปรให้ถูกต้อง
    }
  };

  const paginatedDiease = filteredDiseases.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <div className="rounded bg-white pt-4 dark:bg-boxdark">
        <Alerts />
        <div className="flex items-center justify-between border-b border-stroke px-4 pb-4 dark:border-strokedark">
          <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3">
            ຈັດການຂໍ້ມູນພະຍາດແຂ້ວ
          </h1>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowAddDiseaseModal(true)}
              icon={iconAdd}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              ເພີ່ມຂໍ້ມູນພະຍາດແຂ້ວ
            </Button>
          </div>
        </div>
        {/* Search */}
        <div className="grid w-full gap-4 p-4">
          <Search
            type="text"
            name="search"
            placeholder="ຄົ້ນຫາຊື່..."
            className="rounded border border-stroke dark:border-strokedark"
            onChange={(e) => {
              const query = e.target.value;
              setSearchQuery(query);
            }}
          />
        </div>

        <div className="overflow-x-auto  shadow-md">
          <table className="w-full min-w-max table-auto  ">
            <thead>
              <tr className="text-left  bg-gray border border-stroke">
                {DiseaseHeaders.map((header, index) => (
                  <th
                    key={index}
                    className={`px-4 py-3 tracking-wide font-semibold text-form-input ${
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
              {paginatedDiease.length > 0 ? (
                paginatedDiease.map((disease, index) => (
                  <tr
                    key={index}
                    className="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-4 py-4">{disease.disease_id}</td>
                    <td className="px-4 py-4">{disease.disease_name}</td>

                    <td className="px-3 py-4 text-center">
                      <TableAction
                        // onView={() => handleViewDisease(disease.disease_id)}
                        onDelete={openDeleteModal(disease.disease_id)}
                        onEdit={() => handleEditDisease(disease.disease_id)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-gray-500">
                    ບໍ່ມີຂໍ້ມູນ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {showAddDiseaseModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="rounded-lg w-full max-w-2xl relative px-4 ">
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

              <CreateDisease
                setShow={setShowAddDiseaseModal}
                getList={fetchDiseases}
                existingIds={existingIds} // ✅ เพิ่มบรรทัดน
                onCloseCallback={setCreateFormCloseHandler} // ✅ ส่ง callback function
              />
            </div>
          </div>
        )}

        {showEditModal && selectedId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
            <div className="rounded-lg w-full max-w-2xl bg-white relative ">
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

              <EditDisease
                id={selectedId}
                onClose={() => setShowEditModal(false)}
                setShow={setShowEditModal}
                getList={fetchDiseases}
              />
            </div>
          </div>
        )}
      </div>
      <TablePaginationDemo
        count={filteredDiseases.length}
        page={page}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
      />

      <ConfirmModal
        show={showModal}
        setShow={setShowModal}
        message="ທ່ານຕ້ອງການລົບພະຍາດອອກຈາກລະບົບບໍ່？"
        handleConfirm={handleDeleteDisease}
      /> 
    </>
  );
};

export default DiseasePage;
