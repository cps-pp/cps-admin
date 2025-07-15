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
import { Eye, Plus, Edit, Settings, Printer, RotateCcw } from 'lucide-react';
import OrderCreate from './create';
import EditPreorder from './EditPreorder';
import ViewPreorder from './view';
import AddDetailPreorder from './create_detail';
import { Empty, Tabs, Modal } from 'antd';
import { URLBaseLocal } from '../../lib/MyURLAPI';
import CreatePreOrder from './CreatePreOrder';
import HomeSupplier from './HomeSupplier';
import { ACCESS_TOKEN_KEY } from '../../utils/constants';
import TablePaginationDemo from '@/components/Tables/Pagination_two';

const token = localStorage.getItem(ACCESS_TOKEN_KEY);

const OrderPage = () => {
  const [preorders, setPreorders] = useState([]);
  const [filteredPreorders, setFilteredPreorders] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [isReloading, setIsReloading] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailEditModal, setShowDetailEditModal] = useState(false);
  const [selectedPreorderId, setSelectedPreorderId] = useState(null);

  const [monthFilter, setMonthFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('');
  const [employeeFilter, setEmployeeFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  const fetchPreorders = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:4000/src/preorder');
      const json = await res.json();
      setPreorders(json.data || []);
      setFilteredPreorders(json.data || []);
    } catch (err) {
      console.error('Error fetching preorders:', err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ ฟังก์ชันสำหรับการเรียงลำดับ ID - แก้ไขแล้ว
  const handleSortById = () => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newSortOrder);

    // เรียงลำดับข้อมูลใน filteredPreorders แทน preorders
    const sortedPreorders = [...filteredPreorders].sort((a, b) => {
      const extractNumber = (id) => {
        if (!id) return 0;
        const match = id.toString().match(/\d+/);
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

    setFilteredPreorders(sortedPreorders);
  };

  // ✅ ฟังก์ชันกรองข้อมูลแบบรวม - แก้ไขแล้ว
  const applyFiltersWithData = (data = preorders) => {
    let filtered = [...data];

    // กรองตามเดือน
    if (monthFilter) {
      filtered = filtered.filter((item) => {
        const itemMonth = new Date(item.preorder_date)
          .toISOString()
          .slice(0, 7);
        return itemMonth === monthFilter;
      });
    }

    // กรองตามสถานะ
    if (statusFilter !== '') {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    // กรองตามผู้สะหนอง
    if (supplierFilter !== '') {
      filtered = filtered.filter(
        (item) => item.company_name === supplierFilter,
      );
    }

    // กรองตามผู้สั่งซื้อ
    if (employeeFilter !== '') {
      filtered = filtered.filter((item) => {
        const fullName =
          `${item.emp_name || ''} ${item.emp_surname || ''}`.trim();
        return fullName === employeeFilter;
      });
    }

    // เรียงลำดับตาม sortOrder ปัจจุบัน
    filtered.sort((a, b) => {
      const extractNumber = (id) => {
        if (!id) return 0;
        const match = id.toString().match(/\d+/);
        return match ? parseInt(match[0]) : 0;
      };

      const numA = extractNumber(a.preorder_id);
      const numB = extractNumber(b.preorder_id);

      if (sortOrder === 'asc') {
        return numA - numB;
      } else {
        return numB - numA;
      }
    });

    setFilteredPreorders(filtered);
  };

  // ฟังก์ชันกรองข้อมูล
  const applyFilters = () => {
    applyFiltersWithData(preorders);
  };

  // ✅ ฟังก์ชันล้างตัวกรองทั้งหมด
  const clearAllFilters = () => {
    setMonthFilter('');
    setStatusFilter('');
    setSupplierFilter('');
    setEmployeeFilter('');
  };

  useEffect(() => {
    fetchPreorders();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [monthFilter, statusFilter, supplierFilter, employeeFilter, preorders]);

  // ✅ ฟังก์ชันสำหรับสร้างรายการ unique
  const getUniqueSuppliers = () => {
    return [
      ...new Set(preorders.map((item) => item.company_name).filter(Boolean)),
    ];
  };

  const getUniqueEmployees = () => {
    return [
      ...new Set(
        preorders
          .map((item) => {
            const fullName =
              `${item.emp_name || ''} ${item.emp_surname || ''}`.trim();
            return fullName;
          })
          .filter((name) => name !== ''),
      ),
    ];
  };

  const getUniqueStatuses = () => {
    return [...new Set(preorders.map((item) => item.status).filter(Boolean))];
  };
  const onChange = (key) => {
    console.log(key);
  };

  const handleCancel = async (id) => {
    const confirmCancel = window.confirm(
      `Are you sure you want to cancel preorder ID ${id}?`,
    );
    if (!confirmCancel) return;

    try {
      const res = await fetch(
        `http://localhost:4000/src/preorder/cancel/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.ok) {
        alert('Preorder canceled successfully.');
        fetchPreorders(); // refresh list
      } else {
        const errorData = await res.json();
        alert('Failed to cancel: ' + errorData.message);
      }
    } catch (err) {
      console.error('Cancel error:', err);
      alert('Something went wrong.');
    }
  };

  // Handle edit main preorder data
  const handleEditPreorder = (preorderId) => {
    setSelectedPreorderId(preorderId);
    setShowEditModal(true);
  };

  // Handle edit preorder details (add/remove items)
  const handleEditDetails = (preorderId) => {
    console.log('Edit details clicked for preorder:', preorderId); // Debug log
    setSelectedPreorderId(preorderId);
    setShowDetailEditModal(true);
  };

  // Handle print order as PDF
  const handlePrintOrder = (order) => {
    const { medicine, equipment } = separateItems(order.details || []);

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>ໃບສັ່ງຊື້ - ${order.preorder_id}</title>
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
          
          .order-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
          }
          
          .order-info div {
            flex: 1;
          }
          
          .order-info strong {
            color: #2c5aa0;
          }
          
          .table-container {
            margin-bottom: 30px;
          }
          
          .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #2c5aa0;
            margin-bottom: 10px;
            padding: 10px;
            background-color: #e9ecef;
            border-left: 4px solid #2c5aa0;
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
          
          .text-center {
            text-align: center;
          }
          
          .text-right {
            text-align: right;
          }
          
          @media print {
            body {
              font-size: 12px;
            }
            
            .header h1 {
              font-size: 20px;
            }
            
            .section-title {
              font-size: 16px;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>ໃບສັ່ງຊື້ຢາ ແລະ ອຸປະກອນ</h1>
          <p>Purchase Order Document</p>
        </div>
        
        <div class="order-info">
          <div>
            <p><strong>ລະຫັດສັ່ງຊື້:</strong> ${order.preorder_id}</p>
            <p><strong>ວັນທີ່ສັ່ງຊື້:</strong> ${order.preorder_date?.split(' ')[0] || order.preorder_date}</p>
          </div>
          <div>
            <p><strong>ຜູ້ສະໜອງ:</strong> ${order.company_name || 'Unknown'}</p>
            <p><strong>ຈຳນວນລາຍການທັງໝົດ:</strong> ${(order.details || []).length} ລາຍການ</p>
          </div>
          <div>
            <p><strong>ຜູ້ສ້ັ່ງຊື້:</strong> ${`${order.emp_name || ''} ${order.emp_surname || ''}`.trim() || '-'}</p>
          </div>
        </div>

        ${
          medicine.length > 0
            ? `
        <div class="table-container">
          <div class="section-title">ລາຍການຢາ (${medicine.length} ລາຍການ)</div>
          <table>
            <thead>
              <tr>
                <th class="text-center" style="width: 60px;">ລຳດັບ</th>
                <th>ຊື່ຢາ</th>
                <th class="text-center" style="width: 100px;">ຈຳນວນ</th>
                <th class="text-center" style="width: 100px;">ຫົວໜ່ວຍ</th>
              </tr>
            </thead>
            <tbody>
              ${medicine
                .map(
                  (item, index) => `
                <tr>
                  <td class="text-center">${index + 1}</td>
                  <td>${item.med_name}</td>
                  <td class="text-center">${item.qty}</td>
                  <td class="text-center">${item.unit || '-'}</td>
                  
                </tr>
              `,
                )
                .join('')}
            </tbody>
          </table>
        </div>
        `
            : ''
        }

        ${
          equipment.length > 0
            ? `
        <div class="table-container">
          <div class="section-title">ລາຍການອຸປະກອນ (${equipment.length} ລາຍການ)</div>
          <table>
            <thead>
              <tr>
                <th class="text-center" style="width: 60px;">ລຳດັບ</th>
                <th>ຊື່ອຸປະກອນ</th>
                <th class="text-center" style="width: 100px;">ຈຳນວນ</th>
                <th class="text-center" style="width: 100px;">ຫົວໜ່ວຍ</th>
              </tr>
            </thead>
            <tbody>
              ${equipment
                .map(
                  (item, index) => `
                <tr>
                  <td class="text-center">${index + 1}</td>
                  <td>${item.med_name}</td>
                  <td class="text-center">${item.qty}</td>
                  <td class="text-center">${item.unit || '-'}</td>
                </tr>
              `,
                )
                .join('')}
            </tbody>
          </table>
        </div>
        `
            : ''
        }

      </body>
      </html>
    `;

    // Create a new window for PDF generation
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();

    // Use browser's print to PDF functionality
    printWindow.onload = function () {
      printWindow.print();
      printWindow.close();
    };
  };

  // Handle page change in pagination
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedOrders = filteredPreorders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  // Function to separate medicine and equipment
  const separateItems = (details) => {
    const medicine = details.filter((item) => item.type_name === 'ຢາ');
    const equipment = details.filter((item) => item.type_name === 'ອຸປະກອນ');
    return { medicine, equipment };
  };

  // Function to get display items (first 3 items)
  const getDisplayItems = (details) => {
    return details.slice(0, 3);
  };

  // Function to handle modal close
  const handleCloseDetailModal = () => {
    setShowDetailEditModal(false);
    setSelectedPreorderId(null);
  };

  // Function to handle main edit modal close
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedPreorderId(null);
  };

  const LayoutShowTable = () => {
    return (
      <div className="rounded bg-white pt-4 border border-stroke">
        {/* ✅ ส่วนของตัวกรอง */}
        <div className="grid w-full gap-4 p-4">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {/* ตัวกรองตามผู้สะหนอง */}
            <select
              className="border border-stroke dark:border-strokedark rounded p-2 min-w-40"
              value={supplierFilter}
              onChange={(e) => setSupplierFilter(e.target.value)}
            >
              <option value="">-- ຄົ້ນຫາຜູ້ສະໜອງ --</option>
              {getUniqueSuppliers().map((supplier) => (
                <option key={supplier} value={supplier}>
                  {supplier}
                </option>
              ))}
            </select>

            {/* ตัวกรองตามผู้สั่งซื้อ */}
            <select
              className="border border-stroke dark:border-strokedark rounded p-2 min-w-40"
              value={employeeFilter}
              onChange={(e) => setEmployeeFilter(e.target.value)}
            >
              <option value="">-- ຄົ້ນຫາຜູ້ສັ່ງຊື້ --</option>
              {getUniqueEmployees().map((employee) => (
                <option key={employee} value={employee}>
                  {employee}
                </option>
              ))}
            </select>

            {/* ตัวกรองตามสถานะ */}
            <select
              className="border border-stroke dark:border-strokedark rounded p-2 min-w-32"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">-- ຄົ້ນຫາສະຖານະ --</option>
              {getUniqueStatuses().map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
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
              ລ້າງການຄົ້ນຫາ
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-max table-auto">
            <thead>
              <tr className="text-left bg-gray border border-stroke">
                <th
                  className="px-4 py-3 tracking-wide font-semibold text-form-input cursor-pointer hover:bg-gray-100 hover:text-gray-800 select-none"
                  onClick={handleSortById}
                >
                  <div className="flex items-center gap-2">
                    ລະຫັດສັ່ງຊື້
                    <span
                      className={`ml-1 inline-block text-md font-semibold transition-colors duration-200 ${
                        sortOrder === 'asc' ? 'text-green-500' : 'text-red-500'
                      }`}
                    >
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  </div>
                </th>
                <th className="px-4 py-3 tracking-wide font-semibold text-form-input">
                  ວັນທີສັ່ງຊື້
                </th>
                <th className="px-4 py-3 tracking-wide font-semibold text-form-input">
                  ສະຖານະ
                </th>
                <th className="px-4 py-3 tracking-wide font-semibold text-form-input">
                  ຜູ້ສະໜອງ
                </th>
                <th className="px-4 py-3 tracking-wide font-semibold text-form-input">
                  ລາຍລະອຽດ
                </th>
                <th className="px-4 py-3 tracking-wide font-semibold text-form-input">
                  ຜູ້ສັ່ງຊື້
                </th>
                <th className="px-4 py-3 tracking-wide font-semibold text-form-input">
                  ຈັດການ
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((order, index) => {
                  const { medicine, equipment } = separateItems(
                    order.details || [],
                  );
                  const displayItems = getDisplayItems(order.details || []);
                  const hasMoreItems = (order.details || []).length > 3;

                  return (
                    <tr
                      key={order.preorder_id}
                      className="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="px-4 py-4">{order.preorder_id}</td>
                      <td className="px-4 py-4">
                        {order.preorder_date?.split(' ')[0] ||
                          order.preorder_date}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-block rounded-full px-3 mt-3 py-1 text-center text-sm font-medium ${
                            order.status === 'WAITING'
                              ? 'bg-yellow-100 text-yellow-800'
                              : order.status === 'SUCCESS'
                                ? 'bg-green-200 text-green-800'
                                : 'bg-red-200 text-red-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        {order.company_name ?? 'Unknown'}
                      </td>
                      <td className="px-4 py-4">
                        <div className="max-w-xs relative">
                          <table className="w-full text-sm border border-stroke">
                            <thead>
                              <tr className="border-b bg-gray-50">
                                <th className="text-left px-2 py-1 border-r">
                                  ຢາ({medicine.length}) ອຸປະກອນ(
                                  {equipment.length})
                                </th>
                                <th className="text-right px-2 py-1">ຈຳນວນ</th>
                              </tr>
                            </thead>
                            <tbody>
                              {displayItems.map((detail) => (
                                <tr key={detail.detail_id} className="border-b">
                                  <td className="px-2 py-1 border-r">
                                    {detail.med_name}
                                  </td>
                                  <td className="px-2 py-1 text-right">
                                    {detail.qty}
                                  </td>
                                </tr>
                              ))}
                              {hasMoreItems && (
                                <tr>
                                  <td
                                    colSpan={2}
                                    className="px-2 py-2 text-center text-gray-500 text-xs relative"
                                  >
                                    <span className="cursor-pointer hover:text-gray-700 group relative inline-block">
                                      ... ແລະອີກ{' '}
                                      {(order.details || []).length - 3} ລາຍການ
                                      {/* Hover Tooltip */}
                                      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-1 bg-white border border-gray-300 rounded shadow-xl z-[9999] p-4 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-150 min-w-max max-w-4xl pointer-events-none group-hover:pointer-events-auto hover:opacity-100 hover:pointer-events-auto">
                                        <div className="text-sm font-medium mb-3 text-center">
                                          ລາຍການທັງໝົດ (
                                          {(order.details || []).length} ລາຍການ)
                                        </div>

                                        <div className="flex gap-4">
                                          {/* Medicine Table */}
                                          {medicine.length > 0 && (
                                            <div className="flex-1">
                                              <div className="text-sm font-medium mb-2 text-blue-600">
                                                ຢາ ({medicine.length} ລາຍການ)
                                              </div>
                                              <div className="max-h-40 overflow-y-auto">
                                                <table className="w-full text-sm border border-blue-200">
                                                  <thead>
                                                    <tr className="border-b bg-blue-50 sticky top-0">
                                                      <th className="text-left px-2 py-1 border-r">
                                                        ຊື່ຢາ
                                                      </th>
                                                      <th className="text-right px-2 py-1">
                                                        ຈຳນວນ
                                                      </th>
                                                    </tr>
                                                  </thead>
                                                  <tbody>
                                                    {medicine.map((detail) => (
                                                      <tr
                                                        key={detail.detail_id}
                                                        className="border-b"
                                                      >
                                                        <td className="px-2 py-1 border-r text-left">
                                                          {detail.med_name}
                                                        </td>
                                                        <td className="px-2 py-1 text-right">
                                                          {detail.qty}
                                                        </td>
                                                      </tr>
                                                    ))}
                                                  </tbody>
                                                </table>
                                              </div>
                                            </div>
                                          )}

                                          {/* Equipment Table */}
                                          {equipment.length > 0 && (
                                            <div className="flex-1">
                                              <div className="text-sm font-medium mb-2 text-green-600">
                                                ອຸປະກອນ ({equipment.length}{' '}
                                                ລາຍການ)
                                              </div>
                                              <div className="max-h-40 overflow-y-auto">
                                                <table className="w-full text-sm border border-green-200">
                                                  <thead>
                                                    <tr className="border-b bg-green-50 sticky top-0">
                                                      <th className="text-left px-2 py-1 border-r">
                                                        ຊື່ອຸປະກອນ
                                                      </th>
                                                      <th className="text-right px-2 py-1">
                                                        ຈຳນວນ
                                                      </th>
                                                    </tr>
                                                  </thead>
                                                  <tbody>
                                                    {equipment.map((detail) => (
                                                      <tr
                                                        key={detail.detail_id}
                                                        className="border-b"
                                                      >
                                                        <td className="px-2 py-1 border-r text-left">
                                                          {detail.med_name}
                                                        </td>
                                                        <td className="px-2 py-1 text-right">
                                                          {detail.qty}
                                                        </td>
                                                      </tr>
                                                    ))}
                                                  </tbody>
                                                </table>
                                              </div>
                                            </div>
                                          )}
                                        </div>

                                        {/* Arrow pointing down */}
                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-300"></div>
                                      </div>
                                    </span>
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>

                          {/* Edit Details Icon - positioned at bottom right of details table */}
                          {order.status === 'WAITING' && (
                            <button
                              onClick={() =>
                                handleEditDetails(order.preorder_id)
                              }
                              className="absolute -bottom-2 -right-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full p-1.5 shadow-lg transition-colors duration-200"
                              title="ແກ້ໄຂລາຍລະອຽດສິນຄ້າ"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {`${order.emp_name ?? ''} ${order.emp_surname ?? ''}`.trim() ||
                          '-'}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {/* Print Button - Available for all orders */}
                          <button
                            onClick={() => handlePrintOrder(order)}
                            className="bg-Third3 hover:bg-Third4 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                            title="ພິມໃບສັ່ງຊື້"
                          >
                            <Printer className="w-3 h-3" />
                            ພິມ
                          </button>

                          {/* Edit and Cancel buttons - Only for WAITING orders */}
                          {order.status === 'WAITING' && (
                            <>
                              {/* <button
                                onClick={() =>
                                  handleEditPreorder(order.preorder_id)
                                }
                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                                title="ແກ້ໄຂຂໍ້ມູນຫຼັກ"
                              >
                                <Edit className="w-3 h-3" />
                                ແກ້ໄຂ
                              </button> */}
                              <button
                                onClick={() => handleCancel(order.preorder_id)}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                              >
                                ຍົກເລິກ
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-4 text-center text-gray-500">
                    <div className="text-center">
                      <div className="w-32 h-32 flex items-center justify-center mx-auto">
                        <Empty description={false} />
                      </div>
                      <p className="text-lg">ບໍ່ພົບຂໍ້ມູນ</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <TablePaginationDemo
          count={filteredPreorders.length}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
        />

        {showEditModal && selectedPreorderId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
            <div className="rounded-lg w-full max-w-2xl bg-white relative">
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

              <EditPreorder
                id={selectedPreorderId}
                onClose={handleCloseEditModal}
                setShow={setShowEditModal}
                getList={fetchPreorders}
              />
            </div>
          </div>
        )}

        {/* Edit Details Modal - ใช้ AddDetailPreorder component */}
        {showDetailEditModal && selectedPreorderId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
            <div className="rounded-lg w-full max-w-2xl bg-white relative">
              <button
                onClick={() => setShowDetailEditModal(false)}
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
                id={selectedPreorderId}
                onClose={handleCloseDetailModal}
                setShow={setShowDetailEditModal}
                getList={fetchPreorders}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  const items = [
    {
      key: '1',
      label: 'ລາຍການສັ່ງ',
      children: <LayoutShowTable />,
    },
    {
      key: '2',
      label: 'ສ້າງການສັ່ງຊື້',
      children: <CreatePreOrder tab={2} />,
    },
    // {
    //   key: '3',
    //   label: 'ລາຍການຜູ້ສະໜອງ',
    //   children: <HomeSupplier tab={3} />,
    // },
  ];

  return (
    <>
      <div className="flex items-center justify-between border-b border-stroke pb-2 ">
        <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3">
          ຈັດການຂໍ້ມູນການສັ່ງຊື້
        </h1>
        <button
          onClick={async () => {
            setIsReloading(true);
            await fetchPreorders();
            setIsReloading(false);
          }}
          disabled={isReloading}
          className={`
    inline-flex items-center gap-2 px-4 py-2 text-md font-medium rounded 
    border border-Third3 bg-Third3/10 text-secondary2 
    hover:bg-blue-Third3/20 disabled:opacity-50 
    transition-all duration-300 ease-in-out
    ${isReloading ? 'bg-Third3 cursor-not-allowed' : 'hover:scale-105'}
  `}
        >
          <RotateCcw
            className={`w-4 h-4 ${isReloading ? 'animate-spin' : ''}`}
          />
          {isReloading ? 'ກຳລັງໂຫຼດ...' : 'ໂຫຼດຂໍ້ມູນໃໝ່'}
        </button>
      </div>
      <div className="flex flex-col ">
        <div className="flex-1 overflow-auto p-4 bg-white">
          <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
        </div>
      </div>
    </>
  );
};

export default OrderPage;
