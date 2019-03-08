//Global vars
var database = firebase.database();

//
var trainName = "";
var trainDestination = "";
var firstTrainTime = "";
var trainFrequency = "";

//
var invalidNums = /^[0-9]^\072/gi;
var validNums = /[0-9]^[a-z]/gi;

function addTrain() {
    var validName = false;
    var validDest = false;
    var validTime = false;
    var validFreq = false;
    if ($("#input-train-name").val().length() < 21) {
        trainName = $("#input-train-name").val().trim();
        validName = true;
    }
    if ($("#input-train-destination").val().length() < 21) {
        trainDestination = $("#input-train-destination").val().trim();
        validDest = true;
    }
    if ($("#input-train-time").val().length() == 5 && $("#input-train-time").val().test(invalidNums) == false) {
        firstTrainTime = $("#input-train-time").val().trim();
        validTime = true;
    }
    if ($("#input-train-frequency").val().length <= 3 && $("#input-train-time").val().test(validNums) == true && 
        parseInt($("#input-train-frequency").val()) > 0) {
            validFreq = true;
    }

    if (validFreq == false || validName == false || validDest == false || validTime == false) {
        var validsArray = [];
        validsArray.push(validName)
                    .push(validDest)
                    .push(validTime)
                    .push(validFreq);
    }
}