//------------------------------------------------------------------------------
// General helper functions
//------------------------------------------------------------------------------

// Find the first array element that matches a predicate
const find = (predicate) => (array) => {
  for (let i = 0; i < array.length; i++) {
    if (predicate(array[i])) return [i, array[i]];
  }
  return [null, null];
};

// Count the number of array elements matching a predicate
const count = (predicate) => (array) =>
  array.reduce((count, elem) => count + predicate(elem), 0);

export { find, count };
