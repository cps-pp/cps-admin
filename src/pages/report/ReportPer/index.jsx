import React, { useState, useEffect } from 'react';
import Search from '@/components/Forms/Search';
import { useAppDispatch } from '@/redux/hook';
import TablePaginationDemo from '@/components/Tables/Pagination_two';
import { openAlert } from '@/redux/reducer/alert';
import Alerts from '@/components/Alerts';

const ReportPer = () => {
  const [activeTab, setActiveTab] = useState('medicine'); // medicine, equipment
  const [reportData, setReportData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [prescriptionId, setPrescriptionId] = useState('');
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [summaryStats, setSummaryStats] = useState({
    totalMedicines: 0,
    totalEquipment: 0,
    lowStockItems: 0,
  });

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const medType = activeTab === 'medicine' ? 'M1' : activeTab === 'equipment' ? 'M2' : '';
      const url = `http://localhost:4000/src/report/prescription?id=${prescriptionId}&med_type=${medType}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      const list = data.detail || [];

      setReportData(list);
      setFilteredData(list);

      setSummaryStats({
        totalMedicines: list.filter((i) => i.medtype_id === 'M1').length,
        totalEquipment: list.filter((i) => i.medtype_id === 'M2').length,
        lowStockItems: list.filter((item) => (item.qty || 0) < 10).length,
      });
    } catch (error) {
      console.error(error);
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

  // Search filter effect
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredData(reportData);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredData(
        reportData.filter(
          (item) =>
            (item.med_name && item.med_name.toLowerCase().includes(q)) ||
            (item.med_id && item.med_id.toLowerCase().includes(q)) ||
            (item.medtype_id && item.medtype_id.toLowerCase().includes(q)),
        ),
      );
    }
  }, [searchQuery, reportData]);

  // Fetch data when tab changes or prescription ID changes
  useEffect(() => {
    fetchReportData();
    setPage(0);
    setSearchQuery('');
  }, [activeTab, prescriptionId]);

  // Pagination handlers
  const handlePageChange = (_, newPage) => {
    setPage(newPage);
  };
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const getTableHeaders = () => ['ລະຫັດ', 'ຊື່', 'ຈຳນວນທີ່ຈ່າຍໄປ', 'ລາຄາ'];

  const renderTableRow = (item, index) => (
    <tr
      key={index}
      className="border-b border-stroke  hover:bg-gray-50 "
    >
      <td className="px-4 py-4">{item.med_id || '-'}</td>
      <td className="px-4 py-4">{item.med_name || '-'}</td>
      <td className="px-4 py-4">{item.qty || '-'}</td>
      <td className="px-4 py-4">
        {item.price != null ? item.price.toLocaleString('en-US') : '-'}
      </td>
    </tr>
  );

  return (
    <>
     <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 2xl:gap-7.5 w-full mb-6">
      <div className="rounded-sm border border-stroke bg-white p-4 ">
        <div className="flex items-center">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-blue-100 ">
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
            <h4 className="text-lg font-semibold text-strokedark ">
              {activeTab === 'medicine' ? 'ຈຳນວນ' : 'ຈຳນວນ'}
            </h4>
            <p className="text-xl font-bold text-blue-700 ">
              {filteredData.length} ລາຍການ
            </p>
          </div>
        </div>
      </div>

    
      <div className="rounded-sm border border-stroke bg-white p-4 ">
        <div className="flex items-center">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-orange-100">
            <svg
              className="w-6 h-6 text-orange-600"
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
              {activeTab === 'medicine' ? 'ຈຳນວນການຈ່າຍຢາ' : 'ຈຳນວນການຈ່າຍອຸປະກອນ'}
            </h4>
            <p className="text-xl font-bold text-orange-600">
              {filteredData.reduce((sum, item) => sum + (item.qty || 0), 0)}
            </p>
          </div>
         
        </div>
      </div>
    </div>

      <div className="rounded bg-white pt-4 dark:bg-boxdark">
        <Alerts />
        <div className="flex items-center justify-between border-b border-stroke px-4 pb-4 dark:border-strokedark">
          <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3 ">
            ລາຍງານການຢາແລະອຸປະກອນ
          </h1>
        </div>

        <div className="px-4 mt-4">
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-strokedark dark:text-white">
              Prescription ID
            </label>
            <input
              type="text"
              value={prescriptionId}
              onChange={(e) => setPrescriptionId(e.target.value)}
              className="w-full rounded border border-stroke bg-transparent px-3 py-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              placeholder="กรอก Prescription ID"
            />
          </div>
        </div>

        <div className="flex gap-4 px-4 ">
          <button
            onClick={() => setActiveTab('medicine')}
            className={`px-4 py-2 ${
              activeTab === 'medicine'
                ? 'bg-blue-500 text-white rounded'
                : 'bg-gray-200'
            }`}
          >
            ຢາ
          </button>
          <button
            onClick={() => setActiveTab('equipment')}
            className={`px-4 py-2 ${
              activeTab === 'equipment'
                ? 'bg-blue-500 text-white rounded'
                : 'bg-gray-200'
            }`}
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
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
          />
        </div>

        <div className="overflow-x-auto shadow-md">
          <table className="w-full min-w-max table-auto">
            <thead>
              <tr className="text-left bg-gray border border-stroke">
                {getTableHeaders().map((header, idx) => (
                  <th
                    key={idx}
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
                paginatedData.map((item, idx) => renderTableRow(item, idx))
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

export default ReportPer;