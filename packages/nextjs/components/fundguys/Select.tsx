/**
 * NOTE: the register function automatically applies input "name" based on id prop value
 */

export function Select({
  label,
  id,
  //   type,
  register,
  validations,
  placeholder,
  errors,
  options,
  handleChange,
  defaultValue = "",
}: {
  label?: any;
  id: any;
  //   type: any;
  register?: any;
  validations?: any;
  placeholder?: string;
  errors?: any;
  options: { value: string; label: string }[];
  handleChange?: (e: any) => void;
  defaultValue?: string;
}) {
  let classNames = "select select-primary h-14 w-full px-4 py-2 text-xl bg-base-300 rounded-2xl";

  if (errors) {
    classNames += " border-red-500";
  } else {
    classNames += " border-gray-400";
  }

  // handles if no register function is passed
  const registrationProps = register ? { ...register(id, validations) } : {};

  return (
    <div className="w-full">
      {label && (
        <div className="mb-1 ml-1 text-xl">
          <label className="" htmlFor={id}>
            <span className="text-xl">{label}</span>
          </label>
        </div>
      )}

      <select onChange={handleChange} defaultValue={defaultValue} className={classNames} id={id} {...registrationProps}>
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <p className="ml-2 text-red-500 font-gothic h-6">{errors && errors.message}</p>
    </div>
  );
}
