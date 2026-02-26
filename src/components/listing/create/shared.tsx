import type { ReactNode } from 'react';

export function SectionTitle({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon?: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      {icon ? (
        <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-custom-orange/12 text-custom-orange">
          {icon}
        </div>
      ) : null}
      <div>
        <h2 className="text-xl font-extrabold tracking-tight text-custom-dark">
          {title}
        </h2>
        <p className="mt-1 text-sm font-semibold leading-6 text-custom-gray-700">
          {description}
        </p>
      </div>
    </div>
  );
}

export function FieldLabel({
  label,
  required,
}: {
  label: string;
  required?: boolean;
}) {
  return (
    <label className="text-sm font-semibold text-custom-dark">
      {label}
      {required && <span className="ml-1 text-custom-orange">*</span>}
    </label>
  );
}

export function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-custom-gray-300/50 bg-white px-4 py-3">
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-custom-gray-600">
        {label}
      </p>
      <p className="mt-1 text-sm font-extrabold text-custom-dark">{value}</p>
    </div>
  );
}
