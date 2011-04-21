dojo.provide('mazeexplorer.levels.sample.End');

dojo.require('mazeexplorer.levels.Level');

dojo.declare('mazeexplorer.levels.sample.End', [mazeexplorer.levels.Level], {
    introduction: function (maze) {
        return maze.audio.say({text: 'Congratulations!  You found your way ' +
                                     'out of the cave.'});
    }
});
