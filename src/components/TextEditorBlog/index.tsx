// "use client"; // Next.JS

import useColorMode from "@/hooks/useColorMode";
import { AiEditor, AiEditorOptions } from "aieditor";
import "aieditor/dist/style.css";

import { HTMLAttributes, forwardRef, useEffect, useRef } from "react";

type AIEditorProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange"> & {
  name:string;
  label:string;
  placeholder?: string;
  setValue: any;
  defaultValue?: string;
  value?: string;
  onChange?: (val: string) => void;
  options?: Omit<AiEditorOptions, "element">;
};

export default forwardRef<HTMLDivElement, AIEditorProps>(function AIEditor(
  {
    name,
    label,
    setValue,
    placeholder,
    defaultValue,
    value,
    onChange,
    options,
    ...props
  }: AIEditorProps,
  ref
  
) {
  const divRef = useRef<HTMLDivElement>(null);
  const aiEditorRef = useRef<AiEditor | null>(null);
  const [colorMode] = useColorMode();

  useEffect(() => {
    if (!divRef.current) return;

    if (!aiEditorRef.current) {
      const aiEditor = new AiEditor({
        element: divRef.current,
        placeholder: placeholder,
        content: defaultValue,
        lang:'en',
        onChange: (ed) => {
          if (typeof onChange === "function") {
            onChange(ed.getHtml());
          }
        },
        ...options,
      });

      aiEditorRef.current = aiEditor;
    }

    return () => {
      if (aiEditorRef.current) {
        aiEditorRef.current.destroy();
        aiEditorRef.current = null;
        
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (ref) {
      if (typeof ref === "function") {
        ref(divRef.current);
      } else {
        ref.current = divRef.current;
      }
    }
  }, [ref]);

  useEffect(() => {
    if (aiEditorRef.current && value !== aiEditorRef.current.getMarkdown()) {
      aiEditorRef.current.setContent(value || "");
    }
  }, [value]);

  return (
    <div {...props}>
      
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-black dark:text-white mb-2">
          {label}
        </label>
      )}
      <div
        ref={divRef}
        id={name}
        
        className="min-h-[300px]  border border-stroke rounded-md p-2 mb-6" style={{ height: "800px", color: "rgb(46, 58, 71)" }}




      />
    </div>
)});



