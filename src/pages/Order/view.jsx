import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '@/redux/hook';
import { openAlert } from '@/redux/reducer/alert';
import Loader from '@/common/Loader';
import Alerts from '@/components/Alerts';
import { Empty } from 'antd';

const ViewPreorder = ({ id, onClose, setShow }) => {
  const [loading, setLoading] = useState(false);
  const [preorderData, setPreorderData] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const dispatch = useAppDispatch();

  // ฟังก์ชันดึงข้อมูลเริ่มต้น (suppliers, employees, medicines)
  useEffect(() => {
    async function fetchInitialData() {
      try {
        const [supRes, empRes, medRes] = await Promise.all([
          fetch('http://localhost:4000/src/manager/supplier'),
          fetch('http://localhost:4000/src/manager/emp'),
          fetch('http://localhost:4000/src/manager/medicines'),
        ]);

        if (supRes.ok) {
          const data = await supRes.json();
          setSuppliers(data.data);
        }

        if (empRes.ok) {
          const data = await empRes.json();
          setEmployees(data.data);
        }

        if (medRes.ok) {
          const data = await medRes.json();
          setMedicines(data.data);
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    }
    fetchInitialData();
  }, []);

  // ฟังก์ชันดึงข้อมูล preorder และ preorder_detail
  useEffect(() => {
    async function fetchPreorderData() {
      if (!id) return;

      setLoading(true);
      try {
        // ดึงข้อมูล preorder หลัก
        const preorderRes = await fetch(
          `http://localhost:4000/src/preorder/preorder/${id}`,
        );

        if (preorderRes.ok) {
          const preorderResult = await preorderRes.json();
          setPreorderData(preorderResult.data);
        } else {
          throw new Error('ไม่สามารถดึงข้อมูลสั่งซื้อได้');
        }

        // ดึงข้อมูล preorder_detail
        const detailRes = await fetch(
          `http://localhost:4000/src/preorder_detail/preorder-detail/${id}`,
        );

        if (detailRes.ok) {
          const detailResult = await detailRes.json();
          setPreorderDetails(detailResult.data || []);
        } else {
          // ถ้าไม่มี detail ก็ไม่เป็นไร
          setPreorderDetails([]);
        }
      } catch (error) {
        console.error('Error fetching preorder data:', error);
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

    fetchPreorderData();
  }, [id, dispatch]);

  // Helper functions
  const getSupplierName = (sup_id) => {
    const supplier = suppliers.find((s) => s.sup_id === sup_id);
    return supplier ? `${supplier.company_name} - ${supplier.address}` : '-';
  };

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
  const getMedicineunit = (med_id) => {
    const medicine = medicines.find((m) => m.med_id === med_id);
    if (!medicine) {
      console.warn('ไม่พบ med_id นี้ใน medicines:', med_id);
    }
    return medicine ? medicine.unit : '-';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-GB', {
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
      <div className="flex items-center border-b border-stroke   px-4">
        <h1 className="text-md md:text-lg lg:text-xl font-medium mb-4 text-strokedark ">
          ລາຍລະອຽດສັ່ງຊື້ - {preorderData?.preorder_id}
        </h1>
      </div>

      <div className="p-4">
        {preorderData && (
          <div className=" pb-6 border-b border-stroke mt-2">
            <h2 className="text-lg font-semibold mb-4 text-strokedark dark:text-bodydark3">
              ຂໍ້ມູນການສັ່ງຊື້
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* ລະຫັດສັ່ງຊື້ */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-600">
                  ລະຫັດສັ່ງຊື້
                </label>
                <p className="text-base font-mono text-form-strokedark  border border-stroke px-3 py-2 rounded">
                  {preorderData.preorder_id}
                </p>
              </div>

              {/* ວັນທີສັ່ງຊື້ */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-600">
                  ວັນທີສັ່ງຊື້
                </label>
                <p className="text-base text-form-strokedark  border border-stroke px-3 py-2 rounded">
                  {formatDate(preorderData.preorder_date)}
                </p>
              </div>

              {/* ສະຖານະ */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-600">
                  ສະຖານະ
                </label>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium border
            ${
              preorderData.status === 'ສຳເລັດ'
                ? 'bg-green-50 text-green-700 border-green-200'
                : preorderData.status === 'ລໍຖ້າຈັດສົ່ງ'
                  ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                  : 'bg-slate-50 text-slate-700 border-stroke'
            }`}
                >
                  {preorderData.status}
                </span>
              </div>

              <div className="space-y-1.5 lg:col-span-2">
                <label className="block text-sm font-medium text-slate-600">
                  ຜູ້ສະຫນອງ
                </label>
                <p className="text-base text-form-strokedark  border border-stroke px-3 py-2 rounded">
                  {getSupplierName(preorderData.sup_id)}
                </p>
              </div>

              {/* ພະນັກງານຜູ້ສ້າງ */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-600">
                  ພະນັກງານຜູ້ສ້າງ
                </label>
                <p className="text-base text-form-strokedark border border-stroke px-3 py-2 rounded">
                  {getEmployeeName(preorderData.emp_id_create)}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-4 text-form-input">
            ລາຍການທີ່ສັ່ງຊື້
          </h2>

          {preorderDetails.length > 0 ? (
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
                    </tr>
                  </thead>
                  <tbody>
                    {preorderDetails.map((detail, index) => (
                      <tr
                        key={detail.preorder_detail_id || index}
                        className="border-b text-md border-stroke"
                      >
                        <td className="px-4 py-2 border-r border-stroke">
                          {index + 1}
                        </td>
                        <td className="px-4 py-2 border-r border-stroke">
                          {getMedicineName(detail.med_id)}
                        </td>
                        <td className="px-4 py-2 border-r border-stroke ">
                          {detail.qty?.toLocaleString() || 0}
                        </td>
                        <td className="px-4 py-2 border-r border-stroke ">
                          {getMedicineunit(detail.med_id)}
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
              <p className="text-sm mt-2">ກະລຸນາເພີ່ມລາຍການສັ່ງຊື້ກ່ອນ</p>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-6  border-t border-stroke  ">
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

export default ViewPreorder;
