export default `


class CompilerMemoryManager
  macro allow(at=nil, range=nil, align=nil, located_at=nil)
    unless at.nil?
      range = at..at
    end

    self.allow_range range, nil, nil, align, located_at
  end

  macro indirect(parameter=nil)
    self.to_future_number.indirect(parameter)
  end

  macro dp(parameter=nil)
    self.to_future_number.dp(parameter)
  end
end

;; Future number
class FutureNumber

  ;; Mark this number to be DP
  macro dp(parameter=nil)
    num = TypedNumber.new self, :direct_page
    num.parameter = parameter
    num
  end

  ;; Mark this number to be DP
  macro indirect(parameter=nil)
    num = TypedNumber.new self, :indirect
    num.parameter = parameter
    num
  end
end

;; Extends the number class to support ASM core handling
class Number

  ;; Mark this number to be DP
  macro dp(parameter=nil)
    num = TypedNumber.new self, :direct_page
    num.parameter = parameter
    num
  end

  ;; Mark this number to be DP
  macro indirect(parameter=nil)
    num = TypedNumber.new self, :indirect
    num.parameter = parameter
    num
  end
end

class TypedNumber
  macro dp(parameter=nil)
    num = TypedNumber.new self, :direct_page
    num.parameter = parameter
    num
  end

  macro indirect(parameter=nil)
    num = TypedNumber.new self, :indirect
    num.parameter = parameter
    num
  end
end

module SPC
  RAM = CompilerMemoryManager.new
  ROM = RAM
  Compiler.register_static_memory ROM
  ROM.allow range:0..$FFFF

  ;; All common data registers can be extended using this class
  class Register
    macro initialize(name)
      self.name = name
    end

    macro indirect(parameter=nil)
      num = TypedNumber.new self, :indirect
      num.parameter = parameter
      num
    end
  end

  ;; Assigns the memory location to the scope
  macro locate_at(address=nil, range=nil, align=nil)
    unless address.nil?
      range = address..address
    end

    Compiler.current_scope.locate_at range, nil, nil, align
  end
end

;; The accumulator
A = SPC::Register.new "A"

;; The index register X
X = SPC::Register.new "X"

;; The index register Y
Y = SPC::Register.new "Y"

;; The index register YA
YA = SPC::Register.new "YA"

;; The index register SP
SP = SPC::Register.new "SP"

;; The index register PSW
PSW = SPC::Register.new "PSW"

;; Support dp(number) syntax
macro dp(number, other=nil)
  number.dp other
end

;; Support indirect(number) syntax
macro indirect(number, other=nil)
  number.indirect other
end

;; Support addr(number) syntax
macro addr(number, parameter=nil)
    num = TypedNumber.new self, :address
    num.parameter = parameter
    num
end

;; Allocates a new RAM scope
macro scope(name, at=nil, length=nil, in=SPC::RAM, shared=false, align=nil)
  address_range = nil

  if in.nil?
    ram = SPC::RAM.allocate
    ram.detach
  else
    ram = in.allocate
  end
  ram.set_is_shared shared

  unless at.nil? && align.nil?
    ram.allow at: at, align: align
  end

  unless length.nil?
    ram.set_item_size length
  end

  callee[name] = ram
  ram
end

;; Declares a variable
macro declare(name, as, in=nil, at=nil, length=nil)
  if callee.is_a? Class
    callee.on_initialize_members do |in|
      self[name] = declare name, as, in, at, length
    end
    callee.register_variable_offset name, as, length
    return
  end

  raise "Missing argument for declare: in" if in.nil?

  ram = in.allocate

  unless at.nil?
    ram.allow at: at
  end

  ram.set_item_type as
  ram.set_num_items length

  callee[name] = ram
  ram
end

;; Sets the location of all functions
macro @locate_at(**kwargs)
  SPC.locate_at **kwargs

  yield
end
`;
