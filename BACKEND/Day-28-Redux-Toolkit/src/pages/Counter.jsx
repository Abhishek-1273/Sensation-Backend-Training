import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { decrement, increment } from '../redux/slice/counterSlice';

const Counter = () => {
  const dispatch = useDispatch();
  const value = useSelector((state) => state.counter.count);
  return (
    <>
      <h1>RTK - Example:</h1>
      <div>
        <h1>INCREMENT</h1>
        <button onClick={() => dispatch(increment())}>Click</button>
      </div>
      <div>
        <h1>DECREMENT</h1>
        <button onClick={() => dispatch(decrement())}>Click</button>
      </div>
      <h1>{value}</h1>
    </>
  )
}

export default Counter
