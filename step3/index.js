window.onload = function(){
    setInterval(oCan, 1000);//毫秒
}	 
function oCan(){
    var circleX = 200;
    var circleY = 200;
    var circleR = 150;
    var oPI = Math.PI/180;
    var oc = document.getElementById("myCanvas");
    var ogc = oc.getContext("2d");
    ogc.clearRect(0, 0, circleX, circleY);//清空画布
    ogc.beginPath();
    /*画分针刻度*/
			
    for(var i=0; i<60; i++){
	ogc.moveTo(circleX,circleY);
	ogc.arc(circleX,circleY,circleR,6*oPI*i,6*oPI*(i+1),false);
    }
    ogc.closePath();
    ogc.stroke();
    //画一个白色实心圆盖住其他的线，使其出来分针刻度线
    ogc.beginPath();
    ogc.fillStyle = "#fff";
    ogc.arc(circleX,circleY,circleR * 19 / 20,0,360*oPI,false);
    ogc.closePath();
    ogc.fill();
    //ogc.stroke();//为什么注释，会出现黑框
			
    /*画时针刻度*/
    ogc.beginPath();
    ogc.lineWidth = 3;
    for(var i=0; i<12; i++){
        ogc.moveTo(circleX,circleY);
        ogc.arc(circleX,circleY,circleR,30*oPI*i,30*oPI*(i+1),false);
    }
    ogc.closePath();
    ogc.stroke();
    //画一个白色实心圆盖住其他的线，使其出来时针刻度线
    ogc.beginPath();
    ogc.fillStyle = "#fff";
    ogc.arc(circleX,circleY,circleR*18/20,0,360*oPI,false);
    ogc.closePath();
    ogc.fill();
			
    /*求当前时间*/
    var oDate = new Date();
    var oHours = oDate.getHours();
    var oMin = oDate.getMinutes();
    var oSec = oDate.getSeconds();

    /*把时间转换成弧度*/
    var oHoursValues = (-90 + oHours * 30)*oPI;
    var oMinValues = (-90 + oMin * 6)*oPI;
    var oSecValues = (-90 + oSec * 6)*oPI;
    /*画时针*/
    ogc.beginPath();
    ogc.lineWidth=5;
    ogc.moveTo(circleX,circleY);
    ogc.arc(circleX,circleY,circleR*8/20,oHoursValues,oHoursValues,false);
    ogc.closePath();
    ogc.fill();
    ogc.stroke();
			
    /*画分针*/
    ogc.beginPath();
    ogc.lineWidth = 3;
    ogc.moveTo(circleX,circleY);
    ogc.arc(circleX,circleY,circleR*12/20,oMinValues,oMinValues,false);
    ogc.closePath();
    ogc.fill();
    ogc.stroke();
			
    /*画秒针*/
    ogc.beginPath();
    ogc.lineWidth = 1;
    ogc.moveTo(circleX,circleY);
    ogc.arc(circleX,circleY,circleR*15/20,oSecValues,oSecValues,false);
    ogc.closePath();
    ogc.fill();
    ogc.stroke();

    //画数字
    var deg = 2 * Math.PI / 12;//弧度=角度*Math.PI/180;
    ogc.save();
    ogc.beginPath();
    ogc.translate(circleX, circleY);
    for (var i = 1; i < 13; i++) {
        var x1 = Math.sin(i * deg);//正弦
        var y1 = -Math.cos(i * deg);//余弦
        ogc.fillStyle = "black";//字体颜色
        ogc.font = "noraml 30px Calibri";//字体
        ogc.textAlign = 'center';
        ogc.textBaseline = 'middle';
        ogc.fillText(i, x1 * (circleR*3/4), y1 * (circleR*3/4));//填充 125这个值越大 越显示在圆外面
    }
    ogc.closePath();
    ogc.restore();
}