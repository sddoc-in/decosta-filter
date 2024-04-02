import React from "react";
import { IoIosSearch } from "react-icons/io";
import Input from "../interface/Input";

export default function InputSearch(props: Input) {
  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (props.onChangeHandler) {
      props.onChangeHandler(e);
    }
  }

  function onSearchClick(){
    if(props.onClickSearch){
      props.onClickSearch();
    }
  }

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
          type="text"
          name={props.name ? props.name : "name"}
          disabled={props.disabled ? true : false}
          defaultValue={props.defValue}
          placeholder={props.placeholder ? props.placeholder : `Enter Name`}
          onChange={(e) => onChange(e)}
          className={
            "input border-none  text-[14px] text-black w-[95%] font-medium disabled:bg-white disabled:text-black placeholder:font-normal placeholder:text-[#000] bg-white focus:outline-none my-[unset!important]"
          }
          style={{ borderColor: "rgb(189, 189, 189)" }}
        />
        <div className="bg-[#002F53] text-white p-[14px] rounded-r-lg" onClick={onSearchClick}>
          <IoIosSearch className="text-[20px]" />
        </div>
      </div>
      {props.error && <p className="text-[12px] text-red-500">{props.error}</p>}
    </div>
  );
}
