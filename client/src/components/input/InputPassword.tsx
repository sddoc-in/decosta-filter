import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import React from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import focus from "../../functions/focus";
export default function InputPassword(props: {
  label: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
}) {
  const ref = React.useRef<HTMLInputElement>(null);

  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

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
      >
        <FormLabel>{props.label}</FormLabel>
        <InputGroup>
          <Input
            name={props.name}
            ref={ref}
            isRequired={props.isRequired || false}
            isDisabled={props.isDisabled || false}
            isInvalid={props.isInvalid || false}
            onChange={props.handleChange}
            onKeyPress={onKeyPress}
            pr="4.5rem"
            type={show ? "text" : "password"}
            placeholder={props.placeholder || `Enter ${props.label}`}
            style={{
              position: "unset",
            }}
          />
          <InputRightElement >
            {show ? (
              <AiFillEyeInvisible
                onClick={handleClick}
                className="text-[#777E91] text-[20px] cursor-pointer"
              />
            ) : (
              <AiFillEye
                onClick={handleClick}
                className="text-[#777E91] text-[20px] cursor-pointer"
              />
            )}
          </InputRightElement>
        </InputGroup>
        {props.isInvalid && <FormErrorMessage>{props.error}</FormErrorMessage>}
      </FormControl>
    </>
  );
}
