// import React, { useState } from 'react';
// import { useForm, SubmitHandler } from 'react-hook-form';
// import Input from '../../components/Forms/Input';
// import Select from '@/components/Forms/Select';
// import { showAlertWithAutoClose } from '@/redux/reducer/alert';
// import api from '@/api/axios';
// import { useAppDispatch } from '@/redux/hook';

// interface IModalCreateAccount {
//   show: boolean;
//   setShow: (value: boolean) => void;
//   getListUser: () => void;
// }

// interface IFormInput {
//   fullname: string;
//   nickname: string;
//   // username: string;
//   password: string;
//   mobile_number: string;
//   role: string;
//   gender: string;
//   email: string;
// }

// export default function CreateAccount({
//   show,
//   setShow,
//   getListUser,
// }: IModalCreateAccount) {
//   const dispatch = useAppDispatch();
//   const { register, handleSubmit, formState: { errors }, reset } = useForm<IFormInput>();
//   const [gender, setGender] = useState('');
//   const [role, setRole] = useState('');


//   const onSubmit: SubmitHandler<IFormInput> = async (data) => {
//     try {
//       if (data.mobile_number.length < 8) {
//         return dispatch(
//           showAlertWithAutoClose({
//             type: 'error',
//             title: 'Invalid value for mobile number',
//             message: 'Mobile number must be at least 8 characters',
//           })
//         );
//       }
//       await api.post('/create', data).then(() => getListUser());
//       dispatch(
//         showAlertWithAutoClose({
//           type: 'success',
//           title: 'Create account successfully',
//           message: '',
//         })
//       );
//       setShow(false);
//       reset();
//     } catch (error: any) {
//       console.log('error', error);
//       dispatch(
//         showAlertWithAutoClose({
//           type: 'error',
//           title: 'Create account failed',
//           message: error?.data?.info,
//         })
//       );
//     }
//   };

//   return (
//     <>
//       {show && (
//         <>
//           <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-[rgba(34,37,64,0.8)]">
//             <div className="relative my-6 mx-auto w-[700px] px-4">
//               <div className="relative z-10 flex flex-col w-full rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark outline-none focus:outline-none">
//                 <form onSubmit={handleSubmit(onSubmit)}>
//                   <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
//                     <h3 className="text-xl font-semibold">Create account</h3>
//                     <button
//                       className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
//                       onClick={() => setShow(false)}
//                     >
//                       <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
//                         ×
//                       </span>
//                     </button>
//                   </div>
//                   <div className="relative p-6 flex-auto">
//                     <div className="flex gap-6 flex-row">
//                       <div className="w-full xl:w-1/2">
//                         <Input
//                           label="Fullname"
//                           name="fullname"
//                           placeholder="Zero ki..."
//                           register={register}
//                           formOptions={{
//                             required: 'Please input field Full Name',
//                           }}
//                           errors={errors}
//                         />
//                       </div>
//                       <div className="w-full xl:w-1/2">
//                         <Input
//                           label="Nickname"
//                           name="nickname"
//                           placeholder="Giant..."
//                           register={register}
//                           errors={errors}
//                         />
//                       </div>
//                     </div>
//                     <div className="flex gap-6 flex-row">
//                       <div className="w-full xl:w-1/2">
//                         <Input
//                           type="email"
//                           label="Email"
//                           name="email"
//                           placeholder="onepiece@email.com..."
//                           register={register}
//                           formOptions={{
//                             required: 'Please enter a valid email',
//                           }}
//                           errors={errors}
//                         />
//                       </div>
//                       <div className="w-full xl:w-1/2">
//                         <Input
//                           label="Mobile Number"
//                           name="mobile_number"
//                           placeholder="777799999..."
//                           register={register}
//                           formOptions={{
//                             required: 'Please enter a mobile number',
//                             minLength: {
//                               value: 8,
//                               message: 'Mobile number must be at least 8 characters',
//                             },
//                           }}
//                           errors={errors}
//                         />
//                       </div>
//                     </div>
//                     <Select
//                       label="Gender"
//                       name="gender"
//                       select={gender}
//                       options={['male', 'female','other']}
//                       register={register}
//                       errors={errors}
//                       onSelect={(e) => setGender(e.target.value)}
//                     />
//                     <Select
//                       label="Role"
//                       name="role"
//                       select={role}
//                       options={['member', 'manager','admin']}
//                       register={register}
//                       errors={errors}
//                       onSelect={(e) => setRole(e.target.value)}
//                     />
//                     {/* <Input
//                       label="Username"
//                       name="username"
//                       placeholder="Username for login..."
//                       register={register}
//                       errors={errors}
//                     /> */}
//                     <Input
//                       type="password"
//                       label="Password"
//                       name="password"
//                       placeholder='Default password "@xmt123"'
//                       register={register}
//                       errors={errors}
//                     />
//                   </div>
//                   <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
//                     <button
//                       className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
//                       type="button"
//                       onClick={() => setShow(false)}
//                     >
//                       Close
//                     </button>
//                     <button
//                       className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
//                       type="submit"
//                     >
//                       Submit
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//           <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
//         </>
//       )}
//     </>
//   );
// }
