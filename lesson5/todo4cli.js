var fs = require('fs');
var path = require('path');

var args = process.argv.slice(2);
var command = args.shift() || '';
var taskDescription = args.join(' ');

var file = path.join(process.cwd(), './tasks');

switch (command.toLowerCase()) {
    case 'list':
        listTasks(file);
        break;
    case 'add':
        addTask(file, taskDescription);
        break;
    default:
        console.log('Useage: ' + process.argv[0] + ' list|add [taskDescription]');
        break;
}

function loadOrInitializeTaskArray(file, cb) {
    fs.exists(file, function (exists) {
        if (exists) {
            fs.readFile(file, function (err, data) {
                data = data.toString();
                var tasks = JSON.parse(data || '[]');
                cb(tasks);
            });
        } else {
            cb([]);
        }
    });
}

function storeTasks(file, tasks){
    fs.writeFile(file, JSON.stringify(tasks), function(err){
        if (err) {
            throw err;
        }
        console.log('Saved.');
    });
}

function listTasks(file) {
    loadOrInitializeTaskArray(file, function (tasks) {
        for (var i in tasks) {
            console.log(tasks[i]);
        }
    });
}

function addTask(file, taskDescription) {
    loadOrInitializeTaskArray(file, function(tasks){
        tasks.push(taskDescription);
        storeTasks(file, tasks);
    });
}

