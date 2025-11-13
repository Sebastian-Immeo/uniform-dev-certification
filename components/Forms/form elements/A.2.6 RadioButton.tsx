'use client';

interface RadioButtonProps {
  label: string;
  isDarkMode: boolean;
  checked: boolean;
  onChange: () => void;
}

const RadioButton = ({
  label,
  isDarkMode,
  checked,
  onChange,
}: RadioButtonProps) => {
  const textColor = isDarkMode ? 'text-platinum' : 'text-carbon';

  const outlineColor = isDarkMode ? 'border-platinum' : 'border-carbon';

  const dotColor = isDarkMode ? 'bg-platinum' : 'bg-carbon';

  const focusOutline = isDarkMode
    ? 'focus-outline-white'
    : 'focus-outline-blue';

  return (
    <button
      type="button"
      className={`flex items-center gap-ft-5 cursor-pointer group ${focusOutline}`}
      onClick={onChange}
    >
      <div
        className={`w-[22px] h-[22px] rounded-full border ${outlineColor} flex items-center justify-center`}
      >
        {checked && (
          <div className={`w-[14px] h-[14px] rounded-full ${dotColor}`} />
        )}
      </div>
      <span
        className={`
            ${textColor} group-hover:underline
           text-body-2
           mb-0 mt-auto
          `}
      >
        {label}
      </span>
    </button>
  );
};

export default RadioButton;
