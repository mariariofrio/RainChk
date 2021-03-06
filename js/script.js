//Project 1 for Group 2 GT Full Stack Dev Flex 2020
console.log("found js file!!");
var imBoredObj; //global variable to pass between functions-DW
//todoInput variable for textarea input
var todoInput;

//URL variable for OpenWeatherAPI
var queryURLforecast;

//intially set weatherModal to false/if true display 5dayforecast in modal
var weatherModal = false;

//getCity variable for City input on Weather page
var getCity = "Athens,us";

//var url = https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&appid={YOUR API KEY}
const openWeatherapi = {
    key: "appid=ab222fde8a40e718d2b8f92721309596",
    base: "https://api.openweathermap.org/data/2.5/",
    units: "&units=imperial&",
    uvi: "uvi?"
}
//Example BoredAPI URL: "http://www.boredapi.com/api/activity?minaccessibility=0&maxaccessibility=0.1"
const imBoredapi = {
    base: "https://www.boredapi.com/api/activity",
    participants: "participants=",
    minaccessibility: "minaccessibility=0",
    maxaccessibility: "maxaccessibility=0.1"
}
//check getCity input for empty string
function checkCity(getCity) {
    console.log("line 33 in checkCity: ", getCity);
    if (!getCity) {//if emptystring display an alert
        $(".notification").removeClass("is-hidden"); //unhide alert
        $(".notification").text("No City Entered to Search.");
        $(".notification").append("<button class='delete' id='alertClose'></button>");
        $(document).on("click", "#alertClose", function () {
            $(".notification").addClass("is-hidden");
        });

    }
    else {
        console.log("going to buildURL", getCity);
        // searchHistory.unshift(getCity);
        //$(".notification").hide();
        buildURL(getCity);
    }
}

function buildURL(getCity) { //
    if (!getCity) {
        console.log("line 53 getCity emptystring", getCity);
        //queryURL = getLocation();
        //console.log("going to getLocation");
        // queryURL = getLocation(getCity);
    }
    else {
        queryURLforecast = openWeatherapi.base + "forecast?q=" + getCity + openWeatherapi.units + openWeatherapi.key;
        console.log("line 62 forecast URL:", queryURLforecast);
        queryURLcurrent = openWeatherapi.base + "weather?q=" + getCity + openWeatherapi.units + openWeatherapi.key;
    }
    //get the current weather
    $.ajax({
        url: queryURLcurrent,
        method: "GET"
    })
        .then(function (response) {
            console.log("line 74 URL Sent: ", queryURLcurrent);
            console.log("response: ", response);
            console.log("Line 76 response.name: ", response.name);
            var currentLat = response.coord.lat;
            var currentLon = response.coord.lon;
            console.log("Line 79 Current Lat & Long: ", response.coord.lat, ",", response.coord.lon);
            getCity = response.name;
            var currentCoord = { "lat": currentLat, "lon": currentLon };
            var currrentIcon = response.weather[0].icon;
            $("#searchCity").html("<strong>" + " " + response.name + "</strong>");
            console.log("currentLat: ", currentLat, "currentLon: ", currentLon);
            //uvIndex(currentLat, currentLon);
            //var cityListGroup = $("<ul class='list-group'>");
            //var cityListGroupItem = $("<li class='list-group-item'>");
            //var cityName = response.name;
            var iconCode = response.weather[0].icon;
            console.log(" Line 90 current: ", iconCode);
            var iconUrl = "https://openweathermap.org/img/w/" + iconCode + ".png";
            console.log("line 92 current weatherIconURL: ", iconUrl);
            $("#weatherIcon").html("<strong>Current Weather is: </strong><img src='" + iconUrl + "'>");
            $("#search-city-temp").html("<strong>" + response.main.temp + "&deg;F</strong>");
            //add to searched list
            //var found = searchHistory.find(city => city === getCity)
            // if(!found){
            //     searchHistory.push(getCity)
            //     localStorage.setItem("city", JSON.stringify(searchHistory));
            //     renderBtns(getCity);
            // }
            forecastAPI();
        })
        .catch(function (error) {
            console.log("Unable to reach OpenWeatherAPI:", error);
            $(".notification").html("No City found matching your Search.<br> Try City,St,US for an exact match.");
            $(".notification").append("<button class='delete' id='alertClose'></button>");
            $(".notification").removeClass("is-hidden");
            $(document).on("click", "#alertClose", function () {
                $(".notification").addClass("is-hidden");
            });
        });
}

