import { code, getInstruction, getInstructions, CB} from './AsmData.js';
import { reveal, close } from './AsmUtils.js';
import { setSeed } from './utils.js';

let studentID   = document.getElementById('studentID');
let testID      = document.getElementById('testID');
let moreBtn     = document.getElementById('more');
let revealBtn     = document.getElementById('reveal');

document.getElementById('step').addEventListener('click', nextStep);
document.getElementById('reset').addEventListener('click', reset);
document.getElementById('clear').addEventListener('click', showInstructions);
document.getElementById('decoder').addEventListener('click', decoder);
document.getElementById(`submit`).addEventListener('click', submit);
moreBtn.addEventListener('click', decoder);
revealBtn.addEventListener('click', reveal);
revealBtn.parentElement.addEventListener('dblclick', () => revealBtn.disabled = false);

let instructionRows = document.getElementById("instructions")
let refRows = document.getElementById("refRows")
let step = 0;
let application = [];
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

    let count = document.getElementById("search").value;
    count = (count.length > 0) ? count : 20;
    application = getInstructions(count);
    showInstructions();
}

function showInstructions() {
    instructionRows.innerHTML = "";
    application.forEach((c, index) => {
        instructionRows.innerHTML += `<tr id='tr-${index}' data-index='${c.index}'> <td id='instr-${index}' >${c.Instruction}</td><td id='hex-${index}' >${c.Hex}</td><td colspan="3" id='binary-${index}' class='binary'>${c.Binary}</td> </tr>`+
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

    if (step >= 0) {
        pcRow = document.getElementById('tr-'+step);
        pcRow.classList.remove('current');
        pcRow.scrollIntoView({ behavior: 'auto', block: 'start', inline: 'start' });
        document.getElementById('binary-'+step).classList.remove('bin2Op-currDecode');
        document.getElementById('instr-' +step).classList.remove('op2Bin-currDecode');
    }

    step++;

    pcRow = document.getElementById('tr-'+step);

    pcRow.classList.add('current');
    document.getElementById('binary-'+step).classList.add('bin2Op-currDecode');
    document.getElementById('instr-' +step).classList.add('op2Bin-currDecode');

    let input = document.querySelector(`#tr-${step}`);
    let instruction = input.dataset.index;
    instruction = getInstruction(+instruction);
    
        bin2Text(instruction);
        text2Bin(instruction)
}

function openInstruction(type, operator) {
    let instr;
    instr = document.getElementById(type+(step-1));
    if (instr)
        instr.className = 'closed';

    instr = document.getElementById(type+step);
    instr.classList = '';
    instr.classList.add(type+'currDecode');
    instr.classList.add('opened');

    if (op) op.className = "";
    op = document.getElementById(operator);
    if (op) {
        op.className = type+"currDecode";
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
        op2Bin.innerHTML =  `<td>${format} ${locText.Mnemonic} ${locText.OpCode} </td>` +
                            `<td>R1:     ${trim(tokens[3], 5)}</td>` +                  //  ${parts[3]}
                            `<td>shAmt:  ${trim(tokens[4], 6)}</td>` +                  //  ${parts[4]}
                            `<td>R2:     ${trim(tokens[2], 5)}</td>` +                  //  ${parts[2]}
                            `<td>Rd:     ${trim(tokens[1], 5)}</td>`;                   //  ${parts[1]}
        break;
    case    "I" :
        op2Bin.innerHTML =  `<td>${format} ${parts[0]} ${locText.OpCode} </td>` +
                            `<td colspan="2">Adrs:   ${trim(tokens[3],12)}</td>` +     //  ${parts[3]
                            `<td>R2:     ${trim(tokens[2], 5)}</td>` +                  //  ${parts[2]}
                            `<td>Rd:     ${trim(tokens[1], 5)}</td>`;                   //  ${parts[1]}
        break;
    case    "D" :
        op2Bin.innerHTML =  `<td>${format} ${parts[0]} ${locText.OpCode} </td>` +
                            `<td>Adrs:  ${trim(tokens[3],9)}</td>` +                    //  ${parts[3]}
                            `<td>Op2:   ${parts[0].substring(4,2)}</td>` +
                            `<td>Rn:    ${trim(tokens[2],5)}</td>` +                    //  ${parts[2]}
                            `<td>Rt:    ${trim(tokens[1],5)}</td>`;                     //  ${parts[1]}
        break;
    case    "B" :
        op2Bin.innerHTML =  `<td>${format} ${parts[0]} ${locText.OpCode} </td>` +
                            `<td colspan="4">Adrs: ${trim(tokens[1].substring(0,tokens[1].length-1),19)}</td>`;         //  ${parts[1]} s/b 21 but we shift off 2 bits
        break;
    case    "IM" :
        op2Bin.innerHTML =  `<td>${format} ${parts[0]} ${locText.OpCode} </td>` +
                            `<td>Rn:    ${trim(tokens[3],5)}  </td>` +                  //  ${parts[3]}
                            `<td colspan="2">Immed: ${trim(tokens[2],12)} </td>` +      //  ${parts[4]}
                            `<td>Rd:                ${trim(tokens[1],5)}  </td>`;       //  ${parts[1]}
        break;
    case    "CB" :
        op2Bin.innerHTML =  `<td>${format} ${parts[0]} ${locText.OpCode} </td>` +
                            `<td colspan="3">Adrs: ${trim(tokens[parts[0][0] == 'C' ? 2:1],21).substring(0,19)}</td>` +       //  ${parts[2]}  s/b 19 but we shift off 2 bits
                            `<td>Op: ${parts[0][0] == 'C' ? trim(tokens[1],5) : CB[parts[0]]}</td>`;                       //  ${parts[1]}
        break;
    }
}

function bin2Text(instruction) {
    let binary = instruction.Binary;
    let parts = instruction.Instruction.split(/[\s,\[\],;]+/);

    let bin2Op = openInstruction('bin2Op-', parts[0]);

    let locBin = code.filter(c => c.OpCode === binary.substring(0, c.Width))[0];
    if (!locBin) {
        let locText = code.filter(c => c.Mnemonic === parts[0])[0];
        bin2Op.innerHTML = binary;
        return;
    }
    let format = locBin.Format ;
    switch ( format )  {
    case    "R" :
        bin2Op.innerHTML =  `<td>${format} ${locBin.Mnemonic} ${binary.substring(0, locBin.Width)}x</td>` +
                            `<td>R1:     ${binary.substring(locBin.Width, locBin.Width+5)}</td>` +
                            `<td>shAmt:  ${binary.substring(locBin.Width+5, 22)}</td>` +
                            `<td>R2:     ${binary.substring(22, 27)}</td>` +
                            `<td>Rd:     ${binary.substring(27, 32)}</td>`;
        break;
        case    "I" :
            bin2Op.innerHTML = `<td>${format} ${locBin.Mnemonic} ${binary.substring(0, locBin.Width)}x</td>` +
                                `<td colspan="2">Adrs: ${binary.substring(locBin.Width, locBin.Width+12)}</td>` +
                                `<td>Rn:   ${binary.substring(22, 27)}</td>` +
                                `<td>Rt:   ${binary.substring(27, 32)}</td>`;
            break;
    case    "D" :
        bin2Op.innerHTML =  `<td>${format} ${locBin.Mnemonic} ${binary.substring(0, locBin.Width)}x</td>` +
                            `<td>Adrs: ${binary.substring(locBin.Width, 20)}</td>` +
                            `<td>Op2:  ${binary.substring(20, 22)}</td>` +
                            `<td>Rn:   ${binary.substring(22, 27)}</td>` +
                            `<td>Rt:   ${binary.substring(27, 32)}</td>`;
        break;
        case    "B" :
            bin2Op.innerHTML =  `<td>${format} ${locBin.Mnemonic} ${binary.substring(0, locBin.Width)}x</td>` +
                                `<td colspan="4">Adrs: ${binary.substring(6, 32)}</td>`;
            break;
        case    "IM" :
            bin2Op.innerHTML =  `<td>${format} ${locBin.Mnemonic} ${binary.substring(0, locBin.Width)}x</td>` +
                            `<td colspan="3">Adrs: ${binary.substring(9, 27)}</td>` +
                            `<td>Rd: ${binary.substring(27, 32)}</td>`;
        break;
        case    "CB" :
            bin2Op.innerHTML =  `<td>${format} b.${CB[binary.substring(27, 32)]} ${binary.substring(0, locBin.Width)}x</td>` +
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

    if (token.length === 0)                         number = "0";
    else if (token.localeCompare("sp")  === 0)      number = "28";
    else if (token.localeCompare("xzr") === 0)      number = "31";
    else if (hex)
        number = parseInt(token.replace(/[^0-9A-F-]/gi, ""), 16).toString(10);
    else
        number = token.replace(/[^0-9-]/gi, "");
    number = "0".repeat(21) + (+number).toString(2);
    number = number.substring(number.length-21, number.length);
    console.log(token, number);
    return number;
}

function decoder() {  
    let id = testID.value;
    setSeed( (id.length > 0) ? "."+id : -1 );
    revealBtn.disabled = (id.length > 0);

    let test = document.getElementById('test');
    let instructions = getInstructions(5);
    test.innerHTML = "";
    
    instructions.forEach((i,index) => { 
        let binary = i.Binary;
        let parts = i.Instruction.split(/[\s,\[\],;]+/);
        let locBin = code.filter(c => c.OpCode === binary.substring(0, c.Width))[0];
        let innerHTML;
        if (!locBin) return;
        switch ( locBin.Format )  {
            case    "R" :
                innerHTML = 
                    `<td>${locBin.Format}</td>` +
                    `<td><input id='bin${index}0'  class="medium"   type='text' data-answer='${binary.substring(0, locBin.Width)}'</td>` +
                    `<td><input id='bin${index}1'                   type='text' data-answer='${binary.substring(locBin.Width, locBin.Width+5)}'</td>` +
                    `<td><input id='bin${index}2'                   type='text' data-answer='${binary.substring(16, 22)}'        </td>` +
                    `<td><input id='bin${index}3'                   type='text' data-answer='${binary.substring(22, 27)}'        </td>` +
                    `<td><input id='bin${index}4'                   type='text' data-answer='${binary.substring(27, 32)}'        </td>`;
                break;
            case    "I" :
                innerHTML = 
                    `<td>${locBin.Format}</td>` +
                    `<td><input id='bin${index}0'  class="medium" type='text' data-answer='${binary.substring(0, locBin.Width)}'              ></td>` +
                    `<td><input id='bin${index}1'  class="big"    type='text' data-answer='${binary.substring(locBin.Width, locBin.Width+12)}'></td>` +
                    `<td><input id='bin${index}2'                 type='text' data-answer='${binary.substring(22, 27)}'                       ></td>` +
                    `<td><input id='bin${index}3'                 type='text' data-answer='${binary.substring(27, 32)}'                       ></td>`;
                break;
            case    "D" :
                innerHTML = 
                    `<td>${locBin.Format}</td>` +
                    `<td><input id='bin${index}0'  class="medium"   type='text' data-answer='${binary.substring(0, locBin.Width)}'  ></td>` +
                    `<td><input id='bin${index}1'  class="big"      type='text' data-answer='${binary.substring(locBin.Width, 20)}' ></td>` +
                    `<td><input id='bin${index}2'                   type='text' data-answer='${binary.substring(20, 22)}'           ></td>` +
                    `<td><input id='bin${index}3'                   type='text' data-answer='${binary.substring(22, 27)}'           ></td>` +
                    `<td><input id='bin${index}4'                   type='text' data-answer='${binary.substring(27, 32)}'           ></td>`;
                break;
            case    "B" :
                innerHTML = 
                    `<td>${locBin.Format}</td>` +
                    `<td><input id='bin${index}0' class="medium"    type='text' data-answer='${binary.substring(0, locBin.Width)}'></td>` +
                `<td><input id='bin${index}1' class="big"           type='text' data-answer='${binary.substring(6, 32)}'          ></td>`;
                break;
            case    "IM" :
                innerHTML = 
                    `<td>${locBin.Format}</td>` +
                    `<td><input id='bin${index}0'  class="medium"   type='text' data-answer='${binary.substring(0, locBin.Width)}' ></td>` +
                    `<td><input id='bin${index}1'  class="big"      type='text' data-answer='${binary.substring(9, 27)}'           ></td>` +
                    `<td><input id='bin${index}2'  type='text'                  data-answer='${binary.substring(27, 32)}'          ></td>`;
                break;
                case    "CB" :
                innerHTML = 
                    `<td>${locBin.Format}</td>` +
                    `<td><input id='bin${index}0'  class="medium"   type='text'     data-answer='${binary.substring(0, locBin.Width)}'     ></td>` +
                    `<td><input id='bin${index}1'  class="big"      type='text'     data-answer='${binary.substring(locBin.Width, 27)}'    ></td>` +
                    `<td><input id='bin${index}2'                   type='text'     data-answer='${binary.substring(27, 32)}'              ></td>`;
                break;
            }

        test.innerHTML += `<tr  id='test-${index}' data-Binary='${i.Binary}' data-Instruction='${i.Instruction}' data-index='${i.index}'>` +
        `<td >${i.Hex}</td>` +
        `<td><input data-answer='${parts[0]}' id='op${index}0' type='text'></td>` +
        `<td><input data-answer='${parts[1]}' id='op${index}1' type='text'></td>` +
        `<td><input data-answer='${parts[2]}' id='op${index}2' type='text'></td>`      +
        `<td><input data-answer='${parts[3]}' id='op${index}3' type='text'></td></tr>` +
        `</tr>${innerHTML}</tr>`});
}

function submit() {
    for (let r = 0; r < 5; r++)
        for (let c = 0; c < 5; c++) {
            close(`op${r}${c}`,  true,  0, false, 0 );
            close(`bin${r}${c}`,  true,  0, true, 0 );
        }
}
