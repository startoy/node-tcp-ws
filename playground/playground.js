/* ************************************
* FOR TEST CODE
***************************************/

var error_no_recievedata = "C1";
var error_no_connectserver = "C2";
var error_maximum_volume = "C3";
var errorEN = {};
var errorTH = {};
var fileENPath = "./error_EN.txt";
var fileTHPath = "./error_TH.txt";
////////////////////////////////////////
function convert2Json(arrayOfString, outputJson) {
  for (let i = 0; i < arrayOfString.length; i++) {
    let line = arrayOfString[i];
    if (line == "" || line == null || line == "\n") { continue; }
    parts = line.split("=");
    outputJson[parts[0]] = parts[1];
  }
}

var getTextFromFile = function(filePath) {
  return new Promise(function(resolve, reject) {
    $.get(filePath, function(rawData) {
      if (rawData) {
        resolve(rawData);
      } else {
        reject(ERROR('can not read data from ' + filePath));
      }
     }, 'text');
  })
}

async function setErrorObj(filePath, jsonObj) {
  var rawData = await getTextFromFile(fileENPath)   // wait $.get() read done. before continue to next line
  convert2Json(rawData.split(/\r?\n/), jsonObj);
  console.log('errorXX3 --> ' + JSON.stringify(jsonObj));
}

async function initWebApp() {
  await setErrorObj(fileENPath, errorEN);
  console.log('errorEN2 --> ' + JSON.stringify(errorEN));

  await setErrorObj(fileTHPath, errorTH);
  console.log('errorTH2 --> ' + JSON.stringify(errorTH));

}

async function main(){
  await initWebApp();
  console.log('errorEN1 --> ' + JSON.stringify(errorEN));
  console.log('errorTH1 --> ' + JSON.stringify(errorTH));
}

main();
///////////////////////////////////////
