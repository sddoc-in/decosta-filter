import React from "react";
// import SelectArray from "./SelectArray";

export default interface Input {
  defValue: string | number ;
  label?: string;
  name: string;
  onChangeHandler?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  placeholder?: string;
  value?: string;
  inputClassName?: string;
  error?: string;
  onChange?: (type:string,value:string) => void;
  onClick?: () => void;
  selectArray?: {id?:string,name:string,value:string}[];
}
