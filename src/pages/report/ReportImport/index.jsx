import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import Search from '@/components/Forms/Search';
import { imHeaders } from './column/im';
import { useAppDispatch } from '@/redux/hook';

import Alerts from '@/components/Alerts';

const ReportImport = () => {
  const [filterIm, setFilterIm] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [Im, setIm] = useState([]);
  const [empName, setEmpName] = useState([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // เพิ่ม state สำหรับตัวกรอง
  const [monthFilter, setMonthFilter] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');

  // ✅ เพิ่ม state สำหรับการเรียงลำดับ ID
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' หรือ 'desc'

  // ✅ เพิ่ม state สำหรับแท็บและสถิติ
  const [activeTab, setActiveTab] = useState('all'); // all, medicine, equipment
  const [summaryStats, setSummaryStats] = useState({
    totalImports: 0,
    totalMedicineImports: 0,
    totalEquipmentImports: 0,
  });

  const dispatch = useAppDispatch();

  // ✅ ฟังก์ชันตรวจสอบประเภทสินค้าจากคอลัมน์ที่ 5 (types)
  const getImportTypeFromTypes = (types) => {
    if (!types) return 'unknown';
    const typesStr = types.toString();
    
    // ตรวจสอบว่ามีทั้งยาและอุปกรณ์หรือไม่
    const hasMedicine = typesStr.includes('ຢາ') || typesStr.includes('ยา') || typesStr.includes('medicine');
    const hasEquipment = typesStr.includes('ອຸປະກອນ') || typesStr.includes('อุปกรณ์') || typesStr.includes('equipment');
    
    if (hasMedicine && hasEquipment) {
      return 'both'; // มีทั้งยาและอุปกรณ์
    } else if (hasMedicine) {
      return 'medicine';
    } else if (hasEquipment) {
      return 'equipment';
    }
    return 'unknown';
  };

  // ✅ คำนวณสถิติจากข้อมูลจริงในตาราง
  const calculateStats = (imports) => {
    let medicineCount = 0;
    let equipmentCount = 0;
    
    imports.forEach(im => {
      const importType = getImportTypeFromTypes(im.types);
      if (importType === 'medicine') {
        medicineCount++;
      } else if (importType === 'equipment') {
        equipmentCount++;
      } else if (importType === 'both') {
        // ถ้ามีทั้งยาและอุปกรณ์ ให้นับทั้งสองอย่าง
        medicineCount++;
        equipmentCount++;
      }
    });

    setSummaryStats({
      totalImports: imports.length,
      totalMedicineImports: medicineCount,
      totalEquipmentImports: equipmentCount,
    });
  };

  const fetchImport = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:4000/src/report/import`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setIm(data.data);
      setFilterIm(data.data);
      
      // ✅ คำนวณสถิติ
      calculateStats(data.data);
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

  // ✅ Handle tab change - กรองข้อมูลตาม tab
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // ล้างตัวกรองอื่นๆ เมื่อเปลี่ยนแท็บ
    setSearchQuery('');
    setMonthFilter('');
    setSelectedEmployee('');
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

    // ✅ กรองตามแท็บ - ตรวจสอบจากคอลัมน์ types
    if (activeTab === 'medicine') {
      filtered = filtered.filter(im => {
        const importType = getImportTypeFromTypes(im.types);
        return importType === 'medicine' || importType === 'both';
      });
    } else if (activeTab === 'equipment') {
      filtered = filtered.filter(im => {
        const importType = getImportTypeFromTypes(im.types);
        return importType === 'equipment' || importType === 'both';
      });
    }

    // กรองตาม search query
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter((item) =>
        Object.values(item)
          .join(' ')
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
      );
    }

    // กรองตามเดือน
    if (monthFilter) {
      filtered = filtered.filter((item) => {
        const itemMonth = new Date(item.im_date).toISOString().slice(0, 7);
        return itemMonth === monthFilter;
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
  }, [searchQuery, monthFilter, selectedEmployee, Im, activeTab]);

  // ฟังก์ชันล้างตัวกรองทั้งหมด
  const clearAllFilters = () => {
    setSearchQuery('');
    setMonthFilter('');
    setSelectedEmployee('');
  };

  const handleViewImport = (id) => {
    setSelectedId(id);
    setShowViewModal(true);
  };

  return (
    <>
      {/* ✅ Summary Cards - กล่องแรกแสดงจำนวนทั้งหมดเสมอ */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 2xl:gap-7.5 w-full mb-6">
        {/* Total Imports - แสดงจำนวนนำเข้าทั้งหมดเสมอ */}
        <div className="rounded-sm border border-stroke bg-white p-4">
          <div className="flex items-center">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-blue-100">
              <svg
                className="w-[25px] h-[25px] text-form-strokedark"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.1"
                  d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-6 5h6m-6 4h6M10 3v4h4V3h-4Z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h4 className="text-lg font-semibold text-strokedark">
                ຈຳນວນນຳເຂົ້າທັງໝົດ
              </h4>
              <p className="text-xl font-bold text-blue-700"> 
                {summaryStats.totalImports} ຄັ້ງ
              </p>
            </div>
          </div>
        </div>

        {/* Medicine Imports - นับจากคอลัมน์ types */}
        <div className="rounded-sm border border-stroke bg-white p-4">
          <div className="flex items-center">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-green-100">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h4 className="text-lg font-semibold text-strokedark">
                ນຳເຂົ້າຢາ
              </h4>
              <p className="text-xl font-bold text-green-600">
                {summaryStats.totalMedicineImports} ຄັ້ງ
              </p>
            </div>
          </div>
        </div>

        {/* Equipment Imports - นับจากคอลัมน์ types */}
        <div className="rounded-sm border border-stroke bg-white p-4">
          <div className="flex items-center">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-purple-100">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h4 className="text-lg font-semibold text-strokedark">
                ນຳເຂົ້າອຸປະກອນ
              </h4>
              <p className="text-xl font-bold text-purple-600">
                {summaryStats.totalEquipmentImports} ຄັ້ງ
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded bg-white pt-4 dark:bg-boxdark">
        <Alerts />
        <div className="flex items-center justify-between border-b border-stroke px-4 pb-4 dark:border-strokedark flex-wrap gap-2">
          <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3">
            ລາຍງານການນຳເຂົ້າ
          </h1>
        </div>

        {/* ✅ Tabs */}
        <div className="flex gap-4 px-4 mt-4">
          <button
            onClick={() => handleTabChange('all')}
            className={`px-4 py-2 rounded transition-colors ${
              activeTab === 'all' 
                ? 'bg-slate-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            ທັງໝົດ
          </button>
          <button
            onClick={() => handleTabChange('medicine')}
            className={`px-4 py-2 rounded transition-colors ${
              activeTab === 'medicine' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            ຢາ
          </button>
          <button
            onClick={() => handleTabChange('equipment')}
            className={`px-4 py-2 rounded transition-colors ${
              activeTab === 'equipment' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            ອຸປະກອນ
          </button>
        </div>

        {/* ส่วนของตัวกรอง */}
        <div className="grid w-full gap-4 p-4">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {/* Search Box */}
            <Search
              type="text"
              name="search"
              placeholder="ຄົ້ນຫາ..."
              className="rounded border border-stroke dark:border-strokedark"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

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
              className="bg-graydark hover:bg-graydark"
            >
              ລ້າງຕົວກອງ
            </Button>
          </div>
        </div>
        

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-max table-auto">
            <thead>
              <tr className="text-left bg-gray border border-stroke">
                {imHeaders.map((header, index) => (
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
                    className="border-b text-md border-stroke hover:bg-gray-50"
                  >
                    <td className="px-4 py-4">{im.im_id}</td>

                    <td className="px-4 py-4">
                      {new Date(im.im_date).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </td>

                    {/* ລະຫັດສັ່ງຊື້ */}
                    <td className="px-4 py-4">
                      {im.preorder_id || (
                        <span className="text-purple-600">-</span>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      {getEmployeeName(im.emp_id_create)}
                    </td>

                    <td className="px-4 py-4">{im.types}</td>

                    <td className="px-3 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewImport(im.im_id)}
                          className="inline-flex items-center px-3 py-1 text-md font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 hover:text-blue-700 transition-colors"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          ເບີ່ງລາຍລະອຽດ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={getTableHeaders().length}
                    className="px-4 py-4 text-center text-gray-500"
                  >
                    ບໍ່ພົບຂໍ້ມູນ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

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

              <ViewImport
                id={selectedId}
                onClose={() => setShowViewModal(false)}
                setShow={setShowViewModal}
                getList={fetchImport}
              />
            </div>
          </div>
        )}
      </div>
      
    </>
  );
};

export default ReportImport;
