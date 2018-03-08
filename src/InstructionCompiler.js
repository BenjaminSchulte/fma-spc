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
    const collection = new InstructionCollection();

    collection.add("CLRP", 0x20, InstructionType.impl());

    collection.compile(project, interpreter)
  }
}
