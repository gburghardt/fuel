this.Fuel = (function (global) {

	var document = global.document,
	    root = document.documentElement,
		addEvent = root.addEventListener
			? function(element, event, callback) {
				if (event == "focusin" || event == "focusout") {
					element.addEventListener(event, callback, true);
				}
				else {
					element.addEventListener(event, callback, false);
				}
			}
			: function (element, event, callback) {
				element.attachEvent("on" + event, callback);
			},
		focusEnd = function(element) {
			element.focus();

			if ("selectionStart" in element) {
				element.selectionStart = element.selectionEnd = element.value.length;
			}
			else if ("selection" in document) {
				var range = document.selection.createRange();

				range.moveStart("character", element.value.length);
				range.moveEnd("character", element.value.length);
				range.select();
			}
		},
		preventDefault = function(event) {
			if (event.preventDefault) {
				event.preventDefault();
			}
			else {
				event.returnValue = false;
			}
		},
		removeEvent = root.addEventListener
			? function(element, event, callback) {
				if (event == "focusin" || event == "focusout") {
					element.removeEventListener(event, callback, true);
				}
				else {
					element.removeEventListener(event, callback, false);
				}
			}
			: function(element, event, callback) {
				element.detachEvent("on" + event, callback);
			},
		filters = {
				alpha: /[a-zA-Z]/,
				alphaNumeric: /[a-zA-Z0-9]/,
				numeric: /[\d]/,
				phone: /[-0-9\(\) ]/
			},
		metaKeyCodes = {
				8: "Backspace",
				9: "Tab",
				13: "Enter",
				37: "Left",
				38: "Up",
				39: "Right",
				40: "Down",
				46: "Del"
			},
		metaKeys = {
				Backspace: 8,
				Tab: 9,
				Enter: 13,
				Left: 37,
				Up: 38,
				Right: 39,
				Down: 40,
				Del: 46
			};

	// Filters
	addEvent(root, "keypress", function(event) {
		event = event || global.event;

		var target = event.target || event.srcElement,
			code = event.code || event.keyCode || event.which,
			key = event.key || String.fromCharCode(code),
			filter, regex;

		if (target.nodeName !== "INPUT" || target.type !== "text" || code in metaKeyCodes) {
			return;
		}

		filter = target.getAttribute("data-filter");
		regex = filters[filter] || new RegExp(filter);

		if (!regex.test(key)) {
			preventDefault(event);
		}
	});

	// Auto Focus next element in series
	addEvent(root, "keyup", function(event) {
		event = event || global.event;

		var target = event.target || event.srcElement,
			series = target.getAttribute("data-series"),
			code = event.code || event.keyCode || event.which,
			elements, i, maxLength;

		if (!series || target.nodeName !== "INPUT" || target.type !== "text") {
			return;
		}
		else if (code in metaKeyCodes && code != metaKeys.Backspace) {
			return;
		}

		maxLength = target.maxLength > 0
			? target.maxLength
			: target.size;

		elements = target.parentNode.querySelectorAll("input[data-series=" + series + "]");

		if (code == metaKeys.Backspace) {
			if (!target.value) {
				// Move focus to previous field when value is empty
				i = elements.length;

				while (i--) {
					if (target == elements[i] && i - 1 >= 0) {
						focusEnd(elements[i - 1]);
						break;
					}
				}
			}
		}
		else if (target.value.length === maxLength) {
			// Move focus to next field
			for (i = 0; i < elements.length; i++) {
				if (target === elements[i] && i + 1 < elements.length) {
					elements[i + 1].focus();
					elements[i + 1].select();
					break;
				}
			}
		}
		else if (target.value.length > maxLength) {
			target.value = target.value.substring(0, maxLength);
		}
	});

	return {
		Filters: filters
	};

})(this);
