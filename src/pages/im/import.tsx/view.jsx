import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '@/redux/hook';
import { openAlert } from '@/redux/reducer/alert';
import Loader from '@/common/Loader';
import Alerts from '@/components/Alerts';
import { Empty } from 'antd';

const ViewImport = ({ id, onClose, setShow }) => {
  const [loading, setLoading] = useState(false);
  const [importData, setImportData] = useState(null);
  const [importDetails, setImportDetails] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [preorders, setPreorders] = useState([]);
  const dispatch = useAppDispatch();

  // ฟังก์ชันดึงข้อมูลเริ่มต้น (employees, medicines, preorders)
  useEffect(() => {
    async function fetchInitialData() {
      try {
        const [empRes, medRes, preorderRes] = await Promise.all([
          fetch('http://localhost:4000/src/manager/emp'),
          fetch('http://localhost:4000/src/manager/medicines'),
          fetch('http://localhost:4000/src/preorder/preorder'),
        ]);

        if (empRes.ok) {
          const data = await empRes.json();
          setEmployees(data.data);
        }

        if (medRes.ok) {
          const data = await medRes.json();
          setMedicines(data.data);
        }

        if (preorderRes.ok) {
          const data = await preorderRes.json();
          setPreorders(data.data);
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    }
    fetchInitialData();
  }, []);

  // ฟังก์ชันดึงข้อมูล import และ import_detail
  useEffect(() => {
    async function fetchImportData() {
      if (!id) return;

      setLoading(true);
      try {
        // ดึงข้อมูล import หลัก
        const importRes = await fetch(
          `http://localhost:4000/src/im/import/${id}`,
        );

        if (importRes.ok) {
          const importResult = await importRes.json();
          setImportData(importResult.data);
        } else {
          throw new Error('ไม่สามารถดึงข้อมูลนำเข้าได้');
        }

        // ดึงข้อมูล import_detail
        const detailRes = await fetch(
          `http://localhost:4000/src/im_detail/import-detail/${id}`,
        );

        if (detailRes.ok) {
          const detailResult = await detailRes.json();
          setImportDetails(detailResult.data || []);
        } else {
          // ถ้าไม่มี detail ก็ไม่เป็นไร
          setImportDetails([]);
        }
      } catch (error) {
        console.error('Error fetching import data:', error);
        dispatch(
          openAlert({
            type: 'error',
            title: 'ເກີດຂໍ້ຜິດພາດ',
            message: error.message || 'ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນ',
          }),
        );
      } finally {
        setLoading(false);
      }
    }

    fetchImportData();
  }, [id, dispatch]);

  // Helper functions
  const getEmployeeName = (emp_id) => {
    const employee = employees.find((e) => e.emp_id === emp_id);
    return employee ? `${employee.emp_name} ${employee.emp_surname}` : '-';
  };

  const getMedicineName = (med_id) => {
    const medicine = medicines.find((m) => m.med_id === med_id);
    if (!medicine) {
      console.warn('ไม่พบ med_id นี้ใน medicines:', med_id);
    }
    return medicine ? medicine.med_name : '-';
  };

  const getMedicineUnit = (med_id) => {
    const medicine = medicines.find((m) => m.med_id === med_id);
    if (!medicine) {
      console.warn('ไม่พบ med_id นี้ใน medicines:', med_id);
    }
    return medicine ? medicine.unit : '-';
  };

  const getPreorderInfo = (preorder_id) => {
    const preorder = preorders.find((p) => p.preorder_id === preorder_id);
    return preorder ? preorder.preorder_id : '-';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('th-TH', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="rounded bg-white pt-4 dark:bg-boxdark">
      <Alerts />

      {/* Header */}
      <div className="flex items-center border-b border-stroke dark:border-strokedark pb-4 px-4">
        <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3">
          ລາຍລະອຽດນຳເຂົ້າ - {importData?.im_id}
        </h1>
      </div>

      <div className="p-4">
        {importData && (
          <div className="pb-6 border-b border-stroke mt-2">
            <h2 className="text-lg font-semibold mb-4 text-strokedark dark:text-bodydark3">
              ຂໍ້ມູນການນຳເຂົ້າ
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-6002">
                  ລະຫັດນຳເຂົ້າ
                </label>
                <p className="text-base font-mono text-form-strokedark  border border-stroke px-3 py-2 rounded">
                  {importData.im_id}
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-black-2">
                  ວັນທີນຳເຂົ້າ
                </label>
                <p className="text-base font-mono text-form-strokedark  border border-stroke px-3 py-2 rounded">
                  {formatDate(importData.im_date)}
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-black-2">
                  ລະຫັດສັ່ງຊື້
                </label>
                <p className="text-base font-mono text-form-strokedark  border border-stroke px-3 py-2 rounded">
                  {getPreorderInfo(importData.preorder_id)}
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-black-2">
                  ພະນັກງານຜູ້ສ້າງ
                </label>
                <p className="text-base font-mono text-form-strokedark  border border-stroke px-3 py-2 rounded">
                  {getEmployeeName(importData.emp_id_create)}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-4 text-strokedark ">
            ລາຍການທີ່ນຳເຂົ້າ
          </h2>

          {importDetails.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-slate-300">
                  <thead>
                    <tr className="text-left bg-slate-200 border border-stroke">
                      <th className="px-4 py-3 tracking-wide text-form-input font-semibold border-r border-slate-300">
                        ລຳດັບ
                      </th>
                      <th className="px-4 py-3 tracking-wide text-form-input font-semibold border-r border-slate-300">
                        ຊື່ລາຍການ
                      </th>
                      <th className="px-4 py-3 tracking-wide text-form-input font-semibold border-r border-slate-300">
                        ຈຳນວນ
                      </th>
                      <th className="px-4 py-3 tracking-wide text-form-input font-semibold border-r border-slate-300">
                        ຫົວໜ່ວຍ
                      </th>
                      <th className="px-4 py-3 tracking-wide text-form-input font-semibold border-r border-slate-300">
                        ວັນໝົດອາຍຸ
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {importDetails.map((detail, index) => (
                      <tr
                        key={detail.detail_id || index}
                        className="border-b text-md border-stroke"
                      >
                        <td className="px-4 py-2 border border-stroke">
                          {index + 1}
                        </td>
                        <td className="px-4 py-2 border-r border-stroke">
                          {getMedicineName(detail.med_id)}
                        </td>
                        <td className="px-4 py-2 border-r border-stroke ">
                          {detail.qty?.toLocaleString() || 0}
                        </td>
                        <td className="px-4 py-2 border-r border-stroke">
                          {getMedicineUnit(detail.med_id)}
                        </td>
                        <td className="px-4 py-3 border-r border-stroke">
                          <span
                            className={`px-2 py-1 rounded text-md ${
                              new Date(detail.expired_date) < new Date()
                                ? 'bg-red-100 text-red-800'
                                : new Date(detail.expired_date) <
                                    new Date(
                                      Date.now() + 30 * 24 * 60 * 60 * 1000,
                                    )
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {formatDate(detail.expired_date)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="text-center py-2 text-gray-500 dark:text-gray-400">
              <div className="w-32 h-32 flex items-center justify-center mx-auto ">
                <Empty description={false} />
              </div>
              <p className="text-lg">ບໍ່ມີລາຍການ</p>
              <p className="text-sm mt-2">ກະລຸນາເພີ່ມລາຍການນຳເຂົ້າ</p>
            </div>
          )}
        </div>

        <div className="flex justify-end  ">
          <button
            onClick={() => setShow(false)}
            className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            ປິດ
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewImport;
