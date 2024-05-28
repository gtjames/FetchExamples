import {code, getInstruction, getInstructions} from './AsmData.js';
import { setSeed } from './utils.js';

let studentID   = document.getElementById('studentID');
let revealBtn   = document.getElementById('reveal');
let Operator      = document.getElementById('Operator');
let OpCode      = document.getElementById('OpCode');
let R1      = document.getElementById('R1');
let R2      = document.getElementById('R2');
let Rd      = document.getElementById('Rd');

document.getElementById('step').addEventListener('click', nextStep);
document.getElementById('reset').addEventListener('click', reset);
// document.getElementById('clear').addEventListener('click', clearCache);
revealBtn.parentElement.addEventListener('dblclick', () => revealBtn.disabled = false);

let instructionRows = document.getElementById("instructions")
let refRows = document.getElementById("refRows")
let step = 0;
let application = [];

showOpcodes();
reset();

function showOpcodes () {
    refRows.innerHTML = '';
    code.forEach(c => {
        refRows.innerHTML += `<tr><td>${c.Mnemonic}</td><td>${c.Format}</td><td>${c.Width}</td><td>${c.OpCode}</td></tr>`;
    });
}

function reset () {
    let id = studentID.value;
    // document.getElementById(`reveal`).disabled = (id.length > 0);
    // if (id.length != 0)       revealOn.checked = false;
    setSeed( (id.length > 0) ? "."+id : -1 );

    application = getInstructions(20);
    instructionRows.innerHTML = "";
    application.forEach((c, index) => {
        instructionRows.innerHTML += `<tr id='tr-${index}' data-index='${c.index}'> <td>${c.Instruction}</td><td>${c.Hex}</td><td class='offset'>${c.Binary}</td>
                                       <td>${c.OpCode}</td> <td class='tag'>${c.Breakdown}</td></tr>`;
    });
    step = -1;
}

function nextStep() {
    let pcRow, cacheRow;
    if (step >= 0) {
        pcRow = document.getElementById('tr-'+(step+1));
        if(pcRow) pcRow.classList.remove('next');

        pcRow = document.getElementById('tr-'+step);
        pcRow.classList.remove('current');
        pcRow.scrollIntoView({ behavior: 'auto', block: 'start', inline: 'start' });
    }

    step++;

    pcRow = document.getElementById('tr-'+step);
    pcRow.classList.add('current');
    let input = document.querySelector(`#tr-${step}`);
    let instruction = input.dataset.index;
    instruction = getInstruction(+instruction);
    Operator.value = instruction.Mnemonic;
    let binary = instruction.Binary;
    
    let loc = code.filter(c => {
        // console.log (c.OpCode + " - " + binary.substring(0, c.Width) + " - " + (c.OpCode === binary.substring(0, c.Width)))
        return c.OpCode === binary.substring(0, c.Width)
    })[0];
    console.log(loc.OpCode + "--" + loc.Format)
    OpCode.value = loc.OpCode;
    if ( loc.Format === "R") {      //  10  5   6   5   5
        R1.value = binary.substring(11, 16);
        R2.value = binary.substring(22, 27);
        Rd.value = binary.substring(27, 32);
    }
    if ( loc.Format === "D") {
        R1.value = binary.substring(11, 20);
        R2.value = binary.substring(22, 27);
        Rd.value = binary.substring(27, 32);

    }
    if ( loc.Format === "I") {
        R1.value = binary.substring(10, 22);
        R2.value = binary.substring(22, 27);
        Rd.value = binary.substring(27, 32);

    }
    if ( loc.Format === "IM") {}
    if ( loc.Format === "CB") {
        R1.value = binary.substring(8, 27);
        Rd.value = binary.substring(27, 32);

    }
    let parts = instruction.Instruction.split(/[\s,\[\]]+/)
    pcRow = document.getElementById('tr-'+(step+1));
    if (pcRow) pcRow.classList.add('next');
    
}

