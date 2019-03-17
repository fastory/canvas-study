//1. 初始化数据
var canvas = document.getElementById('canvas');
var clear = document.getElementById('clear');
var ctx = canvas.getContext('2d');
var lineWidth = 3;
var radius = 1;
var eraserEnabled = false;

var pointRecord={};
//更改默认属性
lineWidth = 6;
radius = 3;
setTimeout(function(){
    ctx.strokeStyle = "red"
    ctx.fillStyle = "red"
},0)

autoSetCanvasSize(canvas);

/*监听用户*/
ListenToUser(canvas);
/*******/

clear.onclick = function(){
    ctx.clearRect(0,0,canvas.width, canvas.height);
}

/* 画圆点 */
function drawCircle(x, y, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}
/* 画轨迹（线条） */
function drawLine(x1, y1, x2, y2) {
    // 解决IOS中获取不到ctx设置的问题
    if (ctx.lineWidth === 1) {
      ctx.lineWidth = 2
      ctx.radius = 1
    }
    ctx.lineCap="round";
    ctx.lineWidth = lineWidth;
    ctx.radius = radius;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }


function ListenToUser(canvas) {

    var using = false;
    var lastPoint = {
        x: undefined,
        y: undefined
    };
    var startPoint={
        x: undefined,
        y: undefined
    };
    
//特性检测
    if (document.body.ontouchstart !== undefined) {
        //触屏设备
        canvas.ontouchstart = function (msg) {
            var x = msg.touches[0].clientX
            var y = msg.touches[0].clientY
            using = true;
            if (eraserEnabled) {
                ctx.clearRect(x - 5, y - 5, 10, 10)
            } else {
                lastPoint = {
                    x: x,
                    y: y
                }
            }
        }
        canvas.ontouchmove = function (msg) {
            e.preventDefault();
            var x = msg.touches[0].clientX
            var y = msg.touches[0].clientY
            var newPoint = {x: x,y: y}
            if (!using) {
                return
            }

            if (eraserEnabled) {
                ctx.clearRect(x - 8, y - 8, 16, 16)
            } else {
                drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y);
                lastPoint = newPoint;
            }
        }
        canvas.ontouchend = function (msg) {
            using = false
        }
    } else {
        //非触屏设备
        canvas.onmousedown = function (msg) {
            var x = msg.clientX
            var y = msg.clientY
            using = true;
            if (eraserEnabled) {
                ctx.clearRect(x - 5, y - 5, 10, 10)
            } else {
                lastPoint = {x: x,y: y};
                console.log("mousedown",lastPoint);
                startPoint=lastPoint;
                pointRecondPush(x,y);
                drawCircle(x, y, ctx.radius);
            }
        }
        canvas.onmousemove = function (msg) {
            var x = msg.clientX
            var y = msg.clientY
            var newPoint = {x: x,y: y}
            if (!using) {
                return
            }
            if (eraserEnabled) {
                ctx.clearRect(x - 5, y - 5, 10, 10)
            } else {
                drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y);
                pointRecondPush(x,y,lastPoint.x, lastPoint.y);
                lastPoint = newPoint;
            }
        }
        canvas.onmouseup = function (msg) {
            console.log("onmouseup",lastPoint);
            if(Math.abs(startPoint.x-lastPoint.x)<10&&Math.abs(startPoint.y-lastPoint.y)<10){
                console.log("我是个圆")
                heartFill();
            }
            using = false
        }
    }
}

// 记录下所有的pointRecond,以x坐标为key值，y坐标minY和maxY
function pointRecondPush(x,y,prevX,prevY){
    console.log("x--"+x+"y--"+y);
    let aArr=Object.keys(pointRecord);
    y=parseInt(y);
    if(pointRecord[x]){
        if(pointRecord[x].minY>=y){
            pointRecord[x].minY=y;
        }
        if(pointRecord[x].maxY<y){
            pointRecord[x].maxY=y;
        }
    }else{
      pointRecord[x]={};
      pointRecord[x].minY=y;
      pointRecord[x].maxY=y;
    }
    //从上一个x到这次的x进行遍历把所有经历的x坐标与对应当前的y值存入到坐标对象当中去
    let maxX=x,minX=prevX;
    if(prevX>x){
        maxX=prevX;
        minX=x;
    }
    for (let i = minX; i < maxX; i++) {
        if(!pointRecord[i]){
            pointRecord[i]={};
            pointRecord[i].minY=y;
            pointRecord[i].maxY=y;
        }else{
            if(pointRecord[i].minY>=y){
                pointRecord[i].minY=y;
            }
            if(pointRecord[i].maxY<y){
                pointRecord[i].maxY=y;
            }
        }
    }
}
// 如果是圆的话给绘制的图形染色
function heartFill(){
    let aArr=Object.keys(pointRecord);
    var tmpMinY,tmpMaxY;
    for (let i = aArr[0]; i < aArr[aArr.length-1]; i++) {
            ctx.beginPath();
            if(pointRecord[i]){
                ctx.moveTo(i, pointRecord[i].minY);
                ctx.lineTo(i, pointRecord[i].maxY);
                tmpMinY=pointRecord[i].minY;
                tmpMaxY=pointRecord[i].maxY;
            }else{
                ctx.moveTo(i, tmpMinY);
                ctx.lineTo(i, tmpMaxY);
            }
            ctx.stroke();
            
    }
    // for(var pointX in pointRecord){
    //         ctx.beginPath();
    //         ctx.moveTo(pointX, pointRecord[pointX].minY);
    //         ctx.lineTo(pointX, pointRecord[pointX].maxY);
    //         ctx.stroke();
    // }
}
/****/
/* 自动调整画布宽高 */
function autoSetCanvasSize(canvas) {
    setCanvasSize();
    window.onresize = function () {
        setCanvasSize();
    }
 //设置画布宽高
    function setCanvasSize() {
        var pageWidth = document.documentElement.clientWidth;
        var pageHeight = document.documentElement.clientHeight;

        canvas.width = pageWidth;
        canvas.height = pageHeight;
    }
}