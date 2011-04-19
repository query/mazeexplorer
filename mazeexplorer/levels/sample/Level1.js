dojo.provide('mazeexplorer.levels.sample.Level1');

dojo.require('mazeexplorer.levels.Level');
dojo.require('mazeexplorer.entities.City');
dojo.require('mazeexplorer.entities.Jungle');
dojo.require('mazeexplorer.entities.Waterfall');

dojo.declare('mazeexplorer.levels.sample.Level1', [mazeexplorer.levels.Level], {
    constructor: function (maze) {
        // called upon entering the level -- fill grid, spawn
        // entities, etc.
        var width = 5, height = 5, entity;
        
        // Fill the maze area with paths.
        maze.origin = {x: 0, y: 0};
        this.fill(maze, width, height, maze.origin.x, maze.origin.y);
        
        // Place player inside the maze.
        maze.player.x = maze.origin.x;
        maze.player.y = maze.origin.y;
        
        // TODO: Point the player in a walkable direction.
        
        // Place entities inside the maze.
        maze.entities = [];
        
        entity = new mazeexplorer.entities.City(maze);
        entity.x = width - 1;
        entity.y = 0;
        maze.entities.push(entity);
        
        entity = new mazeexplorer.entities.Jungle(maze);
        entity.x = 0;
        entity.y = height - 1;
        maze.entities.push(entity);
        
        entity = new mazeexplorer.entities.Waterfall(maze);
        entity.x = width - 1;
        entity.y = height - 1;
        maze.entities.push(entity);
    },
    
    introduction: function (maze) {
        maze.audio.say({text: 'Find the waterfall in front of the entrance ' +
                              'to the cave.  The waterfall sounds like this.'});
        maze.audio.play({url: 'audio/generated/14779__ignotus__Waterfall-edit-0'});
        return maze.audio.say({text: 'Use the up and down arrow keys to ' +
                                     'move forward and backward, and use ' +
                                     'the left and right arrow keys to ' +
                                     'change direction.  Listen carefully ' +
                                     'to find the exit.  If you get lost, ' +
                                     'press the Escape key to hear about ' +
                                     'your surroundings.'});
    },
    
    onComplete: function (maze) {
        // called when the player finishes the level
        maze.newLevel();
    }
});
