const path = require('path');

/*自定义日期格式:2019-3-1-22-42*/
function formatDate() { 
    var now = new Date();
	var year=now.getFullYear(); 
	var month=now.getMonth()+1; 
	var date=now.getDate(); 
	var hour=now.getHours(); 
	var minute=now.getMinutes(); 
	var second=now.getSeconds(); 
	return year+"-"+month+"-"+date+"-"+hour+"-"+minute+"-"+""+second; 
}

module.exports = {
    savePic:path.resolve(__dirname,'../public'),
    formatDate:formatDate
}
