$(function () {
    $("#calculate").on("click", function () {
        let dist = getDistance(95655);

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
});

function getDistance(clientAreaCode) {
    // IMPORTANT: Fill in your client key
    var clientKey =
        "js-dUWiB9GwjMxPph8OjWRIS8VJEb3ppbd7iWEL7czDEipyg63WKvWH67NdyDJU2Do4";
    console.log("in getDistance. Cliant area code: " + clientAreaCode);
    var cache = {};
    console.log(clientAreaCode);
    /** Handle successful response */
    function handleResp(data) {
        // Check for error
        if (data.error_msg) console.log(data.error_msg);
        else if ("distance" in data) {
            console.log("data.distance: " + data.distance);
            return data.distance;
        } else {
            console.log("data: " + data);
        }
    }
    // Set up event handlers
    // Get zip code
    var zipcode1 = "83641";
    var zipcode2 = clientAreaCode.toString();
    if (zipcode1.length == 5 && zipcode2.length == 5) {
        // Check cache
        console.log("ZIP CODES ARE CORRECT");
        var cacheKey = zipcode1 + "-" + zipcode2;
        if (cacheKey in cache) {
            handleResp(cache[cacheKey]);
            console.log("data in cache");
        } else {
            // Build url
            let url =
                "https://www.zipcodeapi.com/rest/" +
                clientKey +
                "/distance.json/" +
                zipcode1 +
                "/" +
                zipcode2 +
                "/mile";

            // fetch(url)
            //     .then((response) => {
            //         response.json();
            //     })
            //     .then((data) => {
            //         console.log(data);
            //     });

            // Make AJAX request
            $.ajax({
                url: url,
                dataType: "json",
            })
                .done(function (data) {
                    console.log("data1: " + data);
                    return handleResp(data);

                    // Store in cache
                    cache[cacheKey] = data;
                })
                .fail(function (data) {
                    console.log("data in cache");
                    console.log(data);
                    if (
                        data.responseText &&
                        (json = JSON.parse(data.responseText))
                    ) {
                        // Store in cache
                        cache[cacheKey] = json;
                        console.log("data2: " + json);
                        // Check for error
                        if (json.error_msg) console.log(json.error_msg);
                    } else console.log("Request failed.");
                });
            console.log("end of AJAX");
        }
    }
}
