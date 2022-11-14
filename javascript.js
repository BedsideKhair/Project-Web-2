//Data: assume we have a list of top 5 movies - a list of JAVASCRIPT Objects
let topMovies = [{id: 0, title: "The Shawshank Redemption", year: 1994, image_url: "MEDIA/movie0.jpg"},
				 {id: 1, title: "The Godfather ", year: 1972, image_url: "MEDIA/movie1.jpg"},
				 {id: 2, title: "The Dark Knight", year: 2008, image_url: "MEDIA/movie2.jpg"},
			     {id: 3, title: "12 Angry Men", year: 1957, image_url: "MEDIA/movie3.jpg"},
			     {id: 4, title: " Schindler\'s List", year: 1993, image_url: "MEDIA/movie4.jpg"},
				];

//------------------------------------------------------------------------------------------------------
//Service Fee: $85 if the customer’s phone is "not warranty", else $0.00
//------------------------------------------------------------------------------------------------------
$('#warranty').on('change', function(){
	if (this.checked) {
		$('#serviceFee').val('0.00');
  } else {
		$('#serviceFee').val('85.00');		
  }
});


//------------------------------------------------------------------------------------------------------
//Bond: the cost for a courtesy phone (and charger) only if the customer is a “consumer” type.
//      If customer is "business", no bond is required.
//------------------------------------------------------------------------------------------------------
//Assume there is a list of courtesy items as below:
let courtesyList = [{item: 'iPhone', bond: 275},
					{item: 'otherPhone', bond: 100},
					{item: 'charger', bond: 30}
				   ];
				   
//We will use "appState" object to track the form change when users interact with the app			   
let appState = {customerType: 'customer',
				courtesyPhone: {item: 'none', bond: 0 },//Allow to borrow ONLY 1 phone
				courtesyCharger: {item: 'none', bond: 0}//Allow to borrow ONLY 1 charger
			  };		  

//-------------------------
//Handle click "add" button event:
$('#addBtn').click(function(clickEvent){
	//The preventDefault() method cancels the default action that belongs to the event
	//https://www.w3schools.com/jsref/event_preventdefault.asp
	clickEvent.preventDefault();
	
	//Get selected item from id="itemList"
	let selectedItemText = $('#itemList').find(":selected").text();//Get selected "option" text
	let selectedItemValue = $('#itemList').find(":selected").val();//Get selected "option" value
	let selectedItemBond = courtesyList.find(foundItem => foundItem.item.toLowerCase() == selectedItemValue.toLowerCase()).bond;
	
	//Build HMLT (render) new row:
	let newRow = `
				<tr class="selected-item">
					<td class="itemID" style="display: none;">${selectedItemValue}</td>
					<td>${selectedItemText}</td>
					<td>${selectedItemBond}</td>
				</tr>			
			`;
	
	//Add this new row of selected item to the table id="borrowItems" if it's not exist yet.
	if (selectedItemValue.toLowerCase().includes("phone") && (appState.courtesyPhone.item == "none")) {
		//Append new row to the table
		$('#borrowItems').append(newRow);
		//Update appState object
		appState.courtesyPhone.item = selectedItemValue;
		appState.courtesyPhone.bond = selectedItemBond;
		appState.courtesyPhone.totalFee = selectedItemValue;
		//Update the "bond" element on UI
		if ($('#customerType').is(':checked')) {
			$('#bond').val(appState.courtesyPhone.bond + appState.courtesyCharger.bond);
		} else {
			$('#bond').val(0);
		}			
	} else if (selectedItemValue.toLowerCase().includes("charger") && (appState.courtesyCharger.item == "none")) {
		//Append new row to the table
		$('#borrowItems').append(newRow);
		//Update appState object
		appState.courtesyCharger.item = selectedItemValue;
		appState.courtesyCharger.bond = selectedItemBond;
		appState.courtesyPhone.totalFee = selectedItemValue;
		//Update the "bond" element on UI
		if ($('#customerType').is(':checked')) {
			$('#bond').val(appState.courtesyPhone.bond + appState.courtesyCharger.bond);
		} else {
			$('#bond').val(0);
		}		
	} else {
		//The item was already added
		alert("The item was already added");		
	}

});

//------------------------------------------------------------------------------------------------------
//Handle click "remove" button event:
$('#removeBtn').click(function(clickEvent){
	clickEvent.preventDefault();		
	$('.selected-item').remove();	
	//Update bond
	$('#bond').val(0.00);
	//Update appState object
	appState.courtesyPhone = {item: 'none', bond: 0 };
	appState.courtesyCharger = {item: 'none', bond: 0 };
});

//------------------------------------------------------------------------------------------------------
//Update customerType when user clicks "Customer Type" radio buttons:
$("#customerType").click(function(){    
	//Update appState: customerType and bond displaying on UI
	appState.customerType = 'customer';
	$('#bond').val(appState.courtesyPhone.bond + appState.courtesyCharger.bond);
});	
$("#businessType").click(function(){        
	appState.customerType = 'business';
	$('#bond').val(0);
});	


