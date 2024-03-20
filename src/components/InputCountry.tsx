import React from "react";

import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import Input from "../interface/Input";
import AllCountriesData from "../constant/countary";
import CountriesInterface from "../interface/Country";
import { MainContext } from "../context/Context";

export default function InputCountry(props: Input) {
  const [show, setShow] = React.useState(false);
  const [fileteredCountries, setFilteredCountries] =
    React.useState<CountriesInterface[]>(AllCountriesData);

  const [defValue, setDefValue] = React.useState<string>(props.defValue);

  function Show() {
    if (!props.disabled) {
      setShow(!show);
    }
  }

  const {
    oppositeObj
  } = React.useContext(MainContext);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setShow(true);
    let filtered = AllCountriesData.filter((data:CountriesInterface) => {
      return data.name.toLowerCase().includes(e.target.value.toLowerCase());
    });
    if (filtered.length === 0) {
      filtered = AllCountriesData.filter((data:CountriesInterface) => {
        return data.dial_code
          .toLowerCase()
          .includes(e.target.value.toLowerCase());
      });
    }
    setFilteredCountries(filtered);
    setDefValue(e.target.value);
  }

  function onCountryClick(data: CountriesInterface) {
    setDefValue(data.name);
    setShow(false);
    if (props.onChange) {
      props.onChange(props.name, data.code);
    }
    // setFilteredCountries(AllCountriesData);
  }

  React.useEffect(() => {
    setDefValue(props.defValue);
  }, [props.defValue]);

  return (
    <>
      <div className={"w-full h-fit text-start my-2 " + props.inputClassName}>
        {props.label && (
          <label
            htmlFor={props.name ? props.name : "password"}
            className="text-[16px] block leading-[24px] text-[#23262F] my-1 md:my-2"
          >
            {props.label}
          </label>
        )}
        <div className={`relative w-full `}>
          <div
            className="absolute right-4"
            onClick={Show}
            style={{ top: "13.5px" }}
          >
            {show ? (
              <IoMdArrowDropup className="text-[#777E91] text-[20px] cursor-pointer" />
            ) : (
              <IoMdArrowDropdown className="text-[#777E91] text-[20px] cursor-pointer" />
            )}
          </div>
          <input
            type="text"
            value={defValue}
            disabled={props.disabled ? true : false}
            name={props.name ? props.name : "password"}
            onChange={(e) => onChange(e)}
            placeholder={
              props.placeholder ? props.placeholder : `Enter Country`
            }
            className={
              "input w-full rounded-lg text-[14px] text-white font-medium  disabled:text-black placeholder:font-normal  bg-white "
          +oppositeObj  }
            style={{ borderColor: "rgb(189, 189, 189)" }}
          />
          {props.error && (
            <p className="text-[12px] text-red-500">{props.error}</p>
          )}
          {show && (
            <div className="absolute z-30 mt-2 top-full left-0 w-full bg-white rounded-lg shadow-md border border-gray-200 h-fit  max-h-[300px] overflow-y-scroll scroll-hide">
              {fileteredCountries.map((data: CountriesInterface, i) => (
                <div
                  key={i}
                  onClick={() => onCountryClick(data)}
                  className="flex items-center justify-between px-4 transition hover:bg-green-500 py-2 border-b border-gray-200 cursor-pointer"
                >
                  <div className="flex items-center">
                    <p className="text-[20px] country-flag ">{data.flag}</p>
                    <p className="text-[black] ml-2 text-[14px]">{data.name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
