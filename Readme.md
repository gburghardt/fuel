# Form Usability Enhancement Library (FUEL)

Just a few quick and dirty usability enhancements.

- Support for the `maxlength` attribute on text areas for non compatible browsers
- Text box filters to prevent invalid characters from appearing
- Setting focus to the next text box in the series when a max length is reached

## Supporting `maxlength` on Textareas

The `maxlength` attribute does not work in some browsers. Fuel patches this so
it respects the `maxlength` attribute.

## Character Filters On Text Boxes

Prevent the user from typing invalid characters using input filters.
The following filters are supported right out of the box:

- `alpha` - Only lower or upper case letters
- `alphaLower` - Only lower case letters
- `alphaUpper` - Only upper case letters
- `alphaNumeric` - Only upper and lower case letters, and numbers
- `date` - Only date related characters (numbers, dashes and forward slashes)
- `decimal` - Only flowing point numbers
- `email` - Only characters valid in email addresses
- `numeric` - Only numbers,
- `phone` - Only characters allowed in phone numbers (numbers, dashes and parenthesis)
- `taxId` - Only characters allowed in tax Ids (numbers and dashes)
- `words` - Only word characters (letters, numbers and spaces)

To apply a filter to a text box, add the `data-filter` attribute to
specify the name of a filter:

```html
<input type="text" data-filter="phone" name="telephone">

<input type="text" data-filter="email" name="email">
```

You can create your own custom filters by entering a regular
expression as the value:

```html
<input type="text" data-filter="[.0-9]" name="ip_address">
```

## Set Focus On The Next Field Automatically

Sometimes you want the user to enter a telephone number, and you
provide three different text boxes, one the for area code, and another
for the remaining parts of the number. You can group them together so
that upon reaching the max length of a text box, it moves focus to the
next one.

```html
Phone Number:
<input type="text" data-autotab="phoneNumber" maxlength="3">
<input type="text" data-autotab="phoneNumber" maxlength="3">
<input type="text" data-autotab="phoneNumber" maxlength="4">
```

## Combining Features

You can combine all of these features. For instance, if you want to
split the phone number into three different fields and set focus to
the next one, and filter the input so only numbers are added, just
add the `data-filter` attribute:

```html
Phone Number:
<input type="text" data-autotab="phoneNumber" maxlength="3" data-filter="numeric">
<input type="text" data-autotab="phoneNumber" maxlength="3" data-filter="numeric">
<input type="text" data-autotab="phoneNumber" maxlength="4" data-filter="numeric">
```

## Extending Fuel

You can extend Fuel. The global variable `Fuel` is available for you.

### Custom Textbox Filters

You create custom named input filters:

```javascript
Fuel.Filters.foo = /[:0-9]/;
```

Then you can reference it by name:

```html
<input type="text" data-filter="foo">
```

### Creating Plugins

The `Fuel.plugin` function allows you to create your own plugins for Fuel.

```javascript
Fuel.plugin(function(global, document, root, metaKeys, addEvent) {
	// Your plugin code here
});
```

The `root` argument is the element to which Fuel attaches all of its events,
which is the `<html>` tag. The `addEvent` argument is a cross browser way to add
events to DOM nodes:

```javascript
addEvent(element, "click", function(event) {
	event = event || global.event;
	// process event...
});
```

Plugins should utilize event delegation as much as possible.
