/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */
// flowlint ambiguous-object-type:error
'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var IRTransformer = require('../core/IRTransformer');

var _require = require('../core/CompilerError'),
    createUserError = _require.createUserError;

var _require2 = require('relay-runtime'),
    ConnectionInterface = _require2.ConnectionInterface;

var DELETE_RECORD = 'deleteRecord';
var APPEND_EDGE = 'appendEdge';
var PREPEND_EDGE = 'prependEdge';
var LINKED_FIELD_DIRECTIVES = [APPEND_EDGE, PREPEND_EDGE];
var SCHEMA_EXTENSION = "\n  directive @".concat(DELETE_RECORD, " on FIELD\n  directive @").concat(APPEND_EDGE, "(\n    connections: [String!]!\n  ) on FIELD\n  directive @").concat(PREPEND_EDGE, "(\n    connections: [String!]!\n  ) on FIELD\n");

function transform(context) {
  return IRTransformer.transform(context, {
    ScalarField: visitScalarField,
    LinkedField: visitLinkedField,
    SplitOperation: skip,
    Fragment: skip
  });
}

function skip(node) {
  return node;
}

function visitScalarField(field) {
  var linkedFieldDirective = field.directives.find(function (directive) {
    return LINKED_FIELD_DIRECTIVES.indexOf(directive.name) > -1;
  });

  if (linkedFieldDirective != null) {
    throw createUserError("Invalid use of @".concat(linkedFieldDirective.name, " on scalar field '").concat(field.name, "'"), [linkedFieldDirective.loc]);
  }

  var deleteDirective = field.directives.find(function (directive) {
    return directive.name === DELETE_RECORD;
  });

  if (deleteDirective == null) {
    return field;
  }

  var schema = this.getContext().getSchema();

  if (!schema.isId(field.type)) {
    throw createUserError("Invalid use of @".concat(DELETE_RECORD, " on field '").concat(field.name, "'. Expected field type ID, got ").concat(schema.getTypeString(field.type), "."), [deleteDirective.loc]);
  }

  var handle = {
    name: DELETE_RECORD,
    key: '',
    dynamicKey: null,
    filters: null
  };
  return _objectSpread({}, field, {
    directives: field.directives.filter(function (directive) {
      return directive !== deleteDirective;
    }),
    handles: field.handles ? [].concat((0, _toConsumableArray2["default"])(field.handles), [handle]) : [handle]
  });
}

function visitLinkedField(field) {
  var transformedField = this.traverse(field);
  var deleteDirective = transformedField.directives.find(function (directive) {
    return directive.name === DELETE_RECORD;
  });

  if (deleteDirective != null) {
    throw createUserError("Invalid use of @".concat(deleteDirective.name, " on scalar field '").concat(transformedField.name, "'."), [deleteDirective.loc]);
  }

  var edgeDirective = transformedField.directives.find(function (directive) {
    return LINKED_FIELD_DIRECTIVES.indexOf(directive.name) > -1;
  });

  if (edgeDirective == null) {
    return transformedField;
  }

  var connectionsArg = edgeDirective.args.find(function (arg) {
    return arg.name === 'connections';
  });

  if (connectionsArg == null) {
    throw createUserError("Expected the 'connections' argument to be defined on @".concat(edgeDirective.name, "."), [edgeDirective.loc]);
  }

  var schema = this.getContext().getSchema();
  var fields = schema.getFields(transformedField.type);
  var cursorFieldID;
  var nodeFieldID;

  var _iterator = _createForOfIteratorHelper(fields),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var fieldID = _step.value;
      var fieldName = schema.getFieldName(fieldID);

      if (fieldName === ConnectionInterface.get().CURSOR) {
        cursorFieldID = fieldID;
      } else if (fieldName === ConnectionInterface.get().NODE) {
        nodeFieldID = fieldID;
      }
    } // Edge

  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  if (cursorFieldID != null && nodeFieldID != null) {
    var handle = {
      name: edgeDirective.name,
      key: '',
      dynamicKey: null,
      filters: null,
      handleArgs: [connectionsArg]
    };
    return _objectSpread({}, transformedField, {
      directives: transformedField.directives.filter(function (directive) {
        return directive !== edgeDirective;
      }),
      handles: transformedField.handles ? [].concat((0, _toConsumableArray2["default"])(transformedField.handles), [handle]) : [handle]
    });
  }

  throw createUserError("Unsupported use of @".concat(edgeDirective.name, " on field '").concat(transformedField.name, "', expected an edge field (a field with 'cursor' and 'node' selection)."), [edgeDirective.loc]);
}

module.exports = {
  SCHEMA_EXTENSION: SCHEMA_EXTENSION,
  transform: transform
};