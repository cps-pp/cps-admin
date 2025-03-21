const Profile = () => {
  return (
    <>
      <div className="flex justify-center mt-8">
        <div className="w-full sm:w-[80%] md:w-[60%] lg:w-[40%]">
          <div className="mb-4 flex justify-center">
            <label htmlFor="file" className="cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="bi bi-camera-fill"
              >
                <path
                  d="M8 0.666626C4.66667 0.666626 2 3.33329 2 6.66663C2 9.00096 4.66667 11.6666 8 11.6666C11.3333 11.6666 14 9.00096 14 6.66663C14 3.33329 11.3333 0.666626 8 0.666626ZM8 10.3333C5.238 10.3333 3 8.09529 3 6.66663C3 5.23796 5.238 3.99996 8 3.99996C10.762 3.99996 13 5.23796 13 6.66663C13 8.09529 10.762 10.3333 8 10.3333ZM7.16667 5.83329C6.90562 5.83329 6.66667 6.07224 6.66667 6.33329V7.5C6.66667 7.76104 6.90562 8.00001 7.16667 8.00001C7.42772 8.00001 7.66667 7.76104 7.66667 7.5V6.33329C7.66667 6.07224 7.42772 5.83329 7.16667 5.83329ZM8.83333 5.83329C8.57228 5.83329 8.33333 6.07224 8.33333 6.33329V7.5C8.33333 7.76104 8.57228 8.00001 8.83333 8.00001C9.09438 8.00001 9.33333 7.76104 9.33333 7.5V6.33329C9.33333 6.07224 9.09438 5.83329 8.83333 5.83329Z"
                  fill="white"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.56219 2.33329C5.55724 2.22284 5.59519 2.11407 5.66231 2.05804L6.89054 1.44052C6.99065 1.3664 7.10448 1.33329 7.22231 1.33329H8.77769C8.89552 1.33329 9.00935 1.3664 9.10946 1.44052L10.3377 2.05804C10.4048 2.11407 10.4428 2.22284 10.4378 2.33329H8.25C8.08753 2.33329 7.92294 2.43364 7.81456 2.53531L7.01659 3.51087C6.94635 3.59462 6.85356 3.66663 6.75002 3.66663C6.64648 3.66663 6.5537 3.59462 6.48346 3.51087L5.68549 2.53531C5.57711 2.43364 5.41252 2.33329 5.25 2.33329H5.56219Z"
                  fill="white"
                />
              </svg>
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;


// import { useEffect, useState } from 'react';
// // import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
// import CoverOne from '../images/cover/cover-01.png';
// import Avatar from '../images/user/avatar.png';
// import { IUser } from '../types/user';
// import { format } from 'light-date';

// const Profile = () => {
//   const [user, setUser] = useState<IUser>();
//   const initial = () => {
//     const userJson = localStorage.getItem(USER_KEY);
//     if (userJson) {
//       const userParse = JSON.parse(userJson);
//       setUser(userParse);
//     }
//   };

//   useEffect(() => initial(), []);
//   return (
//     <>
//       {/* <Breadcrumb pageName="Profile" /> */}
//       <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
//         <div className="relative z-0 h-35 md:h-65">
//           <img
//             src={CoverOne}
//             alt="profile cover"
//             className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
//           />
//           <div className="absolute bottom-1 right-1 z-10 xsm:bottom-4 xsm:right-4">
//             <label
//               htmlFor="cover"
//               className="flex cursor-pointer items-center justify-center gap-2 rounded bg-primary py-1 px-2 text-sm font-medium text-white hover:bg-opacity-90 xsm:px-4"
//             >
//               <input type="file" name="cover" id="cover" className="sr-only" />
//               <span>
//                 <svg
//                   className="fill-current"
//                   width="14"
//                   height="14"
//                   viewBox="0 0 14 14"
//                   fill="none"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     clipRule="evenodd"
//                     d="M4.76464 1.42638C4.87283 1.2641 5.05496 1.16663 5.25 1.16663H8.75C8.94504 1.16663 9.12717 1.2641 9.23536 1.42638L10.2289 2.91663H12.25C12.7141 2.91663 13.1592 3.101 13.4874 3.42919C13.8156 3.75738 14 4.2025 14 4.66663V11.0833C14 11.5474 13.8156 11.9925 13.4874 12.3207C13.1592 12.6489 12.7141 12.8333 12.25 12.8333H1.75C1.28587 12.8333 0.840752 12.6489 0.512563 12.3207C0.184375 11.9925 0 11.5474 0 11.0833V4.66663C0 4.2025 0.184374 3.75738 0.512563 3.42919C0.840752 3.101 1.28587 2.91663 1.75 2.91663H3.77114L4.76464 1.42638ZM5.56219 2.33329L4.5687 3.82353C4.46051 3.98582 4.27837 4.08329 4.08333 4.08329H1.75C1.59529 4.08329 1.44692 4.14475 1.33752 4.25415C1.22812 4.36354 1.16667 4.51192 1.16667 4.66663V11.0833C1.16667 11.238 1.22812 11.3864 1.33752 11.4958C1.44692 11.6052 1.59529 11.6666 1.75 11.6666H12.25C12.4047 11.6666 12.5531 11.6052 12.6625 11.4958C12.7719 11.3864 12.8333 11.238 12.8333 11.0833V4.66663C12.8333 4.51192 12.7719 4.36354 12.6625 4.25415C12.5531 4.14475 12.4047 4.08329 12.25 4.08329H9.91667C9.72163 4.08329 9.53949 3.98582 9.4313 3.82353L8.43781 2.33329H5.56219Z"
//                     fill="white"
//                   />
//                   <path
//                     fillRule="evenodd"
//                     clipRule="evenodd"
//                     d="M6.99992 5.83329C6.03342 5.83329 5.24992 6.61679 5.24992 7.58329C5.24992 8.54979 6.03342 9.33329 6.99992 9.33329C7.96642 9.33329 8.74992 8.54979 8.74992 7.58329C8.74992 6.61679 7.96642 5.83329 6.99992 5.83329ZM4.08325 7.58329C4.08325 5.97246 5.38909 4.66663 6.99992 4.66663C8.61075 4.66663 9.91659 5.97246 9.91659 7.58329C9.91659 9.19412 8.61075 10.5 6.99992 10.5C5.38909 10.5 4.08325 9.19412 4.08325 7.58329Z"
//                     fill="white"
//                   />
//                 </svg>
//               </span>
//               <span>Edit</span>
//             </label>
//           </div>
//         </div>
//         <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
//           <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
//             <div className="relative drop-shadow-2">
//               <img src={Avatar} alt="avatar" className="rounded-full" />
//               <label
//                 htmlFor="profile"
//                 className="absolute bottom-0 right-0 flex h-8.5 w-8.5 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 sm:bottom-2 sm:right-2"
//               >
//                 <svg
//                   className="fill-current"
//                   width="14"
//                   height="14"
//                   viewBox="0 0 14 14"
//                   fill="none"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     clipRule="evenodd"
//                     d="M4.76464 1.42638C4.87283 1.2641 5.05496 1.16663 5.25 1.16663H8.75C8.94504 1.16663 9.12717 1.2641 9.23536 1.42638L10.2289 2.91663H12.25C12.7141 2.91663 13.1592 3.101 13.4874 3.42919C13.8156 3.75738 14 4.2025 14 4.66663V11.0833C14 11.5474 13.8156 11.9925 13.4874 12.3207C13.1592 12.6489 12.7141 12.8333 12.25 12.8333H1.75C1.28587 12.8333 0.840752 12.6489 0.512563 12.3207C0.184375 11.9925 0 11.5474 0 11.0833V4.66663C0 4.2025 0.184374 3.75738 0.512563 3.42919C0.840752 3.101 1.28587 2.91663 1.75 2.91663H3.77114L4.76464 1.42638ZM5.56219 2.33329L4.5687 3.82353C4.46051 3.98582 4.27837 4.08329 4.08333 4.08329H1.75C1.59529 4.08329 1.44692 4.14475 1.33752 4.25415C1.22812 4.36354 1.16667 4.51192 1.16667 4.66663V11.0833C1.16667 11.238 1.22812 11.3864 1.33752 11.4958C1.44692 11.6052 1.59529 11.6666 1.75 11.6666H12.25C12.4047 11.6666 12.5531 11.6052 12.6625 11.4958C12.7719 11.3864 12.8333 11.238 12.8333 11.0833V4.66663C12.8333 4.51192 12.7719 4.36354 12.6625 4.25415C12.5531 4.14475 12.4047 4.08329 12.25 4.08329H9.91667C9.72163 4.08329 9.53949 3.98582 9.4313 3.82353L8.43781 2.33329H5.56219Z"
//                     fill=""
//                   />
//                   <path
//                     fillRule="evenodd"
//                     clipRule="evenodd"
//                     d="M7.00004 5.83329C6.03354 5.83329 5.25004 6.61679 5.25004 7.58329C5.25004 8.54979 6.03354 9.33329 7.00004 9.33329C7.96654 9.33329 8.75004 8.54979 8.75004 7.58329C8.75004 6.61679 7.96654 5.83329 7.00004 5.83329ZM4.08337 7.58329C4.08337 5.97246 5.38921 4.66663 7.00004 4.66663C8.61087 4.66663 9.91671 5.97246 9.91671 7.58329C9.91671 9.19412 8.61087 10.5 7.00004 10.5C5.38921 10.5 4.08337 9.19412 4.08337 7.58329Z"
//                     fill=""
//                   />
//                 </svg>
//                 <input
//                   type="file"
//                   name="profile"
//                   id="profile"
//                   className="sr-only"
//                 />
//               </label>
//             </div>
//           </div>
//           <div className="mt-4">
//             <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
//               {user?.fullname}
//             </h3>
//             <div className="mx-auto mt-4.5 mb-5.5 grid max-w-115 grid-cols-2 rounded-md border border-stroke py-2.5 shadow-1 dark:border-strokedark dark:bg-[#37404F]">
//               <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-strokedark xsm:flex-row">
//                 <span className="font-semibold text-black dark:text-white">
//                   {format(new Date(user?.dob), '{dd}-{MM}-{yyyy}')}
//                 </span>
//               </div>
//               <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-strokedark xsm:flex-row">
//                 <span className="font-semibold text-black dark:text-white">
//                   Volunteer
//                 </span>
//               </div>
//             </div>

//             <div className="mx-auto max-w-180">
//               <h4 className="font-semibold text-black dark:text-white">
//                 {user?.nickname}
//               </h4>
//               <p className="mt-4.5">
//                 {user?.mobile_number}
//                 {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit.
//                 Pellentesque posuere fermentum urna, eu condimentum mauris
//                 tempus ut. Donec fermentum blandit aliquet. Etiam dictum dapibus
//                 ultricies. Sed vel aliquet libero. Nunc a augue fermentum,
//                 pharetra ligula sed, aliquam lacus. */}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Profile;
