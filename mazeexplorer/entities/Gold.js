dojo.provide('mazeexplorer.entities.Gold');

dojo.require('mazeexplorer.entities.Entity');

dojo.declare('mazeexplorer.entities.Gold', [mazeexplorer.entities.Entity], {
    sound: '100hz_tone',
    baseVolume: 0,
    color: 'yellow',
    
    pointValue: 0,
    
    constructor: function (maze) {
        this.pointValue = Math.floor(Math.random() * 50) + 50;
    },
    
    update: function (maze) {
        if (maze.player.x === this.x && maze.player.y === this.y) {
            maze.player.score += this.pointValue;
            maze.destroyEntity(this);
        }
    },
    
    destroy: function (maze) {
        // called when the object is being removed from the maze
    }
});

mazeexplorer.entities.Gold.spawnFrequency = function (maze) {
    return 0.1;
};
