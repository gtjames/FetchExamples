import {reveal, close, clear, removeAllErrors, decToBin, bin2hex} from './AsmUtils.js';
import {getBinRand, setSeed} from './utils.js';
    
let dec         = document.getElementById('dec'  );
let fp          = document.getElementById('fp'   );
let frac        = document.getElementById('frac' );
let exp         = document.getElementById('exp'  );
let expDec      = document.getElementById('expDec');
let binary      = document.getElementById('binary' );
let hex         = document.getElementById('hex' );
let revealOn    = document.getElementById('revealOn');
let revealBtn   = document.getElementById('reveal');
let studentID   = document.getElementById('studentID');

document.getElementById(`reset`).addEventListener('click', reset);
document.getElementById(`submit`).addEventListener('click', submit);
document.getElementById(`reveal`).addEventListener('click', reveal);
revealBtn.parentElement.addEventListener('dblclick', () => revealBtn.disabled = false);

reset();

export function submit() {
    close('fp',           true,  0,     false, 0);
    close('exp',          true,  0,     false, 0);
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

    let fltPt   = getBinRand();
    let binData = decToBin(fltPt);
    dec.value   = fltPt;

    fp.dataset.answer      = binData.binary
    frac.dataset.answer    = binData.binFraction;
    expDec.dataset.answer  = binData.exponent;
    exp.dataset.answer     = binData.binExponent;
    binary.dataset.answer  = binData.binary;
    hex.dataset.answer     = bin2hex(binData.binary);
    
    removeAllErrors();
    clear();
    if (revealOn.checked)   reveal();
}
