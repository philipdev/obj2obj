# obj2obj
Utility to transform JavaScript object properties

## Example 1
```
var transform = require('obj2obj');
var src = { 
	a:'X', 
	b:'Y', 
	c:'Z'
};
var template = { 'a':'x', 'b':'y', 'c': 'z' };

console.log( transform(template, src) );
```
Outputs: { x: 'X', y: 'Y', z: 'Z' }

## Example 2

```
var transform = require('obj2obj');
var src = { 
	from:[{ a:1, b:9},{ a:2, b:10}]
};
var template = { 'from.*.a': 'a.*',  'from.*.b': 'b.*'};

console.log( transform(template, src) );
```