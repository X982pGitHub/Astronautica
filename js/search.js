
// Define the data to be searched
const csvUrl = './index.csv';
const data = [];

fetch(csvUrl)
.then(response => response.text())
.then(csvData => {
  const rows = csvData.split(/\r?\n|\r|\n/g);
  rows.forEach(row => {
    const columns = row.split(',');
    data.push(columns);
  });
});
console.log(data)


// Get the search input and results container
const searchInput = document.querySelector('.searchbox');
const searchResults = document.querySelector('#search-results');

// Define a function to perform the search
function search(query) {
  // Clear the previous results
  searchResults.innerHTML = '';

  // If the query is empty, exit early
  if (!query.trim() || query.trim().length < 3) {
    return;
  }

  // Use fuzzysort to search for matches
  const results = fuzzysort.go(query, data, {keys: [1, 2], limit: 50});

  // If no matches, show a message
  if (results.length === 0) {
    searchResults.innerHTML = '<p>ไม่พบรายการค้นหา</p>';
    return;
  }

  // Create a list of matched items
  const list = document.createElement('ul');
  results.forEach((result, index) => {
    const item = result.obj;
    searchResults.innerHTML = '<p>ไม่พบรายการค้นหา</p>'
    list.style.display = "none";
    const listItem = document.createElement('li');
    const link = document.createElement('a');
    if(item[2] != ""){
      searchResults.innerHTML = ''
      link.href = './' + item[0] + '.html';
      link.textContent = item[2] + ' (' + item[1] + ')';
      link.tabIndex = index + 1;
      listItem.appendChild(link);
      list.style.display = "block";
      list.appendChild(listItem);
    }
  });

  // Append the list to the results container
  searchResults.appendChild(list);
}


// Listen for input events on the search input
searchInput.addEventListener('input', (event) => {
  // Call the search function with the current query value
  search(event.target.value);
});

// Listen for clicks on the document and hide the results if the click is outside the search container
document.addEventListener('click', (event) => {
  if (!searchResults.contains(event.target) && event.target !== searchInput) {
    searchResults.innerHTML = '';
  }
});