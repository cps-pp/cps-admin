import React, { useState, useEffect } from 'react';
import TypeMedicine from '../TypeService/TypeMedicine';

const InMedicine = ({ inspectionId, patientId,  refreshKey, medicines = [] }) => {
  const [allMedicines, setAllMedicines] = useState([]);
  const [usedMedicines, setUsedMedicines] = useState([]);
  const [loadingMedicines, setLoadingMedicines] = useState(false);
 const [filteredMedicines, setFilteredMedicines] = useState([]);
   const [loading, setLoading] = useState(false);
 
  const [prescriptionData, setPrescriptionData] = useState([]);
  const fetchAllMedicines = async () => {
    try {
      const res = await fetch('http://localhost:4000/src/manager/medicines');
      const data = await res.json();
      if (data.success) {
        setAllMedicines(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching all medicines:', error);
    }
  };
  const fetchPrescriptionData = async (id) => {
        if (!patientId || !inspectionId) return;

    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`http://localhost:4000/src/report/prescription?id=${inspectionId}`);
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
    fetchAllMedicines();
  }, []);

  useEffect(() => {
    if (patientId && inspectionId) {
      fetchUsedMedicines();
    }
  }, [patientId, inspectionId, refreshKey]);

  const displayMedicines = medicines.length > 0 ? medicines : usedMedicines;

  const refreshMedicines = () => {
    fetchPrescriptionData();
  };

  if (loading || loadingMedicines) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="text-gray-500">ກຳລັງໂຫລດຂໍ້ມູນຢາ...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <TypeMedicine 
        selectService={() => {}}
        value={allMedicines}
        refreshKey={refreshKey}
        usedMedicines={displayMedicines} 
        inspectionId={inspectionId}
        onMedicineUpdate={refreshMedicines}
      />
    </div>
  );
};

export default InMedicine;