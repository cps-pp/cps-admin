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
  
  // ✅ เพิ่ม state สำหรับโหมดแก้ไข
  const [editingDetailId, setEditingDetailId] = useState(null);
  const [editingQty, setEditingQty] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  
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
        const response = await fetch('http://localhost:4000/src/manager/medicinesPAPAG');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setMedicines(data.data);
      } catch (error) {
        console.error('Error fetching medicinesPAPAG:', error);
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

  // ✅ ฟังก์ชันตรวจสอบข้อมูลซ้ำ - แก้ไขการเปรียบเทียบ
  const checkDuplicateMedicine = (medId) => {
    console.log('🔍 Checking duplicate for med_id:', medId);
    console.log('📋 Current preorder details:', preorderDetails);
    
    // ✅ แปลงเป็น string สำหรับเปรียบเทียบ เพื่อหลีกเลี่ยงปัญหา type mismatch
    const medIdStr = String(medId);
    
    const isDuplicate = preorderDetails.some(detail => {
      const detailMedIdStr = String(detail.med_id);
      console.log(`Comparing: "${detailMedIdStr}" === "${medIdStr}"`);
      return detailMedIdStr === medIdStr;
    });
    
    console.log('❓ Is duplicate:', isDuplicate);
    return isDuplicate;
  };

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

  // ✅ ฟังก์ชันบันทึกข้อมูล - แก้ไขปัญหาการอัปเดต state
  const handleSave = async (formData) => {
    console.log('💾 Form data:', formData);
    console.log('📋 Current preorder details:', preorderDetails);
    
    // ✅ ตรวจสอบข้อมูลซ้ำก่อนบันทึก
    const isDuplicate = checkDuplicateMedicine(formData.med_id);
    console.log('🔍 Duplicate check result:', isDuplicate);
    
    if (isDuplicate) {
      const selectedMedicine = medicines.find(med => String(med.med_id) === String(formData.med_id));
      const medicineName = selectedMedicine ? `${selectedMedicine.med_name} (${selectedMedicine.type_name})` : 'ຢາທີ່ເລືອກ';
      
      console.log('❌ Duplicate found! Medicine:', medicineName);
      
      dispatch(
        openAlert({
          type: 'error',
          title: 'ຂໍ້ມູນຊ້ຳກັນ',
          message: `${medicineName} ມີໃນລາຍການແລ້ວ! ກະລຸນາເລືອກຢາອື່ນ`,
        })
      );
      reset();
      return; // ❌ หยุดการทำงานไม่บันทึกข้อมูล
    }

    console.log('✅ No duplicate found, proceeding with save...');
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

      // ✅ อัปเดต preorderDetails ทันทีหลังจากบันทึกสำเร็จ
      const selectedMedicine = medicines.find(med => String(med.med_id) === String(formData.med_id));
      const newDetail = {
        detail_id: newDetailId,
        med_id: formData.med_id,
        qty: parseInt(formData.qty),
        med_name: selectedMedicine?.med_name || 'Unknown',
        type_name: selectedMedicine?.type_name || 'Unknown'
      };
      
      // ✅ อัปเดต state ทันทีเพื่อป้องกันการเพิ่มซ้ำ
      setPreorderDetails(prev => [...prev, newDetail]);
      setExistingDetailIds(prev => [...prev, newDetailId]);

      // ✅ รีเฟรชข้อมูลจากฐานข้อมูล
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

      // ✅ อัปเดต state ทันทีหลังจากลบ
      setPreorderDetails(prev => prev.filter(detail => detail.detail_id !== deleteDetailId));
      setExistingDetailIds(prev => prev.filter(id => id !== deleteDetailId));

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

  // ✅ ฟังก์ชันเริ่มต้นการแก้ไข
  const handleEditClick = (detail) => {
    console.log('Edit button clicked for detail_id:', detail.detail_id);
    setEditingDetailId(detail.detail_id);
    setEditingQty(detail.qty.toString());
  };

  // ✅ ฟังก์ชันยกเลิกการแก้ไข
  const handleCancelEdit = () => {
    setEditingDetailId(null);
    setEditingQty('');
  };

  // ✅ ฟังก์ชันบันทึกการแก้ไข
  const handleSaveEdit = async (detailId) => {
    if (!editingQty || parseInt(editingQty) <= 0) {
      dispatch(
        openAlert({
          type: 'error',
          title: 'ເກີດຂໍ້ຜິດພາດ',
          message: 'ຈຳນວນຕ້ອງມາກກວ່າ 0',
        })
      );
      return;
    }

    try {
      setEditLoading(true);
      
      console.log('Updating detail_id:', detailId, 'with qty:', editingQty);

      const payload = {
        qty: parseInt(editingQty)
      };

      const response = await fetch(`http://localhost:4000/src/preorder_detail/preorder-detail/${detailId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Update result:', result);

      dispatch(
        openAlert({
          type: 'success',
          title: 'ສຳເລັດ',
          message: `ແກ້ໄຂລາຍການ ID: ${detailId} ສຳເລັດແລ້ວ`,
        })
      );

      // ✅ อัปเดต state ทันทีหลังจากแก้ไข
      setPreorderDetails(prev => 
        prev.map(detail => 
          detail.detail_id === detailId 
            ? { ...detail, qty: parseInt(editingQty) }
            : detail
        )
      );

      // รีเฟรชข้อมูล
      await getList();
      await fetchPreorderDetailsAgain();

      // ออกจากโหมดแก้ไข
      setEditingDetailId(null);
      setEditingQty('');

    } catch (error) {
      console.error('Error updating detail:', error);
      dispatch(
        openAlert({
          type: 'error',
          title: 'ເກີດຂໍ້ຜິດພາດ',
          message: error.message || 'ມີຂໍ້ຜິດພາດໃນການແກ້ໄຂຂໍ້ມູນ',
        })
      );
    } finally {
      setEditLoading(false);
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
      

      {preorderDetails.length > 0 && (
        <div className="mt-4 px-4">
          <h3 className="text-lg font-medium text-form-input mb-2">ລາຍການສິນຄ້າທີ່ມີຢູ່ແລ້ວ:</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-stroke">
              <thead>
                <tr className="text-left bg-gray border border-stroke">
                  <th className="px-4 py-3 tracking-wide text-form-input font-semibold border-r border-stroke">ລະຫັດລາຍລະອຽດ</th>
                  <th className="px-4 py-3 tracking-wide text-form-input font-semibold border-r border-stroke">ຊື່ຢາ</th>
                  <th className="px-4 py-3 tracking-wide text-form-input font-semibold border-r border-stroke">ຈຳນວນ</th>
                  <th className="px-4 py-3 tracking-wide text-form-input font-semibold border-r border-stroke">ຈັດການ</th>
                </tr>
              </thead>
              <tbody>
                {preorderDetails.map((detail, index) => (
                  <tr key={`${detail.detail_id}-${index}`} className="border-b text-md border-stroke">
                    <td className="px-4 py-2 border-r border-stroke">{detail.detail_id}</td>
                    <td className="px-4 py-2 border-r border-stroke">
                      {detail.med_name} ({detail.type_name})
                    </td>
                    <td className="px-4 py-2 border-r border-stroke">
                      {editingDetailId === detail.detail_id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            value={editingQty}
                            onChange={(e) => setEditingQty(e.target.value)}
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                            min="1"
                            disabled={editLoading}
                          />
                          <button
                            onClick={() => handleSaveEdit(detail.detail_id)}
                            className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition-colors text-sm"
                            disabled={editLoading}
                          >
                            {editLoading ? '...' : '✓'}
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600 transition-colors text-sm"
                            disabled={editLoading}
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <span>{detail.qty}</span>
                      )}
                    </td>
                    <td className="px-4 py-2 border-l border-stroke">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditClick(detail)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                          disabled={loading || editingDetailId !== null}
                        >
                          ແກ້ໄຂ
                        </button>
                        <button
                          onClick={() => handleDeleteClick(detail.detail_id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                          disabled={loading || editingDetailId !== null}
                        >
                          {loading ? 'ກຳລັງລົບ...' : 'ລົບ'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(handleSave)} className="mt-6 px-4">
       
        {/* เลือกยา */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ເລືອກຢາ <span className="text-red-500">*</span>
          </label>
          <select
            {...register('med_id', { required: 'ກະລຸນາເລືອກຢາ' })}
            className="text-strokedark dark:text-stroke relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-4.5 outline-none transition focus:border-primary active:border-primary capitalize"
          >
            <option value="">-- ເລືອກຢາ --</option>
            {medicines.map((medicine) => (
              <option key={medicine.med_id} value={medicine.med_id}>
                {medicine.med_name} ({medicine.type_name})
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
            className="text-strokedark dark:text-stroke relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-4.5 outline-none transition focus:border-primary active:border-primary capitalize"
          />
          {errors.qty && (
            <span className="text-red-500 text-sm">{errors.qty.message}</span>
          )}
        </div>

        <div className="mt-8 flex justify-end space-x-4 py-4"> 
          <ButtonBox 
            variant="save" 
            type="submit" 
            disabled={loading || editingDetailId !== null}
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