Plotly.d3.csv('https://raw.githubusercontent.com/AhmedaCheick/csv_store/master/data/breed_data2.csv', function (err, data) {
  // Create a lookup table to sort and regroup the columns of data,
  // first by date, then by animal_type:
  var lookup = {};
  function getData(date, animal_type) {
    var bydate, trace;
    if (!(bydate = lookup[date])) {;
      bydate = lookup[date] = {};
    }
	 // If a container for this date + animal_type doesn't exist yet,
	 // then create one:
    if (!(trace = bydate[animal_type])) {
      trace = bydate[animal_type] = {
        x: [],
        y: [],
        id: [],
        text: [],
        marker: {size: []}
      };
    }
    return trace;
  }

  // Go through each row, get the right trace, and append the data:
  for (var i = 0; i < data.length; i++) {
    var datum = data[i];
    var trace = getData(datum.date, datum.animal_type);
    trace.text.push(datum.breed);
    trace.id.push(datum.breed);
    trace.x.push(datum.breed_cumsum);
    trace.y.push(datum.cum_mean);
    trace.marker.size.push(datum.breed_cumsum*12000000);
  }

  // Get the group names:
  var dates = Object.keys(lookup);
  // In this case, every date includes every animal_type, so we
  // can just infer the animal_types from the *first* date:
  var firstdate = lookup[dates[0]];
  var animal_types = Object.keys(firstdate);

  // Create the main traces, one for each animal_type:
  var traces = [];
  for (i = 0; i < animal_types.length; i++) {
    var data = firstdate[animal_types[i]];
	 // One small note. We're creating a single trace here, to which
	 // the frames will pass data for the different dates. It's
	 // subtle, but to avoid data reference problems, we'll slice
	 // the arrays to ensure we never write any new data into our
	 // lookup table:
    traces.push({
      name: animal_types[i],
      x: data.x.slice(),
      y: data.y.slice(),
      id: data.id.slice(),
      text: data.text.slice(),
      mode: 'markers',
      marker: {
        size: data.marker.size.slice(),
        sizemode: 'area',
        sizeref: 200000
      }
    });
  }

  // Create a frame for each date. Frames are effectively just
  // traces, except they don't need to contain the *full* trace
  // definition (for example, appearance). The frames just need
  // the parts the traces that change (here, the data).
  var frames = [];
  for (i = 0; i < dates.length; i++) {
    frames.push({
      name: dates[i],
      data: animal_types.map(function (animal_type) {
        return getData(dates[i], animal_type);
      })
    })
  }

  // Now create slider steps, one for each frame. The slider
  // executes a plotly.js API command (here, Plotly.animate).
  // In this example, we'll animate to one of the named frames
  // created in the above loop.
  var sliderSteps = [];
  for (i = 0; i < dates.length; i++) {
    sliderSteps.push({
      method: 'animate',
      label: dates[i],
      args: [[dates[i]], {
        mode: 'immediate',
        transition: {duration: 300},
        frame: {duration: 300, redraw: false},
      }]
    });
  }

  var layout = {
    xaxis: {
      title: 'Numb of Cases Per Breed',
      range: [0, 20]
    },
    yaxis: {
      title: 'GDP per Capita',
      // type: 'log'
      range: [10000, 130000]
    },
    hovermode: 'closest',
	 // We'll use updatemenus (whose functionality includes menus as
	 // well as buttons) to create a play button and a pause button.
	 // The play button works by passing `null`, which indicates that
	 // Plotly should animate all frames. The pause button works by
	 // passing `[null]`, which indicates we'd like to interrupt any
	 // currently running animations with a new list of frames. Here
	 // The new list of frames is empty, so it halts the animation.
    updatemenus: [{
      x: 0,
      y: 0,
      yanchor: 'top',
      xanchor: 'left',
      showactive: false,
      direction: 'left',
      type: 'buttons',
      pad: {t: 87, r: 10},
      buttons: [{
        method: 'animate',
        args: [null, {
          mode: 'immediate',
          fromcurrent: true,
          transition: {duration: 300},
          frame: {duration: 500, redraw: false}
        }],
        label: 'Play'
      }, {
        method: 'animate',
        args: [[null], {
          mode: 'immediate',
          transition: {duration: 0},
          frame: {duration: 0, redraw: false}
        }],
        label: 'Pause'
      }]
    }],
	 // Finally, add the slider and use `pad` to position it
	 // nicely next to the buttons.
    sliders: [{
      pad: {l: 130, t: 55},
      currentvalue: {
        visible: true,
        prefix: 'date:',
        xanchor: 'right',
        font: {size: 20, color: '#666'}
      },
      steps: sliderSteps
    }]
  };

  // Create the plot:
  Plotly.plot('plot', {
    data: traces,
    layout: layout,
    frames: frames,
  });
});