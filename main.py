import math

# Initialize the board
board = [' ' for _ in range(9)]

def print_board():
    for row in [board[i*3:(i+1)*3] for i in range(3)]:
        print('| ' + ' | '.join(row) + ' |')

def check_winner(b, p):
    win_states = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
    return any(all(b[i] == p for i in state) for state in win_states)

def minimax(b, depth, is_maximizing):
    if check_winner(b, 'O'): return 10 - depth
    if check_winner(b, 'X'): return depth - 10
    if ' ' not in b: return 0

    if is_maximizing:
        best = -math.inf
        for i in range(9):
            if b[i] == ' ':
                b[i] = 'O'
                best = max(best, minimax(b, depth + 1, False))
                b[i] = ' '
        return best
    else:
        best = math.inf
        for i in range(9):
            if b[i] == ' ':
                b[i] = 'X'
                best = min(best, minimax(b, depth + 1, True))
                b[i] = ' '
        return best

# Main Game Loop
print("Welcome to AI Tic-Tac-Toe! You are X, AI is O.")
while True:
    print_board()
    # Human Turn
    move = int(input("Enter move (0-8): "))
    if board[move] != ' ': continue
    board[move] = 'X'
    
    if check_winner(board, 'X') or ' ' not in board: break

    # AI Turn
    best_score = -math.inf
    best_move = 0
    for i in range(9):
        if board[i] == ' ':
            board[i] = 'O'
            score = minimax(board, 0, False)
            board[i] = ' '
            if score > best_score:
                best_score = score
                best_move = i
    board[best_move] = 'O'
    
    if check_winner(board, 'O') or ' ' not in board: break

print_board()
print("Game Over!")