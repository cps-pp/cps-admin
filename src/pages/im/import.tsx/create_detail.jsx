import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Loader from '@/common/Loader';
import { useAppDispatch } from '@/redux/hook';
import { openAlert } from '@/redux/reducer/alert';
import ButtonBox from '@/components/Button';
import { usePrompt } from '@/hooks/usePrompt';
import ConfirmModal from '@/components/Modal';

const AddDetailImport = ({ id, setShow, getList, onClose }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [importDetails, setImportDetails] = useState([]);
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
  usePrompt(
    'ທ່ານຕ້ອງການອອກຈາກໜ້ານີ້ແທ້ຫຼືບໍ? ຂໍ້ມູນທີ່ກຳລັງປ້ອນຈະສູນເສຍ.',
    isDirty,
  );

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
      const confirmLeave = window.confirm(
        'ທ່ານຕ້ອງການປິດຟອມແທ້ຫຼືບໍ? ຂໍ້ມູນທີ່ປ້ອນຈະສູນເສຍ',
      );
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
        const response = await fetch(
          'http://localhost:4000/src/manager/medicines',
        );
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
          }),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, [dispatch]);

  // ดึงรายละเอียด import ที่มีอยู่แล้ว
  useEffect(() => {
    const fetchImportDetails = async () => {
      if (!id) return;

      try {
        const response = await fetch(
          `http://localhost:4000/src/im_detail/import-detail/${id}`,
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setImportDetails(data.data);

        // เก็บ detail_id ที่มีอยู่แล้ว
        const ids = data.data.map((detail) => detail.detail_id);
        setExistingDetailIds(ids);
      } catch (error) {
        console.error('Error fetching import details:', error);
      }
    };

    fetchImportDetails();
  }, [id]);

  // ✅ ฟังก์ชันสร้าง detail_id ใหม่แบบอัตโนมัติ (ดึงจากฐานข้อมูล)
  const generateDetailId = async () => {
    try {
      const response = await fetch(
        'http://localhost:4000/src/im_detail/get-last-detail-id',
      );

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
    const medicine = medicines.find((med) => med.med_id === medId);
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
        im_id: id,
        med_id: formData.med_id,
        qty: parseInt(formData.qty),
        expired_date: formData.expired_date,
      };

      console.log('Payload being sent:', payload);

      const response = await fetch(
        'http://localhost:4000/src/im_detail/import-detail',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        console.error('API Error:', result);
        throw new Error(result.error || 'ບັນທຶກບໍ່ສຳເລັດ');
      }

      dispatch(
        openAlert({
          type: 'success',
          title: 'ສຳເລັດ',
          message: `ເພີ່ມລາຍລະອຽດສິນຄ້ານຳເຂົ້າສຳເລັດແລ້ວ (ID: ${newDetailId}) ✅`,
        }),
      );
      window.dispatchEvent(new Event('refresh-notifications'));
      // รีเฟรชข้อมูล
      await getList();
      await fetchImportDetailsAgain();

      // รีเซ็ตฟอร์ม
      reset();
    } catch (error) {
      console.error('Error saving detail:', error);
      dispatch(
        openAlert({
          type: 'error',
          title: 'ເກີດຂໍ້ຜິດພາດ',
          message: error.message || 'ມີຂໍ້ຜິດພາດໃນການບັນທຶກຂໍ້ມູນ',
        }),
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

      const response = await fetch(
        `http://localhost:4000/src/im_detail/import-detail/${deleteDetailId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! Status: ${response.status}`,
        );
      }

      const result = await response.json();
      console.log('Delete result:', result);

      dispatch(
        openAlert({
          type: 'success',
          title: 'ສຳເລັດ',
          message: `ລົບລາຍການ ID: ${deleteDetailId} ສຳເລັດແລ້ວ`,
        }),
      );
      window.dispatchEvent(new Event('refresh-notifications'));
      // รีเฟรชข้อมูลหลังจากลบสำเร็จ
      await getList();
      await fetchImportDetailsAgain();
    } catch (error) {
      console.error('Error deleting detail:', error);
      dispatch(
        openAlert({
          type: 'error',
          title: 'ເກີດຂໍ້ຜິດພາດ',
          message: error.message || 'ມີຂໍ້ຜິດພາດໃນການລົບຂໍ້ມູນ',
        }),
      );
    } finally {
      setLoading(false);
      setDeleteDetailId(null); // รีเซ็ต
    }
  };

  // ✅ ฟังก์ชันช่วยสำหรับรีเฟรชข้อมูล import details
  const fetchImportDetailsAgain = async () => {
    if (!id) return;

    try {
      const detailResponse = await fetch(
        `http://localhost:4000/src/im_detail/import-detail/${id}`,
      );
      if (detailResponse.ok) {
        const detailData = await detailResponse.json();
        setImportDetails(detailData.data || []);
        const ids = (detailData.data || []).map((detail) => detail.detail_id);
        setExistingDetailIds(ids);
      }
    } catch (error) {
      console.error('Error fetching import details:', error);
    }
  };

  // ฟังก์ชันจัดรูปแบบวันที่สำหรับแสดงผล
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="rounded bg-white pt-4 dark:bg-strokedark">
      <div className="flex items-center justify-between border-b border-stroke  pb-4">
        <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark  px-4">
          ເພີ່ມລາຍລະອຽດສິນຄ້ານຳເຂົ້າ - ໃບນຳເຂົ້າ: {id}
        </h1>
      </div>

      {/* <div className="px-4 py-2 bg-gray-50">
      <p className="text-md text-gray-600 d">
        <strong className='text-form-input'>ລະຫັດໃບນຳເຂົ້າ:</strong> {id} 
        <span className="ml-4"> <strong className='text-form-input'>ສະຖານະ:</strong> ກຳລັງເພີ່ມລາຍລະອຽດສິນຄ້ານຳເຂົ້າ</span>
      </p>
    </div> */}
      {importDetails.length > 0 && (
        <div className="mt-4 px-4">
          <h3 className="text-lg font-medium text-form-input mb-2">
            ລາຍການສິນຄ້າທີ່ມີຢູ່ແລ້ວ:
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-stroke">
              <thead>
                <tr className="text-left bg-gray border border-stroke">
                  <th className="px-4 py-3 tracking-wide text-form-input font-semibold border-r border-stroke">
                    ລະຫັດລາຍລະອຽດ
                  </th>
                  <th className="px-4 py-3 tracking-wide text-form-input font-semibold border-r border-stroke">
                    ຊື່ຢາ
                  </th>
                  <th className="px-4 py-3 tracking-wide text-form-input font-semibold border-r border-stroke">
                    ຈຳນວນ
                  </th>
                  <th className="px-4 py-3 tracking-wide text-form-input font-semibold border-r border-stroke">
                    ວັນທີ່ໝົດອາຍຸ
                  </th>
                  <th className="px-4 py-3 tracking-wide text-form-input font-semibold border-r border-stroke">
                    ຈັດການ
                  </th>
                </tr>
              </thead>
              <tbody>
                {importDetails.map((detail, index) => (
                  <tr
                    key={`${detail.detail_id}-${index}`}
                    className="border-b text-md border-stroke"
                  >
                    <td className=" px-4 py-2 border-r border-stroke">
                      {detail.detail_id}
                    </td>
                    <td className=" px-4 py-2 border-r border-stroke">
                      {getMedicineName(detail.med_id)} ({detail.med_id})
                    </td>
                    <td className=" px-4 py-2  border-r border-stroke">
                      {detail.qty}
                    </td>
                    <td className=" px-4 py-2">
                      {formatDate(detail.expired_date)}
                    </td>
                    <td className=" px-4 py-2  border-l border-stroke">
                      <button
                        onClick={() => handleDeleteClick(detail.detail_id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-color   "
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

      <form onSubmit={handleSubmit(handleSave)} className="mt-6 px-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ເລືອກຢາ
          </label>
          <select
            {...register('med_id', { required: 'ກະລຸນາເລືອກຢາ' })}
            className="text-strokedark dark:text-stroke relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-4.5 outline-none transition focus:border-primary active:border-primary  capitalize"
          >
            <option value="">-- ເລືອກຢາ --</option>
            {medicines.map((medicine) => (
              <option key={medicine.med_id} value={medicine.med_id}>
                {medicine.med_name} ({medicine.med_id})
              </option>
            ))}
          </select>
          {errors.med_id && (
            <span className="text-red-500 text-sm">
              {errors.med_id.message}
            </span>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ຈຳນວນ
          </label>
          <input
            {...register('qty', {
              required: 'ກະລຸນາປ້ອນຈຳນວນ',
              min: { value: 1, message: 'ຈຳນວນຕ້ອງມາກກວ່າ 0' },
            })}
            type="number"
            placeholder="ປ້ອນຈຳນວນ"
            className="text-strokedark dark:text-stroke relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-4.5 outline-none transition focus:border-primary active:border-primary  capitalize"
          />
          {errors.qty && (
            <span className="text-red-500 text-sm">{errors.qty.message}</span>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ວັນທີ່ໝົດອາຍຸ
          </label>
          <input
            {...register('expired_date', {
              required: 'ກະລຸນາເລືອກວັນທີ່ໝົດອາຍຸ',
            })}
            type="date"
            className="text-strokedark dark:text-stroke relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-4.5 outline-none transition focus:border-primary active:border-primary  capitalize"
          />
          {errors.expired_date && (
            <span className="text-red-500 text-sm">
              {errors.expired_date.message}
            </span>
          )}
        </div>

        <div className="mt-4 flex justify-end space-x-4 py-2 pb-4 ">
          <ButtonBox variant="save" type="submit" disabled={loading}>
            {loading ? 'ກຳລັງບັນທຶກ...' : 'ເພີ່ມສິນຄ້ານຳເຂົ້າ'}
          </ButtonBox>
        </div>
      </form>

      <ConfirmModal
        show={showModal}
        setShow={setShowModal}
        message={`ທ່ານຕ້ອງການລົບລາຍການ ID: ${deleteDetailId} ອອກຈາກລະບົບບໍ່？`}
        handleConfirm={handleDeleteDetail}
      />
    </div>
  );
};

export default AddDetailImport;
