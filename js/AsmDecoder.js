import { code, getInstruction, getInstructions, CB} from './AsmData.js';
import { reveal, close, bin2hex } from './AsmUtils.js';
import { setSeed } from './utils.js';

let studentID   = document.getElementById('studentID');
let testID      = document.getElementById('testID');
let moreBtn     = document.getElementById('more');
let revealBtn   = document.getElementById('reveal');
let col_0 = document.getElementById('col_0');
let col_1 = document.getElementById('col_1');
let col_2 = document.getElementById('col_2');
let col_3 = document.getElementById('col_3');
let col_4 = document.getElementById('col_4');
let col_5 = document.getElementById('col_5');

document.getElementById('hex2Asm').addEventListener('click', hex2Asm);
document.getElementById('asm2Bin').addEventListener('click', asm2Bin);
document.getElementById(`submit`).addEventListener('click', submit);

moreBtn.addEventListener('click', moreExamples);
revealBtn.addEventListener('dblclick', reveal);
revealBtn.parentElement.addEventListener('dblclick', () => revealBtn.disabled = false);

let refRows = document.getElementById("refRows")
let application = [];
let op;


showOpcodes();

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

let oldContent = "";
let mode = "";

function moreExamples() {
    oldContent = "";
    if(mode === "hex2Asm")
        hex2Asm();
    else
        asm2Bin();
}

