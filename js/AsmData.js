import {getRandomInt} from './utils.js';

export let code = [
    {Mnemonic:'ADD',Format:'R',Width:'11',Binary:'10001011000',Shamt:'',Start:'458',End:'',},
{Mnemonic:'ADDI',Format:'I',Width:'10',Binary:'1001000100',Shamt:'X',Start:'488',End:'489',},
{Mnemonic:'ADDIS',Format:'I',Width:'10',Binary:'1011000100',Shamt:'X',Start:'588',End:'589',},
{Mnemonic:'ADDS',Format:'R',Width:'11',Binary:'10101011000',Shamt:'',Start:'558',End:'',},
{Mnemonic:'AND',Format:'R',Width:'11',Binary:'10001010000',Shamt:'',Start:'45O',End:'',},
{Mnemonic:'ANDI',Format:'I',Width:'10',Binary:'1001001000',Shamt:'X',Start:'49O',End:'491',},
{Mnemonic:'ANDIS',Format:'I',Width:'10',Binary:'1111001000',Shamt:'X',Start:'79O',End:'791',},
{Mnemonic:'ANDS',Format:'R',Width:'11',Binary:'11101010000',Shamt:'',Start:'75O',End:'',},
{Mnemonic:'B',Format:'B',Width:'6',Binary:'000101',Shamt:'XXXX',Start:'OAO',End:'OBF',},
{Mnemonic:'B.Cond',Format:'CB',Width:'8',Binary:'01010100',Shamt:'XXX',Start:'2AO',End:'2A7',},
{Mnemonic:'BL',Format:'B',Width:'6',Binary:'100101',Shamt:'XXXX',Start:'4AO',End:'4BF',},
{Mnemonic:'BR',Format:'R',Width:'11',Binary:'11010110000',Shamt:'',Start:'6BO',End:'',},
{Mnemonic:'CBNZ',Format:'CB',Width:'8',Binary:'10110101',Shamt:'XXX',Start:'5A8',End:'5AF',},
{Mnemonic:'CBZ',Format:'CB',Width:'8',Binary:'10110100',Shamt:'XXX',Start:'SAO',End:'5A7',},
{Mnemonic:'EOR',Format:'R',Width:'11',Binary:'11001010000',Shamt:'',Start:'65O',End:'',},
{Mnemonic:'EORI',Format:'I',Width:'10',Binary:'1101001000',Shamt:'X',Start:'69O',End:'691',},
{Mnemonic:'FADDD',Format:'R',Width:'11',Binary:'00011110011',Shamt:'001010',Start:'OF3',End:'',},
{Mnemonic:'FADDS',Format:'R',Width:'11',Binary:'00011110001',Shamt:'001010',Start:'OF1',End:'',},
{Mnemonic:'FCMPD',Format:'R',Width:'11',Binary:'00011110011',Shamt:'001000',Start:'OF3',End:'',},
{Mnemonic:'FCMPS',Format:'R',Width:'11',Binary:'00011110001',Shamt:'001000',Start:'OF1',End:'',},
{Mnemonic:'FDIVD',Format:'R',Width:'11',Binary:'00011110011',Shamt:'000110',Start:'OF3',End:'',},
{Mnemonic:'FDIVS',Format:'R',Width:'11',Binary:'00011110001',Shamt:'000110',Start:'OF1',End:'',},
{Mnemonic:'FMULD',Format:'R',Width:'11',Binary:'00011110011',Shamt:'000010',Start:'OF3',End:'',},
{Mnemonic:'FMULS',Format:'R',Width:'11',Binary:'00011110001',Shamt:'000010',Start:'OF1',End:'',},
{Mnemonic:'FSUBD',Format:'R',Width:'11',Binary:'00011110011',Shamt:'001110',Start:'OF3',End:'',},
{Mnemonic:'FSUBS',Format:'R',Width:'11',Binary:'00011110001',Shamt:'001110',Start:'OF1',End:'',},
{Mnemonic:'LDUR',Format:'D',Width:'11',Binary:'11111000010',Shamt:'',Start:'7C2',End:'',},
{Mnemonic:'LDURB',Format:'D',Width:'11',Binary:'00111000010',Shamt:'',Start:'IC2',End:'',},
{Mnemonic:'LDURD',Format:'R',Width:'11',Binary:'11111100010',Shamt:'',Start:'7E2',End:'',},
{Mnemonic:'LDURH',Format:'D',Width:'11',Binary:'01111000010',Shamt:'',Start:'3C2',End:'',},
{Mnemonic:'LDURS',Format:'R',Width:'11',Binary:'10111100010',Shamt:'',Start:'5E2',End:'',},
{Mnemonic:'LDURSW',Format:'D',Width:'11',Binary:'10111000100',Shamt:'',Start:'5C4',End:'',},
{Mnemonic:'LDXR',Format:'D',Width:'11',Binary:'11001000010',Shamt:'',Start:'642',End:'',},
{Mnemonic:'LSL',Format:'R',Width:'11',Binary:'11010011011',Shamt:'',Start:'69B',End:'',},
{Mnemonic:'LSR',Format:'R',Width:'11',Binary:'11010011010',Shamt:'',Start:'69A',End:'',},
{Mnemonic:'MOVE',Format:'IM',Width:'9',Binary:'110100101',Shamt:'XX',Start:'694',End:'697',},
{Mnemonic:'MOVK',Format:'IM',Width:'9',Binary:'111100101',Shamt:'XX',Start:'794',End:'797',},
{Mnemonic:'MUL',Format:'R',Width:'11',Binary:'10011011000',Shamt:'011111',Start:'4D8',End:'',},
{Mnemonic:'ORR',Format:'R',Width:'11',Binary:'10101010000',Shamt:'',Start:'55O',End:'',},
{Mnemonic:'ORRI',Format:'I',Width:'10',Binary:'1011001000',Shamt:'X',Start:'59O',End:'591',},
{Mnemonic:'SDIV',Format:'R',Width:'11',Binary:'10011010110',Shamt:'000010',Start:'4D6',End:'',},
{Mnemonic:'SMULH',Format:'R',Width:'11',Binary:'10011011010',Shamt:'',Start:'4DA',End:'',},
{Mnemonic:'STUR',Format:'D',Width:'11',Binary:'11111000000',Shamt:'',Start:'7CO',End:'',},
{Mnemonic:'STURB',Format:'D',Width:'11',Binary:'00111000000',Shamt:'',Start:'ICO',End:'',},
{Mnemonic:'STURD',Format:'R',Width:'11',Binary:'11111100000',Shamt:'',Start:'7EO',End:'',},
{Mnemonic:'STURH',Format:'D',Width:'11',Binary:'01111000000',Shamt:'',Start:'3CO',End:'',},
{Mnemonic:'STURS',Format:'R',Width:'11',Binary:'10111100000',Shamt:'',Start:'5EO',End:'',},
{Mnemonic:'STURW',Format:'D',Width:'11',Binary:'10111000000',Shamt:'',Start:'5CO',End:'',},
{Mnemonic:'STXR',Format:'D',Width:'11',Binary:'11001000000',Shamt:'',Start:'64O',End:'',},
{Mnemonic:'SUB',Format:'R',Width:'11',Binary:'11001011000',Shamt:'',Start:'658',End:'',},
{Mnemonic:'SUBI',Format:'I',Width:'10',Binary:'1101000100',Shamt:'X',Start:'688',End:'689',},
{Mnemonic:'SUBIS',Format:'I',Width:'10',Binary:'1111000100',Shamt:'X',Start:'788',End:'789',},
{Mnemonic:'SUBS',Format:'R',Width:'11',Binary:'11101011000',Shamt:'',Start:'758',End:'',},
{Mnemonic:'UDIV',Format:'R',Width:'11',Binary:'10011010110',Shamt:'000011',Start:'4D6',End:'',},
{Mnemonic:'UMULH',Format:'R',Width:'11',Binary:'10011011110',Shamt:'',Start:'4DE',End:'',},
];

