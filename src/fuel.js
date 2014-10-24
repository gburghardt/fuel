this.Fuel = (function (global) {

	var document = global.document,
	    root = document.documentElement,
		addEvent = root.addEventListener
			? function(element, event, callback) {
				if (event === "focusin") {
					element.addEventListener("focus", callback, true);
				}
				else if (event === "focusout") {
					element.addEventListener("blur", callback, true);
				}
				else {
					element.addEventListener(event, callback, false);
				}
			}
			: function (element, event, callback) {
				element.attachEvent("on" + event, callback);
			},
		delay = function(millis, callback, args) {
			args = args instanceof Array ? args :[args];

			setTimeout(function() {
				callback.apply(null, args);
				callback = args = null;
			}, millis);
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
		getMaxLength = function(element) {
			return Number(element.getAttribute("maxlength") || element.getAttribute("size") || "0");
		},
		hasSelection = function(element) {
			if ("selectionStart" in element) {
				return element.selectionStart != element.selectionEnd;
			}
			else if ("selection" in document) {
				element.focus();
				var range = document.selection.createRange();

				return ("toString" in range)
					? !!range.toString()
					: !!range.text;
			}
			else {
				return false;
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

	function handleAutoTab(event) {
		event = event || global.event;

		var target = event.target || event.srcElement,
			series = target.getAttribute("data-autotab"),
			code = event.code || event.keyCode || event.which || -1,
			elements, i, maxLength, nextElement;

		if (!series || target.nodeName !== "INPUT" || target.type !== "text") {
			return;
		}
		else if (code in metaKeyCodes && code != metaKeys.Backspace) {
			return;
		}

		maxLength = getMaxLength(target);
		elements = target.parentNode.querySelectorAll("input[data-autotab=" + series + "]");

		if (code == metaKeys.Backspace) {
			if (event.type == "keyup" && !target.value.length) {
				// Move focus to previous field when value is empty
				i = elements.length;

				while (i--) {
					if (target == elements[i] && i - 1 >= 0) {
						focusEnd(elements[i - 1]);
					}
				}
			}
		}
		else if (event.type == "keypress" && (target.value.length === maxLength || target.value.length + 1 === maxLength) && !hasSelection(target)) {
			if (target.value.length === maxLength) {
				preventDefault(event);
			}

			// Move focus to next field
			for (i = 0; i < elements.length; i++) {
				if (target === elements[i] && i + 1 < elements.length) {
					nextElement = elements[i + 1];

					if (!nextElement.value && target.value.length === maxLength) {
						nextElement.value = String.fromCharCode(code);
					}

					// Delay the call to focusEnd because IE will apply the new character
					// to the next text box if the focus is set inside the event handler
					// for the previous text box.
					delay(0, focusEnd, nextElement);

					break;
				}
			}
		}
	}

	function handleTextBoxMaxLength(event) {
		event = event || global.event;

		var target = event.target || event.srcElement,
			maxLength = -1;

		if (target.nodeName !== "INPUT" || target.type !== "text" || target.disabled) {
			return true;
		}

		maxLength = getMaxLength(target);

		if (maxLength && target.value.length > maxLength) {
			target.value = target.value.substring(0, maxLength);
		}
	}

	function handleTextBoxFilter(event) {
		event = event || global.event;

		var target = event.target || event.srcElement,
			code = event.code || event.keyCode || event.which,
			key = event.key || String.fromCharCode(code),
			filter, regex;

		if (target.nodeName !== "INPUT" || target.type !== "text" || code in metaKeyCodes) {
			return;
		}

		filter = target.getAttribute("data-filter");

		regex = filters[filter]
			 // Memoize custom filters so the cached RegExp object is used next time
		     || (filters[filter] = new RegExp(filter));

		if (!regex.test(key)) {
			preventDefault(event);
		}
	}

	addEvent(root, "keypress", handleTextBoxFilter);
	addEvent(root, "keypress", handleAutoTab);
	addEvent(root, "keyup", handleAutoTab);
	addEvent(root, "focusout", handleTextBoxMaxLength);

	return {
		Filters: filters
	};

})(this);
