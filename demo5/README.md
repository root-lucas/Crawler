## 简单实现页面生成pdf

>目前仅支持无头模式生成paf

Usage:
```
npm install 
node makePDF.js
```
waitUntil <string|Array<string> 满足什么条件认为页面跳转完成，默认是 load 事件触发时。指定事件数组，那么所有事件触发后才认为是跳转完成。事件包括：
- load - 页面的load事件触发时
- domcontentloaded - 页面的 DOMContentLoaded 事件触发时
- networkidle0 - 不再有网络连接时触发（至少500毫秒后）
- networkidle2 - 只有2个网络连接时触发（至少500毫秒后）

