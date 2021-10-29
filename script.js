const request=require("request");
const cheerio=require("cheerio");
const xlsx=require("xlsx");
const fs=require("fs");
const path=require("path");
const AllMatchObj=require("./allMatchLinks");
let IplPath=path.join(__dirname,"IPL"); //to create the folder named IPL in which all the teams folder will be present
request("https://www.espncricinfo.com/series/ipl-2020-21-1210595",callBack);

createDirectory(IplPath);  //created the directory/folder for IPL

function callBack(error,response,body)
{
    if(!error)
    {
        extractHTML(body);
    }
}

function extractHTML(body)
{
    const $=cheerio.load(body);
    const MatchesResultPage=("https://www.espncricinfo.com"+$(".widget-items.cta-link a").attr("href"));
    AllMatchObj.GetAllLink(MatchesResultPage);
}

function createDirectory(filePath)
{
    if(fs.existsSync(filePath)==false)
    {
        fs.mkdirSync(filePath);    //means agar IPL ka folder nahi hai toh banado ek folder/directory
    }
}