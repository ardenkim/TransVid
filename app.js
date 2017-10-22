"use strict";
$(function() {
    var youtubeUrl = "https://www.youtube.com/watch?v=";
    var youtubeKey = "AIzaSyB3H6Fl0_1fx5DCGMJRBlubT4tSQgnFlOY";

    var googleApi = "https://www.googleapis.com/youtube/v3/captions"
    var googleVideoApi = "http://video.google.com/timedtext"; 
    
    var msURL = "https://api.microsofttranslator.com/V2/Http.svc";
    var msKey = "8cabe1d5d90749c0ad5a7b92bfb4754f";
    var msTokenUrl = "https://api.cognitive.microsoft.com/sts/v1.0/issueToken";
    var token = "";

    var languageTo = "en";
    var vidId = "";

    chrome.tabs.getSelected(null, function (tab) {
        if (tab.url.startsWith(youtubeUrl)) {
            var query = tab.url.substring(tab.url.indexOf('?')+1);
            var params = query.split('&')
            for(var i = 0; i < params.length; i++){
                var temp = params[i].split('=')
                if(temp[0]=='v'){
                    vidId = temp[1]
                }
            }
            console.log(vidId);
        } else {
            vidId = "";
            document.getElementById("voice_source").setAttribute("src", "");        
        }
    });

    $("#speak").click(function() {
        if (vidId.length > 0) {
            getToken();
            getLang();    
        }
    });

    $("#lang-option").change(function() {
        console.log($(this).val());
        languageTo = $(this).val();
    });

    var availableLang = ["ar", "ar-eg", "ca", "ca-es", "da", "da-dk", "de", "de-de", "en", "en-au", "en-ca", "en-gb", "en-in", "en-us", "es", "es-es", "es-mx", "fi", "fi-fi", "fr", "fr-ca", "fr-fr", "hi", "hi-in", "it", "it-it", "ja", "ja-jp", "ko", "ko-kr", "nb-no", "nl", "nl-nl", "no", "pl", "pl-pl", "pt", "pt-br", "pt-pt", "ru", "ru-ru", "sv", "sv-se", "yue", "zh-chs", "zh-cht", "zh-cn", "zh-hk", "zh-tw"];
    availableLang.forEach(function(w) {
        var e = document.createElement('option');
        e.value = w;
        e.innerHTML = w;
        var langOp = document.getElementById("lang-option").appendChild(e);
    });
    $("#lang-option").val("en");    

    function getToken() {
        $.ajax({
            type: "POST",
            url: msTokenUrl,
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
            url: googleApi,
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
            url: googleVideoApi,
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
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {greeting: voice.currentTime.toString()}, null);
            
          });
    }
})


