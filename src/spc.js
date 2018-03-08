export default `


class CompilerMemoryManager
  macro allow(at=nil, range=nil, align=nil, located_at=nil)
    unless at.nil?
      range = at..at
    end

    self.allow_range range, nil, nil, align, located_at
  end
end

module SPC
  RAM = CompilerMemoryManager.new
  ROM = RAM
  Compiler.register_static_memory ROM
  ROM.allow range:0..$FFFF
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
`;
