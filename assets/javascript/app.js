//Init Handlers
$( function() {
    $(document.body).on("click", ".add-train-button", function(event) {
        event.preventDefault();
        
        
        $(".half-size").removeClass("red-warning-text");
        addTrain();
        if (validTrainRow) {
            storeTrain();
        } else
        {
            console.log("Invalid entry. Check the boxes.");
        };
    });
});