function asm2Bin() {  
    mode = "asm2Bin";
    document.getElementById("label").innerText = "Assembler to Hex";

    let id = testID.value;
    setSeed( (id.length > 0) ? "."+id : -1 );
    revealBtn.disabled = (id.length > 0);

    let test = document.getElementById('test');
    let instructions = getInstructions(5);
    test.innerHTML = `<tr><td colspan="5">` + 
    `Line 2: Enter the Binary for the instruction<br>` +
    `Line 3: Rearange the binary for the order the bits are in the instruction<br>` +
    `Line 4: Create the 32-bit instruction and the Hex representation</td></tr>`;

    instructions.forEach((i,index) => { 
        let binary = i.Binary;
        let parts = i.Instruction.split(/[\s,\[\],;]+/);
        if(!parts[3]) parts[3] = "";
        let locBin = code.filter(c => c.OpCode === binary.substring(0, c.Width))[0];

        let assembly = `<tr> <td>Format: ${locBin.Format}</td>` +
                            `<td class="op">   ${parts[0]}</td>` +
                            `<td class="rd">   ${parts[1]}</td>` +
                            `<td class="rn">   ${parts[2]}</td>` +
                            `<td class="rm">   ${parts[3]}</td>` +
                            `<td class="shamt">${parts[4]}</td></tr>`;
        let line1 = `<tr data-Binary='${i.Binary}' data-Instruction='${i.Instruction}' data-Format='${locBin.Format}' data-index='${i.index}'>` +
                        `<td class="off">0b <input id='bin${index}5'    class="medium" type='text' maxlength="32" data-answer='${binary.substring(0,16)}'>` +
                                    `<br>0b <input id='bin${index}6'    class="medium" type='text' maxlength="32" data-answer='${binary.substring(16)}'></td>`;
        let line2 = `<tr><td class="off">0x <input id='instr${index}6'  class="medium" type='text' maxlength="8"  data-answer='${bin2hex(binary)}'></td>`;

        if (!locBin) return;
        switch ( locBin.Format )  {
        case    "R" :
            line1 +=
                `<td class="op">op    <input id='bin${index}0'  class="medium" type='text' maxlength="11" data-answer='${binary.substring(0, locBin.Width)}'></td>` +
                `<td class="rd">rd    <input id='bin${index}4'  class="medium" type='text' maxlength="5"  data-answer='${binary.substring(27, 32)}'        ></td>` +
                `<td class="rn">rn    <input id='bin${index}3'  class="medium" type='text' maxlength="5"  data-answer='${binary.substring(22, 27)}'        ></td>` +
                `<td class="rm">rm    <input id='bin${index}1'  class="medium" type='text' maxlength="5"  data-answer='${binary.substring(locBin.Width, locBin.Width+5)}'></td>` +
                `<td class="shamt">sh <input id='bin${index}2'  class="medium" type='text' maxlength="6"  data-answer='${binary.substring(16, 22)}'        ></td>` +
                `</tr>`;
            line2 +=
                `<td class="op">op    <input id='instr${index}0'  class="medium"   type='text' maxlength="11" data-answer='${binary.substring(0, locBin.Width)}'></td>` +
                `<td class="rm">rm    <input id='instr${index}1'  class="medium"   type='text' maxlength="5"  data-answer='${binary.substring(locBin.Width, locBin.Width+5)}'></td>` +
                `<td class="shamt">sh <input id='instr${index}2'  class="medium"   type='text' maxlength="6"  data-answer='${binary.substring(16, 22)}'        ></td>` +
                `<td class="rn">rn    <input id='instr${index}3'  class="medium"   type='text' maxlength="5"  data-answer='${binary.substring(22, 27)}'        ></td>` +
                `<td class="rd">rd    <input id='instr${index}4'  class="medium"   type='text' maxlength="5"  data-answer='${binary.substring(27, 32)}'        ></td>` +
                `</tr>`;
            break;
        case    "I" :
            line1 +=
                `<td class="op">op   <input id='bin${index}0'  class="medium" type='text' data-answer='${binary.substring(0, locBin.Width)}'              ></td>` +
                `<td class="rd">rd   <input id='bin${index}3'                 type='text' data-answer='${binary.substring(27, 32)}'                       ></td>` +
                `<td class="rn">rn   <input id='bin${index}2'                 type='text' data-answer='${binary.substring(22, 27)}'                       ></td>` +
                `<td class="off">Imm <input id='bin${index}1'  class="big"    type='text' data-answer='${binary.substring(locBin.Width, locBin.Width+12)}'></td>` +
                `</tr>`;
            line2 +=
                `<td class="op">op   <input id='instr${index}0'  class="medium" type='text' data-answer='${binary.substring(0, locBin.Width)}'              ></td>` +
                `<td class="off">Imm <input id='instr${index}1'  class="big"    type='text' data-answer='${binary.substring(locBin.Width, locBin.Width+12)}'></td>` +
                `<td class="rn">rn   <input id='instr${index}2'                 type='text' data-answer='${binary.substring(22, 27)}'                       ></td>` +
                `<td class="rd">rd   <input id='instr${index}3'                 type='text' data-answer='${binary.substring(27, 32)}'                       ></td>` +
                `</tr>`;
            break;
        case    "D" :
            line1 +=
                `<td class="op">op   <input id='bin${index}0'   type='text' maxlength="11" data-answer='${binary.substring(0, locBin.Width)}'  class="medium" ></td>` +
                `<td class="rd">rd   <input id='bin${index}4'   type='text' maxlength="5"  data-answer='${binary.substring(27, 32)}'           class="small"  ></td>` +
                `<td class="rn">rn   <input id='bin${index}3'   type='text' maxlength="5"  data-answer='${binary.substring(22, 27)}'                          ></td>` +
                `<td class="off">off <input id='bin${index}1'   type='text' maxlength="9"  data-answer='${binary.substring(locBin.Width, 20)}' class="big"    ></td>` +
                `<td class="op2">op2 <input id='bin${index}2'   type='text' maxlength="2"  data-answer='${binary.substring(20, 22)}'                          ></td>` +
                `</tr>`;
            line2 +=
                `<td class="op">op   <input id='instr${index}0' type='text' maxlength="11" data-answer='${binary.substring(0, locBin.Width)}'  class="medium" ></td>` +
                `<td class="off">off <input id='instr${index}1' type='text' maxlength="9"  data-answer='${binary.substring(locBin.Width, 20)}' class="big"    ></td>` +
                `<td class="op2">op2 <input id='instr${index}2' type='text' maxlength="2"  data-answer='${binary.substring(20, 22)}'                          ></td>` +
                `<td class="rn">rn   <input id='instr${index}3' type='text' maxlength="5"  data-answer='${binary.substring(22, 27)}'                          ></td>` +
                `<td class="rd">rd   <input id='instr${index}4' type='text' maxlength="5"  data-answer='${binary.substring(27, 32)}'                          ></td>` +
                `</tr>`;
            break;
        case    "B" :
        line1 +=
                `<td class="op">op                 <input id='bin${index}0' class="medium"    type='text' data-answer='${binary.substring(0, locBin.Width)}' ></td>` +
                `<td class="broff" colspan="3">off <input id='bin${index}1' class="vbig"      type='text' data-answer='${binary.substring(locBin.Width, 32)}'></td>` +
                `</tr>`;
            break;
        case    "IM" :
        line1 +=
                `<td class="op">op     <input id='bin${index}0'  class="medium"   type='text' data-answer='${binary.substring(0, locBin.Width)}' ></td>` +
                `<td class="broff">Imm <input id='bin${index}1'  class="big"      type='text' data-answer='${binary.substring(9, 27)}'           ></td>` +
                `<td class="rd">rd     <input id='bin${index}2'                    type='text' data-answer='${binary.substring(27, 32)}'          ></td>` +
                `</tr>`;
            break;
        case    "CB" :
        line1 +=
            `<td class="op">op     <input id='bin${index}0'  class="medium"   type='text'     data-answer='${binary.substring(0, locBin.Width)}'     ></td>` +
            `<td class="broff">off <input id='bin${index}1'  class="big"      type='text'     data-answer='${binary.substring(locBin.Width, 27)}'    ></td>` +
            `<td class="rd">rd     <input id='bin${index}2'                   type='text'     data-answer='${binary.substring(27, 32)}'              ></td>` +
            `</tr>`;
        line2 +=
            `<td class="op">op     <input id='instr${index}0'  class="medium"   type='text'     data-answer='${binary.substring(0, locBin.Width)}'     ></td>` +
            `<td class="broff">off <input id='instr${index}1'  class="big"      type='text'     data-answer='${binary.substring(locBin.Width, 27)}'    ></td>` +
            `<td class="rd">rd     <input id='instr${index}2'                   type='text'     data-answer='${binary.substring(27, 32)}'              ></td>` +
            `</tr>`;
            break;
    }
    test.innerHTML += `${assembly}${line1}${line2}<tr><td class="blk" colspan="6"></td></tr>`;
    });
}

