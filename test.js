var bDevicesValues = ['A', 'A', '', 'A'];
var bDevicesNames = [];
var flag = 0;
console.log(bDevicesValues.length);
for(var i = 0; i < bDevicesValues.length; i++){
    if(bDevicesValues[i][0] != ""){
      flag = 1;
      bDevicesNames.push(bDevicesValues[i][0]);
    }
    else {
      if (flag == 1)
        return;
      bDevicesNames[0] = "Not Avaiable Devices";
    }
  }

  console.log(bDevicesValues);
  console.log(bDevicesNames);