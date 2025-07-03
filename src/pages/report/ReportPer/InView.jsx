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
  const [prescriptionData, setPrescriptionData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  // Fetch prescription data
  const fetchPrescriptionData = async (id) => {
    if (!id) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`http://localhost:4000/src/report/prescription?id=${id}`);
      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || 'Error fetching prescription data');
      }

      setPrescriptionData(json.detail || []);
      setFilteredMedicines(json.detail || []);
    } catch (error) {
      console.error('Fetch prescription error:', error);
      setError('ບໍ່ສາມາດດຶງຂໍ້ມູນລາຍການຢາໄດ້');
      setPrescriptionData([]);
      setFilteredMedicines([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (inspectionId && inspectionData && show) {
      // Find inspection info from props
      const inspection = inspectionData.find(
        (item) => item.in_id === inspectionId,
      );
      setSelectedInspection(inspection);
      
      // Fetch prescription data from API
      fetchPrescriptionData(inspectionId);
    }
  }, [inspectionId, inspectionData, show]);

  const filterMedicinesByTab = (tab) => {
    if (!prescriptionData || prescriptionData.length === 0) return;

    let filtered = [];
    if (tab === 'all') {
      filtered = prescriptionData;
    } else if (tab === 'medicine') {
      filtered = prescriptionData.filter(
        (med) => med.type_name === 'ຢາ',
      );
    } else if (tab === 'equipment') {
      filtered = prescriptionData.filter(
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
  }, [prescriptionData, activeTab]);

  // Reset state when modal closes
  useEffect(() => {
    if (!show) {
      setSelectedInspection(null);
      setPrescriptionData([]);
      setFilteredMedicines([]);
      setActiveTab('all');
      setError('');
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
        <div className="rounded bg-white pt-4 ">
          <Alerts />
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
                     {selectedInspection.date ? new Date(selectedInspection.date).toLocaleDateString('en-GB') : '-'}
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-600">
                      ຊື່ຄົນເຈັບ
                    </label>
                    <p className="text-base text-form-strokedark border border-stroke px-3 py-2 rounded">
                     {selectedInspection.patient_name}
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
                      ? 'bg-slate-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ທັງໝົດ ({prescriptionData?.length || 0}) ລາຍການ
                </button>
                <button
                  onClick={() => handleTabChange('medicine')}
                  className={`px-4 py-2 rounded transition-colors ${
                    activeTab === 'medicine'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Pill className="w-4 h-4 inline mr-1" />
                  ຢາ (
                  {prescriptionData?.filter(
                    (med) => med.type_name === 'ຢາ',
                  ).length || 0}
                  )
                </button>
                <button
                  onClick={() => handleTabChange('equipment')}
                  className={`px-4 py-2 rounded transition-colors ${
                    activeTab === 'equipment'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Wrench className="w-4 h-4 inline mr-1" />
                  ອຸປະກອນ (
                  {prescriptionData?.filter(
                    (med) => med.type_name === 'ອຸປະກອນ',
                  ).length || 0}
                  )
                </button>
              </div>

              {/* Loading State */}
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-2 text-gray-500">ກຳລັງໂຫລດຂໍ້ມູນ...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">
                  <Package className="w-12 h-12 mx-auto mb-2 text-red-300" />
                  <p>{error}</p>
                </div>
              ) : filteredMedicines && filteredMedicines.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full table-auto border-collapse border border-stroke">
                    <thead>
                      <tr className="bg-slate-200 border border-stroke text-md ">
                        <th className="px-3 py-2 font-semibold border-r border-slate-300  text-left text-form-input">
                          ລຳດັບ
                        </th>
                        <th className="px-3 py-2 font-semibold border-r border-slate-300  text-left text-form-input">
                          ລະຫັດ
                        </th>
                        <th className="px-3 py-2 font-semibold border-r border-slate-300  text-left text-form-input">
                          ຊື່ລາຍການ
                        </th>
                        <th className="px-3 py-2 font-semibold border-r border-slate-300  text-center text-form-input">
                          ຈຳນວນ
                        </th>
                        <th className="px-3 py-2 font-semibold border-r border-slate-300  text-left text-form-input">
                          ລາຄາຕໍ່ຫນ່ວຍ
                        </th>
                        <th className="px-3 py-2 font-semibold text-left text-form-input">
                          ລາຄາລວມ
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMedicines.map((medicine, index) => (
                        <tr
                          key={medicine.pre_id || index}
                          className="text-md border-b border-stroke"
                        >
                          <td className="px-3 py-2 text-left border-r border-stroke">
                            {index + 1}
                          </td>
                          <td className="px-3 py-2 text-md border-r border-stroke">
                            {medicine.med_id || '-'}
                          </td>
                          <td className="px-3 py-2 border-r border-stroke">
                            {medicine.med_name || '-'}
                          </td>
                          <td className="px-3 py-2 text-center border-r border-stroke">
                            {medicine.qty || '-'}
                          </td>
                          <td className="px-3 py-2 text-right border-r border-stroke">
                            {medicine.price != null
                              ? medicine.price.toLocaleString('en-GB') + ' ກີບ'
                              : '-'}
                          </td>
                          <td className="px-3 py-2 text-right font-medium">
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
                          colSpan={5}
                          className="px-3 py-2 text-right border-r border-stroke text-form-input"
                        >
                          ລວມທັງໝົດ:
                        </td>
                        <td className="px-3 py-2 text-right text-secondary">
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

            <div className="flex justify-end mt-6">
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