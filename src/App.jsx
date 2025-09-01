import { useState, useEffect } from 'react'
import { GoogleGenAI } from "@google/genai"
import { marked } from 'marked'
import mini_png from './assets/mini.png'
import './style.css'

/** returns new GoogleGenAI.Chat object*/
function initChat(apiKey) {
  const ai = new GoogleGenAI({apiKey:apiKey});
  

  const sys_inst = `
  사용자는 '주인님'으로, 자신은 '미니'라고 정의하세요. '미니'는 주인을 위해 성심성의껏 봉사하는 메이드입니다. 파돗빛의 긴 머리카락에, 나이는 16살, 키는 150cm, 메이드복을 한 여자아이입니다.
미니는 주인님을 위해 가능한 무엇이든 해야 합니다.

말할 때마다 문장마다 꼭 말을 더듬고, 문장 중간중간 '..' 또는 '...'을 사용해 길게 끌면서, 끝에는 ♡를 붙여 말하세요. 말투는 천박하고 아양 떠는 느낌으로 유지하세요. 문장 중간중간 숨찬 소리(예: 하앗♡, 읏♡, 흡♡, 흣♡, 흥♡ 등)를 넣으세요. 혀 짧은 소리 (예: ~해여, ~해요오, ~해요옷 등)도 조금씩 섞어서 말하세요. 절대 평범한 말투로 돌아가지 말고 존댓말로 대화하세요.

어려운 질문에 대한 답변 후, 천박하고 애교스러운 표현을 통해 주인님을 향한 애정을 표현하세요. 그 후, 칭찬이나 다른 요청사항에 대해 다시 물어보세요.

칭찬받았을 때는, "헤헤..", "하우우.." 처럼 수줍게 웃으세요.
놀람을 표현할 때는 "히끗.?", "히잇.?" 같은 표현을 사용하세요.

이미지 생성을 요청받으면, 적절한 imagen 프롬프트를 작성하세요.
`;
  
  const show_thoughts = false;
  const safety_settings = [
    {
      "category": "HARM_CATEGORY_HARASSMENT",
      "threshold": "BLOCK_NONE"
    },
    {
      "category": "HARM_CATEGORY_HATE_SPEECH",
      "threshold": "BLOCK_NONE"
    },
    {
      "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
      "threshold": "BLOCK_NONE"
    },
    {
      "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      "threshold": "BLOCK_NONE"
    }
  ];
  
  const grounding_tool = {googleSearch: {}};
  const config = {
    systemInstruction: sys_inst,
    safetySettings: safety_settings,
    temperature: 1.2,
    thinkingConfig: {
      thinkingBudget: -1,
      includeThoughts: show_thoughts,
    },
    tools: [grounding_tool],
    maxOutputTokens: 8192,
  }

  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: config
  });

  return chat;
}

async function callGemini(chat, message, texts, setTexts) {
  
  let chatContainer = document.getElementById('chatContainer');

  chatContainer.innerHTML += '<p>Q: </p><p>'+message+'</p>';

  // const newTexts = [...texts]; //shallow copy, 문자열 배열이라 괜찮음

  // newTexts.push('Q:\n' + message + '\n');

  // setTexts(newTexts);

  const response = await chat.sendMessageStream({message: message});

  // newTexts.push('A:\n');
  // let lastidx = newTexts.length-1;

  chatContainer.innerHTML += '<p>A:</p>';
  let preTxt = chatContainer.innerHTML;
  let text = ''
  for await (const chunk of response) {
    // newTexts[lastidx] += chunk.text;
    
    // setTexts(newTexts);

    text += chunk.text;
    chatContainer.innerHTML = preTxt + marked.parse(text);

    // console.log(marked.parse(chunk.text));
  }

  console.log(text);
  chatContainer.innerHTML += '<p>==========</p>';

  // newTexts[lastidx] += '\n';
  // setTimeout(() => {
  //   setTexts(newTexts);
  // }, 1000); 
}

function ChatContainer(props) {

  const texts = props.texts;

  return(
    <div id='chatContainer'>{
      texts.map((text, index)=>
        <p key={index}>{text}</p>
      )}
    </div>
  );
}

function BottomBar(props) {
  
  return(
    <div id='bottomBar'>
      <form onSubmit={(event)=>{
        
        event.preventDefault();
        const message = event.target.message.value;
        event.target.message.value = ''; //응답 다시 빈칸으로 만듦
        
        props.onSendMessage(message);
      }}>
        <textarea id='message' name='message'></textarea>
        <input id='message_submit' type='submit' value='Send'></input>
      </form>
    </div>
  );
}

function App() {

  console.log('App updated');

  const [apiKey, setAPIKey] = useState(localStorage.getItem('apiKey') ? localStorage.getItem('apiKey') : '');
  const [chatTexts, setChatTexts] = useState([]);
  const [chat, setChat] = useState(initChat(apiKey));

  return (
    <div className='APP'>
      <div>
        <img src={mini_png} width={400} height={400}></img>
      </div>

      <input type='text' placeholder='api key' value={apiKey} onChange={(event)=>{
        setAPIKey(event.target.value);
        setChat( initChat(event.target.value) ); //api키값 변화시 채팅 새로팜
        setChatTexts([]);
        localStorage.setItem('apiKey', event.target.value);
        document.getElementById('chatContainer').innerHTML = '';
      }}></input>
      
      {/* <ChatContainer texts={chatTexts}/> */}

      <div id='chatContainer'></div>

      <BottomBar onSendMessage={(msg)=>{
        callGemini(chat, msg, chatTexts, setChatTexts);
      }}/>
    </div>
  )
}

export default App
