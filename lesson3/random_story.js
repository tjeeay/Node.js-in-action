var fs = require('fs');
var request = require('request');
var htmlparser = require('htmlparser');
var configFileName = './rss_feeds.txt';

/**
 * 任务1：确保包含RSS预订源URL列表的文件存在
 */
function checkForRSSFile() {
    fs.exists(configFileName, function (exists) {
        if (!exists) {
            return next(new Error('Missing RSS file: ' + configFileName));
        }
        next(null, configFileName);
    });
}

/**
 * 任务二：读取并解析包含预订源URL的文件
 */
function readRSSFile(configFileName) {
    fs.readFile(configFileName, function(err, data){
        if (err) {
            return next(err);
        }
        var feedList = data.toString()
                        .replace('/^\s+|\s+$/g', '')
                        .split('\n');
        // 从预订源 URL 数组中随机选择一个预订源 URL
        var random = Math.floor(Math.random() * feedList.length);
        next(null, feedList[random]);
    });
}

/**
 * 任务3：向选定的预订源发送HTTP请求以获取数据
 */
function downloadRSSFeed(feedUrl) {
    request({uri: feedUrl}, function(err, res, body){
        if (err) {
            return next(err);
        }
        if (res.statusCode != 200) {
            return next(new Error('Abnormal response status code'));
        }
        next(null, body);
    });
}

/**
 * 任务4：将预订源数据解析到一个条目数组中
 */
function parseRSSFeed(rss) {
    var handler = new htmlparser.RssHandler();
    var parser = new htmlparser.Parser(handler);
    parser.parseComplete(rss);
    if (!handler.dom.items.length) {
        return next(new Error('No RSS items found'));
    }
    var item = handler.dom.items.shift();
    console.log(item.title);
    console.log(item.link);
}

// 把所有要做的任务按执行顺序添加到一个数组中
var tasks = [
    checkForRSSFile,
    readRSSFile,
    downloadRSSFeed,
    parseRSSFeed
];

/**
 * 负责执行任务的 next 函数
 */
function next(err, result) {
    if (err) {
        throw err;
    }
    var currentTask = tasks.shift();
    if (currentTask) {
        currentTask(result);
    }
}

next(); // 开始任务的串行执行化