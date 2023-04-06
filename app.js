let Canvas;
let Context;
let GameBoardHeight = 20; 
let GameBoardWidth = 12;
let StartingX = 4;
let StartingY = 0; 
let Score = 0; 
let Level = 1; 
let WinOrLose = "Playing";

let CoordinateArray = [...Array(GameBoardHeight)].map(e => Array(GameBoardWidth).fill(0));

let CurrentTetromino = [[1,0], [0,1], [1,1], [2,1]];
let Tetrominos = [];
let TetrominoColors = ['fuchsia','aqua','crimson','goldenrod','deeppink','lawngreen','silver'];
let CurrentTetrominoColor;
let GameBoardArray = [...Array(20)].map(e => Array(12).fill(0));
let StoppedShapeArray = [...Array(20)].map(e => Array(12).fill(0));

let DirectionStruct = {
    Idle: 0,
    Down: 1,
    Left: 2,
    Right: 3
};
let Direction;
 
class Coordinate{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}
 
document.addEventListener('DOMContentLoaded', SetupGame); 
 
function CreateCoordinateArray(){
    let xR = 0, yR = 19;
    let i = 0, j = 0;
    for(let y = 9; y <= 446; y += 23){
        for(let x = 11; x <= 264; x += 23){
            CoordinateArray[i][j] = new Coordinate(x,y);
            i++;
        }
        j++;
        i = 0;
    }
}
 
function SetupGame(){
    Canvas = document.getElementById('canvas');
    Context = Canvas.getContext('2d');
    Canvas.width = 936;
    Canvas.height = 956;
    Context.scale(2, 2);
 
    Context.fillStyle = 'white';
    Context.fillRect(0, 0, Canvas.width, Canvas.height);
    Context.strokeStyle = 'black';
    Context.strokeRect(8, 8, 280, 462);
 
    TetrisLogo = new Image(161, 54);
    TetrisLogo.onload = DrawTetrisLogo;
    TetrisLogo.src = "tetrislogo.png";
 
    Context.fillStyle = 'black';
    Context.font = '21px Arial';
    Context.fillText("SCORE", 300, 98);
 
    Context.strokeRect(300, 107, 161, 24);
    Context.fillText(Score.toString(), 310, 127);
    Context.fillText("Level", 300, 157);

    Context.strokeRect(300, 171, 161, 24);
    Context.fillText(Level.toString(), 310, 190);
    Context.fillText("WIN / LOSE", 300, 221);
    Context.fillText(WinOrLose, 310, 261);

    Context.strokeRect(300, 232, 161, 95);
    Context.fillText("Controls", 300, 354);
    Context.strokeRect(300, 366, 161, 104);
 
    Context.font = '19px Arial';
    Context.fillText("A : Move Left", 310, 388);
    Context.fillText("D : Move Right", 310, 413);
    Context.fillText("S : Move Down", 310, 438);
    Context.fillText("E : Rotate Right", 310, 463);
 
    document.addEventListener('keydown', HandleKeyPress);

    CreateTetrominos();
    CreateTetromino();
    CreateCoordinateArray();
    DrawTetromino();
}
 
function DrawTetrisLogo(){
    Context.drawImage(TetrisLogo, 300, 8, 161, 54);
}
 
function DrawTetromino(){
    for(let i = 0; i < CurrentTetromino.length; i++){
        let x = CurrentTetromino[i][0] + StartingX;
        let y = CurrentTetromino[i][1] + StartingY;
 
        GameBoardArray[x][y] = 1;
  
        let CoordinateofX = CoordinateArray[x][y].x;
        let CoordinateofY = CoordinateArray[x][y].y;

        Context.fillStyle = CurrentTetrominoColor;
        Context.fillRect(CoordinateofX, CoordinateofY, 21, 21);
    }
}
 
