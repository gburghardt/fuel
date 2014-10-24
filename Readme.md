# Form Usability Enhancement Library (FUEL)

Just a few quick and dirty usability enhancements.

- Enforce form field max lengths on blur
- Text box filters to prevent invalid characters from appearing
- Setting focus to the next text box in the series when a max length is reached

## Enforce Text Box Max Lengths

The `maxlength` attribute on text boxes prevents the user from typing
more than they should, however this doesn't prevent people from
pasting too many characters. This library will remove excess
characters when focus is moved away from the field.

```html
<input type="text" size="10" maxlength="5">
<input type="text" size="10">
```

In the first tag, the `maxlength` attribute is used to chop off excess
characters. The second text box is missing the `maxlength` attribute
so no characters are removed.

### Supporting `maxlength` on Textareas

Even though the `maxlength` attribute does not affect `<textarea>`
elements on some browsers, the excess characters will get trimmed
anyway on-blur.

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
Currently the only extensions you can create are adding named input
filters:

```javascript
Fuel.Filters.foo = /[:0-9]/;
```

Then you can reference it by name:

```html
<input type="text" data-filter="foo">
```
