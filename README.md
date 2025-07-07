# Moving Tic Tac Toe
This is a game of Three Men's Morris, which I will refer to as Moving Tic Tac Toe.
This client-side game website was built using JavaScript, React, and Vite.

# How to Play
The first phase of the game is the *placement* phase.
It is highly similar to regular Tic Tac Toe.
X places a token, O places a token, so on, until X and O have placed 3 tokens each.

After that, the *movement* phase begins.
X selects one of their tokens, and moves it orthogonally, by selecting a reachable target square.
You can always move to the center, and from the center you can make to any other square.
You can not ever move to a square that is already occupied by a token.
O does the same, and it keeps going back and forth.

The first to get 3 in a row wins!

# Code Structure
The code starts at /index.html
/index.html then uses /src/main.jsx
/src/main.jsx uses /src/App.jsx and /src/index.css
/src/App.jsx uses /src/App.css
