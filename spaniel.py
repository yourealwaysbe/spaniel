#!/usr/bin/python

"""Query command implementation for mutt, searching a given vcard directory

Usage:
    spaniel.py [--abook=<abook>] [<query_string>]


Options:
    --abook=<abook>  The name of the VCF file or directory to search [default: .].
    <query_string>   The string to search for.
"""

from os import listdir
from os.path import isdir, isfile, join
import sys

from docopt import docopt
import vobject


def vcard_match(vcard, query):
    return query.upper() in str(vcard).upper()


def entry_output(email, name):
    sys.stdout.write(email.strip())
    sys.stdout.write('\t')
    sys.stdout.write(name.strip())
    sys.stdout.write('\t\n')


def process_vcard(vcard, query):
    if vcard_match(vcard, query):
        name = '<no name>'
        if hasattr(vcard, 'n'):
            name = str(vcard.n.value)

        if hasattr(vcard, 'email_list'):
            for email in vcard.email_list:
                entry_output(email.value, name)
        elif hasattr(vcard, 'email'):
            entry_output(vcard.email.value, name)


def query_directory(dirname, query):

    for f in listdir(dirname):
        filename = join(dirname, f)

        if isfile(filename):
            try:
                vcard = vobject.readOne(open(filename, 'r'))
                process_vcard(vcard, query)
            except vobject.base.ParseError:
                pass


def query_file(filename, query):
    for vcard in vobject.base.readComponents(open(filename, 'r')):
        process_vcard(vcard, query)


if __name__ == '__main__':
    arguments = docopt(__doc__, version='v0.1')

    abook = arguments['--abook']
    query = arguments['<query_string>']

    # First line of output ignored
    print('Searching...')

    if query is not None and len(query) > 0:
        if isfile(abook):
            query_file(abook, query)
        elif isdir(abook):
            query_directory(abook, query)
