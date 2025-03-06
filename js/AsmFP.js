import {reveal, close, clear, removeAllErrors, decToBin, bin2hex} from './AsmUtils.js';
import {getBinRand, setSeed} from './utils.js';
    
let dec          = document.getElementById('dec'  );
let frac         = document.getElementById('frac' );
let expBin       = document.getElementById('expBin');
let expDec       = document.getElementById('expDec');
let decIntValue  = document.getElementById('decIntValue');
let decFracValue = document.getElementById('decFracValue');
let binFracValue = document.getElementById('binFracValue');
let intBin       = document.getElementById('intBin');
let binSign      = document.getElementById('binSign');
let binary       = document.getElementById('binary' );
let hex          = document.getElementById('hex' );
let revealOn     = document.getElementById('revealOn');
let revealBtn    = document.getElementById('reveal');
let useMe        = document.getElementById('useMe');
let studentID    = document.getElementById('studentID');

document.getElementById(`reset`).addEventListener('click', reset);
document.getElementById(`submit`).addEventListener('click', submit);
document.getElementById(`reveal`).addEventListener('click', reveal);
revealBtn.parentElement.addEventListener('dblclick', () => revealBtn.disabled = false);

reset();

export function submit() {
    close('binSign',      true,  0,     false, 0);
    close('expBin',       true,  0,     false, 0);
    close('expDec',       true,  0,     false, 0);

    close('frac',         true,  0,     false, 23);
    close('hex',          true,  0,     false, 8);
    close('binary',       true,  0,     false, 32);
}

function reset() {
    let id = studentID.value;
    document.getElementById(`reveal`).disabled = (id.length > 0);
    if (id.length != 0)       revealOn.checked = false;
    setSeed( (id.length > 0) ? "."+id : -1 );

    let fltPt;
    fltPt = (useMe.checked) ? getBinRand() : dec.value;
    let binData = decToBin(fltPt);
    dec.value   = fltPt;


    frac.dataset.answer    = binData.binFraction;
    expBin.dataset.answer  = binData.binExponent;
    expDec.dataset.answer  = binData.exponent;
    binSign.dataset.answer = binData.binSign;
    binary.dataset.answer  = binData.binary;
    decIntValue.dataset.answer  = binData.decIntValue;
    decFracValue.dataset.answer = binData.decFracValue;
    intBin.dataset.answer       = binData.intBin;
    binFracValue.dataset.answer = binData.binFracValue;

    hex.dataset.answer     = bin2hex(binData.binary);
    
    removeAllErrors();
    clear();
    if (revealOn.checked)   reveal();
}
