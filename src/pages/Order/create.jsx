import { useForm } from 'react-hook-form';
import React, { useState, useEffect, useRef } from 'react'; // ✅ เพิ่ม useRef
import Loader from '@/common/Loader';
import Alerts from '@/components/Alerts';
import { useAppDispatch } from '@/redux/hook';
import { openAlert } from '@/redux/reducer/alert';
import BoxDate from '../../components/Date';
import InputBox from '../../components/Forms/Input_new';
import SelectBoxId from '../../components/Forms/SelectID';
import ButtonBox from '../../components/Button';
import { usePrompt } from '@/hooks/usePrompt';

const OrderCreate = ({ setShow, getList, existingIds, onCloseCallback }) => {

  const handleSave = async (data) => {
    setLoading(true);


    const payload = {
      preorder_id: data.preorder_id,
      preorder_date: data.preorder_date,
      status: 'ລໍຖ້າຈັດສົ່ງ', // ✅ เพิ่ม default status
      sup_id: data.supplier, // ✅ แปลงชื่อ field
    };

    // console.log('Payload being sent:', payload); // ✅ Debug log

    try {
      const response = await fetch(
        'http://localhost:4000/src/preorder',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        console.error('API Error:', result); // ✅ Debug log
        throw new Error(result.error || 'ບັນທຶກບໍ່ສຳເລັດ');
      }

      dispatch(
        openAlert({
          type: 'success',
          title: 'ສຳເລັດ',
          message: 'ບັນທຶກຂໍ້ມູນສຳເລັດແລ້ວ ✅',
        }),
      );

      await getList();
      reset();
      setShow(false);
    } catch (error) {
      console.error('Error saving data:', error);
      dispatch(
        openAlert({
          type: 'error',
          title: 'ເກີດຂໍ້ຜິດພາດ',
          message: error.message || 'ການບັນທຶກຂໍ້ມູນມີຂໍ້ຜິດພາດ',
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading || loadingNextId) return <Loader />;
  return (
    <div className="rounded bg-white pt-4 dark:bg-boxdark">
      <Alerts />
      <div className="flex items-center border-b border-stroke dark:border-strokedark pb-4">
        <h1 className="text-lg font-medium text-strokedark dark:text-bodydark3 px-4">
          ເພີ່ມຂໍ້ມູນ
        </h1>
      </div>

      <form
        onSubmit={handleSubmit(handleSave)}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 pt-4"
      >
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-black ">
            ລະຫັດອໍເດີ້
          </label>
          <input
            type="text"
            value={nextPreorderId}
            readOnly
            className="w-full rounded border-[1.5px] border-stroke bg-gray-100 py-3 px-5 text-black outline-none dark:border-form-strokedark dark:bg-gray-700 dark:text-white cursor-not-allowed"
          />
          {/* Hidden input สำหรับส่งค่าไปกับฟอร์ม */}
          <input type="hidden" {...register('preorder_id')} />
        </div>

        <BoxDate
          name="preorder_date"
          label="ວັນທີສັ່ງຊື້"
          register={register}
          errors={errors}
          select={selectedDate}
          formOptions={{ required: 'ກະລຸນາເລືອກວັນທີວັນທີສັ່ງຊື້' }}
          setValue={setValue}
          withTime={false}
        />


        <SelectBoxId
          label="ຜູ້ສະໜອງ"
          name="supplier"
          value={selectSup}
          options={supplier.map((s) => ({
            value: s.sup_id,
            label: `${s.company_name} ${s.address}`,
          }))}
          register={register}
          errors={errors}
          formOptions={{ required: 'ກະລຸນາເລືອກຜູ້ສະໜອງ' }} // ✅ เพิ่ม validation
          onSelect={(e) => {
            setSelectSup(e.target.value);
            setSup(e.target.value);
          }}
        />


        <SelectBoxId
          label="ພະນັກງານ (ຜູ້ສ້າງ)"
          name="emp_id_create"
          value={selectEmpCreate}
          options={employees.map((emp) => ({
            label: `${emp.name} ${emp.surname} ${emp.role}`,
            value: emp.id,
          }))}
          register={register}
          errors={errors}
          formOptions={{ required: 'ກະລຸນາເລືອກພະນັກງານ' }} // ✅ เพิ่ม validation
          onSelect={(e) => setSelectEmpCreate(e.target.value)}
        />


        <div className="flex justify-end  col-span-full  py-4">

          <ButtonBox variant="save" type="submit" disabled={loading}>
            {loading ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກ'}
          </ButtonBox>
        </div>
      </form>
    </div>
  );
};

export default OrderCreate;
