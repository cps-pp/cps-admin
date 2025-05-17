import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Button from '@/components/Button';
import Input from '@/components/Forms/Input_two';
import Loader from '@/common/Loader';
import { useAppDispatch } from '@/redux/hook';
import { openAlert } from '@/redux/reducer/alert';
import SelectID from '@/components/Forms/SelectID';
import DatePicker from '@/components/DatePicker_two';

interface CreateCategoryProps {
  setShow: (value: boolean) => void;
  getListCategory: any;
}

const CreateCategory: React.FC<CreateCategoryProps> = ({
  setShow,
  getListCategory,
}) => {
  const {
    register,
    handleSubmit,
    reset,

    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleSave = async (formData: any) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/src/manager/category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type_name: formData.type_name,
          medtype_id: formData.medtype_id,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      dispatch(
        openAlert({
          type: 'success',
          title: 'ສຳເລັດ',
          message: 'ບັນທຶກຂໍ້ມູນປະເພດຢາສຳເລັດແລ້ວ',
        }),
      );
      setShow(false);
      await getListCategory(); //Fetching Latest Data from the Server
      reset();
    } catch (error: any) {
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

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="rounded bg-white pt-4 dark:bg-strokedark">
      <div className="flex items-center justify-between border-b border-stroke dark:border-strokedark pb-4">
        <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3 px-4">
          ເພີ່ມຂໍ້ມູນ
        </h1>
      </div>

      <form onSubmit={handleSubmit(handleSave)} className="mt-4 px-4">
        <Input
          label="ລະຫັດປະເພດ"
          name="medtype_id"
          type="text"
          placeholder="ປ້ອນລະຫັດປະເພດ"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນລະຫັດປະເພດກ່ອນ' }}
          errors={errors}
        />
        <Input
          label="ຊື່ປະເພດ"
          name="type_name"
          type="text"
          placeholder="ປ້ອນຊື່ປະເພດ"
          register={register}
          formOptions={{ required: 'ກະລຸນາປ້ອນຊື່ປະເພດກ່ອນ' }}
          errors={errors}
        />

   
        <div className="mt-8 flex justify-end space-x-4  py-4">
        
          <Button variant="save" type="submit" disabled={loading}>
            {loading ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກ'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateCategory;

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useForm } from 'react-hook-form';
// import Button from '@/components/Button';
// import Input from '@/components/Forms/Input_two';
// import BackButton from '@/components/BackButton';

// const CreateCategory: React.FC = () => {
//   const navigate = useNavigate();
//   const { register, handleSubmit, formState: { errors } } = useForm();
//   const [loading, setLoading] = useState(false);

//   const handleSave = async (formData: any) => {
//     setLoading(true);
//     try {
//       const response = await fetch('http://localhost:4000/manager/category', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           type_name: formData.type_name,
//           medtype_id: formData.medtype_id, // Add medtype_id here
//         }),

//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       navigate('/manager/category'); // กลับไปหน้าหมวดหมู่
//     } catch (error) {
//       console.error('Error saving category:', error);
//       alert('ບໍ່ສາມາດເພີ່ມຂໍ້ມູນປະເພດຢາ');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="rounded bg-white pt-4 dark:bg-boxdark">
//       <div className="flex items-center  border-b border-stroke px-4 dark:border-strokedark pb-4">
//         <BackButton className="" />
//         <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3 px-6">
//           ເພີ່ມຂໍ້ມູນ
//         </h1>
//       </div>

//       <form onSubmit={handleSubmit(handleSave)} className="mt-4 px-4">
//       <Input
//           label="ລະຫັດປະເພດ"
//           name="medtype_id"
//           type="text"
//           placeholder="ປ້ອນລະຫັດປະເພດ"
//           register={register}
//           formOptions={{ required: 'ກະລຸນາປ້ອນລະຫັດປະເພດກ່ອນ' }}
//           errors={errors}
//           className="text-strokedark dark:text-bodydark3"
//         />
//         <Input
//           label="ຊື່ປະເພດ"
//           name="type_name"
//           type="text"
//           placeholder="ປ້ອນຊື່ປະເພດ"
//           register={register}
//           formOptions={{ required: 'ກະລຸນາປ້ອນຊື່ປະເພດກ່ອນ' }}
//           errors={errors}
//           className="text-strokedark dark:text-bodydark3"
//         />

// <div className="mt-8 flex justify-end space-x-4 col-span-full px-4 py-4">
//           <button className="px-6 py-2 text-md font-medium uppercase text-red-500" type="button" onClick={() => navigate("/manager/patient")}>
//             ຍົກເລິກ
//           </button>
//           <Button variant="save" type="submit">
//             ບັນທຶກ
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CreateCategory;
