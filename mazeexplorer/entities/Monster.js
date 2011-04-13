dojo.provide('mazeexplorer.entities.Monster');

dojo.require('mazeexplorer.entities.Entity');

dojo.declare('mazeexplorer.entities.Monster', [mazeexplorer.entities.Entity], {
    sound: '48709__Sea_Fury__Monster_5',
    baseVolume: 1,
    color: 'green',
    
    sounds: ['48688__Sea_Fury__Monster_4',
             '48709__Sea_Fury__Monster_5',
             '49127__aesqe__monster_growl_01'],
    
    hitPoints: 0,
    
    constructor: function (maze) {
        this.color = 'rgb(' + Math.floor(Math.random() * 255) + ',' +
                              Math.floor(Math.random() * 255) + ',' +
                              Math.floor(Math.random() * 255) + ')';
        this.hitPoints = 100;
    },
    
    update: function (maze) {
        // Stagger around randomly.
        var deltaX = Math.floor(Math.random() * 3) - 1,
            deltaY = Math.floor(Math.random() * 3) - 1,
            cur, dest;
        
        if (this.x + deltaX < 0 || this.x + deltaX >= maze.width ||
            this.y + deltaY < 0 || this.y + deltaY >= maze.height) {
            return;
        }
        
        cur  = maze.cells[this.x][this.y];
        dest = maze.cells[this.x + deltaX][this.y + deltaY];
        
        if (dest.x === this.x && dest.y === this.y ||
                /* Going "forward" along a path (towards exit) */
            cur.x === this.x + deltaX && cur.y === this.y + deltaY
                /* Going "backward" along a path (away from exit) */) {
            this.x += deltaX;
            this.y += deltaY;
        }
    },
    
    destroy: function (maze) {
        // called when the object is being removed from the maze
    }
});

mazeexplorer.entities.Monster.spawnFrequency = function (maze) {
    return 0.02;
};
