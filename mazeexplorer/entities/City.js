dojo.provide('mazeexplorer.entities.City');

dojo.require('mazeexplorer.entities.Entity');

dojo.declare('mazeexplorer.entities.City', [mazeexplorer.entities.Entity], {
    sound: '9440__A43__Traffic_Horn_Honking',
    baseVolume: 1,
    name: 'a city',
    color: 'gray'
});
