import {FutureNumber, StaticNumber, Calculation} from 'fma';

export default class InstructionWriter {
  static toCalculation(number) {
    switch (number.getClassName()) {
      case 'FutureNumber':
        number = number.getCalculation();
        break;

      default:
        throw new Error('Can not process rel8 with ' + number.getClassName());
    }

    return number;
  }

  static impl(scope, code, opcode, parameter) {
  }

  static imm8(scope, code, opcode, parameter) {
    code.writeUInt8(parameter.value);
  }

  static imm16(scope, code, opcode, parameter) {
    code.writeUInt16(parameter.value);
  }

  static directPage(scope, code, opcode, parameter) {
    code.writeUInt8(parameter.value);
  }

  static rel8(scope, code, opcode, parameter, context) {
    const number = InstructionWriter.toCalculation(parameter.value);
    const pc = InstructionWriter.toCalculation(scope.getMember('PC').callWithParameters(context));
    code.writeUInt8(new FutureNumber(new Calculation(new Calculation(number, '-', pc), '-', new StaticNumber(1))));
  }

  static rel16(scope, code, opcode, parameter, context) {
    const number = InstructionWriter.toCalculation(parameter.value);
    const pc = InstructionWriter.toCalculation(scope.getMember('PC').callWithParameters(context));
    code.writeUInt16(new FutureNumber(new Calculation(new Calculation(number, '-', pc), '-', new StaticNumber(1))));
  }

  static pair(left, right) {
    return function(scope, code, opcode, p1, p2, context) {
      code.writeUInt8(opcode);
      right(scope, code, opcode, p2, context)
      left(scope, code, opcode, p1, context)
    }
  }

  static pairRev(left, right) {
    return function(scope, code, opcode, p1, p2, context) {
      code.writeUInt8(opcode);
      left(scope, code, opcode, p1, context)
      right(scope, code, opcode, p2, context)
    }
  }
}
