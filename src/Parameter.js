import * as ParameterType from './InstructionParameter';

export default class Parameter {
  constructor(context, object) {
    this.context = context;
    this.rawValue = object;

    this.parse(context, object);
  }

  toNumber(context, object) {
    if (object.hasMember('to_future_number')) {
      return object.getMember('to_future_number').callWithParameters(context);
    } else if (object.hasMember('to_n')) {
      return object.getMember('to_n').callWithParameters(context);
    } else {
      throw new Error('Unknown how to convert to number: ' + object.getClassName());
    }
  }

  parseInnerType(object) {
    const klass = object.getClassName();

    if (klass === 'Register') {
      return {type: object.getMember('name').getMember('__value').value};
    } else if (klass === 'TypedNumber') {
      const type = object.getMember('type').getMember('__value').value;
      const value = object.getMember('number');

      switch (type) {
        case 'direct_page':
          var par = object.getMember('parameter');
          if (par.isNil()) {
            return {type: 'DP', value}
          } else {
            switch (par.getMember('name').getMember('__value').value) {
              case 'X': return {type: 'DP_X', value}
              default:
                throw new Error('Unsupported relative DP register')
            }
          }
          break;

        default:
          throw new Error(type);
      }
    } else {
      throw new Error('Unknown inner type: ' + klass);
    }
  }

  parse(context, object) {
    if (object.isNil()) {
      this.type = ParameterType.NONE;
      return;
    }

    const klass = object.getClassName();
    if (klass === 'TypedNumber') {
      const type = object.getMember('type').getMember('__value').value;

      this.value = object.getMember('number');

      switch (type) {
        case 'constant':
          this.type = ParameterType.CONSTANT;
          break;

        case 'direct_page':
          var par = object.getMember('parameter');
          if (par.isNil()) {
            this.type = ParameterType.DP;
          } else {
            switch (par.getMember('name').getMember('__value').value) {
              case 'X': this.type = ParameterType.DP_X; break;
              case 'Y': this.type = ParameterType.DP_Y; break;
              default:
                throw new Error('Unsupported relative DP register')
            }
          }
          break;

        case 'address':
          var par = object.getMember('parameter');
          if (par.isNil()) {
            this.type = ParameterType.ADDRESS;
          } else {
            switch (par.getMember('name').getMember('__value').value) {
              case 'X': this.type = ParameterType.ADDRESS_X; break;
              case 'Y': this.type = ParameterType.ADDRESS_Y; break;
              default:
                throw new Error('Unsupported relative ADDRESS register')
            }
          }
          break;

        case 'indirect':
          const param = object.getMember('parameter').getClassName();
          const innerType = this.parseInnerType(this.value);

          if (innerType.value) {
            this.value = innerType.value;
          }

          switch (innerType.type) {
            case 'X': this.type = ParameterType.INDIRECT_X; break;
            case 'Y': this.type = ParameterType.INDIRECT_Y; break;
            case 'DP_X': this.type = ParameterType.INDIRECT_DP_X; break;
            case 'DP':
              if (param !== 'Register') {
                throw new Error('Unsupported opcode');
              }
              const name = object.getMember('parameter').getMember('name').getMember('__value').value;
              if (name !== 'Y') {
                throw new Error('Unsupported opcode');
              }
              this.type = ParameterType.INDIRECT_DP_THEN_Y;
              break;

            default:
              throw new Error('TODO');
          }
          /*
          switch (param) {
            case 'Nil': this.type = ParameterType.INDIRECT; break;
            case 'Register':
              const name = object.getMember('parameter').getMember('name').getMember('__value').value;
              switch (name) {
                case 'X': this.type = ParameterType.INDIRECT_X; break;
                case 'Y': this.type = ParameterType.INDIRECT_Y; break;
                default: throw new Error('Unknown register: ' + name);
              }
              break;

            default:
              throw new Error('Unknown indirect type: ' + param);
          }*/
          break;

        default:
          console.log('UNKNOWN TYPE: ' + type);
          break;
      }
    } else if (klass === 'Register') {
      switch (object.getMember('name').getMember('__value').value) {
        case 'A': this.type = ParameterType.A; break;
        case 'C': this.type = ParameterType.C; break;
        case 'X': this.type = ParameterType.X; break;
        case 'Y': this.type = ParameterType.Y; break;
        case 'YA': this.type = ParameterType.YA; break;
        case 'SP': this.type = ParameterType.SP; break;
        case 'PSW': this.type = ParameterType.PSW; break;
        default:
          throw new Error('Unknown register');
      }
    } else {
      this.type = ParameterType.ADDRESS;
      this.value = this.toNumber(context, object);
    }
  }
}
