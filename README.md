# Spaniel

Python and Node scripts implementing a query command for the mutt email client.
Queries either a vCard directory or vCard file.


## Requirements Python

* [docopt 0.6.2](https://pypi.python.org/pypi/docopt)
* [vobject 0.9.5](https://pypi.python.org/pypi/vobject)

## Requirements Node

* [command-line-args 4.0.7](https://www.npmjs.com/package/command-line-args)
* [vdata-parser 0.1.5](https://www.npmjs.com/package/vdata-parser)

## Usage

    $ spaniel.py --abook /my/contacts.vcf searchname
    $ spaniel.js --abook /my/contacts.vcf searchname

## Your muttrc

Add

    set query_command="spaniel.js --abook /my/contacts.vcf '%s'"
