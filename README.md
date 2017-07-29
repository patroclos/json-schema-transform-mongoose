# Description

This project is part of a framework I am currently developing with emphasis on the incorporation of json-schema everywhere in the stack from generating rest apis and database models to socketio, form-generation and request validation

# What works
(partially) supported types: string, integer, array, object

constraints:
- string length
- enum
- string pattern
- integer bounds

# Usage

```javascript
const transform = require('json-schema-transform-mongoose');
const mongoose = require('mongoose');
const {expect} = require('chai');

var definition = transform({
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 3
    },
    count: {
      type: 'integer',
      minimum: 0,
      maximum: 10
    },
    numbers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          a: {type:'string', pattern:'[0-9]{3}'},
          b: {type: 'integer'}
        }
      }
    }
  }
});

expect(definition).to.deep.equal({
  name: {type: String, minlength: 3},
  count:{type: Number, min: 0, max:10},
  numbers: [{type: {
    type: {
      a: {type: String, match: /[0-9]{3}/},
      b: {type: Number}
    }
  }}]
});
```

# Contributing
## By means of code

Just fork the repo, make a new branch from the dev branch called something like 'feature-whateveryourdoing', do your thing and put up a pull request.

## Buy means of coffee

[![Buy me a coffee](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=X9BYDU543GWZE)

## Bye other means

Tell your friends about that cool new project on the block.
And at that oppertunity also find some excuse to talk about this project instead.

You can also just use this project and report back any bugs you find or make a feature request using the Issues tab.