import { useEffect, useState } from 'react';
import Search from '@/components/Forms/Search';
import Alerts from '@/components/Alerts';
import TablePaginationDemo from '@/components/Tables/Pagination_two';
import Button from '@/components/Button';
import { useAppDispatch } from '@/redux/hook';
import { openAlert } from '@/redux/reducer/alert';
import { Printer } from 'lucide-react';

const columns = [
  { key: 'patient_id', name: 'ລະຫັດຄົນເຈັບ' },
  { key: 'patient_name', name: 'ຊື່ ແລະ ນາມສະກຸນ' },
  { key: 'date_addmintted', name: 'ວັນທີນັດ' },
  { key: 'status', name: 'ສະຖານະ' },
];

const ReportAppointment = () => {
  const dispatch = useAppDispatch();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // เพิ่ม state สำหรับตัวกรอง
  const [statusFilter, setStatusFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');

  const fetchAppointments = async () => {
    try {
      const res = await fetch('http://localhost:4000/src/report/appointment');
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Error fetching appointments');

      setAppointments(data.data);
      setFilteredAppointments(data.data);
    } catch (error) {
      console.error('Error:', error);
      dispatch(openAlert({
        type: 'error',
        title: 'ຜິດພາດ',
        message: 'ບໍ່ສາມາດດຶງຂໍ້ມູນນັດໝາຍໄດ້ ❌',
      }));
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // ฟังก์ชันกรองข้อมูลแบบรวม
  const applyFilters = () => {
    let filtered = [...appointments];

    // กรองตามการค้นหา
    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.patient_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.patient_surname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.status?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // กรองตามสถานะ
    if (statusFilter) {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    // กรองตามเดือน
    if (monthFilter) {
      filtered = filtered.filter((item) => {
        const itemMonth = new Date(item.date_addmintted).toISOString().slice(0, 7);
        return itemMonth === monthFilter;
      });
    }

    setFilteredAppointments(filtered);
    setPage(0); // รีเซ็ต pagination เมื่อกรองข้อมูล
  };

  // เรียกใช้ฟังก์ชันกรองเมื่อมีการเปลี่ยนแปลงใน filters
  useEffect(() => {
    applyFilters();
  }, [searchQuery, statusFilter, monthFilter, appointments]);

  // ฟังก์ชันล้างตัวกรองทั้งหมด
  const clearAllFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setMonthFilter('');
  };

  // ฟังก์ชันสำหรับพิมพ์รายงาน
  const handlePrintReport = () => {
    const reportData = filteredAppointments;
    
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>ລາຍງານນັດໝາຍ</title>
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
          
          .status-complete {
            background-color: #d4edda;
            color: #155724;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
          }
          
          .status-waiting {
            background-color: #fff3cd;
            color: #856404;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
          }
          
          .status-other {
            background-color: #f8f9fa;
            color: #6c757d;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
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
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>ລາຍງານນັດໝາຍ</h1>
          <p>Appointment Report</p>
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
            <p><strong>ຈຳນວນນັດໝາຍທັງໝົດ:</strong> ${reportData.length} ລາຍການ</p>
    
          </div>
          <div>
            ${statusFilter ? `<p><strong>ສະຖານະ:</strong> ${statusFilter}</p>` : ''}
            ${monthFilter ? `<p><strong>ເດືອນ:</strong> ${monthFilter}</p>` : ''}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th class="text-center" style="width: 60px;">ລຳດັບ</th>
              <th>ລະຫັດຄົນເຈັບ</th>
              <th>ຊື່ ແລະ ນາມສະກຸນ</th>
              <th class="text-center">ວັນທີນັດ</th>
              <th class="text-center">ສະຖານະ</th>
            </tr>
          </thead>
          <tbody>
            ${reportData.map((item, index) => `
              <tr>
                <td class="text-center">${index + 1}</td>
                <td>${item.patient_id}</td>
                <td>${item.patient_name} ${item.patient_surname}</td>
                <td class="text-center">${new Date(item.date_addmintted).toLocaleString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</td>
                <td class="text-center">
                  <span class="${
                    item.status === 'ກວດແລ້ວ' ? 'status-complete' :
                    item.status === 'ລໍຖ້າ' ? 'status-waiting' : 'status-other'
                  }">
                    ${item.status}
                  </span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>

      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');

      printWindow.document.write(printContent);
      printWindow.document.close();

      printWindow.onload = () => {
        printWindow.focus(); // สำคัญในบางเบราว์เซอร์

        // ✅ ปิด popup หลังจากผู้ใช้ “พิมพ์หรือยกเลิก” dialog print
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

  const paginatedData = filteredAppointments.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <div className="rounded bg-white pt-4 border border-stroke">
        <Alerts />
        <div className="flex items-center justify-between border-b border-stroke px-4 pb-4">
          <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark">
            ລາຍງານນັດໝາຍ
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

        <div className="p-4 space-y-4">
          {/* ช่องค้นหา */}
          <Search
            name="search"
            placeholder="ຄົ້ນຫາຊື່, ນາມສະກຸນ, ສະຖານະ..."
            className="rounded border border-stroke"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* ตัวกรองในแถวถัดไป */}
          <div className="flex flex-wrap items-center gap-2">
            {/* ตัวกรองตามสถานะ */}
            <select
              className="border border-stroke dark:border-strokedark rounded p-2"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">-- ກັອງຕາມສະຖານະ --</option>
              {[...new Set(appointments.map((item) => item.status))].map((status) => (
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
              className="bg-slate-600 hover:bg-slate-800 text-white"
            >
              ລ້າງການກັອງ
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-max table-auto">
            <thead>
              <tr className="text-left bg-gray border border-stroke">
                {columns.map((col) => (
                  <th key={col.key} className="px-4 py-3 text-form-input font-semibold">{col.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
                  <tr
                    key={item.patient_id || index}
                    className="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-4 py-3 font-medium">{item.patient_id}</td>

                    <td className="px-4 py-3 font-medium">
                      {item.patient_name} {item.patient_surname}
                    </td>
                    <td className="px-4 py-3">
                      {new Date(item.date_addmintted).toLocaleString('en-US', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false,
                      })}
                    </td>

                    <td className="px-4 py-2">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
                          item.status === 'ກວດແລ້ວ'
                            ? 'bg-green-100 text-green-700'
                            : item.status === 'ລໍຖ້າ'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-gray-500">
                    <div className="text-center">
                      <p className="text-lg">
                        ບໍ່ພົບຂໍ້ມູນນັດໝາຍ
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      <TablePaginationDemo
        count={filteredAppointments.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />
    </>
  );
};

export default ReportAppointment;
