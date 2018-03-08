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
}
