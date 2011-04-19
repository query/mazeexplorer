dojo.provide('mazeexplorer.levels.Level');

dojo.declare('mazeexplorer.levels.Level', null, {
    constructor: function (maze) {
        // called upon entering the level -- fill grid, spawn
        // entities, etc.
    },
    
    _getUnvisitedNeighbor: function (maze, coordinate) {
        var i, cardinalDirections = [{x:  1, y:  0}, {x: -1, y:  0},
                                     {x:  0, y:  1}, {x:  0, y: -1}],
            x = coordinate.x, y = coordinate.y, newX, newY;
        
        (function shuffle(list) {
            // Implements Durstenfeld's version of the Fisher-Yates shuffle.
            var i, j, t;
            for (i = list.length - 1; i > 0; i--) {
                j = Math.floor(Math.random() * (1 + i));  // choose j in [0..i]
                if (j !== i) {
                    // Swap list[i] and list[j].
                    t = list[i];
                    list[i] = list[j];
                    list[j] = t;
                }
            }
        }(cardinalDirections));
        
        for (i = 0; i < cardinalDirections.length; i++) {
            newX = x + cardinalDirections[i].x;
            newY = y + cardinalDirections[i].y;
            if ((newX >= 0) && (newX < this.width) &&
                    (newY >= 0) && (newY < this.height) &&
                    (!maze.cells[newX][newY])) {
                return {x: newX, y: newY};
            }
        }
        
        return null;
    },
    
    fill: function (maze, width, height, initialX, initialY) {
        var path = [{x: initialX, y: initialY}], origin, neighbor, i;
        
        this.width = width;
        this.height = height;
        
        // Allocate the two-dimensional cell array.
        maze.cells = [];
        for (i = 0; i < this.width; i++) {
            maze.cells[i] = [];
        }
        
        maze.cells[initialX][initialY] = -1;
        
        do {
            origin = path[path.length - 1];
            neighbor = this._getUnvisitedNeighbor(maze, origin);
            
            if (neighbor) {
                maze.cells[neighbor.x][neighbor.y] = origin;
                path.push(neighbor);
            } else {
                path.pop();
            }
        } while (path.length > 0);
    },
    
    onComplete: function (maze) {
        // called when the player finishes the level
        maze.newLevel();
    }
});
