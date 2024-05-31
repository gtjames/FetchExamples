import {code, getInstruction, getInstructions} from './AsmData.js';
import { setSeed } from './utils.js';

let studentID   = document.getElementById('studentID');
let revealBtn   = document.getElementById('reveal');

document.getElementById('step').addEventListener('click', nextStep);
document.getElementById('reset').addEventListener('click', reset);
document.getElementById('clear').addEventListener('click', clearProgram);
revealBtn.parentElement.addEventListener('dblclick', () => revealBtn.disabled = false);

let instructionRows = document.getElementById("instructions")
let refRows = document.getElementById("refRows")
let step = 0;
let application = [];
let binary2Text;

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
        instructionRows.innerHTML += `<tr id='tr-${index}' data-index='${c.index}'> <td>${c.Instruction}</td><td>${c.Hex}</td><td class='offset'>${c.Binary}</td> </tr>`+
                                    `<tr id='bin2Op-${index}'  class='closed'></tr>` +
                                    `<tr id='op2Bin-${index}'  class='closed'></tr>`;
    });
    step = -1;
}

function clearProgram() {
    let pcRow;
    for (let i = 0; i < application.length; i++) {
        pcRow = document.getElementById('tr-'+(i));
        pcRow.classList.remove('next');
        pcRow.classList.remove('current');
        pcRow = document.getElementById('bin2Op-'+(i));
        pcRow.classList = 'closed';
        pcRow = document.getElementById('op2Bin-'+(i));
        pcRow.classList = 'closed';
    }
    step        = -1;
    pcRow = document.getElementById('tr-0');
    pcRow.scrollIntoView({ behavior: 'auto', block: 'start', inline: 'start' });
}

function nextStep() {
    let pcRow;
    binary2Text = document.getElementsByName('source')[0].checked;

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
    
    pcRow = document.getElementById('tr-'+(step+1));
    if (pcRow) pcRow.classList.add('next');   

    if (binary2Text) {
        bin2Text(instruction, step);
    } else {
        text2Bin(instruction, step)
    }
}

function text2Bin (instruction, step) {
    let op2Bin = document.getElementById('op2Bin-'+step);
    op2Bin.classList = '';
    op2Bin.classList.add('currDecode');
    op2Bin.classList.add('opened');

    let parts = instruction.Instruction.split(/[\s,\[\],;]+/);
    if (parts.length < 3)   parts[2] = parts[3] = parts[4] = "";
    if (parts.length < 4)   parts[3] = parts[4] = "";
    
    let locText = code.filter(c => c.Mnemonic === parts[0])[0];

    if (!locText) {
        op2Bin.innerHTML = parts[0];
        locText = code.filter(c => c.OpCode === instruction.Binary.substring(0, c.Width))[0];
        if (!locText) return;
    }

    let tokens = []
    tokens[1] = token2Bin(parts[1]);
    tokens[2] = token2Bin(parts[2]);
    tokens[3] = token2Bin(parts[3]);
    console.log(parts[0]);

    switch ( locText.Format )  {
    case    "R" :
        op2Bin.innerHTML =  `<td>${locText.Mnemonic} ${locText.OpCode} </td>` +
                            `<td>R1:     ${trim(tokens[3], 5)}  ${parts[3]}</td>` +
                            `<td>shAmt:  ${trim(tokens[4], 6)}  ${parts[4]}</td>` +
                            `<td>R2:     ${trim(tokens[2], 5)}  ${parts[2]}</td>` +
                            `<td>Rd:     ${trim(tokens[1], 5)}  ${parts[1]}</td>`;
        break;
    case    "B" :
        op2Bin.innerHTML =  `<td>${parts[0]} ${locText.OpCode} </td>` +
                            `<td colspan="4">Rd: ${trim(parts[1],21)}    ${parts[1]}</td>`;
        break;
    case    "D" :
        op2Bin.innerHTML =  `<td>       ${parts[0]} ${locText.OpCode} </td>` +
                            `<td>Adrs:  ${trim(tokens[3],9)} ${parts[3]}</td>` +
                            `<td>op:    ${trim(tokens[4],2)} ${parts[4]}</td>` +
                            `<td>R2:    ${trim(tokens[2],5)} ${parts[2]}</td>` +
                            `<td>R2:    ${trim(tokens[1],5)} ${parts[1]}</td>`;
        break;
    case    "I" :
        op2Bin.innerHTML =  `<td>${parts[0]} ${locText.OpCode} </td>` +
                            `<td>R1:     ${trim(tokens[3], 5)} ${parts[3]}</td>` +
                            `<td>shAmt:  ${trim(tokens[4],12)} ${parts[4]}</td>` +
                            `<td>R2:     ${trim(tokens[2], 5)} ${parts[2]}</td>` +
                            `<td>Rd:     ${trim(tokens[1], 5)} ${parts[1]}</td>`;
        break;
    case    "IM" :
        op2Bin.innerHTML =  `<td>${parts[0]} ${locText.OpCode} </td>` +
                            `<td>R1:    ${trim(tokens[3],5)} ${parts[3]}</td>` +
                            `<td>shAmt: ${trim(tokens[4],17)} ${parts[4]}</td>` +
                            `<td>Rd:    ${trim(tokens[1],5)} ${parts[1]}</td>`;
        break;
    case    "CB" :
        op2Bin.innerHTML =  `<td>${parts[0]} ${locText.OpCode} </td>` +
                            `<td colspan="3">Label: ${trim(tokens[2],19)}  ${parts[2]}</td>`;
                            `<td>Label: ${trim(tokens[1],19)}  ${parts[1]}</td>`;
        break;
    }
}

