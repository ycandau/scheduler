import reducer from 'reducers/application';

//------------------------------------------------------------------------------

describe('Application reducer', () => {
  it('throws an error for an unsupported action type', () => {
    expect(() => reducer({}, { type: null })).toThrowError(
      /tried to reduce with unsupported action type/i
    );
  });
});
