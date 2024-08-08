

/**
    * Convert {
    *   Name: "John",
    *   Age: 30
    * } to (Name, Age) values ('John', 30)
    */
function convertToInsertValues(obj: any) {
    let str = "(";
    let values = " values (";
    for (let key in obj) {
        str += key
        str += ", ";
        values += (typeof obj[key] === "string" ? `'${obj[key]}'` : obj[key])
        values += ", ";
    }
    str = str.slice(0, -2);
    values = values.slice(0, -2);
    str += ")";
    values += ")";
    return str + values;
}

export default convertToInsertValues;