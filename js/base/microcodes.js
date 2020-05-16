// require none

//Contains code + instr
var Microcodes = {
	"11": ["LXI","D"],"12": ["STAX","D"],"13": ["INX","D"],"14": ["INR","D"],"15": ["DCR","D"],"16": ["MVI","D","8-bit"],"17": ["RAL"],"19": ["DAD","D"],"20": ["RIM"],"21": ["LXI","H", "16-bit"],"22": ["SHLD","16-bit"],"23": ["INX","H"],"24": ["INR","H"],"25": ["DCR","H"],"26": ["MVI","H","8-bit"],"27": ["DAA"],"29": ["DAD","H"],"30": ["SIM"],"31": ["LXI","SP","16-bit"],"32": ["STA","16-bit"],"33": ["INX","SP"],"34": ["INR","M"],"35": ["DCR","M"],"36": ["MVI","M","8-bit"],"37": ["STC"],"39": ["DAD","SP"],"40": ["MOV","B","B"],"41": ["MOV","B","C"],"42": ["MOV","B","D"],"43": ["MOV","B","E"],"44": ["MOV","B","H"],"45": ["MOV","B","L"],"46": ["MOV","B","M"],"47": ["MOV","B","A"],"48": ["MOV","C","B"],"49": ["MOV","C","C"],"50": ["MOV","D","B"],"51": ["MOV","D","C"],"52": ["MOV","D","D"],"53": ["MOV","D","E"],"54": ["MOV","D","H"],"55": ["MOV","D","L"],"56": ["MOV","D","M"],"57": ["MOV","D","A"],"58": ["MOV","E","B"],"59": ["MOV","E","C"],"60": ["MOV","H","B"],"61": ["MOV","H","C"],"62": ["MOV","H","D"],"63": ["MOV","H","E"],"64": ["MOV","H","H"],"65": ["MOV","H","L"],"66": ["MOV","H","M"],"67": ["MOV","H","A"],"68": ["MOV","L","B"],"69": ["MOV","L","C"],"70": ["MOV","M","B"],"71": ["MOV","M","C"],"72": ["MOV","M","D"],"73": ["MOV","M","E"],"74": ["MOV","M","H"],"75": ["MOV","M","L"],"76": ["HLT"],"77": ["MOV","M","A"],"78": ["MOV","A","B"],"79": ["MOV","A","C"],"80": ["ADD","B"],"81": ["ADD","C"],"82": ["ADD","D"],"83": ["ADD","E"],"84": ["ADD","H"],"85": ["ADD","L"],"86": ["ADD","M"],"87": ["ADD","A"],"88": ["ADC","B"],"89": ["ADC","C"],"90": ["SUB","B"],"91": ["SUB","C"],"92": ["SUB","D"],"93": ["SUB","E"],"94": ["SUB","H"],"95": ["SUB","L"],"96": ["SUB","M"],"97": ["SUB","A"],"98": ["SBB","B"],"99": ["SBB","C"],"CE": ["ACI","8-bit"],"8F": ["ADC","A"],"8A": ["ADC","D"],"8B": ["ADC","E"],"8C": ["ADC","H"],"8D": ["ADC","L"],"8E": ["ADC","M"],"C6": ["ADI","8-bit"],"A7": ["ANA","A"],"A0": ["ANA","B"],"A1": ["ANA","C"],"A2": ["ANA","D"],"A3": ["ANA","E"],"A4": ["ANA","H"],"A5": ["ANA","L"],"A6": ["ANA","M"],"E6": ["ANI","8-bit"],"CD": ["CALL","16-bit"],"DC": ["CC","16-bit"],"FC": ["CM","16-bit"],"2F": ["CMA"],"3F": ["CMC"],"BF": ["CMP","A"],"B8": ["CMP","B"],"B9": ["CMP","C"],"BA": ["CMP","D"],"BB": ["CMP","E"],"BC": ["CMP","H"],"BD": ["CMP","L"], "BE": ["CMP", "M"],"D4": ["CNC","16-bit"],"C4": ["CNZ","16-bit"],"F4": ["CP","16-bit"],"EC": ["CPE","16-bit"],"FE": ["CPI","8-bit"],"E4": ["CPO","16-bit"],"CC": ["CZ","16-bit"],"09": ["DAD","B"],"3D": ["DCR","A"],"05": ["DCR","B"],"0D": ["DCR","C"],"1D": ["DCR","E"],"2D": ["DCR","L"],"0B": ["DCX","B"],"1B": ["DCX","D"],"2B": ["DCX","H"],"3B": ["DCX","SP"],"F3": ["DI"],"FB": ["EI"],"DB": ["IN","8-Bit"],"3C": ["INR","A"],"04": ["INR","B"],"0C": ["INR","C"],"1C": ["INR","E"],"2C": ["INR","L"],"03": ["INX","B"],"DA": ["JC","16-bit"],"FA": ["JM","16-bit"],"C3": ["JMP","16-bit"],"D2": ["JNC","16-bit"],"C2": ["JNZ","16-bit"],"F2": ["JP","16-bit"],"EA": ["JPE","16-bit"],"E2": ["JPO","16-bit"],"CA": ["JZ","16-bit"],"3A": ["LDA","16-bit"],"0A": ["LDAX","B"],"1A": ["LDAX","D"],"2A": ["LHLD","16-bit"],"01": ["LXI","B","16-bit"],"7F": ["MOV","A","A"],"7A": ["MOV","A","D"],"7B": ["MOV","A","E"],"7C": ["MOV","A","H"],"7D": ["MOV","A","L"],"7E": ["MOV","A","M"],"4F": ["MOV","C","A"],"4A": ["MOV","C","D"],"4B": ["MOV","C","E"],"4C": ["MOV","C","H"],"4D": ["MOV","C","L"],"4E": ["MOV","C","M"],"5F": ["MOV","E","A"],"5A": ["MOV","E","D"],"5B": ["MOV","E","E"],"5C": ["MOV","E","H"],"5D": ["MOV","E","L"],"5E": ["MOV","E","M"],"6F": ["MOV","L","A"],"6A": ["MOV","L","D"],"6B": ["MOV","L","E"],"6C": ["MOV","L","H"],"6D": ["MOV","L","L"],"6E": ["MOV","L","M"],"3E": ["MVI","A","8-bit"],"06": ["MVI","B","8-bit"],"0E": ["MVI","C","8-bit"],"1E": ["MVI","E","8-bit"],"2E": ["MVI","L","8-bit"],"00": ["NOP"],"B7": ["ORA","A"],"B0": ["ORA","B"],"B1": ["ORA","C"],"B2": ["ORA","D"],"B3": ["ORA","E"],"B4": ["ORA","H"],"B5": ["ORA","L"],"B6": ["ORA","M"],"F6": ["ORI","8-bit"],"D3": ["OUT","8-bit"],"E9": ["PCHL"],"C1": ["POP","B"],"D1": ["POP","D"],"E1": ["POP","H"],"F1": ["POP","PSW"],"C5": ["PUSH","B"],"D5": ["PUSH","D"],"E5": ["PUSH","H"],"F5": ["PUSH","PSW"],"1F": ["RAR"],"D8": ["RC"],"C9": ["RET"],"07": ["RLC"],"F8": ["RM"],"D0": ["RNC"],"C0": ["RNZ"],"F0": ["RP"],"E8": ["RPE"],"E0": ["RPO"],"0F": ["RRC"],"C7": ["RST","0"],"CF": ["RST","1"],"D7": ["RST","2"],"DF": ["RST","3"],"E7": ["RST","4"],"EF": ["RST","5"],"F7": ["RST","6"],"FF": ["RST","7"],"C8": ["RZ"],"9F": ["SBB","A"],"9A": ["SBB","D"],"9B": ["SBB","E"],"9C": ["SBB","H"],"9D": ["SBB","L"],"9E": ["SBB","M"],"DE": ["SBI","8-bit"],"F9": ["SPHL"],"02": ["STAX","B"],"D6": ["SUI","8-bit"],"EB": ["XCHG"],"AF": ["XRA","A"],"A8": ["XRA","B"],"A9": ["XRA","C"],"AA": ["XRA","D"],"AB": ["XRA","E"],"AC": ["XRA","H"],"AD": ["XRA","L"],"AE": ["XRA","M"],"EE": ["XRI","8-bit"],"E3": ["XTHL"]
}

