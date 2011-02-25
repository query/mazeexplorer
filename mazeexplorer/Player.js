dojo.provide('mazeexplorer.Player');

dojo.declare('mazeexplorer.Player', null, {
    x: 0, y: 0, heading: null, score: 0,
    
    constructor: function () {
        this.heading = {x: 1, y: 0};
    }
});
