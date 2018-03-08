import {ArgumentList, Nil, MacroObject} from 'fma';
import * as ParameterType from './InstructionParameter';
import {BooleanObject} from 'fma';

class Code {
  constructor(code) {
    this.code = code;

    this.writeUInt8 = this._write({
      static: function(code, value) {code.writeUInt8(value);},
      calc: function(code, value) {code.writeCalculation(value, 1);}
    });
  }

  _write(callbacks) {
    const writeStatic = callbacks.static;
    const writeCalc = callbacks.calc;
    const code = this.code;

    return function(number) {
      if (typeof number === 'number') {
        writeStatic(code.code, number);
      } else {
        switch (number.getClassName()) {
          case 'Number':
            writeStatic(code.code, number.getMember('__value').value);
            break;

          case 'FutureNumber':
            writeCalc(code, number.getCalculation());
            break;

          default:
            throw new Error('Class ' + number.getClassName() + ' can not be written directly');
        }
      }
    };
  };
}

class Parameter {
  constructor(context, object) {
    this.context = context;
    this.rawValue = object;

    this.parse(context, object);
  }

  parse(context, object) {
    if (object.isNil()) {
      this.type = ParameterType.NONE;
      return;
    }

    console.log('TODO: ', object);
  }
}

export default class Instruction {
  constructor(name) {
    this.name = name;

    this.alternatives = {}
  }

  add(type, opcode, callback) {
    if (!this.alternatives.hasOwnProperty(type.p1)) {
      this.alternatives[type.p1] = {}
    }

    this.alternatives[type.p1][type.p2] = {type, opcode, callback};
  }

  invoke(context, p1, p2) {
    if (!this.alternatives.hasOwnProperty(p1.type) || !this.alternatives[p1.type].hasOwnProperty(p2.type)) {
      throw new Error('The instruction ' + this.name + ' does not support the given parameters: ' + p1.type + ', ' + p2.type);
    }

    const scope = context.getRoot().getObject().getMember('Compiler').getMember('current_scope');
    const {type, opcode, callback} = this.alternatives[p1.type][p2.type];

    if (scope.isUndefined()) {
      throw new Error('Instructions can only be used within function context');
    }

    scope.setMember('is_return_opcode', new BooleanObject(false));
    const code = new Code(scope.block.code);

    type.writer(scope, code, opcode, p1, p2, context);

    if (callback) {
      callback(scope, opcode, p1, p2, context);
    }
  }

  invokeRaw(context) {
    const obj = context.getObject();
    const p1 = new Parameter(context, obj.getMember('p1'));
    const p2 = new Parameter(context, obj.getMember('p2'));

    this.invoke(context, p1, p2);
  }

  build() {
    const macro = new MacroObject(this.name);
    const args = new ArgumentList();

    args.addArgument('p1', ArgumentList.TYPE_ARGUMENT, Nil);
    args.addArgument('p2', ArgumentList.TYPE_ARGUMENT, Nil);
    macro.setArguments(args);

    macro.setCallback((context, self) => {
      this.invokeRaw(context);
    })

    return macro;
  }
}
