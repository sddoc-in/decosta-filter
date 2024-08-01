import React from "react";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import CountriesInterface from "../../interface/Countries";
import AllCountriesData from "../../constants/Allcountries";
import focus from "../../functions/focus";

export default function InputCountry(props: {
    label: string;
    handleChange: (type: string, value: string) => void;
    name: string;
    type?: string;
    isRequired?: boolean;
    isDisabled?: boolean;
    isInvalid?: boolean;
    error?: string;
    defaultValue?: string;
    placeholder?: string;
    onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    focus?:string;
    className?:string
}) {
  const [show, setShow] = React.useState(false);
  const [fileteredCountries, setFilteredCountries] =
    React.useState<CountriesInterface[]>(AllCountriesData);

  const [def,setDef] = React.useState(props.defaultValue)
  const inputRef = React.useRef<HTMLInputElement>(null);

  function Show() {
    if (!props.isDisabled) {
      setShow(!show);
    }
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setShow(true);
    let filtered = AllCountriesData.filter((data: CountriesInterface) => {
      return data.name.toLowerCase().includes(e.target.value.toLowerCase());
    });
    if (filtered.length === 0) {
      filtered = AllCountriesData.filter((data: CountriesInterface) => {
        return data.dial_code
          .toLowerCase()
          .includes(e.target.value.toLowerCase());
      });
    }
    setFilteredCountries(filtered);
  }

  function onKeyPress(e: React.KeyboardEvent<HTMLInputElement>){
    if (props.onKeyPress) {
      props.onKeyPress(e);
    }
    if (e.key === "Enter") {
      focus(props.focus || "");
    }
  }

  function onCountryClick(data: CountriesInterface) {
    inputRef.current!.value = data.name;
    setShow(false);
    if (props.handleChange) {
      props.handleChange(props.name, data.code);
    }
    setFilteredCountries(AllCountriesData);
  }

  const start = React.useCallback(() => {
    let newDef = fileteredCountries.find(
      (data) => data.code === def
    );
    if (newDef) {
      inputRef.current!.value = newDef.name;
    }
  }, [fileteredCountries,def]);

  React.useEffect(() => {
    start();
  }, [start]);


  const defval = React.useCallback(() => {
    setDef(props.defaultValue)
  }, [props.defaultValue]);

  React.useEffect(() => {
    defval();
  }, [defval]);



  return (
    <>
         <FormControl isInvalid={props.isInvalid} style={{ position: "unset",zIndex:1000 }} className={props.className}>
        <FormLabel>{props.label}</FormLabel>
        <InputGroup>
          <Input
            type="text"
            ref={inputRef}
            disabled={props.isDisabled}
            name={props.name ? props.name : "select"}
            onChange={onChange}
            onClick={Show}
            placeholder={props.placeholder ? props.placeholder : `Select`}
            style={{ borderColor: "rgb(189, 189, 189)", position: "unset" }}
            onKeyPress={onKeyPress}
          />
          <InputRightElement >
            {show ? (
              <IoMdArrowDropup
                onClick={() => setShow(!show)}
                className="text-[#777E91] text-[20px] cursor-pointer"
              />
            ) : (
              <IoMdArrowDropdown
                onClick={() => setShow(!show)}
                className="text-[#777E91] text-[20px] cursor-pointer"
              />
            )}
          </InputRightElement>
          {show && (
            <div className="absolute z-50 mt-2 top-full left-0 w-full bg-white rounded-lg shadow-md border border-gray-200 h-fit  max-h-[200px] overflow-y-scroll scroll-hide">
              {fileteredCountries.map((data, i) => (
                <div
                  key={i}
                  onClick={() => onCountryClick(data)}
                  className="flex items-center justify-between text-black px-4 py-2 border-b border-gray-200 cursor-pointer hover:bg-[#004D3D] hover:text-white  transition-all"
                >
                <div className="flex items-center">
                  <p className="text-[20px] country-flag ">{data.flag}</p>
                  <p className="ml-2 text-[14px]">{data.name}</p>
                </div>
                </div>
              ))}
            </div>
          )}
        </InputGroup>
        {props.isInvalid && <FormErrorMessage>{props.error}</FormErrorMessage>}
      </FormControl>
    </>
  );
}