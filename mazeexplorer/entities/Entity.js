dojo.provide('mazeexplorer.entities.Entity');

dojo.declare('mazeexplorer.entities.Entity', null, {
    sound: 'filename_prefix', // or
    sounds: null /* array for random selection */,
    
    baseVolume: 0,
    color: 'green',
    
    // used internally by Maze class
    x: 0, y: 0,
    realVolume: 0,
    direction: 0,
    
    constructor: function (maze) {
        // called upon "spawning" the object on the grid
        if (this.sounds) {
            this.sound = this.sounds[Math.floor(Math.random() * this.sounds.length)];
        }
    },
    
    update: function (maze) {
        // called when the player has taken a turn
    },
    
    destroy: function (maze) {
        // called when the object is being removed from the maze
    }
});

mazeexplorer.entities.Entity.spawnFrequency = function (maze) {
    // determines the spawn frequency of the object
    return 0;
};
