/***************************************************
*   Bootstrap the app (without the confusion)
****************************************************
*
*   About:  Build the app from libs and components
*
****************************************************/
var mongo = require('mongojs'),
    DBcreds = process.env.DB,
    fs = require('fs');


// Recursively iterate over file system (BEWARE: NOT ASYNC!!!)
var traverseFileSystem = function (currentPath, func) {
    var files = fs.readdirSync(currentPath),
        currentFile, stats, key;

    for (key in files) {
        currentFile = currentPath + '/' + files[key];
        stats = fs.statSync(currentFile);
        if (stats.isFile()) {
            if (func) {
                func(currentFile, currentPath)
            }
        } else if (stats.isDirectory()) {
            traverseFileSystem(currentFile, func);
        }
    }
};


// Import base libraries
traverseFileSystem('./app/libs/', function (currentFile) {
    if (currentFile.indexOf('.js') > -1) {
        require('.' + currentFile);
    }
});


// Import app components
traverseFileSystem('./app/components/', function (currentFile) {
    if (currentFile.indexOf('.js') > -1) {
        require('.' + currentFile);
    }
});


// Optional DB
if (DBcreds) {
    objectId = mongo.ObjectId;
    DBcollection = [];

    // Ask components for their DB requirements
    EVENTS.emit('DBsetup');

    // Spin up DB
    setTimeout(function () {
        DB = mongo.connect(DBcreds, DBcollection);
        EVENTS.emit('DBReady');
    }, 222);
} else {
    setTimeout(function () {
        EVENTS.emit('DBReady');
    }, 999);
}


// Optimise static assets
if (!process.env.DEV) {
    require('simpl3s').speedify('./www');
}