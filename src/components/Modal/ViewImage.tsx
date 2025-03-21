interface IModalViewImage {
  show: boolean;
  name?: string;
  setShow: any;
  image?: string;
}

export default function ViewImage({
  show,
  name,
  setShow,
  image,
}: IModalViewImage) {
  return (
    <>
      {show ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-[rgba(34,37,64,0.8)]">
            <div className="relative my-6 mx-auto w-[700px] px-4">
              {/*content*/}

              <div className="relative z-10 flex flex-col w-full rounded-sm border border-stroke bg-white px-5 pt-2 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark outline-none focus:outline-none">
                <div
                  onClick={() => setShow(false)}
                  className="text-blue-500 bg-slate-100 dark:bg-slate-800 hover:bg-red-600 dark:hover:text-red-600 hover:text-white w-[40px] h-[40px] flex justify-center items-center rounded ml-auto cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="3em"
                    height="3em"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"
                    />
                  </svg>
                </div>
                <div className="flex justify-center">
                  {image ? (
                    <img src={image} alt={name} className="w-[90%] py-4" />
                  ) : (
                    <p className="text-center py-4">No Image</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}
