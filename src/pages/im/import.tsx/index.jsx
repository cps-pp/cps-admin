import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';

import { TableAction } from '@/components/Tables/TableAction';
import ConfirmModal from '@/components/Modal';
import { iconAdd } from '@/configs/icon';
import { HeadersImport } from './column/im';
import CreateImport from './create';
import { useAppDispatch } from '@/redux/hook';
import { openAlert } from '@/redux/reducer/alert';
import Alerts from '@/components/Alerts';

import EditImport from './edit';
import ViewImport from './view';
import AddDetailImport from './create_detail';
import { Eye, Plus } from 'lucide-react';
import { Empty } from 'antd';
import SmoothModal from '@/components/Modal/SmoothModal';

const ImportPage = () => {
  const [filterIm, setFilterIm] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [Im, setIm] = useState([]);
  const [empName, setEmpName] = useState([]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAdd_detailModal, setShowAdd_detailModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // เพิ่ม state สำหรับตัวกรอง
  const [monthFilter, setMonthFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');

  // ✅ เพิ่ม state สำหรับการเรียงลำดับ ID
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' หรือ 'desc'

  const dispatch = useAppDispatch();

  // ✅ เก็บ reference ของ handleCloseForm จาก CreateCategory
  const [createFormCloseHandler, setCreateFormCloseHandler] = useState(null);

  const fetchImport = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:4000/src/im/import`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setIm(data.data);
      setFilterIm(data.data);
    } catch (error) {
      console.error('Error fetching imports:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImport();
  }, []);

  // ดึงข้อมูลพนักงาน (คนนำเข้า)
  useEffect(() => {
    const fetchEmployee = async () => {
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

    fetchEmployee();
  }, []);

  // ฟังก์ชันแปลง emp_id เป็นชื่อพนักงาน
  const getEmployeeName = (emp_id) => {
    const emp = empName.find((employee) => employee.emp_id === emp_id);
    return emp ? (
      <>
        {emp.emp_name} {emp.emp_surname}
      </>
    ) : (
      <span className="text-purple-600">-</span>
    );
  };

  // ✅ ฟังก์ชันสำหรับเรียงลำดับ ID
  const handleSortById = () => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newSortOrder);

    const sortedImports = [...Im].sort((a, b) => {
      const extractNumber = (id) => {
        const match = id.match(/\d+/);
        return match ? parseInt(match[0]) : 0;
      };

      const numA = extractNumber(a.im_id);
      const numB = extractNumber(b.im_id);

      if (newSortOrder === 'asc') {
        return numA - numB;
      } else {
        return numB - numA;
      }
    });

    setIm(sortedImports);

    // ถ้ามีการค้นหาหรือกรองอยู่ ให้ใช้ข้อมูลที่เรียงแล้วมากรองใหม่
    applyFiltersWithData(sortedImports);
  };

  // ฟังก์ชันกรองข้อมูลแบบรวม (แก้ไขให้รับ data parameter)
  const applyFiltersWithData = (data = Im) => {
    let filtered = [...data];



    // กรองตามเดือน
    if (monthFilter) {
      filtered = filtered.filter((item) => {
        const itemMonth = new Date(item.im_date).toISOString().slice(0, 7);
        return itemMonth === monthFilter;
      });
    }

     // กรองตามรหัสสั่งซื้อ (แก้ไขส่วนนี้)
    if (selectedOrder !== '') {
    filtered = filtered.filter((Im) => {
      // แปลงทั้งสองค่าเป็น string เพื่อเปรียบเทียบ
      const preorderId = Im.preorder_id ? String(Im.preorder_id) : '';
      const selectedOrderStr = String(selectedOrder);
      return preorderId === selectedOrderStr;
    });
  }

    // กรองตามพนักงาน
    if (selectedEmployee !== '') {
      filtered = filtered.filter((Im) => Im.emp_id_create === selectedEmployee);
    }
    setFilterIm(filtered);
  };

  // ฟังก์ชันกรองข้อมูลแบบรวม (เดิม)
  const applyFilters = () => {
    applyFiltersWithData(Im);
  };

  // เรียกใช้ฟังก์ชันกรองเมื่อมีการเปลี่ยนแปลงใน filters หรือข้อมูล
  useEffect(() => {
    applyFilters();
  }, [ monthFilter, selectedOrder, selectedEmployee, Im]);

  // ฟังก์ชันล้างตัวกรองทั้งหมด
  const clearAllFilters = () => {

    setMonthFilter('');
    setSelectedOrder('');
    setSelectedEmployee('');
  };

  const openDeleteModal = (id) => () => {
    setSelectedId(id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!selectedId) return;

    try {
      const response = await fetch(
        `http://localhost:4000/src/im/import/${selectedId}`,
        {
          method: 'DELETE',
        },
      );

      if (!response.ok) throw new Error('ບໍ່ສາມາດລົບລາຍການນຳເຂົ້າໄດ້');

      setIm((prev) => prev.filter((im) => im.im_id !== selectedId));

      setShowModal(false);
      setSelectedId(null);
      dispatch(
        openAlert({
          type: 'success',
          title: 'ລົບຂໍ້ມູນສຳເລັດ',
          message: 'ລົບຂໍ້ມູນລາຍການນຳເຂົ້າສຳເລັດແລ້ວ',
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

  const handleEditImport = (id) => {
    setSelectedId(id);
    setShowEditModal(true);
  };


  const handleViewImport = (id) => {
    setSelectedId(id);
    setShowViewModal(true);
  };


  const handleAdd_detail = (id) => {
    setSelectedId(id);
    setShowAdd_detailModal(true);
  };


  const handleCloseAddModal = () => {
    if (createFormCloseHandler) {

      createFormCloseHandler();
    } else {

      setShowAddModal(false);
    }
  };


  const handleViewFileAdvanced = async (fileName) => {
    if (!fileName) {
      alert('ไม่พบไฟล์');
      return;
    }

    try {
      const fileUrl = `http://localhost:4000/src/im/view/${fileName}`;


      const response = await fetch(fileUrl, { method: 'HEAD' });

      if (!response.ok) {
        throw new Error('ไม่สามารถเปิดไฟล์ได้');
      }


      window.open(fileUrl, '_blank');
    } catch (error) {
      console.error('Error viewing file:', error);
      alert('เกิดข้อผิดพลาดในการเปิดไฟล์');
    }
  };

  return (
    <div className="rounded bg-white pt-4 dark:bg-boxdark border border-stroke ">
      <Alerts />
      <div className="flex items-center justify-between border-b border-stroke px-4 pb-4 dark:border-strokedark flex-wrap gap-2">
        <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3">
          ຈັດການລາຍການນຳເຂົ້າ
        </h1>

        <div className="ml-auto flex flex-wrap items-center gap-x-2 gap-y-2">

          <Button
            onClick={() => setShowAddModal(true)}
            icon={iconAdd}
            className="bg-Third2 hover:bg-Third3"
          >
            ເພີ່ມລາຍການ
          </Button>
        </div>
      </div>

      {/* ✅ ส่วนของการค้นหาและตัวกรอง */}
      <div className="p-4 space-y-4">
    

        {/* ✅ ตัวกรองอื่นๆ ในแถวถัดไป */}
        <div className="flex flex-wrap items-center gap-2">
          {/* ตัวกรองตามรหัสสั่งซื้อ */}
          <select
            className="border border-stroke dark:border-strokedark rounded p-2"
            value={selectedOrder}
            onChange={(e) => setSelectedOrder(e.target.value)}
          >
            <option value="">-- ກອງຕາມລະຫັດສັ່ງຊື້ --</option>
            {[...new Set(Im.map((im) => im.preorder_id).filter(Boolean))].map((pre_id) => (
              <option key={pre_id} value={pre_id}>
                {pre_id}
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
            {[...new Set(Im.map((im) => im.emp_id_create))].map((empId) => {
              const employee = empName.find((emp) => emp.emp_id === empId);
              return (
                <option key={empId} value={empId}>
                  {employee
                    ? `${employee.emp_name} ${employee.emp_surname}`
                    : empId}
                </option>
              );
            })}
          </select>

          {/* ตัวกรองตามเดือน */}
          <input
            type="month"
            className="border border-stroke dark:border-strokedark rounded p-2"
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
          />

          {/* ปุ่มล้างตัวกรอง */}
          <Button
            onClick={clearAllFilters}
            className="bg-slate-400 hover:bg-slate-500 text-white"
          >
            ລ້າງການກອງ
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto ">
        <table className="w-full min-w-max table-auto  ">
          <thead>
            <tr className="text-left bg-gray border border-stroke ">
              {HeadersImport.map((header, index) => (
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
                          sortOrder === 'asc' ? 'text-green-500' : 'text-black'
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
            {filterIm.length > 0 ? (
              filterIm.map((im, index) => (
                <tr
                  key={index}
                  className="border-b text-md border-stroke  hover:bg-gray-50 "
                >
                  <td className="px-4 py-4">{im.im_id}</td>

                  <td className="px-4 py-4">
                    {new Date(im.im_date).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </td>


                  <td className="px-4 py-4">
                    {im.preorder_id || (
                      <span className="text-purple-600">-</span>
                    )}
                  </td>

                  <td className="px-4 py-4">
                    {im?.file ? (
                      <button
                        onClick={() => handleViewFileAdvanced(im.file)}
                        className="bg-emerald-600  text-white px-4 py-1 rounded hover:bg-emerald-700 transition duration-200"
                      >
                        ເປີດໄຟລ
                      </button>
                    ) : (
                      <span className="text-gray-400 italic">ບໍ່ພົບໄຟລ</span>
                    )}
                  </td>

                  <td className="px-4 py-4">
                    {getEmployeeName(im.emp_id_create)}
                  </td>
                  <td className="px-4 py-4">{im.types}</td>

                  <td className="px-4 py-4">{im.note}</td>

                  <td className="px-3 py-4 ">
                    <div className="flex gap-2 ">
                      <button
                        onClick={() => handleAdd_detail(im.im_id)}
                        className="inline-flex items-center  px-3 py-1  text-md  text-emerald-700 bg-emerald-50 border border-emerald-200 rounded hover:bg-emerald-100 hover:text-emerald-800 transition-colors"
                      >
                        <Plus className="w-4 h-4  mr-1 " />
                        ເພີ່ມ
                      </button>

                      <button
                        onClick={() => handleViewImport(im.im_id)}
                        className="inline-flex items-center px-3 py-1 text-md font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 hover:text-blue-700 transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        ເບີ່ງ
                      </button>
                    </div>
                  </td>

                  <td className="px-3 py-4 text-center">
                    <TableAction
                      onDelete={openDeleteModal(im.im_id)}
                      onEdit={() => handleEditImport(im.im_id)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-4 text-center text-gray-500">
                  <div className="text-center ">
                    <div className="w-32 h-32 flex items-center justify-center mx-auto">
                      <Empty description={false} />
                    </div>
                    <p className="text-lg">
                      ບໍ່ພົບຂໍ້ມູນການນຳເຂົ້າ
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal เพิ่มรายการ */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
          <div className="rounded w-full max-w-lg md:max-w-2xl lg:max-w-5xl relative overflow-auto max-h-[90vh]">

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

          <SmoothModal onClose={() => setShowAddModal(false)}>
            <CreateImport
              setShow={setShowAddModal}
              getList={fetchImport}
              onCloseCallback={setCreateFormCloseHandler}
            />
            </SmoothModal>
          </div>
        </div>
      )}

      {/* Modal แก้ไขรายการ */}
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

          <SmoothModal onClose={() => setShowEditModal(false)}>
            <EditImport
              id={selectedId}
              onClose={() => setShowEditModal(false)}
              setShow={setShowEditModal}
              getList={fetchImport}
            />
            </SmoothModal>
          </div>
        </div>
      )}

      {/* Modal ดูรายละเอียด */}
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

            <SmoothModal onClose={() => setShowViewModal(false)}>
            <ViewImport
              id={selectedId}
              onClose={() => setShowViewModal(false)}
              setShow={setShowViewModal}
              getList={fetchImport}
            />
            </SmoothModal>
          </div>
        </div>
      )}

      {/* Modal เพิ่มรายละเอียด */}
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

            <SmoothModal onClose={() => setShowAdd_detailModal(false)}>
            <AddDetailImport
              id={selectedId}
              onClose={() => setShowAdd_detailModal(false)}
              setShow={setShowAdd_detailModal}
              getList={fetchImport}
            />
            </SmoothModal>
          </div>
        </div>
      )}

      {/* Modal ยืนยันการลบ */}
      <ConfirmModal
        show={showModal}
        setShow={setShowModal}
        message="ທ່ານຕ້ອງການລົບລາຍການນີ້ອອກຈາກລະບົບບໍ່？"
        handleConfirm={handleDelete}
      />
    </div>
  );
};

export default ImportPage;
