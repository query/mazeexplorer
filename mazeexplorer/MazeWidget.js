dojo.provide('mazeexplorer.MazeWidget');

dojo.require('dijit._Widget');
dojo.require('dijit._Templated');
dojo.require('mazeexplorer.Maze');

dojo.declare('mazeexplorer.MazeWidget', [dijit._Widget, dijit._Templated], {
    templateString: dojo.cache('mazeexplorer', 'templates/MazeWidget.html'),
    
    _onClick: function () {
        this.maze = new mazeexplorer.Maze({width: 15, height: 15});
        this.maze.renderBirdsEyeToCanvas(this.birdsEye, 24, 5);
        this.maze.renderRadarToCanvas(this.radar, 7, 24, 5);
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
        }
        
        this.maze.renderBirdsEyeToCanvas(this.birdsEye, 24, 5);
        this.maze.renderRadarToCanvas(this.radar, 7, 24, 5);
        dojo.place(document.createTextNode(this.maze.player.score),
                   this.score, 'only');
    },
    
    startup: function () {
        dojo.connect(document.body, 'onkeydown', this, this._onKeyDown);
    }
});