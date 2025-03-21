import { ITableHeader } from '@/types/table';

export const stockHeaders: ITableHeader[] = [
  { id: '', name: '', sortable: true },

  { id: 'import_date', name: 'ວັນທີ່ນຳເຂົ້າ', sortable: true },
  { id: 'product', name: 'ສິນຄ້າ', sortable: true },
  { id: 'type', name: 'ປະເພດ', sortable: true },
  { id: 'unit', name: 'ຫົວໜ່ວຍ', sortable: true },
  { id: 'price', name: 'ລາຄາ', sortable: true },
  { id: 'import_price', name: 'ລາຄານຳເຂົ້າ', sortable: true },
  { id: 'inventory', name: 'ຈຳນວນໃນຄັງ', sortable: true },
  { id: 'sold_out', name: 'ຂາຍໄປແລ້ວ', sortable: true },
  { id: 'action', name: 'ຈັດການຂໍ້ມູນ', sortable: true },
];
