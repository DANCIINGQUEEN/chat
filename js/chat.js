//로그인 시스템
let username=prompt("ID를 입력하세요")
let roomNum=prompt("채팅방 번호를 입력하세요")

document.querySelector("#username").innerHTML=username

//SSE 연결
const eventSource=new EventSource(`http://localhost:8080/chat/roomNum/${roomNum}`)

eventSource.onmessage=(event)=>{
    const data=JSON.parse(event.data)
    if(data.sender===username){ //로그인한 유저가 보낸 메시지
    //파란박스
    initMyMessage(data)
    }
    else{ 
        //회색박스
        initYourMessage(data)
    }
}

//파란박스
function getSendMsgBox(data){
    let md = data.createdAt.substring(5,10)
    let tm = data.createdAt.substring(11,16)
    convertTime = tm + " | " + md

    return `
    <div class="sent_msg">
    <p>${data.msg}</p>
    <span class="time_date">${convertTime}<span style="font-weight: bold">&nbsp;&nbsp;[ ${data.sender} ]</span></span>
    </div>
    `
}

//회색박스
function getReceivedMsgBox(data){
    let md = data.createdAt.substring(5,10)
    let tm = data.createdAt.substring(11,16)
    convertTime = tm + " | " + md

    return `
    <div class="received_withd_msg">
    <p>${data.msg}</p>
    <span class="time_date">${convertTime} / ${data.sender}</span>
    </div>
    `
}

//파란박스 초기화
function initMyMessage(data){ //기존에 저장돼있는 메시지들
    let chatBox=document.querySelector('#chat-box')

    let sendBox=document.createElement("div")
    sendBox.className="outgoing_msg"

    sendBox.innerHTML=getSendMsgBox(data)
    chatBox.append(sendBox)
    document.documentElement.scrollTop=document.body.scrollHeight
}

//회색박스 초기화
function initYourMessage(data){ //기존에 저장돼있는 메시지들
    let chatBox=document.querySelector('#chat-box')

    let receivedBox=document.createElement("div")
    receivedBox.className="received_msg"

    

    receivedBox.innerHTML=getReceivedMsgBox(data)
    chatBox.append(receivedBox)
    document.documentElement.scrollTop=document.body.scrollHeight

}

//AJAX 채팅 메시지 전송
async function addMessage(){  //화면에 채팅 메시지 div추가
    //서버에서 받아오는 시간때문에 비동기(async)로 함
    let msgInput=document.querySelector('#chat-outgoing-msg')

    let chat={  //js object
        sender:username,
        roomNum:roomNum,
        msg:msgInput.value
    }
    fetch("http://localhost:8080/chat", {   
        //서버에 내용 전송, 서버에서 받아오는 시간이 걸리기 때문에 await을 걸어줌
        method:"POST", //http post 메서드, 새로운 데이터를 write
        body:JSON.stringify(chat), //JS-<JSON
        headers:{   //data type 이 무엇인지 알림
            "Content-Type": "application/json;charset=utf-8"
        }
    })
    msgInput.value=""
}
document.querySelector('#chat-send').addEventListener("click", ()=>{
    addMessage()
}) //전송 버튼 누르면 전송
document.querySelector('#chat-outgoing-msg').addEventListener("keydown", (e)=>{
    if(e.keyCode ===13){ //enter누르면 입력
        addMessage()

    }
    // console.log(e.keyCode);
})