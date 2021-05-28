function Display({ exp, result }) {
  return (
    <div id="display-main">
      <div id="display">
        <div id="expression">{exp}</div>
      </div>
      <div id="result">{result}</div>
    </div>
  );
}

function Button({ id, symbol, func }) {
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

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  });

  return (
    <button className="btn" id={id} onClick={onClick}>
      {symbol}
    </button>
  );
}

function App() {
  const [cleared, setCleared] = React.useState(true);
  const [evaluated, setEvaluated] = React.useState(false);
  const [expression, setExpression] = React.useState('');
  const [result, setResult] = React.useState('');

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
      let chunk = '';
      for (let i = expression.length - 1; i > -1; i--) {
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
    let res = eval(expression).toString(10);
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

  return (
    <div id="calculator">
      <Display exp={expression} result={result} />
      <div id="btns">
        <Button id="seven" symbol="7" func={processNumber} />
        <Button id="eight" symbol="8" func={processNumber} />
        <Button id="nine" symbol="9" func={processNumber} />
        <Button id="delete" symbol="DEL" func={deleteChar} />
        <Button id="clear" symbol="AC" func={initialize} />
        <Button id="four" symbol="4" func={processNumber} />
        <Button id="five" symbol="5" func={processNumber} />
        <Button id="six" symbol="6" func={processNumber} />
        <Button id="multiply" symbol="*" func={processOperator} />
        <Button id="divide" symbol="/" func={processOperator} />
        <Button id="one" symbol="1" func={processNumber} />
        <Button id="two" symbol="2" func={processNumber} />
        <Button id="three" symbol="3" func={processNumber} />
        <Button id="add" symbol="+" func={processOperator} />
        <Button id="subtract" symbol="-" func={processOperator} />
        <Button id="zero" symbol="0" func={processNumber} />
        <Button id="decimal" symbol="." func={processDecimal} />
        <Button id="equals" symbol="=" func={evaluate} />
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
