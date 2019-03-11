//Global vars
var database = firebase.database();

//
var trainName = "";
var trainDestination = "";
var firstTrainTime = "";
var trainFrequency = 0;
var validTrainRow;

//This var is used to append numbers to the left side of the table in order
var lastTrainIndex = 1;

//

function addTrain() {

    var invalidNums = /^[0-9]^\072/gi; //Checked against time to make sure it's only made up of numbers and a :
    var validNums = /[0-9]/gi; //Checked against frequency input to make sure it's an integer
    var alphaNumerics = /^[a-z0-9]^\s/gi; //Checked against name/destination to make sure it's only letters, numbers, and spaces

    var validName = false;
    var validDest = false;
    var validTime = false;
    var validFreq = false;

    //Makes sure train name is correct length and characters
    if ($("#input-train-name").val().length < 21 && $("#input-train-name").val().trim().length > 0 && alphaNumerics.test($("#input-train-name").val().toString().trim()) === false) {
        trainName = $("#input-train-name").val().trim();
        validName = true;
/*         console.log("Name Checked"); */
    };
    //Makes sure destination is correct length and characters
    if ($("#input-train-destination").val().length < 21 && $("#input-train-destination").val().trim().length > 0 && alphaNumerics.test($("#input-train-destination").val().toString().trim()) === false) {
        trainDestination = $("#input-train-destination").val().trim();
        validDest = true;
/*         console.log("Destination Checked"); */
    };
    //Checks input arrival time against several factors. Makes sure it is 5 characters long
    //Makes sure the first two numbers are between 00 and 24 inclusive, and the second two numbers are between 00 and 59 inclusive
    if ($("#input-train-time").val().length == 5 && invalidNums.test($("#input-train-time").val().toString()) === false) {
        var timeArray = $("#input-train-time").val().split(":");
        if (timeArray[0] <= 24 && timeArray[0] >= 00) {
            if (timeArray[1] <= 59 && timeArray[1] >= 00) {
                firstTrainTime = $("#input-train-time").val().trim();
                validTime = true;
            }
        }
/*         console.log("Time Checked"); */
    };
    //Makes sure the frequency is a number between 0 and 999 and not a negative number
    if ($("#input-train-frequency").val().length <= 3 && validNums.test($("#input-train-frequency").val().toString()) === true && parseInt($("#input-train-frequency").val(), 10) > 0) {
        trainFrequency = parseInt($("#input-train-frequency").val(), 10);
        validFreq = true;
/*         console.log("Frequency Checked"); */
    };

    //simply makes sure this doesnt check the booleans until after the if statements above
    setTimeout(function() {
        
        if (validFreq == false || validName == false || validDest == false || validTime == false) {
            if (!validName) {
                $("#name-warning").addClass("red-warning-text");
            };
            if (!validDest) {
                $("#destination-warning").addClass("red-warning-text");
            };
            if (!validTime) {
                $("#time-warning").addClass("red-warning-text");
            };
            if (!validFreq) {
                $("#frequency-warning").addClass("red-warning-text");
            };

/*             console.log("" + validName + validDest + validTime + validFreq); */

            
            validTrainRow = false; //Refuses user input train
        } else
        {   
            validTrainRow = true; //Allows user input train to be appended
        };
    }, 0);

};

//Database function that stores the user's input train in the database
function storeTrain() {
    database.ref("trains/").push( {
        tName : trainName,
        tDest : trainDestination,
        tFirstTime : firstTrainTime,
        tFrequency : trainFrequency,
        dateAdded : firebase.database.ServerValue.TIMESTAMP
    })
    //Empties all the fields after pressing submit
    $(".train-form-input").val("");
}

//

/* function printTrains() {
    Does nothing, turned out to be an unnecessary function. Left in for posterity.
}; */

//Function that prints out the database info on the page, tracks any changes to it.
database.ref("trains/").on("child_added", function(valueSnap){
    var timeNow = moment();

    var listTName = "<td>" + valueSnap.val().tName + "</td>";
    var listTDest = "<td>" + valueSnap.val().tDest + "</td>";
    var listTFrequency = "<td>" +  valueSnap.val().tFrequency + "</td>";

    var firstTimeMoment = moment(valueSnap.val().tFirstTime, "HH:mm");
    
    var listTFirstTime;

    var newRow = $("<tr>");
    var newTHead = $("<th>");
    newTHead.attr("scope","row");
    newTHead.text(lastTrainIndex);

    var testNumT = 0;
    //makes variable that is the difference between the "First Arrival Time" and now, in minutes
    var nextTrainMin = parseInt(firstTimeMoment.diff(timeNow, 'minutes'));
    if (nextTrainMin < 0) {
        firstTimeMoment.add(1, 'd');
        nextTrainMin = firstTimeMoment.diff(timeNow, 'minutes');
    }
    for (var rightTime = false; rightTime == false; testNumT++) {
        //If time between 'Now' and arrival time is greater than the frequency
        if (nextTrainMin > parseInt(valueSnap.val().tFrequency)) {
            //Decrements the arrival time by the frequency amount until it is within now + frequency amount
            firstTimeMoment.subtract(parseInt(valueSnap.val().tFrequency), 'm');
            nextTrainMin = parseInt(firstTimeMoment.diff(timeNow, 'm'));
        } else
        {rightTime = true;}
    }
    
    var listNextTime = "<td>" + nextTrainMin + "</td>";
    listTFirstTime = "<td>" + firstTimeMoment.format("HH:mm") + "</td>";

    //Prints out the new row
    newRow.append(newTHead)
        .append(listTName)
        .append(listTDest)
        .append(listTFrequency)
        .append(listTFirstTime)
        .append(listNextTime);

    $("#train-table-body").append(newRow);
    
    lastTrainIndex++;
}, function(errorObject) {
    console.log(errorObject.code);
})