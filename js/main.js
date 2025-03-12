document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded');
  fetchJSONData();

  const searchButton = document.getElementById('searchButton');
  searchButton.addEventListener('click', function() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    filterResults(searchInput);
  });
});

let jsonData = [];

function fetchJSONData() {
  console.log('Fetching JSON data');
  fetch('http://127.0.0.1:8080/styre.json')
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Response not ok');
      }
    })
    .then((json) => {
      console.log('JSON data fetched:', json);
      jsonData = json; // Store the JSON data in a global variable
      //parseJSONData(json);
    })
    .catch((error) => console.log(error));
}

function parseJSONData(json, searchInput = '') {
  console.log('Parsing JSON data');
  const resultsContainer = document.getElementById('results');
  
  if (!resultsContainer) {
    console.error('No results container found');
    return;
  }
  resultsContainer.innerHTML = ''; // Clear previous results

  if (json.length === 0) {
    const div = document.createElement('div');
    div.textContent = 'Inget resultat';
    resultsContainer.appendChild(div);
    return;
  }

  json.forEach(item => {
    const div = document.createElement('div');
    const kommun = item.Kommun;
    const styre = item.Styre;
    const parties = filterParties(styre);
    div.innerHTML = `Kommun: ${kommun}<br>Styre: ${parties.join(', ')}`;
    resultsContainer.appendChild(div);
  });
}

function filterResults(searchTerm) {
  const filteredData = jsonData.filter(item => item.Kommun && item.Kommun.toLowerCase().includes(searchTerm));
  parseJSONData(filteredData, searchTerm);
}
function filterParties(styre){
  const parties = [];
  const partyArray = styre.split(',').filter(party => party !== '');
  partyArray.forEach(party => {
    if(party !== ''){
      const partyName = letterToPartyName(party);
      parties.push(partyName);
    }
  });
  return parties;
}
function letterToPartyName(party){
  switch(party){
    case 'M':
      return 'Moderaterna';
    case 'C':
      return 'Centerpartiet';
    case 'L':
      return 'Liberalerna';
    case 'KD':
      return 'Kristdemokraterna';
    case 'S':
      return 'Socialdemokraterna';  
    case 'V':
      return 'Vänsterpartiet';
    case 'MP':
      return 'Miljöpartiet';
    case 'SD':
      return 'Sverigedemokraterna';
    case 'FI':
      return 'Feministiskt initiativ';
    case 'ÖP':
      return 'Övriga';
    default:
      return party;
  }


}