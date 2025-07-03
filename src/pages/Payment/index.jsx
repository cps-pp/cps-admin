import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { openAlert } from '@/redux/reducer/alert';
import TablePaginationDemo from '@/components/Tables/Pagination_two';
import Search from '@/components/Forms/Search';
import Button from '@/components/Button';
import ConfirmModal from '@/components/Modal';
import { Payheader } from './header';

const PaymentPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedPayId, setSelectedPayId] = useState(null);
  const dispatch = useDispatch();

  // ดึงข้อมูล payment จาก API
  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/src/payment/payment');
      const data = await response.json();
      setPayments(data.data || []);
    } catch (error) {
      dispatch(
        openAlert({
          type: 'error',
          title: 'ດຶງຂໍ້ມູນບໍ່ສຳເລັດ',
          message: 'ເກີດຂໍ້ຜິດພາດ',
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // กรองข้อมูลโดยค้นหา pay_id หรือ invoice_id
  const filteredPayments = useMemo(() => {
    return payments.filter(
      (p) =>
        p.pay_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.invoice_id?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [payments, searchQuery]);

  // จัดแบ่งหน้า
  const paginatedPayments = filteredPayments.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  // ตัวอย่างปุ่มลบหรือจัดการอื่น ๆ (ถ้าต้องการ)
  const handleDeletePayment = () => {
    setShowModal(false);
    setSelectedPayId(null);
  };
  const getPayTypeBadge = () => {
    switch (type.toUpperCase()) {
      case 'CASH':
        return (
          <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
            Cash
          </span>
        );
      case 'TRANSFER':
        return (
          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
            Transfer
          </span>
        );
      case 'REFUND':
        return (
          <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-medium px-3 py-1 rounded-full">
            Refund
          </span>
        );
      default:
        return (
          <span className="inline-block bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
            {type}
          </span>
        );
    }
  };

  return (
    <>
      <div className="rounded bg-white pt-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stroke px-4 pb-4 ">
          <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark ">
            ຈັດການການຊໍາລະເງິນທັງໝົດ
          </h1>
        </div>

        {/* Search */}
        <div className="grid w-full gap-4 p-4">
          <Search
            type="text"
            name="search"
            placeholder="ຄົ້ນຫາ..."
            className="rounded border border-stroke "
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto  shadow-md">
          <table className="w-full min-w-max table-auto  ">
            <thead>
              <tr className="text-left bg-gray border border-stroke">
                {Payheader.map((header, index) => (
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
              {paginatedPayments.length > 0 ? (
                paginatedPayments.map((pay, idx) => (
                  <tr key={idx} className="border-b text-md border-stroke  ">
                    <td className="px-4 py-4  ">{pay.pay_id}</td>
                    <td className="px-4 py-2">{pay.invoice_id}</td>
                    <td className="px-4 py-4">
                      {new Date(pay.pay_date).toLocaleString('en-GB', {
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
                      {Number(pay.paid_amount).toLocaleString()} ກີບ
                    </td>
                    <td
                      className={`inline-block rounded-full px-3 mt-3 py-1 text-center text-sm font-medium ${
                        pay.status === 'SUCCESS'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-500'
                      }`}
                    >
                      {pay.status}
                    </td>

                    <td className="px-4 py-2">
                      {pay.pay_type?.toUpperCase() === 'CASH' && (
                        <span className="inline-block bg-green-100 text-green-800 text-sm  px-3 py-1 rounded-full">
                          CASH
                        </span>
                      )}
                      {pay.pay_type?.toUpperCase() === 'TRANSFER' && (
                        <span className="inline-block bg-blue-100 text-blue-800 text-sm  px-3 py-1 rounded-full">
                          TRANSFER
                        </span>
                      )}
                      {pay.pay_type?.toUpperCase() === 'REFUND' && (
                        <span className="inline-block bg-yellow-100 text-yellow-800 text-sm  px-3 py-1 rounded-full">
                          Refund
                        </span>
                      )}
                      {!['CASH', 'TRANSFER', 'REFUND'].includes(
                        pay.pay_type?.toUpperCase(),
                      ) && (
                        <span className="inline-block bg-gray-100 text-gray-700 text-sm  px-3 py-1 rounded-full">
                          {pay.pay_type}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-gray-500">
                    ບໍ່ພົບຂໍ້ມູນ
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
        rowsPerPage={rowsPerPage}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />
      <ConfirmModal
        show={showModal}
        setShow={setShowModal}
        message="ທ່ານແນ່ໃຈບໍ່？"
        handleConfirm={handleDeletePayment}
      />
    </>
  );
};

export default PaymentPage;
