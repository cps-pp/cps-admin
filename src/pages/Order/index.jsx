import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import Search from '@/components/Forms/Search';
import { TableAction } from '@/components/Tables/TableAction';
import ConfirmModal from '@/components/Modal';
import { iconAdd } from '@/configs/icon';
import { OrderHeaders } from './column/order';
import { openAlert } from '@/redux/reducer/alert';
import { useAppDispatch } from '@/redux/hook';

// Import Components
import OrderCreate from './create';
import EditPreorder from './edit';
import ViewPreorder from './view';
import AddDetailPreorder from './create_detail'; // ปรับ path ตามโครงสร้างโฟลเดอร์

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrder, setFilteredOrder] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAdd_detailModal, setShowAdd_detailModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const dispatch = useAppDispatch();
  const [existingIds, setExistingIds] = useState([]);

  // เพิ่ม state สำหรับข้อมูลผู้สะหนองและยา
  const [supName, setSupName] = useState([]);
  const [medName, setMedName] = useState([]);
  const [empName, setEmpName] = useState([]);

  // เพิ่ม state สำหรับตัวป้องกันเวลาออกจากหน้า
  const [createFormCloseHandler, setCreateFormCloseHandler] = useState(null);

  // เพิ่ม state สำหรับตัวกรอง
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        'http://localhost:4000/src/preorder/preorder',
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched data:', data);
      setOrders(data.data);
      setFilteredOrder(data.data);
      // ✅ เก็บรหัสทั้งหมดไว้
      const ids = data.data.map((preorder) => preorder.preorder_id);
      console.log('Extracted IDs:', ids);
      setExistingIds(ids);

    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
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

  
  // ดึงข้อมูลผู้สะหนอง
  useEffect(() => {
    const fetchSup = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:4000/src/manager/supplier');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Supplier Data:", data.data);
        setSupName(data.data);
      } catch (error) {
        console.error('Error fetching sup data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSup();
  }, []);

  // ดึงข้อมูลยา
  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:4000/src/manager/medicines');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Medicine Data:", data.data);
        setMedName(data.data);
      } catch (error) {
        console.error('Error fetching medicine data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicine();
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

  // ฟังก์ชันแปลง id เป็นชื่อผู้สะหนอง
  const getSupName = (sup_id) => {
    const sup = supName.find((s) => s.sup_id === sup_id);
    return sup ? (
      <>
        {sup.company_name}
      </>
    ) : (
      <span className="text-purple-600">-</span>
    );
  };

  // ฟังก์ชันแปลง med_id เป็นชื่อยา
  const getMedName = (med_id) => {
    const med = medName.find((m) => m.med_id === med_id);
    return med ? (
      <>
        {med.med_name}
      </>
    ) : (
      <span className="text-purple-600">-</span>
    );
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ฟังก์ชันกรองข้อมูล
  const applyFilters = () => {
    let filtered = orders;

    // กรองตามการค้นหา
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter((order) =>
        order.preorder_id.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    }

    // กรองตามผู้สะหนอง
    if (selectedSupplier !== '') {
      filtered = filtered.filter((order) => order.sup_id === selectedSupplier);
    }

    // กรองตามเดือน
    if (selectedMonth !== '') {
      filtered = filtered.filter((order) => {
        const orderMonth = new Date(order.preorder_date).toISOString().slice(0, 7);
        return orderMonth === selectedMonth;
      });
    }

    // กรองตามสถานะ
    if (selectedStatus !== '') {
      filtered = filtered.filter((order) => order.status === selectedStatus);
    }

    // กรองตามพนักงาน
    if (selectedEmployee !== '') {
      filtered = filtered.filter((order) => order.emp_id_create === selectedEmployee);
    }

    setFilteredOrder(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [searchQuery, orders, selectedSupplier, selectedMonth, selectedStatus, selectedEmployee]);

  const openDeleteModal = (id) => () => {
    setSelectedOrderId(id);
    setShowModal(true);
  };

  const handleDeleteOrder = async () => {
    if (!selectedOrderId) return;
    try {
      const response = await fetch(
        `http://localhost:4000/src/preorder/preorder/${selectedOrderId}`,
        { method: 'DELETE' },
      );
      if (!response.ok) throw new Error('Failed to delete order');

      setOrders((prev) =>
        prev.filter((o) => o.preorder_id !== selectedOrderId),
      );
      setShowModal(false);
      setSelectedOrderId(null);
      dispatch(
        openAlert({
          type: 'success',
          title: 'ລົບຂໍ້ມູນສຳເລັດ',
          message: 'ລົບຂໍ້ມູນສັ່ງຊື້ສຳເລັດແລ້ວ',
        })
      );
    } catch (error) {
      dispatch(
        openAlert({
          type: 'error',
          title: 'ລົບຂໍ້ມູນບໍ່ສຳເລັດ',
          message: error.message || 'ເກີດຂໍ້ຜິດພາດໃນການລົບຂໍ້ມູນ',
        })
      );
    }
  };

  const handleEditpreorder = (id) => {
    console.log('Edit clicked with ID:', id, 'Type:', typeof id);
    setSelectedId(id);
    setShowEditModal(true);
  };

  // ✅ ฟังก์ชันนี้ถูกต้องแล้ว - ใช้ setSelectedId
  const handleAdd_detail = (id) => {
    setSelectedId(id);
    setShowAdd_detailModal(true);
  };

  // ✅ ฟังก์ชันนี้ถูกต้องแล้ว - ใช้ setSelectedId
  const handleView = (id) => {
    setSelectedId(id);
    setShowViewModal(true);
  };

  // ✅ Handler สำหรับปุ่ม X ที่จะใช้ฟังก์ชันจาก OrderCreate
  const handleCloseAddModal = () => {
    if (createFormCloseHandler) {
      createFormCloseHandler();
    } else {
      setShowAddModal(false);
    }
  };

  // ฟังก์ชันล้างตัวกรอง
  const clearFilters = () => {
    setSelectedSupplier('');
    setSelectedMonth('');
    setSelectedStatus('');
    setSelectedEmployee('');
    setSearchQuery('');
  };


  const paginatedOrder = filteredOrder.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="rounded bg-white pt-4 dark:bg-boxdark">
      <div className="flex items-center justify-between border-b border-stroke px-4 pb-4 dark:border-strokedark flex-wrap gap-2">
        <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3">
          ຈັດການລາຍການສັ່ງຊື້
        </h1>

        <div className="ml-auto flex flex-wrap items-center gap-x-2 gap-y-2">
          <Button
            onClick={() => setShowAddModal(true)}
            icon={iconAdd}
            className="bg-secondary2"
          >
            ເພີ່ມລາຍການ
          </Button>
        </div>
      </div>

      <div className="grid w-full gap-4 p-4">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {/* ช่องค้นหา */}
          <Search
            type="text"
            name="search"
            placeholder="ຄົ້ນຫາ..."
            className="rounded border border-stroke dark:border-strokedark flex-1 min-w-[200px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* ตัวกรองตามผู้สะหนอง */}
          <select
            className="border border-stroke dark:border-strokedark rounded p-2"
            value={selectedSupplier}
            onChange={(e) => setSelectedSupplier(e.target.value)}
          >
            <option value="">-- ກອງຕາມຜູ້ສະໜອງ --</option>
            {[...new Set(orders.map((order) => order.sup_id))].map((id) => {
              const supplier = supName.find((s) => s.sup_id === id);
              return (
                <option key={id} value={id}>
                  {supplier ? supplier.company_name : id}
                </option>
              );
            })}
          </select>

          {/* ตัวกรองตามสถานะ */}
          <select
            className="border border-stroke dark:border-strokedark rounded p-2"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">-- ກອງຕາມສະຖານະ --</option>
            {[...new Set(orders.map((order) => order.status))].map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          {/* ตัวกรองตามพนักงาน */}
          <select
            className="border border-stroke dark:border-strokedark rounded p-2"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
          >
            <option value="">-- ກອງຕາມພະນັກງານ --</option>
            {[...new Set(orders.map((order) => order.emp_id_create))].map((empId) => {
              const employee = empName.find((emp) => emp.emp_id === empId);
              return (
                <option key={empId} value={empId}>
                  {employee ? `${employee.emp_name} ${employee.emp_surname}` : empId}
                </option>
              );
            })}
          </select>

          {/* ตัวกรองตามเดือน */}
          <input
            type="month"
            className="border border-stroke dark:border-strokedark rounded p-2"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />

          {/* ปุ่มล้างตัวกรอง */}
          <Button
            onClick={clearFilters}
            className="bg-graydark hover:bg-graydark"
          >
            ລ້າງຕົວກອງ
          </Button>
        </div>
      </div>



         <div className="overflow-x-auto  shadow-md">
          <table className="w-full min-w-max table-auto  ">
          <thead>
            <tr className="text-left bg-gray border border-stroke ">
              {OrderHeaders.map((header, index) => (
                <th
                  key={index}
                  className="px-4 py-3 tracking-wide text-form-input  font-semibold"
                >
                  {header.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedOrder.length > 0 ? (
              paginatedOrder.map((order, index) => (
                <tr
                  key={index}
                  className="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="px-4 py-4">{order.preorder_id}</td>
                  <td className="px-4 py-4">
                    {new Date(order.preorder_date).toLocaleDateString('en-US', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${order.status === 'ລໍຖ້າຈັດສົ່ງ'
                        ? 'bg-amber-300 text-amber-700'
                        : order.status === 'ສຳເລັດ'
                          ? 'bg-green-300 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                        }`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="px-4 py-4">{getSupName(order.sup_id)}</td>

                  <td className="px-4 py-4">
                    {getDoctorName(order.emp_id_create)}
                  </td>
                  <td className="px-3 py-4 text-center">
                    <TableAction
                      onAdd={() => handleAdd_detail(order.preorder_id)}
                      onView={() => handleView(order.preorder_id)}
                    />
                  </td>

                  <td className="px-3 py-4 text-center">
                    <TableAction
                      onDelete={openDeleteModal(order.preorder_id)}
                      onEdit={() => handleEditpreorder(order.preorder_id)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={12} className="py-4 text-center text-gray-500">
                  ບໍ່ມີຂໍ້ມູນ
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
          <div className="rounded w-full max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl relative overflow-auto max-h-[90vh]">
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

            <OrderCreate
              setShow={setShowAddModal}
              getList={fetchOrders}
              existingIds={existingIds}
              onCloseCallback={setCreateFormCloseHandler}
            />
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
          <div className="rounded w-full max-w-lg md:max-w-2xl lg:max-w-5xl relative overflow-auto max-h-[90vh]">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-2 text-gray-500 hover:text-gray-700 z-10"
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

            {/* ✅ ส่ง selectedId ไปยัง EditPreorder ถูกต้องแล้ว */}
            <EditPreorder
              id={selectedId}
              onClose={() => setShowEditModal(false)}
              setShow={setShowEditModal}
              getList={fetchOrders}
            />
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
          <div className="rounded w-full max-w-lg md:max-w-2xl lg:max-w-5xl relative overflow-auto max-h-[90vh]">
            <button
              onClick={() => setShowViewModal(false)}
              className="absolute top-4 right-2 text-gray-500 hover:text-gray-700 z-10"
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

            <ViewPreorder
              id={selectedId}
              onClose={() => setShowViewModal(false)}
              setShow={setShowViewModal}
              getList={fetchOrders}
            />
          </div>
        </div>
      )}

      {/* Add Detail Modal */}
      {showAdd_detailModal && selectedId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
          <div className="rounded w-full max-w-lg md:max-w-2xl lg:max-w-5xl relative overflow-auto max-h-[90vh]">
            <button
              onClick={() => setShowAdd_detailModal(false)}
              className="absolute top-4 right-2 text-gray-500 hover:text-gray-700 z-10"
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

            <AddDetailPreorder
              id={selectedId}
              onClose={() => setShowAdd_detailModal(false)}
              setShow={setShowAdd_detailModal}
              getList={fetchOrders}
            />
          </div>
        </div>
      )}

      <ConfirmModal
        show={showModal}
        setShow={setShowModal}
        message="ທ່ານຕ້ອງການລົບລາຍການນີ້ອອກຈາກລະບົບບໍ່？"
        handleConfirm={handleDeleteOrder}
      />
    </div>
  );
};

export default OrderPage;

