

import React from "react";
import { IconType } from "react-icons";


export default interface FormTopBarInterface {
    name: string;
    Icon? : IconType;
    Object?:JSX.Element | null | (() => void) | string; 
}