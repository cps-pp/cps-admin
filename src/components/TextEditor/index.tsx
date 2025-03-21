import { RegisterOptions, SetValueConfig } from 'react-hook-form';
import { Editor } from '@tinymce/tinymce-react';

// TinyMCE so the global var exists
import 'tinymce/tinymce';
// DOM model
import 'tinymce/models/dom/model';
// Theme
import 'tinymce/themes/silver';
// Toolbar icons
import 'tinymce/icons/default';
// Editor styles
import 'tinymce/skins/ui/oxide/skin';

// importing the plugin js.
// if you use a plugin that is not listed here the editor will fail to load
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/autoresize';
import 'tinymce/plugins/autosave';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/code';
import 'tinymce/plugins/codesample';
import 'tinymce/plugins/directionality';
import 'tinymce/plugins/emoticons';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/help';
import 'tinymce/plugins/help/js/i18n/keynav/en';
import 'tinymce/plugins/image';
import 'tinymce/plugins/importcss';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/media';
import 'tinymce/plugins/nonbreaking';
import 'tinymce/plugins/pagebreak';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/quickbars';
import 'tinymce/plugins/save';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/table';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/visualchars';
import 'tinymce/plugins/wordcount';

// importing plugin resources
import 'tinymce/plugins/emoticons/js/emojis';

// Content styles, including inline UI like fake cursors
import 'tinymce/skins/content/default/content';
import 'tinymce/skins/ui/oxide/content';
import useColorMode from '@/hooks/useColorMode';

type TextEditorProps = {
  label: string;
  name: string;
  value?: string;
  register: any;
  errors?: any;
  formOptions?: RegisterOptions;
  setValue: any;
  
};

export default function TextEditor({
  label,
  name,
  value,
  register,
  errors,
  formOptions,
  setValue,
}: TextEditorProps) {
  const [colorMode] = useColorMode();

  return (
    <div className="mb-4">
      <label
        className="mb-3 block text-sm font-medium text-black dark:text-white"
        htmlFor={name}
      >
        {label}
      </label>
      <Editor
        apiKey="r7l6bw4ss49dgq96zxaf3a0vjupr6hw6b8bzupkvu9ccy29o"
        initialValue={value}
        init={{
          height: 350,
          menubar: false,
          base_url: '/tinymce',
          skin: colorMode === 'dark' ? 'oxide-dark' : 'oxide',
          content_css: colorMode === 'dark' ? 'tinymce-5-dark' : 'default',
          plugins: [
            'advlist',
            'anchor',
            'autolink',
            'help',
            'image',
            'link',
            'lists',
            'searchreplace',
            'table',
            'wordcount',
          ],
          toolbar:
            'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
        }}
        onEditorChange={(content: string) => setValue(name, content)}
      />
      <input type="hidden" {...register(name, formOptions)} />
      {errors[name] && (
        <span className="text-red-500">{errors[name]?.message}</span>
      )}
    </div>
  );
}
