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
import { SelectArray } from "../../interface/SelectArray";
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

export default function InputMultiSelect(props: Props) {
  const [show, setShow] = React.useState(false);
  const [fileteredCountries, setFilteredCountries] = React.useState(
    props.selectArray || []
  );
  const [selectedName, setSelectedName] = React.useState<any>([]);
  const [selectedValue, setSelectedValue] = React.useState<any>([]);

  const inputRef = React.useRef<HTMLInputElement>(null);

  function Show() {
    if (!props.isDisabled) {
      setShow(!show);
    }
  }
  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setShow(true);

    // select values seprated by comma on input
    let selectedInput = e.target.value.split(", ");
    let selectedName = selectedInput.filter((data) => {
      return props.selectArray!.some(
        (data2) => data2.name.toLowerCase() === data.toLowerCase()
      );
    });
    setSelectedName(selectedName);

    let selectedValue = selectedInput.filter((data) => {
      return props.selectArray!.some((data2) => data2.value === data);
    });
    setSelectedValue(selectedValue);

    // filter based on last selected name on input seprated by comma
    let len = selectedInput.length;
    let lastSelected = len > 0 ? selectedInput[len - 1] : "";

    let filtered = props.selectArray!.filter((data) => {
      return data.name.toLowerCase().includes(lastSelected.toLowerCase());
    });
    if (filtered.length === 0) {
      filtered = props.selectArray!.filter((data) => {
        return data.value!.toLowerCase().includes(lastSelected.toLowerCase());
      });
    }
    setFilteredCountries(filtered);
  }

  function onCountryClick(data: any) {
    if (selectedName.includes(data.name)) {
      let index = selectedName.indexOf(data.name);
      selectedName.splice(index, 1);
      setSelectedName([...selectedName]);

      let index2 = selectedValue.indexOf(data.value);
      selectedValue.splice(index2, 1);
      setSelectedValue([...selectedValue]);

      inputRef.current!.value = selectedName.join(", ");
    } else {
      setSelectedName([...selectedName, data.name]);
      setSelectedValue([...selectedValue, data.value]);
      inputRef.current!.value = [...selectedName, data.name].join(", ");
    }

    // setShow(false);
    if (props.handleChange) {
      props.handleChange(props.name, [...selectedValue, data.value].join(","));
    }
    setFilteredCountries(props.selectArray || []);
  }


  function onKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (props.onKeyPress) {
      props.onKeyPress(e);
    }
    if (e.key === "Enter") {
      focus(props.focus || "");
    }
  }

  React.useEffect(() => {
    let defLan =
      props.selectArray !== undefined
        ? props.selectArray.filter((item) => {
          return props.defaultValue?.toString().toLowerCase().split(",").includes(item.value);
        })
        : [{ name: "", value: "" }];

    let newdefLan = defLan.map((item) => item.name);

    inputRef.current!.value = newdefLan.join(",") || "";
  }, [props.defaultValue]);

  React.useEffect(() => {
    setFilteredCountries(props.selectArray || []);
  }, [props.selectArray]);

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
              {fileteredCountries.map((data, i) => {
                let selected =
                  selectedName.filter(
                    (data2: any) =>
                      data2.toLowerCase() === data.name.toLowerCase()
                  ).length > 0;
                return (
                  <div
                    key={i}
                    onClick={() => onCountryClick(data)}
                    className={`flex items-center justify-between text-black px-4 py-2 border-b border-gray-200 cursor-pointer hover:bg-[#004D3D] hover:text-[white!important]  transition-all ${selected ? "bg-[#004D3D] text-[white!important]" : ""
                      }`}
                  >
                    <p className="text-[16px]  country-flag ">{data.name}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {props.isInvalid && <FormErrorMessage>{props.error}</FormErrorMessage>}
      </FormControl>


    </>
  );
}
