import {
  DiscordActionRow,
  DiscordAttachments,
  DiscordAudioAttachment,
  DiscordBold,
  DiscordButton,
  DiscordCode,
  DiscordCommand,
  DiscordCustomEmoji,
  DiscordEmbed,
  DiscordEmbedDescription,
  DiscordEmbedField,
  DiscordEmbedFields,
  DiscordEmbedFooter,
  DiscordFileAttachment,
  DiscordHeader,
  DiscordImageAttachment,
  DiscordInvite,
  DiscordItalic,
  DiscordLink,
  DiscordListItem,
  DiscordMention,
  DiscordMessage,
  DiscordMessages,
  DiscordOrderedList,
  DiscordQuote,
  DiscordReaction,
  DiscordReactions,
  DiscordReply,
  DiscordSpoiler,
  DiscordSubscript,
  DiscordSystemMessage,
  DiscordTenorVideo,
  DiscordThread,
  DiscordThreadMessage,
  DiscordTime,
  DiscordUnderlined,
  DiscordUnorderedList,
  DiscordVideoAttachment
} from '@skyra/discord-components-react';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import emojis from './emojis.json' with {type: "json"};
import ThemeContext from './ThemeContext';
import { useContext } from 'react';

const profiles = {
  model: {
    author: '미니',
    avatar: './assets/mini.png',
    bot: true,
    verified: true,
    roleColor: '#1e88e5'
  },
  user: {
    author: 'User',
    roleColor: '#ff0000'
  }
};

function DiscordChatParser({ profile, text }) {
  
  let emojiMKtext = text;

  for(const [key, value] of Object.entries(emojis)){
    emojiMKtext = emojiMKtext.replace(key, `![](https://cdn3.emoji.gg/emojis/${value}.gif)`);
  }

  const { darkMode } = useContext(ThemeContext);

  return(
    <DiscordMessage {...profile} lightTheme={!darkMode}>
      <ReactMarkdown
        children={emojiMKtext}
        remarkPlugins={[remarkGfm]}
        components={{

          p: ({ node, ...props }) => <span {...props} />,

          h1: ({ node, ...props }) => <DiscordHeader level={1} {...props} />,
          h2: ({ node, ...props }) => <DiscordHeader level={2} {...props} />,
          h3: ({ node, ...props }) => <DiscordHeader level={3} {...props} />,
          
          strong: ({ node, ...props }) => <DiscordBold {...props} />,
          em: ({ node, ...props }) => <DiscordItalic {...props} />,
          u: ({ node, ...props }) => <DiscordUnderlined {...props} />,
          blockquote: ({ node, ...props }) => <DiscordQuote {...props} />,
          a: ({ node, ...props }) => <DiscordLink {...props} target="_blank" />,
          
          ul: ({ node, ...props }) => <DiscordUnorderedList {...props} />,
          ol: ({ node, ...props }) => <DiscordOrderedList {...props} />,
          li: ({ node, ...props }) => <DiscordListItem {...props} />,

          code({ node, className, children, ...props }) {
            // TODO: better inline codeblock capture
            const match = /language-(\w+)/.exec(className || '') // checks if code type presents
            return <DiscordCode multiline={match} {...props}>{children}</DiscordCode>
          },

          img: ({ node, src, ...props }) => <DiscordCustomEmoji url={src} jumbo={false} {...props} />,
        }}
      />
    </DiscordMessage>
  );
}

function DiscordWindow({texts}){ 

  // texts=Array.from({length:20},()=>'message'); // For CSS Debugging

  const { darkMode } = useContext(ThemeContext);

  return(
    <div id="discordWindow">
      <div id='discordWelcome'>
        <p>Welcome to</p>
        <p>Gemini-Custom</p>
        <div>This is the beginning of this server.</div>
      </div>
      <DiscordMessages lightTheme={!darkMode} noBackground={false}>
        {texts.map( (text, i)=>( 
          <DiscordChatParser profile={profiles[i%2 ? 'model' : 'user']} text={text} key={i}/>
        ))}
      </DiscordMessages>
    </div>
  );
}

export default DiscordWindow;