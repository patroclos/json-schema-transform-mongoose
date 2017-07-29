const _ = require('lodash');

let jsonTypeTransformers;

function getTransformer(jtype) {
  return jsonTypeTransformers[jtype];
}

function transform(schema) {
  return getTransformer(schema.type)(schema);
}

function schemaRequiresProp(schema, propName) {
  return schema.required && _.isArray(schema.required) && _.includes(schema.required, propName);
}

function transformObject(objectSchema) {
  const rv = {};
  _.forIn(objectSchema.properties, (propValue, propName) => {
    const prop = transform(propValue);
    if (schemaRequiresProp(objectSchema, propName)) {
      prop.require = true;
    }

    rv[propName] = prop;
  });
  return rv;
}

// TODO type specifics enum, pattern matching etc
function transformString(schema) {
  const rv = { type: String };

  if (typeof schema.pattern !== 'undefined') {
    rv.match = new RegExp(schema.pattern);
  }

  if (typeof schema.enum !== 'undefined') {
    rv.enum = schema.enum;
  }

  if (typeof schema.minLength !== 'undefined') {
    rv.minlength = schema.minLength;
  }

  if (typeof schema.maxLength !== 'undefined') {
    rv.maxlength = schema.maxLength;
  }

  return rv;
}

// TODO type specifics min,max
function transformInteger(schema) {
  const rv = { type: Number };

  if (typeof schema.minimum !== 'undefined') {
    rv.min = schema.minimum;
  }

  if (typeof schema.maximum !== 'undefined') {
    rv.max = schema.maximum;
  }

  return rv;
}

// TODO type specifics min,max
function transformArray(schema) {
  return { type: [transform(schema.items || { type: Object })] };
}

jsonTypeTransformers = {
  string: transformString,
  integer: transformInteger,
  array: transformArray,
  object: transformObject,
};

module.exports = transform;