//------------------------------------------------------------------------------------------------------
//Submit: Validate form using HTML technique & pop up repair-booking.hmtl page
//------------------------------------------------------------------------------------------------------
$('#repair-booking').submit(function(e) {
	//1: preventDefault() method cancels the default action that belongs to the event
	e.preventDefault();
	
	//2: Store "repair-booking-data" in localStorage and send it to "repair-booking.html" webpage
							   //Customer details
	let repairBookingData = {title: $('#title').val(),
							   firstname: $('#fname').val(),
							   lastname: $('#lname').val(),
							   street: $('#street').val(),
							   suburb: $('#suburb').val(),
							   city: $('#city').val(),
							   
							   //repair details
							   purchasedate: $('#purchaseDate').val(),
							   repairdate: $('#repairDate').val(),
							   underwarranty: $('#warranty').val(),
							   imeinumber: $('#imei').val(),
							   devicemake: $('#make').val(),
							   modelnumber: $('#modelNumber').val(),
							   faultcategory: $('#faultCategory').val(),
							   description: $('#description').val(),
							   
							   //Courtesy Loan Device Details
							   item: $('#itemList').val(),
							   cost: $('#borrowItems').val(),
							   bond: $('#bond').val(),
							   servicefee: $('#serviceFee').val(),
							   total: $('#totalFee').val(),
							   gst: $('#gstFee').val(),
							   totalgst: $('#totalGst').val()};
							   

	//3: Convert "repair-booking-data" object to JSON string
	localStorage.setItem("repair-booking-data", JSON.stringify(repairBookingData));
	console.log(JSON.stringify(repairBookingData));
	
	//4: Open repair-booking.html
	window.open("repair-booking.html");//Open on new window
	//window.location.href = "invoice.html"; //open on the same window	
});

//------------------------------------------------------------------------------------------------------
//loadRepairBooking data 
function loadRepairBooking() {
	//Get data sent from index.html stored in local storage
	let passedData = localStorage.getItem("repair-booking-data");
	console.log(passedData);
	//
	let extractedData = JSON.parse(passedData);
	//
	//customer details
	document.getElementById("title").innerHTML = extractedData.title;
	document.getElementById("firstname").innerHTML = extractedData.firstname;
	document.getElementById("lastname").innerHTML = extractedData.lastname;
	document.getElementById("street").innerHTML = extractedData.street;
	document.getElementById("suburb").innerHTML = extractedData.suburb;
	document.getElementById("city").innerHTML = extractedData.city;
	//
	//repair details
	document.getElementById("purchasedate").innerHTML = extractedData.purchasedate;
	document.getElementById("repairdate").innerHTML = extractedData.repairdate;
	document.getElementById("underwarranty").innerHTML = extractedData.underwarranty;
	document.getElementById("imeinumber").innerHTML = extractedData.imeinumber;
	document.getElementById("devicemake").innerHTML = extractedData.devicemake;
	document.getElementById("modelnumber").innerHTML = extractedData.modelnumber;
	document.getElementById("faultcategory").innerHTML = extractedData.faultcategory;
	document.getElementById("description").innerHTML = extractedData.description;
	//
	//courtesy loan details
	document.getElementById("item").innerHTML = extractedData.item;
	document.getElementById("cost").innerHTML = extractedData.cost;
	document.getElementById("bond").innerHTML = extractedData.bond;
	document.getElementById("servicefee").innerHTML = extractedData.servicefee;
	document.getElementById("total").innerHTML = extractedData.total;
	document.getElementById("gst").innerHTML = extractedData.gst;
	document.getElementById("totalgst").innerHTML = extractedData.totalgst;
}

//------------------------------------------------------------------------------------------------------
//JQUERY: AJAX
//Link: https://www.tutorialsteacher.com/jquery/jquery-ajax-introduction
let proxy = 'https://cors-anywhere.herokuapp.com/' ;
let json_url = "http://danieldangs.com/itwd6408/json/faqs.json";
//Use Jquery method to load Json file
$.getJSON(
proxy + json_url, 
function(data) {//Get json file and assign it to "data"
	//Loop through all the questions and extract its question & answer
	console.log(data);
	$.each(data, function(i, question) {//i: index, question: object
	//Extract question and answer display on webpage
				let node = '<div class="col-12 col-md-6 p-2">' +
					'<div class="bg-warning h-100 p-2">' +
						'<h4>' + question.question + '</h4>' +
						'<p>' + question.answer + '</p>' +
					'<div>' +
				'</div>';
			$('#questions').append(node)
		});
	}
);

