/*
 * Chromecast Video Player
 * Copyright 2014 Denis Meyer
 */
(function($) {
    $(document).ready(function() {
        var URL = window.URL || window.webkitURL;

        function displayMessage(msg, info) {
            var infoOrAlert = info ? "success" : "danger";
            $("#message").html('<div class="alert alert-' + infoOrAlert + '" role="alert">' + msg + '</div>');
        };

        function error() {
            $(".metadata, #adjust").hide();
        }

        if (!URL) {
            var notSupportedMsg = 'Your browser is not supported.';
            displayMessage(notSupportedMsg, false);
            error();
            $("#videoData, #videoContainer").hide();
            return;
        }

        videojs.options.flash.swf = "lib/videojs/video-js.swf";

        $("#videoInput").on("change", function() {
            $("#videoMetadata").html("Video source: " + $(this).val());
            $(".metadata").show();
            $("#message").hide();
            $("#btn_load").removeClass("disabled");
        });
        $("#subtitleInput").on("change", function() {
            if ($(this).val().indexOf(".vtt") != -1) {
                $("#subtitleMetadata").html("Subtitle source: " + $(this).val());
                $(".metadata").show();
                $("#message").hide();
            } else {
                $("#subtitleMetadata").html("No subtitle file selected.");
            }
        });
        $("#increaseSubtitleSize").click(function(e) {
            var track = $(".vjs-text-track-display");
            var currSize = parseInt(track.css("font-size"), 10);
            var newSize = currSize + 5;
            track.css("font-size", newSize).css("bottom", "1em");
        });
        $("#decreaseSubtitleSize").click(function(e) {
            var track = $(".vjs-text-track-display");
            var currSize = parseInt(track.css("font-size"), 10);
            var newSize = currSize - 5;
            track.css("font-size", newSize).css("bottom", "1em");
        });

        $("#videoData").submit(function(e) {
            e.preventDefault();

            var videoInput = $("#videoInput")[0];
            var subtitleInput = $("#subtitleInput")[0];

            if (videoInput && videoInput.files && (videoInput.files.length < 1)) {
                displayMessage("Select an input video file first.", false);
                error();
                $("#videoMetadata").html("No video file selected.");
                $(".metadata").show();
                $("#message").hide();
                return;
            }

            var videoFile = videoInput.files[0];
            var videoType = videoFile.type;
            var videoURL = URL.createObjectURL(videoFile);

            var subtitleFile = "";
            var subtitleType = "";
            var subtitleURL = "";
            if (subtitleInput && subtitleInput.files && (subtitleInput.files.length > 0) && subtitleInput.files[0].name && (subtitleInput.files[0].name.indexOf(".vtt") != -1)) {
                subtitleFile = subtitleInput.files[0];
                subtitleType = subtitleFile.type;
                subtitleURL = URL.createObjectURL(subtitleFile);
                var trackElem = '<track kind="captions" src="' + subtitleURL + '" scrlang="en" label="English" default>';
                $("#video").append(trackElem);
            }

            try {
                videojs("video", {
                    "controls": true,
                    "autoplay": false,
                    "preload": "auto",
                    "loop": false,
                    "width": 640,
                    "height": 360
                }).ready(function() {
                    this.src({
                        "type": videoType,
                        "src": videoURL
                    });
                    this.play();
                    if (subtitleURL) {
                        $("#adjust").removeClass("hidden");
                        $(".vjs-text-track-display").css("bottom", "1em");
                    }
                });
                displayMessage("Video loaded successfully. Now stream this tab to your Chromecast and go into fullscreen.", true);
                $(".metadata").hide();
                $("#message").show();
            } catch (ex) {
                displayMessage("Video could not be loaded.", false);
                error();
                $(".metadata").show();
                $("#message").hide();
            }
        });
    });
})(jQuery);
