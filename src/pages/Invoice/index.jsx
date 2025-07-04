'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { openAlert } from '@/redux/reducer/alert';
import TablePaginationDemo from '@/components/Tables/Pagination_two';
import { Inheader } from './invocieheader';
import Search from '@/components/Forms/Search';
import { Plus, CreditCard } from 'lucide-react';
import ConfirmModal from '@/components/Modal';
import BillPopup from '../Service/Treatment/BillPopup';
import { XCircle, CheckCircle } from 'lucide-react';
import { Empty } from 'antd';
const InvoicePage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [selectedInvoiceData, setSelectedInvoiceData] = useState(null);
  const [showBillPopup, setShowBillPopup] = useState(false);
  const [billData, setBillData] = useState(null);
  const [inspectionDetails, setInspectionDetails] = useState(null);
  const [isRefundMode, setIsRefundMode] = useState(false);
  // const fetchInvoices = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await fetch('http://localhost:4000/src/invoice/invoice');
  //     const data = await response.json();
  //     setInvoices(data.data || []);
  //   } catch (error) {
  //     dispatch(
  //       openAlert({
  //         type: 'error',
  //         title: 'ດຶງຂໍ້ມູນບໍ່ສຳເລັດ',
  //         message: error.message || 'ເກີດຂໍ້ຜິດພາດ',
  //       }),
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleCancelInvoice = async () => {
    if (!selectedInvoiceId) return;

    try {
      const response = await fetch(
        `http://localhost:4000/src/invoice/cancel/${selectedInvoiceId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
        },
      );

      if (!response.ok) throw new Error('ບໍ່ສາມາດຍົກເລີກໃບບິນໄດ້');

      dispatch(
        openAlert({
          type: 'success',
          title: 'ຍົກເລີກໃບບິນ',
          message: 'ຍົກເລີກໃບບິນສຳເລັດແລ້ວ',
        }),
      );

      fetchInvoices();
    } catch (error) {
      dispatch(
        openAlert({
          type: 'error',
          title: 'ຍົກເລີກບໍ່ສຳເລັດ',
          message: 'ເກີດຂໍ້ຜິດພາດໃນການຍົກເລີກ',
        }),
      );
    } finally {
      setShowModal(false);
      setSelectedInvoiceId(null);
    }
  };
  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/src/invoice/invoice');
      const data = await response.json();
      setInvoices(data.data || []);
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

  const fetchInvoiceDetail = async (invoiceId) => {
    try {
      const res = await fetch(
        `http://localhost:4000/src/invoice/invoice/${invoiceId}`,
      );
      const json = await res.json();

      if (json.resultCode === '200') {
        setBillData(json.data);

        if (json.data?.in_id) {
          await fetchInspectionDetails(json.data.in_id);
        }

        setShowBillPopup(true);
        setSelectedInvoiceData(json.data);
      } else {
        dispatch(
          openAlert({
            type: 'error',
            title: 'ດຶງໃບບິນບໍ່ສຳເລັດ',
            message: 'ຂໍອະໄພ ເກີດຂໍ້ຜິດພາດ',
          }),
        );
      }
    } catch (error) {
      dispatch(
        openAlert({
          type: 'error',
          title: 'ເກີດຂໍ້ຜິດພາດ',
          message: error.message,
        }),
      );
    }
  };

  // const fetchInvoiceDetail = async (invoiceId) => {
  //   try {
  //     const res = await fetch(
  //       `http://localhost:4000/src/invoice/invoice/${invoiceId}`,
  //     );

  //     const json = await res.json();
  //     if (json.resultCode === '200') {
  //       setBillData(json.data);
  //       setShowBillPopup(true);
  //       setSelectedInvoiceData(json.data);
  //     } else {
  //       dispatch(
  //         openAlert({
  //           type: 'error',
  //           title: 'ດຶງໃບບິນບໍ່ສຳເລັດ',
  //           message: json.message || 'ຂໍອະໄພ ເກີດຂໍ້ຜິດພາດ',
  //         }),
  //       );
  //     }
  //   } catch (error) {
  //     dispatch(
  //       openAlert({
  //         type: 'error',
  //         title: 'ເກີດຂໍ້ຜິດພາດ',
  //         message: error.message,
  //       }),
  //     );
  //   }
  // };
  const fetchInspectionDetails = async (inspectionId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/src/report/inspection`,
      );
      const data = await response.json();

      if (response.ok) {
        let inspection = null;

        if (data.detail && Array.isArray(data.detail)) {
          inspection = data.detail.find((item) => item.in_id === inspectionId);
        } else if (data.data && Array.isArray(data.data)) {
          inspection = data.data.find((item) => item.in_id === inspectionId);
        } else if (Array.isArray(data)) {
          inspection = data.find((item) => item.in_id === inspectionId);
        }

        setInspectionDetails(inspection);

        if (inspection) {
          setBillData((prevData) => ({
            ...prevData,
            patient_name: inspection.patient_name,
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching inspection details:', error);
    }
  };

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) =>
      invoice.invoice_id?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [invoices, searchQuery]);

  const paginatedInvoices = filteredInvoices.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'PENDING':
        return {
          className: 'bg-yellow-100 text-yellow-700',
          text: 'ລໍຕິິ່ນຊຳລະ',
        };
      case 'PAID':
        return {
          className: 'bg-green-100 text-green-700',
          text: 'ຊຳລະແລ້ວ',
        };
      case 'CANCEL':
        return {
          className: 'bg-red-100 text-red-500',
          text: 'CANCEL',
        };
      default:
        return {
          className: 'bg-gray-100 text-gray-700',
          text: status,
        };
    }
  };

  return (
    <>
      <div className="rounded bg-white pt-4 dark:bg-boxdark">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stroke px-4 pb-4 dark:border-strokedark">
          <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3">
            ຈັດການໃບບິນທັງໝົດ
          </h1>
        </div>

        {/* Search */}
        <div className="grid w-full gap-4 p-4">
          <Search
            type="text"
            name="search"
            placeholder="ຄົ້ນຫາລະຫັດໃບບິນ..."
            className="rounded border border-stroke dark:border-strokedark"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto shadow-md">
          <table className="w-full min-w-max table-auto">
            <thead>
              <tr className="text-left bg-gray border border-stroke">
                {Inheader.map((header, index) => (
                  <th
                    key={index}
                    className="px-4 py-3 tracking-wide text-form-input font-semibold"
                  >
                    {header.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedInvoices.length > 0 ? (
                paginatedInvoices.map((invoice, idx) => {
                  const statusInfo = getStatusDisplay(invoice.status);
                  return (
                    <tr
                      key={idx}
                      className="border-b text-md border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="px-4 py-2 ">{invoice.invoice_id}</td>
                      <td className="px-4 py-2">
                        {new Date(invoice.date).toLocaleString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: false,
                        })}
                      </td>

                      <td className="px-4 py-2 text-left">
                        <span
                          className={`inline-block rounded-full px-3 my-2  py-1 text-center text-sm font-medium ${
                            invoice.status === 'UNPAID'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-500'
                          }`}
                        >
                          {statusInfo.text}
                        </span>
                      </td>

                      <td className="px-4 py-2 ">{invoice.in_id}</td>
                      <td className="px-4 py-2 ">
                        {(invoice.total * 1).toLocaleString()} ກີບ
                      </td>

                      <td className="px-4 py-2">{invoice.emp_id_create}</td>
                      <td className="px-4 py-2">{invoice.emp_id_updated}</td>

                      <td className="px-4 py-2 ">
                        <div className="flex flex-wrap gap-2">
                          {invoice.status !== 'CANCEL' && (
                            <button
                              onClick={() => {
                                setSelectedInvoiceId(invoice.invoice_id);
                                setShowModal(true);
                              }}
                              className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded shadow-sm hover:shadow-md transition-all duration-200"
                            >
                              <XCircle className="w-4 h-4" />
                              ຍົກເລີກ
                            </button>
                          )}

                          {/* ปุ่มชำระเงิน */}
                          {invoice.status !== 'CANCEL' &&
                            invoice.status !== 'PAID' && (
                              <button
                                onClick={() => {
                                  setSelectedInvoiceId(invoice.invoice_id);
                                  fetchInvoiceDetail(invoice.invoice_id);
                                  setIsRefundMode(true);
                                  setShowBillPopup(true);
                                }}
                                className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded shadow-sm hover:shadow-md transition-all duration-200"
                              >
                                <CheckCircle className="w-4 h-4" />
                                ຊຳລະເງີນ
                              </button>
                            )}

                          {invoice.status === 'CANCEL' && (
                            <button
                              onClick={() => {
                                setSelectedInvoiceId(invoice.invoice_id);
                                fetchInvoiceDetail(invoice.invoice_id);
                              }}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-sm rounded"
                            >
                              ເບິ່ງ
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-4 text-gray-500">
                    <div className="text-center ">
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
      </div>
      {showBillPopup && billData && (
        <BillPopup
          isOpen={showBillPopup}
          onClose={() => {
            setShowBillPopup(false);
            setInspectionDetails(null);
            setIsRefundMode(false);
          }}
          patientData={billData}
          inspectionData={inspectionDetails || billData}
          services={billData?.services || []}
          medicines={billData?.medicines || []}
          invoiceData={billData}
          isRefundMode={isRefundMode}
        />
      )}

      <TablePaginationDemo
        count={filteredInvoices.length}
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
        message="ທ່ານແນ່ໃຈບໍ່ຈະຍົກເລິກໃບບິນ？"
        handleConfirm={handleCancelInvoice}
      />
    </>
  );
};

export default InvoicePage;
