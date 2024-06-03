import React from "react";
import { HashLoader } from "react-spinners";

export default function Loading() {
  return (
    <>
      <div className="w-full h-screen fixed z-[10000] top-0 left-0 flex justify-center items-center bg-white opacity-35"></div>
      <div className="w-full h-screen fixed z-[10001] top-0 left-0 flex justify-center items-center ">
        <HashLoader color="#2563EB" size={50} />
      </div>
    </>
  );
}