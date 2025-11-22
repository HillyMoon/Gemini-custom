import { useState, useEffect, useRef, useContext } from 'react'
import ThemeContext from './ThemeContext';
import MobileDetect from 'mobile-detect';
import SendRoundedIcon from '@mui/icons-material/SendRounded';

const isPhone = new MobileDetect(window.navigator.userAgent).mobile() !== null;

function useInterval(callback, delay) {
	const savedCallback = useRef();
    
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

function TypingIndicator() {

  const fps = 30;
  const [frame, setFrame] = useState(0);
  const {darkMode} = useContext(ThemeContext);
  
  useInterval(()=>{
    setFrame((f)=>(f+1)%fps);
  }, 1000/fps);

  const getStyle = (f) => {

    // generates 0.5s long pulse, range: (idle) 0 - 1 (peak)
    const pulse = Math.max(1, Math.abs(f-fps/2) * 4/fps)-1;
    
    const brightness = darkMode ? (pulse*128 + 128) : (-pulse*128 + 128);
    const backgroundColor = `rgb(${brightness}, ${brightness}, ${brightness})`;

    const size = pulse*2 + 6;

    return {
      backgroundColor,
      width: size,
      height: size,
    };
  };

  return(
    <div id='typingIndicator'>
      <div id='typingDotContainer'>
        <div className='typingDotWrapper'>
          <div className='typingDot' style={getStyle( (frame+fps/3)%fps )}/>
        </div>
        <div className='typingDotWrapper'>
          <div className='typingDot' style={getStyle( (frame+fps/6)%fps )}/>
        </div>
        <div className='typingDotWrapper'>
          <div className='typingDot' style={getStyle(  frame  )}/>
        </div>
      </div>
      <span>
        <b>Mini</b> is typing...
      </span>
    </div>
  );
}

function InputBarPC({ inputEnabled, onSendMessage }) {
  
  const handleKeyDown = (event) => {
    if(event.key === 'Enter' && !event.shiftKey){ //shift+Enter아닌 그냥 Enter에서
      event.preventDefault(); //Enter를 입력받지않음
      
      if(!inputEnabled) return;
      
      const message = event.target.value;
      event.target.value=''; //응답 다시 빈칸으로 만듬

      onSendMessage(message);
    }
  };

  return(
    <div id='bottomBar'>
      <textarea id='message' onKeyDown={handleKeyDown} placeholder='Message #Gemini-custom'/>
    </div>
  );
}

function InputBarMobile({ inputEnabled, onSendMessage }) {

  const [message, setMessage] = useState('');

  const handleChange = (event) => {
    setMessage(()=>event.target.value);
  };

  const handleClick = () => {
    if(!inputEnabled) return;

    setMessage(()=>'');
    
    onSendMessage(message);
  };

  return (
    <>
      <div id='bottomBar'>
        <textarea id='message' value={message} onChange={handleChange} placeholder='Message #Gemini-custom'/>
      </div>
      {message && <button id="messageSubmit" onClick={handleClick}><SendRoundedIcon/></button>}
    </>
  );
}

function BottomBar(props) {

  return (
    <>
      {props.isTyping && <TypingIndicator />}
    
      <div id="bottomBarContainer">
        {isPhone ? <InputBarMobile {...props}/> : <InputBarPC {...props}/>}
      </div>
    </>
  );

}

export default BottomBar;