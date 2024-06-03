import React, { useState } from "react";
import InputSearch from "../components/input/InputSearch";
import { AppContext } from "../context/Context";
import axios from "axios";
import { API_URL } from "../constants/data";
import { IoMdAdd } from "react-icons/io";
import Loading from "../components/loader/Loading";

export default function MyAccount() {
  
  const [load, setLoad ] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoad(false);
    }, 3000);
  
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
    {load && <Loading />}
    MyAccount
     </>
  );
}
