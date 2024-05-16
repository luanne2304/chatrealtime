import { useState, useEffect, useRef } from "react";
import axios from "axios";
import socket from "./utils/socket";

const ChatBox = ({ chat, currentUser }) => {

  const [showchat, setShowchat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("white");
  const [content, setContent] = useState("");
  const [sendMessage, setSendMessage] = useState(null);
  const [file,setFile]=useState(null)
  const [file1,setFile1]=useState(null) 
  
  const indexMess= useRef(0)

  const chatContainerRef = useRef(null);

  const substring = "https://firebasestorage.googleapis.com/v0/b/recuitwebsite-76dec.appspot.com/o/chatrealtime%";      

  const checktosroll=()=>{
        // Kiểm tra xem thanh cuộn có ở dưới cùng hay không
        const chatContainer = chatContainerRef.current;
        const isScrolledToBottom = chatContainer.scrollHeight - chatContainer.clientHeight <= chatContainer.scrollTop + 1;
    
        if (isScrolledToBottom) {
          scrollToBottom();
        }
        else{
          console.log("aas")
        }
  }

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const sendMess = async() => {
    const message = {
      sender_id: currentUser._id,
      content: content,
    };
    try {
      // Gửi request GET tới endpoint /check-token trên server
      const response = await axios.post("http://localhost:4000/api/Mess/sendMess", {
        content:content,
        room: chat.idroom,
      },{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Gửi token trong header Authorization
        },
      });
      if(response.data.success===false){
        return
      }
      setSendMessage({ ...message, receiverId: chat.iduser,roomID:chat.idroom });
      // socket.emit('chat message', name+": "+content);
      setShowchat([...showchat, { sender_id: currentUser._id, content: content }]);
      setContent("");
    } catch (error) {
      // Nếu có lỗi, in ra lỗi
      console.error("Lỗi:", error);
    }
  };

  const sendIMG=async()=>{
    if(file===null){
      return
    }
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('room', chat.idroom);
      // Gửi request GET tới endpoint /check-token trên server
      const response = await axios.post("http://localhost:4000/api/Mess/sendIMG", 
        formData
      ,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Gửi token trong header Authorization
          'Content-Type': 'multipart/form-data'
        },
      });
      if(response.data.success===false){
        return
      }
      const message = {
        sender_id: currentUser._id,
        content: response.data.data,
      };
      setSendMessage({ ...message, receiverId: chat.iduser,roomID:chat.idroom });
      // socket.emit('chat message', name+": "+content);
      setShowchat([...showchat, { sender_id: currentUser._id, content:  response.data.data }]);
      setFile(null);
      document.getElementById('imageUpload').value = null;
    } catch (error) {
      // Nếu có lỗi, in ra lỗi
      console.error("Lỗi:", error);
    }
  }

  const loadmorechat=async()=>{
    if(indexMess.current===1)
      return
    try {
      console.log('indexMess - 1',indexMess.current -1)

      indexMess.current=indexMess.current-1
      const response = await axios.get(
        `http://localhost:4000/api/Mess/getMess?room=${chat.idroom}&index=${indexMess.current}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Gửi token trong header Authorization
          },
        }
      );
      if (response.data.success === false) {
        return;
      }
  
      setShowchat([...response.data.data,...showchat]);
    } catch (error) {
      // Nếu có lỗi, in ra lỗi
      console.error("Lỗi:", error);
    }
  }
  
  useEffect(() => {
    if (sendMessage !== null) {
      socket.emit("send-message", sendMessage);
    }
  }, [sendMessage]);

  useEffect(() => {
    const load = async () => {
      try {
        // Gửi request GET tới endpoint /check-token trên server
        const response = await axios.get(
          `http://localhost:4000/api/Mess/getMess?room=${chat.idroom}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Gửi token trong header Authorization
            },
          }
        );
        if (response.data.success === false) {
          return;
        }
        setShowchat(response.data.data);
        indexMess.current= parseInt(response.data.index)
      } catch (error) {
        // Nếu có lỗi, in ra lỗi
        console.error("Lỗi:", error);
      }
    };
    load();
  }, [chat]);


  socket.on("recieve-message", (data) => {
    if (data.roomID === chat.idroom) {
      setShowchat([...showchat, data]);
    }
  });


  const test=async ()=>{
    console.log("a1 -",showchat)
    loadmorechat()
  }

  return (
    <>
      <div
        ref={chatContainerRef}
        style={{
          backgroundColor: backgroundColor,
          width: "600px",
          height: "300px",
          border: "1px solid",
          margin: "auto",
          overflowY: "auto",
        }}
      >
        <div>
          {currentUser && currentUser._id} Nhắn với:{" "}
          {chat.name + "(" + chat.iduser + ")"}{" "}
        </div>
        <button onClick={test}>Loadmore</button>
        {showchat.map((message,index) => {
           const containsSubstring = (message.content).includes(substring);
          {    
          console.log(showchat)
            if (currentUser._id === message.sender_id) {
              return  <div key={index}>   {"Toi: "} {containsSubstring? <img src={message.content}></img> : message.content}</div>;
            } else {
              return  <div key={index}>   {message.sender_id +": "} {containsSubstring? <img src={message.content}></img> : message.content}</div>;;
            }
          }         
        })}
      </div>
      <div>
        <label>Nội dung:</label>
        <input value={content} onChange={(e) => setContent(e.target.value)} />
      </div>
      <button onClick={sendMess}>chat</button>
      <input  onChange={(e)=> setFile(e.target.files[0])} type="file" id="imageUpload" name="image" accept="image/*"/>
      <button onClick={sendIMG}>Send ảnh</button>
    </>
  );
};

export default ChatBox;
