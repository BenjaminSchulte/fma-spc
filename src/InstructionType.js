import * as Parameter from './InstructionParameter';
import InstructionWriter from './InstructionWriter';

export default class InstructionType {
  constructor(p1, p2, writer) {
    if (writer === undefined || p1 === undefined || p2 === undefined) {
      throw new Error('Missing parameter');
    }

    this.p1 = p1;
    this.p2 = p2;
    this.writer = writer;
  }

  static _conv(op) {
    if (op === null) {
      return Parameter.NONE;
    }

    switch (op) {
      case '': return Parameter.NONE;
      case '!a': return Parameter.ADDRESS;
      case '!a+X': return Parameter.ADDRESS_X;
      case '[!a+X]': return Parameter.ADDRESS_X;
      case '!a+Y': return Parameter.ADDRESS_Y;
      case 'A': return Parameter.A;
      case 'X': return Parameter.X;
      case '(X)': return Parameter.INDIRECT_X;
      case 'Y': return Parameter.Y;
      case '(Y)': return Parameter.INDIRECT_Y;
      case 'YA': return Parameter.YA;
      case 'SP': return Parameter.SP;
      case 'PSW': return Parameter.PSW;
      case '#i': return Parameter.CONSTANT;
      case 'd': return Parameter.DP;
      case 'd+X': return Parameter.DP_X;
      case 'd+Y': return Parameter.DP_Y;
      case '[d+X]': return Parameter.INDIRECT_DP_X;
      case '[d]+Y': return Parameter.INDIRECT_DP_THEN_Y;
      case 'r': return Parameter.ADDRESS;
      case 'r16': return Parameter.ADDRESS;
      default: throw new Error('Unknown operand: ' + op)
    }
  }

  static _writer(type, name) {
    switch (name) {
      case 'r': return InstructionWriter.rel8;
      case 'r16': return InstructionWriter.rel16;
    }

    switch (type) {
      case Parameter.ADDRESS:
      case Parameter.ADDRESS_X:
      case Parameter.ADDRESS_Y:
        return InstructionWriter.imm16;

      case Parameter.CONSTANT:
        return InstructionWriter.imm8;

      case Parameter.INDIRECT_DP_X:
      case Parameter.INDIRECT_DP_THEN_Y:
      case Parameter.DP:
      case Parameter.DP_X:
      case Parameter.DP_Y:
        return InstructionWriter.directPage;

      default:
        return InstructionWriter.impl;
    }
  }

  static get(left=null, right=null) {
    const opLeft = this._conv(left);
    const opRight = this._conv(right);

    const writeLeft = this._writer(opLeft, left);
    const writeRight = this._writer(opRight, right);
    return new InstructionType(opLeft, opRight, InstructionWriter.pair(writeLeft, writeRight))
  }

  static getRev(left=null, right=null) {
    const opLeft = this._conv(left);
    const opRight = this._conv(right);

    const writeLeft = this._writer(opLeft, left);
    const writeRight = this._writer(opRight, right);
    return new InstructionType(opLeft, opRight, InstructionWriter.pairRev(writeLeft, writeRight))
  }
}
