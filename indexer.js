const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const { json } = require('express');

const rootDir = './'; // Set the root directory here
const csvUrl = path.join(__dirname, 'index.csv');
const jsonUrl = path.join(__dirname, 'stat.json');

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
  const csvContent = data.map((row) => `${row.fileName},${row.engName},${row.thaiName},,`).join('\n');
  fs.writeFileSync(csvUrl, csvContent, 'utf-8');
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

// Function to merge two objects with same key
function mergeObjects(obj1, obj2) {
  let result = {};
  Object.keys(obj1).forEach(key => {
    result[key] = obj1[key];
  });
  Object.keys(obj2).forEach(key => {
    if (result.hasOwnProperty(key)) {
      result[key] = Object.assign({}, result[key], obj2[key]);
    } else {
      result[key] = obj2[key];
    }
  });
  return result;
}

// Function to write data to JSON file
function writeJsonFile(data) {
  fs.readFile(jsonUrl, (err, readData) => {
    if (err) {
      console.error(err);
    } else {
      let oldData = JSON.parse(readData);
      let updatedData = mergeObjects(oldData, data);
      let json = JSON.stringify(updatedData, null, 2);
      fs.writeFile(jsonUrl, json, (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log("Statistics saved to " + jsonUrl);
        }
      });
    }
  });
}

// Main function to write data to JSON file
function generateJson(){
  const preWriteData = fs.readFileSync(csvUrl, 'utf-8')
    .split(/\r?\n|\r|\n/g)
    .map((row) => row.split(',')
    );
  let pushjsonData;
  let pushTime = new Date().toISOString();
  for (let i = 0; i < preWriteData.length; i++){
    let oldjsonData = pushjsonData;
    let jsonData = {
      [preWriteData[i][0]]: {
        [pushTime]:{
        hitCount: parseInt(preWriteData[i][3] || 0, 10),
        totalViewTime: parseFloat(preWriteData[i][4] || 0),
        avgViewTime: (preWriteData[i][4]/preWriteData[i][3] || 0)
        }
      }
    };
    if (typeof oldjsonData !== 'undefined'){
      pushjsonData = Object.assign(oldjsonData, jsonData);
    } else {
      pushjsonData = jsonData;
    }
  };
  writeJsonFile(pushjsonData)
}

generateJson();
generateCsv();