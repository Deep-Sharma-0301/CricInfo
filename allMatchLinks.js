const request=require("request");
const cheerio=require("cheerio");
const ScorecardObj=require("./scorecard");
function GetAllMatchesLink(MatchesResultPage)
{
    request(MatchesResultPage,function(err,response,HTML)
    {
        if(!err)
        {
            extractSingleMatchLink(HTML)
        }
    });
}

function extractSingleMatchLink(HTML)
{
    const $=cheerio.load(HTML);
    let scoreCardElement=$("a[data-hover='Scorecard']");
    for (let i=0;i<scoreCardElement.length;i++)
    {
        let scoreCardLink=("https://www.espncricinfo.com"+$(scoreCardElement[i]).attr("href"));
        ScorecardObj.PS(scoreCardLink);
   }
}

module.exports=
{
    GetAllLink : GetAllMatchesLink  //isme pehle jo likha hai vo jaha hum is file ko import kar rahe hai waha as it is hona chahiye aur jo : ke baad likha hai vo function is file me hona chie toh jab firs wala call call hoga kisi aur file me toh ye second wala chalega is file me
}