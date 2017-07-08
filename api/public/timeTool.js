/**
 * Created by shenzhan on 2017/3/23.
 */

var timeTool={};

timeTool.getCurDate= function GetCurDate() {
    var a = new Date();
    return a;
};

timeTool.getDateString = function(date){

   var year = date.getFullYear();
   var mon = date.getMonth()+1;
   var day = date.getDate();

   var h = date.getHours();
   var m= date.getMinutes();

   return year +'-'+ (mon<10?('0'+mon):mon) +'-' + (day<10?('0'+day):day) +' '+ (h<10?('0'+h):h) +':' + (m<10?('0'+m):m);
};

module.exports = timeTool;
