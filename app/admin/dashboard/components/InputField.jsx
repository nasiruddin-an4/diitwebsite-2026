import React from "react";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <div className="h-40 bg-slate-50 border border-slate-200 rounded-md animate-pulse" />
});

import "react-quill-new/dist/quill.snow.css";
export function InputField({ label, value, onChange, type = "text", textarea = false, richText = false, placeholder = "" }) {
  const baseClass = "w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-shadow";

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
  };

  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">{label}</label>
      {richText ? (
         <div className="bg-white [&_.ql-container]:min-h-[120px] [&_.ql-editor]:text-slate-700 [&_.ql-toolbar]:rounded-t-md [&_.ql-container]:rounded-b-md">
            <ReactQuill
                theme="snow"
                value={value || ""}
                onChange={(content) => onChange(content)}
                modules={modules}
                placeholder={placeholder}
            />
         </div>
      ) : textarea ? (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${baseClass} resize-none h-24`}
        />
      ) : (
        <input
          type={type}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={baseClass}
        />
      )}
    </div>
  );
}
