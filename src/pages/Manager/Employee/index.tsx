import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import Search from '@/components/Forms/Search';
import { TableAction } from '@/components/Tables/TableAction';
import ConfirmModal from '@/components/Modal';
import { iconAdd } from '@/configs/icon';
import { EmpHeaders } from './column/emp';

const EmployeePage: React.FC = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedEmpId, setSelectedEmpId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:4000/manager/emp');
        if (!response.ok) throw new Error('Failed to fetch employees');
        const data = await response.json();
        setEmployees(data.data);
        setFilteredEmployees(data.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setLoading(false);
      }
    };

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

  const openDeleteModal = (id: string) => () => {
    setSelectedEmpId(id);
    setShowModal(true);
  };

  const handleDeleteEmployee = async () => {
    if (!selectedEmpId) return;

    try {
      const response = await fetch(`http://localhost:4000/manager/emp/${selectedEmpId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete employee');

      setEmployees((prev) => prev.filter((emp) => emp.emp_id !== selectedEmpId));
      setShowModal(false);
      setSelectedEmpId(null);
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const handleEditEmployee = (id: string) => {
    navigate(`/employee/edit/${id}`);
  };

  return (
    <div className="rounded bg-white pt-4 dark:bg-boxdark">
      <div className="flex items-center justify-between border-b border-stroke px-4 pb-4 dark:border-strokedark">
        <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3">
          ຈັດການຂໍ້ມູນພະນັກງານ
        </h1>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => navigate('/employee/create')}
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


      <div className="text-md text-strokedark dark:text-bodydark3">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max table-auto border-collapse ">
            <thead>
              <tr className="border-b border-gray-300 bg-gray-100 text-left dark:bg-meta-4 bg-blue-100">
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
              {filteredEmployees.length > 0 ? ( 
                filteredEmployees.map((emp, index) => (
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
                        onEdit={() => handleEditEmployee(emp.emp_id)} 
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
      </div>

      <ConfirmModal
        show={showModal}
        setShow={setShowModal}
        message="ທ່ານຕ້ອງການລົບລາຍການນີ້ອອກຈາກລະບົບບໍ່？"
        handleConfirm={handleDeleteEmployee} 
      />
    </div>
  );
};

export default EmployeePage;

