
import { useReducer } from 'react';
import './App.css';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';

export const ACTIONS = {
 ADD_DIGIT: "add-digit",
 CHOOSE_OPERATION: "choose-operation",
 CLEAR: "clear",
 DELETE_DIGIT: "delete-digit",
 EVALUATE: "evaluate"
}

function reducer(state, {type, payload}) {
   switch(type) {
    case ACTIONS.ADD_DIGIT:
      if(state.overwrite){
        return{
          ...state,
          currentOpperhand: payload.digit,
          overwrite: false
        }
      }
      if(payload.digit === '0' && state.currentOpperhand === "0") {return state};
      if(payload.digit === '.' && state.currentOpperhand.includes(".")) {return state};
      return{
        ...state,
        currentOpperhand: `${state.currentOpperhand || ""}${payload.digit}`
      }


      case ACTIONS.CHOOSE_OPERATION:
        if(state.currentOpperhand === null && state.previousOpperhand === null) return state;
        if(state.currentOpperhand === null){
          return{
            ...state, 
            operation: payload.operation
          }
        }
        
        if(state.previousOpperhand === null){
          return{
            ...state,
            operation: payload.operation,
            previousOpperhand: state.currentOpperhand,
            currentOpperhand: null
          }
        }
        return{
          ...state,
          previousOpperhand: evaluate(state),
          operation: payload.operation,
          currentOpperhand: null
        }

      case ACTIONS.CLEAR: return {}
      case ACTIONS.DELETE_DIGIT:
        if(state.overwrite){
          return{
             ...state,
             overwrite: false,
             currentOpperhand: null
          }
        }
        if(state.currentOpperhand === null ) return state;
        if(state.currentOpperhand.length === 1){
          return{...state, currentOpperhand: null}
        }
        return{
          ...state,
          currentOpperhand: state.currentOpperhand.slice(0, -1)
        }
      case ACTIONS.EVALUATE:
        if(state.operation === null || state.previousOpperhand === null || state.currentOpperhand === null) 
        return {state}
        return {
          ...state,
          overwrite: true,
          previousOpperhand: null,
          operation: null,
          currentOpperhand: evaluate(state)
        }
   }
}


function evaluate({previousOpperhand, currentOpperhand, operation}){
   const prev = parseFloat(previousOpperhand)
   const current = parseFloat(currentOpperhand)

   if(isNaN(prev) || isNaN(current)) return "";
   let compuation = "";
   switch (operation) {
    case "+":
      compuation = prev + current
      break;
      case "-":
        compuation = prev - current
        break
        case "*":
        compuation = prev * current
        break
        case "/":
        compuation = prev / current
        break
   }
   return compuation.toString()
}


const INTEGER_FORMATTER = new Intl.NumberFormat('en-us', {
  maximumFractionDigits: 0,
})


function formatOpperhand(opperhand) {
  if(opperhand === null ) return
  const [integer, decimal ] = opperhand.split(".")
  if(decimal === null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer).decimal}`
}

function App() {
  const [{previousOpperhand, currentOpperhand, operation}, dispatch] = useReducer(reducer, {})
 
  return (
    <div className="claculator-grid">
     < div className='output'>
      < div className='previous-opperhand'>{formatOpperhand(previousOpperhand)} {operation}</div>
      < div className='current-opperhand'>{formatOpperhand(currentOpperhand)}</div>
     </div>
     < button className='span-two' onClick={() => dispatch({type: ACTIONS.CLEAR})}>AC</button>
     < button onClick={() => dispatch({type: ACTIONS.DELETE_DIGIT})} >DEL</button>
     < OperationButton operation="/" dispatch={dispatch} />     
     < DigitButton digit="1" dispatch={dispatch} />
     < DigitButton digit="2" dispatch={dispatch} />
     < DigitButton digit="3" dispatch={dispatch} />
     < OperationButton operation="*" dispatch={dispatch} />
     < DigitButton digit="4" dispatch={dispatch} />
     < DigitButton digit="5" dispatch={dispatch} />
     < DigitButton digit="6" dispatch={dispatch} />
     < OperationButton operation="+" dispatch={dispatch} />
     < DigitButton digit="7" dispatch={dispatch} />
     < DigitButton digit="8" dispatch={dispatch} />
     < DigitButton digit="9" dispatch={dispatch} />
     < OperationButton operation="-" dispatch={dispatch} />
     < DigitButton digit="." dispatch={dispatch} />
     < DigitButton digit="0" dispatch={dispatch} />
     < button className='span-two' onClick={() => dispatch({type: ACTIONS.EVALUATE})}>=</button>
    </div>
  );
}

export default App;
