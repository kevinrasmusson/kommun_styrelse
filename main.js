var ExcelToJSON = function() {
  this.parseExcel = function(file, callback) {
    var reader = new FileReader();

    reader.onload = function(e) {
      var data = e.target.result;
      var workbook = XLSX.read(data, {
        type: 'binary'
      });

      workbook.SheetNames.forEach(function(sheetName) {
        var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
        callback(XL_row_object);
      });
    };

    reader.onerror = function(ex) {
      console.log(ex);
    };

    reader.readAsBinaryString(file);
  };
};

var excelToJSON = new ExcelToJSON();
var fileInput = document.getElementById('upload');
var searchInput = document.getElementById('searchInput');
var searchButton = document.getElementById('searchButton');
var resultsContainer = document.getElementById('results');
var jsonData = [];

fileInput.addEventListener('change', function(e) {
  var file = e.target.files[0];
  excelToJSON.parseExcel(file, function(data) {
    jsonData = data;
  });
});

searchButton.addEventListener('click', function() {
  var searchTerm = searchInput.value.toLowerCase();
  var filteredData = jsonData.filter(function(item) {
    return item.Kommun && item.Kommun.toLowerCase().includes(searchTerm);
  });

  displayResults(filteredData);
});

function displayResults(data) {
  resultsContainer.innerHTML = '';
  data.forEach(function(item) {
    var div = document.createElement('div');
    div.textContent = JSON.stringify(item);
    resultsContainer.appendChild(div);
  });
}

