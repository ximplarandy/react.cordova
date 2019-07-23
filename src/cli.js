// import arg from 'arg';
// var react = require('./react');

let callBackAfterDelWWW;
const rmdir = async (dirPath, callBack, options = {}) => {
    const
        { removeContentOnly = false, drillDownSymlinks = false } = options,
        { promisify } = require('util'),
        path = require('path'),
        fs = require('fs'),
        readdirAsync = promisify(fs.readdir),
        unlinkAsync = promisify(fs.unlink),
        rmdirAsync = promisify(fs.rmdir),
        lstatAsync = promisify(fs.lstat) // fs.lstat can detect symlinks, fs.stat can't
    let
        files

    try {
        files = await readdirAsync(dirPath)
    } catch (e) {
        throw new Error(e)
    }

    if (files.length) {
        for (let fileName of files) {
            let
                filePath = path.join(dirPath, fileName),
                fileStat = await lstatAsync(filePath),
                isSymlink = fileStat.isSymbolicLink(),
                isDir = fileStat.isDirectory()

            if (isDir || (isSymlink && drillDownSymlinks)) {
                await rmdir(filePath)
            } else {
                await unlinkAsync(filePath)
            }
        }
    }

    if (!removeContentOnly)
        await rmdirAsync(dirPath);


    if (!fs.existsSync('cordova/www'))
        await callBackAfterDelWWW();
}

export function cli(args) {

    // var r = require('fs');
    // console.log(r);
    // return


    let clientArgsAfter = "";
    for (let index = 1; index < args.slice(2).length; index++) {
        clientArgsAfter += (args.slice(2)[index] + " ");
    }

    var child_process = require('child_process');
    ///------////
    if (args.slice(2)[0] == "init") {

    } else if (args.slice(2)[0] == "build") {

        child_process.exec(
            'npm run build'
            , { cwd: 'react' }
            , function (error, stdout, stderr) {
                console.log('reco-react-cli ERROR : ' + error + " " + stdout + " " + stderr);
            }).on('close', function () {
                const path = require('path');
                callBackAfterDelWWW = function () { console.log("end!!!") };
                rmdir('./cordova/www');
                // require('fs').unlinkSync('./cordova/www', (err) => {
                //     if (err) throw err;
                //     console.log('successfully deleted /cordova/www');
                // });
            });

    }
    //--react--//
    else if (args.slice(2)[0] == "react") {

        child_process.exec(
            'npm ' + clientArgsAfter
            , { cwd: 'react' }
            , function (error, stdout, stderr) {
                console.log('reco-react-cli ERROR : ' + error + " " + stdout + " " + stderr);
            });

    }//--react start
    else if (args.slice(2)[0] == "start") {

        child_process.exec(
            'npm start'
            , { cwd: 'react' }
            , function (error, stdout, stderr) {
                console.log('reco-react-cli ERROR : ' + error + " " + stdout + " " + stderr);
            });

    }//--react test
    else if (args.slice(2)[0] == "test") {

        child_process.exec(
            'npm test'
            , { cwd: 'react' }
            , function (error, stdout, stderr) {
                console.log('reco-react-cli ERROR : ' + error + " " + stdout + " " + stderr);
            });

    }

    //--cordova--//
    else if (args.slice(2)[0] == "cordova") {


        child_process.exec(
            'cordova ' + clientArgsAfter
            , { cwd: 'cordova' }
            , function (error, stdout, stderr) {
                console.log('reco-react-cli ERROR : ' + error + " " + stdout + " " + stderr);
            });


    } else if (args.slice(2)[0] == "-info") {
        console.log(' info=> https://github.com/orchoban/react.cordova')
    }



    // var child_process = require('child_process');
    // child_process.exec('"reco.bat" ' + args.slice(2)[0], function (error, stdout, stderr) {
    //     console.log('cli-reco EROOR: ' + error + " " + stdout + " " + stderr);
    // });
}