import React from "react";
import { TiTick, TiTickOutline } from "react-icons/ti";
import FilterOpener from "./FilterOpener";
import { HiddenColumns } from "./HiddenColumns";
import { ExcelContext } from "../context/ExcelContext";
import { AppContext } from "../context/Context";
import { PRICE, RATING, TOTAL_REVIEW } from "../constants/data";

export default function ExcelComponent() {
  const {
    header,
    setHeader,
    selected,
    setSelected,
    columnsHidden,
    setColumnsHidden,
    likesRange,
    reachRange,
    fileData,
    setFileData,
    mainData,
  } = React.useContext(ExcelContext);

  const { setLoading } = React.useContext(AppContext);

  const [data, setData] = React.useState<any>(fileData || []);
  const [search, setSearch] = React.useState<string>("");
  const [filterType, setFilterType] = React.useState<string>("begins with");

  const [isChanging, setIsChanging] = React.useState<any>({
    status: false,
    header: false,
    rowIndex: null,
    columnIndex: null,
    value: "",
  });

  const [filterRecord, setFilterRecord] = React.useState<any>([]);

  React.useEffect(() => {
    if (data) {
      setSelected(data);
    }
  }, [data]);

  function filterData(where: number) {
    setLoading(true);
    let newData = data;
    if (search !== "") {
      newData = data.filter((item: any, index: number) => {
        if (filterType === "begins with")
          return item[where]
            .toString()
            .toLowerCase()
            .startsWith(search.toLowerCase());
        if (filterType === "ends with")
          return item[where]
            .toString()
            .toLowerCase()
            .endsWith(search.toLowerCase());
        if (filterType === "contains")
          return item[where]
            .toString()
            .toLowerCase()
            .includes(search.toLowerCase());
        if (filterType === "does not contain")
          return !item[where]
            .toString()
            .toLowerCase()
            .includes(search.toLowerCase());
        if (filterType === "equals")
          return item[where].toString().toLowerCase() === search.toLowerCase();
        if (filterType === "does not equal")
          return item[where].toString().toLowerCase() !== search.toLowerCase();
        if (filterType === "is not")
          return item[where].toString().toLowerCase() !== search.toLowerCase();
        if (filterType === "matches regex")
          return item[where].toString().toLowerCase().match(search);
        if (filterType === "does not match regex")
          return !item[where].toString().toLowerCase().match(search);
        if (filterType === "matches")
          return item[where]
            .toString()
            .toLowerCase()
            .match(search.toLowerCase());
        return item[where]
          .toString()
          .toLowerCase()
          .startsWith(search.toLowerCase());
      });
    }
    // sorting array of arrays
    if (filterType === "Ascending") {
      newData.sort(function (a: any, b: any) {
        if (where === RATING || where === PRICE || where === TOTAL_REVIEW) {
          const priceA = parseFloat(a[where]);
          const priceB = parseFloat(b[where]);
          return priceA - priceB;
        } else {
          const priceA = a[where].toLowerCase();
          const priceB = b[where].toLowerCase();
          return priceA.localeCompare(priceB);
        }
      });
    }
    if (filterType === "Descending") {
      newData.sort(function (a: any, b: any) {
        if (where === RATING || where === PRICE || where === TOTAL_REVIEW) {
          const priceA = parseFloat(a[where]);
          const priceB = parseFloat(b[where]);
          return priceB - priceA;
        } else {
          const priceA = a[where].toLowerCase();
          const priceB = b[where].toLowerCase();
          return priceB.localeCompare(priceA);
        }
      });
    }
    setFilterRecord([...filterRecord, { where: newData }]);
    setData(newData);
    setSearch("");
    setLoading(false);
  }

  function hideColumn(index: number) {
    setColumnsHidden([...columnsHidden, index]);
  }
  function clear() {
    setSearch("");
    setData(fileData);
  }
  function selectItem(item: any) {
    if (selected.includes(item)) {
      const unselect = selected.filter((row: any) => {
        return row !== item;
      });
      setSelected(unselect);
      return;
    }
    const newData = [...selected, item];
    setSelected(newData);
  }

  function selectAll() {
    if (selected.length === data.length) {
      setSelected([]);
    } else {
      setSelected(data);
    }
  }

  function changeCell() {
    const newData = [...data];
    newData[isChanging.rowIndex][isChanging.columnIndex] = isChanging.value;
    setData(newData);
    setIsChanging({
      status: false,
      header: false,
      rowIndex: null,
      columnIndex: null,
      value: "",
    });
  }
  function changeHeaderCell() {
    const newData = [...header];
    newData[isChanging.columnIndex] = isChanging.value;
    setHeader(newData);
    setIsChanging({
      status: false,
      header: false,
      rowIndex: null,
      columnIndex: null,
      value: "",
    });
  }

  const rangeFilter = React.useMemo(() => {
    return (where: number, range: number[]) => {
      console.log("rangeFilter", where, range);
      setLoading(true);
      let newData = mainData;
      newData = newData.filter((item: any, index: number) => {
        if (range[0] === 0 && range[1] === 0) return true;
        if (parseInt(item[where]) >= range[0] && parseInt(item[where]) <= range[1]) {
          return true;
        }
        return false;
      });
      console.log("newData", newData);
      setFileData(newData);
      setLoading(false);
    }
  }, [fileData]);

  React.useEffect(() => {
    setData(fileData);
  }, [fileData]);

  React.useEffect(() => {
    rangeFilter(2, likesRange);
  }, [likesRange]);

  React.useEffect(() => {
    rangeFilter(12, reachRange);
  }, [reachRange]);

  const classes = " w-[99%] h-[55vh] mx-auto";
  return (
    <>
      <div
        id="scroll-hide"
        className={` overflow-scroll shadow-lg ${classes}`}
      >
        <div className="flex justify-start items-start ">
          <div>
            <div style={{ position: 'sticky', top: 0, zIndex:5}} className="flex text-start justify-start items-center w-fit text-black mx-auto py-1 border-b-[1px] border-[#bebbb8] bg-blue-300">
              <TiTick
                onClick={selectAll}
                className="text-green-500 text-[20px] mx-2 cursor-pointer"
              />
              {header && header.map((item: any, index: number) => {
                return (
                  <div key={index}>
                    {!(
                      isChanging.status &&
                      isChanging.columnIndex === index &&
                      isChanging.header
                    ) ? (
                      <div
                        className={`dropdown ${columnsHidden.includes(index) ? "hidden" : "block"
                          }`}
                      >
                        <label
                          tabIndex={index}
                          className=" mx-2 w-[250px] block cursor-pointer overflow-hidden"
                        >
                          {item.length > 20 ? item.slice(0, 20) + "..." : item}
                        </label>
                        <FilterOpener
                          value={item}
                          index={index}
                          filterData={filterData}
                          clear={clear}
                          search={search}
                          filterType={filterType}
                          setFilterType={setFilterType}
                          hideColumn={hideColumn}
                          setSearch={setSearch}
                          isChanging={isChanging}
                          setIsChanging={setIsChanging}
                        />
                      </div>
                    ) : (
                      <input
                        autoFocus
                        type="text"
                        className="w-[250px] mx-2 border-2 px-2 border-green-900 focus:outline-none"
                        defaultValue={item}
                        onChange={(e) =>
                          setIsChanging({
                            ...isChanging,
                            value: e.target.value,
                          })
                        }
                        onClick={changeHeaderCell}
                      />
                    )}
                  </div>
                );
              })}
            </div>
            {data && data.map((item: any, rowIndex: number) => {
              const flag = selected.includes(item);
              return (
                <div
                  key={rowIndex}
                  className={`w-full border-b-[1px] border-[#bebbb8] hover:bg-blue-100 ${flag ? "bg-blue-200" : "bg-blue-0"}`}
                >
                  <div className="flex text-start justify-start items-center">
                    {!flag ? (
                      <TiTickOutline
                        onClick={() => selectItem(item)}
                        className="text-green-500 text-[20px] mx-2 cursor-pointer"
                      />
                    ) : (
                      <TiTick
                        onClick={() => selectItem(item)}
                        className="text-green-500 text-[20px] mx-2 cursor-pointer"
                      />
                    )}
                    {item && item.map((value: any, columnIndex: number) => {
                      return (
                        <div
                          key={columnIndex}
                          className={`dropdown mx-2 w-[250px] overflow-hidden ${columnsHidden.includes(columnIndex) ? "hidden" : "block"
                            }`}
                        >
                          {!(
                            isChanging.status &&
                            isChanging.columnIndex === columnIndex &&
                            isChanging.rowIndex === rowIndex
                          ) ? (
                            <label
                              tabIndex={columnIndex}
                              onClick={() =>
                                setIsChanging({
                                  status: true,
                                  header: false,
                                  rowIndex: rowIndex,
                                  columnIndex: columnIndex,
                                  value: value,
                                })
                              }
                              className="block cursor-pointer w-full border-green-900 hover:outline-none overflow-hidden"
                            >
                              {value && value.length > 20
                                ? value.slice(0, 20) + "..."
                                : value}
                            </label>
                          ) : (
                            <input
                              autoFocus
                              type="text"
                              className="w-[250px] mx-2 px-2 border-2 border-green-900 bg-transparent focus:outline-none"
                              defaultValue={value}
                              onChange={(e) =>
                                setIsChanging({
                                  ...isChanging,
                                  value: e.target.value,
                                })
                              }
                              onClick={changeCell}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
