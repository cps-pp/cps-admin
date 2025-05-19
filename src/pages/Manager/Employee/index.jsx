import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import Search from '@/components/Forms/Search';
import { TableAction } from '@/components/Tables/TableAction';
import ConfirmModal from '@/components/Modal';
import { iconAdd } from '@/configs/icon';
import { EmpHeaders } from './column/emp';
import CreatePatient from './CreateEmp';
import CreateEmployee from './CreateEmp';
import TablePaginationDemo from '@/components/Tables/Pagination_two';
import { useAppDispatch } from '@/redux/hook';
import { openAlert } from '@/redux/reducer/alert';
import Alerts from '@/components/Alerts';
import EditEmployee from './EditEmp';
import Loader from '@/common/Loader';


const EmployeePage = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedEmpId, setSelectedEmpId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const dispatch = useAppDispatch();

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/src/manager/emp');
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setEmployees(data.data);
      setFilteredEmployees(data.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter((emp) =>
        emp.emp_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.emp_surname.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredEmployees(filtered);
    }
  }, [searchQuery, employees]);

  const openDeleteModal = (id) => () => {
    setSelectedEmpId(id);
    setShowModal(true);
  };

  const handleDeleteEmployee = async () => {
    if (!selectedEmpId) return;
    try {
      const response = await fetch(
        `http://localhost:4000/src/manager/emp/${selectedEmpId}`,
        { method: 'DELETE' }
      );
      if (!response.ok) throw new Error('ບໍ່ສາມາດລົບທ່ານຫມໍໄດ້');

      setEmployees((prev) => prev.filter((emp) => emp.emp_id !== selectedEmpId));
      setShowModal(false);
      setSelectedEmpId(null);
      dispatch(openAlert({
        type: 'success',
        title: 'ລົບຂໍ້ມູນສຳເລັດ',
        message: 'ລົບຂໍ້ມູນພະນັກງານສຳເລັດແລ້ວ',
      }));
    } catch (error) {
      dispatch(openAlert({
        type: 'error',
        title: 'ລົບຂໍ້ມູນບໍ່ສຳເລັດ',
        message: 'ເກີດຂໍ້ຜິດພາດໃນການລົບຂໍ້ມູນ',
      }));
    }
  };

  const handleEdit = (id) => {
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

  const paginatedEmp = filteredEmployees.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) return <Loader />;

  return (
        <>
    <div className="rounded bg-white pt-4 dark:bg-boxdark">
      <Alerts />

      <div className="flex items-center justify-between border-b border-stroke px-4 pb-4 dark:border-strokedark">
        <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3">
          ຈັດການຂໍ້ມູນພະນັກງານ
        </h1>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowAddModal(true)}
            icon={iconAdd}
            className="bg-primary"
          >
            ເພີ່ມພະນັກງານ
          </Button>
        </div>
      </div>

      <div className="grid w-full gap-4 p-4">
        <Search
          type="text"
          name="search"
          placeholder="ຄົ້ນຫາຊື່..."
          className="rounded border border-stroke dark:border-strokedark"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="w-full min-w-max table-auto border-collapse overflow-hidden rounded-lg">
            <thead>
              <tr className="text-left bg-secondary2 text-white">
                {EmpHeaders.map((header, index) => (
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
              {paginatedEmp.length > 0 ? (
                paginatedEmp.map((emp, index) => (
                  <tr
                    key={index}
                    className="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-4 py-4">{emp.emp_id}</td>
                    <td className="px-4 py-4">{emp.emp_name}</td>
                    <td className="px-4 py-4">{emp.emp_surname}</td>
                    <td className="px-4 py-4">{emp.gender}</td>
                    <td className="px-4 py-4">
                      {new Date(emp.dob).toLocaleDateString('th-TH', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-4">{emp.phone}</td>
                    <td className="px-4 py-4">{emp.address}</td>
                    <td className="px-4 py-4">{emp.role}</td>

                    <td className="px-3 py-4 text-center">
                      <TableAction
                        // onView={() => handleViewExchange(exchange.ex_id)}
                        onDelete={openDeleteModal(emp.emp_id)}
                        onEdit={() => handleEdit(emp.emp_id)}
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

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4 ">
          <div className="    rounded
        w-full max-w-lg     
        md:max-w-2xl        
         lg:max-w-4xl 
        xl:max-w-5xl       
        relative
        overflow-auto
        max-h-[90vh]">
            <button
              onClick={() => setShowAddModal(false)}
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

            <CreateEmployee
              setShow={setShowAddModal}
              getList={fetchEmployees}
            />
          </div>
        </div>
      )}

      {showEditModal && selectedId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
                <div className="    rounded
        w-full max-w-lg     
        md:max-w-2xl        
         lg:max-w-4xl 
        xl:max-w-5xl      
        relative
        overflow-auto
        max-h-[90vh]">
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

              <EditEmployee
                id={selectedId}
                onClose={() => setShowEditModal(false)}
                setShow={setShowEditModal}
                getList={fetchEmployees}
              />
            </div>
          </div>
        )} 
    </div>


      <TablePaginationDemo
        count={filteredEmployees.length}
        page={page}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
      />

      <ConfirmModal
        show={showModal}
        setShow={setShowModal}
        message="ທ່ານຕ້ອງການລົບລາຍການນີ້ອອກຈາກລະບົບບໍ່？"
        handleConfirm={handleDeleteEmployee}
      />
  </>
  );
};

export default EmployeePage;
