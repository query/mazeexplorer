dojo.provide('mazeexplorer.MazeWidget');

dojo.require('dijit._Widget');
dojo.require('dijit._Templated');
dojo.require('uow.audio.JSonic');
dojo.require('mazeexplorer.Maze');

dojo.declare('mazeexplorer.MazeWidget', [dijit._Widget, dijit._Templated], {
    templateString: dojo.cache('mazeexplorer', 'templates/MazeWidget.html'),
    
    _redraw: function () {
        this.maze.renderBirdsEyeToCanvas(this.birdsEye, 24, 5);
        this.maze.renderRadarToCanvas(this.radar, 10, 10, 1);
    },
    
    _onClick: function () {
        uow.getAudio({defaultCaching: true}).then(dojo.hitch(this, function (audio) {
            this.maze = new mazeexplorer.Maze({audio: audio});
            this.maze.updateSounds();
            this._redraw();
        }));
    },
    
    _onKeyDown: function (e) {
        if (!this.maze) {
            return;
        }
        
        switch (e.keyCode) {
            case dojo.keys.LEFT_ARROW:
                e.preventDefault();
                
                // Rotate left by 90 degrees.
                if (this.maze.player.heading.x) {
                    this.maze.player.heading.y = -this.maze.player.heading.x;
                    this.maze.player.heading.x = 0;
                } else {
                    this.maze.player.heading.x = this.maze.player.heading.y;
                    this.maze.player.heading.y = 0;
                }
                
                this.maze.updateSounds();
            break;
            
            case dojo.keys.RIGHT_ARROW:
                e.preventDefault();
                
                // Rotate right by 90 degrees.
                if (this.maze.player.heading.x) {
                    this.maze.player.heading.y = this.maze.player.heading.x;
                    this.maze.player.heading.x = 0;
                } else {
                    this.maze.player.heading.x = -this.maze.player.heading.y;
                    this.maze.player.heading.y = 0;
                }
                
                this.maze.updateSounds();
            break;
            
            case dojo.keys.UP_ARROW:
                e.preventDefault();
                this.maze.movePlayer(this.maze.player.heading.x,
                                     this.maze.player.heading.y);
            break;
            
            case dojo.keys.DOWN_ARROW:
                e.preventDefault();
                this.maze.movePlayer(-this.maze.player.heading.x,
                                     -this.maze.player.heading.y);
            break;
            
            case dojo.keys.ESCAPE:
                e.preventDefault();
                this.maze.describeEntities();
            break;
            
            case 68:  // 'd'
                dojo.toggleClass(this.domNode, 'debug');
            break;
        }
        
        this._redraw();
        dojo.place(document.createTextNode(this.maze.player.score),
                   this.score, 'only');
    },
    
    startup: function () {
        dojo.connect(document.body, 'ondblclick', this, this._onClick);
        
        uow.ui.connectKeys();
        dojo.subscribe('/uow/key/down/initial',
                       dojo.hitch(this, this._onKeyDown));
    }
});