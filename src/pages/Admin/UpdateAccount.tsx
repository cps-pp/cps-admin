import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Input from '../../components/Forms/Input';
import Select from '@/components/Forms/Select';
import { showAlertWithAutoClose } from '@/redux/reducer/alert';
import api from '@/api/axios';
import { useAppDispatch } from '@/redux/hook';
import { IUser } from '@/types/user';
import { useParams } from 'react-router-dom';
import SubmitButton from '@/components/SubmitButton';



interface IModalUpdateAccount {
  data?: IUser;
  show: boolean;
  setShow: (show: boolean) => void;
  getListUser: () => void;
}
interface IUpdateUserForm {
  _id:string;
  fullname: string;
  nickname: string;
  mobile_number: string;
  email: string;
  gender: string;
  role: string;
  password: string;
}
export default function UpdateAccount({
  data,
  show,
  setShow,
  getListUser,
}: IModalUpdateAccount) {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<IUpdateUserForm>({
    defaultValues: {
      fullname: data?.fullname || '',
      nickname: data?.nickname || '',
      mobile_number: data?.mobile_number || '',
      email: data?.email || '',
      gender: data?.gender || '',
      role: data?.role || '',
      password: '',
    },
  });
  

  useEffect(() => {
    if (show && data) {
      setValue('fullname', data.fullname);
      setValue('nickname', data.nickname);
      setValue('mobile_number', data.mobile_number);
      setValue('gender', data.gender);
      setValue('role', data.role);
      setValue('email', data.email);
      setValue('password', '');
    }
    console.log(data);
  }, [show, data, setValue]);

  const onSubmit = async (data: IUpdateUserForm) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('id', data._id);
      formData.append('fullname', data.fullname);
      formData.append('nickname', data.nickname);
      formData.append('mobile_number', data.mobile_number);
      formData.append('gender', data.gender);
      formData.append('role', data.role);
      formData.append('email', data.email);
      formData.append('password', data.password);
  
      if (data.mobile_number && data.mobile_number.length < 8) {
        return dispatch(
          showAlertWithAutoClose({
            type: 'error',
            title: 'Invalid value for mobile number',
            message: 'Mobile number must be at least 8 characters',
          })
        );
      }
  
      await api.put(`/update`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      setTimeout(() => {
        setIsLoading(false);
        //  successful submission 
      }, 1000);

      getListUser();
  
      dispatch(
        showAlertWithAutoClose({
          type: 'success',
          title: 'Update account successfully',
          message: '',
        })
      );
      setShow(false);
    } catch (error: any) {
      setIsLoading(false);

      console.error('Error updating account:', error);
      dispatch(
        showAlertWithAutoClose({
          type: 'error',
          title: 'Update account failed',
          message: error?.data?.info,
        })
      );
    }
  };
  // const gender = watch('gender');
  // const role = watch('role');


  return (
    <>
      {show && (
        <>
           <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-[rgba(34,37,64,0.8)]">
            <div className="relative my-6 mx-auto w-[700px] px-4">
              <div className="relative z-10 flex flex-col w-full rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark outline-none focus:outline-none">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                    <h3 className="text-xl font-semibold">Update Account</h3>
                    <button
                      className="p-1 ml-auto bg-transparent text-black opacity-5 text-3xl outline-none focus:outline-none"
                      onClick={() => setShow(false)}
                    >
                      ×
                    </button>
                  </div>
                  <div className="relative p-6 flex-auto">
                    <div className="flex gap-6 flex-row">
                      <Input
                        label="Fullname"
                        name="fullname"
                        placeholder="Naruto Sasuke..."
                        register={register}
                        formOptions={{
                          required: 'Please input field Full Name',
                        }}
                        errors={errors}
                      />
                      <Input
                        label="Nickname"
                        name="nickname"
                        placeholder="Giant..."
                        register={register}
                        errors={errors}
                      />
                    </div>
                    <div className="flex gap-6 flex-row">
                      <Input
                        type="email"
                        label="Email"
                        name="email"
                        placeholder="onepiece@email.com..."
                        register={register}
                        formOptions={{
                          required: 'Please enter a valid email address',
                        }}
                        errors={errors}
                      />
                      <Input
                        label="Mobile Number"
                        name="mobile_number"
                        placeholder="777799999..."
                        register={register}
                        formOptions={{
                          minLength: {
                            value: 8,
                            message: 'Mobile number must be at least 8 characters',
                          },
                        }}
                        errors={errors}
                      />
                    </div>
                    <Select
                      label="Gender"
                      name="gender"
                      select={watch("gender")}
                      options={['male', 'female', 'other']}
                      register={register}
                      errors={errors}
                      
                    />
                    <Select
                      label="Role"
                      name="role"
                      select={watch("role")}
                      options={[ 'manager', 'admin']}
                      register={register}
                      errors={errors}
                    />
                    <Input
                      type="password"
                      label="Password"
                      name="password"
                      placeholder='Default password "@xmt123"'
                      register={register}
                      errors={errors}
                      
                    />
                  </div>
                  <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                    <button
                      className="text-red-500 font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                      type="button"
                      onClick={() => setShow(false)}
                    >
                      Close
                    </button>
                    <SubmitButton isLoading={isLoading} />
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      )}
    </>
  );
}