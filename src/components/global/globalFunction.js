import { getProfileUser } from "../index/token";

export function padLeft(dataInt, pjg) {
  let str = dataInt;
  for (let w = 0; w < pjg - dataInt.toString().length; w++) {
    str = "0" + str;
  }
  return str;
}

export function copyArray(arrOld) {
  let arrNew = []
  for(let i=0;i<arrOld.length;i++){
    let item = arrOld[i]
    let objItem = {}
    for (let key in item) {
      objItem[key] = item[key]
    }
    arrNew.push(objItem)
  }
  return arrNew
}

export function handleFormatDate (dateBefore){
  let dateBeforeNow = dateBefore;

  if(dateBeforeNow && dateBeforeNow.toString().includes('T')) {
    dateBeforeNow = dateBeforeNow.toString().split('T')[0];
  }

  let dateAfter = new Date(dateBeforeNow);

  return dateAfter.getFullYear() > 1700 ? `${dateAfter.getDate()} ${getMonthNow(dateAfter.getMonth().toString())} ${dateAfter.getFullYear()}` : '-';
};

export function getMonthNow(bulanNow) {
  let bulan = '';

  if(bulanNow) {
    if(bulanNow.toString() === '0') {
      bulan = 'Januari';
    } else if(bulanNow.toString() === '1') {
      bulan = 'Februari';
    } else if(bulanNow.toString() === '2') {
      bulan = 'Maret';
    } else if(bulanNow.toString() === '3') {
      bulan = 'April';
    } else if(bulanNow.toString() === '4') {
      bulan = 'Mei';
    } else if(bulanNow.toString() === '5') {
      bulan = 'Juni';
    } else if(bulanNow.toString() === '6') {
      bulan = 'Juli';
    } else if(bulanNow.toString() === '7') {
      bulan = 'Agustus';
    } else if(bulanNow.toString() === '8') {
      bulan = 'September';
    } else if(bulanNow.toString() === '9') {
      bulan = 'Oktober';
    } else if(bulanNow.toString() === '10') {
      bulan = 'November';
    } else if(bulanNow.toString() === '11') {
      bulan = 'Desember';
    }
  }



  return bulan
}

export function deleteSeparator(number, separator) {
  while(number.includes(separator)){
    number = number.replace(separator,"")
  }
  return number
}

export function isNumeric(value) {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

export function formatNumber(number,money) {
  number = (number && number.toString().trim()) || ''
  number = deleteSeparator(number,",")
  let floatingNumber = false;
  
  if(number.includes('.')) {
    const numberSplit = number.split('.')
    floatingNumber = numberSplit[1];
    number = numberSplit[0];
    
    floatingNumber = floatingNumber.substr(0,2);
  }
  
  let pjg = number.length
  if(!isNumeric(number)){
    pjg = pjg-1
    number = number.substr(0,pjg)
  }
  let tmp = ""
  if(pjg>3){
    while(pjg>3){
      pjg -= 3
      tmp = number.substr(pjg,3) + "." + tmp
    }
    if(pjg<=3){
      tmp = number.substr(0,pjg) + "." + tmp
    }
    tmp = tmp.substr(0, tmp.length-1)
  }else{
    tmp = number
  }

  if(money && tmp.length !== 0) {
    tmp += ',00';
  } 

  return tmp.toString().length !== 0 ? `${tmp}${floatingNumber ? `,${floatingNumber}` : ''}` : '-'
}

export function checkPermission(stringPermission) {
  let flag = false;
  
  const listPermission = (getProfileUser() && JSON.parse(getProfileUser()) && JSON.parse(getProfileUser()).permissions) || [];
  
  for(const key in listPermission) {
    if(listPermission[key] && listPermission[key].toString().toLowerCase() === 'all') {
      flag = true;
      break;
    }

    if(typeof(stringPermission) === 'object') {
      for(const keyPermit in stringPermission) {
        if(stringPermission[keyPermit] && listPermission[key] && listPermission[key].toString().toLowerCase() === stringPermission[keyPermit].toString().toLowerCase()) {
          flag = true;
          break;
        }
      }
    } else {
      if(stringPermission && listPermission[key] && listPermission[key].toString().toLowerCase() === stringPermission.toString().toLowerCase()) {
        flag = true;
        break;
      } 
    }
    
    if(flag) {
      break;
    }
  }

  if(stringPermission === 'keluar') {
    return true;
  }
  
  return flag;
}

export function decryptImage(textImage) {

  if(textImage) {
    let crypto = require("crypto");
    const algorithm = 'aes-256-cfb';

    let keyStr = "BpLnfgDsc3WD9F3qap394rjd239smsdk";

    const contents = Buffer.from(textImage, 'base64');
    const iv = contents.slice(0, 16);
    const textBytes = contents.slice(16);
    const decipher = crypto.createDecipheriv(algorithm, keyStr, iv);
    let imageUrl = decipher.update(textBytes, '', 'utf8');
    imageUrl += decipher.final('utf8');

    return imageUrl;
  }

  return '';
  
}

export function formatMoney(number){ 
  return number.toLocaleString('in-RP', {style : 'currency', currency: 'IDR'})
}

export function findAmount (dataFees, amountPinjamanPokok){
  let feeNew = '';
  
  if(dataFees && amountPinjamanPokok) {
    if(dataFees.toString().toLowerCase().includes('%')) {
      feeNew = `${parseFloat(dataFees).toFixed(2)}%`;
      feeNew += ` atau ${formatMoney(parseInt(dataFees) * amountPinjamanPokok / 100)}`;
    } else {
      feeNew = `${parseFloat(parseInt(dataFees)  * 100 / amountPinjamanPokok).toFixed(2)}%`;
      feeNew += ` atau ${formatMoney(parseInt(dataFees))}`;
    }
  }

  return feeNew;
}

export function destructErrorMessage(objError) {
  let errorMessage = 'Error : ';
  let integerError = 0;

  if(objError && objError.details) {
    const errDetail = objError.details

    for(const key in errDetail) {

      if(errDetail[key] && errDetail[key].toString() && errDetail[key].toString().trim().length !== 0) {
        if(integerError !== 0) {
          errorMessage += ', ';
        } 

        errorMessage += `${key} ${errDetail[key]}`;

        integerError += 1
      }

    }

    if(integerError < 1) {
      errorMessage += ` ${objError.message}`
    }

  } else if (objError && !objError.details && objError.message) {
    errorMessage += ` ${objError.message}`
  }

  return errorMessage
}

export async function changeFileToBase64(file) { 
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function(e) { 
        resolve(e.target.result)
    };
    reader.onerror = error => resolve({error});
  });
}