var key = "jYTfzlUXqx607nu91cb320GgiFkNNk6T";

var topics = ["soccer", "football", "tennis", "badminton", "gymnastics", "baseball", "track", "swimming", "dancing", "curling"];

var state;
var searchTerm;
var searchPressed = false;

//display buttons on screen for desktop version
generateButtons();


// _________________________ FUNCTION PERFORED WHEN SEARCH IS PRESSED_____________________________
//when search term is added a new button is appended, and buttons rerender on screen
//gifs populate when search is pressed
$("#add-search-term").click(function () {
    event.preventDefault();

    searchPressed = true;
    //search word must have a value
    if ($("#search-term").val().trim().length > 0) {
        var newButton = $("<button>");
        searchTerm = $("#search-term").val().trim();
        topics.push(searchTerm);

        //generate buttons based on screen size
        if ($(window).width() > 768) {
            generateButtons();
            getGifs();
        } else {
            getGifs();
        }
    } else {
        alert("Please enter a search term");
    }

})

//__________________________________________GENERATE BUTTONS UNIVERSAL___________________________
//generated desktop buttons
function generateButtons() {
    $("#btn-container").empty();

    // Looping through the array of movies
    for (var i = 0; i < topics.length; i++) {
        var btn = $("<button>");
        // Adding a class of movie-btn to our button
        btn.addClass("btn-style");
        btn.addClass("btn");
        btn.attr("value", topics[i]);
        // Providing the initial button text
        btn.text(topics[i]);

        // Adding the button to the buttons-view div
        $("#btn-container").append(btn);
    }
}



//__________________________________________MOBILE BUTTONS___________________________
var btnsMobileVisible = false;

//generates mobile buttons and appends them to mobile container
//toggles the visibility of mobile buttons
function generateButtonsMobile() {
    console.log(btnsMobileVisible);
    $(".display-mobile-btns").empty();
    // $(".display-mobile-btns").css("display", "none");
    if (btnsMobileVisible == false) {
        for (var i = 0; i < topics.length; i++) {
            $(".display-mobile-btns").append('<button class="btn-style btn-mobile" value="' + topics[i] + '" >' + topics[i] + ' </button>');
            $(".display-mobile-btns").css('display', "block");
            $(".btn-mobile").css("background-color", "rgb(39, 62, 71)");
            btnsMobileVisible = true;
        }
    } else if (btnsMobileVisible == true) {
        // $(".mobile-btns").css("background-color", "none");
        $(".display-mobile-btns").css('display', "none");
        btnsMobileVisible = false;
    }
}


//__________________________________________MOBILE MENU BUTTON CLICK GENERATES BUTTONS__________________________
//toggles mobile buttons on click of the mobile-btn-menu button
$("#mobile-btn-menu").click(function () {
   // console.log("mobile menu pressed");
    generateButtonsMobile();
})


//__________________________________________HIDE MOBILE BUTTONS __________________________________
function hideMobileBtns() {
    // console.log("button shod")
    $(".display-mobile-btns").css('display', "none");
    btnsMobileVisible = false;
}



//__________________________________________RETRIEVE GIFS MOBILE AND DESKTOP___________________________
//get Gifs on button press
function getGifs() {
    $(".grid-container").empty();

    //if search hasn't been used, make a call using the button's value
    if (!searchPressed) {
        var xhr = $.get("https://api.giphy.com/v1/gifs/search?q=" + this.value + "&api_key=" + key + "&limit=10&rating=g&rating=pg");
        //if search has been used, make a call using the search term value
    } else if (searchPressed) {
        var xhr = $.get("https://api.giphy.com/v1/gifs/search?q=" + searchTerm + "&api_key=" + key + "&limit=10&rating=g&rating=pg");
    }

    xhr.done(function (result) {
        //console.log(result);

        for (var i = 0; i <= result.data.length - 1; i++) {
            var container = $("<div>");
            container.addClass("grid-item");
            var img = $("<img>");
            img.addClass("one-gif")
            img.attr("data-state", "still")
            img.attr("moving", result.data[i].images.fixed_height.url);
            img.attr("still", result.data[i].images.fixed_height_still.url);
            img.attr("src", result.data[i].images.fixed_height_still.url);
            container.append(img);
            var p = $("<div>");
            p.addClass("rating");
            p.text("rating is : " + result.data[i].rating.toUpperCase())
            container.append(p);
            $(".grid-container").append(container);
        }

        searchPressed = false;
    });

}


//__________________________________________TOGGLE BETWEEN STILL AND MOVING GIFS___________________________
//toggles moving and still gifs
function switchGifs() {
    state = $(this).attr("data-state");
    if (state == "still") {
        $(this).attr("src", $(this).attr("moving"));
        $(this).attr("data-state", "animate");
    } else if (state == "animate") {
        $(this).attr("src", $(this).attr("still"));
        $(this).attr("data-state", "still");
    }
}



//__________________________________________CALL FUNCTIONS BUTTONS___________________________
//function calls1
$(document).on("click", ".btn", getGifs);
$(document).on("click", ".btn-mobile", getGifs);
$(document).on("click", ".btn-mobile", hideMobileBtns);
$(document).on("click", ".one-gif", switchGifs);


