export default class InstructionWriter {
  static impl(scope, code, opcode, p1, p2) {
    code.writeUInt8(opcode);
  }
}
