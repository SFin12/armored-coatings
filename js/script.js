$(function () {
    $("#calculate").on("click", function () {
       
        let cost = $("#area").val() * $("#epoxy-type").val();
        let dollarCost;
        if (isNaN(cost)) {
            console.log("test");
            dollarCost = "Choose Epoxy Type";
        } else {
            // Create our number formatter.
            var formatter = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",

                // These options are needed to round to whole numbers.
                //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
                //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
            });
            dollarCost = formatter.format(cost);
        }
        $("#estimate").html(`${dollarCost}`);
    });
})