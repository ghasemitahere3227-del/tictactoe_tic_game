const express=require("express"),http=require("http"),{Server}=require("socket.io");
const app=express(),server=http.createServer(app),io=new Server(server),rooms=new Map();
app.use(express.static("public"));
const newCode=()=>{let c;do c=""+Math.floor(100000+Math.random()*900000);while(rooms.has(c));return c};
const fresh=id=>({id,board:Array(9).fill(""),turn:"X",winner:null,players:{X:null,O:null}});
const win=b=>{for(const [a,c,d] of [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]])if(b[a]&&b[a]===b[c]&&b[c]===b[d])return b[a];return b.every(Boolean)?"draw":null};
const send=r=>io.to(r.id).emit("state",{board:r.board,turn:r.turn,winner:r.winner,ready:!!r.players.X&&!!r.players.O});
io.on("connection",s=>{
 s.on("create",()=>{const c=newCode(),r=fresh(c);r.players.X=s.id;rooms.set(c,r);s.join(c);s.data={room:c,symbol:"X"};s.emit("room",{code:c,symbol:"X"});send(r)});
 s.on("join",c=>{c=String(c||"").trim();const r=rooms.get(c);if(!r)return s.emit("err","کد اتاق پیدا نشد.");if(r.players.O)return s.emit("err","این اتاق پر است.");r.players.O=s.id;s.join(c);s.data={room:c,symbol:"O"};s.emit("room",{code:c,symbol:"O"});send(r)});
 s.on("move",i=>{const r=rooms.get(s.data?.room);if(!r||r.winner||!r.players.O||r.turn!==s.data.symbol||r.board[i])return;r.board[i]=s.data.symbol;r.winner=win(r.board);if(!r.winner)r.turn=r.turn==="X"?"O":"X";send(r)});
 s.on("reset",()=>{const r=rooms.get(s.data?.room);if(!r||!r.players.O)return;r.board=Array(9).fill("");r.turn="X";r.winner=null;send(r)});
 s.on("disconnect",()=>{const r=rooms.get(s.data?.room);if(r){io.to(r.id).emit("left");rooms.delete(r.id)}})
});
server.listen(process.env.PORT||3000,()=>console.log("دوز آنلاین روی پورت "+(process.env.PORT||3000)));