/*
 * js-priority-queue by Adam Hooper (https://github.com/adamhooper/js-priority-queue)
 * heapqueue.js by antimatter15 (https://github.com/antimatter15/heapqueue.js)
 *
 * Using it is pretty simple, you just create an instance of HeapQueue
 * while optionally specifying a comparator as the argument:
 *
 * var heapq = new HeapQueue();
 *
 * var customq = HeapQueue.create(function(a, b){
 *   // if b > a, return negative
 *   // means that it spits out the smallest item first
 *   return a - b;
 * });
 *
 * You can now initialize your heap with inital values:
 *
 * var heapq = HeapQueue.create([42, 3, 25, 14]);
 *
 * Note that in this case, the default comparator is identical to
 * the comparator which is used explicitly in the second queue.
 *
 * Once you've initialized the heapqueue, you can plop some new
 * elements into the queue with the push method (vaguely reminiscent
 * of typical javascript arays)
 *
 * heapq.push(42);
 * heapq.push("kitten");
 *
 * The push method returns the new number of elements of the queue.
 *
 * You can push anything you'd like onto the queue, so long as your
 * comparator function is capable of handling it. The default
 * comparator is really stupid so it won't be able to handle anything
 * other than an number by default.
 *
 * You can preview the smallest item by using peek.
 *
 * heapq.push(-9999);
 * heapq.peek(); // ==> -9999
 *
 * The useful complement to to the push method is the pop method,
 * which returns the smallest item and then removes it from the
 * queue.
 *
 * heapq.push(1);
 * heapq.push(2);
 * heapq.push(3);
 * heapq.pop(); // ==> 1
 * heapq.pop(); // ==> 2
 * heapq.pop(); // ==> 3
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['exports'], function (exports) {
            factory((root.HeapQueue = exports));
        });
    } else if (typeof exports === 'object') {
        // CommonJS
        factory(exports);
    } else {
        // Browser globals
        factory((root.HeapQueue = {}));
    }
}(this, function (exports) {
    function _isFunction(func) {
		var o = {};
		return func && o.toString.call(func) === '[object Function]';
	}

	function _bubbleUp(heap, pos) {
		var parent, x;
		while (pos > 0) {
			parent = (pos - 1) >>> 1;
			if (heap.cmp(heap._data[pos], heap._data[parent]) < 0) {
				x = heap._data[parent];
				heap._data[parent] = heap._data[pos];
				heap._data[pos] = x;
				pos = parent;
			} else {
				break;
			}
		}
		return void 0;
	}

	function _bubbleDown(heap, pos) {
		var last, left, minIndex, right, x;
		last = heap._data.length - 1;
		while (true) {
			left = (pos << 1) + 1;
			right = left + 1;
			minIndex = pos;
			if (left <= last && heap.cmp(heap._data[left], heap._data[minIndex]) < 0) {
				minIndex = left;
			}
			if (right <= last && heap.cmp(heap._data[right], heap._data[minIndex]) < 0) {
				minIndex = right;
			}
			if (minIndex !== pos) {
				x = heap._data[minIndex];
				heap._data[minIndex] = heap._data[pos];
				heap._data[pos] = x;
				pos = minIndex;
			} else {
				break;
			}
		}
		return void 0;
	}

	function _heapify(heap) {
		var i, _i, _max;
		if (heap._data.length > 0) {
			for (i = _i = 1, _max = heap._data.length; 1 <= _max ? _i < _max : _i > _max; i = 1 <= _max ? ++_i : --_i) {
				_bubbleUp(heap, i);
			}
		}
		return void 0;
	}

	function HeapQueue(data, cmp) {
		this.cmp = (cmp || function(a, b) {
			return a - b;
		});
		this._data = [];

		if (data && data.constructor === Array) {
			this._data = data.concat();
			_heapify(this);
		} else if (_isFunction(data)) {
			this.cmp = data;
		}
	}

	HeapQueue.prototype = {
		size: function() {
			return this._data.length;
		},
		peek: function() {
			return this._data[0];
		},
		push: function(value) {
			this._data.push(value);
			_bubbleUp(this, this._data.length - 1);
			return void 0;
		},
		pop: function() {
			var last, ret;
			ret = this._data[0];
			last = this._data.pop();
			if (this._data.length > 0) {
				this._data[0] = last;
				_bubbleDown(this, 0);
			}
			return ret;
		}
	};

	// export factory
	exports.create = function(options) {
		return new HeapQueue(options.data, options.predicate);
	};
}));
