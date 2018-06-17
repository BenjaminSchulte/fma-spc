import InstructionType from './InstructionType';
import Instruction from './Instruction';
import {MacroObject, ArgumentList, BooleanObject, InternalValue} from 'fma';

class InstructionCollection {
  constructor() {
    this.instructions = {}
  }

  add(name, opcode, type, callback=null) {
    name = name.toUpperCase();

    if (!this.instructions.hasOwnProperty(name)) {
      this.instructions[name] = new Instruction(name);
    }

    this.instructions[name].add(type, opcode, callback);
  }

  compile(project, interpreter) {
    const root = interpreter.getRoot();

    for (let name in this.instructions) {
      root.setMember(name, this.instructions[name].build());
    }
  }
};

export default class InstructionCompiler {
  implementTo(project, interpreter) {
    const collection = new InstructionCollection();collection.add("NOP", 0x00, InstructionType.get());
    collection.add("TCALL0", 0x01, InstructionType.get());
    collection.add("SET0", 0x02, InstructionType.get("d", "r"));
    collection.add("BBS0", 0x03, InstructionType.getRev("d", "r"));
    collection.add("OR", 0x04, InstructionType.get("A", "d"));
    collection.add("OR", 0x05, InstructionType.get("A", "!a"));
    collection.add("OR", 0x06, InstructionType.get("A", "(X)"));
    collection.add("OR", 0x07, InstructionType.get("A", "[d+X]"));
    collection.add("OR", 0x08, InstructionType.get("A", "#i"));
    collection.add("OR", 0x09, InstructionType.get("d", "d"));
    // Unknown type: OR1 C, m.b -> 0A
    collection.add("ASL", 0x0B, InstructionType.get("d"));
    collection.add("ASL", 0x0C, InstructionType.get("!a"));
    collection.add("PUSH", 0x0D, InstructionType.get("PSW"));
    collection.add("TSET1", 0x0E, InstructionType.get("!a"));
    collection.add("BRK", 0x0F, InstructionType.get());
    collection.add("BPL", 0x10, InstructionType.get("r"));
    collection.add("TCALL1", 0x11, InstructionType.get());
    collection.add("CLR0", 0x12, InstructionType.get("d", "r"));
    collection.add("BBC0", 0x13, InstructionType.getRev("d", "r"));
    collection.add("OR", 0x14, InstructionType.get("A", "d+X"));
    collection.add("OR", 0x15, InstructionType.get("A", "!a+X"));
    collection.add("OR", 0x16, InstructionType.get("A", "!a+Y"));
    collection.add("OR", 0x17, InstructionType.get("A", "[d]+Y"));
    collection.add("OR", 0x18, InstructionType.get("d", "#i"));
    collection.add("OR", 0x19, InstructionType.get("(X)", "(Y)"));
    collection.add("DECW", 0x1A, InstructionType.get("d"));
    collection.add("ASL", 0x1B, InstructionType.get("d+X"));
    collection.add("ASL", 0x1C, InstructionType.get("A"));
    collection.add("DEC", 0x1D, InstructionType.get("X"));
    collection.add("CMP", 0x1E, InstructionType.get("X", "!a"));
    collection.add("JMP", 0x1F, InstructionType.get("[!a+X]"));
    collection.add("CLRP", 0x20, InstructionType.get());
    collection.add("TCALL2", 0x21, InstructionType.get());
    collection.add("SET1", 0x22, InstructionType.get("d", "r"));
    collection.add("BBS1", 0x23, InstructionType.getRev("d", "r"));
    collection.add("AND", 0x24, InstructionType.get("A", "d"));
    collection.add("AND", 0x25, InstructionType.get("A", "!a"));
    collection.add("AND", 0x26, InstructionType.get("A", "(X)"));
    collection.add("AND", 0x27, InstructionType.get("A", "[d+X]"));
    collection.add("AND", 0x28, InstructionType.get("A", "#i"));
    collection.add("AND", 0x29, InstructionType.get("d", "d"));
    // Unknown type: OR1 C, /m.b -> 2A
    collection.add("ROL", 0x2B, InstructionType.get("d"));
    collection.add("ROL", 0x2C, InstructionType.get("!a"));
    collection.add("PUSH", 0x2D, InstructionType.get("A"));
    collection.add("CBNE", 0x2E, InstructionType.getRev("d", "r"));
    collection.add("BRA", 0x2F, InstructionType.get("r"));
    collection.add("BMI", 0x30, InstructionType.get("r"));
    collection.add("TCALL3", 0x31, InstructionType.get());
    collection.add("CLR1", 0x32, InstructionType.get("d", "r"));
    collection.add("BBC1", 0x33, InstructionType.getRev("d", "r"));
    collection.add("AND", 0x34, InstructionType.get("A", "d+X"));
    collection.add("AND", 0x35, InstructionType.get("A", "!a+X"));
    collection.add("AND", 0x36, InstructionType.get("A", "!a+Y"));
    collection.add("AND", 0x37, InstructionType.get("A", "[d]+Y"));
    collection.add("AND", 0x38, InstructionType.get("d", "#i"));
    collection.add("AND", 0x39, InstructionType.get("(X)", "(Y)"));
    collection.add("INCW", 0x3A, InstructionType.get("d"));
    collection.add("ROL", 0x3B, InstructionType.get("d+X"));
    collection.add("ROL", 0x3C, InstructionType.get("A"));
    collection.add("INC", 0x3D, InstructionType.get("X"));
    collection.add("CMP", 0x3E, InstructionType.get("X", "d"));
    collection.add("CALL", 0x3F, InstructionType.get("!a"));
    collection.add("SETP", 0x40, InstructionType.get());
    collection.add("TCALL4", 0x41, InstructionType.get());
    collection.add("SET2", 0x42, InstructionType.get("d", "r"));
    collection.add("BBS2", 0x43, InstructionType.getRev("d", "r"));
    collection.add("EOR", 0x44, InstructionType.get("A", "d"));
    collection.add("EOR", 0x45, InstructionType.get("A", "!a"));
    collection.add("EOR", 0x46, InstructionType.get("A", "(X)"));
    collection.add("EOR", 0x47, InstructionType.get("A", "[d+X]"));
    collection.add("EOR", 0x48, InstructionType.get("A", "#i"));
    collection.add("EOR", 0x49, InstructionType.get("d", "d"));
    // Unknown type: AND1 C, m.b -> 4A
    collection.add("LSR", 0x4B, InstructionType.get("d"));
    collection.add("LSR", 0x4C, InstructionType.get("!a"));
    collection.add("PUSH", 0x4D, InstructionType.get("X"));
    collection.add("TCLR1", 0x4E, InstructionType.get("!a"));
    // Unknown type: PCALL u -> 4F
    collection.add("BVC", 0x50, InstructionType.get("r"));
    collection.add("TCALL5", 0x51, InstructionType.get());
    collection.add("CLR2", 0x52, InstructionType.get("d", "r"));
    collection.add("BBC2", 0x53, InstructionType.getRev("d", "r"));
    collection.add("EOR", 0x54, InstructionType.get("A", "d+X"));
    collection.add("EOR", 0x55, InstructionType.get("A", "!a+X"));
    collection.add("EOR", 0x56, InstructionType.get("A", "!a+Y"));
    collection.add("EOR", 0x57, InstructionType.get("A", "[d]+Y"));
    collection.add("EOR", 0x58, InstructionType.get("d", "#i"));
    collection.add("EOR", 0x59, InstructionType.get("(X)", "(Y)"));
    collection.add("CMPW", 0x5A, InstructionType.get("YA", "d"));
    collection.add("LSR", 0x5B, InstructionType.get("d+X"));
    collection.add("LSR", 0x5C, InstructionType.get("A"));
    collection.add("MOV", 0x5D, InstructionType.get("X", "A"));
    collection.add("CMP", 0x5E, InstructionType.get("Y", "!a"));
    collection.add("JMP", 0x5F, InstructionType.get("!a"));
    collection.add("CLRC", 0x60, InstructionType.get());
    collection.add("TCALL6", 0x61, InstructionType.get());
    collection.add("SET3", 0x62, InstructionType.get("d", "r"));
    collection.add("BBS3", 0x63, InstructionType.getRev("d", "r"));
    collection.add("CMP", 0x64, InstructionType.get("A", "d"));
    collection.add("CMP", 0x65, InstructionType.get("A", "!a"));
    collection.add("CMP", 0x66, InstructionType.get("A", "(X)"));
    collection.add("CMP", 0x67, InstructionType.get("A", "[d+X]"));
    collection.add("CMP", 0x68, InstructionType.get("A", "#i"));
    collection.add("CMP", 0x69, InstructionType.get("d", "d"));
    // Unknown type: AND1 C, /m.b -> 6A
    collection.add("ROR", 0x6B, InstructionType.get("d"));
    collection.add("ROR", 0x6C, InstructionType.get("!a"));
    collection.add("PUSH", 0x6D, InstructionType.get("Y"));
    collection.add("DBNZ", 0x6E, InstructionType.get("d", "r"));
    collection.add("RET", 0x6F, InstructionType.get());
    collection.add("BVS", 0x70, InstructionType.get("r"));
    collection.add("TCALL7", 0x71, InstructionType.get());
    collection.add("CLR3", 0x72, InstructionType.get("d", "r"));
    collection.add("BBC3", 0x73, InstructionType.getRev("d", "r"));
    collection.add("CMP", 0x74, InstructionType.get("A", "d+X"));
    collection.add("CMP", 0x75, InstructionType.get("A", "!a+X"));
    collection.add("CMP", 0x76, InstructionType.get("A", "!a+Y"));
    collection.add("CMP", 0x77, InstructionType.get("A", "[d]+Y"));
    collection.add("CMP", 0x78, InstructionType.get("d", "#i"));
    collection.add("CMP", 0x79, InstructionType.get("(X)", "(Y)"));
    collection.add("ADDW", 0x7A, InstructionType.get("YA", "d"));
    collection.add("ROR", 0x7B, InstructionType.get("d+X"));
    collection.add("ROR", 0x7C, InstructionType.get("A"));
    collection.add("MOV", 0x7D, InstructionType.get("A", "X"));
    collection.add("CMP", 0x7E, InstructionType.get("Y", "d"));
    collection.add("RETI", 0x7F, InstructionType.get());
    collection.add("SETC", 0x80, InstructionType.get());
    collection.add("TCALL8", 0x81, InstructionType.get());
    collection.add("SET4", 0x82, InstructionType.get("d", "r"));
    collection.add("BBS4", 0x83, InstructionType.getRev("d", "r"));
    collection.add("ADC", 0x84, InstructionType.get("A", "d"));
    collection.add("ADC", 0x85, InstructionType.get("A", "!a"));
    collection.add("ADC", 0x86, InstructionType.get("A", "(X)"));
    collection.add("ADC", 0x87, InstructionType.get("A", "[d+X]"));
    collection.add("ADC", 0x88, InstructionType.get("A", "#i"));
    collection.add("ADC", 0x89, InstructionType.get("d", "d"));
    // Unknown type: EOR1 C, m.b -> 8A
    collection.add("DEC", 0x8B, InstructionType.get("d"));
    collection.add("DEC", 0x8C, InstructionType.get("!a"));
    collection.add("MOV", 0x8D, InstructionType.get("Y", "#i"));
    collection.add("POP", 0x8E, InstructionType.get("PSW"));
    collection.add("MOV", 0x8F, InstructionType.get("d", "#i"));
    collection.add("BCC", 0x90, InstructionType.get("r"));
    collection.add("TCALL9", 0x91, InstructionType.get());
    collection.add("CLR4", 0x92, InstructionType.get("d", "r"));
    collection.add("BBC4", 0x93, InstructionType.getRev("d", "r"));
    collection.add("ADC", 0x94, InstructionType.get("A", "d+X"));
    collection.add("ADC", 0x95, InstructionType.get("A", "!a+X"));
    collection.add("ADC", 0x96, InstructionType.get("A", "!a+Y"));
    collection.add("ADC", 0x97, InstructionType.get("A", "[d]+Y"));
    collection.add("ADC", 0x98, InstructionType.get("d", "#i"));
    collection.add("ADC", 0x99, InstructionType.get("(X)", "(Y)"));
    collection.add("SUBW", 0x9A, InstructionType.get("YA", "d"));
    collection.add("DEC", 0x9B, InstructionType.get("d+X"));
    collection.add("DEC", 0x9C, InstructionType.get("A"));
    collection.add("MOV", 0x9D, InstructionType.get("X", "SP"));
    collection.add("DIV", 0x9E, InstructionType.get("YA", "X"));
    collection.add("XCN", 0x9F, InstructionType.get("A"));
    collection.add("EI", 0xA0, InstructionType.get());
    collection.add("TCALL10", 0xA1, InstructionType.get());
    collection.add("SET5", 0xA2, InstructionType.get("d", "r"));
    collection.add("BBS5", 0xA3, InstructionType.getRev("d", "r"));
    collection.add("SBC", 0xA4, InstructionType.get("A", "d"));
    collection.add("SBC", 0xA5, InstructionType.get("A", "!a"));
    collection.add("SBC", 0xA6, InstructionType.get("A", "(X)"));
    collection.add("SBC", 0xA7, InstructionType.get("A", "[d+X]"));
    collection.add("SBC", 0xA8, InstructionType.get("A", "#i"));
    collection.add("SBC", 0xA9, InstructionType.get("d", "d"));
    // Unknown type: MOV1 C, m.b -> AA
    collection.add("INC", 0xAB, InstructionType.get("d"));
    collection.add("INC", 0xAC, InstructionType.get("!a"));
    collection.add("CMP", 0xAD, InstructionType.get("Y", "#i"));
    collection.add("POP", 0xAE, InstructionType.get("A"));
    collection.add("MOVI", 0xAF, InstructionType.get("(X)", "A"));
    collection.add("BCS", 0xB0, InstructionType.get("r"));
    collection.add("TCALL11", 0xB1, InstructionType.get());
    collection.add("CLR5", 0xB2, InstructionType.get("d", "r"));
    collection.add("BBC5", 0xB3, InstructionType.getRev("d", "r"));
    collection.add("SBC", 0xB4, InstructionType.get("A", "d+X"));
    collection.add("SBC", 0xB5, InstructionType.get("A", "!a+X"));
    collection.add("SBC", 0xB6, InstructionType.get("A", "!a+Y"));
    collection.add("SBC", 0xB7, InstructionType.get("A", "[d]+Y"));
    collection.add("SBC", 0xB8, InstructionType.get("d", "#i"));
    collection.add("SBC", 0xB9, InstructionType.get("(X)", "(Y)"));
    collection.add("MOVW", 0xBA, InstructionType.get("YA", "d"));
    collection.add("INC", 0xBB, InstructionType.get("d+X"));
    collection.add("INC", 0xBC, InstructionType.get("A"));
    collection.add("MOV", 0xBD, InstructionType.get("SP", "X"));
    collection.add("DAS", 0xBE, InstructionType.get("A"));
    collection.add("MOVI", 0xBF, InstructionType.get("A", "(X)"));
    collection.add("DI", 0xC0, InstructionType.get());
    collection.add("TCALL12", 0xC1, InstructionType.get());
    collection.add("SET6", 0xC2, InstructionType.get("d", "r"));
    collection.add("BBS6", 0xC3, InstructionType.getRev("d", "r"));
    collection.add("MOV", 0xC4, InstructionType.get("d", "A"));
    collection.add("MOV", 0xC5, InstructionType.get("!a", "A"));
    collection.add("MOV", 0xC6, InstructionType.get("(X)", "A"));
    collection.add("MOV", 0xC7, InstructionType.get("[d+X]", "A"));
    collection.add("CMP", 0xC8, InstructionType.get("X", "#i"));
    collection.add("MOV", 0xC9, InstructionType.get("!a", "X"));
    // Unknown type: MOV1 m.b, C -> CA
    collection.add("MOV", 0xCB, InstructionType.get("d", "Y"));
    collection.add("MOV", 0xCC, InstructionType.get("!a", "Y"));
    collection.add("MOV", 0xCD, InstructionType.get("X", "#i"));
    collection.add("POP", 0xCE, InstructionType.get("X"));
    collection.add("MUL", 0xCF, InstructionType.get("YA"));
    collection.add("BNE", 0xD0, InstructionType.get("r"));
    collection.add("TCALL13", 0xD1, InstructionType.get());
    collection.add("CLR6", 0xD2, InstructionType.get("d", "r"));
    collection.add("BBC6", 0xD3, InstructionType.getRev("d", "r"));
    collection.add("MOV", 0xD4, InstructionType.get("d+X", "A"));
    collection.add("MOV", 0xD5, InstructionType.get("!a+X", "A"));
    collection.add("MOV", 0xD6, InstructionType.get("!a+Y", "A"));
    collection.add("MOV", 0xD7, InstructionType.get("[d]+Y", "A"));
    collection.add("MOV", 0xD8, InstructionType.get("d", "X"));
    collection.add("MOV", 0xD9, InstructionType.get("d+Y", "X"));
    collection.add("MOVW", 0xDA, InstructionType.get("d", "YA"));
    collection.add("MOV", 0xDB, InstructionType.get("d+X", "Y"));
    collection.add("DEC", 0xDC, InstructionType.get("Y"));
    collection.add("MOV", 0xDD, InstructionType.get("Y", "A"));
    collection.add("CBNE", 0xDE, InstructionType.getRev("d+X", "r"));
    collection.add("DAA", 0xDF, InstructionType.get("A"));
    collection.add("CLRV", 0xE0, InstructionType.get());
    collection.add("TCALL14", 0xE1, InstructionType.get());
    collection.add("SET7", 0xE2, InstructionType.get("d", "r"));
    collection.add("BBS7", 0xE3, InstructionType.getRev("d", "r"));
    collection.add("MOV", 0xE4, InstructionType.get("A", "d"));
    collection.add("MOV", 0xE5, InstructionType.get("A", "!a"));
    collection.add("MOV", 0xE6, InstructionType.get("A", "(X)"));
    collection.add("MOV", 0xE7, InstructionType.get("A", "[d+X]"));
    collection.add("MOV", 0xE8, InstructionType.get("A", "#i"));
    collection.add("MOV", 0xE9, InstructionType.get("X", "!a"));
    // Unknown type: NOT1 m.b -> EA
    collection.add("MOV", 0xEB, InstructionType.get("Y", "d"));
    collection.add("MOV", 0xEC, InstructionType.get("Y", "!a"));
    collection.add("NOTC", 0xED, InstructionType.get());
    collection.add("POP", 0xEE, InstructionType.get("Y"));
    collection.add("SLEEP", 0xEF, InstructionType.get());
    collection.add("BEQ", 0xF0, InstructionType.get("r"));
    collection.add("TCALL15", 0xF1, InstructionType.get());
    collection.add("CLR7", 0xF2, InstructionType.get("d", "r"));
    collection.add("BBC7", 0xF3, InstructionType.getRev("d", "r"));
    collection.add("MOV", 0xF4, InstructionType.get("A", "d+X"));
    collection.add("MOV", 0xF5, InstructionType.get("A", "!a+X"));
    collection.add("MOV", 0xF6, InstructionType.get("A", "!a+Y"));
    collection.add("MOV", 0xF7, InstructionType.get("A", "[d]+Y"));
    collection.add("MOV", 0xF8, InstructionType.get("X", "d"));
    collection.add("MOV", 0xF9, InstructionType.get("X", "d+Y"));
    collection.add("MOV", 0xFA, InstructionType.get("d", "d"));
    collection.add("MOV", 0xFB, InstructionType.get("Y", "d+X"));
    collection.add("INC", 0xFC, InstructionType.get("Y"));
    collection.add("MOV", 0xFD, InstructionType.get("Y", "A"));
    collection.add("DBNZ", 0xFE, InstructionType.get("Y", "r"));
    collection.add("STOP", 0xFF, InstructionType.get());

    collection.compile(project, interpreter)
  }
}
