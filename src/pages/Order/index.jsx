import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import Search from '@/components/Forms/Search';
import { TableAction } from '@/components/Tables/TableAction';
import ConfirmModal from '@/components/Modal';
import { iconAdd, PDF } from '@/configs/icon';
import { OrderHeaders } from './column/order';
import OrderCreate from './create';

import TablePaginationDemo from '@/components/Tables/Pagination_two'; // ✅ เพิ่ม import
import { useAppDispatch } from '@/redux/hook';

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

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredOrder(orders);
    } else {
      const filtered = orders.filter((order) =>
        order.preorder_id.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredOrder(filtered);
    }
  }, [searchQuery, orders]);

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
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // ✅ ฟังก์ชันนี้ถูกต้องแล้ว - ใช้ setSelectedId
  const handleEdit = (id) => {
    setSelectedId(id);
    setShowEditModal(true);
  };

  // ✅ Handler สำหรับปุ่ม X ที่จะใช้ฟังก์ชันจาก OrderCreate
  const handleCloseAddModal = () => {
    if (createFormCloseHandler) {
      createFormCloseHandler();
    } else {
      setShowAddModal(false);
    }
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
          {/* ตัวกรองตามผู้สะหนอง */}
          <select
            className="border border-stroke dark:border-strokedark rounded p-2"
            onChange={(e) => {
              const value = e.target.value;
              if (value === '') {
                setFilteredOrder(orders);
              } else {
                const filtered = orders.filter((order) => order.sup_id === value);
                setFilteredOrder(filtered);
              }
            }}
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

          {/* ตัวกรองตามเดือน */}
          <input
            type="month"
            className="border border-stroke dark:border-strokedark rounded p-2"
            onChange={(e) => {
              const value = e.target.value;
              if (value === '') {
                setFilteredOrder(orders);
              } else {
                const filtered = orders.filter((order) => {
                  const orderMonth = new Date(order.preorder_date).toISOString().slice(0, 7);
                  return orderMonth === value;
                });
                setFilteredOrder(filtered);
              }
            }}
          />

          <Button
            onClick={() => navigate('/order/create')}
            icon={PDF}
            className="bg-primary"
          >
            Export
          </Button>
          <Button
            onClick={() => setShowAddModal(true)}
            icon={iconAdd}
            className="bg-primary"
          >
            ເພີ່ມລາຍການ
          </Button>
        </div>
      </div>

      <div className="grid w-full gap-4 p-4">
        <Search
          type="text"
          name="search"
          placeholder="ຄົ້ນຫາ..."
          className="rounded border border-stroke dark:border-strokedark"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="w-full min-w-max table-auto border-collapse overflow-hidden rounded-lg">
          <thead>
            <tr className="text-left bg-secondary2 text-white">
              {OrderHeaders.map((header, index) => (
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
                  <td className="px-4 py-4">{order.qty}</td>
                  <td className="px-4 py-4">{order.status}</td>
                  <td className="px-4 py-4">{order.lot}</td>
                  <td className="px-4 py-4">{getSupName(order.sup_id)}</td>
                  <td className="px-4 py-4">{getMedName(order.med_id)}</td>
                  <td className="px-4 py-4">
                    {getDoctorName(order.emp_id_create)}
                  </td>
                  <td className="px-4 py-4">
                    {new Date(order.created_at).toLocaleDateString('en-US', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-4 py-4">
                    {getDoctorName(order?.emp_id_updated)}
                  </td>
                  <td className="px-4 py-4">
                    {/* ✅ แก้ไข: ใช้ order แทน im */}
                    {order?.update_by &&
                      !isNaN(new Date(order.update_by).getTime()) ? (
                      new Date(order.update_by).toLocaleDateString('en-US', {
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
                      onDelete={openDeleteModal(order.preorder_id)}
                      onEdit={() => handleEdit(order.preorder_id)}
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

<<<<<<< HEAD
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

      <TablePaginationDemo
        count={filteredOrder.length}
        page={page}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
      />

=======
>>>>>>> cce206a1a4e69f0cb21f171e1a876e2ae91ed2e6
      {/* <ConfirmModal
        show={showModal}
        setShow={setShowModal}
        message="ທ່ານຕ້ອງການລົບລາຍການນີ້ອອກຈາກລະບົບບໍ່？"
        handleConfirm={handleDeleteOrder}
      /> */}
    </div>
  );
};

export default OrderPage;

