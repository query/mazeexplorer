dojo.provide('mazeexplorer.entities.Exit');

dojo.require('mazeexplorer.entities.Entity');

dojo.declare('mazeexplorer.entities.Exit', [mazeexplorer.entities.Entity], {
    sound: '23448__Percy_Duke__Door_Creak_Short',
    baseVolume: 10,
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
