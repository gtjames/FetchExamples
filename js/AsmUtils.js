function bin2hex(b) {
    return b.match(/.{4}/g).reduce((acc, i) => {
        return acc + parseInt(i, 2).toString(16);
    }, '').toUpperCase();
}
function getBinRand() {
    let number = 0;
    let start = -6, end = 9;
    let x = Math.random();
    if (x < .1)        start = 0;
    else if (x > 0.9)  end = -1;
    while (number ===  0) {
        for (let i = start; i <= end; i++) {
            number += Math.random() < 0.33 ? Math.pow(2, i) : 0;
        }
    }
    return number * (Math.random() < 0.1 ? -1 : 1);
}

function toEngineering(num) {
  if      (num > 1)                 return num.toFixed(2);
  else if (num * 1000 > 1)          return (num*1000).toFixed(2)+' ms';
  else if (num * 1000000 > 1)       return (num*1000000).toFixed(2)+' μs';
  else if (num * 1000000000 > 1)    return (num*1000000000).toFixed(2)+' ns';
  else if (num * 1000000000000 > 1) return (num*1000000000000).toFixed(2)+' ps';
  else return num;
}

function decToBin(decNum) {
  let buffer = new ArrayBuffer(4);
  let floatView = new Float32Array(buffer);
  floatView[0] = decNum;

  let uintView = new Uint32Array(buffer);
  let binary = uintView[0].toString(2);
  binary = binary.padStart(32, '0');

  let sign = binary.charAt(0) === '1' ? '-' : '+';
  let binSign = binary.substring(0, 1);
  let binExponent = binary.substring(1, 9);
  let exponent = parseInt(binExponent, 2) - 127;
  let binFraction = binary.substring(9);
  let fraction = parseInt(binFraction, 2) / Math.pow(2, 23);

  return {
    sign: sign,
    exponent: exponent,
    fraction: fraction,
    binary: binary,
    binSign: binSign,
    binExponent: binExponent,
    binFraction:  binFraction
  };
}

function close(el, exact, pct, isNum) {
    let res, lenError = false;
  
    let input = document.getElementById(el);
    if (input === null) return true;
    if (input.tagName != "INPUT") return true;
    input.classList.remove('error');
    input.classList.remove('lenErr');
  
    let value  = input.value;
    let valueA = document.getElementById(el+'A').value;
  
    if(valueA === null) return true;

    if (el === 'hex') {
      lenError = value.length != 8;
      value = value + '0'.repeat(8  - value.length);
    }
    if (el === 'binary') {
      lenError = value.length != 32;
      value = value + '0'.repeat(32 - value.length);
    }
    value  = value.replaceAll(' ','').replaceAll(',','');
    valueA = valueA.replaceAll(' ','').replaceAll(',','');
    if (isNum) {
      value  = +value;
      valueA = +valueA;
    }
  
    if ( exact ) {
      res = value === valueA
    }
    else {
      res = Math.abs( (value - valueA) / valueA) < pct
    }
    if (lenError) input.classList.add('lenErr');
    if (!res)     input.classList.add('error');
  
    return res;
  }
  
  function reveal () {
    let inputs = document.querySelectorAll('input[type="hidden"]');
    inputs.forEach(i => {
      try {
      document.getElementById(i.id.substring(0,i.id.length-1)).value = i.value;
    }
    catch (e) { console.log(e); }
    });
    totCPI.innerText    = totalCycles / totalInstructions;
  }

function removeErrors(el) {
    el.classList.remove('error');
    el.classList.remove('lenError');
}
