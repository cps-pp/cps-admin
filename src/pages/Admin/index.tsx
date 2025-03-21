import api from '@/api/axios';
import TablePagination from '@/components/Tables/Pagination';
import { IUser, TGetListUser } from '@/types/user';
import { useEffect, useState } from 'react';
import CreateAccount from './CreateAccount';
import UpdateAccount from './UpdateAccount';
import ConfirmModal from '@/components/Modal';
import { useAppDispatch } from '@/redux/hook';
import { showAlertWithAutoClose } from '@/redux/reducer/alert';

const Account = () => {
  const dispatch = useAppDispatch();
  const [data, setData] = useState<IUser[]>([]);
  const [limit, _] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [createModal, setCreateModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser>();
  const [confirmModal, setConfirmModal] = useState(false);

  async function getListUser(query?: TGetListUser) {
    try {
      const result = await api.get('/getlist', {
        params: {
          limit: query?.limit || 10,
          page: query?.page || 1,
        },
      });
      if (result.data.count) {
        setData(result.data.data);
        setTotalPages(Math.ceil(result.data.count / limit));
      }
    } catch (error) {
      console.log('error', error);
    }
  }

  async function handleDeleteAccount() {
    try {
      await api
        .delete('/delete', {
          params: { id: selectedUser?.id },
        })
        .then(() => getListUser({ page: 1 }));
      setPage(1);
      setConfirmModal(false);
      dispatch(
        // @ts-ignore: Unreachable code error
        showAlertWithAutoClose({
          type: 'success',
          title: 'Delete account successfully',
          message: '',
        }),
      );
    } catch (error) {
      console.log('error', error);
    }
  }

  const handlePageClick = (pageNumber: number) => {
    setPage(pageNumber);
    getListUser({ page: pageNumber });
  };

  const handlePrevClick = () => {
    if (page > 1) {
      setPage(page - 1);
      getListUser({ page: page - 1 });
    }
  };

  const handleNextClick = () => {
    if (page < totalPages) {
      setPage(page + 1);
      getListUser({ page: page + 1 });
    }
  };

  useEffect(() => {
    getListUser();
  }, []);

  
  return (
    <div className="z-0">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Accounts
        </h2>
        <div
          onClick={() => setCreateModal(true)}
          className="cursor-pointer inline-flex items-center justify-center gap-2.5 rounded-md bg-primary active:bg-blue-800 py-3 hover:shadow-lg text-center font-medium text-white hover:bg-opacity-90 lg:px-8 px-10 outline-none focus:outline-none ease-linear transition-all duration-150"
        >
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1.5em"
              height="1.5em"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M5.18 15.296c-1.258.738-4.555 2.243-2.547 4.126c.982.92 2.074 1.578 3.448 1.578h7.838c1.374 0 2.467-.658 3.447-1.578c2.009-1.883-1.288-3.389-2.546-4.126a9.61 9.61 0 0 0-9.64 0M14 7a4 4 0 1 1-8 0a4 4 0 0 1 8 0m5.5-3v5M22 6.5h-5"
                color="currentColor"
              />
            </svg>
          </span>
          Create account
        </div>
      </div>

      <div className="flex flex-col gap-10">
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="min-w-[50px] py-4 px-4 font-medium text-black dark:text-white">
                    NO
                  </th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    Name
                  </th>
                  <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Mobile number
                  </th>
                  <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Role
                  </th>
                  <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Status
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, key) => (
                  <tr key={key}>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {key + limit * (page - 1) + 1}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <h5 className="font-medium text-black dark:text-white">
                        {item.fullname}
                      </h5>
                      <p className="text-sm">{item.nickname}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {item.mobile_number}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {item.role === 'member' ? 'manager' : 'admin'}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p
                        className={`inline-flex rounded-full bg-opacity-10 py-1 px-4 text-sm font-medium ${
                          item.banned
                            ? 'bg-danger text-danger'
                            : 'bg-success text-success'
                        }`}
                      >
                        {item.banned ? 'ຖືກບລັອກ' : 'ປົກກະຕິ'}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <div className="flex items-center space-x-3.5">
                        <button
                          className="hover:text-primary"
                          onClick={() => {
                            setUpdateModal(true);
                            setSelectedUser(item);
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="1.5em"
                            height="1.5em"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="m14.304 4.844l2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565l6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
                            />
                          </svg>
                        </button>
                        <button
                          className="hover:text-primary"
                          onClick={() => {
                            setSelectedUser(item);
                            setConfirmModal(true);
                          }}
                        >
                          <svg
                            className="fill-current"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                              fill=""
                            />
                            <path
                              d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                              fill=""
                            />
                            <path
                              d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                              fill=""
                            />
                            <path
                              d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                              fill=""
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <TablePagination
              currentPage={page}
              totalPages={totalPages}
              handlePageClick={handlePageClick}
              handlePrevClick={handlePrevClick}
              handleNextClick={handleNextClick}
            />
          </div>
        </div>
        <CreateAccount
          show={createModal}
          setShow={setCreateModal}
          getListUser={getListUser}
        />
        <UpdateAccount
          data={selectedUser}
          show={updateModal}
          setShow={setUpdateModal}
          getListUser={getListUser}
        />
        <ConfirmModal
          show={confirmModal}
          setShow={setConfirmModal}
          title="Delete account"
          message="Are you sure you want to delete this account?"
          handleConfirm={handleDeleteAccount}
        />
      </div>
    </div>
  );
};

export default Account;
