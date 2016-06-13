# Node.js-in-action
《Node.js 实战》动手练习

## 第1章 欢迎进入 Node.js 世界

* 本章内容 
  * Node.js是什么 
  * 服务端JavaScript 
  * Node的异步和事件触发本质 
  * Node为谁而生 
  * Node程序示例


## 第2章 构建有多个房间的聊天室程序

* 本章内容 
  * 认识各种Node组件 
  * 一个用Node做的实时程序 
  * 服务器跟客户端交互 
  
  
## 第3章 Node 编程基础

* 本章内容
  * 用模块组织代码
  * 编码规范
  * 用回调处理一次性完结的事件
  * 用事件发射器处理重复性事件
  * 实现串行和并行的流程控制
  * 使用流程控制工具
  
## 第4章 构建 Node Web 程序

* 本章内容
  * 用Node的API处理HTTP请求
  * 构建一个RESTful Web服务
  * 提供静态文件服务
  * 接受用户在表单中输入的数据
  * 用HTTPS加强程序的安全性
  
## 第5章 存储 Node 程序中的数据

* 本章内容
  * 内存和文件系统数据存储
  * 传统的关系型数据库存储
  * 非关系型数据库存储

## 第6章 Connect

* 本章内容
  * 搭建一个Connect程序
  * Connect中间件的工作机制
  * 为什么中间件的顺序很重要
  * 挂载中间件和服务器
  * 创建可配置的中间件
  * 使用错误处理中间件

## 第7章 Connect 自带的中间件

* 本章内容
  * 解析cookie、请求主体和查询字符串的中间件
  * 实现Web程序核心功能的中间件
  * 处理Web程序安全的中间件
  * 提供静态文件服务的中间件

* 自带中间件汇总
  * `cookieParser()` 为后续中间件提供 `req.cookies` 和 `req.signedCookies`
  * `bodyParser()` 为后续中间件提供 `req.body` 和 `req.files`
  * `limit()` 基于给定字节长度限制请求主体的大小。必须用在bodyParser中间件之前
  * `query()` 为后续中间件提供 `req.query`
  * `logger()` 将HTTP请求的信息输出到 stdout 或日志文件之类的流中
  * `favicon()` 响应 /favicon.ico HTTP 请求。通常放在中间件 `logger` 前面，这样它就不会出现在你的日志文件中了
  * `methodOverride()` 可以替不能使用正确请求方法的浏览器仿造 `req.method`，依赖于 `bodyParser`
  * `vhost()` 根据指定的主机名（比如nodejs.org）使用给定的中间件和/或HTTP服务器实例
  * `session()` 为用户设置一个HTTP会话，并提供一个可以跨越请求的持久化 `req.session` 对象。依赖于 `cookieParser`
  * `basicAuth()` 为程序提供HTTP基本认证
  * `csrf()` 防止HTTP表单中的跨站请求伪造攻击，依赖于 `session`
  * `errorHandler()` 当出现错误时把堆栈跟踪信息返回给客户端。在开发时很实用，不过不要用在生产环境中
  * `static()` 把指定目录中的文件发给HTTP客户端。跟Connect的挂载功能配合得很好
  * `compress()` 用gzip压缩优化HTTP响应
  * `directory()` 为HTTP客户端提供目录清单服务，基于客户端的Accept请求头（普通文本， JSON或HTML）提供经过优化的结果
