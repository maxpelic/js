# PassTheCheck
 A password strength check that implements advanced checks. You can view an example at https://cdn.maxpelic.com/passthecheck/example.html

## Implementation
You can include this in your project by downloading passthecheck.min.js or linking to the script https://cdn.maxpelic.com/passthecheck/v1/passthecheck.min.js

To check a password, call the function `passwordCheck(password, filters = window.defaultFilters)`.  The function takes two parameters: `password` (the password to check), and `filters`.

Filters should be an array of filters to check. Each filter should be an object with the following attributes:
```
"type": the type of filter.
- "length": minimum length of the password
- "upper": minimum number of uppercase letters
- "lower": minimum number of lowercase letters
- "numeric": minimum number of numbers (0-9)
- "symbol": minimum of characters that do not fit any of the other options
- "regex": a custom regular expression that the password must match
- "pwnd": check if the password is on a list of pwned passwords

"value": the value of the filter.
If they type is length, upper, lower, numeric, or symbol, require this number of matching characters
If the type is regex, match this regular expression

"weight": used in calculating the password score. This defaults to 1, and a value of 0 will not affect the score.

"required": if true, the password will not pass the check unless it fits this filter.

"message": a string to return as an error or warning if the password does not match the filter
```

The checkPassword function will return a promise that will return a result object.  The object will always have the following attributes:
```
"errors": an array of message strings from required filters that did not match the password

"warnings": an array of message strings from optional filters that did not match the password

"strength": the strength of the password, which is the sum of the weights of the passed filters

"strengthPercentage": a decimal value between 0 and 1, calculated by dividing the strength value by the total possible strength

"passed": true if the password passed all the required filters, false otherwise
```

The system generates filters when the script is loaded (stored in `window.defaultFilters`) when the script is loaded, and these filters have random values (to prevent people from guessing passwords based on standard requirements).

## Example

You can view the index.html file to see a working example.  A call to this function might look like:
```js
let result = await checkPassword(document.getElementByID("password").value, [
    {
        type:"symbol",
        value:1,
        message:"Suggestion: include at least 1 symbol"
    },
    {
        type:"length",
        value:10,
        message:"Password must be at least 10 characters long"
    },
    {
        type:"lower",
        value:5,
        message:"Password must include at least 5 lowercase letters.",
        required:true
    },
    {
        type:"pwnd",
        message:"This password was found in a data breach, please choose a different password.",
        required:true
    }
]);
```