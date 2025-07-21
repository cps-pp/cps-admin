import { useForm } from 'react-hook-form';
import Button from '@/components/Button';
import React, { useState, useEffect, useRef } from 'react';
import Loader from '@/common/Loader';
import Alerts from '@/components/Alerts';
import { useAppDispatch } from '@/redux/hook';
import { openAlert } from '@/redux/reducer/alert';
import FileUploadInput from '@/components/Forms/FileUploadInput';

import InputBox from '../../../components/Forms/Input_new';
import SelectBoxId from '../../../components/Forms/SelectID';
import ConfirmModal from '../../../components/Modal';

const CreateImport = ({ setShow, getList, onCloseCallback, preorderId }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isDirty, errors },
  } = useForm();

  const dispatch = useAppDispatch();

  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [loadingNextId, setLoadingNextId] = useState(true);
  const [loadingPreorderDetails, setLoadingPreorderDetails] = useState(false);
  const [nextImportId, setNextImportId] = useState('');
  const [selectedEmp, setSelectedEmp] = useState('');
  const [selectedPreorder, setSelectedPreorder] = useState('');
  const [employees, setEmployees] = useState([]);
  const [preorders, setPreorders] = useState([]);
  const [usedPreorders, setUsedPreorders] = useState([]);
  const [preorderDetails, setPreorderDetails] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  // เพิ่ม state สำหรับ Modal ยืนยัน
  const [showModal, setShowModal] = useState(false);

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleConfirmDelete = () => {
    console.log('handleConfirmDelete ถูกเรียกแล้ว');

    setSelectedEmp(''); // ล้าง employee
    setValue('file', null); // หรือ reset() ก็ได้
    setSelectedPreorder(''); // ล้าง preorder
    setValue('note', ''); // ล้าง note
    setPreorderDetails(null); // ล้าง preorder details

    setShowModal(false);
    setSelectedId(null);
  };
  const handleDelete = () => {
    if (nextImportId && nextImportId !== '' && getCurrentDate()) {
      handleConfirmDelete();
    } else {
      setShowModal(true);
    }
  };
  // const handleDelete = () => {
  //   setShowModal(true);
  // };

  // const isDirtyRef = useRef(isDirty);

  // useEffect(() => {
  //   isDirtyRef.current = isDirty;
  // }, [isDirty]);

  // usePrompt('ທ່ານຕ້ອງການອອກຈາກໜ້ານີ້ແທ້ຫຼືບໍ? ຂໍ້ມູນທີ່ກຳລັງປ້ອນຈະສູນເສຍ.', isDirty);

  // useEffect(() => {
  //   const handleBeforeUnload = (event) => {
  //     if (!isDirtyRef.current) return;
  //     event.preventDefault();
  //     event.returnValue = '';
  //   };

  //   window.addEventListener('beforeunload', handleBeforeUnload);
  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //   };
  // }, []);

  // const handleCloseForm = () => {
  //   if (isDirtyRef.current) {
  //     const confirmLeave = window.confirm('ທ່ານຕ້ອງການປິດຟອມແທ້ຫຼືບໍ? ຂໍ້ມູນທີ່ປ້ອນຈະສູນເສຍ');
  //     if (!confirmLeave) return;
  //   }
  //   setShow(false);
  // };

  useEffect(() => {
    if (onCloseCallback) {
      onCloseCallback(() => handleCloseForm);
    }
  }, [onCloseCallback]);

  useEffect(() => {
    const fetchNextId = async () => {
      try {
        setLoadingNextId(true);
        const response = await fetch(
          'http://localhost:4000/src/im/next-import-id',
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setNextImportId(data.nextId);
        setValue('im_id', data.nextId);

        const currentDate = getCurrentDate();
        setValue('im_date', currentDate);
      } catch (error) {
        console.error('Error fetching next Import ID:', error);
        dispatch(
          openAlert({
            type: 'error',
            title: 'ເກີດຂໍ້ຜິດພາດ',
            message: 'ບໍ່ສາມາດດຶງລະຫັດ Import ໃໝ່ໄດ້',
          }),
        );
      } finally {
        setLoadingNextId(false);
      }
    };

    fetchNextId();
  }, [dispatch, setValue]);

  const fetchUsedPreorders = async () => {
    try {
      const response = await fetch('http://localhost:4000/src/im/import');
      if (response.ok) {
        const data = await response.json();
        const usedPreorderIds = data.data
          .filter((item) => item.preorder_id)
          .map((item) => item.preorder_id);
        setUsedPreorders(usedPreorderIds);
      }
    } catch (error) {
      console.error('Error fetching used preorders:', error);
    }
  };

  const fetchPreorderDetails = async (preorderId) => {
    if (!preorderId) {
      setPreorderDetails(null);
      return;
    }

    try {
      setLoadingPreorderDetails(true);
      const response = await fetch(
        `http://localhost:4000/src/preorder_detail/preorder-detail/${preorderId}`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setPreorderDetails(data.data);
    } catch (error) {
      console.error('Error fetching preorder details:', error);
      dispatch(
        openAlert({
          type: 'error',
          title: 'ເກີດຂໍ້ຜິດພາດ',
          message: 'ບໍ່ສາມາດດຶງລາຍລະອຽດ Preorder ໄດ້',
        }),
      );
      setPreorderDetails(null);
    } finally {
      setLoadingPreorderDetails(false);
    }
  };

  useEffect(() => {
    if (preorderId) {
      console.log('Setting preorder_id from props:', preorderId);
      setSelectedPreorder(preorderId);
      setValue('preorder', preorderId);
      fetchPreorderDetails(preorderId);
    }
  }, [preorderId, setValue]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch('http://localhost:4000/src/manager/emp');
        const data = await res.json();
        if (res.ok) {
          const transformedData = data.data.map((emp) => ({
            id: emp.emp_id,
            name: emp.emp_name,
            surname: emp.emp_surname,
            role: emp.role,
          }));
          setEmployees(transformedData);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
        dispatch(
          openAlert({
            type: 'error',
            title: 'ເກີດຂໍ້ຜິດພາດ',
            message: 'ບໍ່ສາມາດດຶງຂໍ້ມູນພະນັກງານໄດ້',
          }),
        );
      }
    };

    const fetchPreorders = async () => {
      try {
        const res = await fetch('http://localhost:4000/src/preorder');
        const data = await res.json();
        if (res.ok) {
          setPreorders(data.data);
        }
      } catch (error) {
        console.error('Error fetching preorders:', error);
        dispatch(
          openAlert({
            type: 'error',
            title: 'ເກີດຂໍ້ຜິດພາດ',
            message: 'ບໍ່ສາມາດດຶງຂໍ້ມູນ preorder ໄດ້',
          }),
        );
      }
    };

    fetchEmployees();
    fetchPreorders();
    fetchUsedPreorders();
  }, [dispatch]);

  const validatePreorderUsage = (preorderId) => {
    if (usedPreorders.includes(preorderId)) {
      dispatch(
        openAlert({
          type: 'error',
          title: 'ບໍ່ສາມາດນຳເຂົ້າໄດ້',
          message: `ລະຫັດ Preorder ${preorderId} ໄດ້ຖືກນຳເຂົ້າແລ້ວ ບໍ່ສາມາດນຳເຂົ້າຊ້ຳໄດ້`,
        }),
      );
      return false;
    }
    return true;
  };

  const saveImportDetails = async (importId, preorderDetails) => {
    if (!preorderDetails || preorderDetails.length === 0) return;

    console.log('Saving import details for import_id:', importId);
    console.log('Preorder details to save:', preorderDetails);

    try {
      for (const detail of preorderDetails) {
        const detailData = {
          im_id: importId,
          med_id: detail.med_id,
          qty: detail.qty,
        };

        console.log('Sending detail data:', detailData);

        const response = await fetch(
          'http://localhost:4000/src/im_detail/import-detail',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(detailData),
          },
        );

        const result = await response.json();

        if (!response.ok) {
          console.error('Error saving detail:', result);
          throw new Error(
            result.error ||
              `Failed to save detail for med_id: ${detail.med_id}`,
          );
        }

        console.log(
          `Successfully saved detail for med_id: ${detail.med_id}`,
          result,
        );
      }

      console.log('All import details saved successfully!');
    } catch (error) {
      console.error('Error in saveImportDetails:', error);
      throw error;
    }
  };

  // const handleSave = async (data) => {
  //   if (!validatePreorderUsage(selectedPreorder)) {
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     const formData = new FormData();
  //     formData.append('im_id', data.im_id);
  //     formData.append('im_date', getCurrentDate());
  //     formData.append('preorder_id', selectedPreorder);
  //     formData.append('emp_id', selectedEmp);
  //     formData.append('note', data.note || '');

  //     if (data.file && data.file.length > 0) {
  //       formData.append('file', data.file[0]);
  //     }

  //     console.log('Saving import data...');
  //     const response = await fetch('http://localhost:4000/src/im/import', {
  //       method: 'POST',
  //       body: formData,
  //     });

  //     const result = await response.json();

  //     if (!response.ok) {
  //       if (result.message && result.message.includes('preorder_id')) {
  //         throw new Error(
  //           'ລະຫັດ Preorder ນີ້ໄດ້ຖືກນຳເຂົ້າແລ້ວ ບໍ່ສາມາດນຳເຂົ້າຊ້ຳໄດ້',
  //         );
  //       }
  //       throw new Error(result.error || result.message || 'ບັນທຶກບໍ່ສຳເລັດ');
  //     }

  //     console.log('Import saved successfully:', result);

  //     // ✅ Step 2: บันทึกรายละเอียดการนำเข้าจาก preorder details
  //     if (preorderDetails && preorderDetails.length > 0) {
  //       console.log('Saving import details...');
  //       await saveImportDetails(data.im_id, preorderDetails);

  //       dispatch(
  //         openAlert({
  //           type: 'success',
  //           title: 'ສຳເລັດ',
  //           message: `ບັນທຶກ Import ແລະລາຍລະອຽດສຳເລັດແລ້ວ (${preorderDetails.length} ລາຍການ) ✅`,
  //         }),
  //       );
  //     } else {
  //       dispatch(
  //         openAlert({
  //           type: 'success',
  //           title: 'ສຳເລັດ',
  //           message: 'ບັນທຶກ Import ສຳເລັດແລ້ວ ✅',
  //         }),
  //       );
  //     }

  //     // ✅ Step 3: รีเฟรชและปิดฟอร์ม
  //     window.dispatchEvent(new Event('refresh-notifications'));
  //     await getList();
  //     reset();
  //     setSelectedEmp('');
  //     setSelectedPreorder('');
  //     setPreorderDetails(null);
  //     setShow(false);
  //   } catch (error) {
  //     console.error('Error saving data:', error);
  //     dispatch(
  //       openAlert({
  //         type: 'error',
  //         title: 'ເກີດຂໍ້ຜິດພາດ',
  //         message: error.message || 'ການບັນທຶກຂໍ້ມູນມີຂໍ້ຜິດພາດ',
  //       }),
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };
const handleSave = async (data) => {
  if (!validatePreorderUsage(selectedPreorder)) {
    return;
  }

  setLoading(true);
  try {
    const formData = new FormData();
    formData.append('im_id', data.im_id);
    formData.append('im_date', getCurrentDate());
    formData.append('preorder_id', selectedPreorder);
    formData.append('emp_id', selectedEmp);
    formData.append('note', data.note || '');

    if (data.file && data.file.length > 0) {
      formData.append('file', data.file[0]);
    }

    const response = await fetch('http://localhost:4000/src/im/import', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      if (result.message && result.message.includes('preorder_id')) {
        throw new Error(
          'ລະຫັດ Preorder ນີ້ໄດ້ຖືກນຳເຂົ້າແລ້ວ ບໍ່ສາມາດນຳເຂົ້າຊ້ຳໄດ້',
        );
      }
      throw new Error(result.error || result.message || 'ບັນທຶກບໍ່ສຳເລັດ');
    }

    // บันทึกรายละเอียด import ถ้ามี
    if (preorderDetails && preorderDetails.length > 0) {
      await saveImportDetails(data.im_id, preorderDetails);
      dispatch(
        openAlert({
          type: 'success',
          title: 'ສຳເລັດ',
          message: `ບັນທຶກນຳເຂົ້າ ແລະ ລາຍລະອຽດສຳເລັດແລ້ວ (${preorderDetails.length} ລາຍການ)`,
        }),
      );
    } else {
      dispatch(
        openAlert({
          type: 'success',
          title: 'ສຳເລັດ',
          message: 'ບັນທຶກການນຳເຂົ້າສຳເລັດແລ້ວ ',
        }),
      );
    }

    // ดึง next import ID ใหม่มาเซ็ต
    const nextIdResponse = await fetch(
      'http://localhost:4000/src/im/next-import-id',
    );
    if (!nextIdResponse.ok) {
      throw new Error('ບໍ່ສາມາດດຶງລະຫັດ Import ໃໝ່ໄດ້');
    }
    const nextIdData = await nextIdResponse.json();
    setNextImportId(nextIdData.nextId);
    setValue('im_id', nextIdData.nextId);

    // เคลียร์ฟอร์มอื่น ๆ
    reset({ im_id: nextIdData.nextId, im_date: getCurrentDate() });
    setSelectedEmp('');
    setSelectedPreorder('');
    setPreorderDetails(null);

    // รีเฟรช list ในหน้าหลัก
    await getList();

    // ไม่ต้องปิดฟอร์ม (ถ้าต้องการปิด ให้ setShow(false))
    // setShow(false);

  } catch (error) {
    console.error('Error saving data:', error);
    // dispatch(
    //   openAlert({
    //     type: 'error',
    //     title: 'ເກີດຂໍ້ຜິດພາດ',
    //     message: error.message || 'ການບັນທຶກຂໍ້ມູນມີຂໍ້ຜິດພາດ',
    //   }),
    // );
  } finally {
    setLoading(false);
  }
};

  const availablePreorders = preorders.filter(
    (preorder) => !usedPreorders.includes(preorder.preorder_id),
  );

  if (loading || loadingNextId) return <Loader />;

  return (
    <>
      <div className="">
        <Alerts />
        {/* <div className="flex items-center border-b border-stroke dark:border-strokedark pb-4">
        <h1 className="text-lg font-medium text-strokedark dark:text-bodydark3 px-4">
          ເພີ່ມຂໍ້ມູນນຳເຂົ້າ
        </h1>
      </div> */}

        <form onSubmit={handleSubmit(handleSave)} className="">
          {/* ข้อมูลพื้นฐาน */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="">
              <label className="block text-sm font-medium mb-2 text-black dark:text-white">
                ລະຫັດນຳເຂົ້າ
              </label>
              <input
                type="text"
                value={nextImportId}
                readOnly
                className="w-full rounded-lg border-[1.5px] border-stroke bg-gray-100 py-3 px-5 text-black outline-none dark:border-form-strokedark dark:bg-gray-700 dark:text-white cursor-not-allowed"
              />
              <input type="hidden" {...register('im_id')} />
            </div>

            <div className="">
              <label className="block text-sm font-medium mb-2 text-black dark:text-white">
                ວັນທີ່ນຳເຂົ້າ
              </label>
              <input
                type="text"
                value={getCurrentDate()}
                readOnly
                className="w-full rounded-lg border-[1.5px] border-stroke bg-gray-100 py-3 px-5 text-black outline-none dark:border-form-strokedark dark:bg-gray-700 dark:text-white cursor-not-allowed"
              />
              <input type="hidden" {...register('im_date')} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectBoxId
              label="ເລືອກພະນັກງານ"
              name="employee"
              value={selectedEmp}
              options={employees.map((emp) => ({
                value: emp.id,
                label: `${emp.name} ${emp.surname} (${emp.role})`,
              }))}
              register={register}
              errors={errors}
              formOptions={{ required: 'ກະລຸນາເລືອກພະນັກງານ' }}
              onSelect={(e) => {
                setSelectedEmp(e.target.value);
              }}
            />
   <SelectBoxId
              label="Preorder (ທີ່ຍັງບໍ່ໄດ້ນຳເຂົ້າ)"
              name="preorder"
              value={selectedPreorder}
              options={availablePreorders.map((preorder) => ({
                value: preorder.preorder_id,
                label: `${preorder.preorder_id || ''}`,
              }))}
              register={register}
              errors={errors}
              formOptions={{ required: 'ກະລຸນາເລືອກ Preorder' }}
              onSelect={(e) => {
                const value = e.target.value;
                setSelectedPreorder(value);
                fetchPreorderDetails(value);
              }}
            />
           
          </div>

          {/* แถวที่สอง: เลือกนำเข้า และหมายเหตุ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
            <FileUploadInput
              label="ໄຟລ໌ເອກະສານ"
              name="file"
              type="file"
              register={register}
              errors={errors}
              formOptions={{ required: false }}
            />

            <InputBox
              label="ໝາຍເຫດ (ບໍ່ບັງຄັບ)"
              name="note"
              type="text"
              placeholder="ກະລຸນາປ້ອນໝາຍເຫດຖ້າມີ"
              register={register}
            />
          </div>

          {/* แสดงรายละเอียด Preorder */}
          {selectedPreorder && (
            <div className="mb-6 border border-stroke rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2 text-black dark:text-white">
                ລາຍລະອຽດການນຳເຂົ້າລະຫັດໃບບິນ: {selectedPreorder}
              </h3>

              {loadingPreorderDetails ? (
                <div className="flex justify-center py-4">
                  <div className="text-gray-500">ກຳລັງໂຫຼດຂໍ້ມູນ...</div>
                </div>
              ) : preorderDetails && preorderDetails.length > 0 ? (
                <div>
                  <div className="mb-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      * ຈຳນວນລາຍການທັ້ງໝົດ: {preorderDetails.length} ລາຍການ
                    </span>
                  </div>

                  {/* ตารางรายการยา */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse border border-gray-300 dark:border-gray-600">
                      <thead>
                        <tr className="bg-gray-100 dark:bg-gray-700">
                          <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-black dark:text-white">
                            ລຳດັບ
                          </th>
                          <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-black dark:text-white">
                            ລະຫັດຢາ
                          </th>
                          <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-black dark:text-white">
                            ຊື່ຢາ
                          </th>
                          <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-black dark:text-white">
                            ປະເພດ
                          </th>
                          <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-right text-black dark:text-white">
                            ຈຳນວນ
                          </th>
                          <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center text-black dark:text-white">
                            ຫົວໜ່ວຍ
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {preorderDetails.map((detail, index) => (
                          <tr
                            key={detail.detail_id || index}
                            className="hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-black dark:text-white">
                              {index + 1}
                            </td>
                            <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-black dark:text-white">
                              {detail.med_id}
                            </td>
                            <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-black dark:text-white">
                              {detail.med_name}
                            </td>
                            <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-black dark:text-white">
                              {detail.type_name}
                            </td>
                            <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-right text-black dark:text-white">
                              {detail.qty}
                            </td>
                            <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center text-black dark:text-white">
                              {detail.unit}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 text-center py-4">
                  ເລືອກ Preorder ເພື່ອເບິ່ງລາຍລະອຽດ
                </div>
              )}
            </div>
          )}

          {/* ปุ่มบันทึก */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
            >
              ລ້າງຂໍ້ມູນ
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              ບັນທຶກ
            </button>
          </div>
        </form>
      </div>

      {/* Modal ยืนยันการล้างข้อมูล */}
      <ConfirmModal
        show={showModal}
        setShow={setShowModal}
        message="ທ່ານຕ້ອງການລ້າງຂໍ້ມູນທີ່ກຳລັງປ້ອນແທ້ຫຼືບໍ່?"
        handleConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default CreateImport;
