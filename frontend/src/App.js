import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import socket from "./utils/socket";
import ChatBox from "./ChatBox";

function App() {
  const [user, setUser] = useState();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [chatwith, setChatwith] = useState("");
  const [content, setContent] = useState("");
  const [listfen, setListfen] = useState();
  const [name, setName] = useState();
  const [showchat, setShowchat] = useState([]);
  const [sendMessage, setSendMessage] = useState(null);
  const [highlightedButtons, setHighlightedButtons] = useState([]);

  // Function để gửi request kiểm tra token
  async function checkToken() {
    try {
      // Gửi request GET tới endpoint /check-token trên server
      const response = await axios.get("http://localhost:4000/check-token", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Gửi token trong header Authorization
        },
      });
      // Nếu request thành công, in ra thông tin user đã được trả về từ server
      setUser(response.data);
      console.log("Thông tin user:", response.data);
    } catch (error) {
      // Nếu có lỗi, in ra lỗi
      console.error("Lỗi:", error);
    }
  }

  // Function để gửi request đăng nhập và nhận token từ server
  async function login() {
    try {
      // Gửi request POST tới endpoint /login trên server
      const response = await axios.post("http://localhost:4000/login", {
        username: username,
        password: password,
      });

      // Lưu token nhận được từ server vào localStorage
      localStorage.setItem("token", response.data.token);
      setName(username);
      // In ra thông báo đăng nhập thành công
      console.log("Đăng nhập thành công! Token:", response.data.token);
    } catch (error) {
      // Nếu có lỗi, in ra thông báo lỗi
      console.error("Lỗi đăng nhập:", error);
    }
  }

  const getChat = async () => {
    try {
      // Gửi request GET tới endpoint /check-token trên server
      const response = await axios.get(
        "http://localhost:4000/api/Room/getRoombyUser",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Gửi token trong header Authorization
          },
        }
      );
      setListfen(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      // Nếu có lỗi, in ra lỗi
      console.error("Lỗi:", error);
    }
  };

  const test = async () => {
    // localStorage.removeItem("token")
    console.log(listfen);
  };

  const show = async (idroom, iduser, name) => {
    if (highlightedButtons.includes(idroom)) {
      const updatedButtons = highlightedButtons.filter(
        (buttonId) => buttonId !== idroom
      );
      setHighlightedButtons(updatedButtons);
    }
    console.log(idroom, iduser, name)
    try {
      // Gửi request GET tới endpoint /check-token trên server
      const response = await axios.get(`http://localhost:4000/api/Mess/getMess/${idroom}`,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Gửi token trong header Authorization
        },
      });
      if(response.data.success===false){
        return
      }
      setShowchat(response.data.data);
      // setShowchat(showchat.unshift(...response.data.data));
      if (highlightedButtons.includes(chatwith.idroom)) {
        const updatedButtons = highlightedButtons.filter(
          (buttonId) => buttonId !== chatwith.idroom
        );
        setHighlightedButtons(updatedButtons);
      }
    } catch (error) {
      // Nếu có lỗi, in ra lỗi
      console.error("Lỗi:", error);
    }
    setChatwith({ name, iduser ,idroom});
  };

  const chat = async() => {
    const message = {
      sender_id: user._id,
      content: content,
    };
    try {
      // Gửi request GET tới endpoint /check-token trên server
      const response = await axios.post("http://localhost:4000/api/Mess/sendMess", {
        content:content,
        room: chatwith.idroom,
      },{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Gửi token trong header Authorization
        },
      });
      if(response.data.success===false){
        return
      }
      setSendMessage({ ...message, receiverId: chatwith.iduser,roomID:chatwith.idroom });
      // socket.emit('chat message', name+": "+content);
      setShowchat([...showchat, { sender_id: user._id, content: content }]);
      if (highlightedButtons.includes(chatwith.idroom)) {
        const updatedButtons = highlightedButtons.filter(
          (buttonId) => buttonId !== chatwith.idroom
        );
        setHighlightedButtons(updatedButtons);
      }
      setContent("");
    } catch (error) {
      // Nếu có lỗi, in ra lỗi
      console.error("Lỗi:", error);
    }
  };

  // Send Message to socket server
  useEffect(() => {
    if (sendMessage !== null) {
      socket.emit("send-message", sendMessage);
    }
  }, [sendMessage]);

  useEffect(() => {
    if (user) socket.emit("new-user-add", user._id);
  }, [user]);

  socket.on("recieve-message", (data) => {
    setHighlightedButtons([...highlightedButtons, data.roomID]);
    if (data.roomID === chatwith.idroom) {
      setShowchat([...showchat, data]);
    }
  });

  useEffect(() => {
    const checkToken = async () => {
      try {
        // Gửi request GET tới endpoint /check-token trên server
        const response = await axios.get("http://localhost:4000/check-token", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Gửi token trong header Authorization
          },
        });
        // Nếu request thành công, in ra thông tin user đã được trả về từ server
        console.log("Thông tin user:", response.data);
        setUser(response.data);
      } catch (error) {
        // Nếu có lỗi, in ra lỗi
        console.error("Lỗi:", error);
      }
    };
    checkToken();
  }, []);



  return (
    <div>
      <h2>Đăng nhập</h2> <button onClick={test}>test</button>
      <div>
        <label htmlFor="username">Tên đăng nhập:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Mật khẩu:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button onClick={login}>Đăng nhập</button>
      <br />
      <button onClick={checkToken}>CheckToken</button>
      <button onClick={getChat}>Lấy danh sách người bạn bè</button>
      <div>
        {listfen &&
          listfen.map((item, index) => {
            const otherMember = item.members.filter(member => member.userID !== user._id)[0];
            if (item.members.length === 2) {
              return (
                <button
                  key={index} 
                  onClick={() => setChatwith({idroom:item._id,iduser:otherMember.userID, name:otherMember.username})}
                  style={{
                    backgroundColor: highlightedButtons.includes(item._id)
                      ? "red"
                      : "transparent",
                  }}
                >
                  {otherMember.username}
                </button>
              );
            }
          })}
      </div>
      <div>
        <label>Nhắn với:</label>
        <input disabled value={chatwith.name} />
      </div>
      <div>
        <label>Nội dung:</label>
        <input value={content} onChange={(e) => setContent(e.target.value)} />
      </div>
      <button onClick={chat}>chat</button>
          {chatwith !==""  &&    <ChatBox chat={chatwith} currentUser={user} ></ChatBox>}
    </div>
  );
}

export default App;
