import React from "react";
import { Link } from "react-router-dom";
import { TiTick, TiTickOutline } from "react-icons/ti";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { ExcelContext } from "../../context/ExcelContext";

export default function TableComponent({
  head,
  body,
  link,
  hidden,
}: {
  head: string[];
  body: (string | number | boolean | undefined)[][];
  hidden?: number[];
  link?: {
    index: number;
    form: string;
    key: number;
  }[];
}) {
  const {
    selected,
    setSelected,
    setColumnsHidden,
    setHeader,
  } = React.useContext(ExcelContext);

  const setVal = React.useRef(() => {});

  setVal.current = () => {
    setColumnsHidden(hidden || []);
    setHeader(head);
  };

  function checkSelected(index: number) {
    return selected.includes(index) ? (
      <TiTick
        className="text-green-500 text-[1.3rem] cursor-pointer"
        onClick={() => handleSelect(index)}
      />
    ) : (
      <TiTickOutline
        className="text-green-500 text-[1.3rem] cursor-pointer"
        onClick={() => handleSelect(index)}
      />
    );
  }

  function handleSelect(index: number) {
    if (selected.includes(index)) {
      let idx = selected.filter((item: number) => item !== index);
      setSelected(idx);
    } else {
      setSelected([...selected, index]);
    }
  }

  function selectAll() {
    if (selected && selected.length === body.length) {
      setSelected([]);
    } else {
      setSelected(body.map((_, index) => index));
    }
  }

  React.useEffect(() => {
    setVal.current();
  }, []);

  return (
    <>
      <TableContainer className="max-h-[67vh] !overflow-y-auto new-scroll">
        <Table variant="simple" className="h-full">
          <Thead>
            <Tr>
              {selected && (
                <Th>
                  {selected.length === body.length ? (
                    <TiTick
                      className="text-green-500 text-[1.3rem] cursor-pointer"
                      onClick={selectAll}
                    />
                  ) : (
                    <TiTickOutline
                      className="text-green-500 text-[1.3rem] cursor-pointer"
                      onClick={selectAll}
                    />
                  )}
                </Th>
              )}
              {head.map((item, index) => (
                <Th key={index}>{item}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {body.length === 0 ? (
              <Tr>
                <Td colSpan={head.length} textAlign="center">
                  No data found
                </Td>
              </Tr>
            ) : (
              body.map((item, idx) => (
                <Tr key={idx}>
                  {selected && (
                    <Td onClick={() => handleSelect(idx)}>
                      {checkSelected(idx)}
                    </Td>
                  )}

                  {item.map((subItem, index) => {
                    if (hidden && hidden.includes(index)) return null;

                    let currItem =
                      link && link.find((item) => item.index === index);

                    if (currItem) {
                      
                        return (
                          <Td key={index}>
                            <Link
                              to={`/dashboard/${currItem.form}/${item[currItem.key]}`}
                              className="text-blue-500 hover:underline"
                            >
                              {subItem}
                            </Link>
                          </Td>
                        );
                      }
                    return <Td key={index}>{subItem}</Td>;
                  })}
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}
