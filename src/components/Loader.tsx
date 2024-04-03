import React, { CSSProperties } from "react";
import ScaleLoader from "react-spinners/ScaleLoader";
import { MainContext } from "../context/Context";

const override: CSSProperties = {
  display: "block",
  margin: " 20px auto",
  borderColor: "#ffd416",
  // position: "absolute",
  // top: "50%",
  // left: "50%",
  // transform: "translate(-50%,-50%)",
};
export default function Loader({
  adsFetched,
}: {
  adsFetched: number;
}) {
  const {setLoopBreaker} = React.useContext(MainContext)
  return (
    <div className="w-[100%] h-[100vh] bg-[#000000] flex justify-center items-center bg-opacity-50 z-50 fixed top-0 left-0">
      <div className="w-[30%] h-auto p-4 bg-white text-center  ">
        <h1 className="text-center text-2xl font-bold">
          Processed Ads : {adsFetched}
        </h1>
        <ScaleLoader color={"#36d7b7"} cssOverride={override} />

        {/* <button className="btn btn-secondary" onClick={() => setLoopBreaker(true)}>
          Cancel
        </button> */}
      </div>
    </div>
  );
}