function hex2Asm() { 
    mode = "hex2Asm";
    document.getElementById("label").innerText = "Hex to Assembler";

    let id = testID.value;
    setSeed( (id.length > 0) ? "."+id : -1 );
    revealBtn.disabled = (id.length > 0);

    let test = document.getElementById('test');
    let instructions = getInstructions(5);
    test.innerHTML = `<tr><td colspan="5">` + 
    `Line 2: Separate the bits into the adjacent cells in order<br>` + 
    `Line 3: Rearrange the cells in the order of the assembly code<br>` +
    `Line 4: Convert the binary in the Assembly code '01010' -> X10 .....</td></tr>`;
    instructions.forEach((i,index) => { 
        let binary = i.Binary;
        let parts = i.Instruction.split(/[\s,\[\],;]+/);
        if(!parts[3]) parts[3] = "";
        let locBin = code.filter(c => c.OpCode === binary.substring(0, c.Width))[0];
        if(!locBin) return;

        let assembler = `<tr id='test-${index}' data-Binary='${i.Binary}' data-Instruction='${i.Instruction}'  data-Format='${locBin.Format}' data-index='${i.index}'>` +
                        `<td>   Format: ${locBin.Format}</td>`
        let line1 = `<tr><td class="op2Bin-currDecode">${i.Hex}</td>`;
        let line2 = `<tr><td class="bin2Op-currDecode">${i.Binary.substring(0,16)}<br>${i.Binary.substring(16,32)}</td>`;

        switch ( locBin.Format )  {
            case    "R" :
                assembler +=
                    `<td class="op">Op   <input data-answer='${parts[0]}' id='op${index}0' type='text' maxlength="11" ></td>` +
                    `<td class="rd">Rd   <input data-answer='${parts[1]}' id='op${index}1' type='text' maxlength="5"  ></td>` +
                    `<td class="rn">Rn   <input data-answer='${parts[2]}' id='op${index}2' type='text' maxlength="5"  ></td>` +
                    `<td class="rm">Rm   <input data-answer='${parts[3]}' id='op${index}3' type='text' maxlength="5"  ></td>`      +
                    `<td class="shamt">Sh<input data-answer='${parts[4]}' id='op${index}4' type='text' maxlength="6"  ></td></tr>`;
                line1 += 
                    `<td class="op">Op   <input id='bin${index}0'  class="medium"   type='text'  maxlength="11" data-answer='${binary.substring(0, locBin.Width)}'</td>` +
                    `<td class="rd">Rd   <input id='bin${index}4'                   type='text'  maxlength="5"  data-answer='${binary.substring(27, 32)}'        </td>` +
                    `<td class="rn">Rn   <input id='bin${index}3'                   type='text'  maxlength="5"  data-answer='${binary.substring(22, 27)}'        </td>` +
                    `<td class="rm">Rm   <input id='bin${index}1'                   type='text'  maxlength="5"  data-answer='${binary.substring(locBin.Width, locBin.Width+5)}'</td>` +
                    `<td class="shamt">Sh<input id='bin${index}2'                   type='text'  maxlength="6"  data-answer='${binary.substring(16, 22)}'        </td>` +
                    '</tr>';
                line2 += 
                    `<td class="op">Op    <input id='instr${index}0'  class="medium" type='text'  maxlength="11" data-answer='${binary.substring(0, locBin.Width)}'</td>` +
                    `<td class="rm">Rm    <input id='instr${index}1'                 type='text'  maxlength="5"  data-answer='${binary.substring(locBin.Width, locBin.Width+5)}'</td>` +
                    `<td class="shamt">Sh <input id='instr${index}2'                 type='text'  maxlength="6"  data-answer='${binary.substring(16, 22)}'        </td>` +
                    `<td class="rn">Rn    <input id='instr${index}3'                 type='text'  maxlength="5"  data-answer='${binary.substring(22, 27)}'        </td>` +
                    `<td class="rd">Rd    <input id='instr${index}4'                 type='text'  maxlength="5"  data-answer='${binary.substring(27, 32)}'        </td>` +
                    '</tr>';
                break;
            case    "I" :
                assembler +=
                    `<td class="op">op    <input data-answer='${parts[0]}' id='op${index}0' type='text' maxlength="10"></td>` +
                    `<td class="rd">rd    <input data-answer='${parts[1]}' id='op${index}1' type='text' maxlength="5" ></td>` +
                    `<td class="rn">rn    <input data-answer='${parts[2]}' id='op${index}2' type='text' maxlength="5" ></td>` +
                    `<td class="off">Imm  <input data-answer='${parts[3]}' id='op${index}3' type='text' maxlength="12"></td></tr>`;
                line1 +=
                    `<td class="op">op   <input id='bin${index}0'  class="medium" type='text' maxlength="10" data-answer='${binary.substring(0, locBin.Width)}'              ></td>` +
                    `<td class="rd">Rd   <input id='bin${index}3'                 type='text' maxlength="5"  data-answer='${binary.substring(27, 32)}'                       ></td>` +
                    `<td class="rn">rn   <input id='bin${index}2'                 type='text' maxlength="5"  data-answer='${binary.substring(22, 27)}'                       ></td>` +
                    `<td class="off">Imm <input id='bin${index}1'  class="big"    type='text' maxlength="12" data-answer='${binary.substring(locBin.Width, locBin.Width+12)}'></td>` +
                    '</tr>';
                line2 +=
                    `<td class="op">op   <input id='instr${index}0'  class="medium" type='text' maxlength="10"  data-answer='${binary.substring(0, locBin.Width)}'              ></td>` +
                    `<td class="off">Imm <input id='instr${index}1'  class="big"    type='text' maxlength="12"  data-answer='${binary.substring(locBin.Width, locBin.Width+12)}'></td>` +
                    `<td class="rn">rn   <input id='instr${index}2'                 type='text' maxlength="5"   data-answer='${binary.substring(22, 27)}'                       ></td>` +
                    `<td class="rd">rd   <input id='instr${index}3'                 type='text' maxlength="5"   data-answer='${binary.substring(27, 32)}'                       ></td>` +
                    '</tr>';
                break;
            case    "D" :
                assembler +=
                    `<td class="op">op   <input id='op${index}0'  type='text' maxlength="11" data-answer='${parts[0]}' ></td>` +
                    `<td class="rd">rd   <input id='op${index}1'  type='text' maxlength="5"  data-answer='${parts[1]}' ></td>` +
                    `<td class="rn">rn   <input id='op${index}2'  type='text' maxlength="5"  data-answer='${parts[2]}' ></td>` +
                    `<td class="off">off <input id='op${index}3'  type='text' maxlength="9"  data-answer='${parts[3]}' ></td>`      +
                    `<td class="op2">op2 <input id='op${index}4'  type='text' maxlength="2"  data-answer='${parts[4]}' ></td></tr>`;
                line1 +=
                    `<td class="op">op   <input id='bin${index}0' type='text' maxlength="11" data-answer='${binary.substring(0, locBin.Width)}'               class="medium"></td>` +
                    `<td class="rd">rd   <input id='bin${index}4' type='text' maxlength="5"  data-answer='${binary.substring(27, 32)}'                                      ></td>` +
                    `<td class="rn">rn   <input id='bin${index}3' type='text' maxlength="5"  data-answer='${binary.substring(22, 27)}'                                      ></td>` +
                    `<td class="off">off <input id='bin${index}1' type='text' maxlength="9"  data-answer='${binary.substring(locBin.Width, locBin.Width+9)}'  class="big"   ></td>` +
                    `<td class="op2">Op2 <input id='bin${index}2' type='text' maxlength="2"  data-answer='${binary.substring(20, 22)}'                                      ></td>` +
                    '</tr>';
                line2 +=
                    `<td class="op">op   <input id='instr${index}0' type='text' maxlength="11" data-answer='${binary.substring(0, locBin.Width)}'              class="medium"></td>` +
                    `<td class="off">off <input id='instr${index}1' type='text' maxlength="9"  data-answer='${binary.substring(locBin.Width, locBin.Width+9)}' class="big"   ></td>` +
                    `<td class="op2">Op2 <input id='instr${index}2' type='text' maxlength="2"  data-answer='${binary.substring(20, 22)}'                                     ></td>` +
                    `<td class="rn">rn   <input id='instr${index}3' type='text' maxlength="5"  data-answer='${binary.substring(22, 27)}'                                     ></td>` +
                    `<td class="rd">rd   <input id='instr${index}4' type='text' maxlength="5"  data-answer='${binary.substring(27, 32)}'                                     ></td>` +
                    '</tr>';
                break;
            case    "B" :
                assembler +=
                    `<td class="op">Op     <input data-answer='${parts[0]}' id='op${index}0' type='text' maxlength="6"  ></td>`;
                    `<td class="broff">Off <input data-answer='${parts[1]}' id='op${index}1' type='text' maxlength="26" ></td></tr>`;
                line1 +=
                    `<td class="op">Op     <input id='bin${index}0' class="medium"    type='text' maxlength="6" data-answer='${binary.substring(0, locBin.Width)}'></td>` +
                    `<td class="broff">Off <input id='bin${index}1' class="big"       type='text' maxlength="26" data-answer='${binary.substring(6, 32)}'          ></td>` +
                    '</tr>';
                line2 +=
                    `<td class="op">Op     <input id='instr${index}0' class="medium"    type='text' maxlength="6"  data-answer='${binary.substring(0, locBin.Width)}'></td>` +
                    `<td class="broff">Off <input id='instr${index}1' class="big"       type='text' maxlength="26"  data-answer='${binary.substring(6, 32)}'          ></td>` +
                    '</tr>';
                break;
            case    "IM" :
                assembler +=
                    `<td class="op">op    <input data-answer='${parts[0]}' id='op${index}0' type='text'  maxlength="9" ></td>` +
                    `<td class="rd">rd    <input data-answer='${parts[1]}' id='op${index}1' type='text'  maxlength="5" ></td>` +
                    `<td class="off">Imm  <input data-answer='${parts[2]}' id='op${index}2' type='text'  maxlength="18" ></td></tr>`;
                line1 +=
                    `<td class="op">Op   <input id='bin${index}0'  class="medium"   type='text' maxlength="9" data-answer='${binary.substring(0, locBin.Width)}' ></td>` +
                    `<td class="rd">Rd   <input id='bin${index}2'                   type='text' maxlength="5" data-answer='${binary.substring(27, 32)}'          ></td>` +
                    `<td class="off">Imm <input id='bin${index}1'  class="big"      type='text' maxlength="18" data-answer='${binary.substring(9, 27)}'           ></td>` +
                    '</tr>';
                line2 +=
                    `<td class="op">Op   <input id='instr${index}0'  class="medium" type='text'  maxlength="9" data-answer='${binary.substring(0, locBin.Width)}' ></td>` +
                    `<td class="off">Imm <input id='instr${index}1'  class="big"   type='text'  maxlength="18" data-answer='${binary.substring(9, 27)}'           ></td>` +
                    `<td class="rd">Rd   <input id='instr${index}2'                 type='text'  maxlength="5" data-answer='${binary.substring(27, 32)}'          ></td>` +
                    '</tr>';
                break;
            case    "CB" :
                assembler +=
                    `<td class="op">op     <input data-answer='${parts[0]}' id='op${index}0' type='text' maxlength="8"  ></td>`      +
                    `<td class="broff">off <input data-answer='${parts[1]}' id='op${index}1' type='text' maxlength="13" ></td>`      +
                    `<td class="op2">op2   <input data-answer='${parts[2]}' id='op${index}2' type='text' maxlength="5"  ></td></tr>`;
                line1 +=
                    `<td class="op">op     <input id='bin${index}0'  class="medium"   type='text' maxlength="8" data-answer='${binary.substring(0, locBin.Width)}'     ></td>` +
                    `<td class="broff">off <input id='bin${index}1'  class="big"      type='text' maxlength="13" data-answer='${binary.substring(locBin.Width, 27)}'    ></td>` +
                    `<td class="op2">op2   <input id='bin${index}2'                   type='text' maxlength="5" data-answer='${binary.substring(27, 32)}'              ></td>` +
                    '</tr>';
                line2 +=
                    `<td class="op">op     <input id='instr${index}0'  class="medium"   type='text' maxlength="8"  data-answer='${binary.substring(0, locBin.Width)}'     ></td>` +
                    `<td class="broff">off <input id='instr${index}1'  class="big"      type='text' maxlength="13"  data-answer='${binary.substring(locBin.Width, 27)}'    ></td>` +
                    `<td class="op2">op2   <input id='instr${index}2'                   type='text' maxlength="5"  data-answer='${binary.substring(27, 32)}'              ></td>` +
                    '</tr>';
                break;
        }
        test.innerHTML += 
        `${line2}${line1}${assembler}<tr><td class="blk" colspan="6"></td></tr>`;
    });
}

