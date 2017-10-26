const YOUTUBE_URL = "https://www.youtube.com/watch?v=";
const YOUTUBE_KEY = "AIzaSyB3H6Fl0_1fx5DCGMJRBlubT4tSQgnFlOY";

const GOOGLE_API = "https://www.googleapis.com/youtube/v3/captions"
const GOOGLE_VIDEO_API = "https://video.google.com/timedtext"; 


const MS_URL = "https://api.microsofttranslator.com/V2/Http.svc";
const MS_KEY = "8cabe1d5d90749c0ad5a7b92bfb4754f";
const MS_TOKEN_URL = "https://api.cognitive.microsoft.com/sts/v1.0/issueToken";
var token = "";

var languageTo = "";
var vidId = "";

var ytplayer = document.getElementsByClassName("video-stream html5-main-video")[0];
var ytplayerTime = setInterval(updateTimer, 500);








chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      languageTo = request.lang;
      vidId = request.videoID
      token = request.tkn;
      console.log("request: " + request.tkn);
      console.log("request: " + request.lang);
      console.log("request: " + request.videoID);
      
      
      var transcript;
      
      // retrieved script
      transcript = getLang();
      console.log(" in main: " + transcript);

      

// IF ONE LARGE AUDIO FILE, I CAN TRACK VIDEO STATE, AND PAUSE AUDIO WHEN VIDEO IS PAUSED

      // var observerConfig = {
      //   attributes: true,
      //   childList: true,
      //   characterData: true
      // };
      // var audioObserver = new MutationObserver(function (mutations) {
      //   mutations.forEach(function (mutation) {
      //     var newVal = $(mutation.target).prop(mutation.attributeName);
      //     if (mutation.attributeName === "aria-label") {
      //       console.log(mutation.target.attributes.getNamedItem("aria-label").value);
      //       var vidState = mutation.target.attributes.getNamedItem("aria-label").value;
      //       if (vidState == "Play") {
      //         aud.play();
      //       } else {
      //         aud.pause();
      //       }
      //     }
      //   });
      // });
      // var vidstatus = document.getElementsByClassName("ytp-bezel")[0];
      
      // audioObserver.observe(vidstatus, observerConfig);

      // var vidSrc = document.createElement("source");
      // vidSrc.setAttribute("type", "audio/mpeg");
      // vidSrc.setAttribute("src", request.greeting);
      // console.log(request.allScript)
      // console.log(request.greeting);
      // aud.appendChild(vidSrc);

      // $('body').append(aud);

      // document.getElementsByClassName("video-stream html5-main-video")[0].currentTime = 6;
    }

);

//Get the original language of the video from google api server
function getLang() {
  var script;
  $.ajax({
      url: GOOGLE_API,
      data: {
          part: "snippet",
          videoId: vidId,
          key: YOUTUBE_KEY
      },
      success: (result)=>{
          var languageFrom = result.items[0].snippet.language;
          console.log("success in getting language");
          script = loadScript(languageFrom);

      }
  });
  return script
}

//http://video.google.com/timedtext?lang=fr&v=zCaxXQdkfPk

//Get the transcript of the video
function loadScript(languageFrom){
  var script;
  $.ajax({
      url: GOOGLE_VIDEO_API,
      data: {
          lang: languageFrom,
          v: vidId
      },
      success: (result)=>{
          // var script = result.getElementsByTagName("transcript")[0]["textContent"].replace(/\n/g, " ");
          // translate(htmlDecode(script));
          console.log("success in loading script" + result.getElementsByTagName("text"));
          script = result.getElementsByTagName("text");
          ytplayer.currentTime = 0;          
          for (var i = 0; i < script.length; i++) {
            let startTime = script[i].getAttribute("start");
            let val = script[i]["textContent"].replace(/\n/g, " ");
            val = htmlDecode(val);
            startTime = parseFloat(startTime);

            console.log("startTime: " + startTime +" : playerTime:" + ytplayerTime);
            console.log(startTime - ytplayerTime);
            // wait until audio and video sync
            setTimeout(function() {
              console.log(val);
              console.log("startTime: " + startTime +" : playerTime:" + ytplayerTime);
              translate(val);
            }, (startTime * 1000));
          }

          
      }
  });
  return script;
}

function runTheScript(audioStart, videoStart) {
  console.log("startTime: " + audioStart +" : playerTime:" + videoStart);
}

function updateTimer() {
    ytplayer = document.getElementsByClassName("video-stream html5-main-video")[0];
    ytplayerTime = ytplayer.currentTime;
    //console.log(ytplayerTime);
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
  var VidSource = MS_URL + "/Speak?appid=Bearer "+ token + "&format=audio/mp3&options=male&language=" + languageTo + "&text=" + translatedScript;
  
  if (document.getElementById("video-source") != null) {
    document.getElementById("video-source").remove();
  }    
  var aud = document.createElement("audio");
  aud.setAttribute("id", "voice");
  aud.setAttribute("autoplay", "");
  var vidSrc = document.createElement("source");
  vidSrc.id = "video-source";
  vidSrc.setAttribute("type", "audio/mpeg");
  vidSrc.setAttribute("src", VidSource);
  aud.appendChild(vidSrc);
  $('body').append(aud);
}