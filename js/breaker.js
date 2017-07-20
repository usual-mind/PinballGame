//定义背景、小球、挡板
var bg, ball, board;
//定义画布的的宽高
var canvasW = 1024,
	canvasH = 768;
//定义定时器
var timer;
//定义画笔
var context;
//定义挡板初始位置
var boardX = 500,
	boardY = 650;
//定义小球初始X，Y
var ballX = Math.random() * 1000,
	ballY = 550;
//设置小球的左右加速度
var vx = 4,
	vy = -8;

//定义砖块数组
var bricks = [];

//定义固定砖块的个数
var brick_fixed_num = 0;
//挡板宽高  126 * 9
//小球宽高  60 * 60

//当页面加载完成之后
window.onload = init();

//鼠标监听
window.onmousemove = function(et) {

	boardX = et.offsetX - board.width * 0.5;
	if(boardX < 0) {
		boardX = 0;
	}
	if(boardX > canvasW - board.width) {
		boardX = canvasW - board.width;
	}

}

//初始化
function init() {
	//	console.log('页面加载完成！')
	var canvas = document.getElementById("gameCanvas");
	context = canvas.getContext("2d");

	//画图片
	// img图片对象  x，y坐标  w，h设置宽高，无则：默认图片自身宽高
	//	context.drawImage(img, x, y, w, h);
	//	bg = new Image();
	//	bg.src = "img/bg2.png";
	//	因为Image（）有自身的方法需要执行，所以Image有可能没有加载完，就执行了drawImage（），导致图片没有画出来，
	//  所以，加上onload(),等待Image()加载完成后，再执行drawImage()
	//	bg.onload = function(){
	//		context.drawImage(bg,0,0,canvasW,canvasH);
	//	}

	bg = addImage("img/bg2.png");
	board = addImage("img/board.png");
	ball = addImage("img/ball.png");

	//初始化砖块
	createBricks();

	timer = setInterval(gameTick, 50 / 3);

	//	bg.onload = function() {
	//		context.drawImage(bg, 0, 0, canvasW, canvasH)
	//	}
}

//创建图片对象
function addImage(objSrc) {
	var img = new Image();
	img.src = objSrc;
	return img;
}

//游戏监听
function gameTick() {
	context.clearRect(0, 0, canvasW, canvasH);
	// 上面  bg.onload()在此方法中，不必执行，因为用了定时器，会不停刷新画图，总有Image()加载完成的时候，刷新画出图片
	context.drawImage(bg, 0, 0, canvasW, canvasH);
	context.drawImage(board, boardX, boardY);

	//更新砖块
	upDateBrick();
	//监测小球和砖块的碰撞
	ballAndBrick()
	//更新小球
	upDateBall();
//监测小球和挡板的碰撞
	ballAndBoard();
	//小球和挡板的碰撞，
	//	boardX-60<=ballX<=board+126;
	//	boardY-60<=ballY<=board+9
	//小球和砖块的碰撞
	//	brick.x-60 <= ballX <=brick.x+198
	//	brick.y-60 <= ballY <=brick.y+50
	
	
	
}

function ballAndBoard() {
	var hit = hits(ballX,ballY,boardX,boardY,126,9);
	if (hit){
		ballY = boardY-65;
		vy *= -1;
	}
}
function ballAndBrick(){
	for(var i = 0; i < bricks.length; i++) {
		var brick = bricks[i];
		var hit = hits(ballX,ballY,brick.x,brick.y,198,50);
		if (hit){
			if (brick.type == 1){
				//从下标为i开始，数组中移除n个
				bricks.splice(i,1);
			} else{
				ballY = brick.y+65;
			}
			vy *= -1;
		}
		if (bricks.length - brick_fixed_num == 0){
			clearInterval(timer);
			window.location.reload();
		}
	}
}

//边缘的碰撞 x1,y1代表小球的坐标；x2,y2代表碰撞物体的坐标,碰撞物体的宽高
function hits(x1, y1, x2, y2, w, h) {
	if(x1 >= (x2 - 60) && x1 <= (x2 + w) && y1 >= (y2 - 60) && y1 <= (y2 + h)) {
		return true;
	} else {
		return false;
	}
}

function createBricks() {
	//i表示列
	for(var i = 0; i < 5; i++) {
		//j表示行
		for(var j = 0; j < 4; j++) {
			var brick = new Brick(i, j);
			bricks.push(brick);
		}
	}
}

function Brick(i, j) {
	var numpic = Math.round(Math.random() * 5 + 4)
	var img = addImage("img/" + numpic + ".png");
	//砖块的图片对象	
	if (img.src.charAt(img.src.length - 5) == '9'){
		this.type = 3;
		brick_fixed_num += 1;
	} else {
		this.type = 1;
	}
	this.img = img;
	this.x = 10 + 200 * i;
	this.y = 80 + 55 * j;
}

function upDateBrick() {
	for(var i = 0; i < bricks.length; i++) {
		var brick = bricks[i];
		context.drawImage(brick.img, brick.x, brick.y, 198, 50);
//		var hit = hits(ballX,ballY,brick.x,brick.y,198,50);
//		if (hit == true){
//			bricks.splice(i,1);
//			vy *= -1;
//		}
	}

}


//更新小球方法
function upDateBall() {
	ballX += vx;
	ballY += vy;

	if(ballX > canvasW - ball.width) {
		ballX = canvasW - ball.width;
		vx *= -1;
	}
	if(ballX < 0) {
		ballX = 0;
		vx *= -1;
	}
	//			if(ballY > boardY) {
	//				ballY = boardY;
	//				vy *= -1;
	//			}
	if(ballY < 80) {
		ballY = 80;
		vy *= -1;
	}
	context.drawImage(ball, ballX, ballY);

	if (ballY > 720){
		clearInterval(timer);
		window.location.reload();
	}
}