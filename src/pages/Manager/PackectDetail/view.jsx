import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '@/redux/hook';
import { openAlert } from '@/redux/reducer/alert';
import Loader from '@/common/Loader';
import Alerts from '@/components/Alerts';

const ViewService = ({ id, onClose, setShow }) => {
  const [loading, setLoading] = useState(false);
  const [serviceData, setServiceData] = useState(null);
  const [packetDetails, setPacketDetails] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const dispatch = useAppDispatch();

  // ฟังก์ชันดึงข้อมูลเริ่มต้น (medicines)
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

  // ฟังก์ชันดึงข้อมูล service และ packet_detail
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

        // ดึงข้อมูล packet_detail (จะมีข้อมูลแน่นอนเพราะกรองจาก API แล้ว)
        const detailRes = await fetch(`http://localhost:4000/src/manager/packet-detail/${id}`);
        
        if (detailRes.ok) {
          const detailResult = await detailRes.json();
          setPacketDetails(detailResult.data || []);
        } else {
          // ถ้าไม่สามารถดึงข้อมูลได้
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

  // Helper functions
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
        {/* ข้อมูลบริการหลัก */}
        {serviceData && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold mb-4 text-strokedark dark:text-bodydark3">
              ຂໍ້ມູນແພັກເກັດ
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-black-2">
                  ລະຫັດແພັກເກັດ
                </label>
                <p className="mt-1 text-sm text-black">
                  {serviceData.ser_id}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black-2">
                  ຊື່แພັກເກັດ
                </label>
                <p className="mt-1 text-sm text-black">
                  {serviceData.ser_name}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-black-2">
                  ລາຄາ
                </label>
                <p className="mt-1 text-sm text-black">
                  <span className="font-semibold text-primary">
                    {formatPrice(serviceData.price)} ກີບ
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ตารางรายละเอียดแพ็กเกจ */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-strokedark dark:text-bodydark3">
            ລາຍການຢາໃນແພັກເກັດ
          </h2>
          
          {packetDetails.length > 0 ? (
            <>
              <div className="overflow-x-auto rounded-lg shadow-md">
                <table className="w-full min-w-max table-auto border-collapse">
                  <thead>
                    <tr className="bg-strokedark text-white">
                      <th className="px-4 py-3 text-left font-medium">ລຳດັບ</th>
                      <th className="px-4 py-3 text-left font-medium">ຊື່ຢາ</th>
                      <th className="px-4 py-3 text-right font-medium">ຈຳນວນ</th>
                      <th className="px-4 py-3 text-left font-medium">ປະເພດ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {packetDetails.map((detail, index) => (
                      <tr
                        key={detail.packetdetail_id || index}
                        className="border-b border-stroke dark:border-strokedark hover:bg-gray-50 text-black-2"
                      >
                        <td className="px-4 py-4">{index + 1}</td>
                        <td className="px-4 py-4">{getMedicineName(detail.med_id)}</td>
                        <td className="px-4 py-4 text-right">{detail.qty?.toLocaleString() || 0}</td>
                        <td className="px-4 py-4">{getMedicineUnit(detail.med_id)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            
            </>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v1M9 4V3a1 1 0 011-1h4a1 1 0 011 1v1" />
                </svg>
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