/**
 * Created by shenzhan on 2017/3/23.
 */

var timeTool={};

timeTool.getCurDate= function GetCurDate() {
    var a = new Date(new Date().getTime() + 28800000)
    return a;
};

module.exports = timeTool;
