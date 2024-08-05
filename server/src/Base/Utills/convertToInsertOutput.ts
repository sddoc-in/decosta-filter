

/**
    * Convert {
    *   Name: "John",
    *   Age: 30
    * } to (Name, Age) values ('John', 30)
    */
function convertToInsertOuput(obj: any,columns: string[]) {
    let outPutColumns = " OUTPUT ";
    let str = "(";
    let values = " values (";
    for (let key in obj) {
        str += key
        str += ", ";
        values += (typeof obj[key] === "string" ? `'${obj[key]}'` : obj[key])
        values += ", ";
    }
    for(let i = 0; i < columns.length; i++){
        outPutColumns += "Inserted.";
        outPutColumns += columns[i] + ", ";
    }
    outPutColumns = outPutColumns.slice(0, -2);
    str = str.slice(0, -2);
    values = values.slice(0, -2);
    str += ")";
    values += ")";
    return  str + outPutColumns  + values;
    
}

export default convertToInsertOuput;