import React from "react";
import Input from "../../interface/Input";
import { IoIosSearch } from "react-icons/io";

export default function InputSearch(props: Input) {
  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (props.onChangeHandler) {
      props.onChangeHandler(e);
    }
  }

  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    inputRef.current!.value = props.defValue.toString();
  }, [props.defValue]);

  return (
    <div className={"text-start px-2 my-1 " + props.inputClassName}>
      {props.label && (
        <label
          htmlFor={props.name ? props.name : "name"}
          className="text-[16px] block leading-[24px] text-[#23262F] font-[700] ml-2 md:ml-0 pt-3 my-2"
        >
          {props.label}
        </label>
      )}
      <div className="flex justify-center items-center w-full shadow-lg rounded-lg mt-2">
        <input
          ref={inputRef}
          type="text"
          name={props.name ? props.name : "name"}
          disabled={props.disabled ? true : false}
          placeholder={props.placeholder ? props.placeholder : `Enter Name`}
          onChange={(e) => onChange(e)}
          className={
            "input border-none  text-[14px] text-black w-[95%] font-medium disabled:bg-white disabled:text-black placeholder:font-normal placeholder:text-[#000] bg-white focus:outline-none my-[unset!important]"
          }
          style={{ borderColor: "rgb(189, 189, 189)" }}
        />
        <div className="bg-[#002F53] text-white p-[14px] rounded-r-lg">
          <IoIosSearch className="text-[20px]"
          onClick={props.onClick}
          />
        </div>
      </div>
      {props.error && <p className="text-[12px] text-red-500">{props.error}</p>}
    </div>
  );
}
