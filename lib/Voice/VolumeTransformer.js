'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Transform = require('stream').Transform;

var Volume = (function (_Transform) {
	_inherits(Volume, _Transform);

	function Volume(volume) {
		_classCallCheck(this, Volume);

		_Transform.call(this);
		this.set(volume);
	}

	Volume.prototype.get = function get() {
		return this.volume;
	};

	Volume.prototype.set = function set(volume) {
		this.volume = volume === undefined ? 1 : volume;
	};

	Volume.prototype._transform = function _transform(buffer, encoding, callback) {
		var out = new Buffer(buffer.length);

		for (var i = 0; i < buffer.length; i += 2) {
			// Read Int16, multiple with multiplier and round down
			//console.log(this.volume, this.multiplier, buffer.readInt16LE(i));
			var uint = Math.floor(this.multiplier * buffer.readInt16LE(i));

			// Ensure value stays within 16bit
			uint = Math.min(32767, uint);
			uint = Math.max(-32767, uint);

			// Write 2 new bytes into other buffer;
			out.writeInt16LE(uint, i);
		}

		this.push(out);
		callback();
	};

	_createClass(Volume, [{
		key: 'volume',
		get: function get() {
			return this._volume === undefined ? 1 : this._volume;
		},
		set: function set(value) {
			this._volume = value;
		}
	}, {
		key: 'multiplier',
		get: function get() {
			return Math.tan(this.volume);
		}
	}]);

	return Volume;
})(Transform);

module.exports = Volume;
