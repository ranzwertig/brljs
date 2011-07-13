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
    
    readInt8Be : function(offset){
      if(typeof offset === 'undefined'){
        offset = this._offset;
        this._offset += 1;
      }
      var value = this._data.charCodeAt(offset) & 0xFF;
  	return value > 0x7F ? ((value - 1) ^ 0xFF ) * -1 : value;
    },
    
    readInt8Le : function(offset){
      if(typeof offset === 'undefined'){
        offset = this._offset;
        this._offset += 1;
      }
      var value = this._data.charCodeAt(offset) & 0xFF;
  	  return value > 0x7F ? ((value - 1) ^ 0xFF ) * -1 : value;
    },
    
    readInt16Be  : function(offset){
      if(typeof offset === 'undefined'){
        offset = this._offset;
        this._offset += 2;
      }
      var value = ((this._data.charCodeAt(offset) & 0xFF) << 8) +
        (this._data.charCodeAt(offset+1) & 0xFF);
  	  return value > 0x7FFF ? ((value - 1) ^ 0xFFFF ) * -1 : value;
    },
    
    readInt16Le  : function(offset){
      if(typeof offset === 'undefined'){
        offset = this._offset;
        this._offset += 2;
      }
      var value = ((this._data.charCodeAt(offset+1) & 0xFF) << 8) +
        (this._data.charCodeAt(offset) & 0xFF);
  	  return value > 0x7FFF ? ((value - 1) ^ 0xFFFF ) * -1 : value;
    },
    
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
    
    readUInt8Be : function(offset){  
      if(typeof offset === 'undefined'){
        offset = this._offset;
        this._offset += 1;
      }
      return this._data.charCodeAt(offset) & 0xFF;
    },
    readUInt8Le : function(offset){  
      if(typeof offset === 'undefined'){
        offset = this._offset;
        this._offset += 1;
      }
      return this._data.charCodeAt(offset) & 0xFF;
    },
    
    readUInt16Be : function(offset){
      if(typeof offset === 'undefined'){
        offset = this._offset;
        this._offset += 2;
      } 
      return ((this._data.charCodeAt(offset) & 0xFF) << 8) +
        (this._data.charCodeAt(offset+1) & 0xFF);
    },
    
    readUInt16Le : function(offset){
      if(typeof offset === 'undefined'){
        offset = this._offset;
        this._offset += 2;
      } 
      return ((this._data.charCodeAt(offset+1) & 0xFF) << 8) +
        (this._data.charCodeAt(offset) & 0xFF);
    },
    
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
    
    readChar:	function (offset) { return this.readString(1, offset); },
    
    readString: function (length, offset) {
  	 if(typeof offset === 'undefined'){
         offset = this._offset;
         this._offset += length;
       } 
  	 if(!this._checkSize(length, offset)) { return false; };
  	 var result = this._data.substr(offset, length);
  	 return result;
    },
    
    currentOffset : function(){ return this._offset; },
    
    size : function(){ return this._data.length; },
  	
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