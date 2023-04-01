// source:
// https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value

/**
 * Sort function for array of objects. 
 * Sorts by values along the specified property. 
 * Assumes values are number or string.
 * @param {string} property Name of object item property to sort by.
 */
function dynamicSort(property) {
  var sortOrder = 1;
  if(property[0] === "-") {
      sortOrder = -1;
      property = property.substring(1);
  }
  return function (a,b) {
      /* next line works with strings and numbers, 
       * and you may want to customize it to your needs
       */
      var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
  }
}

export default dynamicSort