function KeyPress(key){
    if(WinOrLose != "Game Over"){
    if(key.keyCode === 65){
        
        Direction = DirectionStruct.Left;
        if(!WallCollision() && !CheckForHorizontalCollision()){
            DeleteTetromino();
            StartingX--;
            DrawTetromino();
        } 
    } else if(key.keyCode === 68){
        Direction = DirectionStruct.Right;
        if(!WallCollision() && !CheckForHorizontalCollision()){
            DeleteTetromino();
            StartingX++;
            DrawTetromino();
        }
    } else if(key.keyCode === 83){
        MoveTetrominoDown();
    } else if(key.keyCode === 69){
        RotateTetromino();
    }
    } 
}
 
function MoveTetrominoDown(){
    Direction = DirectionStruct.Down;
    if(!CheckForVerticalCollison()){
        DeleteTetromino();
        StartingY++;
        DrawTetromino();
    }
}
 
window.setInterval(function(){
    if(WinOrLose != "Game Over"){
        MoveTetrominoDown();
    }
  }, 1000);
 
function DeleteTetromino(){
    for(let i = 0; i < CurrentTetromino.length; i++){
        let x = CurrentTetromino[i][0] + StartingX;
        let y = CurrentTetromino[i][1] + StartingY;
 
        GameBoardArray[x][y] = 0;

        let CoordinateofX = CoordinateArray[x][y].x;
        let CoordinateofY = CoordinateArray[x][y].y;
        ctx.fillStyle = 'white';
        ctx.fillRect(CoordinateofX, CoordinateofY, 21, 21);
    }
}
 
function CreateTetrominos(){
    // T 
    Tetrominos.push([[1,0], [0,1], [1,1], [2,1]]);
    // I
    Tetrominos.push([[0,0], [1,0], [2,0], [3,0]]);
    // J
    Tetrominos.push([[0,0], [0,1], [1,1], [2,1]]);
    // Square
    Tetrominos.push([[0,0], [1,0], [0,1], [1,1]]);
    // L
    Tetrominos.push([[2,0], [0,1], [1,1], [2,1]]);
    // S
    Tetrominos.push([[1,0], [2,0], [0,1], [1,1]]);
    // Z
    Tetrominos.push([[0,0], [1,0], [1,1], [2,1]]);
}
 
function CreateTetromino(){
    let RandomTetromino = Math.floor(Math.random() * Tetrominos.length);
    CurrentTetromino = Tetrominos[RandomTetromino];
    CurrentTetrominoColor = TetrominoColors[RandomTetromino];
}
 
function WallCollision(){
    for(let i = 0; i < CurrentTetromino.length; i++){
        let newX = CurrentTetromino[i][0] + StartingX;
        if(newX <= 0 && Direction === DirectionStruct.Left){
            return true;
        } else if(newX >= 11 && Direction === DirectionStruct.Right){
            return true;
        }  
    }
    return false;
}
 
function CheckForVerticalCollison(){
    let CopyOfTetromino = CurrentTetromino;
    let collision = false;
 
    for(let i = 0; i < CopyOfTetromino.length; i++){
        let square = CopyOfTetromino[i];
        let x = square[0] + StartingX;
        let y = square[1] + StartingY;
 
        if(Direction === DirectionStruct.Down){
            y++;
        }

        if(typeof StoppedShapeArray[x][y+1] === 'string'){
            DeleteTetromino();
            StartingY++;
            DrawTetromino();
            collision = true;
            break;
        }
        if(y >= 20){
            collision = true;
            break;
        }
    }
    if(collision){
        if(StartingY <= 2){
            WinOrLose = "Game Over";
            Context.fillStyle = 'white';
            Context.fillRect(310, 242, 140, 30);
            Context.fillStyle = 'black';
            Context.fillText(WinOrLose, 310, 261);
        } else {
             for(let i = 0; i < CopyOfTetromino.length; i++){
                let square = CopyOfTetromino[i];
                let x = square[0] + StartingX;
                let y = square[1] + StartingY;
                StoppedShapeArray[x][y] = CurrentTetrominoColor;
            }
            CheckForCompletedRows();
            CreateTetromino();

            Direction = DirectionStruct.Idle;
            StartingX = 4;
            StartingY = 0;
            DrawTetromino();
        }
    }
}
 
