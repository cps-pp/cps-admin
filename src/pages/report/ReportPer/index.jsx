import React, { useState, useEffect } from 'react';
import {
  Pill,
  Package,

  Wrench,
  Eye,
} from 'lucide-react';
import Search from '@/components/Forms/Search';
import Alerts from '@/components/Alerts';
import TablePaginationDemo from '@/components/Tables/Pagination_two';
import InspectionDetailView from './InView';

const ReportPer = () => {
  const [inspectionId, setInspectionId] = useState('');
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [inspectionInfo, setInspectionInfo] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredIn, setFilteredIn] = useState([]);
  
  // New states for detail view
  const [showDetailView, setShowDetailView] = useState(false);
  const [selectedInspectionId, setSelectedInspectionId] = useState(null);
  const [groupedData, setGroupedData] = useState([]);

  const fetchInspection = async () => {
    try {
      const res = await fetch('http://localhost:4000/src/report/inspection');
      const json = await res.json();

      console.log('API Response:', json);

      if (!res.ok) {
        throw new Error(json.message || 'Error fetching inspection');
      }

      const inspections = json.data || [];

      setInspectionInfo(inspections);

      const allMedicines = inspections.flatMap((item) => {
        return (
          item.medicines?.map((med) => ({
            ...med,
            in_id: item.in_id,
          })) || []
        );
      });

      console.log('Exxxxxxxxxxxxtracted medicines:', allMedicines);

      setAllData(allMedicines);
      setFilteredData(allMedicines);

      const grouped = inspections.map(inspection => ({
        in_id: inspection.in_id,
        ...inspection,
        totalMedicines: inspection.medicines?.filter(med => med.type_name === 'ຢາ').length || 0,
        totalEquipment: inspection.medicines?.filter(med => med.type_name === 'ອຸປະກອນ').length || 0,
        totalItems: inspection.medicines?.length || 0,
        totalValue: inspection.medicines?.reduce((sum, med) => sum + (med.total || 0), 0) || 0
      }));

      setGroupedData(grouped);
    } catch (error) {
      console.error('Fetch error:', error);
      dispatch(
        openAlert({
          type: 'error',
          title: 'ຜິດພາດ',
          message: 'ບໍ່ສາມາດດຶງຂໍ້ມູນໄດ້',
        }),
      );
    }
  };

  useEffect(() => {
    fetchInspection();
  }, []);

  useEffect(() => {
    if (inspectionInfo && Array.isArray(inspectionInfo)) {
      const allMedicines = inspectionInfo.flatMap((entry) => {
        return (
          entry.medicines?.map((med) => ({
            ...med,
            in_id: entry.in_id,
          })) || []
        );
      });

      setAllData(allMedicines);
      setFilteredData(allMedicines);
    }
  }, [inspectionInfo]);

  const filterDataByTab = (data, tab) => {
    let filtered = [];

    if (tab === 'all') {
      filtered = data;
    } else if (tab === 'medicine') {
      filtered = data.filter((item) => item.type_name === 'ຢາ');
    } else if (tab === 'equipment') {
      filtered = data.filter((item) => item.type_name === 'ອຸປະກອນ');
    }

    setFilteredData(filtered);
  };

  const setActiveTabAndFilter = (tab) => {
    setActiveTab(tab);
    setPage(0);
    filterDataByTab(allData, tab);
  };

  const handleSearchQueryChange = (query) => {
    setSearchQuery(query);
    setPage(0);
    filterDataByTab(allData, activeTab);
  };

  const handlePageChange = (_, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleViewDetail = (inspectionId) => {
    setSelectedInspectionId(inspectionId);
    setShowDetailView(true);
  };

  const paginatedData = groupedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const getTableHeaders = () => [
    'ລະຫັດປິ່ນປົວ',
    'ຈຳນວນຢາ',
    'ຈຳນວນອຸປະກອນ',
    'ລວມລາຍການ',
    'ມູນຄ່າລວມ',
    'ການດຳເນີນງານ'
  ];

  // Render table row for grouped data
  const renderTableRow = (item, index) => (
    <tr key={index} className="border-b border-stroke hover:bg-gray-50 ">
      <td className="px-4 py-3">{item.in_id || '-'}</td>
      <td className="px-4 py-3 ">
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {item.totalMedicines}
        </span>
      </td>
      <td className="px-4 py-3 ">
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          {item.totalEquipment}
        </span>
      </td>
      <td className="px-4 py-3  font-medium">
        {item.totalItems}
      </td>
      <td className="px-4 py-3  font-medium">
        {item.totalValue != null ? item.totalValue.toLocaleString('en-GB') + ' ກີບ' : '-'}
      </td>

      <td className="px-4 py-3 ">
        <button
          onClick={() => handleViewDetail(item.in_id)}
          className="inline-flex items-center px-3 py-1 text-md font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 hover:text-blue-700 transition-colors"
        >
          <Eye className="w-4 h-4 mr-1" />
         ເບີ່ງລາຍລະອຽດ
        </button>
      </td>
    </tr>
  );

  useEffect(() => {
    filterDataByTab(allData, activeTab);
  }, [activeTab, allData, searchQuery]);

  return (
      <>
    <div className="">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 w-full mb-6">
        <div className="rounded-sm border border-stroke bg-white p-4">
          <div className="flex items-center">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-blue-100">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h4 className="text-lg font-semibold text-strokedark">ຈຳນວນລາຍການທັງໝົດ</h4>
              <p className="text-xl font-bold text-blue-700">
                {groupedData.length} ຄັ້ງ
              </p>
            </div>
          </div>
        </div>

        <div className="rounded border border-stroke bg-white p-4">
          <div className="flex items-center">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-green-100">
              <Pill className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h4 className="text-lg font-semibold text-strokedark">ຈຳນວນຢາ</h4>
              <p className="text-xl font-bold text-green-600">
                {allData.filter((item) => item.type_name === 'ຢາ').length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white p-4">
          <div className="flex items-center">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-stroke">
              <Wrench className="w-6 h-6 text-gray-600" />
            </div>
            <div className="ml-4">
              <h4 className="text-lg font-semibold text-strokedark">ຈຳນວນອຸປະກອນ</h4>
              <p className="text-xl font-bold text-gray-700">
                {allData.filter((item) => item.type_name === 'ອຸປະກອນ').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded bg-white ">
        <Alerts />
        <div className="flex items-center justify-between border-b border-stroke px-4 py-4">
           <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark ">
            ລາຍງານການຈ່າຍຢາ ແລະ ອຸປະກອນ
          </h1>
        </div>

        <div className="flex gap-4 items-end p-4">
          <Search
            type="text"
            name="search"
            placeholder="ຄົ້ນຫາລະຫັດການຕວດ..."
            className="rounded border border-stroke dark:border-strokedark"
            onChange={(e) => {
              const query = e.target.value;
              setSearchQuery(query);
              const filtered = groupedData.filter(item => 
                item.in_id?.toLowerCase().includes(query.toLowerCase())
              );
              setPage(0);
            }}
          />
        </div>

        <div className="overflow-x-auto  shadow-md">
          <table className="w-full min-w-max table-auto  ">
            <thead>
              <tr className="text-left bg-gray border border-stroke">
                {getTableHeaders().map((header, idx) => (
                  <th
                    key={idx}
                    className="px-4 py-3 text-form-input   font-semibold"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={getTableHeaders().length}
                    className="py-8 text-center"
                  >
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 "></div>
                    </div>
                  </td>
                </tr>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((item, idx) => renderTableRow(item, idx))
              ) : (
                <tr>
                  <td
                    colSpan={getTableHeaders().length}
                    className="py-8 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center">
                      <Package className="w-12 h-12 text-gray-300 mb-2" />
                      <p>ບໍ່ມີຂໍ້ມູນ</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

     
      
      </div>

      {/* Detail View Modal */}
      {showDetailView && (
        <InspectionDetailView
          show={showDetailView}
          setShow={setShowDetailView}
          inspectionId={selectedInspectionId}
          inspectionData={inspectionInfo}
        />
      )}
    </div>
      {groupedData.length > 0 && (
          <TablePaginationDemo
            count={groupedData.length}
            page={page}
            onPageChange={handlePageChange}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        )}
      </>
  );
};

export default ReportPer;

// import React, { useState, useEffect } from 'react';
// import {
//   Pill,
//   Package,
//   FileText,
//   DollarSign,
//   Calendar,
//   User,
//   Stethoscope,
//   Wrench,
// } from 'lucide-react';
// import Search from '@/components/Forms/Search';
// import Alerts from '@/components/Alerts';
// import TablePaginationDemo from '@/components/Tables/Pagination_two';
// const ReportPer = () => {
//   const [inspectionId, setInspectionId] = useState('');
//   const [allData, setAllData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [activeTab, setActiveTab] = useState('all');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [inspectionInfo, setInspectionInfo] = useState(null);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filteredIn, setFilteredIn] = useState([]);

//   const fetchInspection = async () => {
//     try {
//       const res = await fetch('http://localhost:4000/src/report/inspection');
//       const json = await res.json();

//       console.log('API Response:', json);

//       if (!res.ok) {
//         throw new Error(json.message || 'Error fetching inspection');
//       }

//       const inspections = json.data || [];

//       setInspectionInfo(inspections);

//       const allMedicines = inspections.flatMap((item) => {
//         return (
//           item.medicines?.map((med) => ({
//             ...med,
//             in_id: item.in_id,
//           })) || []
//         );
//       });

//       console.log('Extracted medicines:', allMedicines);

//       setAllData(allMedicines);
//       setFilteredData(allMedicines);
//     } catch (error) {
//       console.error('Fetch error:', error);
//       dispatch(
//         openAlert({
//           type: 'error',
//           title: 'ຜິດພາດ',
//           message: 'ບໍ່ສາມາດດຶງຂໍ້ມູນໄດ້',
//         }),
//       );
//     }
//   };
//   useEffect(() => {
//     fetchInspection();
//   }, []);

//   useEffect(() => {
//     if (inspectionInfo && Array.isArray(inspectionInfo)) {
//       const allMedicines = inspectionInfo.flatMap((entry) => {
//         return (
//           entry.medicines?.map((med) => ({
//             ...med,
//             in_id: entry.in_id,
//           })) || []
//         );
//       });

//       setAllData(allMedicines);
//       setFilteredData(allMedicines);
//     }
//   }, [inspectionInfo]);

//   const filterDataByTab = (data, tab) => {
//     let filtered = [];

//     if (tab === 'all') {
//       filtered = data;
//     } else if (tab === 'medicine') {
//       filtered = data.filter((item) => item.type_name === 'ຢາ');
//     } else if (tab === 'equipment') {
//       filtered = data.filter((item) => item.type_name !== 'ອຸປະກອນ');
//     }

//     setFilteredData(filtered);
//   };

//   const setActiveTabAndFilter = (tab) => {
//     setActiveTab(tab);
//     setPage(0);
//     filterDataByTab(allData, tab);
//   };

//   const handleSearchQueryChange = (query) => {
//     setSearchQuery(query);
//     setPage(0);
//     filterDataByTab(allData, activeTab);
//   };

//   const handlePageChange = (_, newPage) => {
//     setPage(newPage);
//   };

//   const handleRowsPerPageChange = (e) => {
//     setRowsPerPage(parseInt(e.target.value, 10));
//     setPage(0);
//   };

//   const paginatedData = filteredData.slice(
//     page * rowsPerPage,
//     page * rowsPerPage + rowsPerPage,
//   );

//   const getTableHeaders = () => [
//     'ລະຫັດບິນ',
//     'ລະຫັດຢາ',
//     'ຊື່ຢາ/ອຸປະກອນ',
//     'ປະເພດ',
//     'ລາຄາລວມ',
//   ];

//   // Render table row
//   const renderTableRow = (item, index) => (
//     <tr key={index} className="border-b border-stroke hover:bg-gray-50">
//       <td className="px-4 py-4">{item.in_id || '-'}</td>
//       <td className="px-4 py-4">{item.med_id || '-'}</td>
//       <td className="px-4 py-4">{item.med_name || '-'}</td>
//       <td className="px-4 py-4">
//         <span
//           className={`px-2 py-1 rounded-full text-xs font-medium ${
//             item.type_name === 'ຢາ'
//               ? 'bg-blue-100 text-blue-800'
//               : 'bg-green-100 text-green-800'
//           }`}
//         >
//           {item.type_name || '-'}
//         </span>
//       </td>
//       <td className="px-4 py-4 text-right font-medium">
//         {item.total != null ? item.total.toLocaleString('en-GB') + ' ກີບ' : '-'}
//       </td>
//     </tr>
//   );

//   useEffect(() => {
//     filterDataByTab(allData, activeTab);
//   }, [activeTab, allData, searchQuery]);

//   return (
//     <div className="">
    
//       <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 w-full mb-6">
//         <div className="rounded-sm border border-stroke bg-white p-4">
//           <div className="flex items-center">
//             <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-blue-100">
//               <Package className="w-6 h-6 text-blue-600" />
//             </div>
//             <div className="ml-4">
//               <h4 className="text-lg font-semibold text-strokedark">ຈຳນວນລາຍລວມ</h4>
//               <p className="text-xl font-bold text-blue-700">
//                 {filteredData.length} ລາຍການ
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="rounded border border-stroke bg-white p-4">
//           <div className="flex items-center">
//             <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-green-100">
//               <Pill className="w-6 h-6 text-green-600" />
//             </div>
//             <div className="ml-4">
//               <h4 className="text-lg font-semibold text-strokedark">ຈຳນວນຢາ</h4>
//               <p className="text-xl font-bold text-green-600">
//                 {allData.filter((item) => item.type_name === 'ຢາ').length}
//               </p>
//             </div>
//           </div>
//         </div>
//         <div className="rounded-sm border border-stroke bg-white p-4">
//           <div className="flex items-center">
//             <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-stroke">
//               <Wrench className="w-6 h-6 text-gray-600" />
//             </div>
//             <div className="ml-4">
//               <h4 className="text-lg font-semibold text-strokedark">ຈຳນວນອຸປະກອນ</h4>
//               <p className="text-xl font-bold text-gray-700">
//                 {allData.filter((item) => item.type_name === 'ອຸປະກອນ').length}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Table */}
//       <div className="rounded bg-white shadow">
//         <Alerts />
//         <div className="flex items-center justify-between border-b border-stroke px-4 py-4">
//           <h1 className="text-lg lg:text-xl font-medium text-gray-700">
//             ລາຍງານການຈ່າຍຢາ ແລະ ອຸປະກອນ
//           </h1>
//         </div>

//         {/* Tab Navigation */}
//         <div className="flex gap-2 px-4 py-3 border-b">
//           <button
//             onClick={() => setActiveTabAndFilter('all')}
//             className={`px-4 py-2 rounded-md transition-colors ${
//               activeTab === 'all'
//                 ? 'bg-blue-500 text-white'
//                 : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//             }`}
//           >
//             ທັງໝົດ ({allData.length})
//           </button>
//           <button
//             onClick={() => setActiveTabAndFilter('medicine')}
//             className={`px-4 py-2 rounded-md transition-colors ${
//               activeTab === 'medicine'
//                 ? 'bg-blue-500 text-white'
//                 : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//             }`}
//           >
//             ຢາ ({allData.filter((item) => item.type_name === 'ຢາ').length})
//           </button>
//           <button
//             onClick={() => setActiveTabAndFilter('equipment')}
//             className={`px-4 py-2 rounded-md transition-colors ${
//               activeTab === 'equipment'
//                 ? 'bg-blue-500 text-white'
//                 : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//             }`}
//           >
//             ອຸປະກອນ (
//             {allData.filter((item) => item.type_name === 'ອຸປະກອນ').length})
//           </button>
//         </div>

//         <div className="flex gap-4 items-end">
//           <Search
//             type="text"
//             name="search"
//             placeholder="ຄົ້ນຫາ..."
//             className="rounded border border-stroke dark:border-strokedark"
//             onChange={(e) => {
//               const query = e.target.value;
//               setSearchQuery(query);
//             }}
//           />
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto">
//           <table className="w-full min-w-max table-auto">
//             <thead>
//               <tr className="text-left bg-gray-50 border-b border-stroke">
//                 {getTableHeaders().map((header, idx) => (
//                   <th
//                     key={idx}
//                     className="px-4 py-3 text-gray-700 font-semibold"
//                   >
//                     {header}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td
//                     colSpan={getTableHeaders().length}
//                     className="py-8 text-center"
//                   >
//                     <div className="flex justify-center">
//                       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//                     </div>
//                   </td>
//                 </tr>
//               ) : paginatedData.length > 0 ? (
//                 paginatedData.map((item, idx) => renderTableRow(item, idx))
//               ) : (
//                 <tr>
//                   <td
//                     colSpan={getTableHeaders().length}
//                     className="py-8 text-center text-gray-500"
//                   >
//                     <div className="flex flex-col items-center">
//                       <Package className="w-12 h-12 text-gray-300 mb-2" />
//                       <p>ບໍ່ມີຂໍ້ມູນ</p>
//                     </div>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         {filteredData.length > 0 && (
//           <TablePaginationDemo
//             count={filteredData.length}
//             page={page}
//             onPageChange={handlePageChange}
//             rowsPerPage={rowsPerPage}
//             onRowsPerPageChange={handleRowsPerPageChange}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default ReportPer;
