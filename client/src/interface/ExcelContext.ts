interface ExcelContextInterface {
    fileChoser: (e: any) => void;
    onlineFileChoser: (file: any) => void;
    fileData: any;
    setFileData: React.Dispatch<React.SetStateAction<any>>;
    mainData: any;
    setMainData: React.Dispatch<React.SetStateAction<any>>;
    header: any;
    setHeader: React.Dispatch<React.SetStateAction<any>>;
    selected: any[];
    setSelected: React.Dispatch<React.SetStateAction<any[]>>;
    downloadAsExcel:(selectedData?:any,columnsHiddenData?:any,headerData?:any) => void;
    downloadAsCsv: (selectedData?:any,columnsHiddenData?:any,headerData?:any) => void;
    columnsHidden: number[];
    setColumnsHidden: React.Dispatch<React.SetStateAction<number[]>>;
    url: string;
    setUrl: React.Dispatch<React.SetStateAction<string>>;
    likesRange: number[];
    setLikesRange: React.Dispatch<React.SetStateAction<number[]>>;
    reachRange: number[];
    setReachRange: React.Dispatch<React.SetStateAction<number[]>>;
    changeFileData: (data: any) => void;
    clearAll: () => void;
}

export default ExcelContextInterface;