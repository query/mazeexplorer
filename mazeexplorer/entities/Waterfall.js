dojo.provide('mazeexplorer.entities.Waterfall');

dojo.require('mazeexplorer.entities.Exit');

dojo.declare('mazeexplorer.entities.Waterfall', [mazeexplorer.entities.Exit], {
    sound: '14779__ignotus__Waterfall-edit',
    name: 'a waterfall',
    baseVolume: 10,
    color: 'skyblue'
});
