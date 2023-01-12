/*
Underscore.js is a lightweight library
I wrote to replace jQuery, because I'm
stubborn and don't like using it.

It has a lot of similar functions, but you
query elements by using _(selector) instead

MIT License

Copyright (c) 2023 Max Pelic

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

/*
TODO:
convert to async functions
convert to fetch instead of XMLHttpRequest
*/

var underscore = function (selector) {
    "use strict";
    this.us = true;
    this.elements = [];
    if(selector && "object" === typeof selector) selector.us ? this.elements = selector.elements : this.elements = [selector];
    else if(selector && "<" === selector.trim()[0]) this.elements = _.createElements(selector);
    else selector && (this.elements = document.querySelectorAll(selector));
};

var _ = function (selector) {
    "use strict";
    return new underscore(selector);
};

_.objToURL = object => {
    if(!object) return "";
    let strings = [];
    for(let i in object)
        object.hasOwnProperty(i) && strings.push(encodeURIComponent(i) + "=" + encodeURIComponent(object[i]));
    return strings.join("&");
};

_.post = (url, data) => {
    "use strict";
    let x = new XMLHttpRequest(), r = {then:function(t){this.tfunction = t; return this},error:function(e){this.eFunction=e; return this}};
    x.withCredentials = true;
    x.onreadystatechange = function(){
        if(this.readyState != 4) return;
        if(this.status === 404 && r.eFunction) r.eFunction();
        return this.status == 200 && r.tfunction && r.tfunction(this.responseText);
    };
    x.open("POST", url, true);
    x.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    x.send(_.objToURL(data));
    return r;
};

_.get = url => {
    "use strict";
    let x = new XMLHttpRequest(), r = {then:function(t){this.tfunction = t; return this},error:function(e){this.eFunction=e; return this}};
    x.withCredentials = true;
    x.onreadystatechange = function(){
        if(this.readyState != 4) return;
        if(this.status === 404 && r.eFunction) r.eFunction();
        return this.status == 200 && r.tfunction && r.tfunction(this.responseText);
    };
    x.open("GET", url, true);
    x.send();
    return r;
};

_.createElements = html =>{
    "use strict";
    let d = document.createElement('div');
    d.innerHTML = html.trim();
    return Array.prototype.slice.call(d.children);
};

_.hash = () =>{
    let parts = window.location.hash.substr(1).split("&"), result = {};
    for(let i = 0; i < parts.length; i++){
        let split = parts[i].split("="), key = split.splice(0,1)[0], value = split.join("&");
        result[decodeURIComponent(key)] = decodeURIComponent(value);
    }
    return result;
};

underscore.prototype.each = function (f) {
    "use strict";
    for(let i in this.elements)
        this.elements.hasOwnProperty(i) && f(this.elements[i]);
    return this;
};

underscore.prototype.event = function (name, f) {
    "use strict";
    name = name.trim().split(" ");
    for(let i in name)
        name[i] && name.hasOwnProperty(i) && this.each(e=>e.addEventListener(name[i], f));
    return this;
};

underscore.prototype.makebutton = function () {
    "use strict";
    this.attribute("tabindex", "0").attribute("role", "button");
    this.event("keypress", function(e){
        if(!e || document.activeElement !== this) return 1;
        if(e.keyCode === 13 || e.keyCode === 32){
            this.click();
        }
    });
    return this;
};

underscore.prototype.class = function (name, toggle){
    "use strict";
    this.each(e=>{
        
        if(toggle == undefined) toggle = !e.classList.contains(name);
        
        toggle ? e.classList.add(name) : e.classList.remove(name);
    });
    return this;
};

underscore.prototype.value = function (value){
    if(!this.elements.length) return undefined;
    if(value !== undefined) this.each(e=>{e.value=value;e.setAttribute('lastval', value);e.classList.remove("modified")});
    return value !== undefined ? this : this.elements[0].value;
};

underscore.prototype.append = function(element){
    if(arguments.length > 1){
        for(let i = 0; i < arguments.length; i++)
            this.append(arguments[i]);
        return this;
    }
    this.each(e=>{
        if(element.us) element.each(c=>e.appendChild(c));
        else if("string" === typeof element) e.insertAdjacentHTML("beforeend", element);
        else e.appendChild(element);
    });
    return this;
};

