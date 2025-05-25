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
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showAddMedicinesModal, setShowAddMedicinesModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const dispatch = useAppDispatch();
  const [empName, setEmpName] = useState([]);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/src/manager/medicines');

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setMedicines(data.data);
      setFilteredMedicines(data.data);
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
        const response = await fetch('http://localhost:4000/src/manager/category');

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

  useEffect(() => {
    let filtered = medicines;

    if (searchQuery.trim() !== '') {
      filtered = filtered.filter((medicine) =>
        medicine.med_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        (medicine) => medicine.medtype_id.toString() === selectedCategory
      );
    }

    setFilteredMedicines(filtered);
    setPage(0);
  }, [searchQuery, selectedCategory, medicines]);

  const openDeleteModal = (id) => () => {
    setSelectedMedicineId(id);
    setShowModal(true);
  };

  const handleDeleteMedicine = async () => {
    if (!selectedMedicineId) return;

    try {
      const response = await fetch(
        `http://localhost:4000/src/manager/medicines/${selectedMedicineId}`,
        { method: 'DELETE' }
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Delete failed');
      }

      setMedicines((prev) => prev.filter((m) => m.med_id !== selectedMedicineId));
      setFilteredMedicines((prev) => prev.filter((m) => m.med_id !== selectedMedicineId));

      dispatch(
        openAlert({
          type: 'success',
          title: 'ລົບຂໍ້ມູນສຳເລັດ',
          message: 'ລົບຂໍ້ມູນສຳເລັດແລ້ວ',
        })
      );
    } catch (error) {
      console.error('Error deleting medicine:', error);
      dispatch(
        openAlert({
          type: 'error',
          title: 'ລົບຂໍ້ມູນບໍ່ສຳເລັດ',
          message: error.message,
        })
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

  const paginatedMedicines = filteredMedicines.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
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
    setSelectedId(id);
    setShowEditModal(true);
  };

  const categoryOptions = [
    { value: 'all', label: 'ປະເພດຢາທັງໝົດ' },
    ...categories.map((cat) => ({
      value: cat.medtype_id.toString(),
      label: cat.type_name,
    })),
  ];
  return (
    <>
      <div className="rounded bg-white pt-4 dark:bg-boxdark">
        <Alerts />

        <div className="flex items-center justify-between border-b border-stroke px-4 pb-4 dark:border-strokedark">
          <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3">
            ຈັດການຂໍ້ມູນຢາ ແລະ ອຸປະກອນ
          </h1>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowAddMedicinesModal(true)}
              icon={iconAdd}
              className="bg-primary"
            >
              ເພີ່ມຂໍ້ມູນ
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-4 p-4">
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

          <FilterSelect
            name="categoryFilter"
            options={categoryOptions}
            value={selectedCategory}
            placeholder="ເລືອກປະເພດຢາ"
            className="rounded border border-stroke dark:border-strokedark"
            onChange={(e) => {
              const selectedId = e.target.value;
              console.log('Selected category:', selectedId);

              selectedId && setSelectedCategory(selectedId);
            }}
          />
        </div>

        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="w-full min-w-max table-auto border-collapse overflow-hidden rounded-lg">
            <thead>
              <tr className="text-left bg-secondary2 text-white">
                {MedicinesHeaders.map((header, index) => (
                  <th
                    key={index}
                    className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300"
                  >
                    {header.name}
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
                    <td className="px-4 py-4">
                      {new Date(medicine.expired).toLocaleDateString('en-US', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-4">
                      {getTypeName(medicine.medtype_id)}
                    </td>
                    <td className="px-4 py-4">
                      {getDoctorName(medicine.emp_id_create)}{' '}
                    </td>
                      <td className="px-4 py-4">
                      {medicine?.created_at &&
                      !isNaN(new Date(medicine.created_at).getTime()) ? (
                        new Date(medicine.created_at).toLocaleDateString('th-TH', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })
                      ) : (
                        <span className="text-purple-600">-</span>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      {getDoctorName(medicine?.emp_id_updated)}
                      {''}
                    </td>
                    <td className="px-4 py-4">
                      {medicine?.update_by &&
                      !isNaN(new Date(medicine.update_by).getTime()) ? (
                        new Date(medicine.update_by).toLocaleDateString('th-TH', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })
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
                  <td colSpan={8} className="py-4 text-center text-gray-500">
                    ບໍ່ມີຂໍ້ມູນ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {showAddMedicinesModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
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
                onClick={() => setShowAddMedicinesModal(false)}
                className="absolute px-4 top-3 right-3 text-gray-500 hover:text-gray-700"
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
        lg:max-w-5xl       
        relative
        overflow-auto
        max-h-[90vh]"
            >
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
        count={paginatedMedicines.length}
        page={page}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
      />

      {/* <ConfirmModal
        show={showModal}
        setShow={setShowModal}
        message="ທ່ານຕ້ອງການລົບຢານີ້ອອກຈາກລະບົບບໍ່？"
        handleConfirm={handleDeleteMedicine}
      /> */}
    </>
  );
};

export default MedicinesPage;
