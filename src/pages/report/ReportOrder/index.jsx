import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import Search from '@/components/Forms/Search';
import { OrderHead } from './column/order';
import { useAppDispatch } from '@/redux/hook';
import { Printer } from 'lucide-react';

import Alerts from '@/components/Alerts';
import ViewPreorder from './view';
import { Eye } from 'lucide-react';

const ReportPreorder = () => {
  const [filterPreorder, setFilterPreorder] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [preorders, setPreorders] = useState([]);
  const [empName, setEmpName] = useState([]);
  const [supName, setSupName] = useState([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [filterPr, setFilterPr] = useState([]);

  // เพิ่ม state สำหรับตัวกรอง
  const [monthFilter, setMonthFilter] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');

  // ✅ เพิ่ม state สำหรับการเรียงลำดับ ID
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' หรือ 'desc'

  // ✅ เพิ่ม state สำหรับแท็บและสถิติ
  const [activeTab, setActiveTab] = useState('all'); // all, medicine, equipment
  const [summaryStats, setSummaryStats] = useState({
    totalPreorders: 0,
    totalMedicinePreorders: 0,
    totalEquipmentPreorders: 0,
  });

  const dispatch = useAppDispatch();

  // ✅ ฟังก์ชันตรวจสอบประเภทสินค้าจากคอลัมน์ types (เหมือน ReportImport)
  const getPreorderTypeFromTypes = (types) => {
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

  // ✅ คำนวณสถิติจากข้อมูลจริงในตาราง (ใช้คอลัมน์ types แทน)
  const calculateStats = (preorderList) => {
    let medicineCount = 0;
    let equipmentCount = 0;
    
    preorderList.forEach(preorder => {
      const preorderType = getPreorderTypeFromTypes(preorder.types);
      if (preorderType === 'medicine') {
        medicineCount++;
      } else if (preorderType === 'equipment') {
        equipmentCount++;
      } else if (preorderType === 'both') {
        // ถ้ามีทั้งยาและอุปกรณ์ ให้นับทั้งสองอย่าง
        medicineCount++;
        equipmentCount++;
      }
    });

    setSummaryStats({
      totalPreorders: preorderList.length,
      totalMedicinePreorders: medicineCount,
      totalEquipmentPreorders: equipmentCount,
    });
  };

  const fetchPreorders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:4000/src/report/preorder`);
      if (!response.ok) {
         throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setPreorders(data.data);
      setFilterPreorder(data.data);
      setFilterPr(data.data);
      
      // ✅ คำนวณสถิติ
      calculateStats(data.data);
    } catch (error) {
      console.error('Error fetching preorders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPreorders();
  }, []);

  // ดึงข้อมูลพนักงาน
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:4000/src/manager/emp`);
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

  // ดึงข้อมูลผู้สะหนอง
  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:4000/src/manager/supplier');
        if (!response.ok) {
           throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setSupName(data.data);
      } catch (error) {
        console.error('Error fetching supplier data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSupplier();
  }, []);

  // ✅ ฟังก์ชันแปลง emp_id เป็นชื่อพนักงาน (แบบ string)
const getEmployeeName = (emp_id) => {
  const emp = empName.find((employee) => employee.emp_id === emp_id);
  return emp ? `${emp.emp_name} ${emp.emp_surname}` : '-';
};

// ✅ ฟังก์ชันแปลง sup_id เป็นชื่อผู้สะหนอง (แบบ string)
const getSupplierName = (sup_id) => {
  const sup = supName.find((supplier) => supplier.sup_id === sup_id);
  return sup ? sup.company_name : '-';
};


  // ✅ Handle tab change - กรองข้อมูลตาม tab
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // ล้างตัวกรองอื่นๆ เมื่อเปลี่ยนแท็บ
    setSearchQuery('');
    setMonthFilter('');
    setSelectedSupplier('');
    setSelectedEmployee('');
  };

  // ✅ ฟังก์ชันสำหรับเรียงลำดับ ID
  const handleSortById = () => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newSortOrder);

    const sortedPreorders = [...preorders].sort((a, b) => {
      const extractNumber = (id) => {
        const match = id.match(/\d+/);
        return match ? parseInt(match[0]) : 0;
      };

      const numA = extractNumber(a.preorder_id);
      const numB = extractNumber(b.preorder_id);

      if (newSortOrder === 'asc') {
        return numA - numB;
      } else {
        return numB - numA;
      }
    });

    setPreorders(sortedPreorders);
    // ถ้ามีการค้นหาหรือกรองอยู่ ให้ใช้ข้อมูลที่เรียงแล้วมากรองใหม่
    applyFiltersWithData(sortedPreorders);
  };

  // ฟังก์ชันกรองข้อมูลแบบรวม (แก้ไขให้รับ data parameter)
  const applyFiltersWithData = (data = preorders) => {
    let filtered = [...data];

    // ✅ กรองตามแท็บ - ตรวจสอบจากคอลัมน์ types
    if (activeTab === 'medicine') {
      filtered = filtered.filter(preorder => {
        const preorderType = getPreorderTypeFromTypes(preorder.types);
        return preorderType === 'medicine' || preorderType === 'both';
      });
    } else if (activeTab === 'equipment') {
      filtered = filtered.filter(preorder => {
        const preorderType = getPreorderTypeFromTypes(preorder.types);
        return preorderType === 'equipment' || preorderType === 'both';
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
        const itemMonth = new Date(item.preorder_date).toISOString().slice(0, 7);
        return itemMonth === monthFilter;
      });
    }

    // กรองตามผู้สะหนอง
    if (selectedSupplier !== '') {
      filtered = filtered.filter((preorder) => preorder.sup_id === selectedSupplier);
    }

    // กรองตามพนักงาน
    if (selectedEmployee !== '') {
      filtered = filtered.filter((preorder) => preorder.emp_id_create === selectedEmployee);
    }

    setFilterPreorder(filtered);
    setFilterPr(filtered);
  };

  // ฟังก์ชันกรองข้อมูลแบบรวม (เดิม)
  const applyFilters = () => {
    applyFiltersWithData(preorders);
  };

  // เรียกใช้ฟังก์ชันกรองเมื่อมีการเปลี่ยนแปลงใน filters หรือข้อมูล
  useEffect(() => {
    applyFilters();
  }, [searchQuery, monthFilter, selectedSupplier, selectedEmployee, preorders, activeTab]);

  // ฟังก์ชันล้างตัวกรองทั้งหมด
  const clearAllFilters = () => {
    setSearchQuery('');
    setMonthFilter('');
    setSelectedSupplier('');
    setSelectedEmployee('');
  };

  const handleViewPreorder = (id) => {
    setSelectedId(id);
    setShowViewModal(true);
  };

  // ฟังก์ชันสำหรับพิมพ์รายงานการนำเข้า พร้อมลายละเอียดเชื่อมต่อ
