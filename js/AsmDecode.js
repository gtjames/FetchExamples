import {code, getInstruction, getInstructions} from './AsmData.js';
import { setSeed } from './utils.js';

let studentID   = document.getElementById('studentID');
// let revealBtn   = document.getElementById('reveal');

document.getElementById('step').addEventListener('click', nextStep);
document.getElementById('reset').addEventListener('click', reset);
document.getElementById('clear').addEventListener('click', showInstructions);
// revealBtn.parentElement.addEventListener('dblclick', () => revealBtn.disabled = false);

let instructionRows = document.getElementById("instructions")
let refRows = document.getElementById("refRows")
let step = 0;
let application = [];
let binary2Text;
let op;


showOpcodes();
reset();

function showOpcodes () {
    refRows.innerHTML = '';
    code.forEach(c => {
        refRows.innerHTML += `<tr id="${c.Mnemonic}"><td>${c.Mnemonic}</td><td>${c.Format}</td><td>${c.Width}</td><td>${c.OpCode}</td></tr>`;
    });
}

function reset () {
    let id = studentID.value;
    setSeed( (id.length > 0) ? "."+id : -1 );
    if (op) op.className = "";

    application = getInstructions(20);
    showInstructions();
}

function showInstructions() {
    instructionRows.innerHTML = "";
    application.forEach((c, index) => {
        instructionRows.innerHTML += `<tr id='tr-${index}' data-index='${c.index}'> <td id='instr-${index}' >${c.Instruction}</td><td id='binary-${index}' >${c.Hex}</td><td colspan="3" class='binary'>${c.Binary}</td> </tr>`+
                                    `<tr id='bin2Op-${index}'  class='closed'></tr>` +
                                    `<tr id='op2Bin-${index}'  class='closed'></tr>`;
    });
    step = -1;
    if (op) op.className = "";
    let pcRow = document.getElementById('tr-0');
    pcRow.scrollIntoView({ behavior: 'auto', block: 'start', inline: 'start' });
    pcRow = document.getElementById('ADD');
    pcRow.scrollIntoView({ behavior: 'auto', block: 'start', inline: 'start' });
}

