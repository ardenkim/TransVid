// (function() {

        chrome.runtime.onMessage.addListener(
            function(request, sender, sendResponse) {
              document.getElementsByClassName("video-stream html5-main-video")[0].currentTime = 6.5;
              $('.ytp-mute-button').click();
            //   console.log("hdshasa" + vid);
            //   vid.currentTime = parseInt(request.greeting);
            }
        );
