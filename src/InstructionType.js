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

  static impl() {
    return new InstructionType(
      Parameter.NONE,
      Parameter.NONE,
      InstructionWriter.impl
    )
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
      default: throw new Error('Unknown operand: ' + op)
    }
  }

  static get(left=null, right=null) {
    left = this._conv(left);
    right = this._conv(right);
    return new InstructionType(left, right, InstructionWriter.impl)
  }
}
