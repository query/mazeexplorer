dojo.provide('mazeexplorer.entities.Monster');

dojo.require('mazeexplorer.entities.Entity');
dojo.require('mazeexplorer.entities.Exit');

dojo.declare('mazeexplorer.entities.Monster', [mazeexplorer.entities.Entity], {
    sound: '48709__Sea_Fury__Monster_5',
    baseVolume: 1,
    name: 'a monster',
    color: 'red',
    
    sounds: ['48688__Sea_Fury__Monster_4',
             '48709__Sea_Fury__Monster_5',
             '49127__aesqe__monster_growl_01'],
    
    hasKey: false,
    
    _checkForPlayerEncounter: function (maze) {
        if (maze.player.x === this.x && maze.player.y === this.y) {
            maze.destroyEntity(this);
            return true;
        }
        
        return false;
    },
    
    update: function (maze) {
        var playerEncountered = this._checkForPlayerEncounter(maze),
            // Stagger around randomly.
            deltaX = Math.floor(Math.random() * 3) - 1,
            deltaY = Math.floor(Math.random() * 3) - 1,
            cur, dest;
        
        if (playerEncountered) {
            return;
        }
        
        if (this.x + deltaX < 0 || this.x + deltaX >= maze.currentLevel.width ||
            this.y + deltaY < 0 || this.y + deltaY >= maze.currentLevel.height) {
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
        
        this._checkForPlayerEncounter(maze);
    },
    
    destroy: function (maze) {
        var entity;
        
        maze.audio.stop({channel: 'announce'});
        maze.audio.play({channel: 'announce',
                         url: 'audio/generated/43586__Syna_Max__punches_and_slaps-single-0'});

        if (!maze.player.hasKey) {
            if (this.hasKey) {
                maze.audio.say({channel: 'announce',
                                text: 'This monster had the treasure!  Now ' +
                                      'find the exit.'});
                maze.player.hasKey = true;
                
                // Insert an exit into the maze.
                entity = new mazeexplorer.entities.Exit(maze);
                entity.x = Math.floor(Math.random() * maze.cells.length);
                entity.y = Math.floor(Math.random() * maze.cells[0].length);
                maze.entities.push(entity);
            } else {
                maze.audio.say({channel: 'announce',
                                text: "Looks like this monster doesn't " +
                                      'have the treasure.  Try again!'});
            }
        }
    }
});
