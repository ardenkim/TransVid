"use strict";

var youtubeUrl = "https://www.youtube.com/watch?v=";
var vidId = "";
chrome.tabs.getSelected(null, function (tab) {
    vidId = tab.url.substring(youtubeUrl.length);
    console.log(array);
});

var languageFrom = "fr";

var googleUrl = "http://video.google.com/timedtext"; 
var msURL = "https://api.microsofttranslator.com/V2/Http.svc";
var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzY29wZSI6Imh0dHBzOi8vYXBpLm1pY3Jvc29mdHRyYW5zbGF0b3IuY29tLyIsInN1YnNjcmlwdGlvbi1pZCI6IjY4ZDE3ODQ4YmRiMjRhNDlhZGM0YmE1NjJkOWIxMjVlIiwicHJvZHVjdC1pZCI6IlRleHRUcmFuc2xhdG9yLkYwIiwiY29nbml0aXZlLXNlcnZpY2VzLWVuZHBvaW50IjoiaHR0cHM6Ly9hcGkuY29nbml0aXZlLm1pY3Jvc29mdC5jb20vaW50ZXJuYWwvdjEuMC8iLCJhenVyZS1yZXNvdXJjZS1pZCI6Ii9zdWJzY3JpcHRpb25zLzBkMmZmOThjLTVkYjAtNGZiOC05MmI1LTAxNDU5ZTY3ZGM5Yy9yZXNvdXJjZUdyb3Vwcy9UcmFuc1ZpZC9wcm92aWRlcnMvTWljcm9zb2Z0LkNvZ25pdGl2ZVNlcnZpY2VzL2FjY291bnRzL1RyYW5zVmlkIiwiaXNzIjoidXJuOm1zLmNvZ25pdGl2ZXNlcnZpY2VzIiwiYXVkIjoidXJuOm1zLm1pY3Jvc29mdHRyYW5zbGF0b3IiLCJleHAiOjE1MDg2ODA5NjR9.HrPzy3xALPRO-8R3hgqLxlDwCPvfw0SGGbHZPUHYTOc";

var languageTo = "en";

var request = new XMLHttpRequest();
request.addEventListener("load", loadScript);

request.open("GET", googleUrl + "?lang=" + languageFrom + "&v=" + vidId, true);
request.send();

function htmlDecode(input){
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
  }

function loadScript() {
    var xml = request.responseXML;
    var transcriptLines = xml.getElementsByTagName("transcript")[0].getElementsByTagName("text");
    var whole = xml.getElementsByTagName("transcript")[0]["textContent"];
    translate(htmlDecode(whole).replace(/\n/g, " "));
}

function translate(data) {
    console.log("TRANSLATE", data);
    var xhr = new XMLHttpRequest();
    xhr.open("GET", msURL + "/Translate?appid=Bearer "+ token + "&to=en&text="+data);
    xhr.onload = function() {
        console.log(xhr.responseXML.getElementsByTagName("string")[0].textContent);
        voiceOver(xhr.responseXML.getElementsByTagName("string")[0].textContent);
    };
    xhr.send();
}

function voiceOver(script) {
    var voice = document.getElementById("voice");
    voice.pause();
    document.getElementById("voice_source").setAttribute("src", msURL + "/Speak?appid=Bearer "+ token + "&format=audio/mp3&language=" + languageTo + "&text=" + script);
    voice.load();
    voice.play();
}
    