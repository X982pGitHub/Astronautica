const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const cron = require('node-cron');
const cp = require('child_process');

const csvUrl = path.join(__dirname, 'index.csv');
const app = express();

app.use(express.static(path.join(__dirname, './')));

// parse incoming JSON data
app.use(bodyParser.json());

app.get('/', (res) => {
    res.send('Hello World!')
})

// Function to write data to CSV file
function writeCsvFile(data) {
  const csvContent = data.map((row) => `${row[0]},${row[1]},${row[2]},${row[3]},${row[4] || ''}`).join('\n');
  fs.writeFileSync(csvUrl, csvContent, 'utf-8');
}

app.all('/pagehit', (req, res) => {
  const pageName = req.body.pageName;
  const viewTime = req.body.viewTime;
  const data = fs.readFileSync(csvUrl, 'utf-8')
    .split(/\r?\n|\r|\n/g)
    .map((row) => row.split(',')
    );
  for (let i = 0; i < data.length; i++){
    if (pageName == data[i][0]){
      data[i][3]++;
      data[i][4] = parseFloat(data[i][4] || 0) + viewTime;
      writeCsvFile(data);
      res.sendStatus(200)
      console.log("(",data[i][3],")",pageName + ": ",viewTime/1000,"s");
    }
  }
});

cron.schedule('0,30 * * * *', () => {
  cp.fork(path.join(__dirname, 'indexer.js'));
  console.log('\n[' + new Date() + '] Auto initiated indexer...');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});