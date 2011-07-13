if(typeof brl === 'undefined') { brl = {}; }

(function(brl){
  if(typeof brl.test === 'undefined') { brl.test = {}; }
  
  // check dependencies
  if(typeof brl.util === 'undefined' || typeof brl.util.barrier === 'undefined') {  throw 'dependency brl.util.barrier not found';}
  if(typeof brl.log === 'undefined') {  throw 'dependency brl.log not found';}
  	  
  brl.test._Test = function(id, name, description, testFunction, testSet){
    this._name = name;
    this._description = description;
    this._id = id;
    this._function = testFunction;
    if(typeof testSet === 'undefined'){
    
    }
    this._testSet = testSet;
  };	  
  
  brl.test._Test.prototype = {
    equal : function(result, expected){
      if(result == expected){
        this._testSet.pass();
        return true;
      }
      return this._fail(result, expected);
    },
    
    compare : function(result, expected){
      if(result === expected){
        this._testSet.pass();
        return true;
      }
      return this._fail(result, expected);
    },
    
    isTrue : function(result){
      if(result === true){
        this._testSet.pass();
        return true;
      }
      return this._fail(result, true);
    },
    
    isFalse : function(result){
      if(result === false){
        this._testSet.pass();
        return true;
      }
      return this._fail(result, false);
    },
    
    failed : function(reason){
      console.log('ID: ' + this._id + ' FAILED: ' + reason);
      console.log('DESCRIPTION: ' + this._description);
      console.log('');
      this._testSet.fail();
      return false;
    },
    
    pass : function(){
      this._testSet.pass();
    },
    
    _fail : function(result, expected){
      console.log('ID: ' + this._id + ' FAILED: ' + expected + ' expected got ' + result);
      console.log('NAME: ' + this._name);
      console.log('DESCRIPTION: ' + this._description);
      console.log('');
      this._testSet.fail();
      return false;
    }
  };
  
  brl.test.TestSet = function(settings){
    this._passed = 0;
    this._failed = 0;
    this._notapplicable = 0;
    
    this._barrier = {};
    
    if(typeof settings === 'undefined') {
      settings = {};
    }
    
    if(typeof settings.description === 'undefined') {
      settings.description = '';
    }
    this._description = settings.description;
    
    if(typeof settings.name === 'undefined') {
      settings.name = '';
    }
    this._name = '';
    
    if(typeof settings.id === 'undefined') {
      settings.id = 0;
    }
    this._id = settings.id;
    
    this._timeLog = new brl.log.Time('Testset ' + this._id);
    
    this._tests = [];
    this._total = 0;
  };
  
  brl.test.TestSet.prototype = {
  
    fail : function(){
      this._failed += 1;
      this._barrier.commit();
    },
    
    pass : function(){
      this._passed += 1;
      this._barrier.commit();
    },
    
    notapplicable : function(){
      this._notapplicable += 1;
      this._barrier.commit();
    },
    
    stats : function(){
      console.log(this._passed + ' Tests PASSED');
      console.log(this._failed + ' Tests FAILED');
    },
    
    add : function(test){
      if(typeof test === 'undefined'){
        test = {};
      }
      if(typeof test.id === 'undefined'){
        test.id = this-_total;
      }
      if(typeof test.name === 'undefined'){
        test.name = '';
      }
      if(typeof test.description === 'undefined'){
        test.description = '';
      }
      if(typeof test.test === 'undefined'){
        throw 'no testFunction defined';
      }
      
      this._tests[test.id] = new brl.test._Test(test.id, test.name, test.description, test.test, this);
      this._total += 1;
      var that = this;
      this._barrier = new brl.util.barrier.Barrier(this._total,function(){
          var time = that._timeLog.end();
          console.log('---');
          that.stats();
          console.log('Executed in ' + time + ' ms');
        });
      },
    
    run : function(tests){
      if(tests === 'all'){
        console.log('Running Testset: ' + this._id + '  ' + this._name);
        console.log('Total Tests to run: ' + this._tests.length);
        console.log('Description: ' + this._description);
        console.log('');
        this._timeLog.start();
        for(var testId in this._tests){
          var test = this._tests[testId];
          test._function(test);
        }
      }
    }
    
  };
}(brl));
