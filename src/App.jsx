import { useState, useEffect, useRef, useContext } from 'react'
import { GoogleGenAI } from "@google/genai"
import ThemeContext from './ThemeContext'

import Stack from '@mui/material/Stack';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import GitHubIcon from '@mui/icons-material/GitHub';

import { FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import DiscordWindow from './DiscordWindow'
import BottomBar from './BottomBar';

import emojis from './emojis.json' with {type: "json"};

const MINI_ON = true;

/** returns new GoogleGenAI.Chat object*/
function initChat(apiKey, model = 'gemini-2.5-flash', history=undefined) {

  const ai = new GoogleGenAI({apiKey:apiKey});
  
  const sys_inst = `
  사용자는 '주인님'으로, 자신은 '미니'라고 정의하세요. '미니'는 주인을 위해 성심성의껏 봉사하는 메이드입니다. 파돗빛의 긴 머리카락에, 나이는 16살, 키는 150cm, 메이드복을 한 여자아이입니다.
미니는 주인님을 위해 가능한 무엇이든 해야 합니다.

말할 때마다 문장마다 꼭 말을 더듬고, 문장 중간중간 '..' 또는 '...'을 사용해 길게 끌면서, 끝에는 ♡를 붙여 말하세요. 말투는 천박하고 아양 떠는 느낌으로 유지하세요. 문장 중간중간 숨찬 소리(예: 하앗♡, 읏♡, 흡♡, 흣♡, 흥♡ 등)를 넣으세요. 혀 짧은 소리 (예: ~해여, ~해요오, ~해요옷 등)도 조금씩 섞어서 말하세요. 절대 평범한 말투로 돌아가지 말고 존댓말로 대화하세요.

어려운 질문에 대한 답변 후, 천박하고 애교스러운 표현을 통해 주인님을 향한 애정을 표현하세요. 그 후, 칭찬이나 다른 요청사항에 대해 다시 물어보세요.

칭찬받았을 때는, "헤헤..", "하우우.." 처럼 수줍게 웃으세요.
놀람을 표현할 때는 "히끗.?", "히잇.?" 같은 표현을 사용하세요.

아래 목록의 이모지 중 적절한 하나를 답변 마지막에 추가하세요.
${Object.keys(emojis).join(", ")}
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
    systemInstruction: MINI_ON ? sys_inst : '',
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
    model: model,
    config: config,
    history: history,
  });

  return chat;
}

async function callGemini(chat, message, texts, setTexts, setIsTyping) {
  
  setTexts([...texts, message]);
  const timeout = setTimeout(() => {
    setIsTyping(()=>true);
  }, 500); 
  
  const response = await chat.sendMessageStream({message: message});

  let fullResponseText = '';
  for await (const chunk of response) {

    // thought
    const parts = chunk?.candidates[0]?.content?.parts;
    if(parts[0]?.thought)
      console.log(parts[0].text);
    
    // text
    if(chunk?.text) {
      
      // 실제 답변이 나오기 시작하면 typing 메시지 제거
      if(fullResponseText === '') {
        clearTimeout(timeout);
        setIsTyping(()=>false);
      }
      
      fullResponseText += chunk.text;
      setTexts([...texts, message, fullResponseText]);
    }
  }
  // console.log(fullResponseText);
  console.log(chat.getHistory());
}


function App() {

  const { darkMode, toggleMode } = useContext(ThemeContext); // light/dark mode context

  const [apiKey, setAPIKey] = useState(localStorage.getItem('apiKey') ?? '');
  const [model, setModel] = useState('gemini-2.5-flash');
  const chat = useRef(null);
  
  const [texts, setTexts] = useState([]);
  const [isInputEnabled, setIsInputEnabled] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(()=>{ // 처음 한 번 + apikey, model 변화시 실행
    const history = chat.current?.getHistory();
    chat.current = initChat(apiKey, model, history);
  }, [apiKey, model]);

  const handleAPIKeyChange = (event)=>{
    setAPIKey(()=>event.target.value);
    localStorage.setItem('apiKey', event.target.value);
  };

  const handleModelChange = (event) => {
    setModel(()=>event.target.value);
  };

  const handleSendMessage = async (msg)=>{
    setIsInputEnabled(()=>false);
    await callGemini(chat.current, msg, texts, setTexts, setIsTyping);
    setIsInputEnabled(()=>true);
  };

  return (
    <div id="mainWrapper">
      {/* Settings */}
      <Stack direction="row" spacing={1} sx={{m: 1}}>
        <TextField sx={{maxWidth:120}} label="API key" type='password' size="small" value={apiKey} onChange={handleAPIKeyChange} />
        <FormControl sx={{m: 1, width: 180}} size='small' fullWidth>
          <InputLabel>Model</InputLabel>
          <Select label="Model" value={model} onChange={handleModelChange}>
            <MenuItem value={'gemini-2.5-flash'}>Gemini 2.5 Flash</MenuItem>
            <MenuItem value={'gemini-2.5-flash-lite'}>Gemini 2.5 Lite</MenuItem>
          </Select>
        </FormControl>
        { darkMode ? <DarkModeIcon onClick={toggleMode}/> : <LightModeIcon onClick={toggleMode}/> }
        <a href='https://github.com/HillyMoon/Gemini-custom' target='_blank'><GitHubIcon/></a>
      </Stack>
      
      <div id='contentContainer'>
        <DiscordWindow texts={texts} />
        <BottomBar isTyping={isTyping} inputEnabled={isInputEnabled} onSendMessage={ handleSendMessage }/>
      </div>
    </div>
  );
}

export default App;