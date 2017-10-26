// (function() {

        chrome.runtime.onMessage.addListener(
            function(request, sender, sendResponse) {
              document.getElementsByClassName("video-stream html5-main-video")[0].currentTime = 5;
              document.getElementsByClassName("video-stream html5-main-video")[0].volume = 0.03;
            }
        );
