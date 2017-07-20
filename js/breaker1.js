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

//定义方块数量
var blocks = [];
//var nowBlock=0;
//定义方块的随机图片
var randBlockNum;
//定义方块的宽高
var blockW, blockH;
//
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
	block = addImage("img/4.png");
	for(i = 0; i < 25; i++) {
		randBlockNum = Math.round(Math.random() * 5 + 4);
		blocks.push(addImage("img/" + randBlockNum + ".png"))
	}

	timer = setInterval(gameTick, 50 / 3);

	bg.onload = function() {
		context.drawImage(bg, 0, 0, canvasW, canvasH)

	}
}

//创建方块

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
	//	context.drawImage(block, 10, 80);
	blockW = block.width;
	blockH = block.height;

	for(var i = 0; i < blocks.length; i++) {
		upDateBlock(i);
	}
	//更新小球

	upDateBall();
	//监测小球和挡板的碰撞
	ballAndBoard();
}

function ballAndBlock() {

}

function upDateBlock(nowBlock) {

	var ball_center_top_x = ballX + ball.width * 0.5;
	var ball_center_top_y = ballY;
	if(blocks[nowBlock] != false) {
		var block_Left = 10 + (nowBlock % 5) * blockW;
		var block_top = 80 + Math.floor(nowBlock / 5) * blockH;
	}
	var block_right = block_Left + blockW;
	var block_bottom = block_top + blockH;
	if(ball_center_top_x >= block_Left && ball_center_top_x <= block_right && ball_center_top_y <= block_bottom && ball_center_top_y >= block_top) {
		blocks[nowBlock] = false;
		vy *= -1;
	} else {
		//10左边边距，80顶部边距
		if(blocks[nowBlock] != false) {
			context.drawImage(blocks[nowBlock], block_Left, block_top);
		}
	}
}

function ballAndBoard() {
	var ball_center_bottom_x = ballX + ball.width * 0.5;
	var ball_center_bottom_y = ballY + ball.height;
	if((ball_center_bottom_x >= boardX && ball_center_bottom_x <= boardX + board.width) && (ball_center_bottom_y >= boardY)) {
		ballY = boardY - 65;
		vy *= -1;
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
	//	//			}
	if(ballY < 80) {
		ballY = 80;
		vy *= -1;
	}
	context.drawImage(ball, ballX, ballY);

}