#!/usr/bin/node

const fs = require('fs')
const path = require('path')
const util = require('util')

const commandLineArgs = require('command-line-args')
const vdata = require('vdata-parser')

const EMAIL = 'EMAIL'
const FN = 'FN'
const PHOTO = 'PHOTO'
const TYPE = 'TYPE'
const VCARD = 'VCARD'


function processCommandLineOrFail() {
    const optionDefinitions = [
      { name: 'abook',
        alias: 'a',
        type: String,
        defaultOption: false,
        defaultValue: '.'},
      { name: 'query',
        alias: 'q',
        type: String,
        defaultOption: true },
      { name: 'help',
        alias: 'h',
        type: Boolean }
    ]

    const options = commandLineArgs(optionDefinitions)

    if (!options.query || options.help) {
        console.log('Usage: spaniel.js [--abook <file/dir>] <query>')
        console.log('')
        console.log('    --abook <file/dir> the file or directory containing vCards')
        console.log('    <query>            a string to search for in the vCards')
        process.exit(options.help ? 0 : -1)
    }

    return options
}


function isMatch(vc, query) {
    const replacer = (key, value) => {
        if (key == PHOTO)
            return ''
        else
            return value
    }
    const vcString = JSON.stringify(vc, replacer)
    return vcString.search(new RegExp(query, 'i')) != -1
}


// fullname is a string
// email is a email object from vdata-parser
function outputEmailHit(fullname, email) {
    var type = ''
    var emailString = email

    if (email.params) {
        email.params.forEach(param => {
            if (TYPE in param) {
                type = param[TYPE]
            }
        })
        emailString = email.value
    }

    console.log(emailString + '\t' + fullname + '\t' + type)
}


function outputVcardHit(vc) {
    if (EMAIL in vc) {
        const emails = vc[EMAIL]
        if (emails.forEach) {
            emails.forEach(email => {
                outputEmailHit(vc[FN], email)
            })
        } else {
            outputEmailHit(vc[FN], emails)
        }
    }
}


function processVcard(vc, query) {
    if (isMatch(vc, query) &&true) {
        outputVcardHit(vc)
    }
}


async function searchFile(abook, query) {
    vdata.promFromFile = util.promisify(vdata.fromFile)
    const data = await vdata.promFromFile(abook)

    if (data[VCARD]) {
        if (data[VCARD].forEach) {
            data[VCARD].forEach(vc => {
                processVcard(vc, query)
            })
        } else {
            processVcard(data[VCARD], query)
        }
    } else {
        throw "Card is not a vCard"
    }
}


async function searchDirectory(abook, query) {
    const readdir = util.promisify(fs.readdir)

    const files = await readdir(abook)
    files.forEach(file => {
        const fullname = path.join(abook, file)
        searchFile(fullname, query).catch(err => {
            // Ignore error messages
        })
    })
}


async function doSearch(abook, query) {
    const lstat = util.promisify(fs.lstat)

    const stats = await lstat(abook)

    if (stats.isFile()) {
        await searchFile(abook, query)
    } else if (stats.isDirectory()) {
        await searchDirectory(abook, query)
    } else {
        throw abook + ' is not a file or directory'
    }
}


const options = processCommandLineOrFail()
doSearch(options.abook, options.query).catch(err => {
    console.error(err.message)
    process.exit(-1)
})



