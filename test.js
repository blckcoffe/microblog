//var test_cluster = require('./cluster_test.js'); 
//var data = 0;//这里定义数据不会被所有进程共享，各个进程有各自的内存区域 
//console.log("Test begin:::::::");

//test_cluster.start_cluster();

var addon = require('./build/Release/hello.node');
console.log("addon.hello()");
