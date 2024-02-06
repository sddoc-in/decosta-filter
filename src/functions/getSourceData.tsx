

function getSourceData(data1:any) {

    let arr: any = [];

    for (let i = 0; i < data1.length; i++) {
        let obj: any = [];
        
        // Name
        obj.push(data1[i].name);
  
        // ID
        obj.push(data1[i].id);
  
        // Reach
        obj.push(data1[i].reach);
  
        // Start Date
        obj.push(data1[i].date_start);
  
        // End Date
        obj.push(data1[i].date_stop);
  
        // Status
        obj.push(data1[i].effective_status);
  
        // Creative Id
        obj.push(data1[i].creativeID);
  
        // Creative Date Time
        obj.push(new Date(data1[i].created_time).toLocaleString());
  
        // Updated Date Time
        obj.push(new Date(data1[i].updated_time).toLocaleString());
  
        // Ad Active Time
        obj.push(data1[i].ad_active_time);
  
        // Source Id
        obj.push(data1[i].source_ID);
  
        // IFrame
        obj.push(data1[i].Iframe);
  
        arr.push(obj);
      }

      return arr;
}


export default getSourceData;