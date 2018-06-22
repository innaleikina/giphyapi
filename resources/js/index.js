var key = "jYTfzlUXqx607nu91cb320GgiFkNNk6T";

var topics = ["soccer", "football", "tennis", "badminton", "gymnastics", "baseball", "track", "swimming", "cheerleading", "dancing", "curling"];

var gifClicked = false;

generateButtons();

//use attribute to store moving and still images inside the html divs 
$("#add-search-term").click(function () {
    event.preventDefault();
    if ($("#search-term").val().trim().length > 0) {
        var newButton = $("<button>");
        var searchTerm = $("#search-term").val().trim();
        topics.push(searchTerm);
        generateButtons();
    } else {
        alert("Please enter a search term");
    }

})

function generateButtons() {
    $("#btn-container").empty();
    for (var i = 0; i < topics.length; i++) {
        $("#btn-container").append('<button class="btn-style btn" value="' + topics[i] + '">' + topics[i] + '</button>');
    }
}


function getGifs() {
    $(".grid-container").empty();
    var xhr = $.get("https://api.giphy.com/v1/gifs/search?q=" + this.value + "&api_key=" + key + "&limit=10&rating=g&rating=pg");
    xhr.done(function (result) {
        console.log(result);

        for (var i = 0; i <= result.data.length - 1; i++) {
            var container = $("<div>");
            container.addClass("grid-item");
            var img = $("<img>");
            img.addClass("one-gif")
            img.attr("moving", result.data[i].images.fixed_height.url);
            img.attr("still", result.data[i].images.fixed_height_still.url);
            img.attr("src", result.data[i].images.fixed_height_still.url);
            container.append(img);
            var p = $("<div>");
            p.addClass("rating");
            p.text(result.data[i].rating.toUpperCase())
            container.append(p);
            $(".grid-container").append(container);
        }
    });

}

function switchGifs() {
    //console.log("switch will work " + $(this).attr("moving"));
    if (!gifClicked) {
        $(this).attr("src", $(this).attr("moving"))
        gifClicked = true;
    } else if (gifClicked) {
        $(this).attr("src", $(this).attr("still"));
        gifClicked = false;
    }
}

$(document).on("click", ".btn", getGifs);
$(document).on("click", ".one-gif", switchGifs);