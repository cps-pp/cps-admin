import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { iconAdd } from '@/configs/icon';
import Button from '@/components/Button';
import Search from '@/components/Forms/Search';
import { TableAction } from '@/components/Tables/TableAction';
import Alerts from '@/components/Alerts';
import TablePaginationDemo from '@/components/Tables/Pagination_two';

const DetailPatientService = () => {
  const navigate = useNavigate();
  const [inspections, setInspections] = useState([]);
  const [filteredInspections, setFilteredInspections] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchInspections = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:4000/src/report/inspection');
      const data = await res.json();

      console.log('Full API Response:', data); // Debug line

      const safeData = Array.isArray(data.detail) ? data.detail : [];

      setInspections(safeData);
      setFilteredInspections(safeData);
    } catch (error) {
      console.error('Error fetching inspection data:', error);
      setInspections([]);
      setFilteredInspections([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInspections();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredInspections(inspections);
    } else {
      const filtered = inspections.filter(
        (item) =>
          item.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.patient_surname
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
      );
      setFilteredInspections(filtered);
    }
  }, [searchQuery, inspections]);

  const handlePageChange = (_, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    ``;
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedInspections = Array.isArray(filteredInspections)
    ? filteredInspections.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      )
    : [];

  const headers = [
    'ລະຫັດການຮັກສາ',
    'ວັນທີ',
    'ສະຖານະ',
    'ຊື່ຄົນເຈັບ',
    'ອາການ',
    'ໂຣກທີ່ເປັນ',
    'ຜົນກວດ',
    'ໝາຍເຫດ',
    'ຈັດການ',
  ];

  const handleRowClick = (item) => {
    navigate(`/list-detail/edit-treatment/${item.in_id}`);
  };
  return (
    <>
      <div className="rounded bg-white pt-4 dark:bg-boxdark">
        <Alerts />
        <div className="flex items-center justify-between border-b border-stroke px-4 pb-4 dark:border-strokedark">
          <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3">
            ລາຍລະອຽດການປິນປົວ
          </h1>
        </div>

        <div className="grid w-full gap-4 p-4">
          <Search
            type="text"
            name="search"
            placeholder="ຄົ້ນຫາຊື່..."
            className="rounded border border-stroke dark:border-strokedark"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto shadow-md">
          <table className="w-full min-w-max table-auto">
            <thead>
              <tr className="text-left bg-gray border border-stroke">
                {headers.map((title, index) => (
                  <th
                    key={index}
                    className="px-4 py-3 tracking-wide text-form-input font-semibold"
                  >
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedInspections.length > 0 ? (
                paginatedInspections.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200"
                    onClick={() => handleRowClick(item)}
                  >
                    <td className="px-4 py-4">{item.in_id}</td>
                    <td className="px-4 py-4">
                      {new Date(item.date).toLocaleString('th-TH', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                      })}
                    </td>
                    <td className="px-4 py-4">{item.status}</td>
                    <td className="px-4 py-4">
                      {item.patient_name} {item.patient_surname}
                    </td>
                    <td className="px-4 py-4">{item.symptom || '-'}</td>
                    <td className="px-4 py-4">{item.diseases_now || '-'}</td>
                    <td className="px-4 py-4">{item.checkup || '-'}</td>
                    <td className="px-4 py-4">{item.note || '-'}</td>
                    <td className="px-4 py-4 ">
                      <button
                        onClick={() => handleRowClick(item)}
                        className=" bg-blue-500 rounded text-white  px-4 py-2 text-xs hover:text-white hover:bg-blue-600"
                        title="View"
                      >
                        ເບີ່ງຂໍ້ມູນ
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-4 text-center text-gray-500">
                    ບໍ່ມີຂໍ້ມູນ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <TablePaginationDemo
        count={filteredInspections?.length || 0}
        page={page}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </>
  );
};

export default DetailPatientService;
