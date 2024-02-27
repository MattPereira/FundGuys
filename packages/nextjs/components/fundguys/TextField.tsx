/**
 * NOTE: the register function automatically applies input "name" based on id prop value
 */

export function TextField({
  label,
  id,
  type,
  register,
  validations,
  placeholder,
  errors,
}: {
  label: string;
  id: string;
  type: string;
  register: any;
  validations: any;
  placeholder: undefined | string;
  errors: any;
}) {
  let classNames = "h-14 w-full px-4 py-2 rounded-2xl text-xl bg-base-300";

  if (errors) {
    classNames += " border-red-500";
  } else {
    classNames += " border-gray-400";
  }

  return (
    <div className="w-full">
      <div className="mb-[1px] ml-3 text">
        <label className="" htmlFor={id}>
          {label}
        </label>
      </div>
      {type === "textarea" ? (
        <textarea className={classNames + " h-20"} id={id} placeholder={placeholder} {...register(id, validations)} />
      ) : (
        <input
          className={classNames + " h-12"}
          type={type}
          id={id}
          placeholder={placeholder}
          {...register(id, validations)}
        />
      )}
      <p className="ml-2 text-red-500 font-gothic h-5 my-1">{errors && errors.message}</p>
    </div>
  );
}