export function getInstructions(count) {
    let application = [];
    for (let i = 0; i < count; i++) {
        let rnd = getRandomInt(instructions.length);
        instructions[rnd].index = rnd
        application.push(instructions[rnd]);
    }
    return application;
}

export function getInstruction(index) {
    return instructions[index];
}

export let instructions = [
{Mnemonic:'MOVE',Hex:'0xD28003E4',Binary:'11O1OO1O1OOOOOOOOOOOOO11111OO1OO',Width:'9',Format:'IM',OpCode:'110100101',Breakdown:'OOOOOOOOOOOOO11111O 1OO',Instruction:'MOV X4, #31',},
{Mnemonic:'MOVE',Hex:'0xD28003E4',Binary:'11O1OO1O1OOOOOOOOOOOOO11111OO1OO',Width:'9',Format:'IM',OpCode:'110100101',Breakdown:'OOOOOOOOOOOOO11111O 1OO',Instruction:'MOV X4, #31',},
{Mnemonic:'ORR',Hex:'0xAA1F03EB',Binary:'1O1O1O1OOOO11111OOOOOO11111O1O11',Width:'11',Format:'R',OpCode:'10101010000',Breakdown:'11111 OOOOOO 11111 O1O11',Instruction:'ORR X11, X31, X31',},
{Mnemonic:'B.Cond',Hex:'0x5400012B',Binary:'O1O1O1OOOOOOOOOOOOOOOOO1OO1O1O11',Width:'8',Format:'CB',OpCode:'01010100',Breakdown:'OOOOOOOOOOOOOOO1OO1 O1O11',Instruction:'B.Cond B.LT     DONE',},
{Mnemonic:'B.Cond',Hex:'0x5400010D',Binary:'O1O1O1OOOOOOOOOOOOOOOOO1OOOO11O1',Width:'8',Format:'CB',OpCode:'01010100',Breakdown:'OOOOOOOOOOOOOOO1OOO O11O1',Instruction:'B.Cond B.LE     DONE',},
{Mnemonic:'B.Cond',Hex:'0x540000EA',Binary:'O1O1O1OOOOOOOOOOOOOOOOOO111O1O1O',Width:'8',Format:'CB',OpCode:'01010100',Breakdown:'OOOOOOOOOOOOOOOO111 O1O1O',Instruction:'B.Cond B.GE     DONE',},
{Mnemonic:'B.Cond',Hex:'0x540000CC',Binary:'O1O1O1OOOOOOOOOOOOOOOOOO11OO11OO',Width:'8',Format:'CB',OpCode:'01010100',Breakdown:'OOOOOOOOOOOOOOOO11O O11OO',Instruction:'B.Cond B.GT     DONE',},
{Mnemonic:'B.Cond',Hex:'0x540000A0',Binary:'O1O1O1OOOOOOOOOOOOOOOOOO1O1OOOOO',Width:'8',Format:'CB',OpCode:'01010100',Breakdown:'OOOOOOOOOOOOOOOO1O1 OOOOO',Instruction:'B.Cond B.EQ     DONE',},
{Mnemonic:'B.Cond',Hex:'0x54000081',Binary:'O1O1O1OOOOOOOOOOOOOOOOOO1OOOOOO1',Width:'8',Format:'CB',OpCode:'01010100',Breakdown:'OOOOOOOOOOOOOOOO1OO OOOO1',Instruction:'B.Cond B.NE     DONE',},
{Mnemonic:'SUB',Hex:'0xCB000000',Binary:'11OO1O11OOOOOOOOOOOOOOOOOOOOOOOO',Width:'11',Format:'R',OpCode:'11001011000',Breakdown:'OOOOO OOOOOO OOOOO OOOOO',Instruction:'SUB      x0,x0,x0',},
{Mnemonic:'ADDI',Hex:'0x91002801',Binary:'1OO1OOO1OOOOOOOOOO1O1OOOOOOOOOO1',Width:'10',Format:'I',OpCode:'1001000100',Breakdown:'OOOOOOOO1O1O OOOOO OOOO1',Instruction:'ADDI      x1,x0,#0xa',},
{Mnemonic:'SUBIS',Hex:'0xF1000021',Binary:'1111OOO1OOOOOOOOOOOOOOOOOO1OOOO1',Width:'10',Format:'I',OpCode:'1111000100',Breakdown:'OOOOOOOOOOOO OOOO1 OOOO1',Instruction:'SUBIS     x1,x1,#0',},
{Mnemonic:'B.Cond',Hex:'0x5400008D',Binary:'O1O1O1OOOOOOOOOOOOOOOOOO1OOO11O1',Width:'8',Format:'CB',OpCode:'01010100',Breakdown:'OOOOOOOOOOOOOOOO1OO O11O1',Instruction:'B.Cond     DONE ; 0x80001234. B.LE',},
{Mnemonic:'SUBI',Hex:'0xD1000421',Binary:'11O1OOO1OOOOOOOOOOOOO1OOOO1OOOO1',Width:'10',Format:'I',OpCode:'1101000100',Breakdown:'OOOOOOOOOOO1 OOOO1 OOOO1',Instruction:'SUBI      x1,x1,#1',},
{Mnemonic:'ADDI',Hex:'0x91000800',Binary:'1OO1OOO1OOOOOOOOOOOO1OOOOOOOOOOO',Width:'10',Format:'I',OpCode:'1001000100',Breakdown:'OOOOOOOOOO1O OOOOO OOOOO',Instruction:'ADDI      x0,x0,#2',},
{Mnemonic:'B',Hex:'0x17FFFFFC',Binary:'OOO1O1111111111111111111111111OO',Width:'6',Format:'B',OpCode:'000101',Breakdown:'111111111111111111111111OO',Instruction:'B        LOOP ; 0x80001220',},
{Mnemonic:'ADDI',Hex:'0x9104C042',Binary:'1OO1OOO1OOOOO1OO11OOOOOOO1OOOO1O',Width:'10',Format:'I',OpCode:'1001000100',Breakdown:'OOO1OO11OOOO OOO1O OOO1O',Instruction:'ADDI      x2,x2,#0x130',},
{Mnemonic:'LDURS',Hex:'0xBC400042',Binary:'1O1111OOO1OOOOOOOOOOOOOOO1OOOO1O',Width:'11',Format:'R',OpCode:'10111100010',Breakdown:'OOOOO OOOOOO OOO1O OOO1O',Instruction:'LDURS     s2,[x2,#0]',},
{Mnemonic:'ADDI',Hex:'0x9104E063',Binary:'1OO1OOO1OOOOO1OO111OOOOOO11OOO11',Width:'10',Format:'I',OpCode:'1001000100',Breakdown:'OOO1OO111OOO OOO11 OOO11',Instruction:'ADDI      x3,x3,#0x138',},
{Mnemonic:'BL',Hex:'0x9400000E',Binary:'1OO1O1OOOOOOOOOOOOOOOOOOOOOO111O',Width:'6',Format:'B',OpCode:'100101',Breakdown:'OOOOOOOOOOOOOOOOOOOOOO111O',Instruction:'BL       dilation ; 0x80001280',},
{Mnemonic:'MOVE',Hex:'0xD2800203',Binary:'11O1OO1O1OOOOOOOOOOOOO1OOOOOOO11',Width:'9',Format:'IM',OpCode:'110100101',Breakdown:'OOOOOOOOOOOOO1OOOOO O11',Instruction:'MOVE      x3,#0x10',},
{Mnemonic:'MOVE',Hex:'0xD2800022',Binary:'11O1OO1O1OOOOOOOOOOOOOOOOO1OOO1O',Width:'9',Format:'IM',OpCode:'110100101',Breakdown:'OOOOOOOOOOOOOOOOO1O O1O',Instruction:'MOVE      x2,#1',},
{Mnemonic:'ADD',Hex:'0x8B031044',Binary:'1OOO1O11OOOOOO11OOO1OOOOO1OOO1OO',Width:'11',Format:'R',OpCode:'10001011000',Breakdown:'OOO11 OOO1OO OOO1O OO1OO',Instruction:'ADD      x4,x2,x3,LSL #4',},
{Mnemonic:'SUBI',Hex:'0xD10043FF',Binary:'11O1OOO1OOOOOOOOO1OOOO1111111111',Width:'10',Format:'I',OpCode:'1101000100',Breakdown:'OOOOOOO1OOOO 11111 11111',Instruction:'SUBI      sp,sp,#0x10',},
{Mnemonic:'STUR',Hex:'0xF80003E3',Binary:'11111OOOOOOOOOOOOOOOOO11111OOO11',Width:'11',Format:'D',OpCode:'11111000000',Breakdown:'OOOOOOOOO OO 11111 OOO11',Instruction:'STUR     x3,[sp,#0]',},
{Mnemonic:'SUBI',Hex:'0xD10043FF',Binary:'11O1OOO1OOOOOOOOO1OOOO1111111111',Width:'10',Format:'I',OpCode:'1101000100',Breakdown:'OOOOOOO1OOOO 11111 11111',Instruction:'SUBI      sp,sp,#0x10',},
{Mnemonic:'STUR',Hex:'0xF80003E2',Binary:'11111OOOOOOOOOOOOOOOOO11111OOO1O',Width:'11',Format:'D',OpCode:'11111000000',Breakdown:'OOOOOOOOO OO 11111 OOO1O',Instruction:'STUR     x2,[sp,#0]',},
{Mnemonic:'LDUR',Hex:'0xF84003E1',Binary:'11111OOOO1OOOOOOOOOOOO11111OOOO1',Width:'11',Format:'D',OpCode:'11111000010',Breakdown:'OOOOOOOOO OO 11111 OOOO1',Instruction:'LDUR     x1,[sp,#0]',},
{Mnemonic:'ADDI',Hex:'0x910043FF',Binary:'1OO1OOO1OOOOOOOOO1OOOO1111111111',Width:'10',Format:'I',OpCode:'1001000100',Breakdown:'OOOOOOO1OOOO 11111 11111',Instruction:'ADDI      sp,sp,#0x10',},
{Mnemonic:'LDUR',Hex:'0xF84003E1',Binary:'11111OOOO1OOOOOOOOOOOO11111OOOO1',Width:'11',Format:'D',OpCode:'11111000010',Breakdown:'OOOOOOOOO OO 11111 OOOO1',Instruction:'LDUR     x1,[sp,#0]',},
{Mnemonic:'ADDI',Hex:'0x910043FF',Binary:'1OO1OOO1OOOOOOOOO1OOOO1111111111',Width:'10',Format:'I',OpCode:'1001000100',Breakdown:'OOOOOOO1OOOO 11111 11111',Instruction:'ADDI      sp,sp,#0x10',},
{Mnemonic:'BR',Hex:'0xD65F03C0',Binary:'11O1O11OO1O11111OOOOOO1111OOOOOO',Width:'11',Format:'R',OpCode:'11010110000',Breakdown:'11111 OOOOOO 1111O OOOOO',Instruction:'BR   a.k.a. RET',},
{Mnemonic:'SUBI',Hex:'0xD100C3FF',Binary:'11O1OOO1OOOOOOOO11OOOO1111111111',Width:'10',Format:'I',OpCode:'1101000100',Breakdown:'OOOOOO11OOOO 11111 11111',Instruction:'SUBI      sp,sp,#0x30',},
{Mnemonic:'STUR',Hex:'0xF80003E1',Binary:'11111OOOOOOOOOOOOOOOOO11111OOOO1',Width:'11',Format:'D',OpCode:'11111000000',Breakdown:'OOOOOOOOO OO 11111 OOOO1',Instruction:'STUR     x1,[sp,#0]',},
{Mnemonic:'STURS',Hex:'0xBC0103E1',Binary:'1O1111OOOOOOOOO1OOOOOO11111OOOO1',Width:'11',Format:'R',OpCode:'10111100000',Breakdown:'OOOO1 OOOOOO 11111 OOOO1',Instruction:'STURS     s1,[sp,#0x10]',},
{Mnemonic:'STURS',Hex:'0xBC0203E3',Binary:'1O1111OOOOOOOO1OOOOOOO11111OOO11',Width:'11',Format:'R',OpCode:'10111100000',Breakdown:'OOO1O OOOOOO 11111 OOO11',Instruction:'STURS     s3,[sp,#0x20]',},
{Mnemonic:'ADDI',Hex:'0x9104D021',Binary:'1OO1OOO1OOOOO1OO11O1OOOOOO1OOOO1',Width:'10',Format:'I',OpCode:'1001000100',Breakdown:'OOO1OO11O1OO OOOO1 OOOO1',Instruction:'ADDI      x1,x1,#0x134',},
{Mnemonic:'LDURS',Hex:'0xBC400021',Binary:'1O1111OOO1OOOOOOOOOOOOOOOO1OOOO1',Width:'11',Format:'R',OpCode:'10111100010',Breakdown:'OOOOO OOOOOO OOOO1 OOOO1',Instruction:'LDURS     s1,[x1,#0]',},
{Mnemonic:'FDIVS',Hex:'0x1E211843',Binary:'OOO1111OOO1OOOO1OOO11OOOO1OOOO11',Width:'11',Format:'R',OpCode:'00011110001',Breakdown:'OOOO1 OOO11O OOO1O OOO11',Instruction:'FDIVS     s3,s2,s1',},
{Mnemonic:'FMULS',Hex:'0x1E230863',Binary:'OOO1111OOO1OOO11OOOO1OOOO11OOO11',Width:'11',Format:'R',OpCode:'00011110001',Breakdown:'OOO11 OOOO1O OOO11 OOO11',Instruction:'FMULS     s3,s3,s3',},
{Mnemonic:'FSUBS',Hex:'0x1E233823',Binary:'OOO1111OOO1OOO11OO111OOOOO1OOO11',Width:'11',Format:'R',OpCode:'00011110001',Breakdown:'OOO11 OO111O OOOO1 OOO11',Instruction:'FSUBS     s3,s1,s3',},
{Mnemonic:'FDIVS',Hex:'0x1E231823',Binary:'OOO1111OOO1OOO11OOO11OOOOO1OOO11',Width:'11',Format:'R',OpCode:'00011110001',Breakdown:'OOO11 OOO11O OOOO1 OOO11',Instruction:'FDIVS     s3,s1,s3',},
{Mnemonic:'STURS',Hex:'0xBC000063',Binary:'1O1111OOOOOOOOOOOOOOOOOOO11OOO11',Width:'11',Format:'R',OpCode:'10111100000',Breakdown:'OOOOO OOOOOO OOO11 OOO11',Instruction:'STURS     s3,[x3,#0]',},
{Mnemonic:'LDURS',Hex:'0xBC4203E3',Binary:'1O1111OOO1OOOO1OOOOOOO11111OOO11',Width:'11',Format:'R',OpCode:'10111100010',Breakdown:'OOO1O OOOOOO 11111 OOO11',Instruction:'LDURS     s3,[sp,#0x20]',},
{Mnemonic:'LDURS',Hex:'0xBC4103E1',Binary:'1O1111OOO1OOOOO1OOOOOO11111OOOO1',Width:'11',Format:'R',OpCode:'10111100010',Breakdown:'OOOO1 OOOOOO 11111 OOOO1',Instruction:'LDURS     s1,[sp,#0x10]',},
{Mnemonic:'LDUR',Hex:'0xF84003E1',Binary:'11111OOOO1OOOOOOOOOOOO11111OOOO1',Width:'11',Format:'D',OpCode:'11111000010',Breakdown:'OOOOOOOOO OO 11111 OOOO1',Instruction:'LDUR     x1,[sp,#0]',},
{Mnemonic:'ADDI',Hex:'0x9100C3FF',Binary:'1OO1OOO1OOOOOOOO11OOOO1111111111',Width:'10',Format:'I',OpCode:'1001000100',Breakdown:'OOOOOO11OOOO 11111 11111',Instruction:'ADDI      sp,sp,#0x33',},
{Mnemonic:'BR',Hex:'0xD61F03C0',Binary:'11O1O11OOOO11111OOOOOO1111OOOOOO',Width:'11',Format:'R',OpCode:'11010110000',Breakdown:'11111 OOOOOO 1111O OOOOO',Instruction:'BR       x30',},
{Mnemonic:'SUB',Hex:'0xCB0D02AE',Binary:'11OO1O11OOOO11O1OOOOOO1O1O1O111O',Width:'11',Format:'R',OpCode:'11001011000',Breakdown:'O11O1 OOOOOO 1O1O1 O111O',Instruction:'SUB      x14,x21,x13',},
{Mnemonic:'AND',Hex:'0X8A0D012B',Binary:'1OOO1O1OOOOO11O1OOOOOOO1OO1O1O11',Width:'11',Format:'R',OpCode:'10001010000',Breakdown:'O11O1 OOOOOO O1OO1 O1O11',Instruction:'',},
]