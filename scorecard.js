//const URL="https://www.espncricinfo.com/series/ipl-2020-21-1210595/mumbai-indians-vs-sunrisers-hyderabad-17th-match-1216538/full-scorecard";
const request=require("request");
const cheerio=require("cheerio");
const fs=require("fs");
const path=require("path");
const xlsx=require("xlsx");

function processScoreCard(URL)
{
    request(URL,cb);
}

function cb(err,response,body)
{
    if(!err)
    {
        extractScorecardDetails(body);
    }
}
function extractScorecardDetails(body)
{
    // ipl ka folder hoga
    // us ipl ke folder me har team ka ek folder hoga
    // teams ke files me player ka folder hogi
    // player ki file me venue opponent date result runs balls fours sixes strikeRate honge 
    //sabse pehle hu vo cheeze lenge jo dono teams ke players ke liye same hongi like result venue date
    const $=cheerio.load(body);
    let headerDescp=$(".header-info .description").text();
    headerDescp=headerDescp.split(",");
    let date=headerDescp[2];
    date=date.trim();
    let venue=headerDescp[1];
    venue=venue.trim();  //trim function se aage peeche ke white spaces remove ho jaate hai
    // console.log(date);
    // console.log(venue);
    let result=$(".match-info.match-info-MATCH.match-info-MATCH-half-width .status-text span").text();
    // console.log(result);
    let scoreCardElement=$(".card.content-block.match-scorecard-table .Collapsible");
    // let HTMLSTR="";
    for(let i=0;i<scoreCardElement.length;i++)
     {
    //     HTMLSTR+=$(scoreCardElement[i]).html(); //agar hum add nahi karte htmlstr me toh hum ek baar me ek string bhi le sakte hai 
    let TeamName=$(scoreCardElement[i]).find(".header-title.label").text();
    TeamName=TeamName.split("INNINGS");
    TeamName=TeamName[0].trim();
    let opponentIndex=i==1?0:1;
    let opponentName=$(scoreCardElement[opponentIndex]).find(".header-title.label").text();
    opponentName=opponentName.split("INNINGS");
    opponentName=opponentName[0].trim();
    console.log("Venue : "+venue+" , Team Name : "+TeamName+" , Opponent Name : "+opponentName+" , Result : "+result);
    let currentInnings=$(scoreCardElement[i]);
    let allRows=currentInnings.find(".table.batsman tbody tr");
    for (let j=0;j<allRows.length;j++)
    {
       let allCols=$(allRows[j]).find("td"); //having the data of each row
       let isWorthy=$(allCols[0]).hasClass("batsman-cell");  //to check whther the row is of player data or of commentory
       if(isWorthy==true)  //this means that row is of player data
       {
           let playerName=$(allCols[0]).text().trim();
           playerName=playerName.split("(");
           let runs= $(allCols[2]).text().trim(); 
           let balls= $(allCols[3]).text().trim(); 
           let fours=$(allCols[5]).text().trim();
           let sixes=$(allCols[6]).text().trim();
           let SR=$(allCols[7]).text().trim();
           console.log(playerName[0]);
           console.log("RUNS : "+runs);
           console.log("Balls : "+balls);
           console.log("Fours : "+fours);
           console.log("Sixes : "+sixes);
           console.log("Strike Rate : "+SR);
           processPlayer(TeamName,playerName,result,venue,date,runs,balls,fours,sixes,SR);//this function will help us to manage ki kaunsa player kis team ke folder me jaega
       }
    }
}
}

function processPlayer(TeamName,playerName,result,venue,date,runs,balls,fours,sixes,SR)
{
    let teamPath=path.join(__dirname,"IPL",TeamName);
    createDirectory(teamPath);
    // let filePath=path.join(TeamName,playerName);
    let filePath=path.join(teamPath,playerName+".xlsx");
    let content=excelReader(filePath,playerName);
    let playerObj={
        TeamName,
        playerName,
        result,
        venue,
        date,
        runs,
        balls,
        fours,
        sixes,
        SR
    };
    content.push(playerObj);
    excelWriter(filePath,playerName,content);
}
function createDirectory(filePath)
{
    if(fs.existsSync(filePath)==false)
    {
        fs.mkdirSync(filePath);    //means agar IPL ka folder nahi hai toh banado ek folder/directory
    }
}
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
    if(fs.existsSync(filePath)==false) //to check whether the excel file even exists or not?
    {
        return [];
    }
    let wb=xlsx.readFile(filePath);
    let ws=wb.Sheets[SheetName];
    let excelData=xlsx.utils.sheet_to_json(ws);
    return excelData;
}

module.exports=
{
    PS:processScoreCard
}