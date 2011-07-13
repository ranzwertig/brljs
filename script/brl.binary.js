/**
 * Library to load and parse binary data from a file.
 * It is able to handle following binary number types;
 * - 8  Bit Int little/big endian signed and unsigned
 * - 16 Bit Int little/big endian signed and unsigned
 * - 32 Bit Int little/big endian signed and unsigned
 *
 * @namespace: brl.binary
 * @author: Christian Ranz <info@christianranz.com>
 * @version: 0.1
 * @licence: MIT 
 */

if(typeof brl === 'undefined') { brl = {}; }

(function(brl){
  if(typeof brl.binary === 'undefined') { brl.binary = {}; }
  
  brl.binary.BinaryReader = function(data){
    if(typeof data === 'undefined'){
      data = '';
    }
    this._data = data;
    this._offset = 0;
  };
  
  brl.binary.BinaryReader.prototype = {
    
    loadFile : function(url){
      // thanks to https://developer.mozilla.org/En/Using_XMLHttpRequest#Receiving_binary_data
      var req = new XMLHttpRequest();
      req.open('GET', url, false);
      req.overrideMimeType('text/plain; charset=x-user-defined');
      req.send(null);
      if (req.status != 200) return '';
      this._data = req.responseText;
      return this;
    },
    
    // read signed Int 8 Bit big endian
    readInt8Be : function(offset){
      if(typeof offset === 'undefined'){
        offset = this._offset;
        this._offset += 1;
      }
      var value = this._data.charCodeAt(offset) & 0xFF;
      return value > 0x7F ? ((value - 1) ^ 0xFF ) * -1 : value;
    },
    
    // read signed Int 8 Bit little endian
    readInt8Le : function(offset){
      if(typeof offset === 'undefined'){
        offset = this._offset;
        this._offset += 1;
      }
      var value = this._data.charCodeAt(offset) & 0xFF;
  	  return value > 0x7F ? ((value - 1) ^ 0xFF ) * -1 : value;
    },
    
    // read signed Int 16 Bit big endian
    readInt16Be  : function(offset){
      if(typeof offset === 'undefined'){
        offset = this._offset;
        this._offset += 2;
      }
      var value = ((this._data.charCodeAt(offset) & 0xFF) << 8) +
        (this._data.charCodeAt(offset+1) & 0xFF);
  	  return value > 0x7FFF ? ((value - 1) ^ 0xFFFF ) * -1 : value;
    },
    
    // read signed Int 16 Bit little endian
    readInt16Le  : function(offset){
      if(typeof offset === 'undefined'){
        offset = this._offset;
        this._offset += 2;
      }
      var value = ((this._data.charCodeAt(offset+1) & 0xFF) << 8) +
        (this._data.charCodeAt(offset) & 0xFF);
  	  return value > 0x7FFF ? ((value - 1) ^ 0xFFFF ) * -1 : value;
    },
    
    // read signed Int 32 Bit big endian
    readInt32Be  : function(offset){
      if(typeof offset === 'undefined'){
        offset = this._offset;
        this._offset += 4;
      }

      var value = ((this._data.charCodeAt(offset) & 0xFF) << 24) +
        ((this._data.charCodeAt(offset+1) & 0xFF) << 16) +
        ((this._data.charCodeAt(offset+2) & 0xFF) << 8) +
        (this._data.charCodeAt(offset+3) & 0xFF);
      return value > 0x7FFFFFFF ? ((value - 1) ^ 0xFFFFFFFF ) * -1 : value;
    },
    
    // read signed Int 32 Bit little endian
    readInt32Le  : function(offset){
      if(typeof offset === 'undefined'){
        offset = this._offset;
        this._offset += 4;
      }
      var value = ((this._data.charCodeAt(offset+3) & 0xFF) << 24) +
        ((this._data.charCodeAt(offset+2) & 0xFF) << 16) +
        ((this._data.charCodeAt(offset+1) & 0xFF) << 8) +
        (this._data.charCodeAt(offset) & 0xFF);
  	  return value > 0x7FFFFFFF ? ((value - 1) ^ 0xFFFFFFFF ) * -1 : value;
    },
    
    // read unsigned Int 8 Bit big endian
    readUInt8Be : function(offset){  
      if(typeof offset === 'undefined'){
        offset = this._offset;
        this._offset += 1;
      }
      return this._data.charCodeAt(offset) & 0xFF;
    },
    // read unsigned Int 8 Bit little endian
    readUInt8Le : function(offset){  
      if(typeof offset === 'undefined'){
        offset = this._offset;
        this._offset += 1;
      }
      return this._data.charCodeAt(offset) & 0xFF;
    },
    
    // read unsigned Int 16 Bit big endian
    readUInt16Be : function(offset){
      if(typeof offset === 'undefined'){
        offset = this._offset;
        this._offset += 2;
      } 
      return ((this._data.charCodeAt(offset) & 0xFF) << 8) +
        (this._data.charCodeAt(offset+1) & 0xFF);
    },
    
    // read unsigned Int 16 Bit little endian
    readUInt16Le : function(offset){
      if(typeof offset === 'undefined'){
        offset = this._offset;
        this._offset += 2;
      } 
      return ((this._data.charCodeAt(offset+1) & 0xFF) << 8) +
        (this._data.charCodeAt(offset) & 0xFF);
    },
    
    // read unsigned Int 32 Bit big endian
    readUInt32Be : function(offset){ 
      if(typeof offset === 'undefined'){
        offset = this._offset;
        this._offset += 4;
      } 
      return (((this._data.charCodeAt(offset) & 0xFF) << 24) +
        ((this._data.charCodeAt(offset+1) & 0xFF) << 16) +
        ((this._data.charCodeAt(offset+2) & 0xFF) << 8) +
        (this._data.charCodeAt(offset+3) & 0xFF)) >>> 0;
    },
    
    // read unsigned Int 32 Bit little endian
    readUInt32Le : function(offset){ 
      if(typeof offset === 'undefined'){
        offset = this._offset;
        this._offset += 4;
      } 
      return (((this._data.charCodeAt(offset+3) & 0xFF) << 24) +
        ((this._data.charCodeAt(offset+2) & 0xFF) << 16) +
        ((this._data.charCodeAt(offset+1) & 0xFF) << 8) +
        (this._data.charCodeAt(offset) & 0xFF)) >>> 0;
    },
    
    // read a 8 Bit char
    readChar:	function (offset) { return this.readString(1, offset); },
    
    // read a String of length: length, Bytes
    readString: function (length, offset) {
  	 if(typeof offset === 'undefined'){
         offset = this._offset;
         this._offset += length;
       } 
  	 if(!this._checkSize(length, offset)) { return false; };
  	 var result = this._data.substr(offset, length);
  	 return result;
    },
    
    // get the current reader offset
    currentOffset : function(){ return this._offset; },
    
    // get the data size
    size : function(){ return this._data.length; },
  	
  	// check if there a neededBytes left to read
    _checkSize: function (neededBytes, offset) {
      if(typeof offset === 'undefined'){
        offset = this._offset;
        this._offset += length;
      }
      if (!(offset + neededBytes < this._data.length)) {
  		  return false;
      }
  	 return true;
    }
  };
}(brl));