underscore.prototype.prepend = function(element){
    if(arguments.length > 1){
        for(let i = 0; i < arguments.length; i++)
            this.prepend(arguments[i]);
        return this;
    }
    this.each(e=>{
        if(element.us) element.each(c=>e.insertBefore(c, e.firstChild));
        else if("string" === typeof element) e.insertAdjacentHTML("afterbegin", element);
        else e.insertBefore(element, e.firstChild);
    });
    return this;
};

underscore.prototype.after = function(element){
    if(arguments.length > 1){
        for(let i = 0; i < arguments.length; i++)
            this.after(arguments[i]);
        return this;
    }
    this.each(e=>{
        if(element.us) element.each(c=>e.insertAdjacentElement("afterend", c));
        else if("string" === typeof element) e.insertAdjacentHTML("afterend", element);
        else e.insertAdjacentElement("afterend", element);
    });
    return this;
};

underscore.prototype.before = function(element){
    if(arguments.length > 1){
        for(let i = 0; i < arguments.length; i++)
            this.before(arguments[i]);
        return this;
    }
    this.each(e=>{
        if(element.us) element.each(c=>e.insertAdjacentElement("beforebegin", c));
        else if("string" === typeof element) e.insertAdjacentHTML("beforebegin", element);
        else e.insertAdjacentElement("beforebegin", element);
    });
    return this;
};

underscore.prototype.html = function(html){
    if(this.elements.length && html === undefined){
        return this.elements[0].innerHTML;
    }
    this.each(e=>e.innerHTML = html);
    return this;
};

underscore.prototype.text = function(text){
    if(text === undefined) return this.elements[0] ? this.elements[0].textContent : "";
    this.each(e=>e.textContent = text);
    return this;
};

underscore.prototype.children = function(selector){
    let r = new underscore();
    this.each(e=>{
        let l;
        if(selector) l = e.querySelectorAll(selector);
        else l = e.children;
        for(let i = 0; i < l.length; i++) r.elements.push(l[i]);
    });
    return r;
};

underscore.prototype.parents = function(){
    let r = new underscore();
    this.each(e=>{
        let l = e.parentElement;
        if(r.elements.indexOf(l) === -1) r.elements.push(l);
    });
    return r;
};

underscore.prototype.replace = function(element){
    if(arguments.length > 1){
        for(let i = 0; i < arguments.length; i++)
            this.after(arguments[i]);
        return this;
    }
    this.each(e=>{
        if(element.us) element.each(c=>e.parentElement.replaceChild(c, e));
        else if("string" === typeof element){
            e.parentElement.insertAdjacentHTML("beforeend", element);
            e.parentElement.removeChild(e);
        }
        else e.parentElement.replaceChild(element, e);
    });
    return this;
};

underscore.prototype.remove = function(){
    this.each(e=>{
        e.parentElement && e.parentElement.removeChild(e);
    });
    return this;
};

underscore.prototype.attribute = function(name, value){
    if(undefined === value) return this.elements[0] ? this.elements[0].getAttribute(name) : undefined;
    this.each(e=>{
        value === false ? e.removeAttribute(name) : e.setAttribute(name, value);
    });
    return this;
};

underscore.prototype.href = function(value){
    if(undefined === value) return this.elements[0] ? this.elements[0].href : undefined;
    this.each(e=>{
        e.href = value;
    });
    return this;
};

underscore.prototype.focus = function(){
    this.each(e=>e.focus());
    return this;
};

underscore.prototype.click = function(){
    this.each(e=>e.click());
    return this;
};

underscore.prototype.trigger = function(name){
    this.each(e=>{
        let evt = new Event(name);
        e.dispatchEvent(evt);
    });
    return this;
};

underscore.prototype.style = function(name, value){
    //format name if needed
    if(name.split('-').length > 1){
        name = name.split('-');
        for(let i = 1; i < name.length; i++){
            name[i] = name[i].charAt(0).toUpperCase() + name[i].slice(1);
        }
        name = name.join('');
    }
    if(undefined === value) return this.elements[0] ? this.elements[0].style[name] : undefined;
    this.each(e=>{
        e.style[name] = value;
    });
    return this;
};

underscore.prototype.exists = function(){
    let exists = false;
    this.each(e=>{
        if(document.body.contains(e)) exists = true;
    });
    return exists;
};