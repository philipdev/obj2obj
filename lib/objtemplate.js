"use strict";

/**
 * JS Object transformer using templates.
 * A template is a key/value object where the key is the matching template and value the targetting property.
 * It supports wildcarts and literals
 *  Examples:
 *  // create a list of strings out of a list of object name properties
 *  {
 *   '*.obj.name':'*'
 *  }
 *
 *  // Move window.location to just location and window to window,
 *  {
 *   'window.location':'location',
 *   'window':'*'
 *  }
 *
 *  {
 *      window:'window',
 *      window.url:'window.url:http://localhost' // this needs to be changed, the literal must be set in the rule (left-side)
 *  }
 *
 * Currently the wildcard will match to property that was matched from the source object
 * @param templateChain
 * @param propertyChain
 * @returns {boolean}
 */

function comparePropertyChain(templateChain, propertyChain) {
    var i = 0;
    if (templateChain.length !== propertyChain.length) {
        return false;
    }

    for (i = 0; i < templateChain.length; i += 1) {
        if (templateChain[i] !== '*' && templateChain[i] !== propertyChain[i]) {
            return false;
        }
    }

    return true;
}

function find(entryList, keyChainList) {
    return entryList.filter(function (entry) {
        return comparePropertyChain(keyChainList, entry.key);
    });
}

function parseLiteral(literal) {
    return literal;
}

function setter(obj, list, value) {
    var i = 0, key, current, literalIndex, literal;
    current = obj;
    for (i = 0; i < list.length; i += 1) {
        key = list[i];
        if (i === list.length - 1) { // last
            literalIndex = key.indexOf(':');
            if (literalIndex !== -1) {
                literal = parseLiteral(key.substr(literalIndex + 1, key.length));
                current[key.substr(0, literalIndex)] = literal;
            } else {
                current[key] = value;
            }
        } else {
            if (current[key]) {
                current = current[key];
            } else {
                current[key] = {}; // i rather want to take this from the source?
                current = current[key];
            }
        }
    }
}

function getter(obj, list) {
    var i = 0, key, current;
    current = obj;
    for (i = 0; i < list.length; i += 1) {
        key = list[i];
        if (i === list.length - 1) { // last
            return current[key];
        } else {
            if (current[key]) {
                current = current[key];
            } else {
                break;
            }
        }
    }
}

/**
 * The target property might contain wildcards '*', then this must be taken from the object 'matched' properties.
 * @param targetPropertyChain
 * @param objectPropertyChain
 */
function replaceWildCart(targetPropertyChain, objectPropertyChain) {
    var i, result = targetPropertyChain.slice();
    for (i = 0; i < result.length; i++) {
        if (result[i] === '*') {
            result[i] = objectPropertyChain[i];
        }
    }
    return result;
}

function applyRule(rule, entryList, target, targetPropertyChain) {
    var chain = rule.split('.');

    var matches = find(entryList, chain); // currently it can only be one or zero
    matches.forEach(
        function (entry) {
            var replacedTargetPropertyChain = replaceWildCart(targetPropertyChain, entry.key);
            setter(target, replacedTargetPropertyChain, entry.value);
        }
    );
}

function applyTemplate(template, source, target) {
    var rules = Object.keys(template), entryList = parse(source);

    rules.forEach(function (rule) {
        var replaceTemplate = template[rule].split('.');
        applyRule(rule, entryList, target, replaceTemplate);
    });
     
    return target;
}

function push(list, key) {
    var result = list.slice();
    result.push(key);
    return result;
}

function parse(src) {
    var i, k, v, suffix = arguments[1], list = arguments[2], keys = Object.keys(src);
    if (list === undefined) {
        list = [];
    }
    if (suffix === undefined) {
        suffix = [];
    }

    for (i = 0; i < keys.length; i += 1) {
        k = keys[i];
        v = src[k];

        if (typeof v === 'object') {
            parse(v, push(suffix, k), list);
        }

        list.push({
            key: push(suffix, k),
            value: v
        });

    }
    return list;
}

module.exports.applyTemplate = applyTemplate;