function CheckForHorizontalCollision(){
    var CopyOfTetromino = CurrentTetromino;
    var collision = false;
 
    for(var i = 0; i < CopyOfTetromino.length; i++)
    {
        var square = CopyOfTetromino[i];
        var x = square[0] + StartingX;
        var y = square[1] + StartingY;
 
        if (Direction == DirectionStruct.Left){
            x--;
        }else if (Direction == DirectionStruct.Right){
            x++;
        }
        var StoppedShapeValue = StoppedShapeArray[x][y];
        if (typeof StoppedShapeValue === 'string')
        {
            collision=true;
            break;
        }
    }
 
    return collision;
}
 
function CheckForCompletedRows(){
 
    let RowsToDelete = 0;
    let StartOfDeletion = 0;
 
    for (let y = 0; y < GameBoardHeight; y++)
    {
        let completed = true;
        for(let x = 0; x < GameBoardWidth; x++)
        {
            let square = StoppedShapeArray[x][y];
 
            if (square === 0 || (typeof square === 'undefined'))
            {
                completed=false;
                break;
            }
        }
 
        if (completed)
        {
            if(StartOfDeletion === 0) StartOfDeletion = y;
            RowsToDelete++;
 
            for(let i = 0; i < GameBoardWidth; i++)
            {
                StoppedShapeArray[i][y] = 0;
                GameBoardArray[i][y] = 0;
                let CoordinateOfX = CoordinateArray[i][y].x;
                let CoordinateOfY = CoordinateArray[i][y].y;
                ctx.fillStyle = 'white';
                ctx.fillRect(CoordinateOfX, CoordinateOfY, 21, 21);
            }
        }
    }
    if(RowsToDelete > 0){
        Score += 10;
        Context.fillStyle = 'white';
        Context.fillRect(310, 109, 140, 19);
        Context.fillStyle = 'black';
        Context.fillText(Score.toString(), 310, 127);
        MoveAllRowsDown(RowsToDelete, StartOfDeletion);
    }
}
 
function MoveAllRowsDown(RowsToDelete, StartOfDeletion){
    for (var i = StartOfDeletion-1; i >= 0; i--)
    {
        for(var x = 0; x < GameBoardWidth; x++)
        {
            var y2 = i + RowsToDelete;
            var square = StoppedShapeArray[x][i];
            var nextSquare = StoppedShapeArray[x][y2];
 
            if (typeof square === 'string')
            {
                nextSquare = square;
                GameBoardArray[x][y2] = 1; 
                StoppedShapeArray[x][y2] = square;
 
                let CoordinateOfX = CoordinateArray[x][y2].x;
                let CoordinateOfY = CoordinateArray[x][y2].y;
                Context.fillStyle = nextSquare;
                Context.fillRect(CoordinateOfX, CoordinateOfY, 21, 21);
 
                square = 0;
                GameBoardArray[x][i] = 0; 
                StoppedShapeArray[x][i] = 0; 
                CoordinateOfX = CoordinateArray[x][i].x;
                CoordinateOfY = CoordinateArray[x][i].y;
                Context.fillStyle = 'white';
                Context.fillRect(CoordinateOfX, CoordinateOfY, 21, 21);
            }
        }
    }
}
 
function RotateTetromino()
{
    let newRotation = new Array();
    let CopyOfTetromino = CurrentTetromino;
    let CurrentTetrominoBackUp;
 
    for(let i = 0; i < CopyOfTetromino.length; i++)
    {
        CurrentTetrominoBackUp = [...CurrentTetromino];
        let x = CopyOfTetromino[i][0];
        let y = CopyOfTetromino[i][1];
        let newX = (GetLastSquareX() - y);
        let newY = x;
        newRotation.push([newX, newY]);
    }
    DeleteTetromino();
 
    try{
        CurrentTetromino = newRotation;
        DrawTetromino();
    }  
    catch (e){ 
        if(e instanceof TypeError) {
            CurrentTetromino = CurrentTetrominoBU;
            DeleteTetromino();
            DrawTetromino();
        }
    }
}
 
function GetLastSquareX()
{
    let lastX = 0;
     for(let i = 0; i < CurrentTetromino.length; i++)
    {
        let square = CurrentTetromino[i];
        if (square[0] > lastX)
            lastX = square[0];
    }
    return lastX;
}