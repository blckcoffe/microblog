var cluster = require('cluster'); 
var data = 0;//这里定义数据不会被所有进程共享，各个进程有各自的内存区域 
console.log("==================================");
console.log("Test cluster begin before function");
var start_cluster = function(){
		console.log("Test cluster begin in function");
		if (cluster.isMaster) { //主进程 
    			var numCPUs = require('os').cpus().length; 
    			for (var i = 0; i < numCPUs; i++) { 
        			var worker = cluster.fork(); 
    			}    
    		data++; 
    		console.log('DATA VALUE in MainProcess: %d ', data);
	}else{ //子进程,会被调用numCPUs次 
    		data++; 
    		console.log('DATA VALUE in ChildProcess %d: %d', cluster.worker.id, data);
	}
};

console.log("Test cluster end");

module.exports.start_cluster = start_cluster;
