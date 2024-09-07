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
import { SelectArray } from "../../interface/SelectArray"
import focus from "../../functions/focus";


type Props = {
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
  focus?: string;
  selectArray: SelectArray[];
  className?: string;
}

export default function InputSelect(props:Props ) {
  const [show, setShow] = React.useState(false);
  const [fileteredCountries, setFilteredCountries] = React.useState(
    props.selectArray
  );
  const [def,setDef] = React.useState(props.defaultValue)

  const inputRef = React.useRef<HTMLInputElement>(null);

  function Show() {
    if (!props.isDisabled) {
      setShow(!show);
    }
  }

  
  function onKeyPress(e: React.KeyboardEvent<HTMLInputElement>){
    if (props.onKeyPress) {
      props.onKeyPress(e);
    }
    if (e.key === "Enter") {
      focus(props.focus || "");
    }
  }


  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setShow(true);
    let filtered = props.selectArray!.filter((data) => {
      return data.name.toLowerCase().includes(e.target.value.toLowerCase());
    });
    if (filtered.length === 0) {
      filtered = props.selectArray!.filter((data) => {
        return data.value!.toLowerCase().includes(e.target.value.toLowerCase());
      });
    }
    setFilteredCountries(filtered);
  }

  function onCountryClick(data: any) {
    inputRef.current!.value = data.name;
    setShow(false);
    if (props.handleChange) {
      props.handleChange(props.name, data.value);
    }
    setFilteredCountries(props.selectArray || []);
  }

  const start = React.useCallback(() => {
    setFilteredCountries(props.selectArray);
    let newDef = props.selectArray.find(
      (data) => data.value === def
    );
    if (newDef) {
      inputRef.current!.value = newDef.name;
    }
  }, [props.selectArray,def]);

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
      <FormControl isInvalid={props.isInvalid} className={props.className}>
        <FormLabel>{props.label}</FormLabel>
        <div className="relative">
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
          </InputGroup>
          {show && (
            <div className="absolute !z-50 mt-2 top-full left-0 w-full bg-white rounded-lg shadow-md border border-gray-200 h-fit  max-h-[200px] overflow-y-scroll scroll-hide">
              {fileteredCountries.map((data, i) => (
                <div
                  key={i}
                  onClick={() => onCountryClick(data)}
                  className="flex items-center justify-between text-black px-4 py-2 border-b border-gray-200 cursor-pointer hover:bg-[#004D3D] hover:text-white  transition-all"
                >
                  <p className="text-[16px]  country-flag ">{data.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        {props.isInvalid && <FormErrorMessage>{props.error}</FormErrorMessage>}
      </FormControl>
    </>
  );
}
