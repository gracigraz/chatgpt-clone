import "./App.scss";
import { useEffect, useState } from "react";

function App() {
  const [value, setValue] = useState(null); //state variable to track changes to input value, we are going to overide the value if we interact with the input
  const [message, setMessage] = useState(null); //state variable to save message, setMessage function to update the new value of message
  const [previousChats, setPreviousChats] = useState([]); //state variable to save all previous chats and update previouschats with setpreviouschats function
  const [currentTitle, setCurrentTitle] = useState(null); //first prompt that we give the chat

  //clar everything, completely clearing it so that we cna start fresh, whatever the message is from the AI I'm going to set it to null, set the value of the input to empty string, setcurrenttitle to null too
  const createNewChat = () => {
    setMessage(null);
    setValue("");
    setCurrentTitle(null);
  };

  //if we click on any one of the chat list item in history, so if we click on it I'm just going to pass through the unique title that we clicked on
  // so now we need to mkae this a callback function as we just call that again so we pass unique title through here and we are going to set current title to be whatever title we clicked on
  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle);
    setMessage(null);
    setValue("");
  };
  //it's an async function bc we are going to use the fetch word
  const getMessages = async () => {
    console.log("hi");
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: value, //from the value inputed in the tag
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      console.log("hi2");
      const response = await fetch(
        "http://localhost:8000/completions",
        options
      );
      console.log("hi3");
      const data = await response.json();
      console.log("hi4");
      if (data && data.choices && data.choices.length > 0) {
        console.log("hi5");
        setMessage(data.choices[0].message); //get first item of choices array and then get the message object that contains the content and the role, save both
      } else {
        // Handle the case when data.choices is empty or undefined.
        console.error("No message found in data.");
      }
    } catch (error) {
      console.error(error);
    }
  };
  console.log(message);
  //everytime the message (whatever we get back from the api) or the currenttitle changes, it comes back from the APi, I want this code to run. Whatever the prompt for the chat whatever the start of the chat changes then we run this again
  //I'm also going to save the current title
  useEffect(() => {
    console.log(currentTitle, value, message);
    //if there's no current title, no new title we dont have a chat, howver we do have a value in our input and we do have a message that has come back to us
    if (!currentTitle && value && message) {
      // Condition 1: Set currentTitle if it's not already defined
      setCurrentTitle(value); //set the current title to whatever the value is
    }
    if (currentTitle && value && message) {
      //there is a current title that already exists and the value exists in an input and we get a message back.
      //so we are on the chat currently, we're still chatting away, we just want to setpreviouschats, we are going to essentially get whatever's in that array already (prevChats)
      // Condition 2: Append messages to prevChats
      setPreviousChats((prevChats) => [
        //this is how to update an array using state
        ...prevChats, //get the previous chats and spill them out but also add 2 objects

        //so everytime I'm saving previous chats, so a new chat, im saving whatever we asked the ai (current: value) and we are asigning the role as us the user
        //and im just going to save the currenttitle to make sure all the chats are lump by the first prompt and im also setting ovet the other object which is
        //the response from the AI which we've saved under the const message
        {
          //im using kind of what AI gave me in terms of structure for the object but I've added my own title so that we can save it to state
          title: currentTitle, //currentTitle whatever the first prompt was
          role: "user", //us
          content: value,
        },
        //this is the other obejct, the response from the AI which we've saved under the const message that was an object that had a role and content andasigning it to the role and content
        {
          //getting what chatgpt should give back to me in the message.
          title: currentTitle,
          role: message.role,
          content: message.content,
        },
      ]);
    }
  }, [message, currentTitle]); //i'm going to change this if the current title changes, so whatever the prompt for the chat, whatever the start of the chat changes then we run this again
  console.log(previousChats);

  //getting the unique title. so we are going to get weverythng and we are going to filter by the unique title and show it in the history as well as show the chat
  //previousChat is every item in my array previousChats
  //so any object that has the title that that is the same will be limped into currentchats, this means that tha I can get current chats with the feed and map out each
  const currentChat = previousChats.filter(
    (previousChat) => previousChat.title === currentTitle //if previousChat === currentTitle we are on the current chat objects
  );

  //getting uniqueTitles, filter all the messages and just get the uunique titels, filter each title and put it in an array for us
  //very useful to get unique items from an object
  //put unique titles in an array to map them allin to the history ul list in the sidebar
  const uniqueTitles = Array.from(
    new Set(previousChats.map((previousChat) => previousChat.title))
  );
  console.log(uniqueTitles);

  return (
    <main className="chat">
      <section className="chat__side-bar">
        <button className="chat__button" onClick={createNewChat}>
          + New Chat
        </button>
        <ul className="chat__history">
          {/* if uniqueTitles exist map and lisplay in a li each title */}
          {uniqueTitles?.map((uniqueTitle, index) => (
            <li
              key={index}
              className="chat__item"
              onClick={() => handleClick(uniqueTitle)}
            >
              {uniqueTitle}
            </li>
          ))}
        </ul>
        <nav className="chat__footer">
          <p>Made by Grace</p>
        </nav>
      </section>

      <section className="chat__main">
        {/* if there isn't a current title show h1, if there is a currentTitle get rid of h1 */}
        {!currentTitle && <h1 className="chat__title">GraceGPT</h1>}
        <ul className="chat__feed">
          {/* chatmessage is a currentchat value, im going to map them on to a list item shoing the role (who sends the message) and the content, ? to check that currentCHat exists before mapping */}
          {currentChat?.map((chatMessage, index) => (
            <li className="chat__li" key={index}>
              <p className="chat__role chat__p">{chatMessage.role}</p>
              <p className="chat__p">{chatMessage.content}</p>
            </li>
          ))}
        </ul>
        <div className="chat__bottom-container">
          <div className="chat__input-container">
            <input
              className="chat__input"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              //onchange of the input I'm going to pass in through the event and setValue to whatever e.target.value is
            />
            <div id="submit" onClick={getMessages}>
              ➤
            </div>
          </div>
          <p className="chat__info">
            Free Research Preview. ChatGPT may produce inaccurate information
            about people, places, or facts. ChatGPT September 25 Version
          </p>
        </div>
      </section>
    </main>
  );
}

export default App;
