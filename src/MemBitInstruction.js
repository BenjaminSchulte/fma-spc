import {StaticNumber, Calculation, ArgumentList, Nil, MacroObject} from 'fma';
import {BooleanObject} from 'fma';
import * as ParameterType from './InstructionParameter';
import Parameter from './Parameter';
import InstructionWriter from './InstructionWriter';

export default class MemBitInstruction {
  constructor(name, left, right=null) {
    this.name = name;
    this.left = left;
    this.right = right;
  }

  writeMemBit(context, opcode, address, bit) {
    const scope = context.getRoot().getObject().getMember('Compiler').getMember('current_scope');
    if (scope.isUndefined()) {
      throw new Error('Instructions can only be used within function context');
    }

    const code = scope.block.code;
    scope.setMember('is_return_opcode', new BooleanObject(false));
    code.write(opcode, 1);

    address = InstructionWriter.toCalculation(address.value);
    bit = InstructionWriter.toCalculation(bit.value);

    address = new Calculation(address, '&', new StaticNumber(0x1FFF));
    bit = new Calculation(new Calculation(bit, '&', new StaticNumber(7)), '<<', new StaticNumber(13));
    code.writeCalculation(new Calculation(address, '|', bit), 2);
  }

  invoke(context, p1, p2, p3) {
    if (this.right && p1.type === ParameterType.C && p2.type === ParameterType.ADDRESS && p3.type === ParameterType.ADDRESS) {
      this.writeMemBit(context, this.left, p2, p3);
    } else if (this.right && p3.type === ParameterType.C && p2.type === ParameterType.ADDRESS && p1.type === ParameterType.ADDRESS) {
      this.writeMemBit(context, this.right, p1, p2);
    } else if (this.right === null && p3.type === ParameterType.NONE && p1.type === ParameterType.ADDRESS && p2.type === ParameterType.ADDRESS) {
      this.writeMemBit(context, this.left, p1, p2);
    } else {
      throw new Error(`Invalid parameter type for MEMBIT instruction`)
    }
  }

  invokeRaw(context) {
    const obj = context.getObject();
    const p1 = new Parameter(context, obj.getMember('p1'));
    const p2 = new Parameter(context, obj.getMember('p2'));
    const p3 = new Parameter(context, obj.getMember('p3'));

    this.invoke(context, p1, p2, p3);
  }

  build() {
    const macro = new MacroObject(this.name);
    const args = new ArgumentList();

    args.addArgument('p1', ArgumentList.TYPE_ARGUMENT, Nil);
    args.addArgument('p2', ArgumentList.TYPE_ARGUMENT, Nil);
    args.addArgument('p3', ArgumentList.TYPE_ARGUMENT, Nil);
    macro.setArguments(args);

    macro.setCallback((context, self) => {
      this.invokeRaw(context);
    })

    return macro;
  }
}
