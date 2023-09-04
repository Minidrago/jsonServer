const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');

// 실행 , 위에서 지정했듯 app이란건 서버의이름같은것, 여기선 express서버 그 잡채
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// req는 리퀘스트의 약자, 여기서 첫타로 데이터를 보내준다면 받아옴.
// res는 데이터 요청한 사용자에게 보내줄때 사용 
// 아래의 '/'에는 주소창이름이 들어감, /abc라고 작성한다면...만약 주소창 이름이 http://기본/abc 와 일치한다면 function안의 내용을 실행해라 라는것(마치 router와 같다)
app.get('/abc', function (req, res) {
    // 아래 readFileSync 메소드는 비동기처리가 기본으로 탑재되어있으므로 따로 비동기처리 안해도 된다.
    const jsonData = fs.readFileSync('./test.json');

    // console.log( req.query );
    // 브라우저에서 새로고침하면 서버측 아래 터미널에서 값이 뜬다. >> { id: '100' }
    // JSON.parse(jsonData) >> parse 는 데이터를 객체형태로 쪼갬
    res.send( JSON.parse(jsonData) )
})

// json전체를 send하는것이 아닌 id값이 2인 데이터를 특정하여 aaa로 send하는것
app.get('/abc/:id', function (req, res) {
    const jsonData = fs.readFileSync('./test.json');
    const data = JSON.parse(jsonData);
    
    // http://localhost:3030/abc/2 브라우저에 이렇게 쓸경우
    // 저 숫자 2가 {id:2} 이런형태로 params로 들어옴 
    const {id} = req.params;
    
    // 데이터중에서 id가 숫자 2와 같은걸 찾아서 aaa에 담아주세요
    const aaa = data.filter(n => n.id == id)
    res.send( aaa )
})

app.post('/insert', function (req, res) {
    
    console.log( req.body );
    // JSON.stringify()는 안의 내용을 "":"","":""등의 딱 정해진 json형태의 문자열로 만들어주는것, 누적시킬때는 따로 더 작성해야할게 있다.
    fs.writeFileSync('./test.json', JSON.stringify(req.body) );

    // send같은 놈들은 무조건 필요하다. 없으면 서버측에서 엄청 헤멤
    res.send('성공');
});


// res.send('hello world')
// 프론트쪽에선 axios로 받아서 위에서 res.send로 보낸 헬로 월드가 아래res로 들어온다.
// axios.get('/?page=1')
//     .then(res =>)

app.listen(3030)