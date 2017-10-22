"use strict";

var url = "http://video.google.com/timedtext?lang=fr&v=zCaxXQdkfPk";

var request = new XMLHttpRequest();
request.addEventListener("load", loadScript);

request.open("GET", url, true);
request.send();


function loadScript() {
    var xml = request.responseXML;
    var transcriptLines = xml.getElementsByTagName("transcript")[0].getElementsByTagName("text");
    console.log("WHOLE",xml.getElementsByTagName("transcript")[0]["textContent"]);
    
    for(var i = 0; i < transcriptLines.length; i++) {
        var text = transcriptLines[i]["textContent"];
        console.log("LINE " + i,text);
    }
}

function translate(data) {

}

function voiceOver(script) {
    
}
    