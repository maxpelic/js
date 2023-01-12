/*
MIT License

Copyright (c) 2022 Max Pelic (maxpelic.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/**
 * Generates a number between 'start' and 'end' (inclusive)
 * 
 * @param {integer} start   Minimum number
 * @param {integer} end     Maximum number
 */
let randomRange = (start, end)=>{

    if(end - start <= 0 || end - start > 255)
        throw new Error("Range must be between 1 and 255.");
    if(end < start)
        throw new Error("Start must be less than end.");

    let bytes = new Uint8Array(1);
    window.crypto.getRandomValues(bytes);

    //rejection sampling
    if(bytes[0] + start > end)
        return randomRange(start, end);

    return bytes[0] + start;

}

let defaults_length = randomRange(8, 10);
let defaults_numeric = randomRange(1, 3);
let defaults_symbol = randomRange(1, 2);
let defaults_upper = randomRange(1, 2);
let defaults_lower = randomRange(1, 2);

/**
* Secure Hash Algorithm (SHA1)
* http://www.webtoolkit.info/
* (minified)
**/
function SHA1(r){function o(r,o){return r<<o|r>>>32-o}function e(r){var o,e="";for(o=7;o>=0;o--)e+=(r>>>4*o&15).toString(16);return e}var t,a,h,n,C,c,f,d,A,u=new Array(80),g=1732584193,i=4023233417,s=2562383102,S=271733878,m=3285377520,p=(r=function(r){r=r.replace(/\r\n/g,"\n");for(var o="",e=0;e<r.length;e++){var t=r.charCodeAt(e);t<128?o+=String.fromCharCode(t):t>127&&t<2048?(o+=String.fromCharCode(t>>6|192),o+=String.fromCharCode(63&t|128)):(o+=String.fromCharCode(t>>12|224),o+=String.fromCharCode(t>>6&63|128),o+=String.fromCharCode(63&t|128))}return o}(r)).length,l=new Array;for(a=0;a<p-3;a+=4)h=r.charCodeAt(a)<<24|r.charCodeAt(a+1)<<16|r.charCodeAt(a+2)<<8|r.charCodeAt(a+3),l.push(h);switch(p%4){case 0:a=2147483648;break;case 1:a=r.charCodeAt(p-1)<<24|8388608;break;case 2:a=r.charCodeAt(p-2)<<24|r.charCodeAt(p-1)<<16|32768;break;case 3:a=r.charCodeAt(p-3)<<24|r.charCodeAt(p-2)<<16|r.charCodeAt(p-1)<<8|128}for(l.push(a);l.length%16!=14;)l.push(0);for(l.push(p>>>29),l.push(p<<3&4294967295),t=0;t<l.length;t+=16){for(a=0;a<16;a++)u[a]=l[t+a];for(a=16;a<=79;a++)u[a]=o(u[a-3]^u[a-8]^u[a-14]^u[a-16],1);for(n=g,C=i,c=s,f=S,d=m,a=0;a<=19;a++)A=o(n,5)+(C&c|~C&f)+d+u[a]+1518500249&4294967295,d=f,f=c,c=o(C,30),C=n,n=A;for(a=20;a<=39;a++)A=o(n,5)+(C^c^f)+d+u[a]+1859775393&4294967295,d=f,f=c,c=o(C,30),C=n,n=A;for(a=40;a<=59;a++)A=o(n,5)+(C&c|C&f|c&f)+d+u[a]+2400959708&4294967295,d=f,f=c,c=o(C,30),C=n,n=A;for(a=60;a<=79;a++)A=o(n,5)+(C^c^f)+d+u[a]+3395469782&4294967295,d=f,f=c,c=o(C,30),C=n,n=A;g=g+n&4294967295,i=i+C&4294967295,s=s+c&4294967295,S=S+f&4294967295,m=m+d&4294967295}return(A=e(g)+e(i)+e(s)+e(S)+e(m)).toUpperCase()}


window.defaultFilters = window.defaultFilters || [
    {
        type:"length",
        value:defaults_length,
        message:"Password must be at least " + defaults_length + " characters long.",
        required:true
    },
    {
        type:"numeric",
        value:defaults_numeric,
        message:"Password must include at least " + defaults_numeric + " number" + (defaults_numeric === 1 ? "" : "s") + ".",
        required:true
    },
    {
        type:"symbol",
        value:defaults_symbol
    },
    {
        type:"lower",
        value:defaults_lower,
        message:"Password must include at least " + defaults_lower + " lowercase letter" + (defaults_lower === 1 ? "" : "s") + ".",
        required:true
    },
    {
        type:"upper",
        value:defaults_upper
    },
    {
        type:"pwnd",
        message:"This password was found in a data breach, and may not be secure.",
        weight:10
    }
];

