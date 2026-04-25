"use client";

type EditableDrawerFooterProps = {
  onCancel: () => void;
  onReset: () => void;
  onSave: () => void;
};

export function EditableDrawerFooter({
  onCancel,
  onReset,
  onSave,
}: EditableDrawerFooterProps) {
  return (
    <div className="flex flex-col gap-2 bg-white px-5 py-4 dark:bg-gray-900 sm:flex-row sm:items-center sm:justify-end">
      <button
        type="button"
        onClick={onReset}
        className="cursor-pointer rounded border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800"
      >
        Reset
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="cursor-pointer rounded border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={onSave}
        className="cursor-pointer rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
      >
        Save
      </button>
    </div>
  );
}
