
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import Input from '@/components/Forms/Input';
import Button from '@/components/Button';
import Search from '@/components/Forms/Search';
import api from '@/api/axios';
import useStockHook from '@/hooks/stock/useStocke';
import { ICreateStock } from '@/types/stock';

interface FormData {
  importItems: never[];
  product_id: string;
  price: number;
  quantity: number;
}

interface ProductDetails {
  [x: string]: any;
  _id: string;
  product_id: string;
  name: string;
  code: string;
  price: string;
  category: {
    id: string;
    name: string;
    description: string;
  };
  unit: {
    id: string;
    name: string;
    amount: number;
  };
  import_price: string;
  quantity_in_stock: string;
  quantity_sold: string;
  image_url: string;
  photos: string[];
  inventory: {
    id: string;
    quantity: number;
  };
  created_at: string;
}

const CreateStock: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredProducts, setFilteredProducts] = useState<ProductDetails[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductDetails | null>(null);
  const navigate = useNavigate();
  const { addStock } = useStockHook();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    try {
      if (e.target.value) {
        const isProductId = /^[a-f0-9]{24}$/.test(e.target.value);
        if (isProductId) {
          const response = await api.get(`/product/detail/${e.target.value}`);
          if (response.data) {
            setFilteredProducts([response.data]);
          } else {
            setFilteredProducts([]);
          }
        } else {
          const response = await api.get<{ data: ProductDetails[] }>(`/product`, {
            params: { search: e.target.value },
          });
          if (response.data?.data) {
            setFilteredProducts(response.data.data);
          } else {
            setFilteredProducts([]);
          }
        }
      } else {
        setFilteredProducts([]);
      }
    } catch (error) {
      console.error('Error searching products:', error);
      setFilteredProducts([]);
    }
  };

  const handleSelectProduct = (product: ProductDetails) => {
    setSelectedProduct(product);
    setValue('product_id', product._id);
    setSearchQuery(product.name);
    setFilteredProducts([]);
    setSearchQuery('');
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setError(null);
    try {
      setIsLoading(true);

      if (!data.product_id) {
        // setError('ກະລຸນາເລືອກສິນຄ້າກ່ອນ');
        setIsLoading(false);
        return;
      }

      const stockData: ICreateStock = {
        importItems: data.importItems || [{ ...data }],
      };

      await addStock(stockData);
      navigate('/stock');
    } catch (error) {
      setError('ຂັດຂ້ອງ');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-xl bg-white pt-4 dark:bg-boxdark">
      <div className="flex items-center justify-between border-b border-stroke px-4 pb-4 dark:border-strokedark">
        <h1 className="text-2xl font-bold">ເພີ່ມສິນຄ້າເຂົ້າສະຕອກ</h1>
        <button
          onClick={() => navigate(-1)}
          className="translate-all inline-flex cursor-pointer items-center justify-center rounded bg-primary px-4 py-2 text-center font-medium text-white outline-none duration-150 ease-linear hover:bg-opacity-90 hover:shadow-lg focus:outline-none active:bg-[#1A37A7]"
        >
          ກັບຄືນ
        </button>
      </div>

      <form className="px-6 py-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center gap-2">
          <Search
            type="text"
            name="search"
            placeholder="ຄົ້ນຫາຊື່ສິນຄ້າ ຫຼື ລະຫັດສິນຄ້າ..."
            className="flex-1 rounded border border-stroke p-2"
            onChange={handleSearchChange}
            // value={searchQuery}
          />
        </div>

        {filteredProducts.length > 0 ? (
          <ul className="mt-1 rounded border border-stroke bg-white shadow-sm dark:border-strokedark dark:bg-boxdark">
            {filteredProducts.map((product, index) => (
              <li
                key={product._id}
                className={`cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-boxdark-2 ${
                  index !== filteredProducts.length - 1 ? 'border-b border-stroke dark:border-strokedark' : ''
                }`}
                onClick={() => handleSelectProduct(product)}
              >
                <div className="flex items-center space-x-3">
                  {product.photos ? (
                    <img src={product.photos} alt={product.name} className="h-8 w-8 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 dark:bg-boxdark-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">No Image</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-primarySecond dark:text-gray-200">{product.name}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                      <p className="text-stone-600 dark:text-gray-400">ລະຫັດສິນຄ້າ{product.code}</p>
                      {/* <span>ປະເພດສິນຄ້າ</span> */}
                      <p className="text-stone-600 dark:text-gray-400">ປະເພດສິນຄ້າ{product.category_id?.name}</p>
                      {/* <span>ຫົວໜ່ວຍ</span> */}
                      <p className="text-stone-600 dark:text-gray-400">ຫົວໜ່ວຍ{product.unit_id?.name}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : searchQuery && filteredProducts.length === 0 && !selectedProduct ? (
          <p className="mt-1 rounded border border-stroke bg-white px-4 py-4 dark:border-strokedark dark:bg-boxdark">
            ບໍ່ພົບສິນຄ້າທີ່ຄົ້ນຫາ
          </p>
        ) : null}

        {selectedProduct && (
          <div className="mt-8 space-y-4">
            <div className="flex">
                {selectedProduct.photos ? (
                  <div>
                    <label className="text-md mb-4">ຮູບພາບ</label>
                    <img
                      src={selectedProduct.photos}
                      alt={selectedProduct.name}
                      className="mt-3 h-55 w-full rounded border border-stroke bg-white object-contain px-1 py-1 text-primarySecond dark:border-strokedark dark:bg-form-input dark:text-gray-500 dark:disabled:bg-meta-4"
                    />
                  </div>
                ) : (
                  <div className="items-center">
                    <label className="mb-2 text-sm">No Image</label>
                  </div>
                )}
              </div>

            <div className="space-y-4">
              <Input
                className="md-2 rounded-md"
                type="text"
                name="productName"
                label="ຊື່ສິນຄ້າ"
                value={selectedProduct.name}
                register={register}
                errors={errors}
                rules={{ required: false }}
                readOnly
              />
              <Input
                className="md-2 rounded-md"
                type="text"
                name="code"
                label="ລະຫັດສິນຄ້າ"
                value={selectedProduct.code}
                register={register}
                errors={errors}
                rules={{ required: false }}
                readOnly
              />

              <Input
                className="md-2 rounded-md"
                type="text"
                name="pos price"
                label="ລາຄານຳເຂົ້າ"
                value={selectedProduct.pos_price}
                register={register}
                errors={errors}
                rules={{ required: false }}
                readOnly
              />
              <Input
                className="md-2 rounded-md"
                type="text"
                name="category"
                label="ປະເພດສິນຄ້າ"
                value={selectedProduct.category_id?.name}
                register={register}
                errors={errors}
                rules={{ required: false }}
                readOnly
              />
              <Input
                className="md-2 rounded-md"
                type="text"
                name="unit"
                label="ຫົວໜ່ວຍ"
                value={selectedProduct.unit_id?.name}
                register={register}
                errors={errors}
                rules={{ required: false }}
                readOnly
              />
            </div>
            <div className="space-y-4">
              <Input
                className="md-2 rounded-md"
                type="number"
                name="price"
                label="ລາຄາ"
                register={register}
                errors={errors}
                rules={{ required: 'ກະລຸນາປ້ອນລາຄາ' }}
              />
              <Input
                className="md-2 rounded-md"
                type="number"
                name="quantity"
                label="ຈຳນວນ"
                register={register}
                errors={errors}
                rules={{ required: 'ກະລຸນາປ້ອນຈຳນວນ' }}
              />
            </div>
          </div>
        )}
        {error && <p className="mt-4 text-center text-red-500">{error}</p>}
        <div className="mt-4 flex justify-end space-x-4">

          <button
            className="px-6 py-2 text-sm font-bold uppercase text-red-500"
            type="button"
            onClick={() => navigate('/stock')}
          >
            Cancel
          </button>

          <Button disabled={isLoading} type="submit" children={'ບັນທຶກຂໍ້ມູນ'} className={`transition-colors`} />
        </div>
      </form>
    </div>
  );
};

export default CreateStock;

