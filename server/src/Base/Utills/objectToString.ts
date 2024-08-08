

/**
    * Convert {
    *   Name: "John",
    *   Age: 30
    * } to Name="John" and Age=30
    */
function objectToString(obj: any, operator: string = "and") {
    let str = "";

    for (let i = 0; i < Object.keys(obj).length; i++) {
        let key = Object.keys(obj)[i];
        let value = obj[key];
        if(obj[key] === undefined || obj[key] === null) continue;
        str += `${key}='${value}'`;
        if (i < Object.keys(obj).length - 1) {
            str += ` ${operator} `;
        } 
    }
    if(str === "") return "";
    return " WHERE  " + str;

}


export default objectToString;