import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '@/components/Button';
import { useNavigate, useParams } from 'react-router-dom';

const EditPatient: React.FC = () => {
  const { register, handleSubmit, setValue } = useForm();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);

  // โหลดข้อมูลผู้ป่วย
  useEffect(() => {
    const fetchPatient = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:3000/manager/patients/${id}`);
        const data = await response.json();
        if (data) {
          // เซ็ตค่าเริ่มต้นให้ฟอร์ม
          Object.keys(data).forEach((key) => setValue(key, data[key]));
        }
      } catch (error) {
        console.error('Error fetching patient data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, [id, setValue]);

  // บันทึกข้อมูล
  const onSubmit = async (data: any) => {
    try {
      const response = await fetch(`https://api.xmtechnovator.org/patients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log('Patient updated:', data);
        navigate('/manager/patient');
      } else {
        console.error('Failed to update patient');
      }
    } catch (error) {
      console.error('Error updating patient:', error);
    }
  };

  return (
    <div className="rounded-xl bg-white pt-4 dark:bg-boxdark">
      <div className="flex items-center justify-between border-b border-stroke px-4 pb-4 dark:border-strokedark">
        <h1 className="text-xl font-bold">ແກ້ໄຂຂໍ້ມູນຄົນເຈັບ</h1>
        <button
          onClick={() => navigate(-1)}
          className="translate-all inline-flex cursor-pointer items-center justify-center rounded bg-slate-500 px-4 py-2 text-white hover:bg-opacity-90 active:bg-slate-600"
        >
          ກັບຄືນ
        </button>
      </div>

      {loading ? (
        <p className="text-center py-4">ກຳລັງໂຫລດ...</p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 pt-4">
          {/* Patient Name */}
          <div>
            <label className="mb-2 block text-sm font-medium dark:text-gray-400">ຊື່ຜູ້ປ່ວຍ</label>
            <input {...register('patient_name')} type="text" className="input-field" />
          </div>

          {/* Patient Surname */}
          <div>
            <label className="mb-2 block text-sm font-medium dark:text-gray-400">ນາມສະກຸນ</label>
            <input {...register('patient_surname')} type="text" className="input-field" />
          </div>

          {/* Gender */}
          <div>
            <label className="mb-2 block text-sm font-medium dark:text-gray-400">ເພດ</label>
            <select {...register('gender')} className="input-field">
              <option value="male">ຊາຍ</option>
              <option value="female">ຍິງ</option>
            </select>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="mb-2 block text-sm font-medium dark:text-gray-400">ວັນເກີດ</label>
            <input {...register('dob')} type="date" className="input-field" />
          </div>

          {/* Phone 1 */}
          <div>
            <label className="mb-2 block text-sm font-medium dark:text-gray-400">ເບີໂທ 1</label>
            <input {...register('phone1')} type="text" className="input-field" />
          </div>

          {/* Phone 2 */}
          <div>
            <label className="mb-2 block text-sm font-medium dark:text-gray-400">ເບີໂທ 2</label>
            <input {...register('phone2')} type="text" className="input-field" />
          </div>

          {/* Village */}
          <div>
            <label className="mb-2 block text-sm font-medium dark:text-gray-400">ບ້ານ</label>
            <input {...register('village')} type="text" className="input-field" />
          </div>

          {/* District */}
          <div>
            <label className="mb-2 block text-sm font-medium dark:text-gray-400">ເມືອງ</label>
            <input {...register('district')} type="text" className="input-field" />
          </div>

          {/* Province */}
          <div>
            <label className="mb-2 block text-sm font-medium dark:text-gray-400">ແຂວງ</label>
            <input {...register('province')} type="text" className="input-field" />
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end space-x-4 px-4 py-4 col-span-2">
            <button className="px-6 py-2 text-sm font-bold uppercase text-red-500" type="button" onClick={() => navigate('/manager/patient')}>
              Cancel
            </button>
            <Button variant="save" type="submit">ບັນທຶກ</Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditPatient;
