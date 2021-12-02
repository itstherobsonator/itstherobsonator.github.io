var game_id;
var currentUrlTemp;
var allData;
var game_id=window.prompt("What is the game id that you are looking to extract data from?",'');



var WebsiteDatabaseTeamMapping=[
   {
     "website_team_code": "OTT",
     "Team": "Ottawa 67'S",
     "Code": "T",
     "Abbreviation": "OTT"
   },
   {
     "website_team_code": "MISS",
     "Team": "Mississauga Steelheads",
     "Code": "M",
     "Abbreviation": "MIS"
   },
   {
     "website_team_code": "SOO",
     "Team": "Sault Ste Marie Greyhounds",
     "Code": "G",
     "Abbreviation": "SSM"
   },
   {
     "website_team_code": "KIT",
     "Team": "Kitchener Rangers",
     "Code": "R",
     "Abbreviation": "KIT"
   },
   {
     "website_team_code": "PBO",
     "Team": "Peterborough Petes",
     "Code": "P",
     "Abbreviation": "PBO"
   },
   {
     "website_team_code": "HAM",
     "Team": "Hamilton Bulldogs",
     "Code": "H",
     "Abbreviation": "HAM"
   },
   {
     "website_team_code": "SBY",
     "Team": "Sudbury Wolves",
     "Code": "Y",
     "Abbreviation": "SUD"
   },
   {
     "website_team_code": "NIAG",
     "Team": "Niagara IceDogs",
     "Code": "I",
     "Abbreviation": "NIA"
   },
   {
     "website_team_code": "GUE",
     "Team": "Guelph Storm",
     "Code": "U",
     "Abbreviation": "GUE"
   },
   {
     "website_team_code": "SAG",
     "Team": "Saginaw Spirit",
     "Code": "A",
     "Abbreviation": "SAG"
   },
   {
     "website_team_code": "BAR",
     "Team": "Barrie Colts",
     "Code": "B",
     "Abbreviation": "BAR"
   },
   {
     "website_team_code": "OSH",
     "Team": "Oshawa Generals",
     "Code": "Z",
     "Abbreviation": "OSH"
   },
   {
     "website_team_code": "OS",
     "Team": "Owen Sound Attack",
     "Code": "O",
     "Abbreviation": "OS"
   },
   {
     "website_team_code": "WSR",
     "Team": "Windsor Spitfires",
     "Code": "W",
     "Abbreviation": "WSR"
   },
   {
     "website_team_code": "LDN",
     "Team": "London Knights",
     "Code": "L",
     "Abbreviation": "LDN"
   },
   {
     "website_team_code": "SAR",
     "Team": "Sarnia Sting",
     "Code": "S",
     "Abbreviation": "SAR"
   },
   {
     "website_team_code": "NB",
     "Team": "North Bay Battalion",
     "Code": "N",
     "Abbreviation": "NB"
   },
   {
     "website_team_code": "KGN",
     "Team": "Kingston Frontenacs",
     "Code": "K",
     "Abbreviation": "KGN"
   },
   {
     "website_team_code": "ER",
     "Team": "Erie Otters",
     "Code": "E",
     "Abbreviation": "ER"
   },
   {
     "website_team_code": "FLNT",
     "Team": "Flint Firebirds",
     "Code": "F",
     "Abbreviation": "FLT"
   }
 ]
while (game_id.length!= 5){
   game_id=window.prompt("What is the game id that you are looking to extract data from?",'');
}

 currentUrlTemp="http://cluster.leaguestat.com/feed/index.php?feed=gc&key=2976319eb44abe94&client_code=ohl&game_id="+game_id+"&lang_code=en&fmt=json&tab=gamesummary";

 $.ajax({
  type:     "GET",
  url:      currentUrlTemp,
  dataType: "jsonp",
  success: function(data){
    allData=data;
    allElse(allData);
  }
});



function allElse(data) {
   var viscode=data["GC"]["Gamesummary"]["visitor"]["code"]
   var homecode=data["GC"]["Gamesummary"]["home"]["code"]
   var visitor=teamData(viscode,data["GC"]["Gamesummary"]["visitor_team_lineup"]);
   var home=teamData(homecode,data["GC"]["Gamesummary"]["home_team_lineup"]);
   var filename= "Game " + game_id + ", " + visitor[0]["Abbreviation"] + " vs " + home[0]["Abbreviation"] + " Player Input.csv"
   return exportToCSV(visitor.concat(home),filename);

}
function teamData(webCode,data) {
   var accumulator=[]
   var team= "webCode"
   var code= "webCode"
   var abbr= "webCode"
   const arrayOfKeysAndValues = [
  ['C', 'F'],
  ['LW', 'F'],
  ['RW', 'F'],
  ['F', 'F'],
  ['D', 'D'],
  ['RD', 'D'],
  ['LD', 'D'],
]
let positionMap = new Map(arrayOfKeysAndValues);
console.log(positionMap)

   for (var i = 0; i < WebsiteDatabaseTeamMapping.length; i++) {
      if (WebsiteDatabaseTeamMapping[i]["website_team_code"]==webCode) {
         team=WebsiteDatabaseTeamMapping[i].Team;
         code=WebsiteDatabaseTeamMapping[i].Code;
         abbr=WebsiteDatabaseTeamMapping[i].Abbreviation;
         break;
      }
}
   for (var i = 0; i < data.players.length; i++) {
      var newtempobj= {
         Team: team,
         Abbreviation:abbr,
         Number: data["players"][i]["jersey_number"],
         "Player Name": data["players"][i]["first_name"].normalize('NFD').replace(/[\u0300-\u036f]/g, "") + " " + data["players"][i]["last_name"].normalize('NFD').replace(/[\u0300-\u036f]/g, ""),
         player_id: data["players"][i]["player_id"],
         "Player Position": positionMap.get(data["players"][i]["position_str"])
      }
      console.log(data["players"][i]["position_str"])
      console.log(newtempobj)
      accumulator.push(newtempobj);
}
var Unknownplayer= {
   Team: team,
   Abbreviation:abbr,
   Number: 0,
   "Player Name": "Unknown",
   player_id: "9999",
   "Player Position": "X"

}
accumulator.push(Unknownplayer);
return accumulator
}


var objectToCSVRow = function(dataObject) {
   var dataArray = new Array;
   for (var o in dataObject) {
       var innerValue = dataObject[o]===null?'':dataObject[o].toString();
       var result = innerValue.replace(/"/g, '""');
       //result = '"' + result + '"';
       dataArray.push(result);
   }
   return dataArray.join(',') + '\r\n';
}

var exportToCSV = function(arrayOfObjects,filename) {
   if (!arrayOfObjects.length) {
       return;
   }

   var csvContent = "data:text/csv;charset=utf-8,";

   // headers
   csvContent += objectToCSVRow(Object.keys(arrayOfObjects[0]));

   arrayOfObjects.forEach(function(item){
       csvContent += objectToCSVRow(item);
   });

   var encodedUri = encodeURI(csvContent);
   var link = document.createElement("a");
   link.setAttribute("href", encodedUri);
   link.setAttribute("download", filename);
   document.body.appendChild(link); // Required for FF
   link.click();
   document.body.removeChild(link);
}
