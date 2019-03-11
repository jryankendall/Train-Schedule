//Init Handlers
$( function() {
    $(document.body).on("click", ".add-train-button", function(event) {
        event.preventDefault();
        trainName = "";
        trainDestination = "";
        firstTrainTime = "";
        trainFrequency = 0;
        validTrainRow = false;
        
        //Clears the red warning labels from the page
        $(".half-size").removeClass("red-warning-text");
        addTrain();

        //Makes sure the input checker runs before this function
        setTimeout(function() {
            if (validTrainRow) {
                storeTrain();
            } else
            {
                console.log("Invalid entry. Check the boxes.");
            };
        }, 250);
        
    });
});