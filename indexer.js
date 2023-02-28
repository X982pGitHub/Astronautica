const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const rootDir = './'; // Set the root directory here

// Function to recursively get all HTML files in a directory and its subdirectories
function getHtmlFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + '/' + file).isDirectory()) {
      arrayOfFiles = getHtmlFiles(dirPath + '/' + file, arrayOfFiles);
    } else if (file.endsWith('.html')) {
      arrayOfFiles.push(path.join(dirPath, '/', file));
    }
  });

  return arrayOfFiles;
}

// Function to read HTML file and extract eng_name and thai_name
function parseHtmlFile(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const $ = cheerio.load(fileContent);
  const fileName = path.parse(filePath).name;
  const engName = $('meta[name="eng_name"]').attr('content') || fileName.replace(/_/g, " ");
  const thaiName = $('meta[name="thai_name"]').attr('content') || $('h1').text();
  return { fileName, engName, thaiName };
}

// Function to write data to CSV file
function writeCsvFile(data) {
  const csvContent = data.map((row) => `${row.fileName},${row.engName},${row.thaiName},`).join('\n');
  fs.writeFileSync('./public/index.csv', csvContent, 'utf-8');
}

// Main function to read all HTML files and write to CSV
function generateCsv() {
  const htmlFiles = getHtmlFiles(rootDir);
  const csvData = htmlFiles.map((filePath) => {
    const { fileName, engName, thaiName } = parseHtmlFile(filePath);
    return { fileName, engName, thaiName };
  });
  writeCsvFile(csvData);
  console.groupCollapsed("Indexed " + csvData.length + " pages successfully!");
    console.log('Date', new Date());
    console.log('Pages', csvData);
  console.groupEnd();
}

generateCsv();