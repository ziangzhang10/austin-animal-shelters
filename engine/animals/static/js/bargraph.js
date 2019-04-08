url = '/bardata';
d3.json(url).then(function (stuff) {

    var data = JSON.parse(stuff);
    console.log(data);
    // [{
    //     type: "column",
    //     name: "Oil Filter",
    //     showInLegend: true,
    //     yValueFormatString: "#,##0.# Units",
    //     dataPoints: [
    //         { label: "New Jersey", y: 19034.5 },
    //         { label: "Texas", y: 20015 },
    //         { label: "Oregon", y: 25342 },
    //         { label: "Montana", y: 20088 },
    //         { label: "Massachusetts", y: 28234 }
    //     ]
    // },
    // {
    //     type: "column",
    //     name: "Clutch",
    //     axisYType: "secondary",
    //     showInLegend: true,
    //     yValueFormatString: "#,##0.# Units",
    //     dataPoints: [
    //         { label: "New Jersey", y: 210.5 },
    //         { label: "Texas", y: 135 },
    //         { label: "Oregon", y: 425 },
    //         { label: "Montana", y: 130 },
    //         { label: "Massachusetts", y: 528 }
    //     ]
    // }]

    // var label = data.map(row => "〒" + (row.zipcode).toString());
    var dog = data.map(function(row){
        var element = {};
        element.label = "〒" + (row.zipcode).toString();
        element.y = row.dog;
        return element;
    } );
    var cat = data.map(function(row){
        var element = {};
        element.label = "〒" + (row.zipcode).toString();
        element.y = row.cat;
        return element;
    } );
    var bird = data.map(function(row){
        var element = {};
        element.label = "〒" + (row.zipcode).toString();
        element.y = row.bird;
        return element;
    } );
    var other = data.map(function(row){
        var element = {};
        element.label = "〒" + (row.zipcode).toString();
        element.y = row.other;
        return element;
    } );
    console.log(dog);

    var trace1 = {
        type: "stackedColumn",
        name: 'Dogs 🐶',
        showInLegend: true,
        yValueFormatString: "#,##0.# Adoptions",
        dataPoints: dog
    };

    var trace2 = {
        type: "stackedColumn",
        name: 'Cats 😸',
        showInLegend: true,
        yValueFormatString: "#,##0.# Adoptions",
        dataPoints: cat
    };

    var trace3 = {
        type: "stackedColumn",
        name: 'Birds 🦅',
        showInLegend: true,
        yValueFormatString: "#,##0.# Adoptions",
        dataPoints: bird
    };

    var trace4 = {
        type: "stackedColumn",
        name: 'Other Animals',
        showInLegend: true,
        yValueFormatString: "#,##0.# Adoptions",
        dataPoints: other
    };

    var dat = [trace1, trace2, trace3, trace4];

    window.onload = function () {

        var chart = new CanvasJS.Chart("chartContainer", {
            exportEnabled: true,
            animationEnabled: true,
            title: {
                text: "Fake Austin Animals Center"
            },
            subtitles: [{
                text: "Click Legend to Hide or Unhide Data Series"
            }],
            axisX: {
                title: "Zip Code"
            },
            axisY: {
                title: "Adoptions",
                titleFontColor: "#4F81BC",
                lineColor: "#4F81BC",
                labelFontColor: "#4F81BC",
                tickColor: "#4F81BC"
            },
            // axisY2: {
            //     title: "Clutch - Units",
            //     titleFontColor: "#C0504E",
            //     lineColor: "#C0504E",
            //     labelFontColor: "#C0504E",
            //     tickColor: "#C0504E"
            // },
            toolTip: {
                shared: true
            },
            legend: {
                cursor: "pointer",
                itemclick: toggleDataSeries
            },
            data: dat,
            // options: {
            //     scales: {
            //       xAxes: [{ stacked: true }],
            //       yAxes: [{ stacked: true }]
            //     }
            // }
        });
        chart.render();

        function toggleDataSeries(e) {
            if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                e.dataSeries.visible = false;
            } else {
                e.dataSeries.visible = true;
            }
            e.chart.render();
        }

    }
});

/////////////////////////////////////////////////////////////
// Original: plotly bar chart has no animation
// url = '/bardata';
// d3.json(url).then(function (stuff) {

//     var data = JSON.parse(stuff);
//     console.log(data);
//     var trace1 = {
//         x: data.map(row => "〒" + (row.zipcode).toString()),
//         y: data.map(row => row.dog),
//         name: 'Dogs 🐶',
//         opacity: 03,
//         type: 'bar'
//     };

//     var trace2 = {
//         x: data.map(row => "〒" + (row.zipcode).toString()),
//         y: data.map(row => row.cat),
//         name: 'Cats 😸',
//         type: 'bar'
//     };

//     var trace3 = {
//         x: data.map(row => "〒" + (row.zipcode).toString()),
//         y: data.map(row => row.bird),
//         name: 'Birds 🦅',
//         type: 'bar'
//     };

//     var trace4 = {
//         x: data.map(row => "〒" + (row.zipcode).toString()),
//         y: data.map(row => row.other),
//         name: 'Other Animals',
//         opacity: 1,
//         type: 'bar'
//     };

//     var dat = [trace1, trace2, trace3, trace4];
//     var layout = {
//         barmode: 'stack',
//         title: "Number of Cases Per ZipCode",
//         //    barmode: "group",
//         xaxis:{
//                  automargin: true
//         }
//     };

//     Plotly.newPlot('plot', dat, layout);



// });

