/* global describe, it */

/**
 * Test simple core features like types,nesting and requiring
 */

// TODO use schema validator to test used jschemas against meta-schema

const transform = require('..');
const { expect } = require('chai');

describe('primitives', () => {
  it('transforms strings', () => {
    const jschema = { type: 'string' };
    const out = transform(jschema);
    expect(out).deep.equal({ type: String });
  });

  it('transforms integers', () => {
    const jschema = { type: 'integer' };
    const out = transform(jschema);
    expect(out).deep.equal({ type: Number });
  });
});

describe('constraints', () => {
  it('patterns', () => {
    const out = transform({ type: 'string', pattern: 'patternValue' });
    expect(out).deep.equal({ type: String, match: /patternValue/ });
  });

  it('enums', () => {
    const out = transform({ type: 'string', enum: ['a', 'b', 'c'] });
    expect(out).deep.equal({ type: String, enum: ['a', 'b', 'c'] });
  });

  it('number bounds', () => {
    expect(transform({
      type: 'integer',
      minimum: 0,
      maximum: 100,
    })).deep.equal({
      type: Number,
      min: 0,
      max: 100,
    });
  });

  it('string length bounds', () => {
    expect(transform({
      type: 'string',
      minLength: 0,
      maxLength: 32,
    })).deep.equal({
      type: String,
      minlength: 0,
      maxlength: 32,
    });
  });
});

describe('shallow objects and arrays', () => {
  it('transforms string array', () => {
    const jschema = {
      type: 'array',
      items: {
        type: 'string',
      },
    };
    const out = transform(jschema);

    expect(out).deep.equal({ type: [{ type: String }] });
  });

  it('transforms shallow objects', () => {
    const jschema = {
      type: 'object',
      properties: {
        a: { type: 'string' },
        b: { type: 'integer' },
      },
      required: ['b'],
    };
    const out = transform(jschema);
    expect(out).deep.equal({
      a: { type: String },
      b: { type: Number, require: true },
    });
  });
});