function listOpcodes() {
    let test = document.getElementById('test');
    if (oldContent.length == 0) {
        oldContent = test.innerHTML;
        test.innerHTML = getOpcodes()
         col_0.innerText = " Mnemonic";
         col_1.innerText = " Format";
         col_2.innerText = " Width";
         col_3.innerText = " Binary";
         col_4.innerText = "";
         col_5.innerText = "";
     }
    else {
        test.innerHTML = oldContent;
        col_0.innerText = "Hex Value";
        col_1.innerText = "Operation";
        col_2.innerText = "Operand 1";
        col_3.innerText = "Operand 2";
        col_4.innerText = "Operand 3";
        col_5.innerText = "Operand 4";
        oldContent = "";
    }
}

function getOpcodes() {
    let newContent = "";    
    code.forEach(i => { 
        newContent += `<tr>` +
        `<td><div>${i.Mnemonic}</div</td>` +
        `<td><div>${i.Format}</div</td>` +
        `<td><div>${i.Width}</div</td>`      +
        `<td><div>${i.OpCode}</div</td></tr>`;
    });
    return newContent;
}

function submit() {
    for (let r = 0; r <= 5; r++)
        for (let c = 0; c <= 6; c++) {
            close(`op${r}${c}`,     true,  0, false, 0 );
            close(`bin${r}${c}`,    true,  0, true,  0 );
            close(`instr${r}${c}`,  true,  0, true,  0 );
        }
}
