chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {

      var aud = document.createElement("audio");
      aud.setAttribute("id", "voice");
      aud.setAttribute("autoplay", "");


      var observerConfig = {
        attributes: true,
        childList: true,
        characterData: true
      };

      var audioObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          var newVal = $(mutation.target).prop(mutation.attributeName);
          if (mutation.attributeName === "aria-label") {
            console.log(mutation.target.attributes.getNamedItem("aria-label").value);
            var vidState = mutation.target.attributes.getNamedItem("aria-label").value;
            if (vidState == "Play") {
              aud.play();
            } else {
              aud.pause();
            }
          }
        });
      });
      var vidstatus = document.getElementsByClassName("ytp-bezel")[0];
      
      audioObserver.observe(vidstatus, observerConfig);

      var vidSrc = document.createElement("source");
      vidSrc.setAttribute("type", "audio/mpeg");
      vidSrc.setAttribute("src", request.greeting);
      console.log(request.allScript)
      console.log(request.greeting);
      aud.appendChild(vidSrc);

      $('body').append(aud);

      document.getElementsByClassName("video-stream html5-main-video")[0].currentTime = 6;
    }
);
