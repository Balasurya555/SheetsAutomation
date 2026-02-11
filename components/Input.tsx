
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({ label, ...props }) => {
  return (
    <div className="flex flex-col space-y-1.5 w-full">
      <label className="text-xs font-bold text-[#395886] uppercase tracking-widest ml-1">{label}</label>
      <input
        {...props}
        className="px-4 py-2.5 bg-white border border-[#D5DEEF] rounded-xl text-[#395886] focus:border-[#638ECB] focus:ring-2 focus:ring-[#638ECB]/10 outline-none transition-all-300 placeholder:text-[#395886]/30 shadow-sm"
      />
    </div>
  );
};

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, ...props }) => {
  return (
    <div className="flex flex-col space-y-1.5 w-full">
      <label className="text-xs font-bold text-[#395886] uppercase tracking-widest ml-1">{label}</label>
      <textarea
        {...props}
        className="px-4 py-2.5 bg-white border border-[#D5DEEF] rounded-xl text-[#395886] focus:border-[#638ECB] focus:ring-2 focus:ring-[#638ECB]/10 outline-none transition-all-300 min-h-[100px] placeholder:text-[#395886]/30 shadow-sm"
      />
    </div>
  );
};
