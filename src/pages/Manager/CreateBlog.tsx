import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import Input from '@/components/Forms/Input';
import Select from '@/components/Forms/Select';
import { useAppDispatch } from '@/redux/hook';
import { showAlertWithAutoClose } from '@/redux/reducer/alert';
import api from '@/api/axios';
import { useNavigate } from 'react-router-dom';
import TextEditorBlog from '@/components/TextEditorBlog';
import ImageUpload from '@/components/Forms/ImageUpload';
import Textarea from '@/components/Forms/Textarea';
import SelectID from '@/components/Forms/SelectID';
import UnsavedChangesWarning from '@/components/UnsavedChangesWarning';
import ButtonWithWarning from '@/components/SubmitButton';
import SubmitButton from '@/components/SubmitButton';

type Form = {
  title: string;
  en_title: string;
  cover_image: string;
  content: string;
  author: string;
  publish: boolean;
  slug: string;
  thumbnail: string;
  sort_description: string;
  categories: string[];
  tags: string[];
  created_at: Date;
};

interface Category {
  id: string;
  name: string;
}

interface TagTypes {
  id: string;
  name: string;
}

export default function CreateBlogs() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [content, setContent] = useState<string>('');
  const [sortDescription, setSortDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tag, setTag] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<TagTypes[]>([]);
  const [publishOption, setPublishOption] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSortDescription(event.target.value);
  };
  const [isLoading, setIsLoading] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<Form>();


  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isFormDirty) {
        const message = 'You have unsaved changes. Are you sure you want to leave?';
        event.returnValue = message; // Standard for most browsers
        return message; // For some older browsers
      }
    };

    const handleBeforeNavigate = (event: PopStateEvent) => {
      if (isFormDirty) {
        // Prevent navigation and show a custom confirmation message
        const confirmation = window.confirm('You have unsaved changes. Are you sure you want to leave?');
        if (!confirmation) {
          event.preventDefault(); 
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handleBeforeNavigate); 

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handleBeforeNavigate);
    };
  }, [isFormDirty]);

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append('title', data.title.trim());
    formData.append('en_title', data.en_title.trim());
    formData.append('content', content.trim() || 'No content available.');
    formData.append('sort_description', sortDescription.trim());
    formData.append('categories', category);
    formData.append('tags', tag);
    formData.append('created_at', new Date().toISOString());
    formData.append('publish', publishOption === 'Public' ? 'true' : 'false');

    if (imageFile) {
      formData.append('cover_image', imageFile);
    }

    if (thumbnailFile) {
      formData.append('thumbnail', thumbnailFile);
    } else if (imageFile) {
      formData.append('thumbnail', imageFile);
    }

    try {
      setIsLoading(true);

      const response = await api.post('/blog/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setTimeout(() => {
        setIsLoading(false);
        //  successful submission 
      }, 1000);

      dispatch(
        showAlertWithAutoClose({
          type: 'success',
          message: 'Blog created successfully!',
          title: '',
        }),
      );


      navigate('/blogs/article');
    } catch (error) {
      setIsLoading(false);
      dispatch(
        showAlertWithAutoClose({
          type: 'error',
          message: 'Failed to create Blog!',
          title: '',
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

  return (
    <>
      {/* <UnsavedChangesWarning isFormDirty={isFormDirty} /> */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold mb-4 text-primary">
              Blogs Details
            </h1>
            <button
            onClick={() => navigate(-1)}
            className="cursor-pointer inline-flex items-center justify-center gap-2.5 rounded-md bg-primary active:bg-blue-800 py-2 px-4 hover:shadow-lg text-center font-medium text-white hover:bg-opacity-90 outline-none focus:outline-none ease-linear transition-all duration-150"
          >
            Go Back
          </button>
          </div>

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

          <ImageUpload label="Cover Image"
           onChange={setImageFile} />
          <ImageUpload label="Thumbnail Image" 
          onChange={setThumbnailFile} />
          <TextEditorBlog
            name="content"
            label="Blog Content"
            value={content}
            onChange={setContent}
            setValue={undefined}
          />

          <SelectID
            label="Category"
            name="category"
            value={category}
            options={categories.map((cat) => ({
              value: cat.id,
              label: cat.name,
            }))}
            register={register}
            errors={errors}
            onSelect={(e) => setCategory(e.target.value)}
          />

          <SelectID
            label="Tag"
            name="tag"
            value={tag}
            options={tags.map((tag) => ({
              value: tag.id,
              label: tag.name,
            }))}
            register={register}
            errors={errors}
            onSelect={(e) => setTag(e.target.value)}
          />

          <Select
            label="Publish"
            name="publish"
            select={publishOption}
            options={['Close', 'Public']}
            register={register}
            errors={errors}
            onSelect={(e) => setPublishOption(e.target.value)}
          />
        </div>

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
    </>
  );
}
