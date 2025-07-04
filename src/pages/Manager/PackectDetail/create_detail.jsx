import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Loader from '@/common/Loader';
import { useAppDispatch } from '@/redux/hook';
import { openAlert } from '@/redux/reducer/alert';
import ButtonBox from '@/components/Button';
import ConfirmModal from '@/components/Modal';

const AddDetailPacket = ({ id, setShow, getList, onClose }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [packetDetails, setPacketDetails] = useState([]);

  // state สำหรับเก็บลำดับ
  const [deleteSequenceNumber, setDeleteSequenceNumber] = useState(null);

  // state สำหรับ ConfirmModal การลบ
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteDetailId, setDeleteDetailId] = useState(null);

  // state สำหรับ ConfirmModal การเพิ่มยาซ้ำ
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicateData, setDuplicateData] = useState(null);
  const [pendingFormData, setPendingFormData] = useState(null);

  const dispatch = useAppDispatch();

  // ปิดฟอร์ม
  const handleCloseForm = () => {
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

  // ดึงรายละเอียดแพ็คเก็ตที่มีอยู่แล้ว
  useEffect(() => {
    const fetchPacketDetails = async () => {
      if (!id) return;

      try {
        const response = await fetch(
          `http://localhost:4000/src/manager/packet-detail/${id}`,
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setPacketDetails(data.data);
      } catch (error) {
        console.error('Error fetching packet details:', error);
      }
    };

    fetchPacketDetails();
  }, [id]);

  // ฟังก์ชันหาชื่อยาจาก med_id
  const getMedicineName = (medId) => {
    const medicine = medicines.find((med) => med.med_id === medId);
    return medicine ? medicine.med_name : medId;
  };

  // ฟังก์ชันเช็คว่ายามีอยู่ในชุดแล้วหรือไม่
  const checkMedicineExists = async (ser_id, med_id) => {
    try {
      const response = await fetch(
        `http://localhost:4000/src/manager/check-medicine-in-packet/${ser_id}/${med_id}`,
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      return data; // { exists: true/false, data: {...} }
    } catch (error) {
      console.error('Error checking medicine exists:', error);
      return { exists: false, data: null };
    }
  };

  // ฟังก์ชันเพิ่มจำนวนยาที่มีอยู่แล้ว
  const updateMedicineQuantity = async (packetdetail_id, additionalQty) => {
    try {
      const response = await fetch(
        `http://localhost:4000/src/manager/packet-detail/${packetdetail_id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            qty: additionalQty,
            action: 'add', // บอกให้บวกจำนวนเพิ่ม
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'ไม่สามารถเพิ่มจำนวนยาได้');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating medicine quantity:', error);
      throw error;
    }
  };

  // ฟังก์ชันบันทึกข้อมูล (เช็คยาซ้ำก่อน)
  const handleSave = async (formData) => {
    setLoading(true);

    try {
      // เช็คว่ายามีอยู่ในชุดแล้วหรือไม่
      const existingCheck = await checkMedicineExists(id, formData.med_id);

      if (existingCheck.exists) {
        // ยามีอยู่แล้ว - แสดง Modal ยืนยัน
        const medicineName = getMedicineName(formData.med_id);
        const currentQty = existingCheck.data.qty;
        const newQty = parseInt(formData.qty);

        setDuplicateData({
          medicineName,
          currentQty,
          newQty,
          totalQty: currentQty + newQty,
          packetdetail_id: existingCheck.data.packetdetail_id,
        });
        setPendingFormData(formData);
        setShowDuplicateModal(true);
        setLoading(false);
        return;
      }

      // ยาไม่มีในชุด - เพิ่มใหม่
      await addNewMedicine(formData);
    } catch (error) {
      console.error('Error in handleSave:', error);
      dispatch(
        openAlert({
          type: 'error',
          title: 'ເກີດຂໍ້ຜິດພາດ',
          message: error.message || 'ມີຂໍ້ຜິດພາດໃນການບັນທຶກຂໍ້ມູນ',
        }),
      );
      setLoading(false);
    }
  };

  // ฟังก์ชันเพิ่มยาใหม่
  const addNewMedicine = async (formData) => {
    try {
      const payload = {
        ser_id: id,
        med_id: formData.med_id,
        qty: parseInt(formData.qty),
      };

      console.log('Adding new medicine:', payload);

      const response = await fetch(
        'http://localhost:4000/src/manager/packet-detail',
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
          message: `ເພີ່ມຢາໃໝ່ສຳເລັດແລ້ວ ✅`,
        }),
      );

      // รีเซ็ตฟอร์มและรีเฟรชข้อมูล
      reset();
      await Promise.all([getList(), fetchPacketDetailsAgain()]);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันยืนยันเพิ่มจำนวนยาที่มีอยู่แล้ว
  const handleConfirmAddDuplicate = async () => {
    try {
      setLoading(true);
      setShowDuplicateModal(false);

      const result = await updateMedicineQuantity(
        duplicateData.packetdetail_id,
        duplicateData.newQty,
      );

      dispatch(
        openAlert({
          type: 'success',
          title: 'ສຳເລັດ',
          message: `ເພີ່ມຈຳນວນຢາ "${duplicateData.medicineName}" ສຳເລັດແລ້ວ (${duplicateData.currentQty} + ${duplicateData.newQty} = ${duplicateData.totalQty}) ✅`,
        }),
      );

      // รีเซ็ตฟอร์มและรีเฟรชข้อมูล
      reset();
      await Promise.all([getList(), fetchPacketDetailsAgain()]);
    } catch (error) {
      console.error('Error adding duplicate medicine:', error);
      dispatch(
        openAlert({
          type: 'error',
          title: 'ເກີດຂໍ້ຜິດພາດ',
          message: error.message || 'ມີຂໍ້ຜິດພາດໃນການເພີ່ມຈຳນວນຢາ',
        }),
      );
    } finally {
      setLoading(false);
      setDuplicateData(null);
      setPendingFormData(null);
    }
  };

  // ฟังก์ชันยกเลิกการเพิ่มยาซ้ำ
  const handleCancelAddDuplicate = () => {
    setShowDuplicateModal(false);
    setDuplicateData(null);
    setPendingFormData(null);
    setLoading(false);
  };

  // ฟังก์ชัน handleDeleteClick
  const handleDeleteClick = (packetDetailId) => {
    // หาลำดับของรายการที่จะลบ
    const itemIndex = packetDetails.findIndex(
      (detail) => detail.packetdetail_id === packetDetailId,
    );
    const sequenceNumber = itemIndex + 1;

    console.log('Delete button clicked for packetdetail_id:', packetDetailId);
    setDeleteDetailId(packetDetailId);
    setShowDeleteModal(true);

    // เก็บลำดับไว้ใช้ในข้อความแจ้งเตือน
    setDeleteSequenceNumber(sequenceNumber);
  };

  // ฟังก์ชันลบจริงเมื่อยืนยันแล้ว
  const handleDeleteDetail = async () => {
    if (!deleteDetailId) return;

    try {
      setLoading(true);
      setShowDeleteModal(false); // ปิด modal

      console.log('Deleting packetdetail_id:', deleteDetailId);

      const response = await fetch(
        `http://localhost:4000/src/manager/packet-detail/${deleteDetailId}`,
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
          message: `ລົບຢາລຳດັບທີ່ ${deleteSequenceNumber} ສຳເລັດແລ້ວ`,
        }),
      );

      // รีเฟรชข้อมูลหลังจากลบสำเร็จ
      await getList();
      await fetchPacketDetailsAgain();
    } catch (error) {
      console.error('Error deleting packet detail:', error);
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

  // ฟังก์ชันช่วยสำหรับรีเฟรชข้อมูล packet details
  const fetchPacketDetailsAgain = async () => {
    if (!id) return;

    try {
      const detailResponse = await fetch(
        `http://localhost:4000/src/manager/packet-detail/${id}`,
      );
      if (detailResponse.ok) {
        const detailData = await detailResponse.json();
        setPacketDetails(detailData.data || []);
      }
    } catch (error) {
      console.error('Error fetching packet details:', error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="rounded bg-white pt-4 dark:bg-strokedark">
      <div className="flex items-center justify-between border-b border-stroke dark:border-strokedark pb-4">
        <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3 px-4">
          ເພີ່ມລາຍລະອຽດແພັກແກັດ: {id}
        </h1>
      </div>

      {packetDetails.length > 0 && (
        <div className="mt-4 px-4">
          <h3 className="text-lg font-medium text-form-input mb-2">
            ລາຍການສິນຄ້າທີ່ມີຢູ່ແລ້ວ:
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-stroke">
              <thead>
                <tr className="text-left bg-gray border border-stroke">
                  <th className="px-4 py-3 tracking-wide text-form-input font-semibold border-r border-stroke">
                    ລຳດັບ
                  </th>
                  <th className="px-4 py-3 tracking-wide text-form-input font-semibold border-r border-stroke">
                    ຊື່ຢາ
                  </th>
                  <th className="px-4 py-3 tracking-wide text-form-input font-semibold border-r border-stroke">
                    ຈຳນວນ
                  </th>
                  <th className="px-4 py-3 tracking-wide text-form-input font-semibold border-r border-stroke">
                    ຈັດການ
                  </th>
                </tr>
              </thead>
              <tbody>
                {packetDetails.map((detail, index) => (
                  <tr
                    key={`${detail.packetdetail_id}-${index}`}
                    className="border-b text-md border-stroke"
                  >
                    <td className="px-4 py-2 border-r border-stroke">
                      {index + 1}
                    </td>
                    <td className="px-4 py-2 border-r border-stroke">
                      {getMedicineName(detail.med_id)}
                    </td>
                    <td className="px-4 py-2 border-r border-stroke">
                      {detail.qty}
                    </td>
                    <td className="px-4 py-2 border-r border-stroke">
                      <button
                        onClick={() =>
                          handleDeleteClick(detail.packetdetail_id)
                        }
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                        disabled={loading}
                        title={`ลบรายการ ID: ${detail.packetdetail_id}`}
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
            ເລືອກຢາ <span className="text-red-500">*</span>
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
            ຈຳນວນ <span className="text-red-500">*</span>
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

        <div className="mt-8 flex justify-end space-x-4 py-4">
          <ButtonBox variant="save" type="submit" disabled={loading}>
            {loading ? 'ກຳລັງບັນທຶກ...' : 'ເພີ່ມຢາໃນຊຸດ'}
          </ButtonBox>
        </div>
      </form>

      <ConfirmModal
        show={showDeleteModal}
        setShow={setShowDeleteModal}
        message={`ທ່ານຕ້ອງການລົບຢາລຳດັບທີ່ ${deleteSequenceNumber} ອອກຈາກຊຸດບໍ່？`}
        handleConfirm={handleDeleteDetail}
      />

      <ConfirmModal
        show={showDuplicateModal}
        setShow={setShowDuplicateModal}
        message={
          duplicateData
            ? `ຢາ "${duplicateData.medicineName}" ມີໃນຊຸດແລ້ວ (ຈຳນວນປັດຈຸບັນ: ${duplicateData.currentQty})\n\nທ່ານຕ້ອງການເພີ່ມຈຳນວນອີກ ${duplicateData.newQty} ໃຫ້ເປັນ ${duplicateData.totalQty} ບໍ່？`
            : ''
        }
        handleConfirm={handleConfirmAddDuplicate}
        handleCancel={handleCancelAddDuplicate}
      />
    </div>
  );
};

export default AddDetailPacket;
