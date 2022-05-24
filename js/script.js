$(function () {
    $(document).on("submit", "#estimate-form", function (e) {
        e.preventDefault();
        const elements = e.target.elements;
        const clientInfo = {
            name: elements.name.value,
            email: elements.email.value,
            area: elements.area.value,
            zipcode: elements.zipcode.value,
            message: elements.message.value,
        };
        $("#estimate-form")[0].reset();
        $("#estimate-modal").modal("hide");
        $("#success-modal").modal("show");

        const distFunction = () => getDistance(clientInfo.zipcode);
        distFunction().then((dist) => {
            clientInfo.distance = dist;
            emailjs
                .send("service_vjbxv7w", "template_swf19ug", clientInfo) // use "service_gk1xtqk" for testing
                .then(
                    function (response) {
                        console.log("SUCCESS!", response.status, response.text);
                        $("#loading-modal-body").hide();
                        $("#success-modal-body").show();
                    },
                    function (error) {
                        $("#estimate-modal").modal("hide");
                        alert(error);
                        console.log("FAILED...", error);
                    }
                );
        });

        return false;
    });

    async function getDistance(clientAreaCode) {
        // IMPORTANT: Fill in your client key
        var clientKey =
            "js-dUWiB9GwjMxPph8OjWRIS8VJEb3ppbd7iWEL7czDEipyg63WKvWH67NdyDJU2Do4";
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
            var cacheKey = zipcode1 + "-" + zipcode2;
            if (cacheKey in cache) {
                const dist = handleResp(cache[cacheKey]);
                console.log("dist from cache:", dist);
                return dist;
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

                // Make AJAX request

                const distance = await $.ajax({
                    url: url,
                    dataType: "json",
                })
                    .done(function (data) {
                        console.log("data1: " + data);

                        // Store in cache
                        cache[cacheKey] = data;
                        const dist = handleResp(data);
                        return dist;
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
                console.log(distance);
                return distance.distance;
            }
        }
    }
});

emailjs.init("5yop65zQLl8k3ZyGw");
