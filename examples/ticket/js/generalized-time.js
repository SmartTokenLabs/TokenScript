;(function() {
'use strict'

    function pad2(num) {
      if (num < 10) return '0' + num
      return '' + num
    }

    function pad4(num) {
      if (num < 10) return '000' + num
      if (num < 100) return '00' + num
      if (num < 1000) return '0' + num
      return '' + num
    }

    function GeneralizedTime(generalizedTime) {
	this.rawData = generalizedTime;
    }

    GeneralizedTime.prototype.getYear = function () {
	return parseInt(this.rawData.substring(0, 4), 10);
    }
    
    GeneralizedTime.prototype.getMonth = function () {
	return parseInt(this.rawData.substring(4, 6), 10) - 1;
    }

    GeneralizedTime.prototype.getDay = function () {
	return parseInt(this.rawData.substring(6, 8), 10)
    },

    GeneralizedTime.prototype.getHours = function () {
	return parseInt(this.rawData.substring(8, 10), 10)
    },
    
    GeneralizedTime.prototype.getMinutes = function () {
	var minutes = parseInt(this.rawData.substring(10, 12), 10)
	if (minutes) return minutes
	return 0
    },
    
    GeneralizedTime.prototype.getSeconds = function () {
	var seconds = parseInt(this.rawData.substring(12, 14), 10)
	if (seconds) return seconds
	return 0
    },
    
    GeneralizedTime.prototype.getMilliseconds = function () {
	var startIdx
	if (time.indexOf('.') !== -1) {
	  startIdx = this.rawData.indexOf('.') + 1
	} else if (time.indexOf(',') !== -1) {
	  startIdx = this.rawData.indexOf(',') + 1
	} else {
	  return 0
	}

	var stopIdx = time.length - 1
	var fraction = '0' + '.' + time.substring(startIdx, stopIdx)
	var ms = parseFloat(fraction) * 1000
	return ms
    },
    
    GeneralizedTime.prototype.getTimeZone = function () {
	let time = this.rawData;
	var length = time.length
	var symbolIdx
	if (time.charAt(length - 1 ) === 'Z') return 0
	if (time.indexOf('+') !== -1) {
	  symbolIdx = time.indexOf('+')
	} else if (time.indexOf('-') !== -1) {
	  symbolIdx = time.indexOf('-')
	} else {
	  return NaN
	}

	var minutes = time.substring(symbolIdx + 2)
	var hours = time.substring(symbolIdx + 1, symbolIdx + 2)
	var one = (time.charAt(symbolIdx) === '+') ? 1 : -1

	var intHr = one * parseInt(hours, 10) * 60 * 60 * 1000
	var intMin = one * parseInt(minutes, 10) * 60 * 1000
	var ms = minutes ? intHr + intMin : intHr
	return ms
      }

    if (typeof exports === 'object') {
      module.exports = GeneralizedTime
    } else if (typeof define === 'function' && define.amd) {
      define(GeneralizedTime)
    } else {
      window.GeneralizedTime = GeneralizedTime
    }
}())