//Filter or search function
$("#search-box").on("keyup", function() {
	//Get entered keywords
	let keywords = $(this).val().toLowerCase();
	//Loop through all questions (wrapped in <div> element inside "questions" section),
	// find all question/answer containing keywords
	$("#questions div").filter(function() {
		//Keep displaying all element containing the keyword
		$(this).toggle($(this).html().toLowerCase().indexOf(keywords) > -1); //indexOf(keywords) returns "-1"
		//if not containing the keyword
	});
});

//------------------------------------------------------------------------------------------------------
//Use JQuery to manipulate CSS style
$('h2').css({
  'background-color': 'gray',
  'text-align': 'center',
  'border': 'solid 2px green',
  'padding': '20px',
  'color': 'red'
});

//------------------------------------------------------------------------------------------------------	
//User preferences

//Use Local Storage API to store and retrieve the above preferences: bg-color & font-size
//On client side and store it permanently
//Link: LocalStorage API: https://www.w3schools.com/jsref/prop_win_localstorage.asp	
//Use Session Storage API to store and retrieve the above preferences: bg-color & font-size
//On client side and store temporarily, will be cleared when the tab or window is closed.
//Link: SessionStorage API: https://www.w3schools.com/jsref/prop_win_sessionstorage.asp
					
$(document).ready(function() {			
		//----------------------
		//Initally, read and set preferences if any
		if (localStorage.getItem("color_preference") != null) {
			$('#customization-card').css('background-color', localStorage.getItem("color_preference"));
	}	
		if (localStorage.getItem("size_preference") != null) {
			$('#customization-card').css('font-size', localStorage.getItem("size_preference"));
	}							
		//----------------------
		//When color is changed, Change background color accordingly
	$('#colorOption').change(function() {
		//Get selected color & change the background color accordingly	
		//Link: JQuery css(): https://api.jquery.com/css/		
		//Link: JQuery find(): https://api.jquery.com/find/#find-selector
		$('#customization-card').css('background-color', $('#colorOption').find(":selected").val());	
		//Store this selected color locally & permanently on client side.	
		//Link: https://www.w3schools.com/html/html5_webstorage.asp				
		localStorage.setItem("color_preference", $('#colorOption').find(":selected").val());				
		//Read stored color and show on console.
		console.log(localStorage.getItem("color_preference"));
	});			 
								//When text size is changed, Change text size
	$('#sizeOption').change(function() {
		$('#customization-card').css('font-size', $('#sizeOption').find(":selected").val());	
		localStorage.setItem("size_preference", $('#sizeOption').find(":selected").val());	
		console.log(localStorage.getItem("size_preference"));				
	});
});

//------------------------------------------------------------------------------------------------------	
//Drag and Drop (broken)
//this code was suppose to allow the user to drag and drop an item but this code is broken
//due to an error saying that draggable isnt a function. I tried using different jquery libraries 
//to fix this problem but at the end I couldn't. Therefore I have to leave this code out as 
//it also breaks the entire webpage as well. leaving other demos broken as well

//$(".box" ).draggable({
//  scope: 'demoBox',
//  revertDuration: 100,
//  start: function( event, ui ) {
    //Reset
//    $( ".box" ).draggable( "option", "revert", true );
//    $('.result').html('-');
//  }
//});

//$(".drag-area" ).droppable({
//   scope: 'demoBox',
//   drop: function( event, ui ) {
//     let area = $(this).find(".drop-area").html();
//     let box = $(ui.draggable).html();     
//     $( ".box" ).draggable( "option", "revert", false );     
	 //Display action in text
//     $('.result').html("[Action] <b>" + box + "</b>" +
//                       " dropped on " + 
//                       "<b>" + area + "</b>");
     //Re-align item
//     $(ui.draggable).detach().css({top: 0,left: 0}).appendTo(this);
//   }
//})
//------------------------------------------------------------------------------------------------------
//File uploading
const image_input = document.querySelector("#image-input");

image_input.addEventListener("change", function() {
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    const uploaded_image = reader.result;
    document.querySelector("#display-image").style.backgroundImage = `url(${uploaded_image})`;
  });
  reader.readAsDataURL(this.files[0]);
});
//------------------------------------------------------------------------------------------------------
//interactive map
$('svg path').each(function(index, item) {
    var id = $(item).attr('id');
        
    $('svg #' + id).on('click', function(e) {
        var id = $(e.currentTarget).attr('id');
        $('svg path').removeClass('active');
        $(e.currentTarget).addClass('active');
        window.alert(id + ' Clicked');
    });
});

//------------------------------------------------------------------------------------------------------
//HTML Geolocation (broken code)
//this code suppose to allow users to press a button to get the 
//location of the nearest shop but for no reason the button causes 
//the page to be reloaded and doenst view the location of the nearest shop
let x = document.getElementById("location");

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else { 
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  x.innerHTML = "Latitude: " + position.coords.latitude + 
    "<br>Longitude: " + position.coords.longitude;
}  
