/* */ 
(function(process) {
  'use strict';
  var REACT_COROUTINE_TYPE = typeof Symbol === 'function' && Symbol['for'] && Symbol['for']('react.coroutine') || 0xeac8;
  var REACT_YIELD_TYPE = typeof Symbol === 'function' && Symbol['for'] && Symbol['for']('react.yield') || 0xeac9;
  exports.createCoroutine = function(children, handler, props) {
    var key = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    var coroutine = {
      $$typeof: REACT_COROUTINE_TYPE,
      key: key == null ? null : '' + key,
      children: children,
      handler: handler,
      props: props
    };
    if (process.env.NODE_ENV !== 'production') {
      if (Object.freeze) {
        Object.freeze(coroutine.props);
        Object.freeze(coroutine);
      }
    }
    return coroutine;
  };
  exports.createYield = function(props, continuation) {
    var key = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var yieldNode = {
      $$typeof: REACT_YIELD_TYPE,
      key: key == null ? null : '' + key,
      props: props,
      continuation: continuation
    };
    if (process.env.NODE_ENV !== 'production') {
      if (Object.freeze) {
        Object.freeze(yieldNode.props);
        Object.freeze(yieldNode);
      }
    }
    return yieldNode;
  };
  exports.isCoroutine = function(object) {
    return typeof object === 'object' && object !== null && object.$$typeof === REACT_COROUTINE_TYPE;
  };
  exports.isYield = function(object) {
    return typeof object === 'object' && object !== null && object.$$typeof === REACT_YIELD_TYPE;
  };
  exports.REACT_YIELD_TYPE = REACT_YIELD_TYPE;
  exports.REACT_COROUTINE_TYPE = REACT_COROUTINE_TYPE;
})(require('process'));
