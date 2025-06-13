import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Loader from '@/common/Loader';
import { useAppDispatch } from '@/redux/hook';
import { openAlert } from '@/redux/reducer/alert';
import ButtonBox from '../../components/Button';
import { usePrompt } from '@/hooks/usePrompt';
import ConfirmModal from '@/components/Modal';

const AddDetailPreorder = ({ id, setShow, getList, onClose }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [preorderDetails, setPreorderDetails] = useState([]);
  const [existingDetailIds, setExistingDetailIds] = useState([]);
  
  // ✅ เพิ่ม state สำหรับ ConfirmModal
  const [showModal, setShowModal] = useState(false);
  const [deleteDetailId, setDeleteDetailId] = useState(null);
  
  const dispatch = useAppDispatch();

  // ใช้ useRef เพื่อเก็บ current value ของ isDirty
  const isDirtyRef = useRef(isDirty);
  
  // อัพเดต ref ทุกครั้งที่ isDirty เปลี่ยน
  useEffect(() => {
    isDirtyRef.current = isDirty;
  }, [isDirty]);
  
  // เตือนเมื่อมีการพยายามออกจากหน้าด้วย navigation
  usePrompt('ທ່ານຕ້ອງການອອກຈາກໜ້ານີ້ແທ້ຫຼືບໍ? ຂໍ້ມູນທີ່ກຳລັງປ້ອນຈະສູນເສຍ.', isDirty);

  // เตือนเมื่อจะรีเฟรช / ปิดแท็บ
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!isDirtyRef.current) return;
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // เตือนเมื่อคลิกปิดฟอร์ม
  const handleCloseForm = () => {
    if (isDirtyRef.current) {
      const confirmLeave = window.confirm('ທ່ານຕ້ອງການປິດຟອມແທ້ຫຼືບໍ? ຂໍ້ມູນທີ່ປ້ອນຈະສູນເສຍ');
      if (!confirmLeave) return;
    }
    if (onClose) onClose();
    if (setShow) setShow(false);
  };

  // ดึงข้อมูลยาทั้งหมด
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:4000/src/manager/medicines');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setMedicines(data.data);
      } catch (error) {
        console.error('Error fetching medicines:', error);
        dispatch(
          openAlert({
            type: 'error',
            title: 'ເກີດຂໍ້ຜິດພາດ',
            message: 'ບໍ່ສາມາດດຶງຂໍ້ມູນຢາໄດ້',
          })
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, [dispatch]);

  // ดึงรายละเอียดสั่งซื้อที่มีอยู่แล้ว
  useEffect(() => {
    const fetchPreorderDetails = async () => {
      if (!id) return;
      
      try {
        const response = await fetch(`http://localhost:4000/src/preorder_detail/preorder-detail/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setPreorderDetails(data.data);
        
        // เก็บ detail_id ที่มีอยู่แล้ว
        const ids = data.data.map(detail => detail.detail_id);
        setExistingDetailIds(ids);
      } catch (error) {
        console.error('Error fetching preorder details:', error);
      }
    };

    fetchPreorderDetails();
  }, [id]);

  // ✅ ฟังก์ชันสร้าง detail_id ใหม่แบบอัตโนมัติ (ดึงจากฐานข้อมูล)
  const generateDetailId = async () => {
    try {
      const response = await fetch('http://localhost:4000/src/preorder_detail/get-last-detail-id');
      
      if (!response.ok) {
        throw new Error('ไม่สามารถดึงข้อมูล detail_id ล่าสุดได้');
      }
      
      const data = await response.json();
      const lastId = data.lastDetailId || 0;
      const nextId = lastId + 1;
      
      console.log(`Last detail_id: ${lastId}, Next detail_id: ${nextId}`);
      return nextId;
      
    } catch (error) {
      console.error('Error generating detail_id:', error);
      return Date.now();
    }
  };

  // ฟังก์ชันหาชื่อยาจาก med_id
  const getMedicineName = (medId) => {
    const medicine = medicines.find(med => med.med_id === medId);
    return medicine ? medicine.med_name : medId;
  };

  // ฟังก์ชันบันทึกข้อมูล
  const handleSave = async (formData) => {
    setLoading(true);

    try {
      // ✅ สร้าง detail_id อัตโนมัติจากฐานข้อมูล
      const newDetailId = await generateDetailId();

      const payload = {
        detail_id: newDetailId,
        preorder_id: id,
        med_id: formData.med_id,
        qty: parseInt(formData.qty)
      };

      console.log('Payload being sent:', payload);

      const response = await fetch('http://localhost:4000/src/preorder_detail/preorder-detail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('API Error:', result);
        throw new Error(result.error || 'ບັນທຶກບໍ່ສຳເລັດ');
      }

      dispatch(
        openAlert({
          type: 'success',
          title: 'ສຳເລັດ',
          message: `ເພີ່ມລາຍລະອຽດສິນຄ້າສຳເລັດແລ້ວ (ID: ${newDetailId}) ✅`,
        })
      );

      // รีเฟรชข้อมูล
      await getList();
      await fetchPreorderDetailsAgain();
      
      // รีเซ็ตฟอร์ม
      reset();

    } catch (error) {
      console.error('Error saving detail:', error);
      dispatch(
        openAlert({
          type: 'error',
          title: 'ເກີດຂໍ້ຜິດພາດ',
          message: error.message || 'ມີຂໍ້ຜິດພາດໃນການບັນທຶກຂໍ້ມູນ',
        })
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ ฟังก์ชันเปิด Modal ยืนยันการลบ
  const handleDeleteClick = (detailId) => {
    console.log('Delete button clicked for detail_id:', detailId);
    setDeleteDetailId(detailId);
    setShowModal(true);
  };

  // ✅ ฟังก์ชันลบจริงเมื่อยืนยันแล้ว
  const handleDeleteDetail = async () => {
    if (!deleteDetailId) return;

    try {
      setLoading(true);
      setShowModal(false); // ปิด modal
      
      console.log('Deleting detail_id:', deleteDetailId);

      const response = await fetch(`http://localhost:4000/src/preorder_detail/preorder-detail/${deleteDetailId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Delete result:', result);

      dispatch(
        openAlert({
          type: 'success',
          title: 'ສຳເລັດ',
          message: `ລົບລາຍການ ID: ${deleteDetailId} ສຳເລັດແລ້ວ`,
        })
      );

      // รีเฟรชข้อมูลหลังจากลบสำเร็จ
      await getList();
      await fetchPreorderDetailsAgain();

    } catch (error) {
      console.error('Error deleting detail:', error);
      dispatch(
        openAlert({
          type: 'error',
          title: 'ເກີດຂໍ້ຜິດພາດ',
          message: error.message || 'ມີຂໍ້ຜິດພາດໃນການລົບຂໍ້ມູນ',
        })
      );
    } finally {
      setLoading(false);
      setDeleteDetailId(null); // รีเซ็ต
    }
  };

  // ✅ ฟังก์ชันช่วยสำหรับรีเฟรชข้อมูล preorder details
  const fetchPreorderDetailsAgain = async () => {
    if (!id) return;
    
    try {
      const detailResponse = await fetch(`http://localhost:4000/src/preorder_detail/preorder-detail/${id}`);
      if (detailResponse.ok) {
        const detailData = await detailResponse.json();
        setPreorderDetails(detailData.data || []);
        const ids = (detailData.data || []).map(detail => detail.detail_id);
        setExistingDetailIds(ids);
      }
    } catch (error) {
      console.error('Error fetching preorder details:', error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="rounded bg-white pt-4 dark:bg-strokedark">
      <div className="flex items-center justify-between border-b border-stroke dark:border-strokedark pb-4">
        <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3 px-4">
          ເພີ່ມລາຍລະອຽດສິນຄ້າ - ໃບສັ່ງ: {id}
        </h1>
      </div>

      {/* ✅ แสดงข้อมูลพื้นฐานของใบสั่ง */}
      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          <strong>ລະຫັດໃບສັ່ງ:</strong> {id} 
          <span className="ml-4"><strong>ສະຖານະ:</strong> ກຳລັງເພີ່ມລາຍລະອຽດສິນຄ້າໃນໃບສັ່ງຊື້</span>
        </p>
      </div>

      {/* แสดงรายการที่มีอยู่แล้ว */}
      {preorderDetails.length > 0 && (
        <div className="mt-4 px-4">
          <h3 className="text-lg font-medium mb-2">ລາຍການສິນຄ້າທີ່ມີຢູ່ແລ້ວ:</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">ລະຫັດລາຍລະອຽດ</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">ຊື່ຢາ</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">ຈຳນວນ</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">ຈັດການ</th>
                </tr>
              </thead>
              <tbody>
                {preorderDetails.map((detail, index) => (
                  <tr key={`${detail.detail_id}-${index}`} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{detail.detail_id}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {getMedicineName(detail.med_id)} ({detail.med_id})
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">{detail.qty}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {/* ✅ เรียกใช้ handleDeleteClick แทน handleDeleteDetail */}
                      <button
                        onClick={() => handleDeleteClick(detail.detail_id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                        disabled={loading}
                      >
                        {loading ? 'ກຳລັງລົບ...' : 'ລົບ'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ฟอร์มเพิ่มรายการใหม่ */}
      <form onSubmit={handleSubmit(handleSave)} className="mt-6 px-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-medium mb-2 text-green-800 dark:text-green-200">ເພີ່ມສິນຄ້າໃໝ່:</h3>
        </div>
        
        {/* เลือกยา */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ເລືອກຢາ <span className="text-red-500">*</span>
          </label>
          <select
            {...register('med_id', { required: 'ກະລຸນາເລືອກຢາ' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- ເລືອກຢາ --</option>
            {medicines.map((medicine) => (
              <option key={medicine.med_id} value={medicine.med_id}>
                {medicine.med_name} ({medicine.med_id})
              </option>
            ))}
          </select>
          {errors.med_id && (
            <span className="text-red-500 text-sm">{errors.med_id.message}</span>
          )}
        </div>

        {/* จำนวน */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ຈຳນວນ <span className="text-red-500">*</span>
          </label>
          <input
            {...register('qty', { 
              required: 'ກະລຸນາປ້ອນຈຳນວນ',
              min: { value: 1, message: 'ຈຳນວນຕ້ອງມາກກວ່າ 0' }
            })}
            type="number"
            placeholder="ປ້ອນຈຳນວນ"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.qty && (
            <span className="text-red-500 text-sm">{errors.qty.message}</span>
          )}
        </div>

        <div className="mt-8 flex justify-end space-x-4 py-4"> 
          <ButtonBox 
            variant="save" 
            type="submit" 
            disabled={loading}
          >
            {loading ? 'ກຳລັງບັນທຶກ...' : 'ເພີ່ມສິນຄ້າ'}
          </ButtonBox>
        </div>
      </form>

      {/* ✅ ConfirmModal สำหรับยืนยันการลบ */}
      <ConfirmModal
        show={showModal}
        setShow={setShowModal}
        message={`ທ່ານຕ້ອງການລົບລາຍການ ID: ${deleteDetailId} ອອກຈາກລະບົບບໍ່？`}
        handleConfirm={handleDeleteDetail}
      />
    </div>
  );
};

export default AddDetailPreorder;