"use strict";
$(function(){

    var youtubeUrl = "https://www.youtube.com/watch?v=";
    var youtubeKey = "AIzaSyB3H6Fl0_1fx5DCGMJRBlubT4tSQgnFlOY";

    var googleapis = "https://www.googleapis.com/youtube/v3/captions"
    var googleUrl = "http://video.google.com/timedtext"; 
    
    var msURL = "https://api.microsofttranslator.com/V2/Http.svc";
    var msKey = "8cabe1d5d90749c0ad5a7b92bfb4754f";
    var token = "";

    var languageTo = "en";
    var vidId = "";
    chrome.tabs.getSelected(null, function (tab) {
        if (tab.url.startsWith(youtubeUrl)) {
            vidId = tab.url.substring(youtubeUrl.length, tab.url.indexOf('&'));
            console.log(vidId);
            getToken();
            getLang();
        } else {
            document.getElementById("voice_source").setAttribute("src", "");        
        }
    });


    function getToken() {
        $.ajax({
            type: "POST",
            url: "https://api.cognitive.microsoft.com/sts/v1.0/issueToken",
            headers: {
                'Ocp-Apim-Subscription-Key':msKey,
            },
            success: (result)=>{
                token = result
            }  
        })
    }

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
        var hello = "ar ar-eg ca ca-es da da-dk de de-de en en-au en-ca en-gb en-in en-us es es-es es-mx fi fi-fi fr fr-ca fr-fr hi hi-in it it-it ja ja-jp ko ko-kr nb-no nl nl-nl no pl pl-pl pt pt-br pt-pt ru ru-ru sv sv-se yue zh-chs zh-cht zh-cn zh-hk zh-tw";
        var world = hello.split(" ");
        world.forEach(function(w) {
            var e = document.createElement('option');
            e.value = w;
            e.innerHTML = w;
            var langOp = document.getElementById("lang-option").appendChild(e);
        });

        $.ajax({
            url: googleUrl,
            data: {
            lang: languageFrom,
            v: vidId
            },
            success: (result)=>{
                var script = result.getElementsByTagName("transcript")[0]["textContent"].replace(/\n/g, " ");
                translate(htmlDecode(script));
            }
        });
    }

    function htmlDecode(input){
        var e = document.createElement('div');
        e.innerHTML = input;
        return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
    }

    function translate(script){
        console.log(script)
        $.ajax({
            url: msURL + "/Translate",
            data: {
                appid : "Bearer "+ token,
                to: languageTo,
                text: script
            },
            success: (result)=>{
                var translatedScript = (result.getElementsByTagName('string')[0].innerHTML);
                voiceOver(translatedScript);
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


