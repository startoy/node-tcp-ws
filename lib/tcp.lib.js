/**
 * Encode message from string to character code
 * @param {*} message 
 */
exports.encodeTCP = function(message) {
	let r, b0, b1;  // r = Remainder of mod
	let buffer = Buffer.alloc(message.length + 2)
	let bytes = this.dec2bin(message.length);

	if (bytes.length < 8) {
		buffer[0] = 0;
		buffer[1] = parseInt(bytes, 2);
	} else {
		r = bytes.length%8;
		if (r == 0) {
			r = 8;  // If remain = 0 then slice 0 to 8; else 0 to r
		}
		b0 = bytes.slice(0, r);
		b1 = bytes.slice(r);
		buffer[0] = parseInt(b0, 2);
		buffer[1] = parseInt(b1, 2);
	}

	return this.strToAscii(message, buffer);
}

/**
 * Decode bytes. from raw (tcp) to String
 * @param {*} bytes 
 */
exports.decodeTCP = function (bytes) {
	// Read 2 bytes to get len
	let b0 = this.dec2bin(bytes[0]);
	let b1 = this.dec2bin(bytes[1]);
	let b_size = parseInt(b0 + b1);
	let raw_data = bytes.slice(2, b_size + 2);
	return this.asciiToStr(raw_data);
}

exports.dec2bin = function(dec){
	return (dec >>> 0).toString(2);
}

/**
 * convert each char code to String
 * @param {*} raw 
 */
exports.asciiToStr = function(raw){
	let data = ''
	for(let i = 0 ; i < raw.length ;i++){
		data = data + String.fromCharCode(raw[i])
	}
	return data
}

/**
 * Convert each char from `messsage` to char code
 * @param {String} message 
 * @param {*} output buffer allocate(4096)
 */
 exports.strToAscii = function(message, output){
	let i;
	for(i = 2 ; i < message.length + 2 ; i++){
		output[i] = message.charCodeAt(i-2)
	}
	return output
}


/**
 * Convert a 16-bit quantity (short integer) from host byte order to network byte order (Little-Endian to Big-Endian).
 *
 * @param {Array|Buffer} b Array of octets or a nodejs Buffer
 * @param {number} i Zero-based index at which to write into b
 * @param {number} v Value to convert
 */
exports.htons = function(b, i, v) {
	b[i] = (0xff & (v >> 8));
	b[i + 1] = (0xff & (v));
};

/**
 * Convert a 16-bit quantity (short integer) from network byte order to host byte order (Big-Endian to Little-Endian).
 *
 * @param {Array|Buffer} b Array of octets or a nodejs Buffer to read value from
 * @param {number} i Zero-based index at which to read from b
 * @returns {number}
 */
exports.ntohs = function(b, i) {
	return ((0xff & b[i]) << 8) | 
	       ((0xff & b[i + 1]));
};

/**
 * Convert a 16-bit quantity (short integer) from network byte order to host byte order (Big-Endian to Little-Endian).
 *
 * @param {string} s String to read value from
 * @param {number} i Zero-based index at which to read from s
 * @returns {number}
 */
exports.ntohsStr = function(s, i) {
	return ((0xff & s.charCodeAt(i)) << 8) |
	       ((0xff & s.charCodeAt(i + 1)));
};


/**
 * Convert a 32-bit quantity (long integer) from host byte order to network byte order (Little-Endian to Big-Endian).
 *
 * @param {Array|Buffer} b Array of octets or a nodejs Buffer
 * @param {number} i Zero-based index at which to write into b
 * @param {number} v Value to convert
 */
exports.htonl = function(b, i, v) {
	b[i] = (0xff & (v >> 24));
	b[i + 1] = (0xff & (v >> 16));
	b[i + 2] = (0xff & (v >> 8));
	b[i + 3] = (0xff & (v));
};


/**
 * Convert a 32-bit quantity (long integer) from network byte order to host byte order (Big-Endian to Little-Endian).
 *
 * @param {Array|Buffer} b Array of octets or a nodejs Buffer to read value from
 * @param {number} i Zero-based index at which to read from b
 * @returns {number}
 */
exports.ntohl = function(b, i) {
	return ((0xff & b[i]) << 24) |
	       ((0xff & b[i + 1]) << 16) |
	       ((0xff & b[i + 2]) << 8) |
	       ((0xff & b[i + 3]));
};

exports.ntohlStr = function(s, i) {
	return ((0xff & s.charCodeAt(i)) << 24) |
	       ((0xff & s.charCodeAt(i + 1)) << 16) |
	       ((0xff & s.charCodeAt(i + 2)) << 8) |
	       ((0xff & s.charCodeAt(i + 3)));
};