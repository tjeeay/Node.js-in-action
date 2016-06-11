var qs = require('querystring');

/**
 * 发送 HTML 响应
 */
exports.sendHtml = function (res, html) {
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Length', Buffer.byteLength(html));
    res.end(html);
}

/**
 * 解析 HTTP POST 数据
 */
exports.parseReceivedData = function (req, cb) {
    var body = '';
    req.setEncoding('utf8');
    req.on('data', function (chunk) {
        body += chunk;
    });
    req.on('end', function () {
        var data = qs.parse(body);
        cb(data);
    });
}

/**
 * 渲染简单的表单
 */
exports.actionForm = function (id, path, label) {
    var html = '<form method="POST" action="' + path + '">'
        + '<input type="hidden" name="id" value="' + id + '" />'
        + '<input type="submit" value="' + label + '" />';
    return html;
}

exports.add = function (db, req, res) {
    exports.parseReceivedData(req, function (work) {
        db.query(
            "INSERT INTO work (hours, date, description)"
            + " VALUES(?, ?, ?)",
            [work.hours, work.date, work.description],
            function (err) {
                if (err) {
                    throw err;
                }
                exports.show(db, res);
            }
        )
    });
}

exports.archive = function (db, req, res) {
    exports.parseReceivedData(req, function(work){
        db.query(
            "UPDATE work SET archived=1 WHERE id=?",
            [work.id[0]],   // 正确写法应该是：[work.id]，由于一个 html 页面中只允许有一个 form 标签
            function(err){
                if (err) {
                    throw err;
                }
                exports.show(db, res);
            }
        )
    });
}

exports.delete = function (db, req, res) {
    exports.parseReceivedData(req, function(work){
        db.query(
            "DELETE work WHERE id=?",
            [work.id],
            function(err){
                if (err) {
                    throw err;
                }
                exports.show(db, res);
            }
        )
    });
}

exports.show = function (db, res, showArchived) {
    var query = "SELECT * FROM work"
        + " WHERE archived=?"
        + " ORDER BY date DESC"
    var archiveValue = (showArchived) ? 1 : 0;
    db.query(query, [archiveValue], function (err, rows) {
        if (err) {
            throw err;
        }
        var html = (showArchived)
            ? ''
            : '<a href="/archived">Archived Work</a><br />'
        html += exports.workHitlistHtml(rows);   // 将结果格式化为 HTML 表格
        html += exports.workFormHtml();
        exports.sendHtml(res, html);
    });
}

exports.showArchived = function (db, res) {
    exports.show(db, res, true);    // 只显示归档的工作记录
}

/**
 * 将工作记录渲染为 HTML 表格
 */
exports.workHitlistHtml = function (rows) {
    var html = '<table>';
    for (var i in rows) {
        html += '<tr>';
        html += '<td>' + rows[i].date + '</td>';
        html += '<td>' + rows[i].hours + '</td>';
        html += '<td>' + rows[i].description + '</td>';
        if (!rows[i].archived) {
            html += '<td>' + exports.workArchiveForm(rows[i].id) + '</td>';
        }
        html += '<td>' + exports.workDeleteForm(rows[i].id) + '</td>';
        html += '</tr>';
    }

    html += '</table>';
    return html;
}

/**
 * 添加工作记录的 HTML 表单
 */
exports.workFormHtml = function(){
    var html = '<form method="POST" action="/">'
                + '<p>Date (YYYY-MM-DD): <br/><input name="date" type="text" /></p>'
                + '<p>Hours worked: <br/><input name="hours" type="text" /></p>'
                + '<p>Description: <br/><textarea name="description"></textarea></p>'
                + '<input type="submit" value="Add" />'
             + '</form>';
    return html;
}

/**
 * 归档工作记录的 HTML 表单
 */
exports.workArchiveForm = function(id) {
    return exports.actionForm(id, '/archive', 'Archive');
}

/**
 * 删除工作记录的 HTML 表单
 */
exports.workDeleteForm = function(id) {
    return exports.actionForm(id, '/delete', 'Delete');
}