/**
 * Check the strength of a password.
 * 
 * Check the strength of a new password entered by a user.  This function can check against 
 * data breaches, length requirements, character requirements, and more.
 * 
 * In order to keep requirements secure, unsupplied arguments will be randomly generated each
 * time the script is loaded.  So, someone creating a password on one page may have different
 * requirements than a different user, or the same user after reloading the page or visiting
 * a different page.  This ensures that people cannot leverage the requirements to make it
 * easier to brute-force passwords checked with this script.
 * 
 * @param {string} password         The password the user entered.
 * @param {array} filters           An array of filters to apply to the password.
 * 
 * Each filter should have the following attributes:
 * 
 * type {string}: 
 * length|upper|lower|numeric|symbol|pwnd|regex
 * 
 * value {varies}: (optional based on type) 
 * Could be a number of required characters or regex pattern
 * 
 * weight {numeric}: (optional)
 * Numeric value that affects the final score. Using a negitive value will produce unreliable results.
 * Defaults to 1
 * 
 * required {boolean}: (optional)
 * Defaults to false
 * 
 * message {string}: (optional)
 * Error message to return if the password does not meet the requirement
 * This should be specified if required is true or weight is 0
 * 
 * If the filters object is not defined, the system will use the window.defaultFilters value.
 * 
 * @return {object}             Returns an object that describes the results.
 * 
 * The object will include the following attributes:
 * 
 * errors {array}:
 * An array of error strings
 * 
 * warnings {array}:
 * An array of warning messages
 * 
 * strength {numeric}:
 * The strength of the password, generated based on the weights
 * 
 * strengthPercentage {decimal}:
 * The strength percentage, between 0 and 1
 * 
 * passed {boolean}:
 * Valid password
 */
async function checkPassword(password, filters){
    if(!filters || !filters.length) filters = window.defaultFilters;

    let result = {
        errors:[],
        warnings:[],
        strength:0,
        strengthPercentage:0,
        passed:true
    };

    let updateResult = (filter, passed)=>{
        if(!passed){
            if(filter.message) (filter.required ? result.errors : result.warnings).push(filter.message);
            if(filter.required) result.passed = false;
        } else {
            result.strength += filter.weight;
        }
    }

    //check filters
    for(let i = 0; i < filters.length; i++){

        //defaults
        if(filters[i].weight === undefined) filters[i].weight = 1;

        //check match
        switch(filters[i].type){

            case "length":
                updateResult(filters[i], password.length >= filters[i].value);
                break;

            case "upper":
                updateResult(filters[i], password.length - password.replace(/[A-Z]/g, '').length >= filters[i].value);
                break;

            case "lower":
                updateResult(filters[i], password.length - password.replace(/[a-z]/g, '').length >= filters[i].value);
                break;

            case "numeric":
                updateResult(filters[i], password.length - password.replace(/[0-9]/g, '').length >= filters[i].value);
                break;

            case "symbol":
                updateResult(filters[i], password.replace(/[a-zA-Z0-9]/g, '').length >= filters[i].value);
                break;

            case "pwnd":
                //only use this if it's a valid password, to save time and bandwidth
                if(!result.passed) break;

                let hash = SHA1(password), prefix = hash.substring(0, 5), suffix = hash.substring(5);
                let request = await fetch("https://api.pwnedpasswords.com/range/" + prefix);
                let hashes = await request.text();
                hashes = hashes.split("\n");
                for(let j = 0; j <= hashes.length; j++){
                    if(j === hashes.length){
                        updateResult(filters[i], true);
                    } else if(hashes[j].startsWith(suffix)){
                        updateResult(filters[i], false);
                        break;
                    }
                }
                break;

            case "regex":
                updateResult(filters[i], password.match(filters[i].value));
                break;

            default:
                console.warn(filters[i].type + " is not a valid filter");
        }
    }

    let max_weight = 0;
    for(let i = 0; i < filters.length; i++) max_weight += filters[i].weight;
    result.strengthPercentage = result.strength / max_weight;

    return result;

};