//OpenWeatherAPI Call
function forecastAPI() {
    $.ajax({
        url: queryURLforecast,
        method: "GET"
    })
        .then(function (response) {
            console.log("URL Sent: ", queryURLforecast);
            console.log("forcast: ", response);
            console.log("line 126 temp5: ", response.list[4].main.temp_max);
            $("#weather").html("<p class='modal-card-title'>" + response.city.name + "  5 Day Weather Forecast</p>");
            $(".parentWeather").empty();
            for (var i = 0; i < 5; i++) {
                let currentConditions = response.list[i].weather[0].description;
                currentConditions = currentConditions.toUpperCase();
                console.log("line 135 CurrentConditions: ", currentConditions);
                var todoDate = moment().add(i, 'days').format('ddd, MMMM Do');
                let myDay = moment().add(i, 'days').format('dddd, MMMM Do');
                let nextDay = "#modalDay" + i;
                console.log("line 135 In for loop :", nextDay, i);

                let myIconCode = response.list[i].weather[0].icon;
                myIconUrl = "https://openweathermap.org/img/w/" + myIconCode + ".png";


                console.log("Line 140 weatherModal =", weatherModal);
                if (weatherModal) {
                    var weatherDiv = $('<div class="card weather-card" id="weather">');

                    var card = `                                       
                            <div class="card weather-card" id="weather">
                                <header class="card-header modalIcon" id="modalday${i}">
                                <p class="card-header-title" id="${'modalDay' + i}">${myDay}<img src="${myIconUrl}"></p>
                                </header>
                                <div class="card-content is-size-6">
                                    Conditions: ${currentConditions}<br>
                                    Current Temp: ${response.list[i].main.temp} &deg;F<br>
                                    Low Temp: ${response.list[i].main.temp_min} &deg;F<br>
                                    Hi Temp: ${response.list[i].main.temp_max} &deg;F<br>
                                    Humidity: ${response.list[i].main.humidity} %<br>
                                    Wind: ${response.list[i].wind.speed} MPH<br>
                                <div class="content" id="day${i}">                                            
                            </div>
                            </div>
                        </div>`

                    $(".parentWeather").append(card);

                    //captures click on "Cancel" button to close modal for "Weather" link
                    $(document).on("click", "#Weather-cancel-btn", function() {
                        $("#5dayForecast").removeClass("is-active");
                        weatherModal = false;
                    });
                    //captures click to close modal for "Weather" link
                    $("#Weather-modal-close").click(function() {
                        $("#5dayForecast").removeClass("is-active");
                        weatherModal = false;
                    });
                }
                else {
                    let todoDay = document.querySelector(".day" + i);
                    console.log("Line 186 Todo day list", todoDay);
                    document.querySelector(".day" + i);

                    $(todoDay).html(todoDate + "<img src=" + myIconUrl + ">");
                }
                $(".forcastIcon").append("<img src=" + myIconUrl + ">");
                let myTemp = response.list[i].main.temp_max;
                $(nextDay + "-temp").text("Temp: " + myTemp + "°F");
                let myHumidity = response.list[i].main.humidity;
                $(nextDay + "-humd").text("Humidity: " + myHumidity + "%");
            }
            console.log("line 182 weatherModal=", weatherModal);


        })
        .catch(function (error) {
            console.log("OpenWeatherAPI error:", error);

        });
};

//API call to BOREDAPI and Modal functionality
function imBored() {
    let queryURL = imBoredapi.base;
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            console.log("URL Sent: ", queryURL);
            console.log("response: ", response);
            let modalMessage = ("Activity Type: " + response.type + "<br>" + "Activity: " + response.activity + "<br>" + "# of Participants: " + response.participants);
            $("#imBoredMessage").html(modalMessage);

            //captures click on "Cancel" button to close modal for "I'm Bored!" link
            $(document).on("click", "#cancel-btn", function () {
                $(".modal").removeClass("is-active");
            });
            //captures click to close modal for "I'm Bored!" link
            $("#modal-close").click(function () {
                $(".modal").removeClass("is-active");
                let modalMessage = "";
            });
            //captures click to save activity to ToDo list.
            $(document).on("click", "#save-imbored", function () {
                console.log("line 215 Save button clicked", response.type);
                //saved I'mBored API response to "imBoredObj" to be passed to ToDo list
                imBoredObj = response;
                todoInput = imBoredObj.activity;
                console.log("New variable todoInput", todoInput);
                $("#todoInput").val(imBoredObj.activity);
                console.log("Activity: ", imBoredObj.activity);
                $(".modal").removeClass("is-active");

            });
        });
}
//Captures Click to Next button in I'm Bored Modal            
$(document).on("click", "#next-imbored", function () {
    console.log("line 230 next button clicked");
    //Next I'mBored API to be cycled to the next activity
    imBored();
});
//click funtion to capture click on "I'm Bored!" link             
$("#imbored-modal").on("click", function () {
    $("#imBored").addClass("is-active");
    imBored();
});

//Captures click on "Weather" link
$(document).on("click", "#weatherLink", function () {
    getCity = $("#getCity").val();
    console.log("Line 243 Value of getCity: ", getCity)
    if (!getCity) {  //checking to see if anything was entered into search prior to going Modal
        checkCity(getCity);
    }
    else {
        console.log("Got Input: ", getCity);
        weatherModal = true;
        console.log("line 250 weatherModal=", weatherModal);
        //render 5 day forecast modal
        $("#5dayForecast").addClass("is-active");
        checkCity(getCity);//got to check city to verify input
    }
});

//City Weather Search button
$(document).on("click", "#locationInputBtn", function () {
    getCity = $("#getCity").val();
    checkCity(getCity); //calls checkCity function to check for valid search
})

function displayDates() {
    (showDate.innerHTML = date)
};

//for loop to put dates/days on tasklist
for (let i = 0; i < 5; i++) {
    var date = moment().add(i, 'days').format('ddd, MMMM Do');
    var showDate = document.querySelector(".day" + i);
    var dropDown = document.getElementById("#dropDay" + i);
    showDate.innerHTML = date;
    displayDates(showDate);
};


// Function to add task to input
$(document).ready(function () {
    $('#subTask').on("click", function () {
        var date = $(".taskDate").val();
        console.log("Line 310 taskDate value: ", date)
        $(`#${date.toLowerCase()}-list`).append(`<li>${$('#todoInput').val()}<span>
    <button class="clearTask"> Clear</button> </span> </li>`)
    })
})


//function to remove list items
$(document).on("click", ".clearTask", function () {
    $(this).parents('li').remove();
});