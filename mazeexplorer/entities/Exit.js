dojo.provide('mazeexplorer.entities.Exit');

dojo.require('mazeexplorer.entities.Entity');

dojo.declare('mazeexplorer.entities.Exit', [mazeexplorer.entities.Entity], {
    sound: 'exit',
    baseVolume: Infinity,
    color: 'black',
    
    update: function (maze) {
        if (maze.player.x === this.x && maze.player.y === this.y) {
            maze.newLevel();
        }
    }
});

mazeexplorer.entities.Exit.spawnFrequency = function (maze) {
    return 0.01;
};
