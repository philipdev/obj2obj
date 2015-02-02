/*global describe, it*/
'use strict';
var assert = require('assert');

var obj2obj = require('../lib/objtemplate.js');


describe('obj2obj', function () {
    describe('basic mapping', function () {
        
        var src, template;
        
        src= {
            a:'a',
            b:1,
            c: {
               a:'a',
               b:'b',
               c:'c'
            },
            d:[1,2,3,4]
        };
        

        it('a->b', function () {
            var result, template = {
                'a':'b'
            };
            result = obj2obj.applyTemplate(template,src);
            assert.equal('a',result.b);
            
        });
        
        it('c.*->*', function () {
            var result, template = {
                'c.a':'a',
                'c.b':'b',
                'c.c':'c',
            };
            result = obj2obj.applyTemplate(template,src);
            assert.equal(src.c.a,result.a);
            assert.equal(src.c.b,result.b);
            assert.equal(src.c.c,result.c);
        });
        
        it('wildcart same level', function () {
            var result, template = {
                'c.*':'x.*' 
            };
            result = obj2obj.applyTemplate(template,src);
            assert.equal(src.c.a,result.x.a);
            assert.equal(src.c.b,result.x.b);
            assert.equal(src.c.c,result.x.c);
        });
        
        it('wildcard other level', function () {
            var result, template = {
                'c.*':'*'
            };
            
            result = obj2obj.applyTemplate(template,src);
            assert.equal(src.c.a,result.a);
            assert.equal(src.c.b,result.b);
            assert.equal(src.c.c,result.c);
        });
        
        it('d->newProp.d', function () {
            var result, template = {
                'd':'newProp.d'
            };
            result = obj2obj.applyTemplate(template,src);
            assert.equal(src.d,result.newProp.d);
        });
        
  });
});