function nextStep() {
    let pcRow;
    binary2Text = document.getElementsByName('source')[0].checked;

    if (step >= 0) {
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
    
    if (binary2Text) {
        bin2Text(instruction);
    } else {
        text2Bin(instruction)
    }
}

function openInstruction(type, operator) {
    let instr;
    instr = document.getElementById(type+(step-1));
    if (instr)
        instr.className = 'closed';

    instr = document.getElementById(type+step);
    instr.classList = '';
    instr.classList.add('currDecode');
    instr.classList.add('opened');

    if (op) op.className = "";
    op = document.getElementById(operator);
    if (op) {
        op.className = "currDecode";
        op.scrollIntoView({ behavior: 'auto', block: 'start', inline: 'start' });
    }
    return  instr;
}

function text2Bin (instruction) {
    let parts = instruction.Instruction.split(/[\s,\[\],;]+/);
    if (parts.length == 2)   parts[2] = " ";
    if (parts.length == 3)   parts[3] = " ";
    if (parts.length == 4)   parts[4] = " ";

    let op2Bin = openInstruction('op2Bin-', parts[0]);
    
    let locText = code.filter(c => c.Mnemonic === parts[0])[0];

    if (!locText) {
        op2Bin.innerHTML = `<td colspan="6">${parts[0]}</td>`;
        locText = code.filter(c => c.OpCode === instruction.Binary.substring(0, c.Width))[0];
        if (!locText) return;
    }

    let format = locText.Format;
    let tokens = []
    tokens[1] = token2Bin(parts[1]);
    tokens[2] = token2Bin(parts[2]);
    tokens[3] = token2Bin(parts[3]);
    tokens[4] = token2Bin(parts[4][0] == "L" ? parts[5] : parts[4]);
    // if ( format == "R" && parts[3][0] != 'w' && parts[3][0] != 'x') {
    //     format = "I";
    //     if (parts[0][parts[0].length-1] == "S")
    //         parts[0] = parts[0].substring(0,parts[0].length-1) +  "IS";
    //     else
    //         if (parts[0].substring(0,2) != "AS") parts[0] += "I";
    //     console.log(parts[0]);
    //     locText = code.filter(c => c.Mnemonic === parts[0])[0];
    // }

    switch ( format )  {
    case    "R" :
        op2Bin.innerHTML =  `<td>${locText.Mnemonic} ${locText.OpCode} </td>` +
                            `<td>R1:     ${trim(tokens[3], 5)}</td>` +                  //  ${parts[3]}
                            `<td>shAmt:  ${trim(tokens[4], 6)}</td>` +                  //  ${parts[4]}
                            `<td>R2:     ${trim(tokens[2], 5)}</td>` +                  //  ${parts[2]}
                            `<td>Rd:     ${trim(tokens[1], 5)}</td>`;                   //  ${parts[1]}
        break;
    case    "B" :
        op2Bin.innerHTML =  `<td>${parts[0]} ${locText.OpCode} </td>` +
                            `<td colspan="4">Rd: ${trim(tokens[1],21)}</td>`;           //  ${parts[1]}
        break;
    case    "D" :
        op2Bin.innerHTML =  `<td>       ${parts[0]} ${locText.OpCode} </td>` +
                            `<td>Adrs:  ${trim(tokens[3],19)}</td>` +                   //  ${parts[3]}
                            `<td>op:    ${parts[0].substring(4,6)}</td>` +
                            `<td>Rd:    ${trim(tokens[2],5)}</td>` +                    //  ${parts[2]}
                            `<td>R2:    ${trim(tokens[1],5)}</td>`;                     //  ${parts[1]}
        break;
    case    "I" :
        op2Bin.innerHTML =  `<td>${parts[0]} ${locText.OpCode} </td>` +
                            `<td colspan="2">Adrs:   ${trim(tokens[3],12)}</td>` +     //  ${parts[3]
                            `<td>R2:     ${trim(tokens[2], 5)}</td>` +                  //  ${parts[2]}
                            `<td>Rd:     ${trim(tokens[1], 5)}</td>`;                   //  ${parts[1]}
        break;
    case    "IM" :
        op2Bin.innerHTML =  `<td>${parts[0]} ${locText.OpCode} </td>` +
                            `<td>Rn:    ${trim(tokens[3],5)}  </td>` +                  //  ${parts[3]}
                            `<td colspan="2">Immed: ${trim(tokens[2],12)} </td>` +      //  ${parts[4]}
                            `<td>Rd:    ${trim(tokens[1],5)}  </td>`;                   //  ${parts[1]}
        break;
    case    "CB" :
        op2Bin.innerHTML =  `<td>${parts[0]} ${locText.OpCode} </td>` +
                            `<td colspan="3">Label: ${trim(tokens[2],19)}</td>` +       //  ${parts[2]}
                            `<td>Rd: ${trim(tokens[1],19)}</td>`;                       //  ${parts[1]}
        break;
    }
}

function bin2Text(instruction) {
    let binary = instruction.Binary;
    let parts = instruction.Instruction.split(/[\s,\[\],;]+/);

    let bin2Op = openInstruction('bin2Op-', parts[0]);

    let locBin = code.filter(c => {
        console.log((c.OpCode === binary.substring(0, c.Width)) + "==" + c.Mnemonic + " " + c.OpCode + " " + binary.substring(0, c.Width) + " " + c.Width);
        return (c.OpCode === binary.substring(0, c.Width))})[0];
    let locText;
    if (!locBin) {
        locText = code.filter(c => c.Mnemonic === parts[0])[0];
        bin2Op.innerHTML = binary;
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
                            `<td>Imm: ${binary.substring(locBin.Width, 20)}</td>` +
                            `<td>Op2: ${binary.substring(20, 22)}</td>` +
                            `<td>Rn:  ${binary.substring(22, 27)}</td>` +
                            `<td>Rt:  ${binary.substring(27, 32)}</td>`;
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
                                `<td colspan="3">Adrs: ${binary.substring(locBin.Width, 27)}</td>` +
                                `<td>Op: ${binary.substring(27, 32)}</td>`;
        break;
    }
}

function trim (text, width) {
    if (!text) return "empty";
    return text.substring(text.length-width, text.length);
}

function token2Bin(token) {
    let number, hex;
    if ( token.indexOf("0x") >= 0) {
        hex = true;
        // token = token.substring(token.indexOf("0x")+2, token.length);
        token = token.replace("0x","")
    }
    number = token.replace(/#/, "").replace("0x","");

    if (token.length === 0)
        number = "0";
    else if (token.localeCompare("sp") === 0)
        number = "28";
    else if (token.localeCompare("xzr") === 0)
        number = "31";
    else if (hex)
        number = parseInt(token.replace(/[^0-9A-F-]/gi, ""), 16).toString(10);
    else
        number = token.replace(/[^0-9-]/gi, "");
    number = "0".repeat(21) + (+number).toString(2);
    number = number.substring(number.length-21, number.length);
    console.log(token, number);
    return number;
}
