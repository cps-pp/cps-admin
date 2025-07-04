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
  const [invoiceFilter, setInvoiceFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      let url = 'http://localhost:4000/src/report/payment';
      const params = new URLSearchParams();

      if (invoiceFilter) {
        params.append('invoice_id', invoiceFilter);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

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
  }, [invoiceFilter]);

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

    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter(
        (payment) => payment.payment_status === statusFilter,
      );
    }

    // Filter by date range
    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter((payment) => {
        const paymentDate = new Date(payment.payment_date);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        return paymentDate >= startDate && paymentDate <= endDate;
      });
    }

    setFilteredPayments(filtered);
  }, [searchQuery, payments, statusFilter, dateRange]);

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

  const formattedTotalAmount = `${totalAmount.toLocaleString('en-US')} Kip`;

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 2xl:gap-7.5 w-full mb-6">
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
                  strokeWidth="2.1"
                  d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-6 5h6m-6 4h6M10 3v4h4V3h-4Z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h4 className="text-lg font-semibold  text-form-strokedark">ຈຳນວນລາຍການຊຳລະ</h4>
              <p className="text-xl font-bold text-blue-700">
                {totalCount} ລາຍການ
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white p-4">
          <div className="flex items-center">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-green-100">
              <svg
                class="w-[32px] h-[32px] text-green-700 "
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
                  strokeWidth="2.4"
                  d="M5 11.917 9.724 16.5 19 7.5"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h4 className="text-lg font-semibold text-form-strokedark">ຍອດຊຳລະທັງໝົດ</h4>
              <p className="text-xl font-bold text-primary">
                <p>{formattedTotalAmount}</p>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded bg-white pt-4 dark:bg-boxdark">
        <Alerts />
        <div className="flex items-center justify-between border-b border-stroke px-4 pb-4 dark:border-strokedark">
          <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3">
            ລາຍງານການຊຳລະເງີນ
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-4 p-4">
          <Search
            type="text"
            name="search"
            placeholder="ຄົ້ນຫາ Invoice ID, ວິທີການຊຳລະ..."
            className="rounded border border-stroke dark:border-strokedark"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto  shadow-md">
          <table className="w-full min-w-max table-auto  ">
            <thead>
              <tr className="text-left bg-gray border border-stroke">
                {Pay.map((header, index) => (
                  <th
                    key={index}
                    className="px-4 py-3 tracking-wide text-form-input  font-semibold"
                  >
                    {header.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center">
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
                      {new Date(payment.date).toLocaleString('en-US', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false,
                      })}
                    </td>
                    <td className="px-4 py-4">
                      {Number(payment.paid_amount).toLocaleString('en-US')}
                    </td>

                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1">
                        {payment.pay_type || '-'}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-sm font-medium bg-green-100 text-green-700 `}
                      >
                        {payment.payment_status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-500">
                     <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <div className="w-32 h-32 flex items-center justify-center mx-auto">
                    <Empty description={false} />
                  </div>
                  <p className="text-lg">
                    ບໍ່ພົບຂໍ້ມູນລາຍງານການຊຳລະເງີນ
                 
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
