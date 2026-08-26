const s=io(),$=x=>document.getElementById(x);let me="",room="";
function show(x){["home","room","game"].forEach(a=>$(a).classList.toggle("hidden",a!==x))}
$("create").onclick=()=>s.emit("create");
$("join").onclick=()=>{const c=$("input").value.trim();if(c.length!==6){$("err").textContent="کد باید ۶ رقمی باشد.";return}s.emit("join",c)};
$("copy").onclick=async()=>{await navigator.clipboard.writeText(room);$("copy").textContent="✓ کپی شد";setTimeout(()=>$("copy").textContent="📋 کپی کد",1200)};
$("back").onclick=$("exit").onclick=()=>location.reload();
s.on("err",m=>$("err").textContent=m);
s.on("room",d=>{room=d.code;me=d.symbol;$("code").textContent=room;$("gcode").textContent=room;$("me").textContent=me;show(me==="X"?"room":"game")});
s.on("state",st=>{if(!st.ready){$("turn").textContent="منتظر بازیکن دوم...";return}if(!$("room").classList.contains("hidden"))show("game");$("board").innerHTML="";st.board.forEach((v,i)=>{const b=document.createElement("button");b.className="cell "+(v?v.toLowerCase():"");b.textContent=v;b.disabled=!!v||!!st.winner||st.turn!==me;b.onclick=()=>s.emit("move",i);$("board").appendChild(b)});$("px").classList.toggle("active",st.turn==="X");$("po").classList.toggle("active",st.turn==="O");if(st.winner){$("turn").textContent=st.winner==="draw"?"مساوی شد 🤝":st.winner===me?"بردی! 🎉":"باختی! 😄";$("again").classList.remove("hidden")}else{$("again").classList.add("hidden");$("turn").textContent=st.turn===me?"نوبت توست 👆":"نوبت حریف است..."}});$("again").onclick=()=>s.emit("reset");s.on("left",()=>{$("turn").textContent="حریف از بازی خارج شد.";document.querySelectorAll(".cell").forEach(b=>b.disabled=true)});
