"use strict";

var url = "http://video.google.com/timedtext?lang=fr&v=zCaxXQdkfPk";
var msURL = "https://api.microsofttranslator.com/V2/Http.svc";
var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzY29wZSI6Imh0dHBzOi8vYXBpLm1pY3Jvc29mdHRyYW5zbGF0b3IuY29tLyIsInN1YnNjcmlwdGlvbi1pZCI6IjY4ZDE3ODQ4YmRiMjRhNDlhZGM0YmE1NjJkOWIxMjVlIiwicHJvZHVjdC1pZCI6IlRleHRUcmFuc2xhdG9yLkYwIiwiY29nbml0aXZlLXNlcnZpY2VzLWVuZHBvaW50IjoiaHR0cHM6Ly9hcGkuY29nbml0aXZlLm1pY3Jvc29mdC5jb20vaW50ZXJuYWwvdjEuMC8iLCJhenVyZS1yZXNvdXJjZS1pZCI6Ii9zdWJzY3JpcHRpb25zLzBkMmZmOThjLTVkYjAtNGZiOC05MmI1LTAxNDU5ZTY3ZGM5Yy9yZXNvdXJjZUdyb3Vwcy9UcmFuc1ZpZC9wcm92aWRlcnMvTWljcm9zb2Z0LkNvZ25pdGl2ZVNlcnZpY2VzL2FjY291bnRzL1RyYW5zVmlkIiwiaXNzIjoidXJuOm1zLmNvZ25pdGl2ZXNlcnZpY2VzIiwiYXVkIjoidXJuOm1zLm1pY3Jvc29mdHRyYW5zbGF0b3IiLCJleHAiOjE1MDg2NzIzODB9.57EIOXATvqUKLj7B7eMFR84lLaxfaCXPRls_mqa7rvw";
var request = new XMLHttpRequest();
request.addEventListener("load", loadScript);

request.open("GET", url, true);
request.send();


function loadScript() {
    var xml = request.responseXML;
    var transcriptLines = xml.getElementsByTagName("transcript")[0].getElementsByTagName("text");
    // console.log("WHOLE",xml.getElementsByTagName("transcript")[0]["textContent"]);
    var whole = xml.getElementsByTagName("transcript")[0]["textContent"];
    console.log(whole);
    translate(whole);
    
    for(var i = 0; i < transcriptLines.length; i++) {
        var text = transcriptLines[i]["textContent"];
        console.log("LINE " + i,text);
    }
}

function translate(data) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", msURL + "/Translate?appid=Bearer "+ token + "&to=en&text="+"Bonjour")
    xhr.responseType = 'xml';
    xhr.onload = function() {
        console.log(xhr.responseXML.getElementsByTagName("string")[0].textContent);
    }
    xhr.send();
}

function voiceOver(script) {
    
}
    