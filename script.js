var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function Display(_ref) {
  var exp = _ref.exp,
      result = _ref.result;

  return React.createElement(
    "div",
    { id: "display-main" },
    React.createElement(
      "div",
      { id: "display" },
      React.createElement(
        "div",
        { id: "expression" },
        exp
      )
    ),
    React.createElement(
      "div",
      { id: "result" },
      result
    )
  );
}

function Button(_ref2) {
  var id = _ref2.id,
      symbol = _ref2.symbol,
      func = _ref2.func;

  function onClick() {
    func(symbol);
  }

  function handleKeyPress(e) {
    e.target.blur();
    if (e.key === symbol) {
      func(symbol);
    } else if (e.key === 'Enter' && symbol === '=') {
      func(symbol);
    } else if (e.key === 'Delete' || e.key == 'Backspace') {
      if (symbol === 'DEL') {
        func(symbol);
      }
    }
  }

  React.useEffect(function () {
    document.addEventListener('keydown', handleKeyPress);
    return function () {
      return document.removeEventListener('keydown', handleKeyPress);
    };
  });

  return React.createElement(
    "button",
    { className: "btn", id: id, onClick: onClick },
    symbol
  );
}

function App() {
  var _React$useState = React.useState(true),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      cleared = _React$useState2[0],
      setCleared = _React$useState2[1];

  var _React$useState3 = React.useState(false),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      evaluated = _React$useState4[0],
      setEvaluated = _React$useState4[1];

  var _React$useState5 = React.useState(''),
      _React$useState6 = _slicedToArray(_React$useState5, 2),
      expression = _React$useState6[0],
      setExpression = _React$useState6[1];

  var _React$useState7 = React.useState(''),
      _React$useState8 = _slicedToArray(_React$useState7, 2),
      result = _React$useState8[0],
      setResult = _React$useState8[1];

  function processNumber(num) {
    if (cleared || evaluated) {
      setExpression(num);
    } else {
      if (/\D0$/.test(expression) || expression === '0') {
        if (/\.\d+$/.test(expression)) {
          setExpression(expression + num);
        } else {
          setExpression(expression.slice(0, [expression.length - 1]) + num);
        }
      } else {
        setExpression(expression + num);
      }
    }
    setResult('');
    setEvaluated(false);
    setCleared(false);
  }

  function processOperator(operator) {
    if (result) {
      setExpression(result + operator);
    } else if (cleared) {
      setExpression(operator);
    } else if (operator === '-') {
      if (!/[\/\*\+\-]{2}$/.test(expression)) {
        setExpression(expression + operator);
      }
    } else if ('/*-+'.includes(expression[expression.length - 1])) {
      setExpression(expression.replace(/[\/\*\+\-]+$/, '') + operator);
    } else {
      setExpression(expression + operator);
    }
    setResult('');
    setEvaluated(false);
    setCleared(false);
  }

  function processDecimal() {
    if (evaluated) {
      setExpression('0.');
    } else {
      var chunk = '';
      for (var i = expression.length - 1; i > -1; i--) {
        if ('/*-+'.includes(expression[i])) {
          break;
        }
        chunk += expression[i];
      }
      if (!chunk.includes('.')) {
        setExpression(expression + '.');
      }
    }
    setResult('');
    setEvaluated(false);
    setCleared(false);
  }

  function deleteChar() {
    if (evaluated) {
      setExpression('');
      setResult('');
    } else {
      setExpression(expression.slice(0, [expression.length - 1]));
    }
  }

  function evaluate() {
    var res = eval(expression).toString(10);
    // setExpression(res);
    setResult(res);
    setEvaluated(true);
  }

  function initialize() {
    setExpression('');
    setResult('');
    setEvaluated(false);
    setCleared(true);
  }

  return React.createElement(
    "div",
    { id: "calculator" },
    React.createElement(Display, { exp: expression, result: result }),
    React.createElement(
      "div",
      { id: "btns" },
      React.createElement(Button, { id: "seven", symbol: "7", func: processNumber }),
      React.createElement(Button, { id: "eight", symbol: "8", func: processNumber }),
      React.createElement(Button, { id: "nine", symbol: "9", func: processNumber }),
      React.createElement(Button, { id: "delete", symbol: "DEL", func: deleteChar }),
      React.createElement(Button, { id: "clear", symbol: "AC", func: initialize }),
      React.createElement(Button, { id: "four", symbol: "4", func: processNumber }),
      React.createElement(Button, { id: "five", symbol: "5", func: processNumber }),
      React.createElement(Button, { id: "six", symbol: "6", func: processNumber }),
      React.createElement(Button, { id: "multiply", symbol: "*", func: processOperator }),
      React.createElement(Button, { id: "divide", symbol: "/", func: processOperator }),
      React.createElement(Button, { id: "one", symbol: "1", func: processNumber }),
      React.createElement(Button, { id: "two", symbol: "2", func: processNumber }),
      React.createElement(Button, { id: "three", symbol: "3", func: processNumber }),
      React.createElement(Button, { id: "add", symbol: "+", func: processOperator }),
      React.createElement(Button, { id: "subtract", symbol: "-", func: processOperator }),
      React.createElement(Button, { id: "zero", symbol: "0", func: processNumber }),
      React.createElement(Button, { id: "decimal", symbol: ".", func: processDecimal }),
      React.createElement(Button, { id: "equals", symbol: "=", func: evaluate })
    )
  );
}

ReactDOM.render(React.createElement(App, null), document.getElementById('root'));