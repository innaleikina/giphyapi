var key = "jYTfzlUXqx607nu91cb320GgiFkNNk6T";

var topics = ["soccer", "football", "tennis", "badminton", "gymnastics", "baseball", "track", "swimming", "cheerleading", "dancing", "curling"];

var state;
var searchTerm;

//display buttons on screen for desktop version
generateButtons();

//when search term is added a new button is appended, and buttons rerender on screen
//gifs populate when search is pressed
$("#add-search-term").click(function () {
    event.preventDefault();

    //search word must have a value
    if ($("#search-term").val().trim().length > 0) {
        var newButton = $("<button>");
        searchTerm = $("#search-term").val().trim();
        topics.push(searchTerm);
        if ($(window).width() > 768) {
            generateButtons();
            getGifsOnSearch();
        } else {
            getGifsOnSearch();
        }
    } else {
        alert("Please enter a search term");
    }

})


//when search is pressed an API call is made and GIFS are populated
function getGifsOnSearch() {
    $(".grid-container").empty();
    var xhr = $.get("https://api.giphy.com/v1/gifs/search?q=" + searchTerm + "&api_key=" + key + "&limit=10&rating=g&rating=pg");
    xhr.done(function (result) {
        console.log(result);

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
    });

}

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




var btnsMobileVisible = false

//generates mobile buttons and appends them to mobile container
//toggles the visibility of mobile buttons
function generateButtonsMobile() {
    $(".display-mobile-btns").empty();
    $(".btn-mobile").css("display", "none");
    if (btnsMobileVisible == false) {
        for (var i = 0; i < topics.length; i++) {
            $(".display-mobile-btns").append('<button class="btn-style btn-mobile" value="' + topics[i] + '" >' + topics[i] + '</button>');
            $(".btn-mobile").css('display', "block");
            btnsMobileVisible = true;
            $(".btn-mobile").css("background-color", "rgb(39, 62, 71)");
        }
    } else if (btnsMobileVisible == true) {
        // $(".mobile-btns").css("background-color", "none");
        $(".btn-mobile").css('display', "none");
        btnsMobileVisible = false;
    }
}


//toggles mobile buttons on click of the mobile-btn-menu button
$("#mobile-btn-menu").click(function () {
    console.log("mobile menu pressed");
    generateButtonsMobile();
})


//get Gifs on button press
function getGifs(value) {
    $(".grid-container").empty();
    var xhr = $.get("https://api.giphy.com/v1/gifs/search?q=" + this.value + "&api_key=" + key + "&limit=10&rating=g&rating=pg");
    xhr.done(function (result) {
        console.log(result);

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
    });

}


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



//function calls
$(document).on("click", ".btn", getGifs);
$(document).on("click", ".btn-mobile", getGifs);
$(document).on("click", ".one-gif", switchGifs);