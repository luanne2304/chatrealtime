const mongoose =require('mongoose')
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const SampleRouter =require("./Routers/sampleRouter")
const UserRouter =require("./Routers/userRouter")
const RoomRouter =require("./Routers/roomRouter")
const MessRouter =require("./Routers/messRouter")


const userModel = require("./Models/userModel");

const port= 4000
const JWT_KEY = 'vinahey';
const expiresIn = '1h';

const app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded())

app.use(SampleRouter)
app.use(UserRouter)
app.use(RoomRouter)
app.use(MessRouter)


app.get("/", async (req, res) => {
    res.send('Hello World!')
});


// Middleware để xác thực token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        // Nếu không có token, trả về lỗi 401
        return res.sendStatus(401);
    }

    jwt.verify(token, JWT_KEY, (err, user) => {
        if (err) {
            // Nếu token không hợp lệ, trả về lỗi 403
            return res.sendStatus(403);
        }
        req.user = user;
        next(); // Tiếp tục tiến hành xử lý request
    });
}

// Hàm đăng nhập
app.post('/login',async (req, res) => {
    const { username, password } = req.body;

    // Tìm kiếm người dùng trong cơ sở dữ liệu
    const user = await userModel.find({ username: username,password:password });
    
    if (user.length==0) {
        // Nếu không tìm thấy người dùng, trả về lỗi
        return res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng.' });
    }

    // Tạo token cho người dùng
    const token = jwt.sign({ _id: user[0]._id, username: user[0].username }, JWT_KEY, { expiresIn });

    // Trả về token cho client
    res.status(200).json({ token });
});

// Route kiểm tra token
app.get('/check-token', authenticateToken, (req, res) => {
    // Nếu token hợp lệ, trả về thông tin user
    res.json(req.user);
});

mongoose.connect("mongodb+srv://luannee2304:mamixi123@clusterluanvo.yeaf4xt.mongodb.net/chatapp")
  .then(()=>{
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`)
    })
    
  })
  .catch((error)=>{
    console.log(error)
  })