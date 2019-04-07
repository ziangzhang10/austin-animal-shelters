d3.csv("./casesPerZip.csv").then(function(data) {

    var trace1 = {
        x: (data.map(row => row.zipcode)).toString(),
        y: data.map(row => row.dog),
        name: 'Dogs 🐶',
        opacity: 03,
        type: 'bar'
    };

    var trace2 = {
        x: (data.map(row => row.zipcode)).toString(),
        y: data.map(row => row.cat),
        name: 'Cats 😸',
        type: 'bar'
    };

    var trace3 = {
        x: (data.map(row => row.zipcode)).toString(),
        y: data.map(row => row.bird),
        name: 'Birds 🦅',
        type: 'bar'
    };

    var trace4 = {
        x: (data.map(row => row.zipcode)).toString(),
        y: data.map(row => row.other),
        name: 'Other Animals',
        opacity: 1,
        type: 'bar'
    };

    var dat = [trace1, trace2, trace3, trace4];

    var layout = {barmode: 'stack',
                   title: "Number of Cases Per ZipCode",
                //    barmode: "group",
                   xaxis:{
                           automargin: true
    }};

    Plotly.newPlot('plot', dat, layout);

  });

