export function bin2hex(b) {
    return b.match(/.{4}/g).reduce((acc, i) => {
        return acc + parseInt(i, 2).toString(16);
    }, '').toUpperCase();
}

export function toEngineering(num) {
  if      (num >= 1_000_000_000_000)  return [(num/1_000_000_000_000).toFixed(2), 'THz'];
  else if (num >= 1_000_000_000)      return [(num/1_000_000_000).toFixed(2),     'GHz'];
  else if (num >= 1_000_000)          return [(num/1_000_000).toFixed(2),         'MHz'];
  else if (num >= 1_000)              return [(num/1_000).toFixed(2),             'KHz'];
  else if (num < 0.000000001)         return [(num*1_000_000_000_000).toFixed(2), 'ps'];
  else if (num < 0.000001)            return [(num*1_000_000_000).toFixed(2),     'ns'];
  else if (num < 0.001)               return [(num*1_000_000).toFixed(2),         'μs'];
  else if (num < 1)                   return [(num*1_000).toFixed(2),             'ms'];
  else if (num >= 0)                  return [(num).toFixed(2),                   ''];
  else return [num, '<>'];
}

export function decToBin(decNum) {
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

export function close(el, exact, pct, isNum, pad) {
    let res, lenError = false;
  
    let input = document.getElementById(el);
    if (input === null) return true;
    if (input.tagName != "INPUT") return true;
    input.classList.remove('error');
    input.classList.remove('lenErr');
  
    let value  = input.value.toUpperCase();
    let valueA = input.dataset.answer.toUpperCase()
  
    if(valueA === null) return true;

    if (pad > 0) {
      lenError = value.length != pad;
      value = value + '0'.repeat(pad  - value.length);
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
  
export   function reveal () {
    let inputs = document.querySelectorAll('[data-answer]');
    inputs.forEach(i => {
      if (i.tagName === "INPUT")  i.value     = i.dataset.answer;
      if (i.tagName === "TD")     i.innerText = i.dataset.answer;
      // if (i.id === "cpiX")        i.value = i.dataset.answer;
    })
  }

export   function clear () {
    let inputs = document.querySelectorAll('[data-answer]');
    inputs.forEach(i => i.value = '');
  }

export   function removeAllErrors () {
    let inputs = document.querySelectorAll('[data-answer]');
    inputs.forEach(i => removeErrors(i));
  }

export function removeErrors(el) {
    el.classList.remove('error');
    el.classList.remove('lenErr');
    el.classList.remove('faster');
    el.classList.remove('fastest');
}
