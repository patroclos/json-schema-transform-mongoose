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

// TODO type specifics
function transformString(schema) {
  return { type: String };
}

// TODO type specifics
function transformInteger(schema) {
  return { type: Number };
}

// TODO type specifics
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
