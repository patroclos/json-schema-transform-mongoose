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