function trim (text, width) {
    if (!text) return "empty";
    return text.substring(text.length-width, text.length);
}

function bin2Text(instruction) {
    let bin2Op = document.getElementById('bin2Op-'+step);
    bin2Op.classList = "";
    bin2Op.classList.add('currDecode');
    bin2Op.classList.add('opened');

    let binary = instruction.Binary;

    let locBin = code.filter(c => c.OpCode === binary.substring(0, c.Width))[0];
    if (!locBin) {
        bin2Op.innerHTML = binary.substring(0, locBin.Width);
        return;
    }
    switch ( locBin.Format )  {
    case    "R" :
        bin2Op.innerHTML =  `<td>${locBin.Mnemonic} ${binary.substring(0, locBin.Width)}</td>` +
                            `<td>R1:     ${binary.substring(locBin.Width, 16)}</td>` +
                            `<td>shAmt:  ${binary.substring(15, 22)}</td>` +
                            `<td>R2:     ${binary.substring(22, 27)}</td>` +
                            `<td>Rd:     ${binary.substring(27, 32)}</td>`;
        break;
    case    "B" :
        bin2Op.innerHTML =  `<td>${locBin.Mnemonic} ${binary.substring(0, locBin.Width)}</td>` +
                            `<td colspan="4">Addrs: ${binary.substring(6, 32)}</td>`;
        break;
    case    "D" :
        bin2Op.innerHTML =  `<td>${locBin.Mnemonic} ${binary.substring(0, locBin.Width)}</td>` +
                            `<td colspan="2">Imm: ${binary.substring(locBin.Width, 22)}</td>` +
                            `<td>Rn: ${binary.substring(22, 27)}</td>` +
                            `<td>Rt: ${binary.substring(27, 32)}</td>`;
        break;
    case    "I" :
        bin2Op.innerHTML = `<td>${locBin.Mnemonic} ${binary.substring(0, locBin.Width)}</td>` +
                            `<td colspan="2">Adrs: ${binary.substring(locBin.Width, locBin.Width+12)}</td>` +
                            `<td>Rn:   ${binary.substring(22, 27)}</td>` +
                            `<td>Rt:   ${binary.substring(27, 32)}</td>`;
        break;
    case    "IM" :
        bin2Op.innerHTML =  `<td>${locBin.Mnemonic} ${binary.substring(0, locBin.Width)}</td>` +
                            `<td colspan="3">Adrs: ${binary.substring(9, 27)}</td>` +
                            `<td>Rd: ${binary.substring(27, 32)}</td>`;
        break;
        case    "CB" :
            bin2Op.innerHTML =  `<td>${locBin.Mnemonic} ${binary.substring(0, locBin.Width)}</td>` +
                                `<td colspan="3">Adrs: ${binary.substring(8, 27)}</td>` +
                                `<td>Op: ${binary.substring(27, 32)}</td>`;
        break;
    }
}

function token2Bin(token) {
    let number, hex;
    if ( token.indexOf("0x") >= 0) {
        hex = true;
        token = token.substring(token.indexOf("0x")+2, token.length);
    }
    number = token.replace(/#/, "").replace("0x","");

    if (token.length === 0)
        number = "0";
    else if (token.localeCompare("sp") === 0)
        number = "28";
    else if (token.localeCompare("xzr") === 0)
        number = "31";
    else if (hex)
        number = parseInt(token.replace(/[^0-9A-F]/gi, ""), 16).toString(10);
    else
        number = token.replace(/[^0-9]/gi, "");
    number = "0".repeat(21) + (+number).toString(2);
    number = number.substring(number.length-21, number.length);
    console.log(token, number);
    return number;
}
