import {code, getInstruction, getInstructions} from './AsmData.js';
import { setSeed } from './utils.js';

let studentID   = document.getElementById('studentID');
let revealBtn   = document.getElementById('reveal');
let OpCode      = document.getElementById('OpCode');

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
        refRows.innerHTML += `<tr><td>${c.Mnemonic}</td><td>${c.Format}</td><td>${c.Width}</td><td>${c.Binary}</td></tr>`;
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
    OpCode.value = instruction.Mnemonic;
    let parts = instruction.Instruction.split(/[\s,\[\]]+/)
    pcRow = document.getElementById('tr-'+(step+1));
    if (pcRow) pcRow.classList.add('next');
    
}