//Contains length of instructions
var Bytes = {
	"CE": 2, "8F": 1, "88": 1, "89": 1, "8A": 1, "8B": 1, "8C": 1, "8D": 1, "8E": 1, "87": 1, "80": 1, "81": 1, "82": 1, "83": 1, "84": 1, "85": 1, "86": 1, "C6": 2, "A7": 1, "A0": 1, "A1": 1, "A2": 1, "A3": 1, "A4": 1, "A5": 1, "A6": 1, "E6": 2, "CD": 3, "DC": 3, "FC": 3, "2F": 1, "3F": 1, "BF": 1, "B8": 1, "B9": 1, "BA": 1, "BB": 1, "BC": 1, "BD": 1, "BE": 1, "D4": 3, "C4": 3, "F4": 3, "EC": 3, "FE": 2, "E4": 3, "CC": 3, "27": 1, "09": 1, "19": 1, "29": 1, "39": 1, "3D": 1, "05": 1, "0D": 1, "15": 1, "1D": 1, "25": 1, "2D": 1, "35": 1, "0B": 1, "1B": 1, "2B": 1, "3B": 1, "F3": 1, "FB": 1, "76": 1, "DB": 2, "3C": 1, "04": 1, "0C": 1, "14": 1, "1C": 1, "24": 1, "2C": 1, "34": 1, "03": 1, "13": 1, "23": 1, "33": 1, "DA": 3, "FA": 3, "C3": 3, "D2": 3, "C2": 3, "F2": 3, "EA": 3, "E2": 3, "CA": 3, "3A": 3, "0A": 1, "1A": 1, "2A": 3, "01": 3, "11": 3, "21": 3, "31": 3, "7F": 1, "78": 1, "79": 1, "7A": 1, "7B": 1, "7C": 1, "7D": 1, "7E": 1, "47": 1, "40": 1, "41": 1, "42": 1, "43": 1, "44": 1, "45": 1, "46": 1, "4F": 1, "48": 1, "49": 1, "4A": 1, "4B": 1, "4C": 1, "4D": 1, "4E": 1, "57": 1, "50": 1, "51": 1, "52": 1, "53": 1, "54": 1, "55": 1, "56": 1, "5F": 1, "58": 1, "59": 1, "5A": 1, "5B": 1, "5C": 1, "5D": 1, "5E": 1, "67": 1, "60": 1, "61": 1, "62": 1, "63": 1, "64": 1, "65": 1, "66": 1, "6F": 1, "68": 1, "69": 1, "6A": 1, "6B": 1, "6C": 1, "6D": 1, "6E": 1, "77": 1, "70": 1, "71": 1, "72": 1, "73": 1, "74": 1, "75": 1, "3E": 2, "06": 2, "0E": 2, "16": 2, "1E": 2, "26": 2, "2E": 2, "36": 2, "00": 1, "B7": 1, "B0": 1, "B1": 1, "B2": 1, "B3": 1, "B4": 1, "B5": 1, "B6": 1, "F6": 2, "D3": 2, "E9": 1, "C1": 1, "D1": 1, "E1": 1, "F1": 1, "C5": 1, "D5": 1, "E5": 1, "F5": 1, "17": 1, "1F": 1, "D8": 1, "C9": 1, "20": 1, "07": 1, "F8": 1, "D0": 1, "C0": 1, "F0": 1, "E8": 1, "E0": 1, "0F": 1, "C7": 1, "CF": 1, "D7": 1, "DF": 1, "E7": 1, "EF": 1, "F7": 1, "FF": 1, "C8": 1, "9F": 1, "98": 1, "99": 1, "9A": 1, "9B": 1, "9C": 1, "9D": 1, "9E": 1, "DE": 2, "22": 3, "30": 1, "F9": 1, "32": 3, "02": 1, "12": 1, "37": 1, "97": 1, "90": 1, "91": 1, "92": 1, "93": 1, "94": 1, "95": 1, "96": 1, "D6": 2, "EB": 1, "AF": 1, "A8": 1, "A9": 1, "AA": 1, "AB": 1, "AC": 1, "AD": 1, "AE": 1, "EE": 2, "E3": 1
}

