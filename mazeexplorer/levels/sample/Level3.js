dojo.provide('mazeexplorer.levels.sample.Level3');

dojo.require('mazeexplorer.levels.Level');
dojo.require('mazeexplorer.entities.Gold');
dojo.require('mazeexplorer.entities.Monster');

dojo.declare('mazeexplorer.levels.sample.Level3', [mazeexplorer.levels.Level], {
    constructor: function (maze) {
        // called upon entering the level -- fill grid, spawn
        // entities, etc.
        var width = 10, height = 10, i, entity;
        
        // Fill the maze area with paths.
        maze.origin = {x: Math.floor(Math.random() * width),
                       y: Math.floor(Math.random() * height)};
        this.fill(maze, width, height, maze.origin.x, maze.origin.y);
        
        // Place player inside the maze.
        maze.player.x = maze.origin.x;
        maze.player.y = maze.origin.y;
        
        // TODO: Point the player in a walkable direction.
        
        // Place entities inside the maze.
        maze.entities = [];
        
        for (i = 0; i < 5; i++) {
            entity = new mazeexplorer.entities.Monster(maze);
            entity.x = Math.floor(Math.random() * width);
            entity.y = Math.floor(Math.random() * height);
            maze.entities.push(entity);
        }
        
        // Give one of the monsters the key.
        entity.hasKey = true;
        
        for (i = 0; i < 10; i++) {
            entity = new mazeexplorer.entities.Gold(maze);
            entity.x = Math.floor(Math.random() * width);
            entity.y = Math.floor(Math.random() * height);
            maze.entities.push(entity);
        }
    },
    
    introduction: function (maze) {
        return maze.audio.say({text: 'Level 3.'});
    },
    
    onComplete: function (maze) {
        // called when the player finishes the level
        maze.newLevel();
    }
});
