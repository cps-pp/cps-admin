import React, { useState, useEffect } from 'react';
import { Pill, Package, Wrench, Eye, Printer } from 'lucide-react';
import Search from '@/components/Forms/Search';
import Alerts from '@/components/Alerts';
import TablePaginationDemo from '@/components/Tables/Pagination_two';
import InspectionDetailView from './InView';
import Button from '@/components/Button';
import { Empty } from 'antd';
import { URLBaseLocal } from '../../../lib/MyURLAPI';
import { useAppDispatch } from '@/redux/hook';


const ReportPer = () => {
  const dispatch = useAppDispatch();
  const [inspectionId, setInspectionId] = useState('');
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [inspectionInfo, setInspectionInfo] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredIn, setFilteredIn] = useState([]);

  // New states for detail view
  const [showDetailView, setShowDetailView] = useState(false);
  const [selectedInspectionId, setSelectedInspectionId] = useState(null);
  const [groupedData, setGroupedData] = useState([]);

  const fetchInspection = async () => {
    try {
      const res = await fetch(`${URLBaseLocal}/src/report/inspection`);
      const json = await res.json();

      console.log('API Response:', json);

      if (!res.ok) {
        throw new Error(json.message || 'Error fetching inspection');
      }

      const inspections = json.data || [];

      setInspectionInfo(inspections);

      const allMedicines = inspections.flatMap((item) => {
        return (
          item.medicines?.map((med) => ({
            ...med,
            in_id: item.in_id,
          })) || []
        );
      });


      setAllData(allMedicines);
      setFilteredData(allMedicines);

      const grouped = inspections.map((inspection) => ({
        in_id: inspection.in_id,
        ...inspection,
        totalMedicines:
          inspection.medicines?.filter((med) => med.type_name === 'ຢາ')
            .length || 0,
        totalEquipment:
          inspection.medicines?.filter((med) => med.type_name === 'ອຸປະກອນ')
            .length || 0,
        totalItems: inspection.medicines?.length || 0,
        totalValue:
          inspection.medicines?.reduce(
            (sum, med) => sum + (med.total || 0),
            0,
          ) || 0,
      }));

      // 🔥 กรองข้อมูลให้แสดงเฉพาะรายการที่มี ຈຳນວນຢາ หรือ ຈຳນວນອຸປະກອນ > 0
      const filteredGrouped = grouped.filter(
        (item) => item.totalMedicines > 0 || item.totalEquipment > 0,
      );

      setGroupedData(filteredGrouped);
    } catch (error) {
      console.error('Fetch error:', error);
      dispatch(
        openAlert({
          type: 'error',
          title: 'ຜິດພາດ',
          message: 'ບໍ່ສາມາດດຶງຂໍ້ມູນໄດ້',
        }),
      );
    }
  };

  useEffect(() => {
    fetchInspection();
  }, []);

  useEffect(() => {
    if (inspectionInfo && Array.isArray(inspectionInfo)) {
      const allMedicines = inspectionInfo.flatMap((entry) => {
        return (
          entry.medicines?.map((med) => ({
            ...med,
            in_id: entry.in_id,
          })) || []
        );
      });

      setAllData(allMedicines);
      setFilteredData(allMedicines);
    }
  }, [inspectionInfo]);

  const filterDataByTab = (data, tab) => {
    let filtered = [];

    if (tab === 'all') {
      filtered = data;
    } else if (tab === 'medicine') {
      filtered = data.filter((item) => item.type_name === 'ຢາ');
    } else if (tab === 'equipment') {
      filtered = data.filter((item) => item.type_name === 'ອຸປະກອນ');
    }

    setFilteredData(filtered);
  };

  const setActiveTabAndFilter = (tab) => {
    setActiveTab(tab);
    setPage(0);
    filterDataByTab(allData, tab);
  };

  const handleSearchQueryChange = (query) => {
    setSearchQuery(query);
    setPage(0);
    filterDataByTab(allData, activeTab);
  };

  const handlePageChange = (_, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleViewDetail = (inspectionId) => {
    setSelectedInspectionId(inspectionId);
    setShowDetailView(true);
  };

  // ฟังก์ชันสำหรับพิมพ์รายงานการจ่าย พร้อมรายละเอียด
  const handlePrintReport = async () => {
    // 🔥 กรองข้อมูลให้แสดงเฉพาะรายการที่มี ຈຳນວນຢາ หรือ ຈຳນວນອຸປະກອນ > 0
    const reportData = groupedData.filter(
      (item) =>
        item.in_id?.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (item.totalMedicines > 0 || item.totalEquipment > 0),
    );

    // 🔄 โหลดข้อมูลรายละเอียดการจ่ายทั้งหมด
    const detailMap = {}; // key: in_id => value: array of detail rows
    try {
      for (const inspection of reportData) {
        // ดึงข้อมูลรายละเอียดของแต่ละการตวจ
        const inspectionDetail = inspectionInfo.find(
          (item) => item.in_id === inspection.in_id,
        );
        detailMap[inspection.in_id] = inspectionDetail?.medicines || [];
      }
    } catch (error) {
      console.error('โหลดข้อมูลรายละเอียดไม่สำเร็จ:', error);
      dispatch(
        openAlert({
          type: 'error',
          title: 'ຜິດພາດ',
          message: 'ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນລາຍລະອຽດ',
        }),
      );
      return;
    }

    // 🔵 เริ่มสร้าง HTML รายงาน
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>ລາຍງານການຈ່າຍຢາ ແລະ ອຸປະກອນ</title>
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

          .summary-cards {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-bottom: 30px;
          }

          .summary-card {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #ddd;
            text-align: center;
          }

          .summary-card h3 {
            margin: 0 0 10px 0;
            color: #2c5aa0;
            font-size: 16px;
          }

          .summary-card p {
            margin: 0;
            font-size: 24px;
            font-weight: bold;
            color: #333;
          }

          .section {
            margin-bottom: 40px;
            page-break-inside: avoid;
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

          .text-right {
            text-align: right;
          }

          .badge {
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: bold;
            display: inline-block;
          }

          .badge-medicine {
            background-color: #dbeafe;
            color: #1e40af;
          }

          .badge-equipment {
            background-color: #dcfce7;
            color: #166534;
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

            .summary-cards {
              grid-template-columns: repeat(3, 1fr);
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>ລາຍງານການຈ່າຍຢາ ແລະ ອຸປະກອນ</h1>
          <p>Medicine and Equipment Distribution Report</p>
        </div>
        
        <div class="report-info">
          <div>
            <p><strong>ວັນທີ່ອອກລາຍງານ:</strong> ${new Date().toLocaleDateString(
              'en-GB',
              {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              },
            )}</p>
          </div>
          <div>
            <p><strong>ຈຳນວນການຕວດທັງໝົດ:</strong> ${reportData.length} ຄັ້ງ</p>
          </div>
         
        </div>

        ${reportData
          .map((item, index) => {
            const details = detailMap[item.in_id] || [];
            const medicines = details.filter((d) => d.type_name === 'ຢາ');
            const equipments = details.filter((d) => d.type_name === 'ອຸປະກອນ');

            return `
          <div class="section">
            <p class="section-title">ການຕວດລຳດັບ ${index + 1} <span class="section-id">(ລະຫັດ: ${item.in_id})</span></p>
            <div class="inline-info">
              <p><strong>ວັນທີ່ປຶ່ນປົວ:</strong> ${new Date(
                item.date,
              ).toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}</p>
              <p><strong>ຊື່ຄົນເຈັບ:</strong> ${item.patient_name} ລາຍການ</p>
              <p><strong>ລວມທັງໝົດ:</strong> ${item.totalValue != null ? item.totalValue.toLocaleString('en-GB') + ' ກີບ' : '-'}</p>
            </div>

            ${
              details.length > 0
                ? `
            <table class="sub-table">
              <thead>
                <tr>
                  <th class="text-center" style="width: 60px;">ລຳດັບ</th>
                  <th>ລະຫັດ</th>
                  <th>ຊື່</th>
                  <th class="text-center">ປະເພດ</th>
                  <th class="text-center">ຈຳນວນ</th>
                  <th class="text-center">ຫົວໜ່ວຍ</th>
                  <th class="text-center">ລາຄາຕໍ່ຫນ່ວຍ</th>
                  <th class="text-right">ລວມ</th>
                </tr>
              </thead>
              <tbody>
                ${details
                  .map(
                    (d, i) => `
                  <tr>
                    <td class="text-center">${i + 1}</td>
                    <td>${d.med_id || '-'}</td>
                    <td>${d.med_name || '-'}</td>
                    <td class="text-center">
                      <span class="badge ${d.type_name === 'ຢາ' ? 'badge-medicine' : 'badge-equipment'}">
                        ${d.type_name}
                      </span>
                    </td>
                    <td class="text-center">${d.qty || '-'}</td>
                    <td class="text-center">${d.unit || '-'}</td>
                    <td class="text-center">${d.price || '-'}</td>
                    <td class="text-right">${d.total != null ? d.total.toLocaleString('en-GB') + ' ກີບ' : '-'}</td>
                  </tr>
                `,
                  )
                  .join('')}
              </tbody>
            </table>
            `
                : '<p style="text-align: center; color: #666; font-style: italic;">ບໍ່ມີລາຍລະອຽດ</p>'
            }
          </div>
          `;
          })
          .join('')}

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

  // 🔥 กรองข้อมูลให้แสดงเฉพาะรายการที่มี ຈຳນວນຢາ หรือ ຈຳນວນອຸປະກອນ > 0
  const paginatedData = groupedData
    .filter(
      (item) =>
        item.in_id?.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (item.totalMedicines > 0 || item.totalEquipment > 0),
    )
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const getTableHeaders = () => [
    'ລະຫັດປິ່ນປົວ',
    'ຈຳນວນຢາ',
    'ຈຳນວນອຸປະກອນ',
    'ລວມລາຍການ',
    'ມູນຄ່າລວມ',
    'ການດຳເນີນງານ',
  ];

  // Render table row for grouped data
  const renderTableRow = (item, index) => (
    <tr key={index} className="border-b border-stroke hover:bg-gray-50 ">
      <td className="px-4 py-3">{item.in_id || '-'}</td>
      <td className="px-4 py-3 ">
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {item.totalMedicines === 0 ? '-' : item.totalMedicines}
        </span>
      </td>
      <td className="px-4 py-3 ">
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          {item.totalEquipment === 0 ? '-' : item.totalEquipment}
        </span>
      </td>
      <td className="px-4 py-3  font-medium">
        {item.totalItems === 0 ? '-' : item.totalItems}
      </td>
      <td className="px-4 py-3  font-medium">
        {item.totalValue != null
          ? item.totalValue.toLocaleString('en-GB') + ' ກີບ'
          : '-'}
      </td>

      <td className="px-4 py-3 ">
        <button
          onClick={() => handleViewDetail(item.in_id)}
          className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 hover:text-blue-700 transition-colors"
        >
          <Eye className="w-4 h-4 mr-1" />
          ເບີ່ງ
        </button>
      </td>
    </tr>
  );

  useEffect(() => {
    filterDataByTab(allData, activeTab);
  }, [activeTab, allData, searchQuery]);

  // 🔥 คำนวณจำนวนรวมจากข้อมูลที่กรองแล้ว (เฉพาะรายการที่มี ຈຳນວນຢາ หรือ ຈຳນວນອຸປະກອນ > 0)
  const filteredDataForStats = allData.filter((item) => {
    const inspection = groupedData.find((g) => g.in_id === item.in_id);
    return (
      inspection &&
      (inspection.totalMedicines > 0 || inspection.totalEquipment > 0)
    );
  });

  return (
    <>
      <div className="">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 w-full mb-6">
          <div className="rounded-sm border border-stroke bg-white p-4">
            <div className="flex items-center">
              <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-100 to-purple-100 text-indigo-600 shadow-inner">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-semibold text-strokedark">
                  ຈຳນວນລາຍການທັງໝົດ
                </h4>
                <p className="text-xl font-bold text-primary">
                  {groupedData.length} ຄັ້ງ
                </p>
              </div>
            </div>
          </div>

          <div className="rounded border border-stroke bg-white p-4">
            <div className="flex items-center">
              <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-green-100">
                <Pill className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-semibold text-strokedark">
                  ຈຳນວນຢາ
                </h4>
                <p className="text-xl font-bold text-green-600">
                  {filteredDataForStats.filter(
                    (item) => item.type_name === 'ຢາ',
                  ).length === 0
                    ? '-'
                    : filteredDataForStats.filter(
                        (item) => item.type_name === 'ຢາ',
                      ).length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-sm border border-stroke bg-white p-4">
            <div className="flex items-center">
              <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-stroke">
                <Wrench className="w-6 h-6 text-gray-600" />
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-semibold text-strokedark">
                  ຈຳນວນອຸປະກອນ
                </h4>
                <p className="text-xl font-bold text-gray-700">
                  {filteredDataForStats.filter(
                    (item) => item.type_name === 'ອຸປະກອນ',
                  ).length === 0
                    ? '-'
                    : filteredDataForStats.filter(
                        (item) => item.type_name === 'ອຸປະກອນ',
                      ).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Table */}
        <div className="rounded bg-white border border-stroke">
          <Alerts />
          <div className="flex items-center justify-between border-b border-stroke px-4 py-4">
            <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark ">
              ລາຍງານການຈ່າຍຢາ ແລະ ອຸປະກອນ
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

          <div className="flex gap-4 items-end p-4">
            <Search
              type="text"
              name="search"
              placeholder="ຄົ້ນຫາລະຫັດການຕວດ..."
              className="rounded border border-stroke dark:border-strokedark"
              value={searchQuery}
              onChange={(e) => {
                const query = e.target.value;
                setSearchQuery(query);

                setPage(0);
              }}
            />
          </div>

          <div className="overflow-x-auto ">
            <table className="w-full min-w-max table-auto  ">
              <thead>
                <tr className="text-left bg-gray border border-stroke">
                  {getTableHeaders().map((header, idx) => (
                    <th
                      key={idx}
                      className="px-4 py-3 text-form-input   font-semibold"
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
                        <div className="animate-spin rounded-full h-8 w-8 "></div>
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
                      <div className="text-center text-gray-500 dark:text-gray-400">
                        <div className="w-32 h-32 flex items-center justify-center mx-auto">
                          <Empty description={false} />
                        </div>
                        <p className="text-lg">
                          ບໍ່ພົບຂໍ້ມູນລາຍງານການຈ່າຍຢາແລະອຸປະກອນ
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail View Modal */}
        {showDetailView && (
          <InspectionDetailView
            show={showDetailView}
            setShow={setShowDetailView}
            inspectionId={selectedInspectionId}
            inspectionData={inspectionInfo}
          />
        )}
      </div>
      {/* 🔥 อัปเดต pagination ให้ใช้ข้อมูลที่กรองแล้ว */}
      {groupedData.filter(
        (item) =>
          item.in_id?.toLowerCase().includes(searchQuery.toLowerCase()) &&
          (item.totalMedicines > 0 || item.totalEquipment > 0),
      ).length > 0 && (
        <TablePaginationDemo
          count={
            groupedData.filter(
              (item) =>
                item.in_id?.toLowerCase().includes(searchQuery.toLowerCase()) &&
                (item.totalMedicines > 0 || item.totalEquipment > 0),
            ).length
          }
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

// import React, { useState, useEffect } from 'react';
// import {
//   Pill,
//   Package,
//   FileText,
//   DollarSign,
//   Calendar,
//   User,
//   Stethoscope,
//   Wrench,
// } from 'lucide-react';
// import Search from '@/components/Forms/Search';
// import Alerts from '@/components/Alerts';
// import TablePaginationDemo from '@/components/Tables/Pagination_two';
// const ReportPer = () => {
//   const [inspectionId, setInspectionId] = useState('');
//   const [allData, setAllData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [activeTab, setActiveTab] = useState('all');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [inspectionInfo, setInspectionInfo] = useState(null);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filteredIn, setFilteredIn] = useState([]);

//   const fetchInspection = async () => {
//     try {
//       const res = await fetch('http://localhost:4000/src/report/inspection');
//       const json = await res.json();

//       console.log('API Response:', json);

//       if (!res.ok) {
//         throw new Error(json.message || 'Error fetching inspection');
//       }

//       const inspections = json.data || [];

//       setInspectionInfo(inspections);

//       const allMedicines = inspections.flatMap((item) => {
//         return (
//           item.medicines?.map((med) => ({
//             ...med,
//             in_id: item.in_id,
//           })) || []
//         );
//       });

//       console.log('Extracted medicines:', allMedicines);

//       setAllData(allMedicines);
//       setFilteredData(allMedicines);
//     } catch (error) {
//       console.error('Fetch error:', error);
//       dispatch(
//         openAlert({
//           type: 'error',
//           title: 'ຜິດພາດ',
//           message: 'ບໍ່ສາມາດດຶງຂໍ້ມູນໄດ້',
//         }),
//       );
//     }
//   };
//   useEffect(() => {
//     fetchInspection();
//   }, []);

//   useEffect(() => {
//     if (inspectionInfo && Array.isArray(inspectionInfo)) {
//       const allMedicines = inspectionInfo.flatMap((entry) => {
//         return (
//           entry.medicines?.map((med) => ({
//             ...med,
//             in_id: entry.in_id,
//           })) || []
//         );
//       });

//       setAllData(allMedicines);
//       setFilteredData(allMedicines);
//     }
//   }, [inspectionInfo]);

//   const filterDataByTab = (data, tab) => {
//     let filtered = [];

//     if (tab === 'all') {
//       filtered = data;
//     } else if (tab === 'medicine') {
//       filtered = data.filter((item) => item.type_name === 'ຢາ');
//     } else if (tab === 'equipment') {
//       filtered = data.filter((item) => item.type_name !== 'ອຸປະກອນ');
//     }

//     setFilteredData(filtered);
//   };

//   const setActiveTabAndFilter = (tab) => {
//     setActiveTab(tab);
//     setPage(0);
//     filterDataByTab(allData, tab);
//   };

//   const handleSearchQueryChange = (query) => {
//     setSearchQuery(query);
//     setPage(0);
//     filterDataByTab(allData, activeTab);
//   };

//   const handlePageChange = (_, newPage) => {
//     setPage(newPage);
//   };

//   const handleRowsPerPageChange = (e) => {
//     setRowsPerPage(parseInt(e.target.value, 10));
//     setPage(0);
//   };

//   const paginatedData = filteredData.slice(
//     page * rowsPerPage,
//     page * rowsPerPage + rowsPerPage,
//   );

//   const getTableHeaders = () => [
//     'ລະຫັດບິນ',
//     'ລະຫັດຢາ',
//     'ຊື່ຢາ/ອຸປະກອນ',
//     'ປະເພດ',
//     'ລາຄາລວມ',
//   ];

//   // Render table row
//   const renderTableRow = (item, index) => (
//     <tr key={index} className="border-b border-stroke hover:bg-gray-50">
//       <td className="px-4 py-4">{item.in_id || '-'}</td>
//       <td className="px-4 py-4">{item.med_id || '-'}</td>
//       <td className="px-4 py-4">{item.med_name || '-'}</td>
//       <td className="px-4 py-4">
//         <span
//           className={`px-2 py-1 rounded-full text-xs font-medium ${
//             item.type_name === 'ຢາ'
//               ? 'bg-blue-100 text-blue-800'
//               : 'bg-green-100 text-green-800'
//           }`}
//         >
//           {item.type_name || '-'}
//         </span>
//       </td>
//       <td className="px-4 py-4 text-right font-medium">
//         {item.total != null ? item.total.toLocaleString('en-GB') + ' ກີບ' : '-'}
//       </td>
//     </tr>
//   );

//   useEffect(() => {
//     filterDataByTab(allData, activeTab);
//   }, [activeTab, allData, searchQuery]);

//   return (
//     <div className="">

//       <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 w-full mb-6">
//         <div className="rounded-sm border border-stroke bg-white p-4">
//           <div className="flex items-center">
//             <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-blue-100">
//               <Package className="w-6 h-6 text-blue-600" />
//             </div>
//             <div className="ml-4">
//               <h4 className="text-lg font-semibold text-strokedark">ຈຳນວນລາຍລວມ</h4>
//               <p className="text-xl font-bold text-blue-700">
//                 {filteredData.length} ລາຍການ
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="rounded border border-stroke bg-white p-4">
//           <div className="flex items-center">
//             <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-green-100">
//               <Pill className="w-6 h-6 text-green-600" />
//             </div>
//             <div className="ml-4">
//               <h4 className="text-lg font-semibold text-strokedark">ຈຳນວນຢາ</h4>
//               <p className="text-xl font-bold text-green-600">
//                 {allData.filter((item) => item.type_name === 'ຢາ').length}
//               </p>
//             </div>
//           </div>
//         </div>
//         <div className="rounded-sm border border-stroke bg-white p-4">
//           <div className="flex items-center">
//             <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-stroke">
//               <Wrench className="w-6 h-6 text-gray-600" />
//             </div>
//             <div className="ml-4">
//               <h4 className="text-lg font-semibold text-strokedark">ຈຳນວນອຸປະກອນ</h4>
//               <p className="text-xl font-bold text-gray-700">
//                 {allData.filter((item) => item.type_name === 'ອຸປະກອນ').length}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Table */}
//       <div className="rounded bg-white shadow">
//         <Alerts />
//         <div className="flex items-center justify-between border-b border-stroke px-4 py-4">
//           <h1 className="text-lg lg:text-xl font-medium text-gray-700">
//             ລາຍງານການຈ່າຍຢາ ແລະ ອຸປະກອນ
//           </h1>
//         </div>

//         {/* Tab Navigation */}
//         <div className="flex gap-2 px-4 py-3 border-b">
//           <button
//             onClick={() => setActiveTabAndFilter('all')}
//             className={`px-4 py-2 rounded-md transition-colors ${
//               activeTab === 'all'
//                 ? 'bg-blue-500 text-white'
//                 : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//             }`}
//           >
//             ທັງໝົດ ({allData.length})
//           </button>
//           <button
//             onClick={() => setActiveTabAndFilter('medicine')}
//             className={`px-4 py-2 rounded-md transition-colors ${
//               activeTab === 'medicine'
//                 ? 'bg-blue-500 text-white'
//                 : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//             }`}
//           >
//             ຢາ ({allData.filter((item) => item.type_name === 'ຢາ').length})
//           </button>
//           <button
//             onClick={() => setActiveTabAndFilter('equipment')}
//             className={`px-4 py-2 rounded-md transition-colors ${
//               activeTab === 'equipment'
//                 ? 'bg-blue-500 text-white'
//                 : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//             }`}
//           >
//             ອຸປະກອນ (
//             {allData.filter((item) => item.type_name === 'ອຸປະກອນ').length})
//           </button>
//         </div>

//         <div className="flex gap-4 items-end">
//           <Search
//             type="text"
//             name="search"
//             placeholder="ຄົ້ນຫາ..."
//             className="rounded border border-stroke dark:border-strokedark"
//             onChange={(e) => {
//               const query = e.target.value;
//               setSearchQuery(query);
//             }}
//           />
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto">
//           <table className="w-full min-w-max table-auto">
//             <thead>
//               <tr className="text-left bg-gray-50 border-b border-stroke">
//                 {getTableHeaders().map((header, idx) => (
//                   <th
//                     key={idx}
//                     className="px-4 py-3 text-gray-700 font-semibold"
//                   >
//                     {header}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td
//                     colSpan={getTableHeaders().length}
//                     className="py-8 text-center"
//                   >
//                     <div className="flex justify-center">
//                       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//                     </div>
//                   </td>
//                 </tr>
//               ) : paginatedData.length > 0 ? (
//                 paginatedData.map((item, idx) => renderTableRow(item, idx))
//               ) : (
//                 <tr>
//                   <td
//                     colSpan={getTableHeaders().length}
//                     className="py-8 text-center text-gray-500"
//                   >
//                     <div className="flex flex-col items-center">
//                       <Package className="w-12 h-12 text-gray-300 mb-2" />
//                       <p>ບໍ່ມີຂໍ້ມູນ</p>
//                     </div>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         {filteredData.length > 0 && (
//           <TablePaginationDemo
//             count={filteredData.length}
//             page={page}
//             onPageChange={handlePageChange}
//             rowsPerPage={rowsPerPage}
//             onRowsPerPageChange={handleRowsPerPageChange}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default ReportPer;