//Contains information about instructions
var Instructions = {
	"SHLD": {
		description: "Stores HL pair to memory, address is provided in 16-Bit Data",
	},
	"ACI": {
		description: "Add immidiate with carry to accumulator, data is provided in 8-Bit Data",
	},
	"ADC": {
		description: "Add with carry to accumulator value in given register",
	},
	"ADD": {
		description: "Add to accumulator value in given register",
	},
	"ADI": {
		description: "Add immidiate to accumulator, data is provided in 8-Bit Data",
	},
	"ANA": {
		description: "Bitwise-and with accumulator the value in given register",
	},
	"ANI": {
		description: "Bitwise-and immidiate with accumulator, data is provided in 8-Bit Data",
	},
	"CALL": {
		description: "Call subroutine at 16-bit address",
	},
	"CC": {
		description: "Call on carry subroutine at 16-bit address",
	},
	"CM": {
		description: "Call on minus S flag subroutine at 16-bit address",
	},
	"CMA": {
		description: "Complement accumulator",
	},
	"CMC": {
		description: "Complement carry flag",
	},
	"CMP": {
		description: "Compare accumulator with given register",
	},
	"CNC": {
		description: "Call on no carry subroutine at 16-bit address",
	},
	"CNZ": {
		description: "Call on not zero subroutine at 16-bit address",
	},
	"CP": {
		description: "Call on positive subroutine at 16-Bit address",
	},
	"CPE": {
		description: "Call on even parity subroutine at 16-Bit address",
	},
	"CPI": {
		description: "Compare immidiate with accumulator, value in 8-Bit",
	},
	"CPO": {
		description: "Call on odd parity subroutine at 16-Bit address",
	},
	"CZ": {
		description: "Call on zero subroutine at 16-Bit address",
	},
	"DAA": {
		description: "Adjusts BCD number after addition",
	},
	"DAD": {
		description: "Double add, ie, add two register pairs, HL acting as accumulator",
	},
	"DCR": {
		description: "Decrement register",
	},
	"DCX": {
		description: "Decrement register pair",
	},
	"DI": {
		description: "Disable interrupts",
	},
	"IE": {
		description: "Interrupt enable",
	},
	"HLT": {
		description: "Halt machine",
	},
	"IN": {
		description: "Take input from device at address 8-Bit port",
	},
	"INR": {
		description: "Increment Register",
	},
	"INX": {
		description: "Increment Register pair",
	},
	"JC": {
		description: "Jump on carry to 16-Bit address",
	},
	"JM": {
		description: "Jump on negative sign bit (Minus) carry to 16-Bit address",
	},
	"JMP": {
		description: "Unconditional Jump to 16-Bit address",
	},
	"JNC": {
		description: "Jump on no carry to 16-Bit address",
	},
	"JNZ": {
		description: "Jump on not zero to 16-Bit address",
	},
	"JP": {
		description: "Jump on positive sign to 16-bit address",
	},
	"JPE": {
		description: "Jump on even parity (flag P = 1) to 16-bit address",
	},
	"JPO": {
		description: "Jump on odd parity (flag P = 0) to 16-bit address",
	},
	"JZ": {
		description: "Jump on zero to 16-bit address",
	},
	"LDA": {
		description: "Load accumulator with value at memory location with 16-bit address",
	},
	"LDAX": {
		description: "Load accumulator with value at memory location contained by register pair",
	},
	"LHLD": {
		description: "Load HL pair with value at memory location with 16-Bit address",
	},
	"LXI": {
		description: "Load register pair with immidiate 16-Bit value",
	},
	"MOV": {
		description: "Move data from one register to another, or from memory @ HL(M) to a register",
	},
	"MVI": {
		description: "Move immidiate 8-Bit data to register",
	},
	"NOP": {
		description: "No operation",
	},
	"ORA": {
		description: "Bitwise-or with accumulator value in given register",
	},
	"ORI": {
		description: "Bitwise-or with accumulator immidiate 8-Bit value",
	},
	"OUT": {
		description: "Send accumulator value to output device with port address 8-Bit",
	},
	"PCHL": {
		description: "Load program counter with contents of HL register pair",
	},
	"POP": {
		description: "Pop to register pair or PSW",
	},
	"PUSH": {
		description: "Push to register pair or PSW",
	},
	"RAL": {
		description: "Rotate accumulator circular left through carry",
	},
	"RAR": {
		description: "Rotate accumulator circular right through Carry",
	},
	"RC": {
		description: "Return on carry",
	},
	"RET": {
		description: "Unconditional return",
	},
	"RIM": {
		description: "Read interrupt mask to accumulator",
	},
	"RLC": {
		description: "Rotate accumulator circular left, copying D7 onto Carry",
	},
	"RM": {
		description: "Return on negative (Minus)",
	},
	"RNC": {
		description: "Return on no carry",
	},
	"RNZ": {
		description: "Return on not zero",
	},
	"RP": {
		description: "Return on positive",
	},
	"RPE": {
		description: "Return on even parity",
	},
	"RPO": {
		description: "Return on odd parity",
	},
	"RRC": {
		description: "Rotate accumulator circular right, copying D0 to D7 & carry",
	},
	"RST": {
		description: "Software interrupt",
	},
	"RZ": {
		description: "Return on Zero",
	},
	"SBB": {
		description: "Subtract from accumulator with borrow",
	},
	"SBI": {
		description: "Subtract from accumulator 8-bit with borrow",
	},
	"SHLD": {
		description: "Store HL pair to memory address 16-bit",
	},
	"SIM": {
		description: "Set interrupt mask according to accumulator data",
	},
	"SPHL": {
		description: "Initialize SP with the contents of the HL pair",
	},
	"STA": {
		description: "Store accumulator to memory address 16-Bit",
	},
	"STAX": {
		description: "Store accumulator to memory location @ register pair",
	},
	"STC": {
		description: "Sets the carry flag",
	},
	"SUB": {
		description: "Subtract from accumulator the value in register",
	},
	"SUI": {
		description: "Subtract from accumulator the 8-Bit immidiate data",
	},
	"XCHG": {
		description: "Exchange HL pair with DE pair",
	},
	"XRA": {
		description: "XOR with accumulator the contents of the register",
	},
	"XRI": {
		description: "XOR with accumulator the immidiate data 8-Bit",
	},
	"XTHL": {
		description: "Exchange top of stack with HL pair",
	}
}