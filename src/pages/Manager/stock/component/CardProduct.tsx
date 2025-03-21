// import React from 'react';

// interface ProductData {
//   img_product: string;
//   product_name: string;
//   product_id: string;
//   product_type: string;
//   unit: string;
//   price: string;
//   import_price: string;
//   total_inventory: string;
//   sold_out: string;
// }

// interface ProductCardProps {
//   data: ProductData;
// }

// const ProductCard: React.FC<ProductCardProps> = ({ data }) => {
//   return (
//     <div className="col rounded-xl border-2 border-gray-200 bg-white dark:border-form-strokedark dark:bg-boxdark">
//       <div className="flex flex-col">
//         <div className="flex justify-center">
//           <img src={data.img_product} alt="product image" className="h-60 w-full rounded-lg object-cover" />
//         </div>
//         <div className="mt-4 space-y-2 p-4">
          
//         <div className="space-y-1">
//           </div>
//           <div className="space-y-1">
//             <h2 className="line-clamp-1 text-lg font-semibold dark:text-white">{data.product_name}</h2>
//             <span className="text-sm text-gray-500 dark:text-white">{data.product_id}</span>
//           </div>
//           <div className="space-y-1">
//             <p className="font-medium dark:text-white">{data.product_type}</p>
//           </div>
//           <div className="mt-2 grid grid-cols-2 gap-x-2 text-sm">
//             <div className="flex items-center">
//               <p className="font-medium text-gray-700 dark:text-white">{data.unit}</p>
//             </div>
//             <div className="flex items-center justify-end">
//               <p className="font-medium text-blue-600 dark:text-white">{data.price}</p>
//             </div>
//             <div className="col-span-2 mt-2 rounded-xl p-2">
//               <div className="space-y-1 text-end">
//                 <p className="text-gray-600 dark:text-white">ລາຄານຳເຂົ້າ {data.import_price}</p>
//                 <p className="text-gray-600 dark:text-white">ຂາຍແລ້ວ {data.sold_out}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductCard;
