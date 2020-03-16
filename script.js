$(document).ready(function() {
	createHistory();
	var userInput = "";
	//populate current forecast with dummy values
	name = "Current City";
	city_temp = "Current Temperature";
	humidity = "Current Humidity";
	windspeed = "Current Windspeed";
	// UV = "Current UV"
	currentForecast(
		(todayName = name),
		(todayTemp = city_temp),
		(todayHumidity = humidity),
		(todayWindspeed = windspeed),
	);

	forecastDate = "2999-01-01";
	forecastIcon = "10d";
	avgTemp = 99.99;
	avgHumidity = 99;

	var row = $("#forecast-cards").empty();
	for (var i = 0; i < 5; i++) {
		createForecastCards(
			(row = row),
			(forecastDate = forecastDate),
			(forecastIcon = forecastIcon),
			(avgTemp = avgTemp),
			(avgHumidity = avgHumidity),
		);
	}

	// var lastCity = getLastCity();

	// if (lastCity) {
	// 	var cityInformation = getInformation(lastCity);
	// 	showInformation(cityInformation);
	// }
  var lastCity = getLastCity();
  if (lastCity){
    showClimate(lastCity);
  } 

});

//this function returns the last city
function getLastCity() {
	const cities = localStorage.getItem("cities");
	let storedCitiesArray = [];
	if (cities !== null) {
    storedCitiesArray = cities.split(",");
    return storedCitiesArray[storedCitiesArray.length - 1]
  }
  return false; //return "false" if there is nothing in localStorage
}

function showClimate(city) {
	var city = city.toLowerCase();
	var queryURL =
		"https://api.openweathermap.org/data/2.5/forecast?q=" +
		city +
		"&units=metric&appid=6baa0f7e83a45741c1ada56022ce6f8e";

	$.ajax({
		url: queryURL,
		method: "GET",
	}).then(function(response) {
		name = response.city.name;
		city_temp = response.list[0].main.temp;
		humidity = response.list[0].main.humidity;
		windspeed = response.list[0].wind.speed;
		forecastDate = response.list[0].dt_txt;
		forecastIcon = response.list[0].weather[0].icon;
		forecastTemp = response.list[0].main.temp;
		forecastHumidity = response.list[0].main.humidity;
		currentForecast(name, city_temp, humidity, windspeed);

		avgTempArray = calculateTempAverage(response);
		avgHumidityArray = calculateHumidityAverage(response);
		var row = $("#forecast-cards").empty();
		for (var i = 0; i < 5; i++) {
			avgTemp = avgTempArray[i];
			avgHumidity = avgHumidityArray[i];
			createForecastCards(
				row,
				forecastDate,
				forecastIcon,
				avgTemp,
				avgHumidity,
			);
		}
	});
}

function calculateTempAverage(response) {
	dailyTempAverage = [];
	// console.log(typeof(dailyTempAverage))
	for (var j = 0; j < 5; j++) {
		forecastTempAverage = 0;

		for (var i = j; i < 40; i++) {
			forecastTempAverage += response.list[i].main.temp;
		}
		forecastTempAverage = Math.floor(
			forecastTempAverage / 8,
		);
		dailyTempAverage.push(forecastTempAverage);
	}
	return dailyTempAverage;
}

function calculateHumidityAverage(response) {
	dailyHumidityAverage = [];
	for (var j = 0; j < 5; j++) {
		forecastHumidityAverage = 0;
		for (var i = j; i < 40; i++) {
			forecastHumidityAverage +=
				response.list[i].main.humidity;
		}
		forecastHumidityAverage = Math.floor(
			forecastHumidityAverage)/8;
		dailyHumidityAverage.push(forecastHumidityAverage);
	}
	return dailyHumidityAverage;
}

function cardDate() {
	for (var i = 0; i < 5; i++) {
		// title = moment()
		// 	.add(1, "days")
    //   .format("MMMM Do YYYY");
	}
}

function currentForecast(
	todayName,
	todayTemp,
	todayHumidity,
	todayWindspeed,
) {
	var todayName = $("<h1>").text(
		todayName + " - " + moment().format("MMMM Do YYYY"),
	);
	var todayTemp = $("<p>").text(
		"Temperature: " + city_temp + "°C",
	);
	var todayHumidity = $("<p>").text(
		"Humidity: " + humidity,
	);
	var todayWindspeed = $("<p>").text(
		"Wind Speed: " + windspeed,
	);

	var row1 = todayName;
	var row2 = $("<row>").append(todayTemp);
	var row3 = $("<row>").append(todayHumidity);
	var row4 = $("<row>").append(todayWindspeed);

	$("#weather-today").empty();
	$("#weather-today").append(row1, row2, row3, row4);
}

//creating the forecast cards within a loop
function createForecastCards(
	row,
	forecastDate,
	forecastIcon,
	avgTemp,
	avgHumidity,
) {
	const title = $("<h5>")
		.addClass("card-title")
		.text(forecastDate);

	const icon = $("<img>")
		.attr(
			"src",
			"http://openweathermap.org/img/wn/" +
				forecastIcon +
				"@2x.png",
		)
		.addClass("card-text");

	const temptext = $("<p>")
		.addClass("card-text")
		.text("Temperature: " + avgTemp + "°C");

	const humiditytext = $("<p>")
		.addClass("card-text")
		.text("Humidity: " + avgHumidity);

	const cardBody = $("<div>")
		.addClass("card-body")
		.append(title, icon, temptext, humiditytext);

	const card = $("<div>")
		.addClass("card text-center text-white bg-dark")
		.append(cardBody);

	const column = $("<div>")
		.addClass("col-sm-3")
		.attr("id", "forecast-columns")
		.append(card);

	row.append(column);

	cardDate();
}

function createHistory() {
	const column = $("#city-list").empty();
	const cities = localStorage.getItem("cities");
	let storedCitiesArray = [];
	if (cities !== null) {
		storedCitiesArray = cities.split(",");
	}
	console.log(
		storedCitiesArray[storedCitiesArray.length - 1],
	);
	storedCitiesArray.forEach(function(citylist) {
		const city = $("<button>")
			.addClass("list-group-item")
			.attr("value", "")
			.text(citylist);
		column.prepend(city);
	});
}

$("#button-id").on("click", function(event) {
	event.preventDefault();
	userInput = $("#search-text-box")
		.val()
		.trim();
	//populating history list
	var storedCitiesArray = [];
	var storedCities = localStorage.getItem("cities");
	if (storedCities == null) {
		storedCities = "";
		storedCitiesArray = storedCities.split(",");
		storedCitiesArray.push(userInput);
		storedCitiesArray = storedCitiesArray.splice(1);
		localStorage.setItem("cities", storedCitiesArray);
	} else {
		if (userInput != "") {
			storedCitiesArray = storedCities.split(",");
			storedCitiesArray.push(userInput);
			localStorage.setItem("cities", storedCitiesArray);
			$("#search-text-box").val("");
		}
	}
	createHistory();
	//populating current forecast
	showClimate(userInput);
});

//this event loads the climate for this clicked city within the history list 
$("#city-list").on("click", function(event) {
  event.preventDefault();
  //event.target is the element that we clicked. This refers to the innerHTML of our history list
  showClimate(event.target.innerHTML)
});
