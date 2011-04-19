dojo.provide('mazeexplorer.Maze');

dojo.require('mazeexplorer.Player');
dojo.require('mazeexplorer.levels.sample.Level1');
//dojo.require('mazeexplorer.levels.sample.Level2');
dojo.require('mazeexplorer.levels.sample.Level3');

dojo.declare('mazeexplorer.Maze', null, {
    levelClasses: [mazeexplorer.levels.sample.Level1,
//                   mazeexplorer.levels.sample.Level2,
                   mazeexplorer.levels.sample.Level3],
    levelIndex: 0,
    currentLevel: null,
    
    cells: null,
    entities: null,
    origin: null,
    
    audioChannels: 5,
    
    constructor: function (args) {
        this.player = new mazeexplorer.Player();
        this.entities = [];
        
        if (args && args.audio) {
            this._onAudioReady(args.audio);
        } else {
            uow.getAudio({defaultCaching: true}).then(dojo.hitch(this, this._onAudioReady));
        }
    },
    
    _onAudioReady: function (audio) {
        this.audio = audio;
        this.newLevel();
    },
    
    newLevel: function () {
        this.currentLevel = new this.levelClasses[this.levelIndex](this);
        this.levelIndex++;
        
        if (this.currentLevel.introduction) {
            this.audio.setProperty({name: 'volume', value: 1});
            this.currentLevel.introduction(this).callAfter(dojo.hitch(this, this.updateSounds));
        } else {
            this.updateSounds();
        }
    },
    
    renderBirdsEyeToCanvas: function (canvas, cellWidth, borderWidth) {
        var ctx = canvas.getContext('2d'),
            width = this.currentLevel.width,
            height = this.currentLevel.height,
            x, y, cell, path;
        
        canvas.width  = width  * (cellWidth + borderWidth) + borderWidth;
        canvas.height = height * (cellWidth + borderWidth) + borderWidth;
        
        // Background fill.
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw initial grid.
        ctx.fillStyle = 'black';
        for (x = 0; x <= width; x++) {
            ctx.fillRect(x * (cellWidth + borderWidth), 0,
                         borderWidth, canvas.height);
        }
        
        for (y = 0; y <= height; y++) {
            ctx.fillRect(0, y * (cellWidth + borderWidth),
                         canvas.width, borderWidth);
        }
        
        // Punch holes in maze walls for paths.
        ctx.fillStyle = 'white';
        for (x = 0; x < width; x++) {
            for (y = 0; y < height; y++) {
                if (this.cells[x][y].x < x) {         // remove left wall
                    ctx.fillRect(x * (cellWidth + borderWidth),
                                 y * (cellWidth + borderWidth) + borderWidth,
                                 borderWidth, cellWidth);
                } else if (this.cells[x][y].x > x) {  // remove right wall
                    ctx.fillRect((x + 1) * (cellWidth + borderWidth),
                                  y *      (cellWidth + borderWidth) + borderWidth,
                                 borderWidth, cellWidth);
                } else if (this.cells[x][y].y < y) {  // remove top wall
                    ctx.fillRect(x * (cellWidth + borderWidth) + borderWidth,
                                 y * (cellWidth + borderWidth),
                                 cellWidth, borderWidth);
                } else if (this.cells[x][y].y > y) {  // remove bottom wall
                    ctx.fillRect( x *      (cellWidth + borderWidth) + borderWidth,
                                 (y + 1) * (cellWidth + borderWidth),
                                 cellWidth, borderWidth);
                }
            }
        }
        
        // Draw entities.
        for (x = 0; x < this.entities.length; x++) {
            ctx.fillStyle = this.entities[x].color;
            ctx.fillRect(this.entities[x].x * (cellWidth + borderWidth) + borderWidth + cellWidth / 4,
                         this.entities[x].y * (cellWidth + borderWidth) + borderWidth + cellWidth / 4,
                         cellWidth / 2, cellWidth / 2);
            
            // Draw the path between the entity and the player.
            path = this.getPathFromEntityToPlayer(this.entities[x]);
            
            ctx.strokeStyle = this.entities[x].color;
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.1;
            ctx.beginPath();
            ctx.moveTo(path[0].x * (cellWidth + borderWidth) + borderWidth + cellWidth / 2,
                       path[0].y * (cellWidth + borderWidth) + borderWidth + cellWidth / 2);
            
            for (y = 1; y < path.length; y++) {
                ctx.lineTo(path[y].x * (cellWidth + borderWidth) + borderWidth + cellWidth / 2,
                           path[y].y * (cellWidth + borderWidth) + borderWidth + cellWidth / 2);
            }
            
            ctx.stroke();
            ctx.globalAlpha = 1;
        }
        
        // Draw player.
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.moveTo(this.player.x * (cellWidth + borderWidth) + borderWidth + cellWidth / 2,
                   this.player.y * (cellWidth + borderWidth) + borderWidth + cellWidth / 2);
        
        if (this.player.heading.x > 0) {
            x = Math.PI / 4;
        } else if (this.player.heading.y > 0) {
            x = 3 * Math.PI / 4;
        } else if (this.player.heading.x < 0) {
            x = 5 * Math.PI / 4;
        } else {
            x = 7 * Math.PI / 4;
        }
        
        ctx.arc(this.player.x * (cellWidth + borderWidth) + borderWidth + cellWidth / 2,
                this.player.y * (cellWidth + borderWidth) + borderWidth + cellWidth / 2,
                cellWidth * 3 / 8, x, x + 3 * Math.PI / 2);
        ctx.closePath();
        ctx.fill();
    },
    
    renderRadarToCanvas: function (canvas, radius, cellWidth, borderWidth) {
        var ctx = canvas.getContext('2d'), width = 2 * radius + 1,
            x, path, playerAngle, pathAngle, heading;
        
        canvas.width = canvas.height = width * (cellWidth + borderWidth) + borderWidth;
        
        // Background fill.
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw distance circles.
        ctx.strokeStyle = 'skyblue';
        ctx.lineWidth = borderWidth;
        for (x = 0; x <= radius; x++) {
            ctx.beginPath();
            ctx.arc(canvas.width / 2, canvas.height / 2,
                    x * (cellWidth + borderWidth) + (cellWidth + borderWidth) / 2,
                    0, 2 * Math.PI);
            ctx.closePath();
            ctx.stroke();
        }
        
        // Draw entities.
        for (x = 0; x < this.entities.length; x++) {
            // Angle values:
            // -4, 0, 4...: right
            // -3, 1, 5...: down
            // -2, 2, 6...: left
            // -1, 3, 7...: up
            
            if (this.player.heading.x > 0) {
                playerAngle = 0;
            } else if (this.player.heading.y > 0) {
                playerAngle = 1;
            } else if (this.player.heading.x < 0) {
                playerAngle = 2;
            } else {
                playerAngle = 3;
            }
            
            path = this.getPathFromEntityToPlayer(this.entities[x]);
            
            if (path.length > 1) {
                if (path[path.length - 2].x > this.player.x) {
                    pathAngle = 0;
                } else if (path[path.length - 2].y > this.player.y) {
                    pathAngle = 1;
                } else if (path[path.length - 2].x < this.player.x) {
                    pathAngle = 2;
                } else {
                    pathAngle = 3;
                }
            } else {
                pathAngle = 0;
            }
            
            switch ((playerAngle - pathAngle) % 4) {
                         case 0: heading = {x:  0, y: -1}; break;
                case -3: case 1: heading = {x: -1, y:  0}; break;
                case -2: case 2: heading = {x:  0, y:  1}; break;
                case -1: case 3: heading = {x:  1, y:  0}; break;
            }
            
            ctx.fillStyle = this.entities[x].color;
            ctx.fillRect(canvas.width  / 2 + heading.x * (path.length - 1) * (cellWidth + borderWidth) - cellWidth / 4,
                         canvas.height / 2 + heading.y * (path.length - 1) * (cellWidth + borderWidth) - cellWidth / 4,
                         cellWidth / 2, cellWidth / 2);
        }
        
        // Draw player.
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.arc(canvas.width / 2, canvas.height / 2,
                cellWidth * 3 / 8, - Math.PI / 4, 5 * Math.PI / 4);
        ctx.closePath();
        ctx.fill();
    },
    
    // Attempt to move the player in the direction specified by deltaX
    // and deltaY, stopping for walls.
    movePlayer: function (deltaX, deltaY) {
        if (this.player.x + deltaX < 0 ||
            this.player.x + deltaX >= this.currentLevel.width ||
            this.player.y + deltaY < 0 ||
            this.player.y + deltaY >= this.currentLevel.height) {
            return;
        }
        
        var cur  = this.cells[this.player.x][this.player.y],
            dest = this.cells[this.player.x + deltaX][this.player.y + deltaY];
        
        if (dest.x === this.player.x && dest.y === this.player.y ||
                /* Going "forward" along a path (towards exit) */
            cur.x === this.player.x + deltaX && cur.y === this.player.y + deltaY
                /* Going "backward" along a path (away from exit) */) {
            this.player.x += deltaX;
            this.player.y += deltaY;
            
            // The player's taken a turn, so call entities' update methods.
            for (x = 0; x < this.entities.length; x++) {
                this.entities[x].update(this);
            }
            
            this.updateSounds();
        }
    },
    
    updateSounds: function () {
        var playerAngle, pathAngle, realVolume, x;
        
        this.audio.stop();
        
        // Determine distance and angle of each entity, and use those
        // values to calculate the apparent volume and direction of
        // their sounds.
        for (x = 0; x < this.entities.length; x++) {
            this.entities[x].direction = this.getEntityDirection(this.entities[x]);
            this.entities[x].realVolume = this.entities[x].baseVolume / Math.pow(path.length / 3.16, 2);
            
            if (this.entities[x].direction === 2) {
                this.entities[x].realVolume *= 0.2;
            }
        }
        
        // Sort the array of entities by apparent volume.
        this.entities.sort(function (a, b) {
            return b.realVolume - a.realVolume;  // b - a, loudest first
        });
        
        // Play sounds from the loudest entities.
        dojo.hitch(this, (function loopSounds() {
            var d;
            
            for (x = 0; x < Math.min(this.entities.length, this.audioChannels); x++) {
                realVolume = Math.max(0.05, Math.min(this.entities[x].realVolume, 1));
                this.audio.setProperty({name: 'volume',
                                        value: realVolume});
                d = this.audio.play({url: 'audio/generated/' +
                                          this.entities[x].sound + '-' +
                                          this.entities[x].direction});
            }
            
            // Make sure d is set; it will be undefined if there are no
            // entities to generate sounds for.
            if (d) {
                d.callAfter(dojo.hitch(this, loopSounds));
            }
        }))();
    },
    
    getPathFromEntityToPlayer: function (entity) {
        // First, get the full backtracking paths of both entity
        // and player.  Then, start comparing the paths from the end
        // of each path (the entrance), and stop when they diverge.
        // Finally, reverse one of the paths and join them together
        // at the last common cell.
        //
        // Return an array of path coordinates starting at the entity
        // and ending at the player, inclusive.
        
        var cell, x, y, entityPath = [], playerPath = [];
        
        x = entity.x;
        y = entity.y;
        
        while (this.cells[x][y] !== -1) {
            entityPath.push({x: x, y: y});
            cell = this.cells[x][y];
            x = cell.x;
            y = cell.y;
        }
        
        // Add the origin.
        entityPath.push({x: this.origin.x, y: this.origin.y});
        
        x = this.player.x;
        y = this.player.y;
        
        while (this.cells[x][y] !== -1) {
            playerPath.unshift({x: x, y: y});
            cell = this.cells[x][y];
            x = cell.x;
            y = cell.y;
        }
        
        // Add the origin.
        playerPath.unshift({x: this.origin.x, y: this.origin.y});
        
        // Loop until divergence.
        y = Math.min(playerPath.length, entityPath.length);
        cell = null;
        
        // We skip x = 0 in this loop, because it's the maze origin in
        // both arrays, and start with x = 1.
        for (x = 1; x < y; x++) {
            if (playerPath[x].x !== entityPath[entityPath.length - (x + 1)].x ||
                playerPath[x].y !== entityPath[entityPath.length - (x + 1)].y) {
                // Set "cell" to the last common point.
                cell = {x: playerPath[x - 1].x, y: playerPath[x - 1].y};
                break;
            }
        }
        
        if (cell) {
            // Neither path is a subset of the other.  Take the unique
            // portion of the entity path, add the common cell, and then
            // finish off with the reverse of the unique part of the
            // player path.
            return entityPath.slice(0, -(x - 1)).concat(cell, playerPath.slice(x));
        } else {
            // One path is a subset of the other.  Return the difference
            // of the longer path and the shorter path.
            x = entityPath.length - playerPath.length;
            
            if (x < 0) {
                // Entity path shorter than player path.
                return playerPath.slice(entityPath.length - 1);
            } else if (x > 0) {
                // Player path shorter than entity path.
                return entityPath.slice(0, x + 1);
            } else {
                // Entity and player on same cell.
                return [{x: entity.x, y: entity.y}];
            }
        }
    },
    
    getEntityDirection: function (entity) {
        // Angle values:
        // -4, 0, 4...: right
        // -3, 1, 5...: down
        // -2, 2, 6...: left
        // -1, 3, 7...: up
        
        if (this.player.heading.x > 0) {
            playerAngle = 0;
        } else if (this.player.heading.y > 0) {
            playerAngle = 1;
        } else if (this.player.heading.x < 0) {
            playerAngle = 2;
        } else {
            playerAngle = 3;
        }
        
        path = this.getPathFromEntityToPlayer(entity);
        
        if (path.length > 1) {
            if (path[path.length - 2].x > this.player.x) {
                pathAngle = 0;
            } else if (path[path.length - 2].y > this.player.y) {
                pathAngle = 1;
            } else if (path[path.length - 2].x < this.player.x) {
                pathAngle = 2;
            } else {
                pathAngle = 3;
            }
        } else {
            pathAngle = playerAngle;
        }
        
        // Relative direction:
        // 0: forward
        // 1: left
        // 2: behind
        // 3: right
        return ((playerAngle - pathAngle) + 4) % 4;
    },
    
    describeEntities: function () {
        var x, xMax, distance, text = '';
        
        xMax = Math.min(this.entities.length, this.audioChannels);
        
        for (x = 0; x < xMax; x++) {
            if (x !== 0) {
                text += ', ';
                
                if (x === xMax - 1) {
                    text += 'and ';
                }
            }
            
            text += (this.entities[x].name || 'something') + ' ';
            distance = this.getPathFromEntityToPlayer(this.entities[x]).length - 1;
            text += distance + (distance === 1 ? ' step ' : ' steps ');
            
            switch (this.getEntityDirection(this.entities[x])) {
                case 0:     text += 'ahead';        break;
                case 1:     text += 'to my left';   break;
                case 2:     text += 'behind me';    break;
                case 3:     text += 'to my right';  break;
                default:    text += 'away';
            }
        }
        
        if (!text) {
            text = 'nothing.';
        }
        
        text = 'I hear ' + text;
        
        this.audio.stop();
        this.audio.setProperty({name: 'volume', value: 1});
        this.audio.say({text: text}).callAfter(dojo.hitch(this, this.updateSounds));
    },
    
    destroyEntity: function (entity) {
        entity.destroy(this);
        this.entities.splice(this.entities.indexOf(entity), 1);
    }
});
