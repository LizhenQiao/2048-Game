var board = new Array();
var score = 0;
var hasconflict = new Array();

$(document).ready(function(){
	newgame();
});

function newgame(){
	//initialize board.
	init();
	//randomly initialize two numbers in two cells.
	generateOneNumber();
	generateOneNumber();
}

function init(){
	for(var i=0; i<4; i++)
		for(var j=0; j<4; j++){
			var cell = $("#cell-"+ i + "-" + j);
			cell.css("top", getPosTop(i, j));
			cell.css("left", getPosLeft(i, j));
		}
	for(var i=0; i<4; i++){
		board[i] = new Array();
		hasconflict[i] = new Array();

		for(var j=0; j<4; j++){
			board[i][j] = 0;
			hasconflict[i][j] = false;
		}
			
	}

	updateBoardView();

	score = 0;
}

function updateBoardView(){
	$(".number-cell").remove();
	for(var i=0; i<4; i++)
		for(var j=0; j<4; j++){
			$("#board").append('<div class="number-cell" id="number-cell-' + i + '-' + j + '"></div>');
			var theNumberCell = $("#number-cell-" + i + "-" + j);
		
			if(board[i][j] == 0){
				theNumberCell.css("width", "0px");
				theNumberCell.css("height", "0px");
				theNumberCell.css("top", getPosTop(i, j)+50);
				theNumberCell.css("left", getPosLeft(i, j)+50);
			}
			else{
				theNumberCell.css("width", "100px");
				theNumberCell.css("height", "100px");
				theNumberCell.css("top", getPosTop(i, j));
				theNumberCell.css("left", getPosLeft(i, j));
				theNumberCell.css("background-color", getNumberBackgroundColor(board[i][j]));
				theNumberCell.css("color", getNumberColor(board[i][j]));
				theNumberCell.text(board[i][j]);
			}

			hasconflict[i][j] = false;
		}

}


function generateOneNumber(){
	if (nospace(board))
		return false;

	//randomly choose a position
	var randx = parseInt(Math.floor((Math.random() * 4)));
	var randy = parseInt(Math.floor((Math.random() * 4)));

	while(true){
		if(board[randx][randy] == 0)
			break;
		var randx = parseInt(Math.floor((Math.random() * 4)));
		var randy = parseInt(Math.floor((Math.random() * 4)));
	}

	//randomly choose a number 2/4
	var randNumber = Math.random() < 0.5 ? 2 : 4;

	//show the number on board
	board[randx][randy] = randNumber;
	showNumberWithAnimation(randx, randy, randNumber);

	return true;
}


$(document).keydown(function(event){
	switch(event.keyCode){
		case 37: //left
			if (moveLeft()){
				setTimeout("generateOneNumber()", 210);
				setTimeout("isgameover()", 300);
			}
			break;
		case 38: //up
			if (moveUp()){
				setTimeout("generateOneNumber()", 210);
				setTimeout("isgameover()", 300);
			}
			break;
		case 39: //right
			if (moveRight()){
				setTimeout("generateOneNumber()", 210);
				setTimeout("isgameover()", 300);
			}
			break;
		case 40: //down
			if (moveDown()){
				setTimeout("generateOneNumber()", 210);
				setTimeout("isgameover()", 300);
			}
			break;
		default:
			break;
	}
});


function isgameover(){
	if (nospace(board) && nomoveavailable(board)){
		gameover();
	}
}

function gameover(){
	alert("game over!");
}


function moveLeft(){

	if (!canMoveLeft(board))
		return false;

	// Move left
	for(var i=0; i<4; i++)
		for(var j=1; j<4; j++){
			if (board[i][j] != 0){
				for(var k=0; k<j; k++){
					if(board[i][k]==0 && noBlockHorizontal(i, k, j, board)){
						//move
						showMoveAnimation(i, j, i, k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						break;
					}
					else if(board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board) && !hasconflict[i][k]){
						//move
						showMoveAnimation(i, j, i, k);
						//add
						board[i][k] += board[i][j];
						board[i][j] = 0;
						// add score
						score += board[i][k];
						updateScore(score);
						hasconflict[i][k] = true;
						break;
					}
				}
			}
		}

	updateBoardView();	
	return true;
}


function moveRight(){

	if (!canMoveRight(board))
		return false;

	// Move right
	for(var i=0; i<4; i++)
		for(var j=2; j>=0; j--){
			if (board[i][j] != 0){
				for(var k=3; k>j; k--){
					if(board[i][k]==0 && noBlockHorizontal(i, j, k, board)){
						//move
						showMoveAnimation(i, j, i, k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						break;
					}
					else if(board[i][k] == board[i][j] && noBlockHorizontal(i, j, k, board) && !hasconflict[i][k]){
						//move
						showMoveAnimation(i, j, i, k);
						//add
						board[i][k] += board[i][j];
						board[i][j] = 0;
						score += board[i][k];
						updateScore(score);
						hasconflict[i][k] = true;
						break;
					}
				}
			}
		}

	updateBoardView();	
	return true;
}


function moveUp(){

	if (!canMoveUp(board))
		return false;

	// Move up
	for(var j=0; j<4; j++)
		for(var i=1; i<4; i++){
			if (board[i][j] != 0){
				for(var k=0; k<i; k++){
					if(board[k][j]==0 && noBlockVertical(j, k, i, board)){
						//move
						showMoveAnimation(i, j, k, j);
						board[k][j] = board[i][j];
						board[i][j] = 0;
						break;
					}
					else if(board[k][j] == board[i][j] && noBlockVertical(j, k, i, board) && !hasconflict[i][k]){
						//move
						showMoveAnimation(i, j, k, j);
						//add
						board[k][j] += board[i][j];
						board[i][j] = 0;
						score += board[i][k];
						updateScore(score);
						hasconflict[i][k] = true;
						break;
					}
				}
			}
		}

	updateBoardView();	
	return true;
}


function moveDown(){

	if (!canMoveDown(board))
		return false;

	// Move down
	for(var j=0; j<4; j++)
		for(var i=2; i>=0; i--){
			if (board[i][j] != 0){
				for(var k=3; k>i; k--){
					if(board[k][j]==0 && noBlockVertical(j, i, k, board)){
						//move
						showMoveAnimation(i, j, k, j);
						board[k][j] = board[i][j];
						board[i][j] = 0;
						break;
					}
					else if(board[k][j] == board[i][j] && noBlockVertical(j, i, k, board) && !hasconflict[i][k]){
						//move
						showMoveAnimation(i, j, k, j);
						//add
						board[k][j] += board[i][j];
						board[i][j] = 0;
						score += board[i][k];
						updateScore(score);
						hasconflict[i][k] = true;
						break;
					}
				}
			}
		}

	updateBoardView();	
	return true;
}

function updateScore(score){
	$("#score").text(score);
}