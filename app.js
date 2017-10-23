"use strict";
$(function() {
    const YOUTUBE_URL = "https://www.youtube.com/watch?v=";
    const YOUTUBE_KEY = "AIzaSyB3H6Fl0_1fx5DCGMJRBlubT4tSQgnFlOY";

    const GOOGLE_API = "https://www.googleapis.com/youtube/v3/captions"
    const GOOGLE_VIDEO_API = "http://video.google.com/timedtext"; 
    
    
    const MS_URL = "https://api.microsofttranslator.com/V2/Http.svc";
    const MS_KEY = "8cabe1d5d90749c0ad5a7b92bfb4754f";
    const MS_TOKEN_URL = "https://api.cognitive.microsoft.com/sts/v1.0/issueToken";
    let token = "";

    const DEFAULT_LANGUAGE_TO = "en"
    let languageTo = DEFAULT_LANGUAGE_TO;
    let vidId = "";

    chrome.tabs.getSelected(null, function (tab) {
        if (tab.url.startsWith(YOUTUBE_URL)) {
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
            $("#voice_source").attr("src", "");        
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
        var langOp = $("#lang-option").append(e);
    });
    $("#lang-option").val("en");    

    function getToken() {
        $.ajax({
            type: "POST",
            url: MS_TOKEN_URL,
            headers: {
                'Ocp-Apim-Subscription-Key':MS_KEY,
            },
            success: (result)=>{
                console.log("token success")
                token = result
            }  
        })
    }

    //Get the original language of the video from google api server
    function getLang() {
        $.ajax({
            url: GOOGLE_API,
            data: {
                part: "snippet",
                videoId: vidId,
                key: YOUTUBE_KEY
            },
            success: (result)=>{
                var languageFrom = result.items[0].snippet.language;
                loadScript(languageFrom)
            }
        })
    }

    //Get the transcript of the video
    function loadScript(languageFrom){
        $.ajax({
            url: GOOGLE_VIDEO_API,
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
            url: MS_URL + "/Translate",
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
        var voice = $('#voice')[0];
        console.log(voice)
        voice.pause();
        $("#voice_source").attr("src", MS_URL + "/Speak?appid=Bearer "+ token + "&format=audio/mp3&options=male&language=" + languageTo + "&text=" + translatedScript);
        voice.load();
        voice.play();
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {greeting: voice.currentTime.toString()}, null);
            
          });
    }
})


