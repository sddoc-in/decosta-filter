import React from "react";
import { SidebarData } from "../../../constants/Sidebar";
import { Link } from "react-router-dom";
import { AppContext } from "../../../context/Context";

export default function Sidebar() {
  const { user: CurrentUser } = React.useContext(AppContext);
  return (
    <>
      <div className="hidden lg:block md:w-[40%] lg:w-[25%] absolute top-0 left-0 bg-[#002F53] h-full z-10">
        <div className=" z-40 relative">
          <h1 className="p-7 pb-5">
            <span className="text-white text-[30px] font-[900]">Facebook</span>
            {/* <span className="text-[#FFC107] text-[30px] font-[900]">
              Task
            </span> */}
          </h1>
          <div className="mt-6 pl-4">
            {SidebarData.map((item, index) => {
              if (!item.role.includes(CurrentUser.role)) return null;
              const highlight =
                item.shortPath.toLowerCase() ===
                "/" + window.location.pathname.split("/").pop();
              return (
                <div
                  key={index}
                  className={`w-full my-2 px-2 py-3 rounded-lg ${
                    highlight ? "bg-white " : "bg-transparent"
                  }`}
                >
                  <Link to={item.path} className="flex items-center">
                    {item.Icon && (
                      <item.Icon
                        className={`text-[20px] mr-3 ${
                          highlight ? "text-[#002F53]" : "text-white"
                        }`}
                      />
                    )}
                    <p
                      className={`font-bold text-[16px] ${
                        highlight ? "text-[#002F53]" : "text-white"
                      }`}
                    >
                      {item.title}
                    </p>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
