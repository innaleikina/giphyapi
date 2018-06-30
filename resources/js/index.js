var key = "jYTfzlUXqx607nu91cb320GgiFkNNk6T";
var newsKey = "0ae55fd9d34a4f94ac9db4a2dd4c1dc3";

var topics = ["soccer", "football", "tennis", "badminton", "gymnastics", "baseball", "track", "swimming", "dancing", "curling"];

var state;
var searchTerm;
var searchPressed = false;

//display buttons on screen for desktop version
generateButtons();
//localStorage.clear();
getFavorites();

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
            getWikipedia();
        } else {
            getGifs();
            getWikipedia();
        }
    } else {
        alert("Please enter a search term");
    }
    $("#search-term").val('');
});

//trigger search on enter and on button click
$(document).keypress(function (e) {
    if (e.which == 13) {
        $("#add-search-term").click();
    }
});

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
    // console.log(btnsMobileVisible);
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
var url;
var limit = 10;
//var offset = Math.floor(Math.random()* 100);

function getGifs() {
    //offset generates different gifs everytime
    var offset = Math.floor(Math.random() * 100);
    $(".grid-container").empty();
    //if search hasn't been used, make a call using the button's value
    if (!searchPressed) {
        url = $.get("https://api.giphy.com/v1/gifs/search?q=" + this.value + "&api_key=" + key + "&limit=" + limit + "&rating=g&rating=pg&offset=" + offset);
        //if search has been used, make a call using the search term value
    } else if (searchPressed) {
        url = $.get("https://api.giphy.com/v1/gifs/search?q=" + searchTerm + "&api_key=" + key + "&limit=" + limit + "&rating=g&rating=pg&offset=" + offset);
    }
    url.done(function (result) {
        for (var i = 0; i <= result.data.length - 1; i++) {
            var containerGif = $("<div>");
            containerGif.addClass("grid-item");
            var img = $("<img>");
            img.addClass("one-gif")
            img.attr("data-state", "still")
            img.attr("moving", result.data[i].images.fixed_height.url);
            img.attr("still", result.data[i].images.fixed_height_still.url);
            img.attr("src", result.data[i].images.fixed_height_still.url);
            containerGif.append(img);
            var p = $("<div>");
            p.addClass("rating");
            p.text("rating is : " + result.data[i].rating.toUpperCase())
            containerGif.append(p);
            $(".grid-container").append(containerGif);

        }

        searchPressed = false;
    });

}


//_______________________________________ WIKIPEDIA _______________________

function getWikipedia() {
    $(".wikipedia").remove();

    if (!searchPressed) {
        url = "https://www.wikipedia.org//w/api.php?action=query&format=json&list=search&srsearch=" +
            this.value +
            "&srnamespace=0&srlimit=10&callback=?"
        //if search has been used, make a call using the search term value
    } else if (searchPressed) {
        url = "https://www.wikipedia.org//w/api.php?action=query&format=json&list=search&srsearch=" +
            searchTerm +
            "&srnamespace=0&srlimit=10&callback=?"
    }

    $.getJSON(url, function (data) {
        console.log(url);
        console.log(data);
        $(".input-container").append('<div class="wikipedia">' + data.query.search[0].snippet + '...' + '<a href=https://en.wikipedia.org/?curid=' + data.query.search[0].pageid + '" target="_blank"><button id="read-btn"  > read more </button>' + '</div></a>');
        $(".input-container").append();
    })
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

//__________________________________________  FAVORITES ___________________________

// var favoritesArr = [];
favoritesArr = JSON.parse(localStorage.getItem("favoritesArr"));
console.log("new version of favorites");
if (!Array.isArray(favoritesArr)) {
    console.log('favorites arr Not an array')
    favoritesArr = [];
} else {
    console.log('Is an array')
}

function saveToFavorites() {
    $(".favorites").append($(this).clone());
    var innerArr = [];
    innerArr.push($(this).attr("moving"));
    innerArr.push($(this).attr("still"));
    console.log(favoritesArr);
    console.log(innerArr);
    favoritesArr.push(innerArr);
    localStorage.setItem("favoritesArr", JSON.stringify(favoritesArr));
}

function getFavorites() {
    // $(".favorites").empty();
    if (!Array.isArray(getFavoritesArr)) {
        console.log('Not an array')
        getFavoritesArr = [];
    } else {
        console.log('Is an array')

    }
    var getFavoritesArr = [];
    getFavoritesArr = JSON.parse(localStorage.getItem("favoritesArr"));
    if (getFavoritesArr != null && getFavoritesArr.length < 1) {
        for (var i = 0; i < getFavoritesArr.length; i++) {
            var img = $("<img>");
            img.addClass("one-gif")
            img.attr("data-state", "still")
            img.attr("moving", getFavoritesArr[i][0]);
            img.attr("still", getFavoritesArr[i][1]);
            img.attr("src", getFavoritesArr[i][1]);
            $(".favorites").append(img);
        }
    }
}

var favoritesClicked = false
$("#favorites-btn-menu").click(function () {
    if (!favoritesClicked) {
        // scrollTo(".favorites");
        $(".favorites").css("display", "block");
        $(".fa-window-close").css("display", "block");
        favoritesClicked = true;
    } else if (favoritesClicked) {
        $(".fa-window-close").css("display", "none");
        $(".favorites").css("display", "none");
        favoritesClicked = false;
    }
})




//__________________________________________CALL FUNCTIONS BUTTONS___________________________
//function calls1
$(document).on("click", ".btn", getGifs);
$(document).on("click", ".btn", getWikipedia);
$(document).on("click", ".btn-mobile", getGifs);
$(document).on("click", ".btn-mobile", getWikipedia);

$(document).on("click", ".btn-mobile", hideMobileBtns);
$(document).on("click", ".one-gif", switchGifs);
$(document).on("dblclick", ".one-gif", saveToFavorites);