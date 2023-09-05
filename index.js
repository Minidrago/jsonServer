const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');

// 실행 , 위에서 지정했듯 app이란건 서버의이름같은것, 여기선 express서버 그 잡채
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


const data = {
    select : function(){
        return JSON.parse( fs.readFileSync('./test.json') ); 
    },
    insert : function(newObj){
        const jsonData = data.select();
    let newData = [...jsonData,{ id:jsonData.length+1, ...newObj }]
    fs.writeFileSync('./test.json', JSON.stringify(newData) );
        return newData;
    },
    update : function(){},
    delete : function(){
        const jsonData = data.select();
        const {id} = req.params;
        const aaa = data.filter(n => n.id !== id)
        res.send( aaa )
    },
}



// req는 리퀘스트의 약자, 여기서 첫타로 데이터를 보내준다면 받아옴.
// res는 데이터 요청한 사용자에게 보내줄때 사용 
// 아래의 '/'에는 주소창이름이 들어감, /abc라고 작성한다면...만약 주소창 이름이 http://기본/abc 와 일치한다면 function안의 내용을 실행해라 라는것(마치 router와 같다)
app.get('/abc', function (req, res) {
    // 아래 readFileSync 메소드는 비동기처리가 기본으로 탑재되어있으므로 따로 비동기처리 안해도 된다.

    // const jsonData = fs.readFileSync('./test.json');

    // console.log( req.query );
    // 브라우저에서 새로고침하면 서버측 아래 터미널에서 값이 뜬다. >> { id: '100' }
    // JSON.parse(jsonData) >> parse 는 데이터를 객체형태로 쪼갬
    
    // res.send( JSON.parse(jsonData) )

    res.send( data.select() )

})

// json전체를 send하는것이 아닌 id값이 2인 데이터를 특정하여 aaa로 send하는것
app.delete('/abc/:id', function (req, res) {
    const jsonData = data.select();
    // const jsonData =  fs.readFileSync('./test.json');
    // const data = JSON.parse(jsonData);
    
    // http://localhost:3030/abc/2 브라우저에 이렇게 쓸경우
    // 저 숫자 2가 {id:2} 이런형태로 params로 들어옴 
    const {id} = req.params;
    
    // 데이터중에서 id가 숫자 2와 같은걸 찾아서 aaa에 담아주세요
    const delData = jsonData.filter(n => n.id != id);
    console.log(delData);
    fs.writeFileSync('./test.json',JSON.stringify(delData));
    res.send( delData )
})

app.post('/insert', function (req, res) {

    const jsonData = JSON.parse( fs.readFileSync('./test.json') );
    
    // console.log(JSON.parse(jsonData));
    
    // ...jsonData는 기존데이터, 뒤의객체형태는 내가 입력한 데이터
    // 예를들어 aaa = [{},{},{}] 이런 배열일때 ...aaa = {},{},{} 이다. 배열이 아니라 그 안의 값을 의미.
    // 고로 새로운 값을 추가하고 싶으면 [...aaa, {}]이런식인것

    // let data = [...jsonData,{ id:jsonData.length+1, ...req.body }] 
    
    // console.log( req.body );
    // JSON.stringify()는 안의 내용을 "":"","":""등의 딱 정해진 json형태의 문자열로 만들어주는것, 누적시킬때는 따로 더 작성해야할게 있다.
    
    // fs.writeFileSync('./test.json', JSON.stringify(data) ); 

    // send같은 놈들은 무조건 필요하다. 없으면 서버측에서 엄청 헤멤
    
    // res.send('data');
    
    // 위 내용 전체가 그 위에 정리해준 data안의 insert에 정리해서 넣어주고 아래에서 출력
    res.send(data.insert(req.body));
});


// res.send('hello world')
// 프론트쪽에선 axios로 받아서 위에서 res.send로 보낸 헬로 월드가 아래res로 들어온다.
// axios.get('/?page=1')
//     .then(res =>)

app.listen(3000)