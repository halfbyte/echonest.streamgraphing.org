Raphael.fn.g.StreamGraph = {
  themeRiver: function(data) {
    var y_s = [];
    
    for(var i=0; i< data[0].length; i++) {
      y_s[i] = [];
      var sum = 0;
      for(var j=0;j<data.length; j++) sum += data[j][i];
      y_s[i][0] = -0.5 * sum;
      for(var j=0;j<data.length; j++) {
        y_s[i][j+1] = y_s[i][j] + data[j][i];
      }
    }
    return(this.g.StreamGraph.transformMatrix(y_s));
  },

  wiggle: function(data) {
    var y_s = [];
    
    for(var i=0; i< data[0].length; i++) {
      y_s[i] = [];
      var sum = 0;
      for(var j=1;j<data.length; j++) {
        var innersum = 0;
        for(var k=1;k<=j;k++) {
          innersum += (i>0) ? data[k][i] - data[k][i-1] : 0;
        }
        sum += innersum;
      } 
      
      
      y_s[i][0] = -(1/(data.length + 1)) * sum;
      
      if (i>0) y_s[i][0] += y_s[i-1][0];
      
      for(var j=0;j<data.length; j++) {
        y_s[i][j+1] = y_s[i][j] + data[j][i];
      }
      
    }
    return(this.g.StreamGraph.transformMatrix(y_s))      
  },
  
  
  weightedWiggle: function(dataInRows) {
    var data = dataInRows; // this.transformMatrix(dataInRows);
    var y_s = [];
    for (var i = 0; i < data[0].length; i++) {
      y_s[i] = [];
      var sum = 0;
      for(var j=0;j<data.length; j++) sum += data[j][i];
      if (sum == 0) sum = 0.001;
      y_s[i][0] = 0;
      for(var j=0;j<data.length; j++) {
       var innersum = 0;
       if (j>1) {
         for(var k=1;k<=(j-1);k++) {
           innersum += (data[k][i]);
           if (i>0) innersum -= data[k][i-1];
         }
       }
       y_s[i][0] += (0.5 * (data[j][i] - (i>0 ? data[j][i-1] : 0 )) + innersum) * data[j][i];

      }
      y_s[i][0] = -(1 / sum) * y_s[i];

      if (i>0) y_s[i][0] += y_s[i-1][0];

      for(var j=0;j<data.length; j++) {
        y_s[i][j+1] = y_s[i][j] + data[j][i];
      }
    }
    return(this.g.StreamGraph.transformMatrix(y_s))
  },
  transformMatrix: function(data) {
    var rows = [];
    for(var row=0;row<data[0].length;row++) {
      rows[row] = [];
      for(var col=0;col<data.length;col++) {
        rows[row][col] = data[col][(data[0].length - row - 1)];
      }
    }
    return rows;
  },
  sortRowsByVariance: function(data) {
    var self = this;
    data.sort(function(a,b) {
      return self.g.StreamGraph.variance(a) - self.g.StreamGraph.variance(b);
    });
    var newRows = [];
    var length = data.length;
    var center = Math.round(length/2);
    for(var row = 0; row < length; row++) {
      newRows[center + ((row % 2 == 0 ? -1 : 1) * Math.round(row/2)) - 1] = data[row];
    }
    return newRows;
  },
  min: function(data) {
    var min = data[0];
    for(var col=0; col<data.length; col++) {
      min = Math.min(min, data[col]);
    }
    return min;
  },
  max: function(data) {
    var max = data[0];
    for(var col=0; col<data.length; col++) {
      max = Math.max(max, data[col]);
    }
    return max;    
  },
  variance: function(data) {
    var min = data[0], max = data[0];
    for(var col=0; col<data.length; col++) {
      min = this.g.StreamGraph.min(data);
      max = this.g.StreamGraph.max(data);
    }
    return max - min;
  }

}

Raphael.fn.g.streamGraph = function(rawData, x, y, w, h, fun) {
  if(!fun) {    
    fun = this.g.StreamGraph.weightedWiggle;
  }

  var data = fun(rawData);
  var xScale = w / (data[0].length - 1)
  
  var max = this.g.StreamGraph.max(data[0]);
  var min = this.g.StreamGraph.min(data[data.length-1])
  var size = max - min;
  var scale = h / size;
  var middle = (max * scale);
  var forwardPathFor = function(data) {
    // TODO: Start-Splines brauchen Control-Point für Anfang!
    var path = "M" + x + " " + (middle - (data[0] * scale));
    path += "C" + (x + ((0 + 0.4) * xScale)) + " " + (middle - (data[0] * scale)) + " "  + (x + ((1 - 0.4) * xScale)) + " " + (middle - (data[1] * scale)) + " " + (x + (1 * xScale)) + " " + (middle - (data[1] * scale));
    for(var col=2;col<data.length;col++) {
      path += "S" + (x + ((col - 0.4) * xScale)) + " " + (middle - (data[col] * scale)) + " " + (x + (col * xScale)) + " " + (middle - (data[col] * scale));
    }
    return path;
  }
  
  var backwardPathFor = function(data) {
    // TODO: Start-Splines brauchen Control-Point für Anfang!
    var path = "L" + (x + ((data.length-1) * xScale)) + " " + ((y+middle) - (data[data.length-1]) * scale);
    path += "C" + (x + (((data.length-1) - 0.4) * xScale)) + " " + (middle - (data[(data.length-1)] * scale)) + " " + (x + (((data.length-2) + 0.4) * xScale)) + " " + (middle - (data[(data.length-2)] * scale)) + " " + (x + ((data.length-2) * xScale)) + " " + (middle - (data[(data.length-2)] * scale));
    for(var col=data.length-3;col>=0;col--) {
      path += "S" + (x + ((col + 0.4) * xScale)) + " " + (middle - (data[col] * scale)) + " " + (x + (col * xScale)) + " " + (middle - (data[col] * scale));
    }
    path += "z"
    return path;
  }
  
  for(var row=0;row<data.length-1; row++) {
    var path = forwardPathFor(data[row]);
    path += backwardPathFor(data[row+1]);
    
    this.path(path).attr({fill: Raphael.getColor(), stroke:"#000", "stroke-width": 0});
  }
  // this.path(forwardPathFor(data[data.length-1])).attr({stroke: "#000"});
}
