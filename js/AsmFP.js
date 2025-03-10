import {reveal, close, clear, removeAllErrors, decToBin, bin2hex, binToDecimal} from './AsmUtils.js';
import {getBinRand, setSeed} from './utils.js';
    
let dec          = document.getElementById('dec'  );
let frac         = document.getElementById('frac' );
let expBin       = document.getElementById('expBin');
let decExp       = document.getElementById('decExp');
let decIntValue  = document.getElementById('decIntValue');
let decFracValue = document.getElementById('decFracValue');
let binFracValue = document.getElementById('binFracValue');
let binInt       = document.getElementById('binInt');
let binSign      = document.getElementById('binSign');
let binary       = document.getElementById('binary' );
let hex          = document.getElementById('hex' );
let revealOn     = document.getElementById('revealOn');
let revealBtn    = document.getElementById('reveal');
let useMe        = document.getElementById('useMe');
let studentID    = document.getElementById('studentID');
let roundTrip    = document.getElementById('roundTrip');

document.getElementById(`reset`).addEventListener('click', reset);
document.getElementById(`submit`).addEventListener('click', submit);
document.getElementById(`reveal`).addEventListener('click', reveal);
revealBtn.parentElement.addEventListener('dblclick', () => revealBtn.disabled = false);

reset();

export function submit() {
    //close(el,          exact, pct,    isNum, pad) {
    close('decExp',       true,  0,     true,  0);
    close('decIntValue',  true,  0,     true,  0);
    close('decFracValue', true,  0,     true,  0);
    close('hex',          true,  0,     false, 8);

    close('binSign',      true,  0,     true,  0);
    close('binExp',       true,  0,     true,  0);
    close('binInt',       true,  0,     true,  0);
    close('binFracValue', true,  0,     true,  0);
    close('binary',       true,  0,     false, 32);

    close('frac',         true,  0,     false, 23);
}

function reset() {
    let id = studentID.value;
    document.getElementById(`reveal`).disabled = (id.length > 0);
    if (id.length != 0)       revealOn.checked = false;
    setSeed( (id.length > 0) ? "."+id : -1 );

    let fltPt;
    fltPt = (useMe.checked) ? dec.value : getBinRand();
    let binData = decToBin(fltPt);
    dec.value   = fltPt;


    frac.dataset.answer         = binData.binFraction;
    binExp.dataset.answer       = binData.binExponent;
    decExp.dataset.answer       = binData.exponent;
    binSign.dataset.answer      = binData.binSign;
    binary.dataset.answer       = binData.binary;
    decIntValue.dataset.answer  = binData.decIntValue;
    decFracValue.dataset.answer = binData.decFracValue;
    binInt.dataset.answer       = binData.binInt;
    binFracValue.dataset.answer = binData.binFracValue;

    hex.dataset.answer     = bin2hex(binData.binary);
    roundTrip.value = binToDecimal(binData.binary)
    
    removeAllErrors();
    clear();
    if (revealOn.checked)   reveal();
}
