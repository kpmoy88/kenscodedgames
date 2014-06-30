// Start slideshow jquery plugin
$(document).ready(function(){
 	$('.bxslider').bxSlider({
 		adaptiveHeight: true
 	});
});

$(window).bind("resize", function(){ //Adjusts HTML elemnets when browser is resized
        formatWindow();
    });

setSlideImages();

// Sets the right images for slideshow
function setSlideImages() {
    formatWindow();
}

// Ajdust HTML elements on Window Resize
function formatWindow() {
	setSlideImg(".slide1", "highlow");
	setSlideImg(".slide2", "rockpaperscissors");
	setSlideImg(".slide3", "crownanchor");
}

// Change image based on screen size
function getScreenSize() {
    if(window.matchMedia('(min-width: 780px)').matches) {
        return "_780";
    }
    else {
        return "_480";
    }
}

// Change slide image based on game
function setSlideImg(slide, slideType) {
    var imgSize = getScreenSize();
    if(slideType == "highlow") {
        $(slide).attr({src: "../../assets/highlow" + imgSize + ".png", alt: "high-low"});
    } else if (slideType == "rockpaperscissors") {
        $(slide).attr({src: "../../assets/rockpaperscissors" + imgSize + ".png", alt: "rock-paper-scissors"});
    } else {
        $(slide).attr({src: "../../assets/crownanchor" + imgSize + ".png", alt: "crown-and-anchor"});
    }
}
;
