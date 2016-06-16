var assert = require('assert');
var Todo = require('../lib/todo');

var todo = new Todo();
var testsCompleted = 0;

function addTest() {
    todo.add('Delete Me');
    assert.equal(todo.getCount(), 1, '1 item should exist.');
    testsCompleted++;
}

function deleteTest() {
    todo.deleteAll();
    assert.equal(todo.getCount(), 0, 'No items should exist.');
    testsCompleted++;
}

function doAsyncTest(cb) {
    todo.doAsync(function(value){
        assert.ok(value, 'Callback should be passed true.');
    });
    testsCompleted++;
    cb();
}

function throwsTest() {
    assert.throws(todo.add, /requires/);
    testsCompleted++;
}


// 运行测试
addTest();
deleteTest();
throwsTest();
doAsyncTest(function () {
    console.log('Completed ' + testsCompleted + ' tests');
});