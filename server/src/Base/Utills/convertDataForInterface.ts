

/**
 * Convert data to interface
 * @param obj
 * 
 * example interface {
 *  Name: string;
 *  Age: number;
 * }
 * 
 * example data {
 *  NAME: "John",
 *  AGE: 30
 * }
 * 
 * returns {
 *  Name: "John",
 *  Age: 30
 * }
 */

function convertDataForInterface(obj: any | any[], intrfce: any) {
    let interfaceObj: any = {};


    if (obj === undefined || obj === null) return interfaceObj;
    if (!Array.isArray(obj)) {
        for (let key in intrfce) {
            let keyName = key.charAt(0).toUpperCase() + key.slice(1);
            interfaceObj[keyName] = obj[key.toUpperCase()];
        }
        return interfaceObj;
    }
    if(obj.length === 0) return [];
    else{
        let arr = [];
        for (let i = 0; i < obj.length; i++) {
            let interfaceObj: any = {};
            for (let key in intrfce) {
                let keyName = key.charAt(0).toUpperCase() + key.slice(1);
                interfaceObj[keyName] = obj[i][key.toUpperCase()];
            }
            arr.push(interfaceObj);
        }
        return arr;
    }

}


export default convertDataForInterface;