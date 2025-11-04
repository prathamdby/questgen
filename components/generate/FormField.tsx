"use client";

interface FormFieldProps {
  label: string;
  required?: boolean;
  description?: string;
  htmlFor?: string;
  children: React.ReactNode;
}

export function FormField({
  label,
  required = false,
  description,
  htmlFor,
  children,
}: FormFieldProps) {
  return (
    <div className="group">
      <label
        htmlFor={htmlFor}
        className="mb-3 block text-[13px] font-[500] text-[#525252] dark:text-[#a3a3a3]"
      >
        {label} {required && <span className="text-[#ef4444]">*</span>}
      </label>
      {children}
      {description && (
        <p className="mt-2 text-[13px] leading-[1.5] text-[#737373] dark:text-[#737373]">
          {description}
        </p>
      )}
    </div>
  );
}

