import { useEffect, useState } from 'react';
import Search from '@/components/Forms/Search';
import Alerts from '@/components/Alerts';
import TablePaginationDemo from '@/components/Tables/Pagination_two';
import { useAppDispatch } from '@/redux/hook';
import { openAlert } from '@/redux/reducer/alert';

const columns = [
  { key: 'patient_id', name: 'ລະຫັດຄົນເຈັບ' },
  { key: 'patient_name', name: 'ຊື່ ແລະ ນາມສະກຸນ' },
  { key: 'date_addmintted', name: 'ວັນທີນັດ' },
  { key: 'status', name: 'ສະຖານະ' },
];

const ReportAppointment = () => {
  const dispatch = useAppDispatch();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchAppointments = async () => {
    try {
      const res = await fetch('http://localhost:4000/src/report/appointment');
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Error fetching appointments');

      setAppointments(data.data);
      setFilteredAppointments(data.data);
    } catch (error) {
      console.error('Error:', error);
      dispatch(openAlert({
        type: 'error',
        title: 'ຜິດພາດ',
        message: 'ບໍ່ສາມາດດຶງຂໍ້ມູນນັດໝາຍໄດ້ ❌',
      }));
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    const filtered = appointments.filter((item) =>
      item.patient_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.patient_surname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.status?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredAppointments(filtered);
  }, [searchQuery, appointments]);

  const paginatedData = filteredAppointments.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <div className="rounded bg-white pt-4 border border-stroke">
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

           <div className="overflow-x-auto  ">
          <table className="w-full min-w-max table-auto  ">
            <thead>
              <tr className="text-left bg-gray border border-stroke">
                {columns.map((col) => (
                  <th key={col.key} className="px-4 py-3 text-form-input  font-semibold">{col.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
               <tr
                    key={item.patient_id || index}
                    className="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-4 py-3 font-medium">{item.patient_id}</td>
                    {/* <td className="px-4 py-3 font-medium">{item.patient_name}</td>
                    <td className="px-4 py-3">{item.patient_surname}</td> */}
                    <td className="px-4 py-3 font-medium">
  {item.patient_name} {item.patient_surname}
</td>

                    <td className="px-4 py-3">
                      {new Date(item.date_addmintted).toLocaleString('en-US', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false,
                      })}
                    </td>
                
                   
                    <td className="px-4 py-2">
                         <span
                        className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
                          item.status === 'ກວດແລ້ວ'
                            ? 'bg-green-100 text-green-700'
                            : item.status === 'ລໍຖ້າ'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {item.status}
                      </span>
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

export default ReportAppointment;
