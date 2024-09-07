import React from "react";

interface Props {
  label: string;
  value: string;
  classes?: string;
}

export default function FlexContent(props: Props) {
  return (
    <>
      <div className={"flex justify-between items-center md:flex-row flex-col md:w-1/2 w-11/12 "+props.classes}>
        <p className="font-light text-start text-black">{props.label} </p>{" "}
        <p className="font-light text-start text-black ">{props.value}</p>
      </div>
    </>
  );
}
