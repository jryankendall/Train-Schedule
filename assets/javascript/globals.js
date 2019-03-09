//Global vars
var database = firebase.database();

//
var trainName = "";
var trainDestination = "";
var firstTrainTime = "";
var trainFrequency = 0;
var validTrainRow;

var lastTrainIndex = 1;

//
var invalidNums = /^[0-9]^\072/gi;
var validNums = /[0-9]/gi;
var alphaNumerics = /[a-z]/gi;

function addTrain() {

    var validName = false;
    var validDest = false;
    var validTime = false;
    var validFreq = false;

    if ($("#input-train-name").val().length < 21 && $("#input-train-name").val().trim().length > 0 && alphaNumerics.test($("#input-train-name").val().trim()) == true) {
        trainName = $("#input-train-name").val().trim();
        validName = true;
    };
    if ($("#input-train-destination").val().length < 21 && $("#input-train-destination").val().trim().length > 0 && alphaNumerics.test($("#input-train-destination").val().trim()) == true) {
        trainDestination = $("#input-train-destination").val().trim();
        validDest = true;
    };
    if ($("#input-train-time").val().length == 5 && invalidNums.test($("#input-train-time").val()) == false) {
        firstTrainTime = $("#input-train-time").val().trim();
        validTime = true;
    };
    if ($("#input-train-frequency").val().length <= 3 && validNums.test($("#input-train-frequency").val()) == true && parseInt($("#input-train-frequency").val(), 10) > 0) {
        trainFrequency = parseInt($("#input-train-frequency").val(), 10);
        validFreq = true;
    };

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

        
        validTrainRow = false;
    } else
    {   
        validTrainRow = true;
    };
};

function storeTrain() {
    database.ref("trains/").push( {
        tName : trainName,
        tDest : trainDestination,
        tFirstTime : firstTrainTime,
        tFrequency : trainFrequency,
        dateAdded : firebase.database.ServerValue.TIMESTAMP
    })
}

//

function printTrains() {

};

database.ref("trains/").on("child_added", function(valueSnap){
    var listTName = "<td>" + valueSnap.val().tName + "</td>";
    var listTDest = "<td>" + valueSnap.val().tDest + "</td>";
    var listTFirstTime = "<td>" + valueSnap.val().tFirstTime + "</td>";
    var listTFrequency = "<td>" +  valueSnap.val().tFrequency + "</td>";

    var newRow = $("<tr>");
    var newTHead = $("<th>");
    newTHead.attr("scope","row");
    newTHead.text(lastTrainIndex);

    newRow.append(newTHead)
        .append(listTName)
        .append(listTDest)
        .append(listTFirstTime)
        .append(listTFrequency)
        .append("<td>69</td>");

    $("#train-table-body").append(newRow);
    
    lastTrainIndex++;
}, function(errorObject) {
    console.log(errorObject.code);
})