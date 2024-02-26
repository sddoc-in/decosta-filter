import React, { useEffect, useState } from 'react'
import { ExcelContext } from '../context/ExcelContext'
import ExcelComponent from '../excel-component/ExcelComponent'
import { MainContext } from '../context/Context'

import { BsFiletypeCsv } from "react-icons/bs";
import { AiOutlineFileExcel } from "react-icons/ai";
import { MainJSON } from '../constant/data'
import getDuplicateData from '../functions/getDuplicateData'
import getSourceData from '../functions/getSourceData'
import axios from 'axios';
import { DynamicApidata } from './ApiData';
import Searchbar from '../functions/Searchbar';
import PageFB from '../functions/PageFB';
export default function Main() {
    const [ApiDataResponse, setApiDataResponse] = useState([])
    const { setTheme, theme, currentFrame, setCurrentFrame } = React.useContext(MainContext)
    const { downloadAsCsv, downloadAsExcel, setFileData, setHeader, header } = React.useContext(ExcelContext)


    function changeTheme() {
        if (theme === 'light') {
            setTheme('dark')
        }
        else {
            setTheme('light')
        }
    }


    async function ABCD() {
        const headers = [
            "Name",
            "ID",
            "Reach",
            "Start Date",
            "Stop Date",
            "Days Running",
            "Status",
            "Creative Id",
            "Creative Date Time",
            "Updated Date Time",
            "Ad Active Time",
            "Source Id",
            "IFrame"
        ]

        try{
            const response = await axios.get('https://decosta.onrender.com/ads?rows=200')
            const data = response.data;
            // if (data) {
            let arr: any = [...getDuplicateData(data.duplicate_ads), ...getSourceData(data.source_add)];
            setHeader(headers)
            setFileData(arr)
        } catch (error) {
            let arr: any = [...getDuplicateData(MainJSON.duplicate_ads), ...getSourceData(MainJSON.source_add)];

            setHeader(headers)
            setFileData(arr)
        }
    }




    async function GetaData(params: any) {

        try {
            const recieveData = await DynamicApidata(params);
            console.log(recieveData, 'recieveData');
            if (recieveData.data.results) {
                const newSetData = recieveData.data.results.map((item: any, index: any) => {
                    setApiDataResponse(item)
                })
                return newSetData;
            }
        } catch (error) {


        }

    }

    React.useEffect(() => {
        if (ApiDataResponse) {
            GetaData()
        }
    }, []);
console.log(ApiDataResponse,"jhdfgdf")
    React.useEffect(() => {
        ABCD()
    }, []);



    return (
        <>
       
       <div className=''> <Searchbar/>
            <div className='w-[100%] min-h-[100vh] flex justify-center items-center' style={
                theme === 'light' ? {
                    background: '#fff!important',
                    color: '#000!important'
                } : {
                    background: '#000!important',
                    color: '#fff!important'
                }
            }>
                <div className='absolute top-1 left-1'>
                    <label className="swap swap-rotate">

                        <input type="checkbox" className="theme-controller" onClick={changeTheme} />

                        {/* sun icon */}
                        <svg className="swap-on fill-current w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" /></svg>

                        {/* moon icon */}
                        <svg className="swap-off fill-current w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" /></svg>

                    </label>
                </div>
                {

                    <div style={{
                        overflow: 'hidden'
                    }}>
                        <div className="absolute right-0 top-2 flex items-center">
                            <BsFiletypeCsv
                                onClick={downloadAsCsv}
                                className="text-[#000] text-[20px] mx-2 cursor-pointer"
                            />
                            <AiOutlineFileExcel
                                onClick={downloadAsExcel}
                                className="text-[#000] text-[20px] mx-2 cursor-pointer"
                            />
                        </div>
                        <div className='my-1'></div>
                        {
                            header.length > 0 &&
                            <ExcelComponent />
                        }
                    </div>
                }
            </div >
            </div>
            <PageFB/>


            {
                currentFrame !== '' &&
                <>
                    <div className='w-full h-[100vh] absolute z-20 top-0 left-0 flex justify-center items-center'>
                        <div className="w-full h-full backdrop-blur-sm absolute z-20"></div>
                        <p
                            className="right-2 top-3 absolute text-[30px] text-black cursor-pointer z-30"
                            onClick={() => setCurrentFrame('')}
                        >X</p>
                        <div className='h-[600px] z-40' dangerouslySetInnerHTML={{__html: currentFrame
                        }}>
                        </div>
                    </div>
                </>
            }
        </>

    )
}