dojo.provide('mazeexplorer.entities.Entity');

dojo.declare('mazeexplorer.entities.Entity', null, {
    sound: 'filename_prefix',
    baseVolume: 0,
    color: 'green',
    
    x: 0, y: 0,
    
    constructor: function (maze) {
        // called upon "spawning" the object on the grid
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