const handlePrintReport = async () => {
  const reportData = filterPr; // ใช้ข้อมูลที่กรองแล้ว

  // 🔄 โหลดข้อมูลรายละเอียดการนำเข้าทั้งหมด
  const detailMap = {}; // key: preorder_id => value: array of detail rows
  try {
    for (const preorder of reportData) {
      const res = await fetch(`http://localhost:4000/src/report/preorder-detail/${preorder.preorder_id}`);
      const json = await res.json();
      detailMap[preorder.preorder_id] = json.data || [];
    }
  } catch (error) {
    console.error('โหลดข้อมูลลายละเอียดไม่สำเร็จ:', error);
    alert('ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນລາຍລະອຽດ');
    return;
  }

  // 🔵 เริ่มสร้าง HTML รายงาน
  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>ລາຍງານການສັ່ງຊື້</title>
      <style>
        @page {
          size: A4;
          margin: 20mm;
        }

        body {
          font-family: 'phetsarath ot', serif;
          font-size: 14px;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
        }

        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #333;
          padding-bottom: 20px;
        }

        .header h1 {
          font-size: 24px;
          font-weight: bold;
          margin: 0;
          color: #2c5aa0;
        }

        .report-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
          background-color: #f8f9fa;
          padding: 15px;
          border-radius: 5px;
        }

        .report-info div {
          flex: 1;
        }

        .report-info strong {
          color: #2c5aa0;
        }

        .section {
          margin-bottom: 40px;
        }

        .section-title {
          font-weight: bold;
          color: #2c5aa0;
          font-size: 16px;
          margin-bottom: 10px;
        }

        .section-id {
          color: #333;
          font-weight: normal;
          font-size: 14px;
        }

        .inline-info {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 15px;
          background-color: #f8f9fa;
          padding: 10px;
          border-radius: 5px;
        }

        .inline-info p {
          margin: 0;
          font-size: 13px;
          color: #333;
        }

        .inline-info strong {
          color: #2c5aa0;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }

        th, td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: left;
        }

        th {
          background-color: #f8f9fa;
          font-weight: bold;
          color: #2c5aa0;
        }

        .sub-table {
          margin-left: 20px;
          width: calc(100% - 40px);
          border: 1px solid #ddd;
        }

        .sub-table th,
        .sub-table td {
          border: 1px solid #eee;
          font-size: 12px;
          padding: 8px;
        }

        .text-center {
          text-align: center;
        }

        .footer {
          margin-top: 30px;
          text-align: center;
          font-size: 12px;
          color: #6c757d;
        }

        @media print {
          body {
            font-size: 12px;
          }

          .header h1 {
            font-size: 20px;
          }

          .inline-info p {
            font-size: 12px;
          }

          th, td {
            padding: 8px;
          }

          .section-title {
            font-size: 14px;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>ລາຍງານການສັ່ງຊື້</h1>
        <p>Preorder Report</p>
      </div>
      
      <div class="report-info">
        <div>
          <p><strong>ວັນທີ່ອອກລາຍງານ:</strong> ${new Date().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })}</p>
        </div>
        <div>
          <p><strong>ຈຳນວນການສັ່ງຊື້ທັງໝົດ:</strong> ${reportData.length} ລາຍການ</p>
        </div>
        <div>
          ${selectedSupplier ? `<p><strong>ຜູ້ສະໜອງ:</strong> ${getSupplierName(selectedSupplier)}</p>` : ''}
          ${selectedEmployee ? `<p><strong>ພະນັກງານ:</strong> ${getEmployeeName(selectedEmployee)}</p>` : ''}
          ${monthFilter ? `<p><strong>ເດືອນ:</strong> ${monthFilter}</p>` : ''}
        </div>
      </div>

      ${reportData.map((item, index) => {
        const details = detailMap[item.preorder_id] || [];
        return `
        <div class="section">
          <p class="section-title">ສັ່ງຊື້ລຳດັບ ${index + 1} <span class="section-id">(ລະຫັດ: ${item.preorder_id})</span></p>
          <div class="inline-info">
            <p><strong>ວັນທີ:</strong> ${new Date(item.preorder_date).toLocaleDateString('en-GB')}</p>
            <p><strong>ພະນັກງານ:</strong> ${getEmployeeName(item.emp_id_create)}</p>
            <p><strong>ຜູ້ສະໜອງ:</strong> ${getSupplierName(item.sup_id)}</p>
            <p><strong>ປະເພດ:</strong> ${item.types}</p>
          </div>

          <table class="sub-table">
            <thead>
              <tr>
                <th class="text-center" style="width: 60px;">ລຳດັບ</th>
                <th>ລະຫັດ</th>
                <th>ຊື່</th>
                <th class="text-center">ຈຳນວນ</th>
                <th class="text-center">ຫົວໜ່ວຍ</th>
                <th class="text-center">ປະເພດ</th>
              </tr>
            </thead>
            <tbody>
              ${details.map((d, i) => `
                <tr>
                  <td class="text-center">${i + 1}</td>
                  <td>${d.med_id}</td>
                  <td>${d.med_name}</td>
                  <td class="text-center">${d.qty}</td>
                  <td class="text-center">${d.unit}</td>
                  <td class="text-center">${d.type_name}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        `;
      }).join('')}

    </body>
    </html>
  `;

  // ✅ เปิดหน้าต่างสำหรับพิมพ์
  const printWindow = window.open('', '_blank');
  printWindow.document.write(printContent);
  printWindow.document.close();

  printWindow.onload = () => {
    printWindow.focus();
    
    // ✅ ปิด popup หลังจากผู้ใช้ "พิมพ์หรือยกเลิก" dialog print
    printWindow.onafterprint = () => {
      printWindow.close();
    };

    // เรียกหน้าต่างพิมพ์
    printWindow.print();

    // ✅ fallback: ปิดหลัง 5 วินาที ถ้า onafterprint ไม่ทำงาน
    setTimeout(() => {
      if (!printWindow.closed) {
        printWindow.close();
      }
    }, 5000);
  };
};

  return (
    <>
      {/* ✅ Summary Cards - กล่องแรกแสดงจำนวนทั้งหมดเสมอ */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 2xl:gap-7.5 w-full mb-6">
        {/* Total Preorders - แสดงจำนวนสั่งซื้อทั้งหมดเสมอ */}
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
                ຈຳນວນສັ່ງຊື້ທັງໝົດ
              </h4>
              <p className="text-xl font-bold text-blue-700"> 
                {summaryStats.totalPreorders} ຄັ້ງ
              </p>
            </div>
          </div>
        </div>

        {/* Medicine Preorders - นับจากคอลัมน์ types */}
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
                ສັ່ງຊື້ຢາ
              </h4>
              <p className="text-xl font-bold text-green-600">
                {summaryStats.totalMedicinePreorders} ຄັ້ງ
              </p>
            </div>
          </div>
        </div>

        {/* Equipment Preorders - นับจากคอลัมน์ types */}
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
                ສັ່ງຊື້ອຸປະກອນ
              </h4>
              <p className="text-xl font-bold text-purple-600">
                {summaryStats.totalEquipmentPreorders} ຄັ້ງ
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded bg-white pt-4 dark:bg-boxdark">
        <Alerts />
        <div className="flex items-center justify-between border-b border-stroke px-4 pb-4 dark:border-strokedark flex-wrap gap-2">
          <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3">
            ລາຍງານການສັ່ງຊື້
          </h1>

          <div className="ml-auto">
            <Button
            onClick={handlePrintReport}
            className="bg-secondary2 hover:bg-secondary3"
              >
            <Printer className="w-4 h-4" />
              ພິມລາຍງານ
            </Button>
            </div>
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

            {/* ตัวกรองตามผู้สะหนอง */}
            <select
              className="border border-stroke dark:border-strokedark rounded p-2"
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
            >
              <option value="">-- ກອງຕາມຜູ້ສະໜອງ --</option>
              {[...new Set(preorders.map((preorder) => preorder.sup_id))].map((sup_id) => (
                <option key={sup_id} value={sup_id}>
                  {getSupplierName(sup_id)}
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
              {[...new Set(preorders.map((preorder) => preorder.emp_id_create))].map((empId) => {
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
              className="bg-slate-600 hover:bg-slate-800 text-white"
            >
              ລ້າງຕົວກອງ
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto shadow-md">
          <table className="w-full min-w-max table-auto">
            <thead>
              <tr className="text-left bg-gray border border-stroke">
                {OrderHead.map((header, index) => (
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
              {filterPreorder.length > 0 ? (
                filterPreorder.map((preorder, index) => (
                  <tr
                    key={index}
                    className="border-b text-md border-stroke hover:bg-gray-50"
                  >
                    <td className="px-4 py-4">{preorder.preorder_id}</td>

                    <td className="px-4 py-4">
                      {new Date(preorder.preorder_date).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </td>

                    <td className="px-4 py-4">
                      {getSupplierName(preorder.sup_id)}
                    </td>

                    <td className="px-4 py-4">
                      {getEmployeeName(preorder.emp_id_create)}
                    </td>

                    <td className="px-4 py-4">{preorder.types}</td>

                    <td className="px-3 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewPreorder(preorder.preorder_id)}
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
                  <td colSpan={6} className="py-4 text-center text-gray-500">
                    ບໍ່ມີຂໍ້ມູນ
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

              <ViewPreorder
                id={selectedId}
                onClose={() => setShowViewModal(false)}
                setShow={setShowViewModal}
                getList={fetchPreorders}
              />
            </div>
          </div>
        )}
      </div>
      
    </>
  );
};

export default ReportPreorder;