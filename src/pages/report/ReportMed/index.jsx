import React, { useState, useEffect } from 'react';
import Search from '@/components/Forms/Search';
import { useAppDispatch } from '@/redux/hook';
import TablePaginationDemo from '@/components/Tables/Pagination_two';
import { openAlert } from '@/redux/reducer/alert';
import Alerts from '@/components/Alerts';

const ReportMed = () => {
  const [activeTab, setActiveTab] = useState('medicine'); // medicine, equipment
  const [reportData, setReportData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Summary stats
  const [summaryStats, setSummaryStats] = useState({
    totalMedicines: 0,
    totalMedicineStock: 0,
    totalEquipment: 0,
    totalEquipmentStock: 0,
    lowStockItems: 0,
  });

  const fetchMedicinesWithStock = async () => {
    try {
      setLoading(true);

      const medicineURL =
        activeTab === 'medicine'
          ? 'http://localhost:4000/src/manager/medicines/M1'
          : 'http://localhost:4000/src/manager/medicines/M2';

      // ดึงข้อมูลรายการยา/อุปกรณ์ตาม tab
      const response = await fetch(medicineURL);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const medicineData = await response.json();

      // ดึงข้อมูล stock
      const stockResponse = await fetch(
        'http://localhost:4000/src/report/stock',
      );
      if (!stockResponse.ok) {
        throw new Error(`HTTP error! Status: ${stockResponse.status}`);
      }
      const stockData = await stockResponse.json();

      // รวม stock เข้ากับ medicines
      const medicinesWithStock = (medicineData.data || []).map((item) => {
        const stockInfo = (stockData.data || []).find(
          (stock) => stock.medicine_id === item.med_id,
        );
        return {
          ...item,
          quantity: stockInfo ? stockInfo.quantity : 0,
          unit: stockInfo ? stockInfo.unit : '-',
          category: stockInfo ? stockInfo.category : item.medtype_id,
        };
      });

      setReportData(medicinesWithStock);
      setFilteredData(medicinesWithStock);

      // สรุปผลรวม
      const totalStock = medicinesWithStock.reduce(
        (sum, item) => sum + (item.quantity || 0),
        0,
      );
      const lowStock = medicinesWithStock.filter(
        (item) => (item.quantity || 0) < 10,
      ).length;

      if (activeTab === 'medicine') {
        setSummaryStats((prev) => ({
          ...prev,
          totalMedicines: medicinesWithStock.length,
          totalMedicineStock: totalStock,
          lowStockItems: lowStock,
        }));
      } else {
        setSummaryStats((prev) => ({
          ...prev,
          totalEquipment: medicinesWithStock.length,
          totalEquipmentStock: totalStock,
          lowStockItems: lowStock,
        }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      dispatch(
        openAlert({
          type: 'error',
          title: 'ເກີດຂໍ້ຜິດພາດ',
          message: 'ບໍ່ສາມາດດຶງຂໍ້ມູນໄດ້',
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(0);
    setSearchQuery('');
    // Refetch data for the new tab
    fetchMedicinesWithStock();
  };

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredData(reportData);
    } else {
      const filtered = reportData.filter((item) => {
        const searchStr = searchQuery.toLowerCase();
        return (
          (item.med_name && item.med_name.toLowerCase().includes(searchStr)) ||
          (item.med_id && item.med_id.toLowerCase().includes(searchStr)) ||
          (item.medtype_id && item.medtype_id.toLowerCase().includes(searchStr))
        );
      });
      setFilteredData(filtered);
    }
  }, [searchQuery, reportData]);

  // Pagination handlers
  const handlePageChange = (_, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  // Table headers
  const getTableHeaders = () => {
    return ['ລະຫັດ', 'ຊື່', 'ຈຳນວນຄົງເຫຼືອ', 'ສະຖານະ'];
  };
  useEffect(() => {
    fetchMedicinesWithStock();
  }, [activeTab]);

  // Render table row
  const renderTableRow = (item, index) => {
    const globalIndex = page * rowsPerPage + index + 1;

    return (
      <tr
        key={index}
        className="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-gray-800"
      >
        <td className="px-4 py-4">{item.med_id || '-'}</td>
        <td className="px-4 py-4">{item.med_name || '-'}</td>
     
        <td className="px-4 py-4">
          <span
            className={`font-medium ${(item.qty || 0) < 10 ? 'text-red-600' : 'text-green-600'}`}
          >
            {item.qty || 0}
          </span>
        </td>
        <td className="px-4 py-4 ">
          <span
            className={`inline-block rounded-full px-3 py-1 text-sm font-medium  ${
              (item.qty || 0) < 10
                ? 'bg-red-100 text-red-700'
                : (item.qty || 0) < 50
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-green-100 text-green-700'
            }`}
          >
            {(item.qty || 0) < 10
              ? 'ກຳລັງຈະໝົດ'
              : (item.qty || 0) < 50
                ? 'ໃກ້ໝົດ'
                : 'ພຽງພໍ'}
          </span>
        </td>
      </tr>
    );
  };

  // Load initial data
  useEffect(() => {
    fetchMedicinesWithStock();
  }, []);

  return (
    <>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 2xl:gap-7.5 w-full mb-6">
        {/* Total Items */}
        <div className="rounded-sm border border-stroke bg-white p-4">
          <div className="flex items-center">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-blue-100">
              <svg
                class="w-[25px] h-[25px] text-form-strokedark"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2.1"
                  d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-6 5h6m-6 4h6M10 3v4h4V3h-4Z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h4 className="text-lg font-semibold text-strokedark">
                {activeTab === 'medicine'
                  ? 'ຈຳນວນຢາທັງໝົດ'
                  : 'ຈຳນວນອຸປະກອນທັງໝົດ'}
              </h4>
              <p className="text-xl font-bold text-blue-700">
                {activeTab === 'medicine'
                  ? summaryStats.totalMedicines
                  : summaryStats.totalEquipment}
              </p>
            </div>
          </div>
        </div>

        {/* Total Stock */}
        {/* <div className="rounded-sm border border-stroke bg-white p-4 ">
          <div className="flex items-center">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
              <svg
                className="w-6 h-6"
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
              <h4 className="text-lg font-semibold text-strokedark dark:text-white">
                {activeTab === 'medicine'
                  ? 'ຈຳນວນຢາຄົງເຫຼືອ'
                  : 'ຈຳນວນອຸປະກອນຄົງເຫຼືອ'}
              </h4>
              <p className="text-xl font-bold text-yellow-500 dark:text-yellow-300">
                {activeTab === 'medicine'
                  ? summaryStats.totalMedicineStock
                  : summaryStats.totalEquipmentStock}
              </p>
            </div>
          </div>
        </div> */}

        {/* Low Stock Items */}
        <div className="rounded-sm border border-stroke bg-white p-4 ">
          <div className="flex items-center">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h4 className="text-lg font-semibold text-strokedark dark:text-white">
                {activeTab === 'medicine' ? 'ຢາໃກ້ໝົດ' : 'ອຸປະກອນໃກ້ໝົດ'}
              </h4>
              <p className="text-xl font-bold text-red-500 dark:text-red-300">
                {summaryStats.lowStockItems}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded bg-white pt-4 dark:bg-boxdark">
        <Alerts />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-stroke px-4 pb-4 dark:border-strokedark">
          <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3 ">
            ລາຍງານການຢາແລະອຸປະກອນ
          </h1>
        </div>

        <div className="flex gap-4 px-4 mt-4 ">
          <button
            onClick={() => setActiveTab('medicine')}
            className={`px-4 py-2 ${activeTab === 'medicine' ? 'bg-blue-500 text-white rounded' : 'bg-gray-200'}`}
          >
            ຢາ
          </button>
          <button
            onClick={() => setActiveTab('equipment')}
            className={`px-4 py-2 ${activeTab === 'equipment' ? 'bg-blue-500 text-white rounded' : 'bg-gray-200'}`}
          >
            ອຸປະກອນ
          </button>
        </div>

        <div className="grid w-full gap-4 p-4">
          <Search
            type="text"
            name="search"
            placeholder="ຄົ້ນຫາ..."
            className="rounded border border-stroke dark:border-strokedark"
            onChange={(e) => {
              const query = e.target.value;
              setSearchQuery(query);
            }}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto shadow-md">
          <table className="w-full min-w-max table-auto">
            <thead>
              <tr className="text-left bg-gray border border-stroke">
                {getTableHeaders().map((header, index) => (
                  <th
                    key={index}
                    className="px-4 py-3 text-form-input font-semibold"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={getTableHeaders().length}
                    className="py-8 text-center"
                  >
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  </td>
                </tr>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((item, index) => renderTableRow(item, index))
              ) : (
                <tr>
                  <td
                    colSpan={getTableHeaders().length}
                    className="py-8 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center">
                      <p>ບໍ່ມີຂໍ້ມູນ</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {filteredData.length > 0 && (
        <TablePaginationDemo
          count={filteredData.length}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      )}
    </>
  );
};

export default ReportMed;
