import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '@/redux/hook';
import { openAlert } from '@/redux/reducer/alert';
import Loader from '@/common/Loader';
import Alerts from '@/components/Alerts';
import { Empty } from 'antd';
const ViewService = ({ id, onClose, setShow }) => {
  const [loading, setLoading] = useState(false);
  const [serviceData, setServiceData] = useState(null);
  const [packetDetails, setPacketDetails] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function fetchInitialData() {
      try {
        const medRes = await fetch('http://localhost:4000/src/manager/medicines');

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

  useEffect(() => {
    async function fetchServiceData() {
      if (!id) return;

      setLoading(true);
      try {
        // ดึงข้อมูล service หลัก
        const serviceRes = await fetch(`http://localhost:4000/src/manager/servicelist/${id}`);
        
        if (serviceRes.ok) {
          const serviceResult = await serviceRes.json();
          setServiceData(serviceResult.data);
        } else {
          throw new Error('ไม่สามารถดึงข้อมูลบริการได้');
        }

        const detailRes = await fetch(`http://localhost:4000/src/manager/packet-detail/${id}`);
        
        if (detailRes.ok) {
          const detailResult = await detailRes.json();
          setPacketDetails(detailResult.data || []);
        } else {
          console.warn('ไม่สามารถดึงข้อมูล packet detail ได้');
          setPacketDetails([]);
        }

      } catch (error) {
        console.error('Error fetching service data:', error);
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

    fetchServiceData();
  }, [id, dispatch]);

  const getMedicineName = (med_id) => {
    const medicine = medicines.find(m => m.med_id === med_id);
    if (!medicine) {
      console.warn('ไม่พบ med_id นี้ใน medicines:', med_id);
    }
    return medicine ? medicine.med_name : '-';
  };

  const getMedicineUnit = (med_id) => {
    const medicine = medicines.find(m => m.med_id === med_id);
    if (!medicine) {
      console.warn('ไม่พบ med_id นี้ใน medicines:', med_id);
    }
    return medicine ? medicine.unit : '-';
  };

  const formatPrice = (price) => {
    if (!price) return '0';
    return new Intl.NumberFormat('la-LA').format(price);
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
          ລາຍລະອຽດແພັກເກັດ - {serviceData?.ser_id}
        </h1>
      </div>

      <div className="p-4">
        {serviceData && (
         <div className="pb-6 border-b border-stroke mt-2">
            <h2 className="text-lg font-semibold mb-4 text-strokedark dark:text-bodydark3">
              ຂໍ້ມູນການລາຍການແພັກແກັດ
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               <div className='space-y-1.5'>
                <label className="block text-sm font-medium text-slate-600">
                  ລະຫັດແພັກເກັດ
                </label>
                <p className="text-base font-mono text-form-strokedark  border border-stroke px-3 py-2 rounded">
                  {serviceData.ser_id}
                </p>
              </div>
              
               <div className='space-y-1.5'>
                <label className="block text-sm font-medium text-slate-6002">
                  ຊື່แພັກເກັດ
                </label>
                <p className="text-base font-mono text-form-strokedark  border border-stroke px-3 py-2 rounded">
                  {serviceData.ser_name}
                </p>
              </div>

               <div className='space-y-1.5'>
                <label className="block text-sm font-medium text-slate-6002">
                  ລາຄາ
                </label>
                <p className="text-base font-mono text-form-strokedark  border border-stroke px-3 py-2 rounded">
                    {formatPrice(serviceData.price)} ກີບ
                </p>
              </div>
            </div>
          </div>
        )}

        <div>
          <h2 className="text-lg font-semibold mb-4 text-strokedark dark:text-bodydark3">
            ລາຍລະອຽດຢາ ແລະ ອຸປະກອນໃນແພັກແກັດ
          </h2>
          
          
          {packetDetails.length > 0 ? (
            <>
               <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-slate-300">
                  <thead>
                    <tr className="text-left bg-slate-200 border border-stroke ">
                      <th className="px-4 py-3 tracking-wide text-form-input font-semibold border-r border-slate-300">ລຳດັບ</th>
                      <th className="px-4 py-3 tracking-wide text-form-input font-semibold border-r border-slate-300">ຊື່ຢາ</th>
                      <th className="px-4 py-3 tracking-wide text-form-input font-semibold border-r border-slate-300">ຈຳນວນ</th>
                      <th className="px-4 py-3 tracking-wide text-form-input font-semibold border-r border-slate-300">ຫົວໜ່ວຍ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {packetDetails.map((detail, index) => (
                      <tr
                        key={detail.packetdetail_id || index}
                        className="border-b text-md border-stroke"
                      >
                        <td className="px-4 py-2 border  border-stroke">{index + 1}</td>
                        <td className="px-4 py-2 border-r border-stroke">{getMedicineName(detail.med_id)}</td>
                        <td className="px-4 py-2 border-r border-stroke ">{detail.qty?.toLocaleString() || 0}</td>
                        <td className="px-4 py-2 border-r border-stroke">{getMedicineUnit(detail.med_id)}</td>
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
              <p className="text-lg">ບໍ່ມີລາຍການຢາໃນແພັກເກັດ</p>
              <p className="text-sm mt-2">ກະລຸນາເພີ່ມລາຍການຢາໃຫ້ກັບແພັກເກັດນີ້</p>
              
            </div>
          )}
        </div>

        {/* ปุ่มปิด */}
        <div className="flex justify-end mt-6 pt-4 border-t border-stroke dark:border-strokedark">
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

export default ViewService;