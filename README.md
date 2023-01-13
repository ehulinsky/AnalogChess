 # Analog Chess
 
 __Holy Hell!__
 
 This is a version of chess where the pieces are not constrained to an 8x8 grid, and instead can move to any position on the board.
 After clicking on a piece, the areas it may move to are highlighted in green, and areas the enemy can move to are highlighted in red. Drag the piece to move it, and to confirm a move, either click on the piece again or press enter. To cancel a move, press escape or click anywhere off the piece.
 
<img src="https://raw.githubusercontent.com/ehulinsky/AnalogChess/main/images/Screenshot%20(152).png" width="400"/>
 
 There is no check or checkmate in this game. __To win, you simply need to capture the opponent's king__. This is mainly because stalemate is basically impossible, as the king can always move an infintesimal amount, and also because implementing check/checkmate would destroy the last ounce of sanity I have left.
 
 ## Pieces
 
 Each piece's moves are based on it's moves in regular chess, but in Analog Chess, pieces may move to any position along their trajectory.

__Pawn:__ May move 0-2 squares on it's first move, 0-1 otherwise. Can only attack diagonally. Sadly en passant (the funny move) is not implemented yet because I have no idea how it would work.

  <img src="https://raw.githubusercontent.com/ehulinsky/AnalogChess/main/images/Screenshot%20(143).png" width="200"/>
  
__Bishop:__ Moves any distance diagonally

  <img src="https://raw.githubusercontent.com/ehulinsky/AnalogChess/main/images/Screenshot%20(154).png" width="200"/>
  
__Knight:__ Moves in a circle of radius sqrt(5), which is the distance it travels in it's usual L move.

  <img src="https://raw.githubusercontent.com/ehulinsky/AnalogChess/main/images/Screenshot%20(145).png" width="200"/>
  
__Rook:__ Moves any distance orthogonally

 <img src="https://raw.githubusercontent.com/ehulinsky/AnalogChess/main/images/Screenshot%20(146).png" width="200"/>
 
__Queen:__ Moves any distance orthogonally or vertically.

 <img src="https://raw.githubusercontent.com/ehulinsky/AnalogChess/main/images/Screenshot%20(147).png" width="200"/>
 
__King:__ Moves 0-1 squares orthogonally or 0-sqrt(2) squares diagonally. It is allowed to move into check because this game was way too complicated to code already. You lose if your king dies.

 <img src="https://raw.githubusercontent.com/ehulinsky/AnalogChess/main/images/Screenshot%20(148).png" width="200"/>
 
  The king may castle with the rooks, and it is allowed to castle out of, into, or through check.
  
  <img src="https://raw.githubusercontent.com/ehulinsky/AnalogChess/main/images/Screenshot%20(153).png" width="400"/>
 
 
 ## Capturing
 Capturing in this game is a little bit goofy. Basically, if your piece overlaps the opponent's piece it is captured, and you cannot move past the first piece you overlap. 
 
 __Example__
 
   <img src="https://raw.githubusercontent.com/ehulinsky/AnalogChess/main/images/Screenshot%20(155).png" width="400"/>      <img src="https://raw.githubusercontent.com/ehulinsky/AnalogChess/main/images/Screenshot%20(156).png" width="400"/>


 One interesting side effect of this is that you can capture multiple pieces at once. :)
 
 <img src="https://raw.githubusercontent.com/ehulinsky/AnalogChess/main/images/Screenshot%20(157).png" width="400"/>


 
 
 ## Code
 To run the code you will need to install Python and the PyGame library, and then run the latest .py file because I can't be bothered to actually use version control.
 
 __Warning: This code is fucking awful.__
 
Do not expect the code to be stable under any modifications, but you can try if you want I guess. Also there are barely any comments sorry. I am in Electrical Engineering and I like writing shitty code to piss off my Computer Science friends.
