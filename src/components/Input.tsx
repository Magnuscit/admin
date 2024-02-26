import { ChangeEventHandler } from "react";

interface props {
  placeholder: string;
  type: string;
  onChange?: ChangeEventHandler<HTMLInputElement> | undefined;
}

export default function Input({
  type,
  placeholder,
  onChange = undefined,
}: props) {
  return (
    <input
      type={type}
      onChange={onChange}
      className="p-2 px-5 rounded-lg shadow-black bg-accentWhite w-full lg:max-w-xl text-accentBlack text-lg border-4 border-accentGrey focus:outline-none"
      placeholder={placeholder}
    ></input>
  );
}
