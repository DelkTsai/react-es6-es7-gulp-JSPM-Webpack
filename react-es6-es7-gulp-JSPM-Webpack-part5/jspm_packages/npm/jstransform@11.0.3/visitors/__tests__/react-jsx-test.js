/* */ 
'use strict';
require('mock-modules').autoMockOff();
var transformFn = require('../../../jstransform@11.0.3').transform;
var visitors = require('../react-jsx-visitors').visitorList;
function transform(code) {
  return transformFn(visitors, code);
}
describe('react jsx', function() {
  var x = 123456;
  var y = 789012;
  var z = 345678;
  var expectObjectAssign = function(code) {
    var Component = jest.genMockFunction();
    var Child = jest.genMockFunction();
    var objectAssignMock = jest.genMockFunction();
    React.__spread = objectAssignMock;
    eval(transform(code).code);
    return expect(objectAssignMock);
  };
  var React = {createElement: jest.genMockFunction()};
  it('should convert simple tags', function() {
    var code = 'var x = <div></div>;';
    var result = 'var x = React.createElement("div", null);';
    expect(transform(code).code).toEqual(result);
  });
  it('should convert simple text', function() {
    var code = 'var x = <div>text</div>;';
    var result = 'var x = React.createElement("div", null, "text");';
    expect(transform(code).code).toEqual(result);
  });
  it('should have correct comma in nested children', function() {
    var code = ['var x = <div>', '  <div><br /></div>', '  <Component>{foo}<br />{bar}</Component>', '  <br />', '</div>;'].join('\n');
    var result = ['var x = React.createElement("div", null, ', '  React.createElement("div", null, ' + 'React.createElement("br", null)), ', '  React.createElement(Component, null, foo, ' + 'React.createElement("br", null), bar), ', '  React.createElement("br", null)', ');'].join('\n');
    expect(transform(code).code).toEqual(result);
  });
  it('should avoid wrapping in extra parens if not needed', function() {
    var code = ['var x = <div>', '  <Component />', '</div>;'].join('\n');
    var result = ['var x = React.createElement("div", null, ', '  React.createElement(Component, null)', ');'].join('\n');
    expect(transform(code).code).toEqual(result);
    code = ['var x = <div>', '  {this.props.children}', '</div>;'].join('\n');
    result = ['var x = React.createElement("div", null, ', '  this.props.children', ');'].join('\n');
    expect(transform(code).code).toEqual(result);
    code = ['var x = <Composite>', '  {this.props.children}', '</Composite>;'].join('\n');
    result = ['var x = React.createElement(Composite, null, ', '  this.props.children', ');'].join('\n');
    expect(transform(code).code).toEqual(result);
    code = ['var x = <Composite>', '  <Composite2 />', '</Composite>;'].join('\n');
    result = ['var x = React.createElement(Composite, null, ', '  React.createElement(Composite2, null)', ');'].join('\n');
    expect(transform(code).code).toEqual(result);
  });
  it('should insert commas after expressions before whitespace', function() {
    var code = ['var x =', '  <div', '    attr1={', '      "foo" + "bar"', '    }', '    attr2={', '      "foo" + "bar" +', '      ', '      "baz" + "bug"', '    }', '    attr3={', '      "foo" + "bar" +', '      "baz" + "bug"', '      // Extra line here.', '    }', '    attr4="baz">', '  </div>;'].join('\n');
    var result = ['var x =', '  React.createElement("div", {', '    attr1: ', '      "foo" + "bar", ', '    ', '    attr2: ', '      "foo" + "bar" +', '      ', '      "baz" + "bug", ', '    ', '    attr3: ', '      "foo" + "bar" +', '      "baz" + "bug", ', '      // Extra line here.', '    ', '    attr4: "baz"}', '  );'].join('\n');
    expect(transform(code).code).toEqual(result);
  });
  it('should properly handle comments adjacent to children', function() {
    var code = ['var x = (', '  <div>', '    {/* A comment at the beginning */}', '    {/* A second comment at the beginning */}', '    <span>', '      {/* A nested comment */}', '    </span>', '    {/* A sandwiched comment */}', '    <br />', '    {/* A comment at the end */}', '    {/* A second comment at the end */}', '  </div>', ');'].join('\n');
    var result = ['var x = (', '  React.createElement("div", null, ', '    /* A comment at the beginning */', '    /* A second comment at the beginning */', '    React.createElement("span", null', '      /* A nested comment */', '    ), ', '    /* A sandwiched comment */', '    React.createElement("br", null)', '    /* A comment at the end */', '    /* A second comment at the end */', '  )', ');'].join('\n');
    expect(transform(code).code).toBe(result);
  });
  it('should properly handle comments between props', function() {
    var code = ['var x = (', '  <div', '    /* a multi-line', '       comment */', '    attr1="foo">', '    <span // a double-slash comment', '      attr2="bar"', '    />', '  </div>', ');'].join('\n');
    var result = ['var x = (', '  React.createElement("div", {', '    /* a multi-line', '       comment */', '    attr1: "foo"}, ', '    React.createElement("span", {// a double-slash comment', '      attr2: "bar"}', '    )', '  )', ');'].join('\n');
    expect(transform(code).code).toBe(result);
  });
  it('should not strip tags with a single child of &nbsp;', function() {
    var code = ['<div>&nbsp;</div>;'].join('\n');
    var result = ['React.createElement("div", null, "\u00A0");'].join('\n');
    expect(transform(code).code).toBe(result);
  });
  it('should not strip &nbsp; even coupled with other whitespace', function() {
    var code = ['<div>&nbsp; </div>;'].join('\n');
    var result = ['React.createElement("div", null, "\u00A0 ");'].join('\n');
    expect(transform(code).code).toBe(result);
  });
  it('should handle hasOwnProperty correctly', function() {
    var code = '<hasOwnProperty>testing</hasOwnProperty>;';
    var result = 'React.createElement("hasOwnProperty", null, "testing");';
    expect(transform(code).code).toBe(result);
  });
  it('should allow constructor as prop', function() {
    var code = '<Component constructor="foo" />;';
    var result = 'React.createElement(Component, {constructor: "foo"});';
    expect(transform(code).code).toBe(result);
  });
  it('should allow JS namespacing', function() {
    var code = '<Namespace.Component />;';
    var result = 'React.createElement(Namespace.Component, null);';
    expect(transform(code).code).toBe(result);
  });
  it('should allow deeper JS namespacing', function() {
    var code = '<Namespace.DeepNamespace.Component />;';
    var result = 'React.createElement(Namespace.DeepNamespace.Component, null);';
    expect(transform(code).code).toBe(result);
  });
  it('should disallow XML namespacing', function() {
    var code = '<Namespace:Component />;';
    expect(() => transform(code)).toThrow();
  });
  it('wraps props in React.__spread for spread attributes', function() {
    var code = '<Component { ... x } y\n' + '={2 } z />';
    var result = 'React.createElement(Component, React.__spread({},    x , {y: \n' + '2, z: true}))';
    expect(transform(code).code).toBe(result);
  });
  it('adds appropriate newlines when using spread attribute', function() {
    var code = '<Component\n' + '  {...this.props}\n' + '  sound="moo" />';
    var result = 'React.createElement(Component, React.__spread({}, \n' + '  this.props, \n' + '  {sound: "moo"}))';
    expect(transform(code).code).toBe(result);
  });
  it('handles overparenthesized JS', function() {
    var code = '<foo a={(b)} c={(d)}>Foo {(e+f //A line comment\n' + '/* A multiline comment */)\n' + '} bar\n' + '</foo>';
    var result = 'React.createElement("foo", {a: (b), c: (d)}, "Foo ", (e+f //A line comment\n' + '/* A multiline comment */), \n' + '" bar"\n' + ')';
    expect(transform(code).code).toBe(result);
  });
  it('should transform known hyphenated tags', function() {
    var code = '<font-face />;';
    var result = 'React.createElement("font-face", null);';
    expect(transform(code).code).toBe(result);
  });
  it('does not call React.__spread when there are no spreads', function() {
    expectObjectAssign('<Component x={y} />').not.toBeCalled();
  });
  it('should not throw for unknown hyphenated tags', function() {
    var code = '<x-component />;';
    expect(function() {
      transform(code);
    }).not.toThrow();
  });
  it('calls assign with a new target object for spreads', function() {
    expectObjectAssign('<Component {...x} />').toBeCalledWith({}, x);
  });
  it('calls assign with an empty object when the spread is first', function() {
    expectObjectAssign('<Component { ...x } y={2} />').toBeCalledWith({}, x, {y: 2});
  });
  it('coalesces consecutive properties into a single object', function() {
    expectObjectAssign('<Component { ... x } y={2} z />').toBeCalledWith({}, x, {
      y: 2,
      z: true
    });
  });
  it('avoids an unnecessary empty object when spread is not first', function() {
    expectObjectAssign('<Component x={1} {...y} />').toBeCalledWith({x: 1}, y);
  });
  it('passes the same value multiple times to React.__spread', function() {
    expectObjectAssign('<Component x={1} y="2" {...z} {...z}><Child /></Component>').toBeCalledWith({
      x: 1,
      y: '2'
    }, z, z);
  });
  it('evaluates sequences before passing them to React.__spread', function() {
    expectObjectAssign('<Component x="1" {...(z = { y: 2 }, z)} z={3}>Text</Component>').toBeCalledWith({x: '1'}, {y: 2}, {z: 3});
  });
});
