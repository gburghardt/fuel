/*! Fuel, Version 1.1.0 (2014/11/19) */
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
    	: function(element, event, callback) {
    		element.attachEvent("on" + event, callback);
    	},
    filters = {
    	alpha: /[a-zA-Z]/,
    	alphaUpper: /[A-Z]/,
    	alphaLower: /[a-z]/,
    	alphaNumeric: /[a-zA-Z0-9]/,
    	date: /[-\/0-9]/,
    	decimal: /[\d\.]/,
    	email: /[-%@\w\.]/i,
    	numeric: /[\d]/,
    	phone: /[-0-9\(\) ]/,
    	taxId: /[-0-9]/,
    	words: /[a-zA-Z0-9 ]/
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

function delay(millis, callback, args) {
	args = args instanceof Array ? args :[args];

	setTimeout(function() {
		callback.apply(null, args);
		callback = args = null;
	}, millis);
}

function focusEnd(element) {
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
}

function getMaxLength(element) {
	// Some browsers return -1 for the maxlength when it's not specified,
	// others return the max value for JavaScript Number's.
	return Number(element.getAttribute("maxlength") || "0");
}

function hasSelection(element) {
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
}

function preventDefault(event) {
	if (event.preventDefault) {
		event.preventDefault();
	}
	else {
		event.returnValue = false;
	}
}

function stopPropagation(event) {
	if (event.stopPropagation) {
		event.stopPropagation();
	}
	else {
		event.cancelBubble = true;
	}
}

function handleAutoTab(event) {
	event = event || global.event;

	var target = event.target || event.srcElement,
		series = target.getAttribute("data-autotab"),
		code = "charCode" in event
		     ? event.charCode
		     : event.keyCode,
		elements, i, maxLength;

	if (!series || target.nodeName !== "INPUT" || target.type !== "text") {
		return;
	}
	else if (!code && event.keyCode != metaKeys.Backspace) {
		return;
	}

	maxLength = getMaxLength(target);

	if (maxLength < 1) {
		throw new Error("Missing maxlength attribute on " + target.nodeName + "[type=" + target.type + "][name=" + target.name + "][id=" + target.id + "]");
	}

	elements = target.parentNode.querySelectorAll("input[data-autotab=" + series + "]");

	if (event.keyCode === metaKeys.Backspace) {
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
				// Delay the call to focusEnd because IE will apply the new character
				// to the next text box if the focus is set inside the event handler
				// for the previous text box.
				delay(0, focusEnd, elements[i + 1]);

				break;
			}
		}
	}
}

function handleTextAreaMaxLength(event) {
	event = event || global.event;

	var target = event.target || event.srcElement,
	    code = "charCode" in event
	         ? event.charCode
	         : event.keyCode,
		maxLength = -1;

	if (target.nodeName === "TEXTAREA" && (maxLength = getMaxLength(target)) > 1 && target.value.length >= maxLength && code > 0) {
		preventDefault(event);
		stopPropagation(event);
	}
}

function handleTextBoxFilter(event) {
	event = event || global.event;

	var target = event.target || event.srcElement,
		code = "charCode" in event
			? event.charCode
			: event.keyCode,
		key = event.key || String.fromCharCode(code),
		filter, regex;

	if (!code || target.nodeName !== "INPUT" || (target.type !== "text" && target.type !== "password")) {
		return;
	}

	filter = target.getAttribute("data-filter");

	if (filter) {
		regex = filters[filter]
			 // Memoize custom filters so the cached RegExp object is used next time
		     || (filters[filter] = new RegExp(filter.replace(/(['"])/g, "\\$1")));

		if (!regex.test(key)) {
			preventDefault(event);
			stopPropagation(event);
		}
	}
}

addEvent(root, "keypress", handleTextBoxFilter);

if (!("maxlength" in document.createElement("textarea"))) {
	addEvent(root, "keypress", handleTextAreaMaxLength);
}

addEvent(root, "keypress", handleAutoTab);
addEvent(root, "keyup", handleAutoTab);

return {
	Filters: filters,

	plugin: function(factory) {
		factory(global, document, root, metaKeys, addEvent);

		return this;
	}
};

})(this);
