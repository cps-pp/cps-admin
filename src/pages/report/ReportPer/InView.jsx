import React, { useState, useEffect } from 'react';
import { Pill, Wrench, X, Package } from 'lucide-react';
import Alerts from '@/components/Alerts';
import { Empty } from 'antd';

const InspectionDetailView = ({
  show,
  setShow,
  inspectionId,
  inspectionData,
}) => {
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [filteredMedicines, setFilteredMedicines] = useState([]);

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('lo-LA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  useEffect(() => {
    if (inspectionId && inspectionData) {
      const inspection = inspectionData.find(
        (item) => item.in_id === inspectionId,
      );
      setSelectedInspection(inspection);

      if (inspection && inspection.medicines) {
        setFilteredMedicines(inspection.medicines);
      }
    }
  }, [inspectionId, inspectionData]);

  const filterMedicinesByTab = (tab) => {
    if (!selectedInspection?.medicines) return;

    let filtered = [];
    if (tab === 'all') {
      filtered = selectedInspection.medicines;
    } else if (tab === 'medicine') {
      filtered = selectedInspection.medicines.filter(
        (med) => med.type_name === 'ຢາ',
      );
    } else if (tab === 'equipment') {
      filtered = selectedInspection.medicines.filter(
        (med) => med.type_name === 'ອຸປະກອນ',
      );
    }

    setFilteredMedicines(filtered);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    filterMedicinesByTab(tab);
  };

  useEffect(() => {
    filterMedicinesByTab(activeTab);
  }, [selectedInspection, activeTab]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="rounded bg-white pt-4 dark:bg-boxdark">
          <Alerts />

          {/* Header */}
          <div className="flex items-center justify-between border-b border-stroke px-4">
            <h1 className="text-md md:text-lg lg:text-xl font-medium mb-4 text-strokedark">
              ລາຍລະອຽດການຈ່າຍຢາ ແລະ ອຸປະກອນໃບບິນ - {selectedInspection?.in_id}
            </h1>
            <button
              onClick={() => setShow(false)}
              className="text-gray-500 hover:text-gray-700 mb-4"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-4 max-h-[80vh] overflow-y-auto">
            {selectedInspection && (
              <div className="pb-6 border-b border-stroke mt-2">
                <h2 className="text-lg font-semibold mb-4 text-strokedark ">
                  ຂໍ້ມູນການ
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-600">
                      ລະຫັດປິນປົວ
                    </label>
                    <p className="text-base font-mono text-form-strokedark border border-stroke px-3 py-2 rounded">
                      {selectedInspection.in_id}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-600">
                      ວັນທີປິ່ນປົວ
                    </label>
                    <p className="text-base text-form-strokedark border border-stroke px-3 py-2 rounded">
                     {selectedInspection.date ? new Date(selectedInspection.date).toLocaleDateString('lo-LA') : '-'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-4 text-form-input">
                ລາຍການຢາແລະອຸປະກອນ
              </h2>

              {/* Tab Navigation */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => handleTabChange('all')}
                  className={`px-4 py-2 rounded transition-colors ${
                    activeTab === 'all'
                      ? 'bg-blue-500 text-white'
                      : ''
                  }`}
                >
                  ທັງໝົດ ({selectedInspection?.medicines?.length || 0})
                </button>
                <button
                  onClick={() => handleTabChange('medicine')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    activeTab === 'medicine'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Pill className="w-4 h-4 inline mr-1" />
                  ຢາ (
                  {selectedInspection?.medicines?.filter(
                    (med) => med.type_name === 'ຢາ',
                  ).length || 0}
                  )
                </button>
                <button
                  onClick={() => handleTabChange('equipment')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    activeTab === 'equipment'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Wrench className="w-4 h-4 inline mr-1" />
                  ອຸປະກອນ (
                  {selectedInspection?.medicines?.filter(
                    (med) => med.type_name === 'ອຸປະກອນ',
                  ).length || 0}
                  )
                </button>
              </div>

              {filteredMedicines && filteredMedicines.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full table-auto border-collapse border border-stroke">
                    <thead>
                      <tr className="bg-slate-200 border border-stroke text-md ">
                        <th className="px-3 py-2 font-semibold border-r border-slate-300  text-form-input">
                          ລຳດັບ
                        </th>
                        <th className="px-3 py-2 font-semibold border-r border-slate-300  text-left text-form-input">
                          ລະຫັດ
                        </th>
                        <th className="px-3 py-2 font-semibold border-r border-slate-300  text-left text-form-input">
                          ຊື່ລາຍການ
                        </th>
                        {/* <th className="px-3 py-2 font-semibold border-r border-slate-300 text-form-input">
                          ຈຳນວນ
                        </th> */}
                        <th className="px-3 py-2 font-semibold - text-left text-form-input">
                          ລາຄາລວມ
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMedicines.map((medicine, index) => (
                        <tr
                          key={medicine.med_id || index}
                          className="text-md border-b border-stroke"
                        >
                          <td className="px-3 py-2 text-center border-r border-stroke">
                            {index + 1}
                          </td>
                          <td className="px-3 py-2 text-md border-r border-stroke">
                            {medicine.med_id || '-'}
                          </td>
                          <td className="px-3 py-2 border-r border-stroke">
                            {medicine.med_name || '-'}
                          </td>
                          {/* <td className="px-3 py-2 text-right border-r border-stroke">
                            {medicine.qty || '-'}
                          </td> */}
                          <td className="px-3 py-2 text-left font-medium">
                            {medicine.total != null
                              ? medicine.total.toLocaleString('en-GB') + ' ກີບ'
                              : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-50 text-md font-semibold">
                        <td
                          colSpan={3}
                          className="px-3 py-2 text-right border-r border-stroke text-form-input"
                        >
                          ລວມທັງໝົດ:
                        </td>
                        <td className="px-3 py-2 text-left text-blue-600">
                          {filteredMedicines
                            .reduce((sum, med) => sum + (med.total || 0), 0)
                            .toLocaleString('en-GB')}{' '}
                          ກີບ
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <div className="w-32 h-32 flex items-center justify-center mx-auto">
                    <Empty description={false} />
                  </div>
                  <p className="text-lg">
                    ບໍ່ມີລາຍການ
                    {activeTab === 'medicine'
                      ? 'ຢາ'
                      : activeTab === 'equipment'
                        ? 'ອຸປະກອນ'
                        : ''}
                  </p>
                  <p className="text-sm mt-2">ໃນໃບບິນນີ້</p>
                </div>
              )}
            </div>

            <div className="flex justify-end ">
              <button
                onClick={() => setShow(false)}
                className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              >
                ປິດ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspectionDetailView;
