/* [MS-XLSB] 2.1.7.121 */
var parse_RichStr = function(data, length) {
	var start = data.l;
	var flags = data.read_shift(1);
	var fRichStr = flags & 1, fExtStr = flags & 2;
	var str = parse_XLWideString(data);
	var z = {
		t: str,
		raw:"<t>" + escapexml(str) + "</t>",
		r: str
	};
	if(fRichStr) {
		/* TODO: formatted string */
		var dwSizeStrRun = data.read_shift(4);
	}
	if(fExtStr) {
		/* TODO: phonetic string */
	}
	data.l = start + length;
	return z;
};

/* [MS-XLSB] 2.5.9 */
function parse_Cell(data) {
	var col = data.read_shift(4);
	var iStyleRef = data.read_shift(2);
	iStyleRef += data.read_shift(1) <<16;
	var fPhShow = data.read_shift(1);
	return { c:col, iStyleRef: iStyleRef };
}

/* [MS-XLSB] 2.5.21 */
var parse_CodeName = function(data, length) { return parse_XLWideString(data, length); };

/* [MS-XLSB] 2.5.114 */
var parse_RelID = function(data, length) { return parse_XLNullableWideString(data, length); };

/* [MS-XLSB] 2.5.122 */
function parse_RkNumber(data) {
	var b = data.slice(data.l, data.l+4);
	var fX100 = b[0] & 1, fInt = b[0] & 2;
	data.l+=4;
	b[0] &= ~3;
	var RK = fInt === 0 ? __readDoubleLE([0,0,0,0,b[0],b[1],b[2],b[3]],0) : __readInt32LE(b,0)>>2;
	return fX100 ? RK/100 : RK;
}

/* [MS-XLSB] 2.5.153 */
var parse_UncheckedRfX = function(data) {
	var cell = {s: {}, e: {}};
	cell.s.r = data.read_shift(4);
	cell.e.r = data.read_shift(4);
	cell.s.c = data.read_shift(4);
	cell.e.c = data.read_shift(4);
	return cell;
};

/* [MS-XLSB] 2.5.166 */
var parse_XLNullableWideString = function(data) {
	var cchCharacters = data.read_shift(4);
	return cchCharacters === 0 || cchCharacters === 0xFFFFFFFF ? "" : data.read_shift('dbcs', cchCharacters);
};

/* [MS-XLSB] 2.5.168 */
var parse_XLWideString = function(data) {
	var cchCharacters = data.read_shift(4);
	return cchCharacters === 0 ? "" : data.read_shift('dbcs', cchCharacters);
};

/* [MS-XLSB] 2.5.171 */
function parse_Xnum(data, length) { return data.read_shift('ieee754'); }

/* [MS-XLSB] 2.5.198.2 */
var BErr = {
	0x00: "#NULL!",
	0x07: "#DIV/0!",
	0x0F: "#VALUE!",
	0x17: "#REF!",
	0x1D: "#NAME?",
	0x24: "#NUM!",
	0x2A: "#N/A",
	0x2B: "#GETTING_DATA",
	0xFF: "#WTF?"
};
var RBErr = evert(BErr);

