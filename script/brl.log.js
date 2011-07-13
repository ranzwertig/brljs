if(typeof brl === 'undefined') { brl = {}; }

(function(brl){
  if(typeof brl.log === 'undefined') { brl.log = {}; }
  
  brl.log.Time = function(label){
    this._label = label;
    this._start = 0;
    this._diff = 0;
  };
  brl.log.Time.prototype = {
    start : function(){
      this._start = (new Date()).getTime();
    },
    end : function(){
      this._diff = (new Date()).getTime() - this._start;
      return this._diff;
    },
    logEnd : function(){
      this._diff = (new Date()).getTime() - this._start;
      console.log('Execution of ' + this._label + ' took: ' + this._diff + ' ms');
    }
  };
}(brl));