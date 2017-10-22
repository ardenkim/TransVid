"use strict";

var youtubeUrl = "https://www.youtube.com/watch?v=";
var youtubeKey = "AIzaSyB3H6Fl0_1fx5DCGMJRBlubT4tSQgnFlOY";

var languageFrom = "";

var googleUrl = "http://video.google.com/timedtext"; 
var msURL = "https://api.microsofttranslator.com/V2/Http.svc";
var msKey = "8cabe1d5d90749c0ad5a7b92bfb4754f";
var token = "";

var languageTo = "en";

var vidId = "";
chrome.tabs.getSelected(null, function (tab) {
    if (tab.url.includes("youtube.com")) {
        vidId = tab.url.substring(youtubeUrl.length);
        console.log(vidId);
        getToken();
        getLang();
    } else {
        document.getElementById("voice_source").setAttribute("src", "");        
    }
});

var request = new XMLHttpRequest();

function getToken() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.cognitive.microsoft.com/sts/v1.0/issueToken");
    xhr.setRequestHeader("Ocp-Apim-Subscription-Key", msKey)
    console.log("HELLO")
    xhr.onreadystatechange = function() {
        token = xhr.responseText;
    }
    xhr.send();
}

function getLang() {
    fetch("https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId=" + vidId + "&key=" + youtubeKey)
        .then(function (res) {
            var info = res.json();
            return info;
        }).then(function (data) {
            if (data.items.length > 0) {
                languageFrom = data.items[0].snippet.language;
                loadScript();    
            } else {
                alert("unable to parse script");
            }
    });
}

function loadScript() {
    // Options for language drop down
    var hello = "ar ar-eg ca ca-es da da-dk de de-de en en-au en-ca en-gb en-in en-us es es-es es-mx fi fi-fi fr fr-ca fr-fr hi hi-in it it-it ja ja-jp ko ko-kr nb-no nl nl-nl no pl pl-pl pt pt-br pt-pt ru ru-ru sv sv-se yue zh-chs zh-cht zh-cn zh-hk zh-tw";
    var world = hello.split(" ");
    world.forEach(function(w) {
        var e = document.createElement('option');
        e.value = w;
        e.innerHTML = w;
        var langOp = document.getElementById("lang-option").appendChild(e);
    });
    
    request.addEventListener("load", parseScript);
    
    request.open("GET", googleUrl + "?lang=" + languageFrom + "&v=" + vidId, true);
    request.send();    
}

function htmlDecode(input){
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
  }

function parseScript() {
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
    document.getElementById("voice_source").setAttribute("src", msURL + "/Speak?appid=Bearer "+ token + "&format=audio/mp3&options=male&language=" + languageTo + "&text=" + script);
    voice.load();
    voice.play();
}
    



