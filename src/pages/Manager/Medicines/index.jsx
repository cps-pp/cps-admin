import { useEffect, useState } from 'react';
import { iconAdd } from '@/configs/icon';
import Button from '@/components/Button';
import Search from '@/components/Forms/Search';
import { TableAction } from '@/components/Tables/TableAction';
import ConfirmModal from '@/components/Modal';
import { MedicinesHeaders } from './column/medicines';
import CreateMedicines from './create';
import EditMedicines from './edit';
import TablePaginationDemo from '@/components/Tables/Pagination_two';
import { openAlert } from '@/redux/reducer/alert';
import { useAppDispatch } from '@/redux/hook';
import Alerts from '@/components/Alerts';
import FilterSelect from './dropdowncate/filterselect';

const MedicinesPage = () => {
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedMedicineId, setSelectedMedicineId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddMedicinesModal, setShowAddMedicinesModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const dispatch = useAppDispatch();
  const [empName, setEmpName] = useState([]);

  const [existingIds, setExistingIds] = useState([]);
  const [createFormCloseHandler, setCreateFormCloseHandler] = useState(null);

  const [sortOrder, setSortOrder] = useState('asc');

  // เพิ่ม state สำหรับฟิลเตอร์สถานะ
  const [selectedStatus, setSelectedStatus] = useState('');

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        'http://localhost:4000/src/manager/medicines',
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setMedicines(data.data);
      setFilteredMedicines(data.data);
      // ✅ เก็บรหัสทั้งหมดไว้
      const ids = data.data.map((medicine) => medicine.med_id);
      setExistingIds(ids);
    } catch (error) {
      console.error('Error fetching medicines:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          'http://localhost:4000/src/manager/category',
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setCategories(data.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const applyFiltersWithData = (data = medicines) => {
    let filtered = [...data];

    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(
        (medicine) =>
          medicine.med_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          medicine.med_id.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (selectedCategory !== '') {
      filtered = filtered.filter(
        (medicine) => medicine.medtype_id === selectedCategory,
      );
    }

    if (selectedStatus !== '') {
      filtered = filtered.filter(
        (medicine) => medicine.status === selectedStatus,
      );
    }

    setFilteredMedicines(filtered);
    setPage(0);
  };

  const applyFilters = () => {
    applyFiltersWithData(medicines);
  };
  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedCategory, selectedStatus, medicines]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedStatus('');
  };

  const handleSortById = () => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newSortOrder);

    const sortedMedicines = [...medicines].sort((a, b) => {
      const extractNumber = (id) => {
        const match = id.match(/\d+/);
        return match ? parseInt(match[0]) : 0;
      };

      const numA = extractNumber(a.med_id);
      const numB = extractNumber(b.med_id);

      if (newSortOrder === 'asc') {
        return numA - numB;
      } else {
        return numB - numA;
      }
    });

    setMedicines(sortedMedicines);

    applyFiltersWithData(sortedMedicines);
  };

  const openDeleteModal = (id) => () => {
    setSelectedMedicineId(id);
    setShowModal(true);
  };

  const handleDeleteMedicine = async () => {
    if (!selectedMedicineId) return;

    try {
      const response = await fetch(
        `http://localhost:4000/src/manager/medicines/${selectedMedicineId}`,
        { method: 'DELETE' },
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Delete failed');
      }

      await fetchMedicines();
      dispatch(
        openAlert({
          type: 'success',
          title: 'ລົບຂໍ້ມູນສໍາເລັດ',
          message: 'ລົບຂໍ້ມູນສໍາເລັດແລ້ວ',
        }),
      );
    } catch (error) {
      console.error('Error deleting medicine:', error);
      dispatch(
        openAlert({
          type: 'error',
          title: 'ບໍ່ສາມດລົບຂໍ້ມູນໄດ້',
          message: error.message,
        }),
      );
    } finally {
      setShowModal(false);
      setSelectedMedicineId(null);
    }
  };

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:4000/src/manager/emp');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setEmpName(data.data);
      } catch (error) {
        console.error('Error fetching employee data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, []);

  const getDoctorName = (emp_id) => {
    const emp = empName.find((employee) => employee.emp_id === emp_id);
    return emp ? (
      <>
        {emp.emp_name} {emp.emp_surname}
      </>
    ) : (
      <span className="text-purple-600">-</span>
    );
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
      setShowAddMedicinesModal(false); // ✅ แก้ไขชื่อตัวแปรให้ถูกต้อง
    }
  };

  const paginatedMedicines = filteredMedicines.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const getTypeName = (medtype_id) => {
    const category = categories.find((cat) => cat.medtype_id === medtype_id);
    return category ? (
      category.type_name
    ) : (
      <span className="text-purple-600">ຍັງບໍ່ໄດ້ລະບຸປະເພດ</span>
    );
  };

  const handleEditMedicine = (id) => {
    // console.log('Edit clicked with ID:', id, 'Type:', typeof id);
    // console.log(
    //   'Medicine data for this ID:',
    //   medicines.find((m) => m.med_id === id),
    // );
    setSelectedId(id);
    setShowEditModal(true);
  };

  return (
    <>
      <div className="rounded bg-white pt-4 dark:bg-boxdark">
        <Alerts />

        <div className="flex items-center justify-between border-b border-stroke px-4 pb-4 dark:border-strokedark flex-wrap gap-2">
          <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3">
            ຈັດການຂໍ້ມູນຢາ ແລະ ອຸປະກອນ
          </h1>

          <div className="ml-auto flex flex-wrap items-center gap-x-2 gap-y-2">
            <Button
              onClick={() => setShowAddMedicinesModal(true)}
              icon={iconAdd}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              ເພີ່ມຂໍ້ມູນ
            </Button>
          </div>
        </div>

        {/* ✅ ส่วนของตัวกรอง (คัดลอกจาก ImportPage) */}
        <div className="grid w-full gap-4 p-4">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {/* Search Box */}
            <Search
              type="text"
              name="search"
              placeholder="ຄົ້ນຫາຊື່ຢາ..."
              className="rounded border border-stroke dark:border-strokedark"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            {/* ตัวกรองตามประเภทยา */}
            <select
              className="border border-stroke dark:border-strokedark rounded p-2"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">-- ກອງຕາມປະເພດຢາ --</option>
              {categories.map((category) => (
                <option key={category.medtype_id} value={category.medtype_id}>
                  {category.type_name}
                </option>
              ))}
            </select>

            {/* ตัวกรองตามสถานะ */}
            <select
              className="border border-stroke dark:border-strokedark rounded p-2"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">-- ກອງຕາມສະຖານະ --</option>
              <option value="ຍັງມີ">ຍັງມີ</option>
              <option value="ໝົດ">ໝົດ</option>
            </select>

            {/* ปุ่มล้างตัวกรอง */}
            <Button
              onClick={clearAllFilters}
              className="bg-graydark hover:bg-graydark"
            >
              ລ້າງຕົວກອງ
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto shadow-md">
          <table className="w-full min-w-max table-auto">
            <thead>
              <tr className="text-left bg-gray border border-stroke">
                {MedicinesHeaders.map((header, index) => (
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
              {paginatedMedicines.length > 0 ? (
                paginatedMedicines.map((medicine, index) => (
                  <tr
                    key={index}
                    className="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-4 py-4">{medicine.med_id}</td>
                    <td className="px-4 py-4">{medicine.med_name}</td>
                    <td className="px-4 py-4">{medicine.qty}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
                          medicine.status === 'ຍັງມີ'
                            ? 'bg-green-100 text-green-700'
                            : medicine.status === 'ໝົດ'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {medicine.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {(medicine.price * 1).toLocaleString()}
                    </td>
                    <td className="px-4 py-4">{medicine.unit}</td>
                    <td className="px-4 py-4">
                      {medicine?.expired &&
                      !isNaN(new Date(medicine.expired).getTime()) ? (
                        new Date(medicine.expired).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })
                      ) : (
                        <span className="text-purple-600">-</span>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`
      inline-block rounded-full px-3 py-1 text-sm font-medium
      ${getTypeName(medicine.medtype_id) === 'ຢາ' ? 'bg-green-100 text-form-strokedark' : ''}
      ${getTypeName(medicine.medtype_id) === 'ອຸປະກອນ' ? 'bg-yellow-100 text-form-strokedark' : ''}
    `}
                      >
                        {getTypeName(medicine.medtype_id)}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      {getDoctorName(medicine.emp_id_create)}{' '}
                    </td>
                    <td className="px-4 py-4">
                      {medicine?.created_at &&
                      !isNaN(new Date(medicine.created_at).getTime()) ? (
                        new Date(medicine.created_at).toLocaleDateString(
                          'en-GB',
                          {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          },
                        )
                      ) : (
                        <span className="text-purple-600">-</span>
                      )}
                    </td>

                    <td className="px-3 py-4 text-center">
                      <TableAction
                        onDelete={openDeleteModal(medicine.med_id)}
                        onEdit={() => handleEditMedicine(medicine.med_id)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={11} className="py-4 text-center text-gray-500">
                    ບໍ່ມີຂໍ້ມູນ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {showAddMedicinesModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="rounded w-full max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl relative overflow-auto max-h-[90vh]">
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

              <CreateMedicines
                setShow={setShowAddMedicinesModal}
                getList={fetchMedicines}
                existingIds={existingIds} // ✅ เพิ่มบรรทัดน
                onCloseCallback={setCreateFormCloseHandler} // ✅ ส่ง callback function
              />
            </div>
          </div>
        )}

        {showEditModal && selectedId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
            <div className="rounded w-full max-w-lg md:max-w-2xl lg:max-w-5xl relative overflow-auto max-h-[90vh]">
              <button
                onClick={() => setShowEditModal(false)}
                className="absolute top-4 right-2 text-gray-500 hover:text-gray-700"
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

              <EditMedicines
                id={selectedId}
                onClose={() => setShowEditModal(false)}
                setShow={setShowEditModal}
                getList={fetchMedicines}
              />
            </div>
          </div>
        )}
      </div>
      <TablePaginationDemo
        count={filteredMedicines.length}
        page={page}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
      />

      <ConfirmModal
        show={showModal}
        setShow={setShowModal}
        message="ທ່ານຕ້ອງການລົບຢານີ້ອອກຈາກລະບົບບໍ່？"
        handleConfirm={handleDeleteMedicine}
      />
    </>
  );
};

export default MedicinesPage;
