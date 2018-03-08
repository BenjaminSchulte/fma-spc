import {Parser, Plugin as CorePlugin} from 'fma';
import InstructionCompiler from './InstructionCompiler';
import FMA_INIT from './spc';

export default class Plugin extends CorePlugin {
  constructor() {
    super();
  }

  getName() {
    return 'SPC';
  }

  compileAssembler(project, interpreter) {
    const parser = new Parser(project);
    const program = parser.parseString(FMA_INIT);
    interpreter.process(program);
  }

  preProcess(project, interpreter) {
    const instructions = new InstructionCompiler();
    instructions.implementTo(project, interpreter)

    this.compileAssembler(project, interpreter);
  }

  postProcess(project, result) {
    return result;
  }

  register(root, interpreter) {
  }
}
