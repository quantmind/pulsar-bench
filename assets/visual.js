// pulsar-benchmarks Version 0.1.1. Copyright 2017 quantmind.com.
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-let'), require('d3-view'), require('d3-collection'), require('d3-dsv'), require('d3-dispatch'), require('d3-array'), require('d3-time-format'), require('d3-transition'), require('d3-selection'), require('d3-format'), require('d3-scale-chromatic')) :
	typeof define === 'function' && define.amd ? define(['exports', 'd3-let', 'd3-view', 'd3-collection', 'd3-dsv', 'd3-dispatch', 'd3-array', 'd3-time-format', 'd3-transition', 'd3-selection', 'd3-format', 'd3-scale-chromatic'], factory) :
	(factory((global.d3 = global.d3 || {}),global.d3,global.d3,global.d3,global.d3,global.d3,global.d3,global.d3,global.d3,global.d3,global.d3,global.d3));
}(this, (function (exports,d3Let,d3View,d3Collection,d3Dsv,d3Dispatch,d3Array,d3TimeFormat,d3Transition,d3Selection,d3Format,d3ScaleChromatic) { 'use strict';

//
//  Asynchronous module definitions

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var crossfilter$2 = createCommonjsModule(function (module, exports) {
(function (exports) {
  crossfilter.version = "1.3.12";
  function crossfilter_identity(d) {
    return d;
  }
  crossfilter.permute = permute;

  function permute(array, index) {
    for (var i = 0, n = index.length, copy = new Array(n); i < n; ++i) {
      copy[i] = array[index[i]];
    }
    return copy;
  }
  var bisect = crossfilter.bisect = bisect_by(crossfilter_identity);

  bisect.by = bisect_by;

  function bisect_by(f) {

    // Locate the insertion point for x in a to maintain sorted order. The
    // arguments lo and hi may be used to specify a subset of the array which
    // should be considered; by default the entire array is used. If x is already
    // present in a, the insertion point will be before (to the left of) any
    // existing entries. The return value is suitable for use as the first
    // argument to `array.splice` assuming that a is already sorted.
    //
    // The returned insertion point i partitions the array a into two halves so
    // that all v < x for v in a[lo:i] for the left side and all v >= x for v in
    // a[i:hi] for the right side.
    function bisectLeft(a, x, lo, hi) {
      while (lo < hi) {
        var mid = lo + hi >>> 1;
        if (f(a[mid]) < x) lo = mid + 1;else hi = mid;
      }
      return lo;
    }

    // Similar to bisectLeft, but returns an insertion point which comes after (to
    // the right of) any existing entries of x in a.
    //
    // The returned insertion point i partitions the array into two halves so that
    // all v <= x for v in a[lo:i] for the left side and all v > x for v in
    // a[i:hi] for the right side.
    function bisectRight(a, x, lo, hi) {
      while (lo < hi) {
        var mid = lo + hi >>> 1;
        if (x < f(a[mid])) hi = mid;else lo = mid + 1;
      }
      return lo;
    }

    bisectRight.right = bisectRight;
    bisectRight.left = bisectLeft;
    return bisectRight;
  }
  var heap = crossfilter.heap = heap_by(crossfilter_identity);

  heap.by = heap_by;

  function heap_by(f) {

    // Builds a binary heap within the specified array a[lo:hi]. The heap has the
    // property such that the parent a[lo+i] is always less than or equal to its
    // two children: a[lo+2*i+1] and a[lo+2*i+2].
    function heap(a, lo, hi) {
      var n = hi - lo,
          i = (n >>> 1) + 1;
      while (--i > 0) {
        sift(a, i, n, lo);
      }return a;
    }

    // Sorts the specified array a[lo:hi] in descending order, assuming it is
    // already a heap.
    function sort(a, lo, hi) {
      var n = hi - lo,
          t;
      while (--n > 0) {
        t = a[lo], a[lo] = a[lo + n], a[lo + n] = t, sift(a, 1, n, lo);
      }return a;
    }

    // Sifts the element a[lo+i-1] down the heap, where the heap is the contiguous
    // slice of array a[lo:lo+n]. This method can also be used to update the heap
    // incrementally, without incurring the full cost of reconstructing the heap.
    function sift(a, i, n, lo) {
      var d = a[--lo + i],
          x = f(d),
          child;
      while ((child = i << 1) <= n) {
        if (child < n && f(a[lo + child]) > f(a[lo + child + 1])) child++;
        if (x <= f(a[lo + child])) break;
        a[lo + i] = a[lo + child];
        i = child;
      }
      a[lo + i] = d;
    }

    heap.sort = sort;
    return heap;
  }
  var heapselect = crossfilter.heapselect = heapselect_by(crossfilter_identity);

  heapselect.by = heapselect_by;

  function heapselect_by(f) {
    var heap = heap_by(f);

    // Returns a new array containing the top k elements in the array a[lo:hi].
    // The returned array is not sorted, but maintains the heap property. If k is
    // greater than hi - lo, then fewer than k elements will be returned. The
    // order of elements in a is unchanged by this operation.
    function heapselect(a, lo, hi, k) {
      var queue = new Array(k = Math.min(hi - lo, k)),
          min$$1,
          i,
          x,
          d;

      for (i = 0; i < k; ++i) {
        queue[i] = a[lo++];
      }heap(queue, 0, k);

      if (lo < hi) {
        min$$1 = f(queue[0]);
        do {
          if (x = f(d = a[lo]) > min$$1) {
            queue[0] = d;
            min$$1 = f(heap(queue, 0, k)[0]);
          }
        } while (++lo < hi);
      }

      return queue;
    }

    return heapselect;
  }
  var insertionsort = crossfilter.insertionsort = insertionsort_by(crossfilter_identity);

  insertionsort.by = insertionsort_by;

  function insertionsort_by(f) {

    function insertionsort(a, lo, hi) {
      for (var i = lo + 1; i < hi; ++i) {
        for (var j = i, t = a[i], x = f(t); j > lo && f(a[j - 1]) > x; --j) {
          a[j] = a[j - 1];
        }
        a[j] = t;
      }
      return a;
    }

    return insertionsort;
  }
  // Algorithm designed by Vladimir Yaroslavskiy.
  // Implementation based on the Dart project; see lib/dart/LICENSE for details.

  var quicksort = crossfilter.quicksort = quicksort_by(crossfilter_identity);

  quicksort.by = quicksort_by;

  function quicksort_by(f) {
    var insertionsort = insertionsort_by(f);

    function sort(a, lo, hi) {
      return (hi - lo < quicksort_sizeThreshold ? insertionsort : quicksort)(a, lo, hi);
    }

    function quicksort(a, lo, hi) {
      // Compute the two pivots by looking at 5 elements.
      var sixth = (hi - lo) / 6 | 0,
          i1 = lo + sixth,
          i5 = hi - 1 - sixth,
          i3 = lo + hi - 1 >> 1,
          // The midpoint.
      i2 = i3 - sixth,
          i4 = i3 + sixth;

      var e1 = a[i1],
          x1 = f(e1),
          e2 = a[i2],
          x2 = f(e2),
          e3 = a[i3],
          x3 = f(e3),
          e4 = a[i4],
          x4 = f(e4),
          e5 = a[i5],
          x5 = f(e5);

      var t;

      // Sort the selected 5 elements using a sorting network.
      if (x1 > x2) t = e1, e1 = e2, e2 = t, t = x1, x1 = x2, x2 = t;
      if (x4 > x5) t = e4, e4 = e5, e5 = t, t = x4, x4 = x5, x5 = t;
      if (x1 > x3) t = e1, e1 = e3, e3 = t, t = x1, x1 = x3, x3 = t;
      if (x2 > x3) t = e2, e2 = e3, e3 = t, t = x2, x2 = x3, x3 = t;
      if (x1 > x4) t = e1, e1 = e4, e4 = t, t = x1, x1 = x4, x4 = t;
      if (x3 > x4) t = e3, e3 = e4, e4 = t, t = x3, x3 = x4, x4 = t;
      if (x2 > x5) t = e2, e2 = e5, e5 = t, t = x2, x2 = x5, x5 = t;
      if (x2 > x3) t = e2, e2 = e3, e3 = t, t = x2, x2 = x3, x3 = t;
      if (x4 > x5) t = e4, e4 = e5, e5 = t, t = x4, x4 = x5, x5 = t;

      var pivot1 = e2,
          pivotValue1 = x2,
          pivot2 = e4,
          pivotValue2 = x4;

      // e2 and e4 have been saved in the pivot variables. They will be written
      // back, once the partitioning is finished.
      a[i1] = e1;
      a[i2] = a[lo];
      a[i3] = e3;
      a[i4] = a[hi - 1];
      a[i5] = e5;

      var less = lo + 1,
          // First element in the middle partition.
      great = hi - 2; // Last element in the middle partition.

      // Note that for value comparison, <, <=, >= and > coerce to a primitive via
      // Object.prototype.valueOf; == and === do not, so in order to be consistent
      // with natural order (such as for Date objects), we must do two compares.
      var pivotsEqual = pivotValue1 <= pivotValue2 && pivotValue1 >= pivotValue2;
      if (pivotsEqual) {

        // Degenerated case where the partitioning becomes a dutch national flag
        // problem.
        //
        // [ |  < pivot  | == pivot | unpartitioned | > pivot  | ]
        //  ^             ^          ^             ^            ^
        // left         less         k           great         right
        //
        // a[left] and a[right] are undefined and are filled after the
        // partitioning.
        //
        // Invariants:
        //   1) for x in ]left, less[ : x < pivot.
        //   2) for x in [less, k[ : x == pivot.
        //   3) for x in ]great, right[ : x > pivot.
        for (var k = less; k <= great; ++k) {
          var ek = a[k],
              xk = f(ek);
          if (xk < pivotValue1) {
            if (k !== less) {
              a[k] = a[less];
              a[less] = ek;
            }
            ++less;
          } else if (xk > pivotValue1) {

            // Find the first element <= pivot in the range [k - 1, great] and
            // put [:ek:] there. We know that such an element must exist:
            // When k == less, then el3 (which is equal to pivot) lies in the
            // interval. Otherwise a[k - 1] == pivot and the search stops at k-1.
            // Note that in the latter case invariant 2 will be violated for a
            // short amount of time. The invariant will be restored when the
            // pivots are put into their final positions.
            while (true) {
              var greatValue = f(a[great]);
              if (greatValue > pivotValue1) {
                great--;
                // This is the only location in the while-loop where a new
                // iteration is started.
                continue;
              } else if (greatValue < pivotValue1) {
                // Triple exchange.
                a[k] = a[less];
                a[less++] = a[great];
                a[great--] = ek;
                break;
              } else {
                a[k] = a[great];
                a[great--] = ek;
                // Note: if great < k then we will exit the outer loop and fix
                // invariant 2 (which we just violated).
                break;
              }
            }
          }
        }
      } else {

        // We partition the list into three parts:
        //  1. < pivot1
        //  2. >= pivot1 && <= pivot2
        //  3. > pivot2
        //
        // During the loop we have:
        // [ | < pivot1 | >= pivot1 && <= pivot2 | unpartitioned  | > pivot2  | ]
        //  ^            ^                        ^              ^             ^
        // left         less                     k              great        right
        //
        // a[left] and a[right] are undefined and are filled after the
        // partitioning.
        //
        // Invariants:
        //   1. for x in ]left, less[ : x < pivot1
        //   2. for x in [less, k[ : pivot1 <= x && x <= pivot2
        //   3. for x in ]great, right[ : x > pivot2
        for (var k = less; k <= great; k++) {
          var ek = a[k],
              xk = f(ek);
          if (xk < pivotValue1) {
            if (k !== less) {
              a[k] = a[less];
              a[less] = ek;
            }
            ++less;
          } else {
            if (xk > pivotValue2) {
              while (true) {
                var greatValue = f(a[great]);
                if (greatValue > pivotValue2) {
                  great--;
                  if (great < k) break;
                  // This is the only location inside the loop where a new
                  // iteration is started.
                  continue;
                } else {
                  // a[great] <= pivot2.
                  if (greatValue < pivotValue1) {
                    // Triple exchange.
                    a[k] = a[less];
                    a[less++] = a[great];
                    a[great--] = ek;
                  } else {
                    // a[great] >= pivot1.
                    a[k] = a[great];
                    a[great--] = ek;
                  }
                  break;
                }
              }
            }
          }
        }
      }

      // Move pivots into their final positions.
      // We shrunk the list from both sides (a[left] and a[right] have
      // meaningless values in them) and now we move elements from the first
      // and third partition into these locations so that we can store the
      // pivots.
      a[lo] = a[less - 1];
      a[less - 1] = pivot1;
      a[hi - 1] = a[great + 1];
      a[great + 1] = pivot2;

      // The list is now partitioned into three partitions:
      // [ < pivot1   | >= pivot1 && <= pivot2   |  > pivot2   ]
      //  ^            ^                        ^             ^
      // left         less                     great        right

      // Recursive descent. (Don't include the pivot values.)
      sort(a, lo, less - 1);
      sort(a, great + 2, hi);

      if (pivotsEqual) {
        // All elements in the second partition are equal to the pivot. No
        // need to sort them.
        return a;
      }

      // In theory it should be enough to call _doSort recursively on the second
      // partition.
      // The Android source however removes the pivot elements from the recursive
      // call if the second partition is too large (more than 2/3 of the list).
      if (less < i1 && great > i5) {
        var lessValue, greatValue;
        while ((lessValue = f(a[less])) <= pivotValue1 && lessValue >= pivotValue1) {
          ++less;
        }while ((greatValue = f(a[great])) <= pivotValue2 && greatValue >= pivotValue2) {
          --great;
        } // Copy paste of the previous 3-way partitioning with adaptions.
        //
        // We partition the list into three parts:
        //  1. == pivot1
        //  2. > pivot1 && < pivot2
        //  3. == pivot2
        //
        // During the loop we have:
        // [ == pivot1 | > pivot1 && < pivot2 | unpartitioned  | == pivot2 ]
        //              ^                      ^              ^
        //            less                     k              great
        //
        // Invariants:
        //   1. for x in [ *, less[ : x == pivot1
        //   2. for x in [less, k[ : pivot1 < x && x < pivot2
        //   3. for x in ]great, * ] : x == pivot2
        for (var k = less; k <= great; k++) {
          var ek = a[k],
              xk = f(ek);
          if (xk <= pivotValue1 && xk >= pivotValue1) {
            if (k !== less) {
              a[k] = a[less];
              a[less] = ek;
            }
            less++;
          } else {
            if (xk <= pivotValue2 && xk >= pivotValue2) {
              while (true) {
                var greatValue = f(a[great]);
                if (greatValue <= pivotValue2 && greatValue >= pivotValue2) {
                  great--;
                  if (great < k) break;
                  // This is the only location inside the loop where a new
                  // iteration is started.
                  continue;
                } else {
                  // a[great] < pivot2.
                  if (greatValue < pivotValue1) {
                    // Triple exchange.
                    a[k] = a[less];
                    a[less++] = a[great];
                    a[great--] = ek;
                  } else {
                    // a[great] == pivot1.
                    a[k] = a[great];
                    a[great--] = ek;
                  }
                  break;
                }
              }
            }
          }
        }
      }

      // The second partition has now been cleared of pivot elements and looks
      // as follows:
      // [  *  |  > pivot1 && < pivot2  | * ]
      //        ^                      ^
      //       less                  great
      // Sort the second partition using recursive descent.

      // The second partition looks as follows:
      // [  *  |  >= pivot1 && <= pivot2  | * ]
      //        ^                        ^
      //       less                    great
      // Simply sort it by recursive descent.

      return sort(a, less, great + 1);
    }

    return sort;
  }

  var quicksort_sizeThreshold = 32;
  var crossfilter_array8 = crossfilter_arrayUntyped,
      crossfilter_array16 = crossfilter_arrayUntyped,
      crossfilter_array32 = crossfilter_arrayUntyped,
      crossfilter_arrayLengthen = crossfilter_arrayLengthenUntyped,
      crossfilter_arrayWiden = crossfilter_arrayWidenUntyped;

  if (typeof Uint8Array !== "undefined") {
    crossfilter_array8 = function crossfilter_array8(n) {
      return new Uint8Array(n);
    };
    crossfilter_array16 = function crossfilter_array16(n) {
      return new Uint16Array(n);
    };
    crossfilter_array32 = function crossfilter_array32(n) {
      return new Uint32Array(n);
    };

    crossfilter_arrayLengthen = function crossfilter_arrayLengthen(array, length) {
      if (array.length >= length) return array;
      var copy = new array.constructor(length);
      copy.set(array);
      return copy;
    };

    crossfilter_arrayWiden = function crossfilter_arrayWiden(array, width) {
      var copy;
      switch (width) {
        case 16:
          copy = crossfilter_array16(array.length);break;
        case 32:
          copy = crossfilter_array32(array.length);break;
        default:
          throw new Error("invalid array width!");
      }
      copy.set(array);
      return copy;
    };
  }

  function crossfilter_arrayUntyped(n) {
    var array = new Array(n),
        i = -1;
    while (++i < n) {
      array[i] = 0;
    }return array;
  }

  function crossfilter_arrayLengthenUntyped(array, length) {
    var n = array.length;
    while (n < length) {
      array[n++] = 0;
    }return array;
  }

  function crossfilter_arrayWidenUntyped(array, width) {
    if (width > 32) throw new Error("invalid array width!");
    return array;
  }
  function crossfilter_filterExact(bisect, value) {
    return function (values) {
      var n = values.length;
      return [bisect.left(values, value, 0, n), bisect.right(values, value, 0, n)];
    };
  }

  function crossfilter_filterRange(bisect, range$$1) {
    var min$$1 = range$$1[0],
        max$$1 = range$$1[1];
    return function (values) {
      var n = values.length;
      return [bisect.left(values, min$$1, 0, n), bisect.left(values, max$$1, 0, n)];
    };
  }

  function crossfilter_filterAll(values) {
    return [0, values.length];
  }
  function crossfilter_null() {
    return null;
  }
  function crossfilter_zero() {
    return 0;
  }
  function crossfilter_reduceIncrement(p) {
    return p + 1;
  }

  function crossfilter_reduceDecrement(p) {
    return p - 1;
  }

  function crossfilter_reduceAdd(f) {
    return function (p, v) {
      return p + +f(v);
    };
  }

  function crossfilter_reduceSubtract(f) {
    return function (p, v) {
      return p - f(v);
    };
  }
  exports.crossfilter = crossfilter;

  function crossfilter() {
    var crossfilter = {
      add: add,
      remove: removeData,
      dimension: dimension,
      groupAll: groupAll,
      size: size
    };

    var data = [],
        // the records
    n = 0,
        // the number of records; data.length
    m = 0,
        // a bit mask representing which dimensions are in use
    M = 8,
        // number of dimensions that can fit in `filters`
    filters = crossfilter_array8(0),
        // M bits per record; 1 is filtered out
    filterListeners = [],
        // when the filters change
    dataListeners = [],
        // when data is added
    removeDataListeners = []; // when data is removed

    // Adds the specified new records to this crossfilter.
    function add(newData) {
      var n0 = n,
          n1 = newData.length;

      // If there's actually new data to add…
      // Merge the new data into the existing data.
      // Lengthen the filter bitset to handle the new records.
      // Notify listeners (dimensions and groups) that new data is available.
      if (n1) {
        data = data.concat(newData);
        filters = crossfilter_arrayLengthen(filters, n += n1);
        dataListeners.forEach(function (l) {
          l(newData, n0, n1);
        });
      }

      return crossfilter;
    }

    // Removes all records that match the current filters.
    function removeData() {
      var newIndex = crossfilter_index(n, n),
          removed = [];
      for (var i = 0, j = 0; i < n; ++i) {
        if (filters[i]) newIndex[i] = j++;else removed.push(i);
      }

      // Remove all matching records from groups.
      filterListeners.forEach(function (l) {
        l(0, [], removed);
      });

      // Update indexes.
      removeDataListeners.forEach(function (l) {
        l(newIndex);
      });

      // Remove old filters and data by overwriting.
      for (var i = 0, j = 0, k; i < n; ++i) {
        if (k = filters[i]) {
          if (i !== j) filters[j] = k, data[j] = data[i];
          ++j;
        }
      }
      data.length = j;
      while (n > j) {
        filters[--n] = 0;
      }
    }

    // Adds a new dimension with the specified value accessor function.
    function dimension(value) {
      var dimension = {
        filter: filter,
        filterExact: filterExact,
        filterRange: filterRange,
        filterFunction: filterFunction,
        filterAll: filterAll,
        top: top,
        bottom: bottom,
        group: group,
        groupAll: groupAll,
        dispose: dispose,
        remove: dispose // for backwards-compatibility
      };

      var one = ~m & -~m,
          // lowest unset bit as mask, e.g., 00001000
      zero = ~one,
          // inverted one, e.g., 11110111
      values,
          // sorted, cached array
      index,
          // value rank ↦ object id
      newValues,
          // temporary array storing newly-added values
      newIndex,
          // temporary array storing newly-added index
      sort = quicksort_by(function (i) {
        return newValues[i];
      }),
          refilter = crossfilter_filterAll,
          // for recomputing filter
      refilterFunction,
          // the custom filter function in use
      indexListeners = [],
          // when data is added
      dimensionGroups = [],
          lo0 = 0,
          hi0 = 0;

      // Updating a dimension is a two-stage process. First, we must update the
      // associated filters for the newly-added records. Once all dimensions have
      // updated their filters, the groups are notified to update.
      dataListeners.unshift(preAdd);
      dataListeners.push(postAdd);

      removeDataListeners.push(removeData);

      // Incorporate any existing data into this dimension, and make sure that the
      // filter bitset is wide enough to handle the new dimension.
      m |= one;
      if (M >= 32 ? !one : m & -(1 << M)) {
        filters = crossfilter_arrayWiden(filters, M <<= 1);
      }
      preAdd(data, 0, n);
      postAdd(data, 0, n);

      // Incorporates the specified new records into this dimension.
      // This function is responsible for updating filters, values, and index.
      function preAdd(newData, n0, n1) {

        // Permute new values into natural order using a sorted index.
        newValues = newData.map(value);
        newIndex = sort(crossfilter_range(n1), 0, n1);
        newValues = permute(newValues, newIndex);

        // Bisect newValues to determine which new records are selected.
        var bounds = refilter(newValues),
            lo1 = bounds[0],
            hi1 = bounds[1],
            i;
        if (refilterFunction) {
          for (i = 0; i < n1; ++i) {
            if (!refilterFunction(newValues[i], i)) filters[newIndex[i] + n0] |= one;
          }
        } else {
          for (i = 0; i < lo1; ++i) {
            filters[newIndex[i] + n0] |= one;
          }for (i = hi1; i < n1; ++i) {
            filters[newIndex[i] + n0] |= one;
          }
        }

        // If this dimension previously had no data, then we don't need to do the
        // more expensive merge operation; use the new values and index as-is.
        if (!n0) {
          values = newValues;
          index = newIndex;
          lo0 = lo1;
          hi0 = hi1;
          return;
        }

        var oldValues = values,
            oldIndex = index,
            i0 = 0,
            i1 = 0;

        // Otherwise, create new arrays into which to merge new and old.
        values = new Array(n);
        index = crossfilter_index(n, n);

        // Merge the old and new sorted values, and old and new index.
        for (i = 0; i0 < n0 && i1 < n1; ++i) {
          if (oldValues[i0] < newValues[i1]) {
            values[i] = oldValues[i0];
            index[i] = oldIndex[i0++];
          } else {
            values[i] = newValues[i1];
            index[i] = newIndex[i1++] + n0;
          }
        }

        // Add any remaining old values.
        for (; i0 < n0; ++i0, ++i) {
          values[i] = oldValues[i0];
          index[i] = oldIndex[i0];
        }

        // Add any remaining new values.
        for (; i1 < n1; ++i1, ++i) {
          values[i] = newValues[i1];
          index[i] = newIndex[i1] + n0;
        }

        // Bisect again to recompute lo0 and hi0.
        bounds = refilter(values), lo0 = bounds[0], hi0 = bounds[1];
      }

      // When all filters have updated, notify index listeners of the new values.
      function postAdd(newData, n0, n1) {
        indexListeners.forEach(function (l) {
          l(newValues, newIndex, n0, n1);
        });
        newValues = newIndex = null;
      }

      function removeData(reIndex) {
        for (var i = 0, j = 0, k; i < n; ++i) {
          if (filters[k = index[i]]) {
            if (i !== j) values[j] = values[i];
            index[j] = reIndex[k];
            ++j;
          }
        }
        values.length = j;
        while (j < n) {
          index[j++] = 0;
        } // Bisect again to recompute lo0 and hi0.
        var bounds = refilter(values);
        lo0 = bounds[0], hi0 = bounds[1];
      }

      // Updates the selected values based on the specified bounds [lo, hi].
      // This implementation is used by all the public filter methods.
      function filterIndexBounds(bounds) {
        var lo1 = bounds[0],
            hi1 = bounds[1];

        if (refilterFunction) {
          refilterFunction = null;
          filterIndexFunction(function (d, i) {
            return lo1 <= i && i < hi1;
          });
          lo0 = lo1;
          hi0 = hi1;
          return dimension;
        }

        var i,
            j,
            k,
            added = [],
            removed = [];

        // Fast incremental update based on previous lo index.
        if (lo1 < lo0) {
          for (i = lo1, j = Math.min(lo0, hi1); i < j; ++i) {
            filters[k = index[i]] ^= one;
            added.push(k);
          }
        } else if (lo1 > lo0) {
          for (i = lo0, j = Math.min(lo1, hi0); i < j; ++i) {
            filters[k = index[i]] ^= one;
            removed.push(k);
          }
        }

        // Fast incremental update based on previous hi index.
        if (hi1 > hi0) {
          for (i = Math.max(lo1, hi0), j = hi1; i < j; ++i) {
            filters[k = index[i]] ^= one;
            added.push(k);
          }
        } else if (hi1 < hi0) {
          for (i = Math.max(lo0, hi1), j = hi0; i < j; ++i) {
            filters[k = index[i]] ^= one;
            removed.push(k);
          }
        }

        lo0 = lo1;
        hi0 = hi1;
        filterListeners.forEach(function (l) {
          l(one, added, removed);
        });
        return dimension;
      }

      // Filters this dimension using the specified range, value, or null.
      // If the range is null, this is equivalent to filterAll.
      // If the range is an array, this is equivalent to filterRange.
      // Otherwise, this is equivalent to filterExact.
      function filter(range$$1) {
        return range$$1 == null ? filterAll() : Array.isArray(range$$1) ? filterRange(range$$1) : typeof range$$1 === "function" ? filterFunction(range$$1) : filterExact(range$$1);
      }

      // Filters this dimension to select the exact value.
      function filterExact(value) {
        return filterIndexBounds((refilter = crossfilter_filterExact(bisect, value))(values));
      }

      // Filters this dimension to select the specified range [lo, hi].
      // The lower bound is inclusive, and the upper bound is exclusive.
      function filterRange(range$$1) {
        return filterIndexBounds((refilter = crossfilter_filterRange(bisect, range$$1))(values));
      }

      // Clears any filters on this dimension.
      function filterAll() {
        return filterIndexBounds((refilter = crossfilter_filterAll)(values));
      }

      // Filters this dimension using an arbitrary function.
      function filterFunction(f) {
        refilter = crossfilter_filterAll;

        filterIndexFunction(refilterFunction = f);

        lo0 = 0;
        hi0 = n;

        return dimension;
      }

      function filterIndexFunction(f) {
        var i,
            k,
            x,
            added = [],
            removed = [];

        for (i = 0; i < n; ++i) {
          if (!(filters[k = index[i]] & one) ^ !!(x = f(values[i], i))) {
            if (x) filters[k] &= zero, added.push(k);else filters[k] |= one, removed.push(k);
          }
        }
        filterListeners.forEach(function (l) {
          l(one, added, removed);
        });
      }

      // Returns the top K selected records based on this dimension's order.
      // Note: observes this dimension's filter, unlike group and groupAll.
      function top(k) {
        var array = [],
            i = hi0,
            j;

        while (--i >= lo0 && k > 0) {
          if (!filters[j = index[i]]) {
            array.push(data[j]);
            --k;
          }
        }

        return array;
      }

      // Returns the bottom K selected records based on this dimension's order.
      // Note: observes this dimension's filter, unlike group and groupAll.
      function bottom(k) {
        var array = [],
            i = lo0,
            j;

        while (i < hi0 && k > 0) {
          if (!filters[j = index[i]]) {
            array.push(data[j]);
            --k;
          }
          i++;
        }

        return array;
      }

      // Adds a new group to this dimension, using the specified key function.
      function group(key) {
        var group = {
          top: top,
          all: all,
          reduce: reduce,
          reduceCount: reduceCount,
          reduceSum: reduceSum,
          order: order,
          orderNatural: orderNatural,
          size: size,
          dispose: dispose,
          remove: dispose // for backwards-compatibility
        };

        // Ensure that this group will be removed when the dimension is removed.
        dimensionGroups.push(group);

        var groups,
            // array of {key, value}
        groupIndex,
            // object id ↦ group id
        groupWidth = 8,
            groupCapacity = crossfilter_capacity(groupWidth),
            k = 0,
            // cardinality
        select$$1,
            heap,
            reduceAdd,
            reduceRemove,
            reduceInitial,
            update = crossfilter_null,
            reset = crossfilter_null,
            resetNeeded = true,
            groupAll = key === crossfilter_null;

        if (arguments.length < 1) key = crossfilter_identity;

        // The group listens to the crossfilter for when any dimension changes, so
        // that it can update the associated reduce values. It must also listen to
        // the parent dimension for when data is added, and compute new keys.
        filterListeners.push(update);
        indexListeners.push(add);
        removeDataListeners.push(removeData);

        // Incorporate any existing data into the grouping.
        add(values, index, 0, n);

        // Incorporates the specified new values into this group.
        // This function is responsible for updating groups and groupIndex.
        function add(newValues, newIndex, n0, n1) {
          var oldGroups = groups,
              reIndex = crossfilter_index(k, groupCapacity),
              add = reduceAdd,
              initial = reduceInitial,
              k0 = k,
              // old cardinality
          i0 = 0,
              // index of old group
          i1 = 0,
              // index of new record
          j,
              // object id
          g0,
              // old group
          x0,
              // old key
          x1,
              // new key
          g,
              // group to add
          x; // key of group to add

          // If a reset is needed, we don't need to update the reduce values.
          if (resetNeeded) add = initial = crossfilter_null;

          // Reset the new groups (k is a lower bound).
          // Also, make sure that groupIndex exists and is long enough.
          groups = new Array(k), k = 0;
          groupIndex = k0 > 1 ? crossfilter_arrayLengthen(groupIndex, n) : crossfilter_index(n, groupCapacity);

          // Get the first old key (x0 of g0), if it exists.
          if (k0) x0 = (g0 = oldGroups[0]).key;

          // Find the first new key (x1), skipping NaN keys.
          while (i1 < n1 && !((x1 = key(newValues[i1])) >= x1)) {
            ++i1;
          } // While new keys remain…
          while (i1 < n1) {

            // Determine the lesser of the two current keys; new and old.
            // If there are no old keys remaining, then always add the new key.
            if (g0 && x0 <= x1) {
              g = g0, x = x0;

              // Record the new index of the old group.
              reIndex[i0] = k;

              // Retrieve the next old key.
              if (g0 = oldGroups[++i0]) x0 = g0.key;
            } else {
              g = { key: x1, value: initial() }, x = x1;
            }

            // Add the lesser group.
            groups[k] = g;

            // Add any selected records belonging to the added group, while
            // advancing the new key and populating the associated group index.
            while (!(x1 > x)) {
              groupIndex[j = newIndex[i1] + n0] = k;
              if (!(filters[j] & zero)) g.value = add(g.value, data[j]);
              if (++i1 >= n1) break;
              x1 = key(newValues[i1]);
            }

            groupIncrement();
          }

          // Add any remaining old groups that were greater than all new keys.
          // No incremental reduce is needed; these groups have no new records.
          // Also record the new index of the old group.
          while (i0 < k0) {
            groups[reIndex[i0] = k] = oldGroups[i0++];
            groupIncrement();
          }

          // If we added any new groups before any old groups,
          // update the group index of all the old records.
          if (k > i0) for (i0 = 0; i0 < n0; ++i0) {
            groupIndex[i0] = reIndex[groupIndex[i0]];
          }

          // Modify the update and reset behavior based on the cardinality.
          // If the cardinality is less than or equal to one, then the groupIndex
          // is not needed. If the cardinality is zero, then there are no records
          // and therefore no groups to update or reset. Note that we also must
          // change the registered listener to point to the new method.
          j = filterListeners.indexOf(update);
          if (k > 1) {
            update = updateMany;
            reset = resetMany;
          } else {
            if (!k && groupAll) {
              k = 1;
              groups = [{ key: null, value: initial() }];
            }
            if (k === 1) {
              update = updateOne;
              reset = resetOne;
            } else {
              update = crossfilter_null;
              reset = crossfilter_null;
            }
            groupIndex = null;
          }
          filterListeners[j] = update;

          // Count the number of added groups,
          // and widen the group index as needed.
          function groupIncrement() {
            if (++k === groupCapacity) {
              reIndex = crossfilter_arrayWiden(reIndex, groupWidth <<= 1);
              groupIndex = crossfilter_arrayWiden(groupIndex, groupWidth);
              groupCapacity = crossfilter_capacity(groupWidth);
            }
          }
        }

        function removeData() {
          if (k > 1) {
            var oldK = k,
                oldGroups = groups,
                seenGroups = crossfilter_index(oldK, oldK);

            // Filter out non-matches by copying matching group index entries to
            // the beginning of the array.
            for (var i = 0, j = 0; i < n; ++i) {
              if (filters[i]) {
                seenGroups[groupIndex[j] = groupIndex[i]] = 1;
                ++j;
              }
            }

            // Reassemble groups including only those groups that were referred
            // to by matching group index entries.  Note the new group index in
            // seenGroups.
            groups = [], k = 0;
            for (i = 0; i < oldK; ++i) {
              if (seenGroups[i]) {
                seenGroups[i] = k++;
                groups.push(oldGroups[i]);
              }
            }

            if (k > 1) {
              // Reindex the group index using seenGroups to find the new index.
              for (var i = 0; i < j; ++i) {
                groupIndex[i] = seenGroups[groupIndex[i]];
              }
            } else {
              groupIndex = null;
            }
            filterListeners[filterListeners.indexOf(update)] = k > 1 ? (reset = resetMany, update = updateMany) : k === 1 ? (reset = resetOne, update = updateOne) : reset = update = crossfilter_null;
          } else if (k === 1) {
            if (groupAll) return;
            for (var i = 0; i < n; ++i) {
              if (filters[i]) return;
            }groups = [], k = 0;
            filterListeners[filterListeners.indexOf(update)] = update = reset = crossfilter_null;
          }
        }

        // Reduces the specified selected or deselected records.
        // This function is only used when the cardinality is greater than 1.
        function updateMany(filterOne, added, removed) {
          if (filterOne === one || resetNeeded) return;

          var i, k, n, g;

          // Add the added values.
          for (i = 0, n = added.length; i < n; ++i) {
            if (!(filters[k = added[i]] & zero)) {
              g = groups[groupIndex[k]];
              g.value = reduceAdd(g.value, data[k]);
            }
          }

          // Remove the removed values.
          for (i = 0, n = removed.length; i < n; ++i) {
            if ((filters[k = removed[i]] & zero) === filterOne) {
              g = groups[groupIndex[k]];
              g.value = reduceRemove(g.value, data[k]);
            }
          }
        }

        // Reduces the specified selected or deselected records.
        // This function is only used when the cardinality is 1.
        function updateOne(filterOne, added, removed) {
          if (filterOne === one || resetNeeded) return;

          var i,
              k,
              n,
              g = groups[0];

          // Add the added values.
          for (i = 0, n = added.length; i < n; ++i) {
            if (!(filters[k = added[i]] & zero)) {
              g.value = reduceAdd(g.value, data[k]);
            }
          }

          // Remove the removed values.
          for (i = 0, n = removed.length; i < n; ++i) {
            if ((filters[k = removed[i]] & zero) === filterOne) {
              g.value = reduceRemove(g.value, data[k]);
            }
          }
        }

        // Recomputes the group reduce values from scratch.
        // This function is only used when the cardinality is greater than 1.
        function resetMany() {
          var i, g;

          // Reset all group values.
          for (i = 0; i < k; ++i) {
            groups[i].value = reduceInitial();
          }

          // Add any selected records.
          for (i = 0; i < n; ++i) {
            if (!(filters[i] & zero)) {
              g = groups[groupIndex[i]];
              g.value = reduceAdd(g.value, data[i]);
            }
          }
        }

        // Recomputes the group reduce values from scratch.
        // This function is only used when the cardinality is 1.
        function resetOne() {
          var i,
              g = groups[0];

          // Reset the singleton group values.
          g.value = reduceInitial();

          // Add any selected records.
          for (i = 0; i < n; ++i) {
            if (!(filters[i] & zero)) {
              g.value = reduceAdd(g.value, data[i]);
            }
          }
        }

        // Returns the array of group values, in the dimension's natural order.
        function all() {
          if (resetNeeded) reset(), resetNeeded = false;
          return groups;
        }

        // Returns a new array containing the top K group values, in reduce order.
        function top(k) {
          var top = select$$1(all(), 0, groups.length, k);
          return heap.sort(top, 0, top.length);
        }

        // Sets the reduce behavior for this group to use the specified functions.
        // This method lazily recomputes the reduce values, waiting until needed.
        function reduce(add, remove, initial) {
          reduceAdd = add;
          reduceRemove = remove;
          reduceInitial = initial;
          resetNeeded = true;
          return group;
        }

        // A convenience method for reducing by count.
        function reduceCount() {
          return reduce(crossfilter_reduceIncrement, crossfilter_reduceDecrement, crossfilter_zero);
        }

        // A convenience method for reducing by sum(value).
        function reduceSum(value) {
          return reduce(crossfilter_reduceAdd(value), crossfilter_reduceSubtract(value), crossfilter_zero);
        }

        // Sets the reduce order, using the specified accessor.
        function order(value) {
          select$$1 = heapselect_by(valueOf);
          heap = heap_by(valueOf);
          function valueOf(d) {
            return value(d.value);
          }
          return group;
        }

        // A convenience method for natural ordering by reduce value.
        function orderNatural() {
          return order(crossfilter_identity);
        }

        // Returns the cardinality of this group, irrespective of any filters.
        function size() {
          return k;
        }

        // Removes this group and associated event listeners.
        function dispose() {
          var i = filterListeners.indexOf(update);
          if (i >= 0) filterListeners.splice(i, 1);
          i = indexListeners.indexOf(add);
          if (i >= 0) indexListeners.splice(i, 1);
          i = removeDataListeners.indexOf(removeData);
          if (i >= 0) removeDataListeners.splice(i, 1);
          return group;
        }

        return reduceCount().orderNatural();
      }

      // A convenience function for generating a singleton group.
      function groupAll() {
        var g = group(crossfilter_null),
            all = g.all;
        delete g.all;
        delete g.top;
        delete g.order;
        delete g.orderNatural;
        delete g.size;
        g.value = function () {
          return all()[0].value;
        };
        return g;
      }

      // Removes this dimension and associated groups and event listeners.
      function dispose() {
        dimensionGroups.forEach(function (group) {
          group.dispose();
        });
        var i = dataListeners.indexOf(preAdd);
        if (i >= 0) dataListeners.splice(i, 1);
        i = dataListeners.indexOf(postAdd);
        if (i >= 0) dataListeners.splice(i, 1);
        i = removeDataListeners.indexOf(removeData);
        if (i >= 0) removeDataListeners.splice(i, 1);
        m &= zero;
        return filterAll();
      }

      return dimension;
    }

    // A convenience method for groupAll on a dummy dimension.
    // This implementation can be optimized since it always has cardinality 1.
    function groupAll() {
      var group = {
        reduce: reduce,
        reduceCount: reduceCount,
        reduceSum: reduceSum,
        value: value,
        dispose: dispose,
        remove: dispose // for backwards-compatibility
      };

      var reduceValue,
          reduceAdd,
          reduceRemove,
          reduceInitial,
          resetNeeded = true;

      // The group listens to the crossfilter for when any dimension changes, so
      // that it can update the reduce value. It must also listen to the parent
      // dimension for when data is added.
      filterListeners.push(update);
      dataListeners.push(add);

      // For consistency; actually a no-op since resetNeeded is true.
      add(data, 0, n);

      // Incorporates the specified new values into this group.
      function add(newData, n0) {
        var i;

        if (resetNeeded) return;

        // Add the added values.
        for (i = n0; i < n; ++i) {
          if (!filters[i]) {
            reduceValue = reduceAdd(reduceValue, data[i]);
          }
        }
      }

      // Reduces the specified selected or deselected records.
      function update(filterOne, added, removed) {
        var i, k, n;

        if (resetNeeded) return;

        // Add the added values.
        for (i = 0, n = added.length; i < n; ++i) {
          if (!filters[k = added[i]]) {
            reduceValue = reduceAdd(reduceValue, data[k]);
          }
        }

        // Remove the removed values.
        for (i = 0, n = removed.length; i < n; ++i) {
          if (filters[k = removed[i]] === filterOne) {
            reduceValue = reduceRemove(reduceValue, data[k]);
          }
        }
      }

      // Recomputes the group reduce value from scratch.
      function reset() {
        var i;

        reduceValue = reduceInitial();

        for (i = 0; i < n; ++i) {
          if (!filters[i]) {
            reduceValue = reduceAdd(reduceValue, data[i]);
          }
        }
      }

      // Sets the reduce behavior for this group to use the specified functions.
      // This method lazily recomputes the reduce value, waiting until needed.
      function reduce(add, remove, initial) {
        reduceAdd = add;
        reduceRemove = remove;
        reduceInitial = initial;
        resetNeeded = true;
        return group;
      }

      // A convenience method for reducing by count.
      function reduceCount() {
        return reduce(crossfilter_reduceIncrement, crossfilter_reduceDecrement, crossfilter_zero);
      }

      // A convenience method for reducing by sum(value).
      function reduceSum(value) {
        return reduce(crossfilter_reduceAdd(value), crossfilter_reduceSubtract(value), crossfilter_zero);
      }

      // Returns the computed reduce value.
      function value() {
        if (resetNeeded) reset(), resetNeeded = false;
        return reduceValue;
      }

      // Removes this group and associated event listeners.
      function dispose() {
        var i = filterListeners.indexOf(update);
        if (i >= 0) filterListeners.splice(i);
        i = dataListeners.indexOf(add);
        if (i >= 0) dataListeners.splice(i);
        return group;
      }

      return reduceCount();
    }

    // Returns the number of records in this crossfilter, irrespective of any filters.
    function size() {
      return n;
    }

    return arguments.length ? add(arguments[0]) : crossfilter;
  }

  // Returns an array of size n, big enough to store ids up to m.
  function crossfilter_index(n, m) {
    return (m < 0x101 ? crossfilter_array8 : m < 0x10001 ? crossfilter_array16 : crossfilter_array32)(n);
  }

  // Constructs a new array of size n, with sequential values from 0 to n - 1.
  function crossfilter_range(n) {
    var range$$1 = crossfilter_index(n, n);
    for (var i = -1; ++i < n;) {
      range$$1[i] = i;
    }return range$$1;
  }

  function crossfilter_capacity(w) {
    return w === 8 ? 0x100 : w === 16 ? 0x10000 : 0x100000000;
  }
})('object' !== 'undefined' && exports || commonjsGlobal);
});

var crossfilter = crossfilter$2.crossfilter;

var accessor = function (field) {
    return function (d) {
        return d[field];
    };
};

function DataFrame(data, store) {
    if (d3Let.isArray(data) || !arguments.length) data = {
        store: store,
        data: data || [],
        dimensions: {}
    };
    Object.defineProperties(this, {
        _inner: {
            get: function get() {
                return data;
            }
        },
        store: {
            get: function get() {
                return data.store;
            }
        },
        data: {
            get: function get() {
                return data.data;
            }
        },
        dimensions: {
            get: function get() {
                return data.dimensions;
            }
        },
        type: {
            get: function get() {
                return 'dataframe';
            }
        }
    });
}

DataFrame.prototype = {
    constructor: DataFrame,

    dataFrame: function dataFrame() {
        return this;
    },
    size: function size() {
        return this.data.length;
    },
    new: function _new(serie) {
        if (d3Let.isArray(serie)) return new DataFrame(serie, null, this.store);else return new DataFrame(this._inner, serie);
    },
    cf: function cf() {
        if (!this._inner.cf) this._inner.cf = crossfilter(this.data);
        return this._inner.cf;
    },


    //  Create and return a crossfilter dimension
    //  If value is not specified, keepExisting is by default true, and any
    //  existing dimension name is recycled.
    dimension: function dimension(name, value, keepExisting) {
        if (arguments.length === 1) keepExisting = true;
        var current = this.dimensions[name];
        if (current) {
            if (keepExisting) return current;
            current.dispose();
        }
        if (!value) value = accessor(name);
        this.dimensions[name] = this.cf().dimension(value);
        return this.dimensions[name];
    },


    //  Sort a dataframe by name and return the top values or all of them if
    //  top is not defined. The name can be a function.
    sortby: function sortby(name, top) {
        return this.new(this.dimension(name).top(top || Infinity));
    },


    // return a new dataframe by pivoting values for field name
    pivot: function pivot(dimension, key, value, total) {
        var group = this.dimension(dimension).group();
        if (!total) total = 'total';
        return this.new(group.reduce(pivoter(1), pivoter(-1), Object).all().map(function (d) {
            return d.value;
        }));

        function pivoter(m) {
            var pk = void 0,
                pv = void 0;
            return function (o, record) {
                pk = '' + record[key];
                pv = m * record[value];
                o[dimension] = record[dimension];
                if (pk in o) o[pk] += pv;else o[pk] = pv;
                if (total in o) o[total] += pv;else o[total] = pv;
                return o;
            };
        }
    },
    add: function add() {
        //this._inner.cf.add(data);
    },
    map: function map$$1(mapper) {
        return this.new(this.data.map(mapper));
    }
};

//
//  Array DataSource
//  ====================
//
//  Data is given in an array, pkain & simple
var array = {
    schema: {
        type: "object",
        description: 'array of data',
        properties: {
            data: {
                type: "array",
                description: "array of data"
            }
        }
    },

    initialise: function initialise(config) {
        this._data = config.data;
    },
    getConfig: function getConfig(config) {
        if (d3Let.isArray(config)) return { data: config };else if (d3Let.isObject(config) && d3Let.isArray(config.data)) return config;
    },
    getData: function getData() {
        return this.asFrame(this._data);
    }
};

var prefix = '[d3-data-source]';

var warn = function (msg) {
    d3View.viewProviders.logger.warn(prefix + ' ' + msg);
};

var schemes = ['http', 'https', 'ws', 'wss'];

var isUrl = function (value) {
    return d3Let.isString(value) && schemes.indexOf(value.split('://')[0]) > -1;
};

var CSV = d3Collection.set(['text/plain', 'text/csv', 'application/vnd.ms-excel']);
//
//  Remote dataSource
//  ===================
//
//  handle Json and csv data
var remote = {
    schema: {
        type: "object",
        description: 'Remote data resource',
        properties: {
            url: {
                type: "string",
                description: "url for fetching data"
            }
        }
    },

    getConfig: function getConfig(config) {
        if (isUrl(config)) return { url: config };else if (d3Let.isObject(config) && config.url) return config;
    },
    initialise: function initialise(config) {
        this.url = config.url;
    },
    getData: function getData() {
        var fetch = d3View.viewProviders.fetch,
            self = this;
        if (!fetch) {
            warn('fetch provider not available, cannot submit');
            return [];
        }
        return fetch(this.url).then(parse).then(function (data) {
            return self.asFrame(data);
        });
    }
};

function parse(response) {
    var ct = (response.headers.get('content-type') || '').split(';')[0];
    if (CSV.has(ct)) return response.text().then(d3Dsv.csvParse);else if (ct === 'text/tab-separated-values') return response.text().then(d3Dsv.tsvParse);else if (ct === 'application/json') return response.json();else {
        warn('Cannot load content type \'' + ct + '\'');
        return [];
    }
}

//
//  A composite dataSource
//  ===================
//
//  A composite data source has the source attribute with the name of one
//  or more data sets to use as the source for this data set.
//  The source property is useful in combination with a transform pipeline
//  to derive new data.
//  If string-valued, indicates the name of the source data set.
//  If array-valued, specifies a collection of data source names that
//  should be merged (unioned) together.
var composite = {
    schema: {
        type: "object",
        description: 'Composite data source for combining data together',
        properties: {
            source: {
                type: "array",
                description: "Array of data sources keys",
                item: {
                    type: "string"
                }
            },
            expression: {
                type: "string",
                description: "expression to evaluate, must return a data frame or a Promise"
            }
        }
    },

    initialise: function initialise(config) {
        this.source = config.source;
        this.expression = config.expression ? d3View.viewExpression(config.expression) : null;
    },
    getConfig: function getConfig(config) {
        if (d3Let.isObject(config) && config.source) {
            if (!d3Let.isArray(config.source)) config.source = [config.source];
            return config;
        }
    },
    getData: function getData(context) {
        var store = this.store,
            sources = this.source,
            expression = this.expression,
            self = this;

        return Promise.all(sources.map(function (source) {
            return store.getData(source, context);
        })).then(function (frames) {
            var fc = void 0;
            if (frames.length === 1) fc = frames[0];else if (self.config.merge) fc = self.mergeFrames(frames);else {
                fc = new FrameCollection(store);
                frames.forEach(function (frame, index) {
                    fc.frames.set(sources[index], frame);
                });
            }
            if (expression) {
                var model = store.model.$child(d3Let.assign({}, context, { frame: fc }));
                fc = expression.eval(model);
            }
            if (d3Let.isPromise(fc)) return fc.then(function (data) {
                return self.asFrame(data);
            });else return self.asFrame(fc);
        });
    },


    // TODO: implement frame merging
    mergeFrames: function mergeFrames(frames) {
        return frames[0];
    }
};

function FrameCollection(store) {
    this.frames = d3Collection.map();
    Object.defineProperties(this, {
        store: {
            get: function get() {
                return store;
            }
        },
        type: {
            get: function get() {
                return 'frameCollection';
            }
        }
    });
}

FrameCollection.prototype = {
    new: function _new(data) {
        return new DataFrame(data, this.store);
    },
    dataFrame: function dataFrame() {
        var frames = this.frames.values();
        for (var i = 0; i < frames.length; ++i) {
            if (frames[i].type === 'dataframe') return frames[i];
        }
    }
};

var expression = {
    schema: {
        type: "object",
        description: 'Expression to evaluate by the data store',
        properties: {
            expression: {
                type: "string",
                description: "expression to evaluate, must return a data frame or a Promise"
            }
        }
    },

    initialise: function initialise(config) {
        this.expression = d3View.viewExpression(config.expression);
    },
    getConfig: function getConfig(config) {
        if (d3Let.isObject(config) && config.expression) return config;
    },
    getData: function getData(context) {
        var self = this,
            model = this.store.model.$child(context),
            result = this.expression.eval(model);
        if (d3Let.isPromise(result)) return result.then(function (data) {
            return self.asFrame(data);
        });else return self.asFrame(result);
    }
};

var transformFactory = function (options) {
    var transform = options.transform,
        schema = options.schema || {},
        jsonValidator = d3View.viewProviders.jsonValidator ? d3View.viewProviders.jsonValidator(options.schema) : dummyValidator;
    if (!schema.type) schema.type = 'object';

    function transformFactory(config) {
        var valid = jsonValidator.validate(config);

        if (!valid) return jsonValidator.logError();

        return doTransform;

        function doTransform(frame) {
            return transform(frame, config);
        }
    }

    transformFactory.schema = schema;

    return transformFactory;
};

var dummyValidator = {
    validate: function validate() {
        return true;
    }
};

//
// Create a groupby transform from a config object
var filter = transformFactory({
    schema: {
        description: "The filter transform removes objects from a data frame based on a provided filter expression",
        properties: {
            expr: {
                type: "string"
            }
        },
        required: ["expr"]
    },
    transform: function transform(frame, config) {
        var expr = d3View.viewExpression(config.expr);
        return frame.data.reduce(function (data, d, index) {
            if (expr.safeEval({ d: d, index: index, frame: frame })) data.push(d);
            return data;
        }, []);
    }
});

var prefix$1 = '[d3-visualize]';

var warn$1 = function (msg, err) {
    d3View.viewProviders.logger.warn(prefix$1 + ' ' + msg);
    if (err) d3View.viewProviders.logger.error(err.stack);
};

var fillArray = function (size, value) {
    var a = new Array(size);
    a.fill(value);
    return a;
};

var operations = d3Collection.map({
    count: count,
    max: d3Array.max,
    min: d3Array.min,
    sum: d3Array.sum,
    mean: d3Array.mean,
    median: d3Array.median,
    variance: d3Array.variance,
    deviation: d3Array.deviation
});

var scalar_operations = d3Collection.map({
    count: function count(agg) {
        return agg + 1;
    },
    sum: function sum$$1(agg, v) {
        return agg + v;
    },

    max: Math.max,
    min: Math.min
});

function count(array, accessor) {
    return array.reduce(function (v, d) {
        if (accessor(d) !== undefined) v += 1;
        return v;
    }, 0);
}
//
// The aggregate transform groups and summarizes an imput data stream to
// produce a derived output data stream. Aggregate transforms can be used
// to compute counts, sums, averages and other descriptive statistics over
// groups of data objects.
var aggregate = function (config) {
    var fields = config.fields,
        ops = config.ops,
        as = config.as,
        groupby = config.groupby;

    if (!fields && !ops) return countAll;

    if (!d3Let.isArray(fields)) return warn$1('Aggregate transforms expect an array of fields');
    if (!ops) ops = 'count';
    if (d3Let.isString(ops)) ops = fillArray(fields.length, ops);
    if (!d3Let.isArray(ops)) return warn$1('Aggregate transform expects an array of ops');
    if (ops.length < fields.length) warn$1('Aggregate transforms expects an ops array with same length as fields');
    if (!as) as = [];
    if (!d3Let.isArray(as)) return warn$1('Aggregate transform expects an array of as fields');
    return aggregate;

    function countAll(frame) {
        var key = void 0;
        return frame.data.reduce(function (o, d) {
            for (key in d) {
                if (key in o) o[key] += 1;else o[key] = 1;
            }
            return o;
        }, {});
    }

    function aggregate(frame) {
        var data = [],
            name,
            op;

        if (groupby) return group(frame);

        fields.forEach(function (field, index) {
            name = ops[index];
            op = count;
            if (name) {
                op = operations.get(name);
                if (!op) {
                    op = count;
                    warn$1('Operation ' + ops[index] + ' is not supported, use count');
                }
            }
            data.push({
                label: as[index] || field,
                data: op(frame.data, function (d) {
                    return d[field];
                })
            });
        });
        return data;
    }

    //
    //  Perform aggregation with a set of data fields to group by
    function group(frame) {
        var v = void 0,
            name = void 0,
            op = void 0;
        var entries = fields.map(function (field, index) {
            name = ops[index];
            op = scalar_operations.get('count');
            if (name) {
                op = scalar_operations.get(name);
                if (!op) {
                    op = scalar_operations.get('count');
                    warn$1('Operation ' + name + ' is not supported, use count');
                }
            }
            return {
                field: field,
                as: as[index] || field,
                op: op
            };
        });

        return frame.dimension(groupby).group().reduce(function (o, record) {
            return entries.reduce(function (oo, entry) {
                v = 0;
                if (entry.as in oo) v = oo[entry.as];
                oo[entry.as] = entry.op(v, record[entry.field]);
                return oo;
            }, o);
        }, null, Object).all().map(function (d) {
            d.value[groupby] = d.key;
            return d.value;
        });
    }
};

//
// Apply a cross filter to an array of fields
var crossfilter$4 = function (config) {
    var fields = config.fields,
        query = config.query;

    if (!d3Let.isArray(fields)) return warn$1('crossfilter transform expects an array of fields');
    if (!d3Let.isArray(query)) return warn$1('crossfilter transform expects an array of query');
    if (query.length != fields.length) return warn$1('crossfilter transform expects an query array with same length as fields');

    return crossfilter;

    function crossfilter(frame) {
        var dim = void 0,
            q = void 0;
        fields.forEach(function (field, index) {
            q = query[index];
            if (d3Let.isString(q)) q = frame.store.eval(q);
            dim = frame.dimension(field).filterAll();
            if (q) dim.filter(q);
        });
        if (dim) return frame.new(dim.top(Infinity));
        return frame;
    }
};

//
// Create a groupby transform from a config object
var timeseries = function (config) {
    var sortby = config.sortby,
        groupby = config.groupby;

    if (!sortby) warn$1('timeseries transform requires a "sortby" entry');

    return timeseries;

    function timeseries(frame) {
        if (sortby) {
            if (groupby) {
                var dim = frame.dimension(groupby),
                    groups = dim.group().top(Infinity),
                    newframe = frame.new([]),
                    tmp;
                groups.forEach(function (group) {
                    tmp = frame.new(dim.filterExact(group.key).top(Infinity)).dimension(sortby).group().top(Infinity);
                    newframe.series.set(group.key, frame.new(tmp).dimension('key').top(Infinity));
                });
                return newframe;
            } else {
                return frame.new(frame.dimension(sortby).top(Infinity));
            }
        }
        return frame;
    }
};

//
//  Global options for visuals
//  ============================
//
var globalOptions = {
    // visual data source
    dataSource: null,
    //
    size: {
        // width set by the parent element
        width: null,
        // height set as percentage of width
        height: '70%'
    }
};

//
//  Map Fields Transform
//  ========================
//
//  Convert a set af fields to a different data type
//
globalOptions.dateFormat = '%d-%b-%y';

var converters = {
    date: function date(entry) {
        return d3TimeFormat.utcParse(entry.dateFormat || globalOptions.dateFormat);
    },
    number: function number() {
        return parseFloat;
    }
};

var mapfields = transformFactory({
    shema: {
        description: "map a field values into another type",
        properties: {
            fields: {
                type: "object"
            },
            dateFormat: {
                type: "string"
            }
        },
        required: ["fields"]
    },
    transform: function transform(frame, config) {
        var fields = d3Collection.map(config.fields),
            mappers = [];
        var i = void 0,
            converter = void 0;

        fields.each(function (entry, key) {
            if (d3Let.isString(entry)) entry = { type: entry };
            converter = converters[entry.type];
            if (!converter) warn$1('Cannot convert field ' + key + ' to type ' + entry.type);else mappers.push([key, converter(entry)]);
        });

        if (mappers.length) frame = frame.map(function (d) {
            for (i = 0; i < mappers.length; ++i) {
                d[mappers[i][0]] = mappers[i][1](d[mappers[i][0]]);
            }return d;
        });

        return frame;
    }
});

var minmax = function (value, min$$1, max$$1) {
    if (max$$1 !== undefined) value = Math.min(value, max$$1);
    return min$$1 === undefined ? value : Math.max(value, min$$1);
};

var DEFAULT_METHOD = 'ema';
var DEFAULT_PERIOD = 10;
var DEFAULT_ALPHA = 0.5;
var MAXALPHA = 0.999999;

//
// Exponential moving average transform
// Useful for smoothing out volatile timeseries
var movingaverage = transformFactory({
    shema: {
        description: "Create moving average series from existing one. The new series override the existing one unless the as array is provided",
        properties: {
            method: {
                type: "string"
            },
            alpha: {
                type: "number"
            },
            period: {
                type: "number"
            },
            fields: {
                type: "array",
                items: {
                    type: "string"
                }
            },
            as: {
                type: "array",
                items: {
                    type: "string"
                }
            }
        },
        required: ["fields"]
    },
    transform: function transform(frame, config) {
        var as = config.as || [],
            method = config.method || DEFAULT_METHOD;
        var fieldto = void 0,
            y = void 0,
            s = void 0;

        config.fields.forEach(function (field, index) {
            fieldto = as[index] || field;
            //
            // Simple Moving Average
            if (method === 'sma') {
                var period = Math.max(config.period || DEFAULT_PERIOD, 1),
                    cumulate = [],
                    buffer = [];
                frame.data.forEach(function (d, index) {
                    y = d[field];
                    if (cumulate.length === period) y -= buffer.splice(0, 1)[0];
                    buffer.push(y);
                    if (index) y += cumulate[cumulate.length - 1];
                    cumulate.push(y);
                    d[fieldto] = y / cumulate.length;
                });
                //
                // Exponential moving average
            } else {
                var alpha = minmax(config.alpha || DEFAULT_ALPHA, 1 - MAXALPHA, MAXALPHA);

                frame.data.forEach(function (d, index) {
                    y = d[field];
                    if (!index) s = y;else s = alpha * s + (1 - alpha) * y;
                    d[fieldto] = s;
                });
            }
        });
    }
});

//
// Create a groupby transform from a config object
var groupsmall = transformFactory({
    schema: {
        description: "Group entries which are below a given aggregate cutoff",
        properties: {
            field: {
                type: "string"
            },
            cutoff: {
                type: "number"
            }
        },
        required: ["field", "cutoff"]
    },
    transform: function transform(frame, config) {
        var get = accessor(config.field),
            total = d3Array.sum(frame.data, get);
        var children = [],
            aggregate = 0;
        return frame.dimension(config.field).bottom(Infinity).reduce(function (data, d) {
            aggregate += get(d);
            if (aggregate / total < config.cutoff) children.push(d);else if (children) {
                children.push(d);
                d = {
                    label: 'other',
                    children: children
                };
                d[config.field] = aggregate;
                children = null;
                data.push(d);
            } else data.push(d);
            return data;
        }, []);
    }
});

//
// First order difference along a dimension for a group of fields
var diff = transformFactory({
    schema: {
        description: "Perfrom a difference for a group of fields along a dimension. It is possible to perform a difference for different groups",
        properties: {
            dimension: {
                type: "string"
            },
            period: {
                type: "integer",
                minimum: 1
            },
            fields: {
                type: "array",
                items: {
                    type: "string"
                }
            },
            as: {
                type: "array",
                items: {
                    type: "string"
                }
            },
            groupby: {
                type: "string"
            }
        },
        required: ["dimension", "fields"]
    },
    transform: function transform(frame, config) {
        var as = config.as || [],
            period = config.period || 1,
            data = [];

        if (config.groupby) {
            var g = frame.dimension(config.groupby),
                groups = g.group().all();
            groups.forEach(function (d) {
                return difference(frame.new(g.filterAll().filter(d.key).top(Infinity)));
            });
        } else {
            difference(frame.new());
        }

        return data;

        function difference(df) {
            var dim = df.dimension(config.dimension),
                zeros = config.fields.reduce(function (z, field) {
                z[field] = 0;return z;
            }, {}),
                stack = [];
            var dd = void 0,
                prev = void 0;

            dim.top(Infinity).forEach(function (d, index) {
                dd = d3Let.assign({}, d);
                stack.push(d);
                if (index > period) prev = stack.splice(0, 1)[0];else prev = zeros;
                config.fields.forEach(function (field, index) {
                    d[as[index] || field] = d[field] - prev[field];
                });
                data.push(dd);
            });
        }
    }
});

// Collection of transforms
//
//  transforms Store
var transformStore = d3Let.assign(d3Collection.map({
    filter: filter,
    aggregate: aggregate,
    mapfields: mapfields,
    timeseries: timeseries,
    crossfilter: crossfilter$4,
    movingaverage: movingaverage,
    groupsmall: groupsmall,
    diff: diff
}), {
    add: function add(name, o) {
        this.set(name, transformFactory(o));
    }
});

//  Apply data transforms to a series
//  Allow for asynchronous transforms
function applyTransforms(frame, transforms) {
    if (!transforms) return frame;
    return applyt(frame, transforms.slice());
}

function applyt(frame, transforms, res) {
    if (d3Let.isArray(res)) frame = frame.new(res);else if (res) frame = res;
    if (transforms.length) {
        var transform = transforms.splice(0, 1)[0],
            ts = transform ? transform(frame) : null;
        if (d3Let.isPromise(ts)) return ts.then(function (res) {
            return applyt(frame, transforms, res);
        });else return applyt(frame, transforms, ts);
    }
    return frame;
}

var dataEvents = d3Dispatch.dispatch('init', 'data');

//
//  DataSource prototype
//  ======================
var dataSourcePrototype = {
    schema: { properties: {} },
    // get the config
    // This method is used by the prototype
    // to check if the config object is a valid one
    getConfig: function getConfig() {},


    // initialise the data source with a config object
    initialise: function initialise() {},
    getData: function getData() {},


    //
    addTransforms: function addTransforms(transforms) {
        var self = this;
        var t = void 0;
        if (!transforms) return;
        if (!d3Let.isArray(transforms)) transforms = [transforms];
        transforms.forEach(function (transform) {
            t = transformStore.get(transform.type);
            if (!t) warn$1('Transform type "' + transform.type + '" not known');else self.transforms.push(t(transform));
        });
    },

    //
    // given a data object returns a Cross filter object
    asFrame: function asFrame(data) {
        if (data && !d3Let.isArray(data) && data.constructor !== DataFrame) data = [data];
        if (d3Let.isArray(data)) {
            data = data.map(function (entry) {
                if (entry.constructor !== Object) entry = { data: entry };
                return entry;
            });
            data = new DataFrame(data, this.store);
        }
        return applyTransforms(data, this.transforms);
    }
};

// DataSource container
var dataSources = d3Let.assign(d3Collection.map(), {
    events: dataEvents,

    add: function add(type, source) {

        // DataSource constructor
        function DataSource(config, store) {
            initDataSource(this, type, config, store);
        }

        DataSource.prototype = d3Let.assign({}, dataSourcePrototype, source);
        DataSource.prototype.constructor = DataSource;

        this.set(type, DataSource);
        return DataSource;
    },


    // Create a new DataSource
    create: function create(config, store) {
        var sources = this.values(),
            cfg;
        for (var i = 0; i < sources.length; ++i) {
            cfg = sources[i].prototype.getConfig(config);
            if (cfg) return new sources[i](cfg, store);
        }
    }
});

function initDataSource(dataSource, type, config, store) {

    var name = store.dataName(d3Let.pop(config, 'name')),
        transforms = [];

    // store.natural = cf.dimension(d => d._id);

    Object.defineProperties(dataSource, {
        name: {
            get: function get() {
                return name;
            }
        },
        store: {
            get: function get() {
                return store;
            }
        },
        type: {
            get: function get() {
                return type;
            }
        },
        // transforms to apply to data
        transforms: {
            get: function get() {
                return transforms;
            }
        },
        config: {
            get: function get() {
                return config;
            }
        }
    });

    dataSource.initialise(config);
    dataSource.addTransforms(d3Let.pop(config, 'transforms'));
    store.sources.set(name, dataSource);
    dataEvents.call('init', undefined, dataSource);
}

dataSources.add('array', array);
dataSources.add('remote', remote);
dataSources.add('composite', composite);
dataSources.add('expression', expression);

//
//  DataStore
//  ==============
//
//  Map names to datasets
//  Individual data sets are assumed to contain a collection of records
//  (or “rows”), which may contain any number of named data
//  attributes (fields, or “columns”).
//  Records are modeled using standard JavaScript objects.
function DataStore(model) {
    var sources = d3Collection.map();

    Object.defineProperties(this, {
        sources: {
            get: function get() {
                return sources;
            }
        }
    });

    // transforms function
    this.transforms = d3Let.assign({}, transformStore);
    this.dataCount = 0;
    this.model = model && d3Let.isFunction(model.$child) ? model : d3View.viewModel(model);
}

DataStore.prototype = {
    size: function size() {
        return this.sources.size();
    },


    // Add a new serie from a data source
    addSources: function addSources(config) {
        //
        // data is a string, it must be already registered with store
        if (d3Let.isString(config)) config = { source: config };

        if (d3Let.isArray(config)) {
            var self = this;
            return config.map(function (cfg) {
                return dataSources.create(cfg, self);
            });
        } else if (config) {
            return dataSources.create(config, this);
        }
    },
    addTransforms: function addTransforms(transforms) {
        d3Let.assign(this.transforms, transforms);
    },


    // set, get or remove a data source
    source: function source(name, _source) {
        if (arguments.length === 1) return this.sources.get(name);
        if (_source === null) {
            var p = this.sources.get(name);
            this.sources.remove(name);
            return p;
        }
        this.sources.set(name, _source);
        return this;
    },
    clearCache: function clearCache() {
        this.sources.each(function (ds) {
            delete ds.cachedFrame;
        });
    },


    // get data from a source
    getData: function getData(source, context) {
        var ds = this.sources.get(source);
        if (!ds) throw new Error('Data source ' + source + ' not available');
        if (ds.cachedFrame) return Promise.resolve(ds.cachedFrame);
        var data = ds.getData(context);
        if (!d3Let.isPromise(data)) data = Promise.resolve(data);
        return data.then(function (frame) {
            if (ds.config.cache) ds.cachedFrame = frame;
            return frame;
        });
    },
    eval: function _eval(expr, context) {
        var ctx = this.model.$child(context);
        ctx.dataStore = this;
        return d3View.viewExpression(expr).safeEval(ctx);
    },
    dataName: function dataName(name) {
        this.dataCount++;
        if (name) return '' + name;
        var def = this.source('default');
        if (!def) return 'default';
        return 'source' + this.dataCount;
    }
};

var round = function (x, n) {
    return n ? Math.round(x * (n = Math.pow(10, n))) / n : Math.round(x);
};

var WIDTH = 400;
var HEIGHT = '75%';

function sizeValue(value, size) {
    if (typeof value === "string" && value.indexOf('%') === value.length - 1) return round(0.01 * parseFloat(value) * size);
    return +value;
}

// Internal function for evaluating paper dom size
function getSize(element, options) {
    var size = {
        width: options.width,
        height: options.height
    };

    if (!size.width) {
        size.width = getWidth(element);
        if (size.width) size.widthElement = getWidthElement(element);else size.width = WIDTH;
    }

    if (!size.height) {
        size.height = getHeight(element);
        if (size.height) size.heightElement = getHeightElement(element);else size.height = HEIGHT;
    }

    // Allow to specify height as a percentage of width
    size.height = minmax(sizeValue(size.height, size.width), undefined, windowHeight());
    return size;
}

function getWidth(element) {
    var el = getParentElementRect(element, 'width');
    if (el) return elementWidth(el);
}

function getHeight(element) {
    var el = getParentElementRect(element, 'width');
    if (el) return elementHeight(el);
}

function getWidthElement(element) {
    return getParentElementRect(element, 'width');
}

function getHeightElement(element) {
    return getParentElementRect(element, 'height');
}

function windowHeight() {
    return window.innerHeight;
}

function elementWidth(el) {
    var w = el.getBoundingClientRect()['width'],
        s = d3Selection.select(el),
        left = padding(s.style('padding-left')),
        right = padding(s.style('padding-right'));
    return w - left - right;
}

function elementHeight(el) {
    var w = el.getBoundingClientRect()['height'],
        s = d3Selection.select(el),
        top = padding(s.style('padding-top')),
        bottom = padding(s.style('padding-bottom'));
    return w - top - bottom;
}

function getParentElementRect(element, key) {
    var parent = element.node ? element.node() : element,
        v = void 0;
    while (parent && parent.tagName !== 'BODY') {
        v = parent.getBoundingClientRect()[key];
        if (v) return parent;
        parent = parent.parentNode;
    }
}

function padding(value) {
    if (value && value.substring(value.length - 2) == 'px') return +value.substring(0, value.length - 2);
    return 0;
}

function clone(o) {
    if (d3Let.isArray(o)) return o.map(clone);else if (d3Let.isObject(o)) {
        var v = {};
        for (var key in o) {
            v[key] = clone(o[key]);
        }
        return v;
    } else return o;
}

var CONTAINERS = ['visual', 'container'];

//
//  Gloval visuals object
//  ==========================
//
//  Container of
//  * live visuals
//  * visual types
//  * paper types
//  * visual events
var visuals = {
    live: [],
    types: {},
    papers: {},
    options: globalOptions,
    schema: {
        title: "Visualize Specification Language",
        type: "object",
        definitions: {
            size: {
                oneOf: [{
                    type: "number",
                    description: "size in pixels",
                    minimum: 0
                }, {
                    type: "string",
                    description: "Size as a percentage"
                }]
            }
        }
    },
    events: d3Dispatch.dispatch('before-init', 'after-init', 'resize', 'before-draw', 'after-draw')
};

function defaultsFromProperties(properties) {
    var options = {};
    var value = void 0,
        prop = void 0,
        key = void 0;
    for (key in properties) {
        prop = properties[key];
        if (prop['$ref']) prop = schemaDef(prop['$ref']);
        value = prop.default;
        options[key] = value === undefined ? null : value;
    }
    return options;
}

function schemaDef(d) {
    var dd = d.split('/');
    return visuals.schema.definitions[dd[dd.length - 1]] || {};
}

//
//  Visual Interface
//  ====================
//
//  Base prototype object for visuals
//
var visualPrototype = {

    // initialise the visual with options
    initialise: function initialise() {},


    // draw this visual
    draw: function draw() {},


    // redraw the visual
    // this is the method that should be invoked by applications
    redraw: function redraw(fetchData) {
        if (this.drawing) {
            var self = this,
                event = 'after-draw.' + this.toString();
            visuals.events.on(event, function () {
                // remove callback
                visuals.events.on(event, null);
                self.redraw(fetchData);
            });
        } else this.drawing = this.draw(fetchData);
        return this.drawing;
    },


    // destroy the visual
    destroy: function destroy() {},
    toString: function toString() {
        return this.visualType + '-' + this.model.uid;
    },


    // get a reactive model for type
    getModel: function getModel(type) {
        if (!type) type = this.visualType;
        var model = this.model[type];
        if (!model && type in globalOptions) {
            var options = d3Let.pop(this.options, type),
                self = this;
            if (this.visualParent) model = this.visualParent.getModel(type).$child(options);else {
                model = this.model.$new(globalOptions[type]);
                model.$update(options);
            }
            this.model[type] = model;
            //
            // Trigger redraw when model change
            // Do not fecth data
            model.$on(function () {
                return self.redraw(false);
            });
        }
        return model;
    },


    // apply the visualmodel uid to a name
    idname: function idname(name) {
        if (!name) name = this.visualType;
        return name + '-' + this.model.uid;
    },
    modelProperty: function modelProperty(name, model) {
        var me = this.getModel(),
            value = me[name];
        return value === undefined ? model[name] : value;
    },
    dim: function dim(size, refSize, minSize, maxSize) {
        return minmax(sizeValue(size, refSize), minSize, maxSize);
    },

    // pop this visual from a container
    pop: function pop$$1(container) {
        if (container) {
            var idx = container.live.indexOf(this);
            if (idx > -1) container.live.splice(idx, 1);
        }
    },
    getVisualSchema: function getVisualSchema(name) {
        var schema = this.options.visuals ? this.options.visuals[name] : null,
            parent = this.visualParent;
        if (parent && d3Let.isString(schema)) {
            name = schema;
            schema = parent.getVisualSchema(name);
        } else if (parent && !schema) schema = parent.getVisualSchema(name);
        if (d3Let.isObject(schema)) return clone(schema);
    }
};

//
//  Create a new Visual Constructor
var createVisual = function (type, proto) {
    var schema = d3Let.pop(proto, 'schema');
    if (schema) {
        visuals.options[type] = defaultsFromProperties(schema);
        visuals.schema.definitions[type] = {
            type: "object",
            properties: d3Let.assign({
                data: {
                    "$ref": "#/definitions/data"
                }
            }, schema)
        };
    }

    function Visual(element, options, parent, model) {
        Object.defineProperties(this, {
            visualType: {
                get: function get() {
                    return type;
                }
            },
            isViz: {
                get: function get() {
                    return CONTAINERS.indexOf(type) === -1;
                }
            },
            visualRoot: {
                get: function get() {
                    if (this.visualParent) return this.visualParent.visualRoot;
                    return this;
                }
            }
        });
        this.visualParent = parent;
        this.model = parent ? parent.model.$new() : model || d3View.viewModel();
        this.options = options || {};
        this.drawing = false;
        visuals.events.call('before-init', undefined, this);
        this.initialise(element);
        visuals.events.call('after-init', undefined, this);
    }

    Visual.prototype = d3Let.assign({}, d3View.viewBase, visualPrototype, proto);
    Visual.prototype.constructor = Visual;
    visuals.types[type] = Visual;
    return Visual;
};

//
//  Visual
//  =============
//
//  A Visual is a a container of visual layers and it is
//  associated with an HTML element
//
//  Usually a Visual contains one layer only, however it is possible to
//  have more than one by combining several layers together. Importantly,
//  layers in one visual generate HTMLElements which are children of the visual
//  element and inherit both the width and height.
//
//  A visual register itself with the visuals.live array
//
var Visual = createVisual('visual', {

    schema: {
        render: {
            type: 'string',
            enum: ['canvas', 'svg'],
            default: 'svg'
        },
        // width set by the parent element
        width: {
            description: 'Width of the visual',
            '$refs': '#/definitions/size'
        },
        // height set as percentage of width
        height: {
            description: 'Height of the visual',
            '$refs': '#/definitions/size',
            default: "70%"
        }
    },

    initialise: function initialise(element) {
        if (!element) throw new Error('HTMLElement required by visual group');
        if (this.visualParent && this.visualParent.visualType !== 'container') throw new Error('Visual parent can be a container only');
        if (!this.select(element).select('.paper').node()) this.select(element).append('div').classed('paper', true);

        Object.defineProperties(this, {
            element: {
                get: function get() {
                    return element;
                }
            },
            paperElement: {
                get: function get() {
                    return this.sel.select('.paper');
                }
            },
            sel: {
                get: function get() {
                    return this.select(element);
                }
            },
            size: {
                get: function get() {
                    return [this.width, this.height];
                }
            }
        });

        this.sel.classed('d3-visual', true);
        // list of layers which define the visual
        this.layers = [];
        this.drawCount = 0;
        visuals.live.push(this);
        element.__visual__ = this;
        if (this.visualParent) this.visualParent.live.push(this);
    },
    activate: function activate() {
        this.layers.forEach(function (layer) {
            return layer.activate();
        });
    },
    deactivate: function deactivate() {
        this.layers.forEach(function (layer) {
            return layer.deactivate();
        });
    },
    getVisual: function getVisual() {
        return this;
    },


    // Draw the visual
    draw: function draw(fetchData) {
        if (this.drawing) {
            warn$1(this.toString() + ' already drawing');
            return this.drawing;
        } else if (!this.drawCount) {
            this.drawCount = 1;
            this.fit();
        } else {
            this.drawCount++;
            this.clear();
        }
        var self = this;
        visuals.events.call('before-draw', undefined, this);
        return Promise.all(this.layers.map(function (visual) {
            return visual.redraw(fetchData);
        })).then(function () {
            delete self.drawing;
            visuals.events.call('after-draw', undefined, self);
        }, function (err) {
            delete self.drawing;
            warn$1('Could not draw ' + self.toString() + ': ' + err, err);
        });
    },
    clear: function clear() {},


    // Add a new visual to this group
    addVisual: function addVisual(options) {
        var type = d3Let.pop(options, 'type');
        var VisualClass = visuals.types[type];
        if (!VisualClass) warn$1('Cannot add visual "' + type + '", not available');else return new VisualClass(this.element, options, this);
    },

    //
    // Fit the root element to the size of the parent element
    fit: function fit() {
        this.resize(null, true);
        return this;
    },


    // resize the chart
    resize: function resize(size, fit) {
        if (!size) size = getSize(this.element.parentNode || this.element, this.getModel());
        var currentSize = this.size;

        if (fit || currentSize[0] !== size.width || currentSize[1] !== size.height) {
            if (!fit) d3View.viewDebug('Resizing "' + this.toString() + '"');
            this.width = size.width;
            this.height = size.height;
            // this.paper.style('width', this.width + 'px').style('height', this.height + 'px');
            this.paperElement.style('height', this.height + 'px');
            visuals.events.call('resize', undefined, this);
            // if we are not just fitting draw the visual without fetching data!!
            if (!fit) this.draw(false);
        }
        return this;
    },
    paper: function paper() {
        var paper = this.__paper,
            render = this.getModel().render;
        if (paper && paper.paperType === render) return paper;
        var PaperType = visuals.papers[render];
        if (!PaperType) throw new Error('Unknown paper ' + render);
        paper = new PaperType(this);
        this.__paper = paper;
        return paper;
    },
    getPaperGroup: function getPaperGroup(gname) {
        return this.paper().group(gname);
    },
    destroy: function destroy() {
        this.pop(this.visualParent);
        this.pop(visuals);
    }
});

if (d3Let.inBrowser) {
    // DOM observer
    // Check for changes in the DOM that leads to visual actions
    var observer = new MutationObserver(visualManager);
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
}

//
//  Clears visualisation going out of scope
function visualManager(records) {
    records.forEach(function (record) {
        var nodes = record.removedNodes;
        if (!nodes || !nodes.length) return; // phantomJs hack
        nodes.forEach(function (node) {
            if (node.querySelectorAll) {
                if (!node.__visual__) d3Selection.select(node).selectAll('.d3-visual').each(destroy);else destroy.call(node);
            }
        });
    });
}

function destroy() {
    var viz = this.__visual__;
    if (viz) {
        viz.destroy();
        d3View.viewDebug('Removed "' + viz.toString() + '" from DOM, ' + visuals.live.length + ' live visuals left');
    } else warn$1('d3-visual without __visual__ object');
}

//
//  crateChart
//
//  A chart is a drawing of a data frame in two dimension
var createChart = function (type) {
    if (d3View.viewProviders.visualPlugins) {
        extendVisualPrototype(d3View.viewProviders.visualPlugins);
        d3View.viewProviders.visualPlugins = null;
    }
    var protos = [{}, vizPrototype, chartPrototype];
    for (var i = 1; i < arguments.length; ++i) {
        protos.push(arguments[i]);
    }return createVisual(type, d3Let.assign.apply(undefined, protos));
};

function extendVisualPrototype(plugins) {
    var options = void 0,
        proto = void 0;
    Object.keys(plugins).forEach(function (name) {
        options = plugins[name].options;
        proto = plugins[name].prototype;
        if (options) visuals.options[name] = options;
        if (proto) d3Let.assign(vizPrototype, proto);
    });
}

//  Viz Prototype
//  =================
var vizPrototype = {
    $: null,

    initialise: function initialise(element) {
        // No visual parent, create the visual
        var visual = this.visualParent;
        if (this.options.active !== undefined) this.active = d3Let.pop(this.options, 'active');else this.active = true;
        if (!visual) {
            this.visualParent = visual = new Visual(element, this.options, null, this.model);
            this.model = visual.model.$new();
            this.options = {};
        } else if (!visual.layers) throw new Error('visual parent of ' + this.visualType + ' does not have layers');
        visual.layers.push(this);
    },


    //
    // paper object for this visualisation
    paper: function paper() {
        return this.visualParent.paper();
    },
    activate: function activate(callback) {
        if (!this.active) {
            this.active = true;
            this.group().transition(this.model.uid).on('end', function () {
                if (callback) callback();
            }).style('opacity', 1);
        }
        return this;
    },
    deactivate: function deactivate(callback) {
        if (this.active) {
            this.active = false;
            this.group().transition(this.model.uid).on('end', function () {
                if (callback) callback();
            }).style('opacity', 0);
        }
        return this;
    },
    getVisual: function getVisual() {
        return this.visualParent.getVisual();
    },


    // a group selection for a given name
    group: function group(name) {
        var me = this.visualType + '-' + this.model.uid,
            group = this.visualParent.getPaperGroup(me);
        if (name && name !== this.visualType) return this.paper().childGroup(group, name);else return group;
    },
    translate: function translate(x, y) {
        if (d3Let.isFunction(x)) {
            return function (d) {
                var xt = x(d) || 0,
                    yt = y(d) || 0;
                return 'translate(' + xt + ', ' + yt + ')';
            };
        } else return 'translate(' + x + ', ' + y + ')';
    },
    getD3: function getD3(prefix, name) {
        return this.$['' + prefix + name[0].toUpperCase() + name.substring(1)];
    },
    displayError: function displayError() {}
};

var chartPrototype = {

    //  override draw method
    draw: function draw(fetchData) {
        var _this = this;

        if (this.drawing) {
            warn$1(this.toString() + ' already drawing');
            return this.drawing;
        }
        var self = this,
            doDraw = this.doDraw;

        this.paper().size(this.boundingBox(true));

        if (!this.active) return;

        visuals.events.call('before-draw', undefined, this);

        if (fetchData === false && this._drawArgs) {
            delete self.drawing;
            doDraw.apply(self, this._drawArgs);
            visuals.events.call('after-draw', undefined, self);
        } else {
            return Promise.all([this.requires ? d3View.viewProviders.require.apply(undefined, this.requires) : [],
            // this.getMetaData(),
            this.getData()]).then(function (args) {
                delete self.drawing;
                var frame = args[1];
                if (frame) {
                    _this.$ = args[0];
                    _this.frame = frame;
                    doDraw.apply(self);
                    visuals.events.call('after-draw', undefined, self);
                }
            }, function (err) {
                delete self.drawing;
                warn$1('Could not draw ' + self.toString() + ': ' + err, err);
                _this.displayError(err);
            });
        }
    }
};

function createPaper(type, proto) {

    function Paper(viz, uid) {
        var element = this.initialise(viz, uid);
        Object.defineProperties(this, {
            element: {
                get: function get() {
                    return element;
                }
            },
            sel: {
                get: function get() {
                    return this.select(element);
                }
            },
            paperType: {
                get: function get() {
                    return type;
                }
            }
        });
    }

    Paper.prototype = d3Let.assign({}, d3View.viewBase, paperPrototype, proto);

    visuals.papers[type] = Paper;
    return Paper;
}

var paperPrototype = {
    initialise: function initialise() {},
    transition: function transition$$1() {},
    size: function size(box) {
        this.sel.attr('width', box.width).attr('height', box.height);
        return this;
    },
    group: function group(cname, transform) {
        return this.childGroup(this.sel, cname, transform);
    },
    childGroup: function childGroup(g, cname, transform) {
        if (!cname) cname = 'main';
        var ge = g.selectAll('.' + cname).data([0]).enter().append('g').classed(cname, true);
        // TODO, not sure we need this anymore - we gave applyTransform
        if (transform) ge.attr('transform', transform).merge().attr('transform', transform);
        return g.select('.' + cname);
    },
    dim: function dim(value) {
        return value;
    }
};

var Svg = createPaper('svg', {
    initialise: function initialise(visual, uid) {
        if (!uid) visual.model.uid;
        var svg = visual.paperElement.select('svg#' + uid);
        if (!svg.size()) svg = visual.paperElement.append('svg').attr('id', uid).classed(visual.visualType, true).style('position', 'absolute');
        return svg.node();
    }
});

var Div = createPaper('div', {
    initialise: function initialise(viz) {
        var uid = viz.model.uid,
            visual = viz.visualParent;
        var div = visual.paperElement.select('div#' + uid);
        if (!div.size()) div = visual.paperElement.append('div').attr('id', uid).classed(visual.visualType, true).style('position', 'absolute');
        return div.node();
    },
    size: function size(box) {
        this.sel.style('width', box.width + 'px').style('height', box.height + 'px');
        return this;
    },
    childGroup: function childGroup(g, cname) {
        if (!cname) cname = 'main';
        g.selectAll('.' + cname).data([0]).enter().append('div').classed(cname, true);
        return g.select('.' + cname);
    }
});

var extendObject = function (obj, cfg) {
    var keys = void 0;
    if (cfg.$events) keys = cfg.$events.keys();else keys = Object.keys(cfg);
    keys.forEach(function (key) {
        if (d3Let.isFunction(obj[key])) obj[key](cfg[key]);
    });
    return obj;
};

//
//  Axis Plugin
//  ================
//
//  * A visual must require "d3-scale"
//
vizPrototype.getScale = function (cfg) {
    if (d3Let.isString(cfg)) cfg = { type: cfg };
    var scale = this.getD3('scale', cfg.type)();
    return extendObject(scale, cfg);
};

//
//  Add a menu buttom to a visual

globalOptions.menu = {
    display: false,
    height: '8%',
    maxHeight: 50,
    minHeight: 20
};

visuals.events.on('after-init.menu', function (viz) {
    if (viz.visualType === 'visual') {
        var menu = viz.getModel('menu');
        if (menu.display) {
            viz.menu = viz.sel.insert('nav', ':first-child').classed('d3-nav navbar p-1', true);
            viz.menu.append('h4').classed('title', true);
        }
    }
});

visuals.events.on('before-draw.menu', function (viz) {
    if (viz && viz.menu) {
        refreshMenu(viz);
    }
});

function refreshMenu(viz) {
    var menu = viz.getModel('menu'),
        height = viz.dim(menu.height, viz.height, menu.minHeight, menu.maxHeight);
    viz.menu.style('height', height + 'px');
}

//
//  dataStore integration with visuals
d3Let.assign(visuals.schema.definitions, {
    data: {
        type: "array",
        items: {
            '$ref': '#/definitions/dataSource'
        }
    },
    dataSource: {
        oneOf: dataSources.values().map(function (Ds) {
            var schema = Ds.prototype.schema;
            schema.properties.transforms = { '$ref': '#/definitions/transforms' };
            return schema;
        })
    }
});
//  getData method
//  =====================
//
//  Inject a method for easily retrieving data from the datastore
vizPrototype.getData = function () {
    var name = this.model.data;
    if (!name) {
        warn$1('Visual ' + this.visualType + ' without data name, cannot get data');
        return;
    }
    return this.dataStore.getData(name, { $visual: this });
};

//
// Context for expression evaluation
vizPrototype.getContext = function (context) {
    return this.dataStore.model.$child(context);
};

visuals.events.on('before-init.data', function (viz) {
    if (!viz.isViz) return;
    // remove data from options
    viz.data = d3Let.pop(viz.options, 'data');
});

visuals.events.on('after-init.data', function (viz) {
    Object.defineProperties(viz, {
        dataStore: {
            get: function get() {
                return viz.model.root.dataStore;
            }
        }
    });
    if (viz.isViz) setupLayer(viz);else setupVisual(viz);
});

function setupVisual(visual) {
    var store = visual.dataStore,
        data = d3Let.pop(visual.options, 'data');
    //
    if (!store) {
        // create the data store for the visual or container
        store = new DataStore(visual.getModel('dataContext'));
        visual.model.root.dataStore = store;
    }
    store.addSources(data);
}

function setupLayer(layer) {
    var store = layer.dataStore,
        data = d3Let.pop(layer, 'data');
    if (!data) return;
    if (d3Let.isString(data)) data = { source: data };
    if (!data.name) data.name = layer.model.uid;
    data = store.addSources(data);
    if (data) layer.model.$set('data', data.name);else warn$1('Could not create data source ' + data.name);
}

var formats = d3Collection.map();

var cachedFormat = function (specifier, value) {
    var fmt = formats.get(specifier);
    if (!fmt) {
        fmt = d3Format.format(specifier);
        formats.set(specifier, fmt);
    }
    return arguments.length == 2 ? fmt(value) : fmt;
};

var formats$1 = d3Collection.map();

var cachedFormatTime = function (specifier, value) {
    var fmt = formats$1.get(specifier);
    if (!fmt) {
        fmt = d3TimeFormat.timeFormat(specifier);
        formats$1.set(specifier, fmt);
    }
    return arguments.length == 2 ? fmt(value) : fmt;
};

//
//  Add formatting capabilities to visuals
//
// Visual Data Context
visuals.options.dataContext = {
    $format: cachedFormat,
    $formatTime: cachedFormatTime
};

vizPrototype.format = function (fmt) {
    var store = this.dataStore,
        formatter = store.eval(fmt);
    if (formatter) return formatter;
    try {
        return cachedFormat(fmt);
    } catch (e) {
        return cachedFormatTime(fmt);
    }
};

visuals.options.font = {
    size: '3%',
    minSize: 10,
    maxSize: 20,
    stroke: '#333',
    family: null
};

vizPrototype.font = function (box, font) {
    font = font ? font : this.getModel('font');

    var model = this.getModel(),
        size = this.dim(font.size, box.height, font.minSize, font.maxSize);
    if (model.fontSizeMultiplier) size *= model.fontSizeMultiplier;
    return size;
};

if (!globalOptions.resizeDelay) globalOptions.resizeDelay = 200;

if (d3Let.inBrowser) {
    var resize = d3View.viewDebounce(function () {
        visuals.live.forEach(function (p) {
            return p.resize();
        });
    }, globalOptions.resizeDelay);

    d3Selection.select(window).on('resize.visuals', resize);
}

// Title plot annotation
globalOptions.title = {
    text: null,
    size: '3%',
    minSize: 15,
    maxSize: 25,
    offset: ['10%', 0]
};

visuals.events.on('before-init.title', function (viz) {
    var title = viz.options.title;
    if (d3Let.isString(title)) viz.options.title = { text: title };
});

visuals.events.on('after-draw.title', function (viz) {
    var title = viz.getModel('title');
    var visual = viz;
    if (visual.visualType === 'visual') delete visual.__title;else if (viz.isViz) visual = viz.visualParent;else return;
    if (!title.text) return;
    if (visual.menu && !visual.__title) {
        visual.__title = title;
        menuTitle(visual, title);
    } else if (viz.isViz) {
        var box = viz.boundingBox(true),
            font = viz.getModel('font'),
            stroke = title.stroke || font.stroke,
            size = viz.font(box, title),
            text = viz.group().selectAll('text.chartitle').data([title.text]),
            top = viz.dim(title.offset[0], box.vizHeight),
            left = viz.dim(title.offset[1], box.vizWidth),
            translate = viz.translate(box.margin.left + box.innerWidth / 2 + left, top);
        text.enter().append('text').classed('chartitle', true).attr("transform", translate).style("text-anchor", "middle").style("font-size", size).style("fill", stroke).text(function (d) {
            return d;
        }).merge(text).transition().attr("transform", translate).style("font-size", size).style("fill", stroke).text(function (d) {
            return d;
        });
    }
});

function menuTitle(visual, title) {
    var height = number(visual.menu.style('height')),
        maxSize = title.maxSize ? Math.min(height - 4, title.maxSize) : height - 4,
        size = visual.dim(title.size, visual.width, title.minSize, maxSize);
    visual.menu.select('.title').html(title.text).style('font-size', size + 'px').style('line-height', height + 'px');
}

function number(px) {
    return +px.substring(0, px.length - 2);
}

var KEYS = ['top', 'bottom', 'left', 'right'];
var LEFTRIGHT = ['left', 'right'];

// margin for visual marks
globalOptions.margin = {
    top: 20,
    bottom: 20,
    left: 20,
    right: 20
};
// padding for the visual paper
globalOptions.padding = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
};

//
//  Bounding box for a viz
//  ==========================
vizPrototype.boundingBox = function (clearCache) {
    if (clearCache) clearBBCache(this);
    if (!this.__boundingBox) {
        var width = this.visualParent.width,
            height = this.visualParent.height,
            padding = calculate(this.getModel('padding'), width, height),
            vizWidth = width - padding.left - padding.right,
            vizHeight = height - padding.top - padding.bottom,
            margin = calculate(this.getModel('margin'), vizWidth, vizHeight),
            total = KEYS.reduce(function (o, key) {
            o[key] = margin[key] + padding[key];
            return o;
        }, {});
        this.__boundingBox = {
            margin: margin,
            padding: padding,
            total: total,
            width: width,
            height: height,
            vizWidth: vizWidth,
            vizHeight: vizHeight,
            innerWidth: width - total.left - total.right,
            innerHeight: height - total.top - total.bottom,
            $nomargins: $nomargins
        };
    }
    return this.__boundingBox;
};

visuals.events.on('after-init.margin', function (viz) {
    viz.margin = margins('margin', viz);
    viz.padding = margins('padding', viz);
});

visuals.events.on('before-draw.margin', function (viz) {
    if (viz.isViz) clearBBCache(viz);
});

function margins(name, viz) {
    var value = viz.options[name];
    if (value !== undefined && !d3Let.isObject(value)) viz.options[name] = marginv(value || 0);
}

function calculate(model, width, height) {
    return KEYS.reduce(function (o, key) {
        o[key] = sizeValue(model[key], LEFTRIGHT.indexOf(key) > -1 ? width : height);
        return o;
    }, {});
}

function clearBBCache(viz) {
    delete viz.__boundingBox;
    if (d3Let.isArray(viz.layers)) viz.layers.forEach(clearBBCache);
}

function $nomargins() {
    return {
        width: this.innerWidth,
        height: this.innerHeight,
        margin: marginv(0),
        padding: marginv(0),
        total: marginv(0),
        innerWidth: this.innerWidth,
        innerHeight: this.innerHeight,
        $nomargins: this.$nomargins
    };
}

function marginv(v) {
    return {
        left: v,
        right: v,
        top: v,
        bottom: v
    };
}

//
//  Axis Plugin
//  ================
//
//  * A visual must require "d3-axis"
//
var axisDefaults = {
    ticks: 5,
    tickSize: 6,
    tickSizeOuter: null,
    //
    // tick labels
    rotate: null,
    ancor: 'end',
    format: null,
    timeFormat: '%Y-%m-%d',
    stroke: '#333',
    hide: null, // specify a pixel size below which tick labels are not displayed
    //
    // title
    title: null,
    titleRotate: null,
    titleOffset: 0.7
};

visuals.options.xAxis = d3Let.assign({
    location: "bottom"
}, axisDefaults);

visuals.options.yAxis = d3Let.assign({
    location: "left"
}, axisDefaults);

vizPrototype.getAxis = function (orientation, scale) {
    return this.getD3('axis', orientation)(scale);
};

vizPrototype.xAxis1 = function (location, scale, box, value) {
    var model = this.getModel('xAxis'),
        axis = this._axis(location, scale, model, value),
        ga = this.group('x-axis');
    this.applyTransform(ga, this.translateAxis(location, box));
    formatAxis(ga.transition(this.transition('x-axis')).call(axis), model, scale);
    if (model.title) this.axisTitle(ga, location, scale, box, model);
    return ga;
};

vizPrototype.yAxis1 = function (location, scale, box, value) {
    var model = this.getModel('yAxis'),
        axis = this._axis(location, scale, model, value),
        ga = this.group('y-axis');
    this.applyTransform(ga, this.translateAxis(location, box));
    formatAxis(ga.transition(this.transition('x-axis')).call(axis), model, scale);
    if (model.title) this.axisTitle(ga, location, scale, box, model);
    return ga;
};

//
//  Apply Axis title
vizPrototype.axisTitle = function (ga, location, scale, box, model) {
    var title = ga.selectAll('text.title').data([model.title]),
        rotate = model.titleRotate || 0,
        x = 0,
        y = 0;

    if (!rotate && (location === 'right' || location === 'left')) rotate = -90;
    if (location == "left") {
        x = -model.titleOffset * box.margin.left;
        y = box.innerHeight / 2;
    }
    var translate = 'translate(' + x + ',' + y + ') rotate(' + rotate + ')',
        font = this.font(box);

    title.enter().append('text').classed('title', true).attr("transform", translate).style("text-anchor", "middle").style("font-size", font).style("fill", model.stroke).text(function (d) {
        return d;
    }).merge(title).transition().attr("transform", translate).style("font-size", font).style("fill", model.stroke).text(function (d) {
        return d;
    });
};

vizPrototype.translateAxis = function (location, box) {
    if (location === 'top' || location === 'left') return this.translate(box.margin.left, box.margin.top);else if (location === 'bottom') return this.translate(box.margin.left, box.margin.top + box.innerHeight);else return this.translate(box.margin.left + box.innerWidth, box.margin.top);
};

vizPrototype._axis = function (location, scale, model, value) {
    var axis = this.getAxis(location, scale).tickSize(model.tickSize);
    if (model.tickSizeOuter !== null) axis.tickSizeOuter(model.tickSizeOuter);
    if (d3Let.isDate(value)) axis.tickFormat(d3TimeFormat.timeFormat(model.timeFormat));else if (model.format !== null) axis.tickFormat(this.format(model.format));
    return axis.ticks(model.ticks);
};

function formatAxis(ga, model, scale) {
    ga.select('path.domain').attr('stroke', model.stroke);
    var ticks = ga.selectAll('text').attr('fill', model.stroke);
    if (model.hide) {
        var range$$1 = scale.range(),
            dim = Math.abs(range$$1[0] - range$$1[range$$1.length - 1]);
        if (dim < model.hide) ga.style('opacity', 0);else ga.style('opacity', 1);
    }
    if (model.rotate) {
        ticks.attr('transform', 'rotate(' + model.rotate + ')').style('text-anchor', model.ancor);
    }
}

vizPrototype.getSymbol = function (name) {
    return this.$.symbol().type(this.getD3('symbol', name));
};

vizPrototype.getCurve = function (name) {
    return this.getD3('curve', name);
};

vizPrototype.getStack = function () {
    var model = this.getModel();
    if (model.stack) {
        var s = this.$.stack();
        if (model.stackOrder) s.order(this.getD3('stack', model.stackOrder));
        if (model.stackOffset) s.offset(this.getD3('stack', model.stackOffset));
        return s;
    }
};

var define$1 = function (constructor, factory, prototype) {
  constructor.prototype = factory.prototype = prototype;
  prototype.constructor = constructor;
};

function extend(parent, definition) {
  var prototype = Object.create(parent.prototype);
  for (var key in definition) {
    prototype[key] = definition[key];
  }return prototype;
}

function Color() {}

var _darker = 0.7;
var _brighter = 1 / _darker;

var reI = "\\s*([+-]?\\d+)\\s*";
var reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*";
var reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*";
var reHex3 = /^#([0-9a-f]{3})$/;
var reHex6 = /^#([0-9a-f]{6})$/;
var reRgbInteger = new RegExp("^rgb\\(" + [reI, reI, reI] + "\\)$");
var reRgbPercent = new RegExp("^rgb\\(" + [reP, reP, reP] + "\\)$");
var reRgbaInteger = new RegExp("^rgba\\(" + [reI, reI, reI, reN] + "\\)$");
var reRgbaPercent = new RegExp("^rgba\\(" + [reP, reP, reP, reN] + "\\)$");
var reHslPercent = new RegExp("^hsl\\(" + [reN, reP, reP] + "\\)$");
var reHslaPercent = new RegExp("^hsla\\(" + [reN, reP, reP, reN] + "\\)$");

var named = {
  aliceblue: 0xf0f8ff,
  antiquewhite: 0xfaebd7,
  aqua: 0x00ffff,
  aquamarine: 0x7fffd4,
  azure: 0xf0ffff,
  beige: 0xf5f5dc,
  bisque: 0xffe4c4,
  black: 0x000000,
  blanchedalmond: 0xffebcd,
  blue: 0x0000ff,
  blueviolet: 0x8a2be2,
  brown: 0xa52a2a,
  burlywood: 0xdeb887,
  cadetblue: 0x5f9ea0,
  chartreuse: 0x7fff00,
  chocolate: 0xd2691e,
  coral: 0xff7f50,
  cornflowerblue: 0x6495ed,
  cornsilk: 0xfff8dc,
  crimson: 0xdc143c,
  cyan: 0x00ffff,
  darkblue: 0x00008b,
  darkcyan: 0x008b8b,
  darkgoldenrod: 0xb8860b,
  darkgray: 0xa9a9a9,
  darkgreen: 0x006400,
  darkgrey: 0xa9a9a9,
  darkkhaki: 0xbdb76b,
  darkmagenta: 0x8b008b,
  darkolivegreen: 0x556b2f,
  darkorange: 0xff8c00,
  darkorchid: 0x9932cc,
  darkred: 0x8b0000,
  darksalmon: 0xe9967a,
  darkseagreen: 0x8fbc8f,
  darkslateblue: 0x483d8b,
  darkslategray: 0x2f4f4f,
  darkslategrey: 0x2f4f4f,
  darkturquoise: 0x00ced1,
  darkviolet: 0x9400d3,
  deeppink: 0xff1493,
  deepskyblue: 0x00bfff,
  dimgray: 0x696969,
  dimgrey: 0x696969,
  dodgerblue: 0x1e90ff,
  firebrick: 0xb22222,
  floralwhite: 0xfffaf0,
  forestgreen: 0x228b22,
  fuchsia: 0xff00ff,
  gainsboro: 0xdcdcdc,
  ghostwhite: 0xf8f8ff,
  gold: 0xffd700,
  goldenrod: 0xdaa520,
  gray: 0x808080,
  green: 0x008000,
  greenyellow: 0xadff2f,
  grey: 0x808080,
  honeydew: 0xf0fff0,
  hotpink: 0xff69b4,
  indianred: 0xcd5c5c,
  indigo: 0x4b0082,
  ivory: 0xfffff0,
  khaki: 0xf0e68c,
  lavender: 0xe6e6fa,
  lavenderblush: 0xfff0f5,
  lawngreen: 0x7cfc00,
  lemonchiffon: 0xfffacd,
  lightblue: 0xadd8e6,
  lightcoral: 0xf08080,
  lightcyan: 0xe0ffff,
  lightgoldenrodyellow: 0xfafad2,
  lightgray: 0xd3d3d3,
  lightgreen: 0x90ee90,
  lightgrey: 0xd3d3d3,
  lightpink: 0xffb6c1,
  lightsalmon: 0xffa07a,
  lightseagreen: 0x20b2aa,
  lightskyblue: 0x87cefa,
  lightslategray: 0x778899,
  lightslategrey: 0x778899,
  lightsteelblue: 0xb0c4de,
  lightyellow: 0xffffe0,
  lime: 0x00ff00,
  limegreen: 0x32cd32,
  linen: 0xfaf0e6,
  magenta: 0xff00ff,
  maroon: 0x800000,
  mediumaquamarine: 0x66cdaa,
  mediumblue: 0x0000cd,
  mediumorchid: 0xba55d3,
  mediumpurple: 0x9370db,
  mediumseagreen: 0x3cb371,
  mediumslateblue: 0x7b68ee,
  mediumspringgreen: 0x00fa9a,
  mediumturquoise: 0x48d1cc,
  mediumvioletred: 0xc71585,
  midnightblue: 0x191970,
  mintcream: 0xf5fffa,
  mistyrose: 0xffe4e1,
  moccasin: 0xffe4b5,
  navajowhite: 0xffdead,
  navy: 0x000080,
  oldlace: 0xfdf5e6,
  olive: 0x808000,
  olivedrab: 0x6b8e23,
  orange: 0xffa500,
  orangered: 0xff4500,
  orchid: 0xda70d6,
  palegoldenrod: 0xeee8aa,
  palegreen: 0x98fb98,
  paleturquoise: 0xafeeee,
  palevioletred: 0xdb7093,
  papayawhip: 0xffefd5,
  peachpuff: 0xffdab9,
  peru: 0xcd853f,
  pink: 0xffc0cb,
  plum: 0xdda0dd,
  powderblue: 0xb0e0e6,
  purple: 0x800080,
  rebeccapurple: 0x663399,
  red: 0xff0000,
  rosybrown: 0xbc8f8f,
  royalblue: 0x4169e1,
  saddlebrown: 0x8b4513,
  salmon: 0xfa8072,
  sandybrown: 0xf4a460,
  seagreen: 0x2e8b57,
  seashell: 0xfff5ee,
  sienna: 0xa0522d,
  silver: 0xc0c0c0,
  skyblue: 0x87ceeb,
  slateblue: 0x6a5acd,
  slategray: 0x708090,
  slategrey: 0x708090,
  snow: 0xfffafa,
  springgreen: 0x00ff7f,
  steelblue: 0x4682b4,
  tan: 0xd2b48c,
  teal: 0x008080,
  thistle: 0xd8bfd8,
  tomato: 0xff6347,
  turquoise: 0x40e0d0,
  violet: 0xee82ee,
  wheat: 0xf5deb3,
  white: 0xffffff,
  whitesmoke: 0xf5f5f5,
  yellow: 0xffff00,
  yellowgreen: 0x9acd32
};

define$1(Color, color, {
  displayable: function displayable() {
    return this.rgb().displayable();
  },
  toString: function toString() {
    return this.rgb() + "";
  }
});

function color(format$$1) {
  var m;
  format$$1 = (format$$1 + "").trim().toLowerCase();
  return (m = reHex3.exec(format$$1)) ? (m = parseInt(m[1], 16), new Rgb(m >> 8 & 0xf | m >> 4 & 0x0f0, m >> 4 & 0xf | m & 0xf0, (m & 0xf) << 4 | m & 0xf, 1)) : (m = reHex6.exec(format$$1)) ? rgbn(parseInt(m[1], 16)) // #ff0000
  : (m = reRgbInteger.exec(format$$1)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
  : (m = reRgbPercent.exec(format$$1)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
  : (m = reRgbaInteger.exec(format$$1)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
  : (m = reRgbaPercent.exec(format$$1)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
  : (m = reHslPercent.exec(format$$1)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
  : (m = reHslaPercent.exec(format$$1)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
  : named.hasOwnProperty(format$$1) ? rgbn(named[format$$1]) : format$$1 === "transparent" ? new Rgb(NaN, NaN, NaN, 0) : null;
}

function rgbn(n) {
  return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
}

function rgba(r, g, b, a) {
  if (a <= 0) r = g = b = NaN;
  return new Rgb(r, g, b, a);
}

function rgbConvert(o) {
  if (!(o instanceof Color)) o = color(o);
  if (!o) return new Rgb();
  o = o.rgb();
  return new Rgb(o.r, o.g, o.b, o.opacity);
}

function rgb(r, g, b, opacity) {
  return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
}

function Rgb(r, g, b, opacity) {
  this.r = +r;
  this.g = +g;
  this.b = +b;
  this.opacity = +opacity;
}

define$1(Rgb, rgb, extend(Color, {
  brighter: function brighter(k) {
    k = k == null ? _brighter : Math.pow(_brighter, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  darker: function darker(k) {
    k = k == null ? _darker : Math.pow(_darker, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  rgb: function rgb() {
    return this;
  },
  displayable: function displayable() {
    return 0 <= this.r && this.r <= 255 && 0 <= this.g && this.g <= 255 && 0 <= this.b && this.b <= 255 && 0 <= this.opacity && this.opacity <= 1;
  },
  toString: function toString() {
    var a = this.opacity;a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
    return (a === 1 ? "rgb(" : "rgba(") + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", " + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", " + Math.max(0, Math.min(255, Math.round(this.b) || 0)) + (a === 1 ? ")" : ", " + a + ")");
  }
}));

function hsla(h, s, l, a) {
  if (a <= 0) h = s = l = NaN;else if (l <= 0 || l >= 1) h = s = NaN;else if (s <= 0) h = NaN;
  return new Hsl(h, s, l, a);
}

function hslConvert(o) {
  if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
  if (!(o instanceof Color)) o = color(o);
  if (!o) return new Hsl();
  if (o instanceof Hsl) return o;
  o = o.rgb();
  var r = o.r / 255,
      g = o.g / 255,
      b = o.b / 255,
      min$$1 = Math.min(r, g, b),
      max$$1 = Math.max(r, g, b),
      h = NaN,
      s = max$$1 - min$$1,
      l = (max$$1 + min$$1) / 2;
  if (s) {
    if (r === max$$1) h = (g - b) / s + (g < b) * 6;else if (g === max$$1) h = (b - r) / s + 2;else h = (r - g) / s + 4;
    s /= l < 0.5 ? max$$1 + min$$1 : 2 - max$$1 - min$$1;
    h *= 60;
  } else {
    s = l > 0 && l < 1 ? 0 : h;
  }
  return new Hsl(h, s, l, o.opacity);
}

function hsl(h, s, l, opacity) {
  return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
}

function Hsl(h, s, l, opacity) {
  this.h = +h;
  this.s = +s;
  this.l = +l;
  this.opacity = +opacity;
}

define$1(Hsl, hsl, extend(Color, {
  brighter: function brighter(k) {
    k = k == null ? _brighter : Math.pow(_brighter, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  darker: function darker(k) {
    k = k == null ? _darker : Math.pow(_darker, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  rgb: function rgb() {
    var h = this.h % 360 + (this.h < 0) * 360,
        s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
        l = this.l,
        m2 = l + (l < 0.5 ? l : 1 - l) * s,
        m1 = 2 * l - m2;
    return new Rgb(hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2), hsl2rgb(h, m1, m2), hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2), this.opacity);
  },
  displayable: function displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  }
}));

/* From FvD 13.37, CSS Color Module Level 3 */
function hsl2rgb(h, m1, m2) {
  return (h < 60 ? m1 + (m2 - m1) * h / 60 : h < 180 ? m2 : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60 : m1) * 255;
}

var deg2rad = Math.PI / 180;
var rad2deg = 180 / Math.PI;

var Kn = 18;
var Xn = 0.950470;
var Yn = 1;
var Zn = 1.088830;
var t0 = 4 / 29;
var t1 = 6 / 29;
var t2 = 3 * t1 * t1;
var t3 = t1 * t1 * t1;

function labConvert(o) {
  if (o instanceof Lab) return new Lab(o.l, o.a, o.b, o.opacity);
  if (o instanceof Hcl) {
    var h = o.h * deg2rad;
    return new Lab(o.l, Math.cos(h) * o.c, Math.sin(h) * o.c, o.opacity);
  }
  if (!(o instanceof Rgb)) o = rgbConvert(o);
  var b = rgb2xyz(o.r),
      a = rgb2xyz(o.g),
      l = rgb2xyz(o.b),
      x = xyz2lab((0.4124564 * b + 0.3575761 * a + 0.1804375 * l) / Xn),
      y = xyz2lab((0.2126729 * b + 0.7151522 * a + 0.0721750 * l) / Yn),
      z = xyz2lab((0.0193339 * b + 0.1191920 * a + 0.9503041 * l) / Zn);
  return new Lab(116 * y - 16, 500 * (x - y), 200 * (y - z), o.opacity);
}

function lab(l, a, b, opacity) {
  return arguments.length === 1 ? labConvert(l) : new Lab(l, a, b, opacity == null ? 1 : opacity);
}

function Lab(l, a, b, opacity) {
  this.l = +l;
  this.a = +a;
  this.b = +b;
  this.opacity = +opacity;
}

define$1(Lab, lab, extend(Color, {
  brighter: function brighter(k) {
    return new Lab(this.l + Kn * (k == null ? 1 : k), this.a, this.b, this.opacity);
  },
  darker: function darker(k) {
    return new Lab(this.l - Kn * (k == null ? 1 : k), this.a, this.b, this.opacity);
  },
  rgb: function rgb$$1() {
    var y = (this.l + 16) / 116,
        x = isNaN(this.a) ? y : y + this.a / 500,
        z = isNaN(this.b) ? y : y - this.b / 200;
    y = Yn * lab2xyz(y);
    x = Xn * lab2xyz(x);
    z = Zn * lab2xyz(z);
    return new Rgb(xyz2rgb(3.2404542 * x - 1.5371385 * y - 0.4985314 * z), // D65 -> sRGB
    xyz2rgb(-0.9692660 * x + 1.8760108 * y + 0.0415560 * z), xyz2rgb(0.0556434 * x - 0.2040259 * y + 1.0572252 * z), this.opacity);
  }
}));

function xyz2lab(t) {
  return t > t3 ? Math.pow(t, 1 / 3) : t / t2 + t0;
}

function lab2xyz(t) {
  return t > t1 ? t * t * t : t2 * (t - t0);
}

function xyz2rgb(x) {
  return 255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
}

function rgb2xyz(x) {
  return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
}

function hclConvert(o) {
  if (o instanceof Hcl) return new Hcl(o.h, o.c, o.l, o.opacity);
  if (!(o instanceof Lab)) o = labConvert(o);
  var h = Math.atan2(o.b, o.a) * rad2deg;
  return new Hcl(h < 0 ? h + 360 : h, Math.sqrt(o.a * o.a + o.b * o.b), o.l, o.opacity);
}

function hcl(h, c, l, opacity) {
  return arguments.length === 1 ? hclConvert(h) : new Hcl(h, c, l, opacity == null ? 1 : opacity);
}

function Hcl(h, c, l, opacity) {
  this.h = +h;
  this.c = +c;
  this.l = +l;
  this.opacity = +opacity;
}

define$1(Hcl, hcl, extend(Color, {
  brighter: function brighter(k) {
    return new Hcl(this.h, this.c, this.l + Kn * (k == null ? 1 : k), this.opacity);
  },
  darker: function darker(k) {
    return new Hcl(this.h, this.c, this.l - Kn * (k == null ? 1 : k), this.opacity);
  },
  rgb: function rgb$$1() {
    return labConvert(this).rgb();
  }
}));

var A = -0.14861;
var B = +1.78277;
var C = -0.29227;
var D = -0.90649;
var E = +1.97294;
var ED = E * D;
var EB = E * B;
var BC_DA = B * C - D * A;

function cubehelixConvert(o) {
  if (o instanceof Cubehelix) return new Cubehelix(o.h, o.s, o.l, o.opacity);
  if (!(o instanceof Rgb)) o = rgbConvert(o);
  var r = o.r / 255,
      g = o.g / 255,
      b = o.b / 255,
      l = (BC_DA * b + ED * r - EB * g) / (BC_DA + ED - EB),
      bl = b - l,
      k = (E * (g - l) - C * bl) / D,
      s = Math.sqrt(k * k + bl * bl) / (E * l * (1 - l)),
      // NaN if l=0 or l=1
  h = s ? Math.atan2(k, bl) * rad2deg - 120 : NaN;
  return new Cubehelix(h < 0 ? h + 360 : h, s, l, o.opacity);
}

function cubehelix(h, s, l, opacity) {
  return arguments.length === 1 ? cubehelixConvert(h) : new Cubehelix(h, s, l, opacity == null ? 1 : opacity);
}

function Cubehelix(h, s, l, opacity) {
  this.h = +h;
  this.s = +s;
  this.l = +l;
  this.opacity = +opacity;
}

define$1(Cubehelix, cubehelix, extend(Color, {
  brighter: function brighter$$1(k) {
    k = k == null ? _brighter : Math.pow(_brighter, k);
    return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
  },
  darker: function darker$$1(k) {
    k = k == null ? _darker : Math.pow(_darker, k);
    return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
  },
  rgb: function rgb$$1() {
    var h = isNaN(this.h) ? 0 : (this.h + 120) * deg2rad,
        l = +this.l,
        a = isNaN(this.s) ? 0 : this.s * l * (1 - l),
        cosh = Math.cos(h),
        sinh = Math.sin(h);
    return new Rgb(255 * (l + a * (A * cosh + B * sinh)), 255 * (l + a * (C * cosh + D * sinh)), 255 * (l + a * (E * cosh)), this.opacity);
  }
}));

var colorScales = d3Collection.map();

globalOptions.color = {
    scale: 'cool',
    // Minumim number of colors in a sequantial color scale
    // This helps in keeping a consistent palette when few colors are used
    scaleMinPoints: 6,
    // An offset in the color scale, useful for combined visuals
    scaleOffset: 0,
    stroke: '#333',
    strokeOpacity: 1,
    fillOpacity: 1
};

colorScales.set('viridis', function (d3) {
    return d3.scaleSequential(d3.interpolateViridis);
});
colorScales.set('inferno', function (d3) {
    return d3.scaleSequential(d3.interpolateInferno);
});
colorScales.set('magma', function (d3) {
    return d3.scaleSequential(d3.interpolateMagma);
});
colorScales.set('plasma', function (d3) {
    return d3.scaleSequential(d3.interpolatePlasma);
});
colorScales.set('warm', function (d3) {
    return d3.scaleSequential(d3.interpolateWarm);
});
colorScales.set('cool', function (d3) {
    return d3.scaleSequential(d3.interpolateCool);
});
colorScales.set('rainbow', function (d3) {
    return d3.scaleSequential(d3.interpolateRainbow);
});
colorScales.set('cubehelix', function (d3) {
    return d3.scaleSequential(d3.interpolateCubehelixDefault);
});

vizPrototype.getColorScale = function (name) {
    return colorScales.get(name)(this.$);
};
//
//  Color scale method
//  ==========================
vizPrototype.colors = function (n, opacity) {
    var model = this.getModel('color');
    var reversed = false,
        scaleDef = void 0,
        scale = void 0;

    if (d3Let.isArray(model.scale)) scale = this.getScale('ordinal').range(model.scale);else {
        scaleDef = this.getColorScale(model.scale);
        if (!scaleDef) throw new Error('Unknown scale ' + model.scale);
        if (!d3Let.isObject(scaleDef)) scaleDef = { scale: scaleDef };
        if (scaleDef.minPoints === undefined) scaleDef.minPoints = model.scaleMinPoints;
        scale = scaleDef.scale;
        reversed = scaleDef.reversed;
    }

    if (d3Let.isFunction(scale.interpolator)) {
        var offset = model.scaleOffset,
            npoints = n + offset,
            points = Math.max(npoints, scaleDef.minPoints),
            domain = reversed ? [points - 1, 0] : [0, points - 1];
        scale.domain(domain);
        var c = void 0;
        return d3Array.range(offset, Math.min(npoints, points)).map(function (v) {
            c = color(scale(v));
            c.opacity = opacity;
            return c;
        });
    } else {
        var colors = scale.range().slice();
        if (reversed) colors.reverse();
        var b = void 0,
            _c = void 0,
            m = void 0;
        for (var i = 0; i < model.scaleOffset; ++i) {
            colors.push(colors.shift());
        }
        return d3Array.range(n).map(function () {
            b = colors.shift();
            _c = color(b);
            m = color(b);
            _c.opacity = opacity;
            colors.push('' + m.brighter(0.2));
            return _c;
        });
    }
};

vizPrototype.fill = function (data) {
    var model = this.getModel('color'),
        opacity = this.modelProperty('fillOpacity', model),
        colors = this.colors(data.length, opacity);

    function fill(d, idx) {
        return colors[idx];
    }

    fill.colors = colors;

    return fill;
};

vizPrototype.stroke = function (data) {
    var model = this.getModel('color'),
        opacity = this.modelProperty('strokeOpacity', model),
        colors = this.colors(data.length, opacity);

    function stroke(d, idx) {
        return colors[idx];
    }

    stroke.colors = colors;

    return stroke;
};

//
//  Linear Gradient method
//  ==========================
//
//  Create a monocromatic linear gradient in the visualization box,
//  either horizontal or vertical
vizPrototype.linearGradient = function (col, box, orientation, gid) {
    var paper = this.paper().sel,
        defs = paper.select('defs');
    if (!defs.node()) defs = paper.append('defs');
    var grad = defs.selectAll('#' + gid).data([0]),
        colto = color(col);

    colto.opacity = 0.1;

    grad.enter().append('linearGradient').attr('id', gid).attr('x1', '0%').attr('y1', '0%').attr('x2', orientation === 'vertical' ? '0%' : '100%').attr('y2', orientation === 'vertical' ? '100%' : '0%');

    var stops = defs.select('#' + gid).selectAll('stop').data([{ offset: '0%', color: col }, { offset: '100%', color: colto }]);

    stops.enter().append('stop').merge(stops).attr('offset', function (d) {
        return d.offset;
    }).attr('stop-color', function (d) {
        return d.color;
    });

    return 'url(#' + gid + ')';
};

globalOptions.legend = {
    location: "top-right",
    orient: "vertical",
    fontSize: '3%',
    title: '',
    titleWidth: "20%",
    labelFormat: null,
    titleMinWidth: 30,
    titleMaxWidth: 60,
    minFontSize: 10,
    maxFontSize: 20,
    offset: [10, 10],
    shapeWidth: 15,
    shapeHeight: 15,
    hide: 300 // specify a pixel size below which tick labels are not displayed
};

vizPrototype.getLegend = function (name) {
    return this.getD3('legend', name);
};

//
//  Legend method
//  ==========================
vizPrototype.legend = function (cfg, box) {
    var vizModel = this.getModel(),
        model = this.getModel('legend'),
        font = this.getModel('font'),
        name = d3Let.pop(cfg, 'type') || vizModel.legendType,
        vizSize = Math.max(box.vizHeight, box.vizWidth),
        fontSize = this.dim(model.fontSize, vizSize, model.minFontSize, model.maxFontSize),
        legend = this.getLegend(name);

    if (!model.location) return;

    if (!legend) return warn$1('Could not load legend ' + name);
    legend = legend().orient(model.orient);

    if (model.title) {
        legend.title(model.title);
        if (model.titleWidth) {
            var width = this.dim(model.titleWidth, vizSize, model.titleMinWidth, model.titleMaxWidth);
            legend.titleWidth(width);
        }
    }

    if (model.labelFormat) legend.labelFormat(model.labelFormat);
    legend.shapeWidth(model.shapeWidth).shapeHeight(model.shapeHeight);

    // apply cfg parameters
    for (var key in cfg) {
        legend[key](cfg[key]);
    }var gl = this.group('legend').style('font-size', fontSize + 'px').html('').call(legend),
        bb = gl.node().getBBox(),
        offset = locations.get(model.location).call(this, bb, box, model),
        transform = this.translate(offset.x, offset.y);
    gl.selectAll('text').style('fill', model.stroke || font.stroke);
    this.applyTransform(gl, transform);
    //
    //
    // if the legend needs to be hidden below a certain size
    if (model.hide) {
        if (vizSize < model.hide) gl.style('opacity', 0);else gl.style('opacity', 1);
    }
};

var locations = d3Collection.map({
    top: top,
    bottom: bottom,
    right: right,
    left: left,
    'top-left': topLeft,
    'top-right': topRight,
    'bottom-left': bottomLeft,
    'bottom-right': bottomRight
});

function top(bb, box, options) {
    var offsetY = this.dim(options.offset[1], box.vizHeight);
    return {
        x: box.margin.left + (box.innerWidth - bb.width) / 2,
        y: offsetY
    };
}

function bottom(bb, box, options) {
    var offsetY = this.dim(options.offset[1], box.vizHeight);
    return {
        x: box.margin.left + (box.innerWidth - bb.width) / 2,
        y: box.vizHeight - bb.height - offsetY
    };
}

function right(bb, box, options) {
    var offsetX = this.dim(options.offset[0], box.vizWidth);
    return {
        x: box.vizWidth - bb.width - offsetX,
        y: box.margin.top + (box.innerHeight - bb.height) / 2
    };
}

function left(bb, box, options) {
    var offsetX = this.dim(options.offset[0], box.vizWidth);
    return {
        x: box.margin.left - offsetX,
        y: box.margin.top + (box.innerHeight - bb.height) / 2
    };
}

function topLeft(bb, box, options) {
    var offsetX = this.dim(options.offset[0], box.vizWidth),
        offsetY = this.dim(options.offset[1], box.vizHeight);
    return {
        x: box.margin.left + (box.innerWidth - bb.width) / 2 + offsetX,
        y: offsetY
    };
}

function topRight(bb, box, options) {
    var offsetX = this.dim(options.offset[0], box.vizWidth),
        offsetY = this.dim(options.offset[1], box.vizHeight);
    return {
        x: box.vizWidth - bb.width - offsetX,
        y: offsetY
    };
}

function bottomLeft(bb, box, options) {
    var offsetX = this.dim(options.offset[0], box.vizWidth),
        offsetY = this.dim(options.offset[1], box.vizHeight);
    return {
        x: bb.width + offsetX,
        y: box.vizHeight - bb.height - offsetY
    };
}

function bottomRight(bb, box, options) {
    var offsetX = this.dim(options.offset[0], box.vizWidth),
        offsetY = this.dim(options.offset[1], box.vizHeight);
    return {
        x: box.vizWidth - bb.width - offsetX,
        y: box.vizHeight - bb.height - offsetY
    };
}

var constant = function (x) {
    return function constant() {
        return x;
    };
};

var functor = function (v) {
    if (d3Let.isFunction(v)) return v;
    return constant(v);
};

var identity = function (d) {
    return d;
};

//
//
//  Mouse events handling
//  ==========================
//
var mouseStrategies = d3Collection.map({
    darker: darkerStrategy(),
    fill: fillStrategy()
});

visuals.options.mouse = {
    over: ['darker'],
    darkerFactor: 0.5,
    fillColor: '#addd8e'
};

vizPrototype.mouseOver = function () {
    var self = this,
        model = this.getModel('mouse');

    return function (d, i) {
        if (!this.__mouse_over__) this.__mouse_over__ = {};
        var sel = self.select(this);
        var strategy = void 0;
        model.over.forEach(function (name) {
            strategy = mouseStrategies.get(name);
            if (!strategy) warn$1('Unknown mouse strategy ' + name);else strategy(self, sel, d, i);
        });
    };
};

vizPrototype.mouseOut = function () {
    var self = this,
        model = this.getModel('mouse');

    return function (d, i) {
        if (!this.__mouse_over__) this.__mouse_over__ = {};
        var sel = self.select(this);
        var strategy = void 0;
        model.over.forEach(function (name) {
            strategy = mouseStrategies.get(name);
            if (!strategy) warn$1('Unknown mouse strategy ' + name);else strategy.out(self, sel, d, i);
        });
    };
};

function darkerStrategy() {

    function darker(viz, sel) {
        var model = viz.getModel('mouse'),
            fill = color(sel.style('fill')),
            filldarker = fill.darker(model.darkerFactor),
            node = sel.node();
        node.__mouse_over__.fill = fill;
        sel.style('fill', filldarker);
    }

    darker.out = function (viz, sel) {
        var node = sel.node(),
            fill = node.__mouse_over__.fill;
        if (fill) sel.style('fill', fill);
    };

    return darker;
}

function fillStrategy() {

    function fill(viz, sel) {
        var model = viz.getModel('mouse'),
            fill = color(sel.style('fill')),
            node = sel.node();
        node.__mouse_over__.fill = fill;
        sel.transition().style('fill', model.fillColor);
    }

    fill.out = function (viz, sel) {
        var node = sel.node(),
            fill = node.__mouse_over__.fill;
        if (fill) sel.transition().style('fill', fill);
    };

    return fill;
}

visuals.options.tooltip = {
    location: "top",
    offset: [10, 10],
    html: ""
};

if (d3Let.inBrowser) vizPrototype.tooltip = tooltip();else vizPrototype.tooltip = identity;

mouseStrategies.set('tooltip', function () {

    function tooltip(viz, sel, d, i) {
        var html = viz.tooltipHtml(sel, d, i);
        if (html) {
            var model = viz.getModel('tooltip');
            viz.tooltip.location(model.location).offset(model.offset).html(html).show(sel.node());
        }
    }

    tooltip.out = function (viz) {
        viz.tooltip.hide();
    };

    return tooltip;
}());

vizPrototype.tooltipHtml = function (sel, d, i) {
    var model = this.getModel('tooltip');
    if (model.html) return this.dataStore.eval(model.html, {
        d: d,
        index: i,
        model: this.getModel()
    });
};

function tooltip() {

    var location = functor('top'),
        offset = functor([0, 0]),
        html = functor(' '),
        node = null,
        point = null;

    var locationCallbacks = d3Collection.map({
        top: top,
        bottom: bottom,
        right: right,
        left: left,
        'top-left': topLeft,
        'top-right': topRight,
        'bottom-left': bottomLeft,
        'bottom-right': bottomRight
    });

    var locations = locationCallbacks.keys();

    function selectNode() {
        if (node === null) {
            node = d3Selection.select(document.body).append('div').classed('d3-tooltip', true).style('position', 'absolute').style('top', 0).style('opacity', 0).style('pointer-events', 'none').style('box-sizing', 'border-box').node();
            point = d3Selection.select(document.body).append('svg').style('opacity', 0).style('pointer-events', 'none').node().createSVGPoint();
        }
        return d3Selection.select(node);
    }

    function tooltip() {}

    tooltip.show = function (target) {
        var args = Array.prototype.slice.call(arguments),
            snode = selectNode(),
            content = html.apply(this, args) || '',
            poffset = offset.apply(this, args),
            dir = location.apply(this, args),
            scrollTop = document.documentElement.scrollTop || document.body.scrollTop,
            scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft,
            coords;

        snode.html(content).style('opacity', 1).style('pointer-events', 'all');

        var i = locations.length;
        while (i--) {
            snode.classed(locations[i], false);
        }coords = locationCallbacks.get(dir).call(this, target, poffset);
        snode.classed(dir, true).style('top', coords.top + scrollTop + 'px').style('left', coords.left + scrollLeft + 'px');

        return tooltip;
    };

    tooltip.hide = function () {
        selectNode().style('opacity', 0).style('pointer-events', 'none');
        return tooltip;
    };

    // Returns tip or location
    tooltip.location = function (v) {
        if (!arguments.length) return location;
        location = v === null ? v : functor(v);
        return tooltip;
    };

    tooltip.html = function (v) {
        if (!arguments.length) return html;
        html = v === null ? v : functor(v);
        return tooltip;
    };

    tooltip.offset = function (v) {
        if (!arguments.length) return offset;
        offset = v == null ? v : functor(v);
        return tooltip;
    };

    return tooltip;

    function top(target, offset) {
        var bbox = getScreenBBox(target);
        return {
            left: bbox.n.x - node.offsetWidth / 2,
            top: bbox.n.y - node.offsetHeight - offset[1]
        };
    }

    function bottom(bb, box, options) {
        return {
            top: box.total.left + (box.innerWidth - bb.width) / 2,
            left: box.height - bb.height - options.offsetY
        };
    }

    function right(target, offset) {
        var bbox = getScreenBBox(target);
        return {
            left: bbox.e.x + offset[0],
            top: bbox.e.y - node.offsetHeight / 2
        };
    }

    function left(bb, box, options) {
        return {
            x: box.total.left + (box.innerWidth - bb.width) / 2,
            y: options.offsetY
        };
    }

    function topLeft(bb, box, options) {
        return {
            x: box.total.left + (box.innerWidth - bb.width) / 2,
            y: options.offsetY
        };
    }

    function topRight(bb, box, options) {
        return {
            x: box.width - bb.width - options.offsetX,
            y: options.offsetY
        };
    }

    function bottomLeft(bb, box, options) {
        return {
            x: box.total.left + (box.innerWidth - bb.width) / 2,
            y: box.height - bb.height - options.offsetY
        };
    }

    function bottomRight(bb, box, options) {
        return {
            x: box.total.left + (box.innerWidth - bb.width) / 2,
            y: box.height - bb.height - options.offsetY
        };
    }

    // Private - gets the screen coordinates of a shape
    //
    // Given a shape on the screen, will return an SVGPoint for the locations
    // n(north), s(south), e(east), w(west), ne(northeast), se(southeast),
    // nw(northwest), sw(southwest).
    //
    //    +-+-+
    //    |   |
    //    +   +
    //    |   |
    //    +-+-+
    //
    // Returns an Object {n, s, e, w, nw, sw, ne, se}
    function getScreenBBox(targetel) {

        while (targetel.getScreenCTM == null && targetel.parentNode == null) {
            targetel = targetel.parentNode;
        }

        var bbox = {},
            matrix = targetel.getScreenCTM(),
            tbbox = targetel.getBBox(),
            width = tbbox.width,
            height = tbbox.height,
            x = tbbox.x,
            y = tbbox.y;

        point.x = x;
        point.y = y;
        bbox.nw = point.matrixTransform(matrix);
        point.x += width;
        bbox.ne = point.matrixTransform(matrix);
        point.y += height;
        bbox.se = point.matrixTransform(matrix);
        point.x -= width;
        bbox.sw = point.matrixTransform(matrix);
        point.y -= height / 2;
        bbox.w = point.matrixTransform(matrix);
        point.x += width;
        bbox.e = point.matrixTransform(matrix);
        point.x -= width / 2;
        point.y -= height / 2;
        bbox.n = point.matrixTransform(matrix);
        point.y += height;
        bbox.s = point.matrixTransform(matrix);

        return bbox;
    }
}

//
//
//  Expand viusals layers and visuals
//  =======================================
//
visuals.options.expand = {
    location: 'top-right',
    expandText: 'expand',
    collapseText: 'collapse',
    height: 15,
    width: 15,
    radius: 3,
    offset: [0, 0],
    stroke: '#adadad',
    fill: '#fff',
    fillOver: '#e6e6e6',
    textColor: '#111'
};

visuals.events.on('after-draw.expand', function (viz) {
    var visual = viz.visualParent;
    if (!viz.isViz || visual.layers.length <= 1) return;

    var model = viz.getModel('expand');
    // If not expanded already check if this can be expanded
    if (!viz.__expanded) if (!model.location || !hasMargin(viz.getModel('padding'))) return;

    var font = viz.getModel('font'),
        box = viz.boundingBox(),
        button = viz.group('expand'),
        node = button.node(),
        size = Math.floor(0.8 * Math.min(model.width, model.height)),
        buttonText = viz.__expanded ? model.collapseText : model.expandText,
        firstPass = false;

    if (!button.select('rect').size()) {
        firstPass = true;
        button.attr('cursor', 'pointer').on("mouseover", mouseOver).on("mouseout", mouseOut);

        button.append('rect').classed('button', true).attr('x', 0).attr('y', 0).attr('rx', model.radius).attr('ry', model.radius).attr('width', model.width).attr('height', model.height).attr('stroke', model.stroke).attr('fill', model.fill).attr('cursor', 'pointer');

        button.append('text').attr('x', model.width / 2).attr('y', model.height / 2).attr('fill', model.textColor).attr('font-family', model.fontFamily || font.family).attr('text-anchor', "middle").attr('alignment-baseline', "middle").attr('font-size', size);

        button.append('rect').classed('placeholder', true).attr('x', 0).attr('y', 0).attr('rx', model.radius).attr('ry', model.radius).attr('width', model.width).attr('height', model.height).attr('stroke', 'none').attr('fill', 'transparent').on("click", click);
    }

    button.select('text').text(function () {
        return buttonText;
    });
    var bb = locations.get(model.location).call(viz, node.getBBox(), box, model);
    if (!firstPass) button = button.transition(viz.transition('expand'));
    button.attr('transform', viz.translate(bb.x, bb.y));

    function mouseOver() {
        viz.select(this).select('rect.button').attr('fill', model.fillOver);
    }

    function mouseOut() {
        viz.select(this).select('rect.button').attr('fill', model.fill);
    }

    function click() {
        var pd = viz.getModel('padding');
        mouseOut.call(this);
        if (!viz.__expanded) {
            viz.__expanded = {
                padding: KEYS.reduce(function (o, key) {
                    if (pd[key]) {
                        o[key] = pd[key];
                        pd[key] = 0;
                    }
                    return o;
                }, {})
            };
            visual.deactivate();
            viz.activate();
        } else {
            var padding = viz.__expanded.padding;
            delete viz.__expanded;
            visual.activate();
            KEYS.forEach(function (key) {
                if (padding[key]) pd[key] = padding[key];
            });
        }
        visual.redraw(false);
    }
});

function hasMargin(mg) {
    return mg.left || mg.right || mg.top || mg.bottom;
}

visuals.options.transition = {
    duration: 250,
    delay: 0,
    ease: null
};

vizPrototype.transition = function (name) {
    var uname = this.idname(name),
        model = this.getModel('transition');
    return d3Transition.transition(uname).duration(model.duration);
};

vizPrototype.applyTransform = function (sel, transform) {
    //var cname = sel.attr('class'),
    ///    model = this.getModel('transition'),
    //    tr = cname ? transition(cname).duration(model.duration) : null,
    var t = sel.attr('transform');
    if (!t) sel.attr('transform', transform);
    sel.transition().attr('transform', transform);
};

vizPrototype.brushX = function () {
    return this.$.brushX();
};

vizPrototype.brushY = function () {
    return this.$.brushY();
};

vizPrototype.brush = function () {
    return this.$.brush();
};

var VisualContainer = createVisual('container', {
    initialise: function initialise() {
        this.live = [];
        if (this.visualParent) this.visualParent.live.push(this);
    },
    draw: function draw(fetchData) {
        if (this.drawing) {
            warn$1(this.toString() + ' already drawing');
            return this.drawing;
        }
        var self = this;
        visuals.events.call('before-draw', undefined, self);
        return Promise.all(this.live.map(function (visual) {
            return visual.redraw(fetchData);
        })).then(function () {
            delete self.drawing;
            visuals.events.call('after-draw', undefined, self);
        });
    },
    destroy: function destroy() {
        this.pop(this.visualParent);
    }
});

//
//  vizComponent base prototype
//  =============================
//
//  Some common properties and methods for all visualize components
//
var vizComponent = {
    props: ['schema', // Schema is a collection of fields to display in the table
    'datasource', // Data source
    'plugins', // list of string/objects
    'options'],

    render: function render(props, attrs, el) {
        var self = this,
            inner = this.select(el).html();
        //
        // build
        return this.getSchema(props.schema, function (schema) {
            if (!d3Let.isObject(schema)) schema = {};
            schema = d3Let.assign({}, props.options, schema);
            return self.build(schema, inner, attrs);
        });
    },


    // get the schema from the input schema property
    getSchema: function getSchema(input, build) {
        var parent = this.model.visual;

        // allow to specify the schema as an entry of
        // visuals object in the dashboard schema
        if (parent && parent !== this.model && d3Let.isString(input)) {
            var schema = parent.getVisualSchema(input);
            if (schema) input = schema;
        }

        if (d3Let.isString(input)) {
            return this.json(input).then(build).catch(function (err) {
                warn$1('Could not reach ' + input + ': ' + err, err);
            });
        } else return build(input);
    },

    //
    // build the visual component has the schema available
    build: function build() {}
};
//
//  Dashboard Component
//  ========================
//
//  A collection of visual components arranged according
//  to a custom layout.
//
//  * Dashboard visuals are independent of each other but
//    interact via the data object
//  * The Dashboard layout is given by the inner HTML elements
//  * The configuration is obtained via the schema property which
//    can be either:
//      1) an object
//      2) a url
var dashboard = d3Let.assign({}, vizComponent, {
    build: function build(schema, inner, attrs) {
        var model = this.model,
            sel = this.createElement('div'),
            root = model.root;
        if (attrs.class) sel.attr('class', attrs.class);
        if (!schema.visuals) schema.visuals = {};
        model.visual = new VisualContainer(sel.node(), schema, model.visual, model.visual ? null : model.$new());
        if (!root.visualDashboard) root.visualDashboard = model.visual;
        return sel.html(inner);
    }
});

//
//  Visual component
//  ======================
//
//  An element containing a visualization
var visual = d3Let.assign({}, vizComponent, {
    build: function build(schema, inner, attrs) {
        var sel = this.createElement('div'),
            type = schema.type || 'visual',
            model = this.model,
            visualDrawOnMount = d3Let.pop(schema, 'visualDrawOnMount'),
            options = {},
            layers;

        if (attrs.class) sel.attr('class', attrs.class);

        if (type === 'visual') {
            layers = d3Let.pop(schema, 'layers');
            options = schema;
        } else options.visual = d3Let.pop(schema, 'visual') || {};

        if (visualDrawOnMount !== undefined) model.visualDrawOnMount = visualDrawOnMount;
        model.visual = new Visual(sel.node(), options, model.visual, model.visual ? null : model.$new());
        if (type !== 'visual') model.visual.addVisual(schema);else if (layers) {
            layers.forEach(function (layer) {
                return model.visual.addVisual(layer);
            });
        }
        return sel;
    },


    // once the element is mounted in the dom, draw the visual
    mounted: function mounted() {
        if (this.model.visualDrawOnMount === false) return;
        this.model.visual.redraw();
    }
});

//
//  d3-view components
//  ======================
//
//  d3-view plugin for visualization components
//
//  visual plugins first
// Visual components plugin
var visualComponents = {
    install: function install(vm) {
        vm.addComponent('dashboard', dashboard);
        vm.addComponent('visual', visual);
    }
};

var descending = function (a, b) {
  return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
};

//
//  Pyramid Shape generator
//  ============================
var pyramid = function () {
    var value = identity,
        pad = constant(0),
        height = 1,
        base = 1;

    function pyramid(data) {
        var i = void 0,
            j = void 0,
            k = void 0,
            points = void 0,
            fraction = void 0,
            hi = void 0,
            x = void 0,
            y = void 0,
            v0 = void 0,
            ph = void 0,
            pj = void 0;
        var n = data.length,
            r = 0.5 * base / height,
            polygons = new Array(n),
            index = new Array(n);

        for (i = 0; i < n; ++i) {
            polygons[index[i] = i] = +value(data[i], i, data);
        }

        // Sort the polygons
        index.sort(function (i, j) {
            return descending(polygons[i], polygons[j]);
        });

        // Compute the polygons! They are stored in the original data's order.
        v0 = polygons[index[0]];
        hi = null;

        for (i = n - 1; i >= 0; --i) {
            points = [];
            if (hi === null) points.push([0, 0]);else {
                y = hi + ph;
                x = y * r;
                points.push([x, y]);
                points.push([-x, y]);
            }
            j = index[i];
            k = n - i - 1;
            fraction = polygons[j] / v0;
            pj = Math.sqrt(fraction);
            hi = height * pj;
            ph = i ? pad(pj, k) : 0;
            y = hi - ph;
            x = y * r;
            points.push([-x, y]);
            points.push([x, y]);
            polygons[j] = {
                index: k,
                value: polygons[j],
                fraction: fraction,
                points: points,
                data: data[j]
            };
        }
        return polygons;
    }

    pyramid.value = function (_) {
        return arguments.length ? (value = typeof _ === "function" ? _ : constant(+_), pyramid) : value;
    };

    pyramid.base = function (_) {
        return arguments.length ? (base = _, pyramid) : base;
    };

    pyramid.height = function (_) {
        return arguments.length ? (height = _, pyramid) : height;
    };

    pyramid.pad = function (_) {
        return arguments.length ? (pad = typeof _ === "function" ? _ : constant(+_), pyramid) : pad;
    };

    return pyramid;
};

var niceRange = function (range$$1, splits) {
    var x0 = range$$1[0],
        x1 = range$$1[1],
        dx = (x1 - x0) / splits,
        n = Math.floor(Math.log10(dx)),
        v = Math.pow(10, n);
    if (dx / v > 5) v *= 10;
    v *= 0.1;

    var ndx = v * Math.ceil(dx / v),
        nx0 = v * Math.floor(x0 / v);
    return [nx0, nx0 + splits * ndx];
};

var colorContrast = function (c, white, black) {
    c = color(c);
    return c.r * 0.299 + c.g * 0.587 + c.b * 0.114 > 186 ? black || '#000' : white || '#fff';
};

//Text wrapping code adapted from Mike Bostock
var textWrap = function (text, width, callback) {
    width = functor(width);

    text.each(function (d, i) {
        var text = d3Selection.select(this),
            dy = parseFloat(text.attr("dy")) || 0,
            wd = width(d, i),
            lineHeight = 1.2,
            lines = text.text().split('\n');

        var word = void 0,
            words = void 0,
            done = void 0,
            tspan = text.text(null).append("tspan").attr("x", 0).attr("dy", dy + "em");

        lines.forEach(function (t, i) {
            done = [];
            words = t.split(/\s+/).reverse();
            if (i) tspan = text.append("tspan").attr("x", 0).attr("dy", lineHeight + dy + "em");

            while (word = words.pop()) {
                done.push(word);
                tspan.text(done.join(' '));
                if (tspan.node().getComputedTextLength() > wd && done.length > 1) {
                    done.pop();
                    tspan.text(done.join(' '));
                    done = [word];
                    tspan = text.append("tspan").attr("x", 0).attr("dy", lineHeight + dy + "em").text(word);
                }
            }
        });

        if (callback) text.selectAll('tspan').each(callback);
    });
};

var curveTypes = ["basis", "basisClosed", "basisOpen", "bundle", "cardinal", "cardinalClosed", "cardinalOpen", "catmullRom", "catmullRomClosed", "catmullRomOpen", "linear", "linearClosed", "monotoneX", "monotoneY", "natural", "step", "stepAfter", "stepBefore"];

var scales = ["linear", "log", "time"];

d3Let.assign(visuals.schema.definitions, {
    curve: {
        type: "string",
        description: "curve type for line and area charts",
        default: "natural",
        enum: curveTypes
    },
    stack: {
        type: "object",
        properties: {
            order: {
                type: "string",
                enum: ['ascending', 'descending', 'insideOut', 'none', 'reverse'],
                default: 'none'
            },
            offset: {
                type: "string",
                enum: ['diverging', 'expand', 'none', 'silhouette', 'wiggle'],
                default: 'none'
            }
        }
    }
});

var defs = {
    lineWidth: {
        type: "number",
        default: 1
    },
    curve: {
        "$ref": "#/definitions/curve"
    },
    cornerRadius: {
        type: "number",
        default: 0,
        minimum: 0,
        description: "corner radius in pixels"
    },
    x: {
        type: "string",
        description: "data accessor for the x coordinate",
        default: "x"
    },
    y: {
        type: "string",
        description: "data accessor for the y coordinate",
        default: "y"
    },
    scaleX: {
        type: "string",
        description: "scale for the x coordinate",
        enum: scales,
        default: "linear"
    },
    scaleY: {
        type: "string",
        description: "scale for the y coordinate",
        enum: scales,
        default: "linear"
    },
    axisX: {
        type: "boolean",
        description: "draw x axis",
        default: false
    },
    axisY: {
        type: "boolean",
        description: "draw y axis",
        default: false
    },
    groupby: {
        type: "string",
        description: "Group data by a given dimension"
    },
    stack: {
        "$ref": "#/definitions/stack"
    },
    gradient: {
        type: "boolean",
        description: "Gradient to zero opacity",
        default: false
    },
    lineDarken: {
        type: "number",
        description: "Darken line color",
        minimum: 0,
        maximum: 1,
        default: 0.2
    }
};

var baselines = {
    center: "middle",
    top: "hanging",
    bottom: "baseline",
    outside: "baseline"
};
var heightShifts = {
    center: function center(d, h) {
        return h / 2;
    },
    top: function top(d, h, offset) {
        return offset;
    },
    bottom: function bottom(d, h, offset) {
        return h - offset;
    },
    outside: function outside(d, h, offset) {
        return -offset;
    }
};

//
//  Bar Chart
//  =============
//
//  The barchart is one of the most flexible visuals.
//  It can be used to display label data as well as
//  timeserie data. It can display absulte values as
//  proportional data via vertical staking and normalization
createChart('barchart', {
    requires: ['d3-scale', 'd3-axis', 'd3-svg-legend'],

    schema: {
        x: defs.x,
        y: defs.y,
        orientation: {
            type: "string",
            enum: ['vertical', 'orizontal'],
            default: 'vertical'
        },
        groupby: defs.groupby,
        stack: defs.stack,
        waffle: {
            "type": "boolean",
            description: "ability to draw a waffle chart"
        },
        normalize: {
            "type": "boolean"
        },
        lineWidth: defs.lineWidth,
        cornerRadius: defs.cornerRadius,
        axisX: defs.axisX,
        axisY: defs.axisY,
        scaleY: defs.scaleY,
        //
        sortby: {
            type: "string",
            enum: ['x', 'y']
        },
        label: {
            type: "string",
            description: "expression for label text"
        },
        scaleX: {
            type: 'object',
            default: {
                type: 'band',
                padding: 0.2
            },
            properties: {
                type: {
                    type: 'string'
                },
                padding: {
                    type: 'number'
                }
            }
        }
    },

    options: {
        //
        // allow to place labels in bars
        labelLocation: "center",
        labelOffset: 10,
        labelWidth: 0.7,
        //
        // legend & tooltip
        valueformat: '.1f',
        legendType: 'color',
        legendLabel: 'label'
    },

    doDraw: function doDraw() {
        var model = this.getModel(),
            frame = this.frame,
            data = frame.data,
            box = this.boundingBox(),
            group = this.group(),
            chart = this.group('chart'),
            x = model.x,
            y = model.y,
            groupby = model.groupby,
            barChart = model.orientation === 'vertical' ? new VerticalBarChart(this) : new HorizontalBarChart(this);

        var groups = void 0,
            stacked = false;

        this.applyTransform(group, this.translate(box.padding.left, box.padding.top));
        this.applyTransform(chart, this.translate(box.margin.left, box.margin.top));

        if (groupby) {
            groups = frame.dimension(groupby).group().top(Infinity).map(function (g) {
                return g['key'];
            });
            if (groups.length <= 1) groups = null;
        }

        if (groups) {
            var gframe = frame.pivot(x, groupby, y);
            if (model.sortby === 'y') gframe = gframe.sortby('total');
            data = gframe.data;
            barChart.sz.domain(groups).range(this.fill(groups).colors);
            if (model.stack) {
                if (model.normalize) data = this.normalize(gframe);
                stacked = true;
            }
        } else {
            barChart.sz.domain([y]).range(this.fill([y]).colors);
            stacked = true;
        }

        // set domain for the labels
        var domainX = data.map(function (d) {
            return d[x];
        });
        barChart.sx.domain(domainX);
        //
        // Stacked bar chart
        if (stacked || !groups) barChart.stacked(chart, data, groups);else barChart.grouped(chart, data, groups);

        // Axis
        barChart.axis(domainX);
        // Legend
        barChart.legend(groups);
    }
});

function VerticalBarChart(viz) {
    this.vertical = true;
    this.init(viz);
    this.sx.rangeRound([0, this.box.innerWidth]);
    this.sy.rangeRound([this.box.innerHeight, 0]);
}

function HorizontalBarChart(viz) {
    this.init(viz);
    this.sx.rangeRound([0, this.box.innerHeight]);
    this.sy.rangeRound([0, this.box.innerWidth]);
}

var barChartPrototype = {
    init: function init(viz) {
        this.viz = viz;
        this.model = viz.getModel();
        this.box = viz.boundingBox();
        this.sx = viz.getScale(this.model.scaleX), this.sy = viz.getScale(this.model.scaleY), this.sz = viz.getScale('ordinal');
    },
    legend: function legend(groups) {
        if (groups) this.viz.legend({
            type: 'color',
            scale: this.sz
        }, this.box);
    },
    stacked: function stacked(chart, data, groups) {
        var color = this.viz.getModel('color'),
            sx = this.sx,
            sy = this.sy,
            sz = this.sz,
            x = this.model.x,
            y = this.model.y,
            viz = this.viz,
            radius = this.model.cornerRadius;
        var bars = chart.selectAll('.group'),
            width = void 0,
            height = void 0,
            xrect = void 0,
            yrect = void 0,
            yi = void 0,
            rects = void 0;

        if (groups) {
            this.sy.domain([0, d3Array.max(data, function (d) {
                return d.total;
            })]).nice();
        } else {
            this.sy.domain([0, d3Array.max(data, function (d) {
                return d[y];
            })]).nice();
            groups = [this.model.y];
        }

        if (this.vertical) {
            xrect = x0;
            yrect = y0;
            width = sx.bandwidth;
            height = bardim;
            yi = 1;
        } else {
            xrect = y0;
            yrect = x0;
            width = bardim;
            height = sx.bandwidth;
            yi = 0;
        }
        data = viz.getStack().keys(groups)(data);
        bars = bars.data(data);
        bars.exit().transition().style('opacity', 0).remove();

        rects = bars.enter().append('g').classed('group', true).attr('fill', function (d) {
            return sz(d.key);
        }).merge(bars).attr('fill', function (d) {
            return sz(d.key);
        }).attr('stroke', viz.modelProperty('stroke', color)).attr('stroke-opacity', viz.modelProperty('strokeOpacity', color)).selectAll('rect').data(stackedData);

        rects.enter().append('rect').attr('x', xrect).attr('y', yrect).attr('height', height).attr('width', width).attr('rx', radius).attr('ry', radius).on("mouseover", viz.mouseOver()).on("mouseout", viz.mouseOut()).merge(rects).transition().attr('x', xrect).attr('y', yrect).attr('height', height).attr('width', width);

        rects.exit().transition().style('opacity', 0).remove();

        // add labels
        if (this.model.label) {
            var font = viz.getModel('font'),
                label = this.model.label,
                fontSize = viz.font(this.box) + 'px',
                labels = chart.selectAll('.labels').data(data),
                baseline = this.vertical ? baselines[this.model.labelLocation] || "baseline" : "middle",
                heightShift = heightShifts[this.model.labelLocation],
                labelWidth = this.model.labelWidth,
                labelOffset = this.model.labelOffset;

            rects = labels.enter().append('g').classed('labels', true).merge(labels).selectAll('text').data(stackedData);

            rects.enter().append('text').classed('label', true).attr("transform", labelTranslate).style("fill", fillLabel).style('font-size', fontSize).text(labelText).merge(rects).text(labelText).style('font-size', fontSize).call(textWrap, function (d) {
                return labelWidth * width(d);
            }, labelAlign).transition(viz.transition('text')).attr("transform", labelTranslate).style("fill", fillLabel);
        }

        function bardim(d) {
            return sy(d[1 - yi]) - sy(d[yi]);
        }

        function x0(d) {
            return sx(d.data[x]);
        }

        function y0(d) {
            return sy(d[yi]);
        }

        function stackedData(d) {
            d.forEach(function (r) {
                r.key = d.key;
                r.value = r.data[d.key];
            });
            return d;
        }

        function labelTranslate(d, index) {
            var x = xrect(d, index) + width(d, index) / 2,
                y = yrect(d, index) + heightShift(d, height(d, index), labelOffset);
            return viz.translate(x, y);
        }

        function fillLabel(d) {
            return colorContrast(sz(d.key), '#fff', font.stroke);
        }

        function labelText(d, index) {
            return viz.dataStore.eval(label, { d: d, index: index });
        }

        function labelAlign() {
            viz.select(this).attr("alignment-baseline", baseline).attr("text-anchor", "middle");
        }
    },
    grouped: function grouped(chart, data, groups) {
        var color = this.viz.getModel('color'),
            sx = this.sx,
            sy = this.sy,
            sz = this.sz,
            x = this.model.x,
            viz = this.viz,
            radius = this.model.cornerRadius,
            padding = sx.paddingInner(),
            x1 = viz.getScale('band').domain(groups).paddingInner(0.5 * padding),
            bars = chart.selectAll('.group');
        var width = void 0,
            height = void 0,
            xrect = void 0,
            rects = void 0;

        // set the value domain
        sy.domain([0, d3Array.max(data, maxValue)]).nice();

        if (this.vertical) {
            x1.rangeRound([0, sx.bandwidth()]);
            xrect = gx;
            width = x1.bandwidth;
            height = gh;
        } else {
            xrect = gx;
            height = x1.bandwidth;
            width = gh;
        }

        bars = bars.data(data);
        bars.exit().remove();
        //
        // join for rectangles
        rects = bars.enter().append('g').classed('group', true).attr("transform", function (d) {
            return viz.translate(xrect(d), 0);
        }).merge(bars).attr("transform", function (d) {
            return viz.translate(xrect(d), 0);
        }).selectAll('rect').data(groupData);
        //
        rects.exit().transition().style('opacity', 0).remove();
        //
        rects.enter().append('rect').attr('x', function (d) {
            return x1(d.key);
        }).attr('y', gy).attr('rx', radius).attr('ry', radius).attr('height', height).attr('width', width).attr('stroke-width', this.model.lineWidth).attr('stroke', color.stroke).attr('stroke-opacity', 0).attr('fill', function (d) {
            return sz(d.key);
        }).on("mouseover", viz.mouseOver()).on("mouseout", viz.mouseOut()).merge(rects).transition(viz.transition('rect')).attr('x', function (d) {
            return x1(d.key);
        }).attr('y', gy).attr('height', height).attr('width', width).attr('stroke', color.stroke).attr('stroke-opacity', color.strokeOpacity).attr('fill', function (d) {
            return sz(d.key);
        });

        rects.exit().remove();

        function gx(d) {
            return sx(d[x]);
        }

        function gy(d) {
            return sy(d.value);
        }

        function gh(d) {
            return sy(0) - sy(d.value);
        }

        function groupData(d) {
            return groups.map(function (key) {
                return { key: key, value: d[key] };
            });
        }

        function maxValue(d) {
            return groups.reduce(function (v, key) {
                return Math.max(v, d[key]);
            }, 0);
        }
    }
};

VerticalBarChart.prototype = d3Let.assign({}, barChartPrototype, {
    axis: function axis(domainX) {
        if (this.model.axisX) this.viz.xAxis1(this.model.axisX === true ? "bottom" : this.model.axisX, this.sx, this.box, domainX[0]);
        if (this.model.axisY) this.viz.yAxis1(this.model.axisY === true ? "left" : this.model.axisY, this.sy, this.box);
    }
});

HorizontalBarChart.prototype = d3Let.assign({}, barChartPrototype, {
    axis: function axis(domainX) {
        if (this.model.axisX) this.viz.xAxis1(this.model.axisX === true ? "left" : this.model.axisX, this.sx, this.box, domainX[0]);
        if (this.model.axisY) this.viz.yAxis1(this.model.axisY === true ? "bottom" : this.model.axisY, this.sy, this.box);
    }
});

//
//  Create a Grouper generator
//  ===============================
//
//  This is a chart transform rather than a data transform
var grouper = function () {
    var groupby = null,
        x = 'x',
        y = 'y',
        sort = false,
        stack = null,
        normalize = false;

    function grouper(frame) {
        var stacked = false,
            data = void 0,
            labels = void 0,
            s = void 0;

        if (groupby) {
            labels = frame.dimension(groupby).group().top(Infinity).map(function (g) {
                return g['key'];
            }).sort();
            if (labels.length <= 1) labels = null;
        }

        if (labels) {
            frame = frame.pivot(x, groupby, y);
            if (sort) frame = frame.sortby('total');
            data = frame.data;
            if (stack) {
                if (normalize) data = normalizeData(data);
                data = stack.keys(labels)(data);
                stacked = true;
            }
        } else {
            data = frame.data;
            labels = [y];
        }

        if (!stacked) data = labels.map(function (key, index) {
            s = data.map(function (d) {
                s = [0, d[key]];
                s.data = d;
                return s;
            });
            s.index = index;
            s.key = key;
            return s;
        });

        return new GroupedData(data, x, y, stacked);
    }

    grouper.groupby = function (_) {
        if (arguments.length) {
            groupby = _;
            return grouper;
        }
        return groupby;
    };

    grouper.x = function (_) {
        return arguments.length ? (x = _, grouper) : x;
    };

    grouper.y = function (_) {
        return arguments.length ? (y = _, grouper) : y;
    };

    grouper.normalize = function (_) {
        return arguments.length ? (normalize = _, grouper) : normalize;
    };

    grouper.stack = function (_) {
        return arguments.length ? (stack = _, grouper) : stack;
    };

    return grouper;
};

function GroupedData(data, x, y, stacked) {
    this.data = data;
    this.stacked = stacked;
    this.x = x;
    this.y = y;
}

GroupedData.prototype = {
    rangeX: function rangeX() {
        return this.range(this.x);
    },
    rangeY: function rangeY() {
        return this.range();
    },
    range: function range$$1(key) {
        var range$$1 = void 0,
            vals = void 0;
        if (key) vals = this.data.reduce(function (a, d) {
            range$$1 = d3Array.extent(d, acc);
            a.push(range$$1[0]);
            a.push(range$$1[1]);
            return a;
        }, []);else vals = this.data.reduce(function (a, d) {
            range$$1 = d3Array.extent(d, acc0);
            a.push(range$$1[0]);
            a.push(range$$1[1]);
            range$$1 = d3Array.extent(d, acc1);
            a.push(range$$1[0]);
            a.push(range$$1[1]);
            return a;
        }, []);
        return d3Array.extent(vals);

        function acc0(d) {
            return d[0];
        }

        function acc1(d) {
            return d[1];
        }

        function acc(d) {
            return d.data[key];
        }
    }
};

function normalizeData(data) {
    return data;
}

//
//  Line Chart
//  =============
//
//  The barchart is one of the most flexible visuals.
//  It can be used to display label data as well as
//  timeserie data. It can display absulte values as
//  proportional data via vertical staking and normalization
createChart('linechart', {
    requires: ['d3-scale', 'd3-shape', 'd3-axis', 'd3-svg-legend'],

    schema: {
        lineWidth: defs.lineWidth,
        curve: defs.curve,
        x: defs.x,
        y: defs.y,
        scaleX: defs.scaleX,
        scaleY: defs.scaleY,
        groupby: defs.groupby,
        axisX: defs.axisX,
        axisY: defs.axisY
    },

    doDraw: function doDraw() {
        var model = this.getModel(),
            frame = this.frame,
            x = model.x,
            y = model.y,
            box = this.boundingBox(),
            info = grouper().groupby(model.groupby).x(x).y(y)(frame),
            domainX = info.rangeX(),
            domainY = info.rangeY(),
            sx = this.getScale(model.scaleX).domain(domainX).rangeRound([0, box.innerWidth]),
            sy = this.getScale(model.scaleY).domain(domainY).rangeRound([box.innerHeight, 0]).nice(),
            group = this.group(),
            chart = this.group('chart'),
            lines = chart.selectAll('.line').data(info.data),
            colors = this.stroke(info.data).colors,
            sxshift = 0,

        //merge = paper.transition('update'),
        line_ = this.$.line().x(xl).y(yl).curve(this.getCurve(model.curve));

        this.applyTransform(group, this.translate(box.padding.left, box.padding.top));
        this.applyTransform(chart, this.translate(box.margin.left, box.margin.top));

        // TODO: generalize this hack
        if (d3Let.isFunction(sx.bandwidth)) {
            sx.domain(info.data[0].map(function (d) {
                return d.data[x];
            }));
            sxshift = sx.bandwidth() / 2;
        }

        lines.enter().append('path').attr('class', 'line').attr('fill', 'none').attr('stroke', stroke).attr('stroke-width', model.lineWidth).attr('d', line_).merge(lines).transition().attr('stroke', stroke).attr('stroke-width', model.lineWidth).attr('d', line_);

        lines.exit().transition().style('opacity', 0).remove();

        if (model.axisX) this.xAxis1(model.axisX === true ? "bottom" : model.axisX, sx, box);
        if (model.axisY) this.yAxis1(model.axisY === true ? "left" : model.axisY, sy, box);

        if (info.data.length > 1) this.legend({
            type: 'color',
            scale: this.getScale('ordinal').range(colors).domain(info.data.map(function (d) {
                return d.key;
            }))
        }, box);

        function stroke(d, i) {
            return colors[i];
        }

        function xl(d) {
            return sx(d.data[x]) + sxshift;
        }

        function yl(d) {
            return sy(d[1]);
        }
    }
});

//
//  Area Chart
//  =============
createChart('areachart', {
    requires: ['d3-scale', 'd3-shape', 'd3-axis', 'd3-svg-legend'],

    schema: {
        lineWidth: defs.lineWidth,
        curve: defs.curve,
        x: defs.x,
        y: defs.y,
        scaleX: defs.scaleX,
        scaleY: defs.scaleY,
        groupby: defs.groupby,
        axisX: defs.axisX,
        axisY: defs.axisY,
        stack: defs.stack,
        gradient: defs.gradient,
        lineDarken: defs.lineDarken
    },

    doDraw: function doDraw() {
        var self = this,
            frame = this.frame,
            model = this.getModel(),
            x = model.x,
            y = model.y,
            col = this.getModel('color'),
            box = this.boundingBox(),
            info = grouper().groupby(model.groupby).stack(this.getStack()).x(x).y(y)(frame),
            domainX = info.rangeX(),
            domainY = info.rangeY(),
            scaleX = this.getScale(model.scaleX).domain(domainX).rangeRound([0, box.innerWidth]),
            scaleY = this.getScale(model.scaleY).domain(domainY).rangeRound([box.innerHeight, 0]).nice(),
            group = this.group(),
            chart = this.group('chart'),
            areas = chart.selectAll('.areagroup').data(info.data),
            colors = this.colors(info.data.length),
            fill = model.gradient ? colors.map(function (c, i) {
            return self.linearGradient(c, box, 'vertical', 'fill' + self.model.uid + '-' + i);
        }) : colors,
            curve = this.getCurve(model.curve);

        this.applyTransform(group, this.translate(box.padding.left, box.padding.top));
        this.applyTransform(chart, this.translate(box.margin.left, box.margin.top));

        areas.exit().transition().style('opacity', 0).remove();

        var areagroup = areas.enter().append('g').classed('areagroup', true).merge(areas).selectAll('path').data(arealine);

        areagroup.enter().append('path').attr('class', function (d) {
            return d.type;
        }).attr('fill', function (d) {
            return d.fill;
        }).attr('stroke', function (d) {
            return d.stroke;
        }).attr('d', function (d) {
            return d.draw;
        }).merge(areagroup).transition(this.transition('area')).attr('d', function (d) {
            return d.draw;
        }).attr('fill', function (d) {
            return d.fill;
        }).attr('stroke', function (d) {
            return d.stroke;
        }).attr('fill-opacity', col.fillOpacity).attr('stroke-width', model.lineWidth).attr('stroke-opacity', col.strokeOpacity);

        areagroup.exit().transition().style('opacity', 0).remove();

        if (model.axisX) this.xAxis1(model.axisX === true ? "bottom" : model.axisX, scaleX, box, domainX[0]);
        if (model.axisY) this.yAxis1(model.axisY === true ? "left" : model.axisY, scaleY, box, domainY[0]);

        if (info.data.length > 1) this.legend({
            type: 'color',
            scale: this.getScale('ordinal').range(colors).domain(info.data.map(function (d) {
                return d.key;
            }))
        }, box);

        function xx(d) {
            return scaleX(d.data[x]);
        }

        function y0(d) {
            return scaleY(d[0]);
        }

        function y1(d) {
            return scaleY(d[1]);
        }

        function arealine(d) {
            var area_ = self.$.area().curve(curve).x(xx).y1(y1).y0(y0),
                line_ = self.$.line().curve(curve).x(xx).y(y1),
                c = color(colors[d.index]);

            return [{
                type: 'area',
                data: d,
                draw: area_(d),
                stroke: 'none',
                fill: fill[d.index]
            }, {
                type: 'line',
                data: d,
                draw: line_(d),
                fill: 'none',
                stroke: c.darker(model.lineDarken)
            }];
        }
    },
    ticks: function ticks(size, spacing) {
        return Math.max(Math.floor(size / spacing), 1);
    }
});

var pi = Math.PI;
var rad = pi / 180;

var proportional = {
    proportionalData: function proportionalData(frame, field) {
        return frame.dimension(field).top(Infinity);
    },
    total: function total(field) {
        var total = 0;

        function value(d) {
            total += d[field];
            return d[field];
        }

        value.total = function () {
            return total;
        };
        return value;
    }
};

//
//  Pie Chart
//  =============
//
createChart('piechart', proportional, {
    requires: ['d3-scale', 'd3-shape', 'd3-svg-legend'],

    schema: {
        // The data values from this field will be encoded as angular spans.
        // If omitted, all pie slices will have equal spans
        field: {
            type: 'string',
            default: 'data'
        },
        label: {
            type: 'string',
            default: 'label'
        },
        startAngle: {
            description: "Overall start angle of the pie in degree",
            default: 0,
            type: "number"
        },
        endAngle: {
            description: "Overall end angle of the pie in degree",
            default: 360,
            type: "number"
        },
        sort: {
            type: 'string',
            description: 'sort data before visualizing',
            enum: ['none', 'ascending', 'descending'],
            default: 'none'
        },
        innerRadius: {
            description: "Inner radius for donuts",
            default: 0,
            oneOf: [{ type: "number", minimum: 0 }, { type: "string" }]
        },
        padAngle: {
            description: "Angular separation between each adjacent arcs in degree",
            default: 0,
            type: "number",
            minimum: 0
        },
        cornerRadius: defs.cornerRadius,
        lineWidth: defs.lineWidth,
        //
        center: {
            type: "string",
            description: "Expression which display information in the center of the pie chart. Should be used with innerRadius greater than 0"
        },
        centerFont: {
            description: "Center text font size and family",
            '$ref': "#/definitions/font"
        }
    },

    doDraw: function doDraw(frame) {
        var model = this.getModel(),
            color = this.getModel('color'),
            field = model.field,
            box = this.boundingBox(),
            outerRadius = Math.min(box.innerWidth, box.innerHeight) / 2,
            innerRadius = sizeValue(model.innerRadius, outerRadius),
            total = this.total(field),
            angles = this.$.pie().padAngle(rad * model.padAngle).startAngle(rad * model.startAngle).endAngle(rad * model.endAngle).value(total),
            arcs = this.$.arc().innerRadius(innerRadius).outerRadius(outerRadius).cornerRadius(model.cornerRadius),
            group = this.group(),
            chart = this.group('chart'),
            data = angles(this.proportionalData(frame, field)),
            fill = this.fill(data),
            slices = chart.selectAll('.slice').data(data);

        this.applyTransform(group, this.translate(box.padding.left, box.padding.top));
        this.applyTransform(chart, this.translate(box.margin.left + box.innerWidth / 2, box.margin.top + box.innerHeight / 2));

        slices.enter().append('path').attr('class', 'slice').attr('stroke', color.stroke).attr('stroke-opacity', 0).attr('fill', fill).attr('stroke-width', model.lineWidth).on("mouseover", this.mouseOver()).on("mouseout", this.mouseOut()).merge(slices).transition().attr('stroke', color.stroke).attr('stroke-opacity', color.strokeOpacity).attr('d', arcs).attr('fill', fill);

        slices.exit().transition().remove();

        if (model.center) {
            var d = d3Collection.map(data.reduce(function (o, d) {
                o[d.data.label] = d;return o;
            })),
                text = this.dataStore.eval(model.center, { total: total.total(), d: d });
            if (text) {
                var font = this.getModel('font'),
                    size = this.dim(model.centerFontSize, box.innerWidth),
                    center = chart.selectAll('.info').data([text]);

                center.enter().append('text').attr('class', 'info').attr("text-anchor", "middle").attr("alignment-baseline", "middle").style("font-size", size + 'px').style('fill-opacity', 0).merge(center).text(text).style('fill-opacity', model.centerOpacity).style('fill', font.stroke).call(textWrap, 1.5 * (innerRadius || outerRadius));
            }
        }
        if (!model.legendType) return;
        total = total.total();
        var expr = d3View.viewExpression(model.legendLabel),
            fmt = d3Format.format(model.fractionFormat),
            labels = data.map(function (d, idx) {
            return expr.eval({
                d: d,
                value: d.value,
                format: fmt,
                total: total,
                fraction: d.value / total,
                label: d.data[model.label] || idx
            });
        });
        this.legend({
            scale: this.getScale('ordinal').domain(labels).range(fill.colors)
        }, box);
    }
});

var funnel = function () {
    var value = identity,
        pad = constant(0),
        height = 1,
        base = 1;

    function funnel(data) {
        var i = void 0,
            j = void 0,
            points = void 0,
            fr = void 0,
            v0 = void 0,
            bi = void 0,
            pim = void 0,
            pi = 0,
            h = 0;

        var n = data.length,
            polygons = new Array(n),
            index = new Array(n),
            hi = height / n;

        // evaluate the value for each data point
        for (i = 0; i < n; ++i) {
            polygons[index[i] = i] = +value(data[i], i, data);
        }

        // Sort the polygons
        index.sort(function (i, j) {
            return descending(polygons[i], polygons[j]);
        });

        // Compute the polygons! They are stored in the original data's order.
        v0 = polygons[index[0]];

        for (i = 0; i < n; ++i) {
            j = index[i];
            fr = polygons[j] / v0;
            bi = base * fr;
            pim = pi;
            pi = height * (i === n - 1 ? 0 : 0.5 * pad(fr, i));
            points = [[bi / 2, h + pim], [-bi / 2, h + pim], [-bi / 2, h + hi - pi], [bi / 2, h + hi - pi]];
            h += hi;
            polygons[j] = {
                index: i,
                value: polygons[j],
                fraction: fr,
                points: points,
                data: data[j]
            };
        }
        return polygons;
    }

    funnel.value = function (_) {
        return arguments.length ? (value = typeof _ === "function" ? _ : constant(+_), funnel) : value;
    };

    funnel.base = function (_) {
        return arguments.length ? (base = _, funnel) : base;
    };

    funnel.height = function (_) {
        return arguments.length ? (height = _, funnel) : height;
    };

    funnel.pad = function (_) {
        return arguments.length ? (pad = typeof _ === "function" ? _ : constant(+_), funnel) : pad;
    };

    return funnel;
};

//
//  Custom Symbol type
//  =====================
//
//  Draw a polygon given an array of points
//  This can be used as type in a d3-shape symbol
var polygon = function (points) {

    return {
        draw: function draw(context) {
            points.forEach(function (point, idx) {
                if (!idx) context.moveTo(point[0], point[1]);else context.lineTo(point[0], point[1]);
            });
            context.closePath();
        }
    };
};

createChart('pyramidchart', proportional, {
    requires: ['d3-scale', 'd3-shape', 'd3-svg-legend'],

    options: {
        field: 'data',
        label: 'label',
        pad: 0.005,
        lineWidth: 1,
        inverted: false,
        funnel: false,
        legendType: 'color',
        invereted: false,
        legendLabel: "label + ' - ' + format('.1%', fraction)"
    },

    doDraw: function doDraw(frame) {
        var model = this.getModel(),
            field = model.field,
            color = this.getModel('color'),
            box = this.boundingBox(),
            polygons = (model.funnel ? funnel() : pyramid()).pad(model.pad).value(function (d) {
            return d[field];
        }),
            scaleX = this.getScale('linear').rangeRound([0, box.innerWidth]),
            scaleY = this.getScale('linear').rangeRound(model.inverted ? [box.innerHeight, 0] : [0, box.innerHeight]),
            data = frame.new(polygons(this.proportionalData(frame, field))).dimension('fraction').bottom(Infinity),
            marks = this.$.symbol().type(function (d) {
            return polygon(d.points.map(function (xy) {
                return [scaleX(xy[0]), scaleY(xy[1])];
            }));
        }).size(1),
            fill = this.fill(data),
            group = this.group(),
            chart = this.group('chart'),
            segments = chart.style("shape-rendering", "crispEdges").selectAll('.segment').data(data);

        this.applyTransform(group, this.translate(box.padding.left, box.padding.top));
        this.applyTransform(chart, this.translate(box.margin.left + box.innerWidth / 2, box.margin.top));

        segments.enter().append('path').attr('class', 'segment').attr('stroke', color.stroke).attr('stroke-opacity', 0).attr('fill', fill).attr('stroke-width', model.lineWidth).attr('d', marks).on("mouseover", this.mouseOver()).on("mouseout", this.mouseOut()).merge(segments).transition().attr('stroke', color.stroke).attr('stroke-opacity', color.strokeOpacity).attr('d', marks).attr('fill', fill);

        segments.exit().remove();

        if (!model.legendType) return;
        var expr = d3View.viewExpression(model.legendLabel),
            self = this,
            labels = data.map(function (d, idx) {
            return expr.eval(self.getContext({
                d: d,
                value: d.value,
                fraction: d.fraction,
                label: d.data[model.label] || idx
            }));
        });
        this.legend({
            scale: this.getScale('ordinal').domain(labels).range(fill.colors)
        }, box);
    }
});

var camelFunction = function (o, prefix, name, objectOnly) {
    if (name.substring(0, prefix.length) !== prefix) name = "" + prefix + name[0].toUpperCase() + name.substring(1);
    return objectOnly ? o[name] : o[name]();
};

//
//  Treemap
//  =============
//
createChart('treemap', {
    requires: ['d3-scale', 'd3-hierarchy'],

    options: {
        label: 'label',
        field: 'data',
        padding: 2,
        tile: 'resquarify',
        format: ','
    },

    doDraw: function doDraw(frame, d3) {
        var _this = this;

        var model = this.getModel(),
            font = this.getModel('font'),
            box = this.boundingBox(),
            labelAccessor = accessor(model.label),
            valueAccessor = accessor(model.field),
            valueFormat = d3Format.format(model.format),
            root = d3.hierarchy(rootData(frame.data)).sum(valueAccessor).sort(function (a, b) {
            return b.value - a.value;
        }).eachBefore(dataColor),
            treemap = d3.treemap().tile(camelFunction(d3, 'treemap', model.tile, true)).size([box.innerWidth, box.innerHeight]).round(true).padding(model.padding),
            colors = this.fill(root.children).colors,
            group = this.group().attr("transform", this.translate(box.total.left, box.total.top)).style("shape-rendering", "crispEdges"),
            leaves = treemap(root).leaves(),
            cell = group.selectAll('g').data(leaves),
            self = this;

        this.paper().size(box);
        cell.exit().remove();

        cell = cell.enter().append('g').attr("transform", function (d) {
            return _this.translate(d.x0, d.y0);
        }).merge(cell).attr("transform", function (d) {
            return _this.translate(d.x0, d.y0);
        });

        var rects = cell.selectAll('rect').data(singleData);

        rects.enter().append('rect').attr("width", function (d) {
            return d.x1 - d.x0;
        }).attr("height", function (d) {
            return d.y1 - d.y0;
        }).attr("fill", function (d) {
            return colors[d.data._counter];
        }).attr('stroke', 'none').on("mouseover", this.mouseOver()).on("mouseout", this.mouseOut()).merge(rects).transition().attr("width", function (d) {
            return d.x1 - d.x0;
        }).attr("height", function (d) {
            return d.y1 - d.y0;
        }).attr("fill", function (d) {
            return colors[d.data._counter];
        });

        rects = cell.selectAll('text').data(singleData);
        rects.enter().append("text").style('fill', function (d) {
            return colorContrast(colors[d.data._counter], '#fff', font.stroke);
        }).selectAll("tspan").data(textData).enter().append("tspan").style('font-size', function (d) {
            return d.size;
        }).attr("x", 4).attr("y", function (d, i) {
            return 1.5 * d.size + i * 1.2 * d.size;
        }).text(function (d) {
            return d.text;
        });

        function dataColor(d) {
            if (!d.parent) d.data._counter = 0;else {
                d.data._counter = d.parent.data._counter;
                d.parent.data._counter++;
            }
        }

        function rootData(data) {
            data = { children: hideChildren(data) };
            data[model.label] = 'root';
            return data;
        }

        function textData(d) {
            var size = self.font({ height: Math.min(d.x1 - d.x0, d.y1 - d.y0) }),
                text = labelAccessor(d.data).split(/(?=[A-Z][^A-Z])/g);
            text.push(valueFormat(d.value));
            return text.map(function (t) {
                return { size: size, text: t };
            });
        }

        function singleData(d) {
            return [d];
        }

        function hideChildren(data) {
            var children = void 0;
            return data.map(function (d) {
                children = d.children;
                if (children) {
                    d._children = hideChildren(children);
                    delete d.children;
                }
                return d;
            });
        }
    }
});

createChart('text', {

    options: {
        label: 'label',
        data: 'data',
        text: 'label + " " + data',
        sizeReduction: 0.7
    },

    doDraw: function doDraw(frame) {
        var self = this,
            model = this.getModel(),
            font = this.getModel('font'),
            box = this.boundingBox(),
            size = this.font(box),
            group = this.group(),
            chart = this.group('chart'),
            words = chart.selectAll('text').data(frame.data),
            width = box.innerWidth / frame.data.length,
            widthWrap = 0.4 * width,
            store = this.dataStore,
            stroke = this.modelProperty('stroke', font);

        this.applyTransform(group, this.translate(box.padding.left, box.padding.top));
        this.applyTransform(chart, this.translate(box.margin.left, box.margin.top + box.innerHeight / 2));

        words.enter().append('text').attr("transform", shift).attr("text-anchor", "middle").attr("alignment-baseline", "middle").style('fill', stroke).merge(words).attr("transform", shift).text(function (d) {
            return store.eval(model.text, d);
        }).style('fill', stroke).call(textWrap, widthWrap, sizing);

        group.exit().remove();

        function shift(d, i) {
            return self.translate((i + 0.5) * width, 0);
        }

        function sizing(d, i) {
            var s = size;
            if (i) s = model.sizeReduction * size;
            self.select(this).attr('font-size', s + 'px');
        }
    }
});

//
//  Heatmap
//  =============
//
//  A heatmap is a graphical representation of data where the individual
//  values contained in a matrix are represented as colors.
//  This chart type allow to specify to types of layout:
//  * heatmap - classical heatmap
//  * punchcard - the z dimension is converted into different sizes of the shape elements
//  * contour - similar to heatmap but continous rather than descrete
createChart('heatmap', {
    requires: ['d3-scale', 'd3-axis', 'd3-svg-legend'],

    options: {
        shape: 'square',
        layout: 'heatmap',
        buckets: 10,
        pad: 0.005, // padding for heatmap & punchcard
        x: 'x',
        y: 'y',
        z: 'data',
        //
        label: null, // expression for label text
        //
        axisX: true,
        axisY: true,
        reverseColors: true,
        tableColors: null
    },

    doDraw: function doDraw(frame) {
        var model = this.getModel(),
            color = this.getModel('color'),
            font = this.getModel('font'),
            layout = model.layout,
            box = this.boundingBox(),
            zrange = d3Array.extent(frame.data, accessor(model.z));

        if (zrange[0] < 0 && layout === 'punchcard') layout = 'heatmap';

        var heat = this.heatmap(layout, frame, box, zrange),
            dx = (box.innerWidth - heat.width) / 2,
            dy = (box.innerHeight - heat.height) / 2,
            shape = this.getSymbol(model.shape).size(function (d) {
            return d.size * d.size;
        }),
            group = this.group(),
            chart = this.group('chart'),
            shapes = chart.selectAll('.shape').data(heat.data);

        this.applyTransform(group, this.translate(box.padding.left, box.padding.top));
        this.applyTransform(chart, this.translate(box.margin.left + dx, box.margin.top + dy));

        if (d3Array.range[0] < 0 && layout === 'punchcard') layout = 'heatmap';

        shapes.enter().append('path').classed('shape', true).attr("transform", function (d) {
            return 'translate(' + d.x + ', ' + d.y + ')';
        }).attr("fill", function (d) {
            return d.color;
        }).attr("fill-opacity", 0).attr("stroke-opacity", 0).attr("stroke", color.stroke).attr('d', shape).on("mouseover", this.mouseOver()).on("mouseout", this.mouseOut()).merge(shapes).transition(this.transition()).attr("transform", function (d) {
            return 'translate(' + d.x + ', ' + d.y + ')';
        }).attr("fill-opacity", color.fillOpacity).attr("fill", function (d) {
            return d.color;
        }).attr("stroke-opacity", color.strokeOpacity).attr("stroke", color.stroke).attr('d', shape);

        // add labels
        if (model.label && layout === 'heatmap') {
            var fontSize = this.font(box) + 'px',
                labels = chart.selectAll('.labels').data(heat.data);
            labels.enter().append('text').classed('labels', true).attr("transform", function (d) {
                return 'translate(' + d.x + ', ' + d.y + ')';
            }).style("text-anchor", "middle").style("alignment-baseline", "middle").style("fill", fillLabel).style('font-size', fontSize).text(heatLabel).merge(labels).text(heatLabel).style('font-size', fontSize).call(textWrap, Math.ceil(0.8 * heat.size)).transition(this.transition('text')).attr("transform", function (d) {
                return 'translate(' + d.x + ', ' + d.y + ')';
            }).style("fill", fillLabel);
        }

        var bb = {
            innerWidth: heat.width,
            innerHeight: heat.height,
            margin: {
                top: box.margin.top + dy,
                left: box.margin.left + dx
            }
        };
        if (model.axisX) this.xAxis1(model.axisX === true ? "bottom" : model.axisX, heat.scaleX, bb);
        if (model.axisY) this.yAxis1(model.axisY === true ? "left" : model.axisY, heat.scaleY, bb);

        if (layout === 'heatmap') this.legend({
            type: 'color',
            shape: model.shape,
            scale: heat.colors
        }, box);else if (layout === 'punchcard') this.legend({
            type: 'size',
            shape: model.shape,
            scale: heat.sizes
        }, box);

        function heatLabel(d) {
            return d.data[model.label];
        }

        function fillLabel(d) {
            return colorContrast(d.color, '#fff', font.stroke);
        }
    },
    heatmap: function heatmap(layout, frame, box, zrange) {
        var model = this.getModel(),
            pad = model.pad,
            x = model.x,
            y = model.y,
            z = model.z,
            gx = frame.dimension(model.x).group().size(),
            gy = frame.dimension(model.y).group().size(),
            buckets = Math.min(model.buckets, gx * gy),
            dx = (1 - pad * (gx + 1)) * box.innerWidth / gx,
            dy = (1 - pad * (gy + 1)) * box.innerHeight / gy,
            data = [],
            labelsX = [],
            labelsY = [],
            xp = d3Collection.map(),
            yp = d3Collection.map();

        var xv = void 0,
            yv = void 0,
            zv = void 0,
            i = void 0,
            j = void 0,
            colors = void 0,
            sizes = void 0,
            dd = void 0,
            width = void 0,
            height = void 0;

        if (dx < dy) {
            dd = dx;
            width = box.innerWidth;
            pad = width * pad;
            height = gy * (dd + pad) + pad;
        } else {
            dd = dy;
            height = box.innerHeight;
            pad = height * pad;
            width = gx * (dd + pad) + pad;
        }

        zrange = niceRange(zrange, buckets);

        if (layout === 'heatmap') {
            var cols = this.fill(d3Array.range(buckets)).colors;
            if (model.reverseColors) cols = cols.reverse();
            colors = this.getScale('quantile').range(cols).domain(zrange);
            sizes = function sizes() {
                return 1;
            };
        } else {
            var color = this.colors(1)[0];
            colors = function colors() {
                return color;
            };
            sizes = this.getScale('quantile').range(d3Array.range(buckets).map(function (s) {
                return (s + 1) / buckets;
            })).domain(zrange);
        }
        frame.data.forEach(function (d) {
            xv = d[x];
            yv = d[y];
            zv = d[z];
            if (!xp.has(xv)) {
                xp.set(xv, labelsX.length);
                labelsX.push(xv);
            }
            if (!yp.has(yv)) {
                yp.set(yv, labelsY.length);
                labelsY.push(yv);
            }
            i = xp.get(xv);
            j = yp.get(yv);
            data.push({
                i: i,
                j: j,
                x: pad + dd / 2 + i * (dd + pad),
                y: pad + dd / 2 + j * (dd + pad),
                color: colors(zv),
                size: dd * sizes(zv),
                data: d
            });
        });
        return {
            data: data,
            size: dd,
            width: width,
            height: height,
            scaleX: this.getScale('band').domain(labelsX).range([0, width]),
            scaleY: this.getScale('band').domain(labelsY).range([0, height]),
            colors: colors,
            sizes: sizes
        };
    }
});

vizPrototype.getGeoProjection = function (name) {
    return this.getD3('geo', name)();
};

//
//  GeoChart
//  =============
//
//  A chart displaying a geographical map
createChart('geochart', {
    // load these libraries - add 'leaflet'?
    requires: ['d3-scale', 'd3-geo', 'topojson', 'd3-geo-projection', 'd3-svg-legend'],

    schema: {
        // Geometry data to display in this chart - must be in the topojson source
        geometry: {
            type: 'string',
            description: 'The geometry to visualize from the topojson geometry objects',
            default: 'countries'
        },
        //
        // for choropleth maps
        // geoKey and dataKey are used to match geometry with data
        geoKey: {
            type: 'string',
            default: 'id'
        },
        dataKey: {
            type: 'string',
            default: 'id'
        },
        dataLabelKey: {
            type: 'string',
            default: 'label'
        },
        dataValueKey: {
            type: 'string',
            default: 'value'
        },
        neighbors: {
            type: 'boolean',
            default: false
        },
        // how many color buckets to visualise
        buckets: {
            type: 'number',
            default: 10
        },
        choroplethScale: {
            type: 'string',
            default: 'quantile'
        },
        //
        // specify one of the topojson geometry object for calculating
        // the projected bounding box
        boundGeometry: {
            type: 'string'
        },
        // how much to zoom out, 1 = no zoom out, 0.95 to 0.8 are sensible values
        boundScaleFactor: {
            type: 'number',
            default: 0.9
        },
        //
        projection: {
            type: 'string',
            default: 'kavrayskiy7'
        },
        graticule: {
            type: 'boolean',
            default: false
        },
        leaflet: {
            type: 'boolean',
            default: false
        },
        scale: {
            type: 'number',
            default: 200
        }
    },

    doDraw: function doDraw() {
        var info = dataInfo(this.frame);
        if (!info.topology) return warn$1('Topojson data not available - cannot draw topology');
        if (!this._geoPath) this.createGeoPath(info);
        this.update(info);
    },
    update: function update(info) {
        var model = this.getModel(),
            color = this.getModel('color'),
            box = this.boundingBox(),
            group = this.group(),
            geogroup = this.group('geo'),
            path = this._geoPath,
            data = geodata(this.$, info, model);

        if (!data) {
            var objects = Object.keys(info.topology.objects).map(function (key) {
                return '"' + key + '"';
            }).join(', ');
            return warn$1('Could not find *geometry* "' + model.geometry + '" in [' + objects + '] - cannot draw geochart');
        }

        group.transition(this.transition('group0')).attr("transform", this.translate(box.padding.left, box.padding.top));
        geogroup.transition(this.transition('group1')).attr("transform", this.translate(box.margin.left, box.margin.top));

        var paths = geogroup.selectAll('.geometry').data(data),
            fill = this.choropleth(data, box);

        this.center(info);

        paths.enter().append("path").attr("class", "geometry").attr("d", path).style('fill', 'none').style("stroke", this.modelProperty('stroke', color)).on("mouseover", this.mouseOver()).on("mouseout", this.mouseOut()).merge(paths).transition(this.transition('geometry')).attr("d", path).style("stroke", this.modelProperty('stroke', color)).style("fill", fill).style("fill-opacity", color.fillOpacity);

        paths.exit().remove();
    },
    createGeoPath: function createGeoPath(info) {
        var model = this.getModel(),
            projection = this.getGeoProjection(model.projection).scale(model.scale),
            $ = this.$,
            path = $.geoPath().projection(projection),
            self = this,
            lefletMap;

        this._geoPath = path;
        this.center(info);

        if (model.leaflet) {
            var leafletId = 'leaflet-' + model.uid,
                paper = this.paper();

            this.visualParent.paper.append('div').attr('id', leafletId);
            lefletMap = new $.Map(leafletId, { center: [37.8, -96.9], zoom: 4 }).addLayer(new $.TileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")), lefletMap.getPanes().overlayPane.appendChild(paper.element);
            projection = $.transform({ point: projectPoint });
            lefletMap.on("viewreset", function () {
                return self.update(info);
            });
        }

        return path;

        function projectPoint(x, y) {
            var point = lefletMap.latLngToLayerPoint(new $.LatLng(y, x));
            this.stream.point(point.x, point.y);
        }
    },
    center: function center(info) {
        var model = this.getModel();
        if (!model.boundGeometry) return;

        var path = this._geoPath,
            projection = path.projection(),
            box = this.boundingBox(),
            boundObject = info.topology.objects[model.boundGeometry],
            boundGeometry = boundObject ? this.$.feature(info.topology, boundObject).features : null;

        if (!boundGeometry) return warn$1('Could not find *boundGeometry* "' + model.boundGeometry + '" for centering - skip centering geochart');

        projection.scale(1).translate([0, 0]);

        var b = path.bounds(boundGeometry[0]),
            topLeft = b[0],
            bottomRight = b[1],
            scaleX = (bottomRight[0] - topLeft[0]) / box.innerWidth,
            scaleY = (bottomRight[1] - topLeft[1]) / box.innerHeight,
            scale = Math.round(model.boundScaleFactor / Math.max(scaleX, scaleY)),
            translate = [(box.innerWidth - scale * (bottomRight[0] + topLeft[0])) / 2, (box.innerHeight - scale * (bottomRight[1] + topLeft[1])) / 2];

        projection.scale(scale).translate(translate);
    },


    // choropleth map based on data
    choropleth: function choropleth(data, box) {
        var model = this.getModel(),
            dataLabelKey = model.dataLabelKey,
            dataValueKey = model.dataValueKey;
        var dataValue = void 0,
            valueRange = void 0,
            colors = void 0,
            buckets = void 0;

        if (model.neighbors) {
            dataValue = accessor('rank');
            valueRange = d3Array.extent(data, dataValue);
            buckets = valueRange[1] + 1;
        } else {
            dataValue = function dataValue(d) {
                return d.data[dataValueKey];
            };
            buckets = Math.min(model.buckets, data.length);
            valueRange = niceRange(d3Array.extent(data, dataValue), buckets);
        }

        colors = this.getScale(model.choroplethScale).range(this.colors(buckets).reverse()).domain(valueRange);

        this.legend({
            type: 'color',
            scale: colors
        }, box);

        return function (d) {
            d.label = d.data[dataLabelKey] || d.id;
            d.value = dataValue(d);
            d.color = colors(d.value);
            return d.color;
        };
    }
});

function dataInfo(frame) {
    var info = {};
    if (frame.type === 'frameCollection') frame.frames.each(function (df) {
        if (df.type === 'Topology') info.topology = df;else if (df.type === 'dataframe') info.data = df.data;
    });else if (frame.type === 'Topology') info.topology = frame;
    return info;
}

//
//  Create a geo data frame
//  ===========================
//
//  * geo - d3-geo & topojson object
//  * info - object with topology and data frame (optional)
function geodata(geo, info, config) {
    var geoKey = config.geoKey,
        dataKey = config.dataKey;
    var data = {},
        features = void 0,
        key = void 0,
        props = void 0;

    if (!info.topology) return warn$1('No topology object available');
    var geometry = info.topology.objects[config.geometry];
    if (!geometry) return warn$1('Topology object ' + config.geometry + ' is not available');

    var neighbors = config.neighbors ? geo.neighbors(geometry.geometries) : null;

    features = geo.feature(info.topology, geometry).features;
    if (info.data) data = info.data.reduce(function (o, d) {
        o[d[dataKey]] = d;return o;
    }, {});

    features = features.map(function (d) {
        props = d.properties;
        key = d[geoKey] || props[geoKey];
        return {
            id: key,
            type: d.type,
            geometry: d.geometry,
            data: d3Let.assign({}, props, data[key])
        };
    });

    if (neighbors) features.forEach(function (d, i) {
        d.neighbors = neighbors[i];
        d.rank = d3Array.max(d.neighbors, function (j) {
            return features[j].rank;
        }) + 1 | 0;
    });

    return features;
}

//

var memorySymbols = ['K', 'M', 'G'].map(function (s, i) {
    return {
        symbol: s,
        size: 1 << (i + 1) * 10
    };
}).reverse();

var binaryFormat = function (fmt) {
    var binaryFormat = d3Format.format(fmt);

    return function (value) {
        for (var s = 0; s < memorySymbols.length; ++s) {
            if (value >= memorySymbols[s].size) {
                value /= memorySymbols[s].size;
                return binaryFormat(value) + memorySymbols[s].symbol + 'B';
            }
        }
        return binaryFormat(value) + 'B';
    };
};

var marked = {
    props: ['url'],

    render: function render(data, props, el) {
        var _this = this;

        var self = this,
            inner = this.select(el).html();

        return d3View.viewProviders.require('marked').then(function (marked) {
            if (data.url) {
                return _this.fetchText(data.url).then(function (text) {
                    text = marked(text);
                    return self.viewElement('<div class="doc">' + text + '</div>');
                });
            } else {
                var text = marked(inner);
                return self.viewElement('<div class="doc">' + text + '</div>');
            }
        });
    }
};

var format$1 = d3TimeFormat.timeFormat('%d %b %Y, %H:%M');
var labels = ['system', 'arch', 'processor', 'cpus', 'python'];
var template = '<div class="card">\n<dic class="card-body">\n<dl class="row" d3-for="entry in info">\n    <dt class="col-sm-4" d3-html="entry.label"></dt>\n    <dd class="col-sm-8" d3-html="entry.value"></dd>\n</dl>\n</div>\n</div>';

var info = {
    model: function model() {
        return {
            info: []
        };
    },
    render: function render() {
        var model = this.model;
        model.dataStore.onData('benchmarks.info', function (frame) {
            model.info = info$1(frame.data[0]);
        });
        return this.viewElement(template);
    }
};

function info$1(o) {
    var date = new Date(o.date),
        data = [{
        label: 'date',
        value: format$1(date)
    }];
    labels.forEach(function (label) {
        data.push({
            label: label,
            value: o[label]
        });
    });
    return data;
}

if (d3Let.inBrowser) {
    if (window.development) d3View.viewProviders.setDebug(true);
}

colorScales.set('redyellowblue', function (d3) {
    return d3.scaleSequential(d3ScaleChromatic.interpolateRdBu);
});

d3Let.assign(visuals.options.dataContext, {
    $binaryFormat: binaryFormat
});

function start() {
    d3View.viewReady(function () {
        appView().mount('body');
    });
}

function appView() {
    var vm = d3View.view({
        components: {
            marked: marked,
            info: info
        }
    }).use(d3View.viewForms).use(d3View.viewBootstrapForms).use(visualComponents);

    d3View.viewEvents.on('component-mounted', function (cm) {
        if (cm.name === 'd3form') {
            cm.model.$on(function () {
                return formListener(cm);
            });
        }
    });

    return vm;
}

function formListener() {}

exports.start = start;
exports.appView = appView;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=visual.js.map
