import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import React from "react";
import focus from "../../functions/focus";

export default function FormInput(props: {
  label: string;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  type?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  isInvalid?: boolean;
  error?: string;
  defaultValue?: string;
  placeholder?: string;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  focus?:string
  onClick?: () => void;
  className?:string
}) {
  const ref = React.useRef<HTMLInputElement>(null);

  function onKeyPress(e: React.KeyboardEvent<HTMLInputElement>){
    if (props.onKeyPress) {
      props.onKeyPress(e);
    }
    if (e.key === "Enter") {
      focus(props.focus || "");
    }
  }

  React.useEffect(() => {
    if (props.defaultValue) {
      ref.current!.value = props.defaultValue;
    }
  }, [props.defaultValue]);


  return (
    <>
      <FormControl
        isInvalid={props.isInvalid}
        style={{
          position: "unset",
        }}
        className={(props.onClick ? "cursor-pointer text-blue-600 " : " ")
        + (props.className ? " " + props.className : "")
        }
        onClick={props.onClick}
      >
        <FormLabel>{props.label}</FormLabel>
        <Input
          name={props.name}
          ref={ref}
          className="disabled:!opacity-100 disabled:!cursor-default"
          type={props.type || "text"}
          isRequired={props.isRequired || false}
          isDisabled={props.isDisabled || false}
          isInvalid={props.isInvalid || false}
          onChange={props.handleChange}
          placeholder={props.placeholder || `Enter ${props.label}`}
          onKeyPress={onKeyPress}
          style={{
            position: "unset",
          }}
        />
        {props.isInvalid && <FormErrorMessage>{props.error}</FormErrorMessage>}
      </FormControl>
    </>
  );
}
