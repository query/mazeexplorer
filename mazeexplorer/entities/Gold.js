dojo.provide('mazeexplorer.entities.Gold');

dojo.require('mazeexplorer.entities.Entity');

dojo.declare('mazeexplorer.entities.Gold', [mazeexplorer.entities.Entity], {
    sound: '17953__fonogeno__moneybox02',
    name: 'gold coins',
    baseVolume: 1,
    color: 'yellow',
    
    pointValue: 0,
    
    constructor: function (maze) {
        this.pointValue = Math.floor(Math.random() * 15) + 5;
    },
    
    update: function (maze) {
        if (maze.player.x === this.x && maze.player.y === this.y) {
            maze.player.score += this.pointValue;
            maze.destroyEntity(this);
        }
    },
    
    destroy: function (maze) {
        maze.audio.stop({channel: 'announce'});
        maze.audio.play({channel: 'announce',
                         url: 'audio/generated/91924__Benboncan__Till_With_Bell-0'});
        maze.audio.say({channel: 'announce',
                        text: 'You picked up ' + this.pointValue + ' gold coins.'});
    }
});
