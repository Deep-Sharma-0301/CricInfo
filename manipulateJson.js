const fs=require("fs");
const xlsx=require("xlsx");
let buffer=fs.readFileSync("./example.json");
// // console.log(buffer);

let data=JSON.parse(buffer);
// //we can just do 
// let data=require("./example.json");
// // console.log(data);
// data.push({
//     "name":"Dad",
//     "last-name":"Sharma",
//     "phone":9990999483,
//     "address":
//         {
//     "city":"Delhi",
//     "landMark":"west-azad-nagr"
// }
// });
// data=JSON.stringify(data);

// fs.readFileSync("example.json",data);

//*********  to create and write in an Excel File ************/
function excelWriter(filePath,SheetName,JsonData)
{
    let newWB=xlsx.utils.book_new();
    let newWS=xlsx.utils.json_to_sheet(JsonData);
    xlsx.utils.book_append_sheet(newWB,newWS,SheetName);
    xlsx.writeFile(newWB,filePath);
}


/*********** To read from a excel file *********/
function excelReader(filePath,SheetName)
{
    if(fs.existsSync(filePath)) //to check whether the excel file even exists or not?
    {
        return null;
    }
    let wb=xlsx.readFile(filePath);
    let ws=wb.Sheets[SheetName];
    let excelData=xlsx.utils.sheet_to_json(ws);
    return excelData;
}
