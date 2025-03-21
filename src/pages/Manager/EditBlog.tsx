import { useEffect, useState } from 'react';
import api from '@/api/axios';
import { useDispatch } from 'react-redux';
import { showAlertWithAutoClose } from '@/redux/reducer/alert';
import { useNavigate, useParams } from 'react-router-dom';
import TextEditorBlog from '@/components/TextEditorBlog';
import Input from '@/components/Forms/Input';
import Select from '@/components/Forms/Select';
import { useForm } from 'react-hook-form';
import ImageUpload from '@/components/Forms/ImageUpload';
import { IBlogs } from '@/types/blog';
import SelectID from '@/components/Forms/SelectID';
import Textarea from '@/components/Forms/Textarea';
import SubmitButton from '@/components/SubmitButton';

interface Category {
  id: string;
  name: string;
}

interface TagTypes {
  id: string;
  name: string;
}

export default function EditBlog() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [content, setContent] = useState<string>('');
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [BlogDetail, setBlogDetail] = useState<IBlogs | null>(null);
  const { id } = useParams<{ id: string }>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<TagTypes[]>([]);
  const [category, setCategory] = useState<string>(''); 
  const [tag, setTag] = useState<string>(''); 
  const handleSetValue = (value: string) => setContent(value);
  const [sortDescription, setSortDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IBlogs>();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await api.get(`/blog/${id}`);
        const BlogData = response.data;

        setBlogDetail(BlogData);
        setValue('title', BlogData.title);
        setValue('en_title', BlogData.en_title);
        setSortDescription(BlogData.sort_description);
        setContent(BlogData.content);
        setValue('publish', BlogData.publish ? 'Public' : 'Close');

        setCategory(BlogData.categories[0]?._id || '');
        setTag(BlogData.tags[0]?._id || '');
      } catch (error) {
        console.log('Error fetching blog data', error);
      }
    };

    if (id) fetchBlog();
  }, [id, setValue]);

  const onSubmit = async (data: IBlogs) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('en_title', data.en_title);
      formData.append('sort_description', sortDescription);
      formData.append('content', content);
      formData.append('category', category);  // Send the correct category
      formData.append('tag', tag);  // Send the correct tag
      formData.append('publish', data.publish === 'Public' ? 'true' : 'false');
  
      if (coverImageFile) formData.append('cover_image', coverImageFile);
      if (thumbnailFile) formData.append('thumbnail', thumbnailFile);
  
      await api.put(`/blog/edit/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      setTimeout(() => {
        setIsLoading(false);
        dispatch(
             // @ts-ignore
          showAlertWithAutoClose({
            type: 'success',
            title: 'Blog updated successfully',
            message: '',
          }),
        );
        navigate('/blogs/article');
      }, 1000);
    } catch (error: any) {
      setIsLoading(false);
      console.log('Error updating blog', error);
      dispatch(
          // @ts-ignore
        
        showAlertWithAutoClose({
          type: 'error',
          title: 'Blog update failed',
          message: error?.data?.info,
        }),
      );
    }
  };
  

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/category/getlist');
        setCategories(
          response.data.data.map((cat: { _id: string; name: string }) => ({
            id: cat._id,
            name: cat.name,
          })) || [],
        );
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    };

    const fetchTags = async () => {
      try {
        const response = await api.get('/tag/getlist');
        setTags(
          response.data.data.map((tag: { _id: string; name: string }) => ({
            id: tag._id,
            name: tag.name,
          })) || [],
        );
      } catch (error) {
        console.error('Failed to fetch tags', error);
      }
    };

    fetchCategories();
    fetchTags();
  }, []);

  const publish = watch('publish');
  
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSortDescription(event.target.value);
 
  };
  const handleCategorySelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(event.target.value);  
  };
  // Handle change for Tag select
  const handleTagSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTag(event.target.value);  // Set the selected tag value to state
  };

  return (
    <div className="container mx-auto p-4">
      <div className="border border-stroke bg-white p-6 rounded-lg hover:shadow-xl shadow-md transition-shadow duration-300 dark:border-strokedark dark:bg-boxdark">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold mb-4 text-primary">Update Blog</h1>
      
          <button
            onClick={() => navigate(-1)}
            className="cursor-pointer inline-flex items-center justify-center gap-2.5 rounded-md bg-primary active:bg-blue-800 py-2 px-4 hover:shadow-lg text-center font-medium text-white hover:bg-opacity-90 outline-none focus:outline-none ease-linear transition-all duration-150"
          >
            Go Back
          </button>
        </div>
        <hr className="my-4 border-gray-300" />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Blog Title"
            name="title"
            placeholder="Enter blog title"
            register={register}
            formOptions={{ required: 'Please input the blog title' }}
            errors={errors}
          />
          <Input
            label="English Title"
            name="en_title"
            placeholder="Enter English title"
            register={register}
            formOptions={{ required: 'Please input the English title' }}
            errors={errors}
          />
          <Textarea
            label="Sort Description"
            name="sort_description"
            value={sortDescription}
            onChange={handleChange}
            row={2}
          />
       
          {BlogDetail?.cover_image && (
            <div className="mb-4">
              <label className="block text-gray-700">Cover Image:</label>
              <img
                src={BlogDetail.cover_image}
                alt="Current Cover"
                className="mt-2 w-[400px] h-auto"
              />
            </div>
          )}
          <ImageUpload
            label="Cover Image"
            onChange={setCoverImageFile}
          />
          {BlogDetail?.thumbnail && (
            <div className="mb-4">
              <label className="block text-gray-700">Thumbnail:</label>
              <img
                src={BlogDetail.thumbnail}
                alt="Current Thumbnail"
                className="mt-2 w-[400px] h-auto"
              />
            </div>
          )}
          <ImageUpload
            label="Thumbnail"
            // name="thumbnail"
            onChange={setThumbnailFile}
          />
          <TextEditorBlog
            name="content"
            label="Blog Content"
            value={content}
            onChange={handleSetValue}
            setValue={undefined}
          />
          <SelectID
            label="Category"
            name="category"
            value={sortDescription}
            onChange={handleChange}
            options={categories.map((cat) => ({
              value: cat.id,
              label: cat.name,
            }))}
            register={register}
            errors={errors}
           
          />
          <SelectID
            label="Tag"
            name="tag"
            value={sortDescription}
            onChange={handleChange}
            options={tags.map((tag) => ({ value: tag.id, label: tag.name }))}
            register={register}
            errors={errors}
          />
          <Select
            label="Publish"
            name="publish"
            options={['Close', 'Public']}
            register={register}
            errors={errors}
          />
          <div className="flex items-center justify-end p-6 mt-8 border-t border-solid border-blueGray-200 rounded-b">
            <button
              className="text-red-500 font-bold uppercase px-6 py-4 text-sm mr-2"
              type="button"
              onClick={() => navigate('/blogs/article')}
            >
              Cancel
            </button>
            <SubmitButton isLoading={isLoading} />
          </div>
        </form>
      </div>
    </div>
  );
}
