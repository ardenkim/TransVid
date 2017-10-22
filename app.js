"use strict";
$(function(){


var youtubeUrl = "https://www.youtube.com/watch?v=";
var youtubeKey = "AIzaSyB3H6Fl0_1fx5DCGMJRBlubT4tSQgnFlOY";

var languageFrom = "";

var googleapis = "https://www.googleapis.com/youtube/v3/captions"

var googleUrl = "http://video.google.com/timedtext"; 
var msURL = "https://api.microsofttranslator.com/V2/Http.svc";
var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzY29wZSI6Imh0dHBzOi8vYXBpLm1pY3Jvc29mdHRyYW5zbGF0b3IuY29tLyIsInN1YnNjcmlwdGlvbi1pZCI6IjY4ZDE3ODQ4YmRiMjRhNDlhZGM0YmE1NjJkOWIxMjVlIiwicHJvZHVjdC1pZCI6IlRleHRUcmFuc2xhdG9yLkYwIiwiY29nbml0aXZlLXNlcnZpY2VzLWVuZHBvaW50IjoiaHR0cHM6Ly9hcGkuY29nbml0aXZlLm1pY3Jvc29mdC5jb20vaW50ZXJuYWwvdjEuMC8iLCJhenVyZS1yZXNvdXJjZS1pZCI6Ii9zdWJzY3JpcHRpb25zLzBkMmZmOThjLTVkYjAtNGZiOC05MmI1LTAxNDU5ZTY3ZGM5Yy9yZXNvdXJjZUdyb3Vwcy9UcmFuc1ZpZC9wcm92aWRlcnMvTWljcm9zb2Z0LkNvZ25pdGl2ZVNlcnZpY2VzL2FjY291bnRzL1RyYW5zVmlkIiwiaXNzIjoidXJuOm1zLmNvZ25pdGl2ZXNlcnZpY2VzIiwiYXVkIjoidXJuOm1zLm1pY3Jvc29mdHRyYW5zbGF0b3IiLCJleHAiOjE1MDg2OTA0MDN9.EOft0fcpnwjYlRkp2Q-Vhtg0AFXv4UkCvn0wrNJaqAQ"
var languageTo = "en";
var vidId = "";
chrome.tabs.getSelected(null, function (tab) {
    if (tab.url.includes("youtube.com")) {
        vidId = tab.url.substring(youtubeUrl.length);
        console.log(vidId);
        getLang();
    } else {
        document.getElementById("voice_source").setAttribute("src", "");        
    }
});

function getLang() {
    $.ajax({
        url: googleapis,
        data: {
            part: "snippet",
            videoId: vidId,
            key: youtubeKey
        },
        success: (result)=>{
            var languageFrom = result.items[0].snippet.language;
            loadScript(languageFrom)
        }
    })
}

function loadScript(languageFrom){
    $.ajax({
        url: googleUrl,
        data: {
          lang: languageFrom,
          v: vidId
        },
        success: (result)=>{
            var script = result.getElementsByTagName("transcript")[0]["textContent"].replace(/\n/g, " ");
            translate(script)
        }
      });
}

function translate(script){
    console.log(script)
    $.ajax({
        url: msURL + "/Translate",
        data: {
            appid : "Bearer "+token,
            to: "en",
            text: script
        },
        success: (result)=>{
            var translatedScript = (result.getElementsByTagName('string')[0].innerHTML);
            voiceOver(translatedScript);
            // voiceOver("Hello My Name is Min")
        }
    })
}

function voiceOver(translatedScript) {
    var voice = document.getElementById("voice");
    voice.pause();
    document.getElementById("voice_source").setAttribute("src", msURL + "/Speak?appid=Bearer "+ token + "&format=audio/mp3&options=male&language=" + languageTo + "&text=" + translatedScript);
    voice.load();
    voice.play();
}
    

})


