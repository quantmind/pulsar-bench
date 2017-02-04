#!/usr/bin/env python3
import os

from setuptools import setup, find_packages

import pbench


def read(name):
    filename = os.path.join(os.path.dirname(__file__), name)
    with open(filename) as fp:
        return fp.read()


meta = dict(
    version=pbench.__version__,
    description=pbench.__doc__,
    name='pulsar-bench',
    author='Luca Sbardella',
    author_email="luca@quantmind.com",
    maintainer_email="luca@quantmind.com",
    license="BSD",
    packages=find_packages(include=['pbench', 'pbench.*']),
    long_description=read('README.md'),
    url='https://github.com/quantmind/pulsar-bench',
    include_package_data=True,
    zip_safe=False,
    setup_requires=['wheel'],
    classifiers=[
        'Development Status :: 3 - Alpha',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: BSD License',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.5',
        'Programming Language :: Python :: 3.6',
        'Topic :: Utilities',
        'Topic :: Software Development :: Libraries :: Python Modules'
    ]
)


if __name__ == '__main__':
    setup(**meta)
