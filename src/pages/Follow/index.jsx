import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import Search from '@/components/Forms/Search';
import { TableAction } from '@/components/Tables/TableAction';
import ConfirmModal from '@/components/Modal';
import TablePaginationDemo from '@/components/Tables/Pagination_two';
import CreateFollow from '@/pages/Follow/create';
import EditFollow from './edit';
import { openAlert } from '@/redux/reducer/alert';
import { useAppDispatch } from '@/redux/hook';
import { Follow } from './column/follow';

const FollowPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [patientName, setPatientName] = useState([]);
  const [empName, setEmpName] = useState([]);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [doneCount, setDoneCount] = useState(0);
  const [waitingCount, setWaitingCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const dispatch = useAppDispatch();

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        'http://localhost:4000/src/appoint/appointment',
        {
          method: 'GET',
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setAppointments(data.data);
      setFilteredAppointments(data.data);

      const allAppointments = data.data;

      setTotalCount(allAppointments.length);
      setDoneCount(
<<<<<<< HEAD
        allAppointments.filter((item) => item.status === 'ກວດແລ້ວ').length,
      );
      setWaitingCount(
        allAppointments.filter((item) => item.status === 'ລໍຖ້າ').length,
=======
        allAppointments.filter(
          (item) => item.status === 'ກວດແລ້ວ',
        ).length,
      );
      setWaitingCount(
        allAppointments.filter(
          (item) => item.status === 'ລໍຖ້າ',
        ).length,
>>>>>>> 04c0b8aa93908363f1af5f8ef9006db261d3577b
      );
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          'http://localhost:4000/src/manager/patient',
          {
            method: 'GET',
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setPatientName(data.data);
      } catch (error) {
        console.error('Error fetching patient data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, []);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:4000/src/manager/emp', {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setEmpName(data.data);
      } catch (error) {
        console.error('Error fetching patient data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, []);

  const getDoctorName = (emp_id) => {
    const emp = empName.find((employee) => employee.emp_id === emp_id);
    return emp ? `${emp.emp_name} ${emp.emp_surname}` : 'ບໍ່ພົບຊື່';
  };

  const getPatientName = (patient_id) => {
    const patient = patientName.find((pat) => pat.patient_id === patient_id);
    return patient
      ? `${patient.patient_name} ${patient.patient_surname}`
      : 'ບໍ່ພົບຊື່';
  };

  const openDeleteModal = (id) => () => {
    setSelectedAppointmentId(id);
    setShowModal(true);
  };

  const handleDeleteAppointment = async () => {
    if (!selectedAppointmentId) return;

    try {
      const response = await fetch(
        `http://localhost:4000/src/appoint/appointment/${selectedAppointmentId}`,
        {
          method: 'DELETE',
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setAppointments((prevAppointments) =>
        prevAppointments.filter(
          (appointment) => appointment.appoint_id !== selectedAppointmentId,
        ),
      );
      setFilteredAppointments((prevAppointments) =>
        prevAppointments.filter(
          (appointment) => appointment.appoint_id !== selectedAppointmentId,
        ),
      );

      setShowModal(false);
      dispatch(
        openAlert({
          type: 'success',
          title: 'ລົບຂໍ້ມູນສຳເລັດ',
          message: 'ລົບຂໍ້ມູນນັດໝາຍສຳເລັດແລ້ວ',
        }),
      );
    } catch (error) {
      dispatch(
        openAlert({
          type: 'error',
          title: 'ລົບຂໍ້ມູນບໍ່ສຳເລັດ',
          message: 'ເກີດຂໍ້ຜິດພາດໃນການລົບຂໍ້ມູນ',
        }),
      );
    }
  };

  const handleSearch = async (query) => {
    try {
      const response = await fetch(
        `http://localhost:4000/src/appoint/search?query=${query}`,
        {
          method: 'GET',
        },
      );

      if (response.ok) {
        const data = await response.json();
        setFilteredAppointments(data.data);
      } else {
        console.error('Error searching appointments:', response.statusText);
      }
    } catch (error) {
      console.error('Error searching appointments:', error);
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginated = filteredAppointments.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const handleEdit = (id) => {
    setSelectedId(id);
    setShowEditModal(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 2xl:gap-7.5 w-full mb-6">
        {/* All Appointments */}
        <div className="rounded-sm border border-stroke bg-white p-4 dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-Third dark:bg-secondary">
              <svg
                className="w-6 h-6 text-primary dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M4 10h16m-8-3V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Zm3-7h.01v.01H8V13Zm4 0h.01v.01H12V13Zm4 0h.01v.01H16V13Zm-8 4h.01v.01H8V17Zm4 0h.01v.01H12V17Zm4 0h.01v.01H16V17Z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h4 className="text-lg font-semibold text-strokedark dark:text-white">
                ຈຳນວນນັດໝາຍທັງໝົດ
              </h4>
              <p className="text-2xl font-bold text-primary">{totalCount}</p>
            </div>
          </div>
        </div>
        {/* Waiting Appointments */}
        <div className="rounded-sm border border-stroke bg-white p-4 dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.7em"
                height="1.7em"
                viewBox="0 0 24 24"
                className="text-yellow-500 dark:text-yellow-300"
              >
                <g
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </g>
              </svg>
            </div>
            <div className="ml-4">
              <h4 className="text-lg font-semibold text-strokedark dark:text-white">
                ນັດໝາຍມື້ນີ້
              </h4>
              <p className="text-2xl font-bold text-yellow-500 dark:text-yellow-300">
                {waitingCount}
              </p>
            </div>
          </div>
        </div>
        {/* Done Appointments */}
        <div className="rounded-sm border border-stroke bg-white p-4 dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.7em"
                height="1.7em"
                viewBox="0 0 24 24"
                className="text-green-500 dark:text-green-300"
              >
                <g
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                >
                  <path d="M20 6L9 17l-5-5" />
                </g>
              </svg>
            </div>
            <div className="ml-4">
              <h4 className="text-lg font-semibold text-strokedark dark:text-white">
                ນັດໝາຍກວດສຳເລັດແລ້ວ
              </h4>
              <p className="text-2xl font-bold text-green-500 dark:text-green-300">
                {doneCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded bg-white pt-4 dark:bg-boxdark">
        <div className="flex items-center justify-between border-b border-stroke px-4 pb-4 dark:border-strokedark">
          <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3">
            ຈັດການນັດໝາຍ
          </h1>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-primary"
            >
              ເພີ່ມນັດໝາຍ
            </Button>
          </div>
        </div>

        <div className="grid w-full gap-4 p-4">
          <Search
            type="text"
            name="search"
            placeholder="ຄົ້ນຫາຂໍ້ມູນ..."
            className="rounded border border-stroke dark:border-strokedark"
            onChange={(e) => {
              const query = e.target.value;
              setSearchQuery(query);
              handleSearch(query);
            }}
          />
        </div>

        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="w-full min-w-max table-auto border-collapse overflow-hidden rounded-lg">
            <thead>
              <tr className="text-left bg-secondary2 text-white">
                {Follow.map((header, index) => (
                  <th
                    key={index}
                    className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 "
                  >
                    {header.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length > 0 ? (
                paginated.map((appointment, index) => (
                  <tr
                    key={index}
                    className="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-4 py-4">{appointment.appoint_id}</td>
                    <td className="px-4 py-4">
                      {getPatientName(appointment.patient_id)}{' '}
                    </td>
                    <td className="px-4 py-4">
                      {new Date(appointment.date_addmintted).toLocaleString(
                        'en-US',
                        {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false,
                          timeZone: 'Asia/Bangkok'
                        },
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
                          appointment.status === 'ກວດແລ້ວ'
                            ? 'bg-green-100 text-green-700'
                            : appointment.status === 'ລໍຖ້າ'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </td>
                    {/* <td className="px-4 py-4">{appointment.emp_id}</td> */}
                    <td className="px-4 py-4">
                      {getDoctorName(appointment.emp_id)}{' '}
                    </td>
                    <td className="px-4 py-4">{appointment.description}</td>
                    <td className="px-3 py-4 text-center">
                      <TableAction
                        onDelete={openDeleteModal(appointment.appoint_id)}
                        onEdit={() => handleEdit(appointment.appoint_id)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-4 text-center text-gray-500">
                    ບໍ່ມີຂໍ້ມູນ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
            <div
              className="
        rounded
        w-full max-w-lg     
        md:max-w-2xl        
        lg:max-w-5xl       
        relative
        overflow-auto
        max-h-[90vh]
      "
            >
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label="Close modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <CreateFollow
                setShow={setShowAddModal}
                getList={fetchAppointments}
              />
            </div>
          </div>
        )}
        {showEditModal && selectedId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
            <div className="rounded-lg w-full max-w-2xl bg-white relative ">
              <button
                onClick={() => setShowEditModal(false)}
                className="absolute  top-4 right-2 text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <EditFollow
                id={selectedId}
                onClose={() => setShowEditModal(false)}
                setShow={setShowEditModal}
                getList={fetchAppointments}
              />
            </div>
          </div>
        )}
      </div>
      <TablePaginationDemo
        count={paginated.length}
        page={page}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
      {/* Confirm Delete Modal */}
      <ConfirmModal
        show={showModal}
        setShow={setShowModal}
        message="ທ່ານຕ້ອງການລົບນັດໝາຍນີ້ອອກຈາກລະບົບບໍ່？"
        handleConfirm={handleDeleteAppointment} // Handle deletion on confirm
      />
    </>
  );
};

export default FollowPage;
