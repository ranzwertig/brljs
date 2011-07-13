if(typeof brl === 'undefined') { brl = {}; }

(function(brl){
  if(typeof brl.util === 'undefined') { brl.util = {}; }
  if(typeof brl.util.barrier === 'undefined') { brl.util.barrier = {}; }
  
  brl.util.barrier.Barrier = function(watchNum, callback){
    this.count = 0;
    this.total = watchNum;
    
    this.commit = function(){
      if (++this.count === this.total){
        callback();
      }
    };
  };
}(brl));