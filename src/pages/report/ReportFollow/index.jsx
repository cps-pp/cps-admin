import { useEffect, useState } from 'react';
import Search from '@/components/Forms/Search';
import Alerts from '@/components/Alerts';
import TablePaginationDemo from '@/components/Tables/Pagination_two';
import { useAppDispatch } from '@/redux/hook';
import { openAlert } from '@/redux/reducer/alert';
import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react'
import { URLBaseLocal } from '../../../lib/MyURLAPI';
const columns = [
  { key: 'in_id', name: 'ລະຫັດປິນປົວ' },
  { key: 'date', name: 'ວັນທີ' },
  { key: 'patient_id', name: 'ລະຫັດຄົນເຈັບ' },
  { key: 'patient_name', name: 'ຊື່ ແລະ ນາມສະກຸນ' },
  { key: 'gender', name: 'ເພດ' },
  { key: 'symptom', name: 'ອາການ' },
  { key: 'checkup', name: 'ກວດພົບ' },
  { key: 'diseases_now', name: 'ພະຍາດປັດຈຸບັນ' },
  { key: 'note', name: 'ໝາຍເຫດ' },
  { key: 'action', name: 'ຈັດການ' },
];

const ReportFollowAll = () => {
  const dispatch = useAppDispatch();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchAppointments = async () => {
    try {
      const res = await fetch(`${URLBaseLocal}/src/report/inspection`);
      const data = await res.json();

      if (!res.ok)
        throw new Error(data.error || 'Error fetching report inspection');

      setAppointments(data.detail);
      setFilteredAppointments(data.detail);
    } catch (error) {
      console.error('Error:', error);
      dispatch(
        openAlert({
          type: 'error',
          title: 'ຜິດພາດ',
          message: 'ບໍ່ສາມາດດຶງຂໍ້ມູນນັດໝາຍໄດ້ ',
        }),
      );
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    const filtered = appointments.filter(
      (item) =>
        item.patient_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.patient_surname
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        item.status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.in_id?.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    setFilteredAppointments(filtered);
  }, [searchQuery, appointments]);

  const paginatedData = filteredAppointments.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );
  const navigate = useNavigate();
  const handleViewPatient = (id) => {
    navigate(`/follow-inspection/detail/${id}`);
  };
  return (
    <>
      <div className="rounded bg-white pt-4 dark:bg-boxdark">
        <Alerts />
        <div className="flex items-center justify-between border-b border-stroke px-4 pb-4">
          <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark">
            ລາຍງານນັດໝາຍ
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-4 p-4">
          <Search
            name="search"
            placeholder="ຄົ້ນຫາຊື່, ນາມສະກຸນ, ສະຖານະ..."
            className="rounded border border-stroke"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto  shadow-md">
          <table className="w-full min-w-max table-auto  ">
            <thead>
              <tr className="text-left bg-gray border border-stroke">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-3 text-form-input  font-semibold"
                  >
                    {col.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr
                  key={item.in_id || index}
                  className="border-b border-stroke hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="px-4 py-3 font-medium">{item.in_id}</td>
                  <td className="px-4 py-4">
                    {new Date(item.date).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </td>
                  <td className="px-4 py-3 font-medium">{item.patient_id}</td>
                  <td className="px-4 py-3 font-medium">
                    {item.patient_name} {item.patient_surname}
                  </td>
                  <td className="px-4 py-3">{item.gender}</td>
                  <td className="px-4 py-3">{item.symptom}</td>
                  <td className="px-4 py-3">{item.checkup}</td>
                  <td className="px-4 py-3">{item.diseases_now}</td>
                  <td className="px-4 py-3">{item.note}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleViewPatient(item.patient_id)}
                      className="text-blue-600 hover:text-blue-800 transition duration-200"
                      title="View"
                    >
                      <Eye size={20} />
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <TablePaginationDemo
        count={filteredAppointments.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />
    </>
  );
};

export default ReportFollowAll;
