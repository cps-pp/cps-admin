// const OrderCreate = () => {
//     return ( <div>

// const fetchMedicines = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch('http://localhost:4000/src/manager/medicines');

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const data = await response.json();
//       setMedicines(data.data);
//       setFilteredMedicines(data.data);
//     } catch (error) {
//       console.error('Error fetching medicines:', error);
//     } finally {
//       setLoading(false);
//     }
//   };
//   const fetchSuppliers = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch('http://localhost:4000/src/manager/supplier');

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const data = await response.json();
//       setSuppliers(data.data);
//       setFilteredSuppliers(data.data);
//     } catch (error) {
//       console.error('Error fetching categories:', error);
//     } finally {
//       setLoading(false);
//     }
//   };


//     </div> );
// }
 
// export default OrderCreate;