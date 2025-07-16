import { useEffect, useState } from 'react';
import Search from '@/components/Forms/Search';
import { TableAction } from '@/components/Tables/TableAction';
import ConfirmModal from '@/components/Modal';
import { useAppDispatch } from '@/redux/hook';
import TablePaginationDemo from '@/components/Tables/Pagination_two';
import { openAlert } from '@/redux/reducer/alert';
import Alerts from '@/components/Alerts';
import { Pay } from './colum/pay';
import { Empty } from 'antd';
import { URLBaseLocal } from '../../../lib/MyURLAPI';
import Button from '@/components/Button';
import { Printer } from 'lucide-react';

const ReportPay = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [paymentTypeFilter, setPaymentTypeFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      let url = `${URLBaseLocal}/src/report/payment`;
      const params = new URLSearchParams();
      

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setPayments(data.data);
      setFilteredPayments(data.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
      dispatch(
        openAlert({
          type: 'error',
          title: 'ຂໍ້ຜິດພາດ',
          message: 'ບໍ່ສາມາດດຶງຂໍ້ມູນການຊຳລະເງີນໄດ້',
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    let filtered = payments;

    // Filter by search query
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(
        (payment) =>
          payment.payment_id?.toString().includes(searchQuery.toLowerCase()) ||
          payment.invoice_id?.toString().includes(searchQuery.toLowerCase()) ||
          payment.payment_method
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          payment.payment_status
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()),
      );
    }

    // Filter by payment type
    if (paymentTypeFilter) {
      filtered = filtered.filter(
        (payment) => payment.pay_type?.toUpperCase() === paymentTypeFilter.toUpperCase(),
      );
    }

    // Filter by month
    if (monthFilter) {
      filtered = filtered.filter((payment) => {
        const paymentDate = new Date(payment.date);
        const filterMonth = new Date(monthFilter + '-01');
        return paymentDate.getFullYear() === filterMonth.getFullYear() &&
               paymentDate.getMonth() === filterMonth.getMonth();
      });
    }

    setFilteredPayments(filtered);
  }, [searchQuery, payments, paymentTypeFilter, monthFilter]);

  // ฟังก์ชันล้างตัวกรองทั้งหมด
  const clearAllFilters = () => {
    setSearchQuery('');
    setPaymentTypeFilter('');
    setMonthFilter('');
  };

  // ฟังก์ชันสำหรับพิมพ์รายงาน
  const handlePrintReport = () => {
    const reportData = filteredPayments;
    const totalAmount = reportData.reduce(
      (sum, payment) => sum + (Number(payment.paid_amount) || 0),
      0,
    );
    
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>ລາຍງານການຊຳລະເງີນ</title>
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
            padding: 10px;
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
          
          .status-cash {
            background-color: #d4edda;
            color: #155724;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
          }
          
          .status-transfer {
            background-color: #cce5ff;
            color: #0066cc;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
          }
          
          .status-refund {
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
          
          .total-row {
            background-color: #f8f9fa;
            font-weight: bold;
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
          <h1>ລາຍງານການຊຳລະເງີນ</h1>
          <p>Payment Report</p>
        </div>
        
        <div class="report-info">
          <div>
            <p><strong>ວັນທີ່ອອກລາຍງານ:</strong> ${new Date().toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            })}</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th class="text-center" style="width: 60px;">ລຳດັບ</th>
              <th>Pay ID</th>
              <th>Invoice ID</th>
              <th class="text-center">ວັນທີ່ຊຳລະ</th>
              <th class="text-center">ປະເພດການຊຳລະ</th>
              <th class="text-center">ສະຖານະ</th>
              <th class="text-right">ຍອດເງີນ</th>
            </tr>
          </thead>
          <tbody>
            ${reportData.map((payment, index) => `
              <tr>
                <td class="text-center">${index + 1}</td>
                <td>${payment.pay_id}</td>
                <td>${payment.in_id}</td>
                <td class="text-center">${new Date(payment.date).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })}</td>
                <td class="text-center">
                  <span class="${
                    payment.pay_type?.toUpperCase() === 'CASH' ? 'status-cash' :
                    payment.pay_type?.toUpperCase() === 'TRANSFER' ? 'status-transfer' :
                    payment.pay_type?.toUpperCase() === 'REFUND' ? 'status-refund' : 'status-other'
                  }">
                    ${payment.pay_type?.toUpperCase() || 'N/A'}
                  </span>
                </td>
                <td class="text-center">
                  <span class="status-cash">
                    ${payment.payment_status}
                  </span>
                </td>
                <td class="text-right">${Number(payment.paid_amount).toLocaleString('en-GB')}</td>
              </tr>
            `).join('')}
            <tr class="total-row">
              <td colspan="6" class="text-right"><strong>ລວມທັງໝົດ:</strong></td>
              <td class="text-right"><strong>${totalAmount.toLocaleString('en-GB')} ກີບ</strong></td>
            </tr>
          </tbody>
        </table>

      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.focus();

      printWindow.onafterprint = () => {
        printWindow.close();
      };

      printWindow.print();

      setTimeout(() => {
        if (!printWindow.closed) {
          printWindow.close();
        }
      }, 5000);
    };
  };

  const handlePageChange = (_, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedPayments = filteredPayments.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const totalCount = filteredPayments.length;

  const totalAmount = filteredPayments.reduce(
    (sum, payment) => sum + (Number(payment.paid_amount) || 0),
    0,
  );

  const formattedTotalAmount = `${totalAmount.toLocaleString('en-US')} ກີບ`;

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 2xl:gap-7.5 w-full mb-6">
        <div className="rounded-sm border border-stroke bg-white p-4">
          <div className="flex items-center">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-100 to-purple-100 text-indigo-600 shadow-inner">
              <svg
                className="w-[25px] h-[25px] text-primary"
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
              <h4 className="text-lg font-semibold  text-form-strokedark">
                ຈຳນວນລາຍການຊຳລະ
              </h4>
              <p className="text-xl font-bold text-primary">
                {totalCount} ລາຍການ
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white p-4">
          <div className="flex items-center">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-green-100">
              <svg
                className="w-[32px] h-[32px] text-green-700 "
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
                  strokeWidth="2.4"
                  d="M5 11.917 9.724 16.5 19 7.5"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h4 className="text-lg font-semibold text-form-strokedark">
                ຍອດຊຳລະທັງໝົດ
              </h4>
              <p className="text-xl font-bold text-primary">
                <p>{formattedTotalAmount}</p>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded bg-white pt-4 border border-stroke">
        <Alerts />
        <div className="flex items-center justify-between border-b border-stroke px-4 pb-4 dark:border-strokedark">
          <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3">
            ລາຍງານການຊຳລະເງີນ
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
            type="text"
            name="search"
            placeholder="ຄົ້ນຫາ Invoice ID, ວິທີການຊຳລະ..."
            className="rounded border border-stroke dark:border-strokedark"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* ตัวกรองในแถวถัดไป */}
          <div className="flex flex-wrap items-center gap-2">
            {/* ตัวกรองตามประเภทการชำระ */}
            <select
              className="border border-stroke dark:border-strokedark rounded p-2"
              value={paymentTypeFilter}
              onChange={(e) => setPaymentTypeFilter(e.target.value)}
            >
              <option value="">-- ກັອງຕາມປະເພດການຊຳລະ --</option>
              {[...new Set(payments.map((payment) => payment.pay_type))].map((type) => (
                <option key={type} value={type}>
                  {type?.toUpperCase()}
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

        {/* Table */}
        <div className="overflow-x-auto  ">
          <table className="w-full min-w-max table-auto  ">
            <thead>
              <tr className="text-left bg-gray border border-stroke">
                <th className="px-4 py-3 tracking-wide text-form-input font-semibold">Pay ID</th>
                <th className="px-4 py-3 tracking-wide text-form-input font-semibold">Invoice ID</th>
                <th className="px-4 py-3 tracking-wide text-form-input font-semibold">ວັນທີ່ຊຳລະ</th>
                <th className="px-4 py-3 tracking-wide text-form-input font-semibold">ປະເພດການຊຳລະ</th>
                <th className="px-4 py-3 tracking-wide text-form-input font-semibold">ສະຖານະ</th>
                <th className="px-4 py-3 tracking-wide text-form-input font-semibold text-right">ຍອດເງີນ</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <span className="ml-2">ກຳລັງໂຫລດຂໍ້ມູນ...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedPayments.length > 0 ? (
                paginatedPayments.map((payment, index) => (
                  <tr
                    key={payment.payment_id || index}
                    className="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-4 py-4 font-medium">{payment.pay_id}</td>
                    <td className="px-4 py-4">{payment.in_id}</td>
                    <td className="px-4 py-4">
                      {new Date(payment.date).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </td>
                    
                    <td className="px-4 py-2">
                      {payment.pay_type?.toUpperCase() === 'CASH' && (
                        <span className="inline-block bg-secondary2/10 text-secondary text-sm  px-3 py-1 rounded-full">
                          CASH
                        </span>
                      )}
                      {payment.pay_type?.toUpperCase() === 'TRANSFER' && (
                        <span className="inline-block bg-blue-100 text-blue-800 text-sm  px-3 py-1 rounded-full">
                          TRANSFER
                        </span>
                      )}
                      {payment.pay_type?.toUpperCase() === 'REFUND' && (
                        <span className="inline-block bg-yellow-100 text-yellow-800 text-sm  px-3 py-1 rounded-full">
                          Refund
                        </span>
                      )}
                      {!['CASH', 'TRANSFER', 'REFUND'].includes(
                        payment.pay_type?.toUpperCase(),
                      ) && (
                          <span className="inline-block bg-gray-100 text-gray-700 text-sm  px-3 py-1 rounded-full">
                            {payment.pay_type}
                          </span>
                        )}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-sm font-medium bg-green-100 text-green-700 `}
                      >
                        {payment.payment_status}
                      </span>
                    </td>
                    
                    <td className="px-4 py-4 text-right">
                      {Number(payment.paid_amount).toLocaleString('en-GB')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    <div className="text-center text-gray-500 dark:text-gray-400">
                      <div className="w-32 h-32 flex items-center justify-center mx-auto">
                        <Empty description={false} />
                      </div>
                      <p className="text-lg">ບໍ່ພົບຂໍ້ມູນລາຍງານການຊຳລະເງີນ</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TablePaginationDemo
        count={filteredPayments.length}
        page={page}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </>
  );
};

export default ReportPay;
