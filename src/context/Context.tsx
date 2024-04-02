import React from "react";
import HappyClientMainContextInterface, {
  FileDetails,
} from "../interface/Context";
import Loader from "../components/Loader";

export const MainContext = React.createContext<HappyClientMainContextInterface>(
  {} as HappyClientMainContextInterface
);

export interface allProductsInterface {
  product: string;
  page: number;
}

export default function ContextProvider({ children }: any) {
  const [theme, setTheme] = React.useState<string>("light");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [currentProduct, setCurrentProduct] = React.useState<string>("");
  const [allProducts, setAllProducts] = React.useState<allProductsInterface[]>(
    []
  );
  const [currentRequest, setCurrentRequest] = React.useState<number>(0);
  const [loopBreaker, setLoopBreaker] = React.useState<boolean>(false);
  const [state, setState] = React.useState<number>(0);
  const [maxState, setMaxState] = React.useState<number>(0);
  const [apiParams, setApiParams] = React.useState<any>({
    country:"NL",
    content_languages:"en",
    filtterStart_date:new Date(),
    filtterEnd_date:new Date(),
    querry:"",
    ad_status_type:"all",
    ad_type:"all",
    media_type:"all",
    publisher_platforms:"all",
    Nextforward_cursor:"",
    Nextbackward_cursor:"",
    Nextcollation_token:"",
  })

  const [filterParams, setFilterParams] = React.useState<any>({
    minMaxLikes: [0, 0],
    minMaxComments: [0, 0],
    minMaxShares: [0, 0],
    minMaxViews: [0, 0],
    minMaxReach: [0, 0],
    minDaysActive: 0,
  })

  const [dupes, setDupes] = React.useState<string[]>([])



  function CancelRequests(){
    // setLoopBreaker(true)
    // setLoading(false)
    // setCurrentRequest(0)
    // setState(1)
    // console.log("Cancel Request")
  }

  const themeObj = theme === "light" ? "light" : "dark";
  const oppositeObj = theme !== "light" ? "light" : "dark";

  return (
    <MainContext.Provider
      value={{
        theme,
        setTheme,
        loading,
        setLoading,
        themeObj,
        currentPage,
        setCurrentPage,
        currentProduct,
        setCurrentProduct,
        oppositeObj,
        allProducts,
        setAllProducts,
        currentRequest,
        setCurrentRequest,
        CancelRequests,
        loopBreaker,
        setLoopBreaker,
        state,
        setState,
        maxState,
        setMaxState,
        dupes,
        setDupes,
        apiParams,
        setApiParams,
        filterParams,
        setFilterParams
      }}
    >
      {children}
      {loading && <Loader />}
    </MainContext.Provider>
  );
}
