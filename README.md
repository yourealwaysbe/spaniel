### Spaniel

Python script implementing a query command for the mutt email client.
Queries either a vCard directory or vCard file.


# Requirements

* [docopt 0.6.2](https://pypi.python.org/pypi/docopt)
* [vobject 0.9.5](https://pypi.python.org/pypi/vobject)


# Usage

    $ spaniel.py --abook /my/contacts.vcf searchname

# Your muttrc

Add

    set query_command="spaniel.py --abook /my/contacts.vcf '%s'"
