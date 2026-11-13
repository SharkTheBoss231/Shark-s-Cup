/* Shark’s Cup fixture generator: builds fixtures and advances winners from results. */
(function(){
const BYE="Bye",ok=Number.isFinite;
const pw=()=>window.CUP.points?.win??3,pd=()=>window.CUP.points?.draw??1;

// Seeded shuffle: same seed gives the same draw for every visitor.
const rng=s=>{let h=1779033717^s.length;for(let i=0;i<s.length;i++){h=Math.imul(h^s.charCodeAt(i),3432918353);h=h<<13|h>>>19}
  return()=>{h=Math.imul(h^h>>>16,2246822507);h=Math.imul(h^h>>>13,3266489909);return((h^=h>>>16)>>>0)/4294967296}};
const shuffle=(a,seed,on)=>{const x=[...a];if(on===false)return x;const r=rng(String(seed||"sharks"));
  for(let i=x.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[x[i],x[j]]=[x[j],x[i]]}return x};

// Looks up a typed result for a pair of players (either order); each result is used once.
const taker=l=>{const L=(l||[]).map(r=>({...r}));
  return(a,b)=>{if(!a||!b||a===BYE||b===BYE)return null;
    const r=L.find(r=>!r.u&&(r.a===a&&r.b===b||r.a===b&&r.b===a));if(!r)return null;r.u=1;
    return r.a===a?{sa:r.sa,sb:r.sb,w:r.w}:{sa:r.sb,sb:r.sa,w:r.w}}};

const play=(a,b,take,x)=>{const m={a,b,...x};
  if(a===BYE||b===BYE){m.win=a===BYE?b:a;m.lose=BYE;m.bye=true;m.hide=a===BYE&&b===BYE;return m}
  const r=take(a,b);
  if(r){m.sa=r.sa;m.sb=r.sb;m.win=r.sa>r.sb?a:r.sb>r.sa?b:(r.w===a||r.w===b?r.w:null);m.lose=m.win?(m.win===a?b:a):null}
  return m};

const rn=n=>n===2?"Final":n===4?"Semi-finals":n===8?"Quarter-finals":"Round of "+n;
const seeds=n=>{let o=[1];while(o.length<n)o=o.flatMap(x=>[x,o.length*2+1-x]);return o};
const pow2=n=>{let s=1;while(s<n)s*=2;return s};

function single(pl,take,third){
  let cur=seeds(pow2(pl.length)).map(s=>pl[s-1]??BYE);const rounds=[];
  while(cur.length>1){const ms=[],nx=[];
    for(let i=0;i<cur.length;i+=2){const m=play(cur[i],cur[i+1],take);ms.push(m);nx.push(m.win??null)}
    rounds.push({name:rn(cur.length),matches:ms.filter(m=>!m.hide)});cur=nx}
  if(third&&rounds.length>1){const s=rounds[rounds.length-2].matches;
    if(s.length===2&&!s.some(m=>m.bye))rounds.push({name:"Third place",matches:[play(s[0].lose,s[1].lose,take)]})}
  return{rounds,champ:cur[0]}}

function double(pl,take){
  const size=pow2(pl.length);
  if(size<4){const o=single(pl,take);return{sections:[{rounds:o.rounds}],champ:o.champ}}
  const R=Math.log2(size),W=[],L=[],wl=[];
  let cur=seeds(size).map(s=>pl[s-1]??BYE);
  for(let r=0;r<R;r++){const ms=[],nx=[],lo=[];
    for(let i=0;i<cur.length;i+=2){const m=play(cur[i],cur[i+1],take);ms.push(m);nx.push(m.win??null);lo.push(m.lose??null)}
    W.push({name:r===R-1?"Winners final":rn(cur.length),matches:ms.filter(m=>!m.hide)});wl.push(lo);cur=nx}
  const pair=(xs,ys,name)=>{const ms=[],nx=[];
    xs.forEach((x,i)=>{const m=play(x,ys[i],take);ms.push(m);nx.push(m.win??null)});
    L.push({name,matches:ms.filter(m=>!m.bye)});return nx};
  const ev=a=>a.filter((_,i)=>i%2===0),od=a=>a.filter((_,i)=>i%2===1);
  let lb=pair(ev(wl[0]),od(wl[0]),"Losers round 1"),k=2;
  for(let r=1;r<R;r++){
    lb=pair(lb,[...wl[r]].reverse(),"Losers round "+k++);
    if(r<R-1)lb=pair(ev(lb),od(lb),"Losers round "+k++)}
  L[L.length-1].name="Losers final";
  const wb=cur[0],lc=lb[0],gf=play(wb,lc,take),G=[{name:"Grand final",matches:[gf]}];
  let champ=gf.win;
  if(gf.win&&gf.win===lc){const g2=play(wb,lc,take);G.push({name:"Grand final reset",matches:[g2]});champ=g2.win}
  return{sections:[{title:"Winners bracket",rounds:W},{title:"Losers bracket",rounds:L},{title:"Grand final",rounds:G}],champ}}

function rr(pl,take,legs){
  const p=[...pl];if(p.length%2)p.push(BYE);
  const n=p.length,ms=[];let arr=p;
  for(let l=0;l<(legs||1);l++)for(let r=0;r<n-1;r++){
    for(let i=0;i<n/2;i++){let a=arr[i],b=arr[n-1-i];if(l%2){const t=a;a=b;b=t}
      if(a!==BYE&&b!==BYE)ms.push(play(a,b,take,{round:"Round "+(l*(n-1)+r+1)}))}
    arr=[arr[0],arr[n-1],...arr.slice(1,n-1)]}
  return ms}

// Swiss: next round is only created once every match of the current round has a result.
function swiss(pl,take,rounds){
  const N=rounds||Math.ceil(Math.log2(pl.length)),ms=[],pts={},met=new Set(),byes=new Set();
  pl.forEach(p=>pts[p]=0);
  for(let r=1;r<=N;r++){
    const pool=[...pl].sort((a,b)=>pts[b]-pts[a]||pl.indexOf(a)-pl.indexOf(b)),rm=[];
    if(pool.length%2){let i=pool.length-1;while(i>0&&byes.has(pool[i]))i--;
      const p=pool.splice(i,1)[0];byes.add(p);rm.push(play(p,BYE,take,{round:"Round "+r}));pts[p]+=pw()}
    const pairs=[];
    if(r===1){const h=pool.length/2;for(let i=0;i<h;i++)pairs.push([pool[i],pool[i+h]])}
    else while(pool.length){const a=pool.shift();let j=pool.findIndex(b=>!met.has(a+"|"+b));if(j<0)j=0;pairs.push([a,pool.splice(j,1)[0]])}
    for(const[a,b]of pairs){met.add(a+"|"+b);met.add(b+"|"+a);rm.push(play(a,b,take,{round:"Round "+r}))}
    ms.push(...rm);
    const pl2=rm.filter(m=>!m.bye);
    if(pl2.some(m=>!ok(m.sa)))break;
    pl2.forEach(m=>{if(m.sa>m.sb)pts[m.a]+=pw();else if(m.sb>m.sa)pts[m.b]+=pw();else{pts[m.a]+=pd();pts[m.b]+=pd()}})}
  return ms}

function rank(ms,pl){
  const t={};pl.forEach(p=>t[p]={n:p,pts:0,gd:0,gf:0});
  ms.forEach(m=>{if(!ok(m.sa))return;const A=t[m.a],B=t[m.b];
    A.gf+=m.sa;B.gf+=m.sb;A.gd+=m.sa-m.sb;B.gd+=m.sb-m.sa;
    if(m.sa>m.sb)A.pts+=pw();else if(m.sb>m.sa)B.pts+=pw();else{A.pts+=pd();B.pts+=pd()}});
  return Object.values(t).sort((a,b)=>b.pts-a.pts||b.gd-a.gd||b.gf-a.gf||pl.indexOf(a.n)-pl.indexOf(b.n)).map(x=>x.n)}

window.expandAuto=function(s){
  const C=window.CUP,nm=s.name||"Tournament",f=s.format;
  let pl=Array.isArray(s.players)?s.players:C.players.filter(p=>(s.players==="paid"?p.paid:true)&&(!s.game||p.game===s.game)).map(p=>p.name);
  pl=shuffle(pl,s.seed,s.shuffle);
  const take=taker(s.results);
  if(pl.length<2)return[{name:nm,type:"league",players:pl,matches:[]}];
  if(f==="single_elim"){const o=single(pl,take,s.thirdPlace);return[{name:nm,type:"bracket",champion:o.champ,sections:[{rounds:o.rounds}]}]}
  if(f==="double_elim"){const o=double(pl,take);return[{name:nm,type:"bracket",champion:o.champ,sections:o.sections}]}
  if(f==="round_robin")return[{name:nm,type:"league",players:pl,matches:rr(pl,take,s.legs)}];
  if(f==="swiss")return[{name:nm,type:"league",players:pl,matches:swiss(pl,take,s.rounds)}];
  if(f==="groups_knockout"){
    const G=s.groups||2,K=s.advance||2,gs=Array.from({length:G},()=>[]);
    pl.forEach((p,i)=>gs[i%G].push(p));
    const groups=gs.map((pp,i)=>({name:"Group "+String.fromCharCode(65+i),players:pp,matches:rr(pp,take,s.legs)}));
    const q=[];
    for(let p=0;p<K;p++)groups.forEach((g,i)=>{
      q.push(g.matches.every(m=>ok(m.sa))?rank(g.matches,g.players)[p]:String.fromCharCode(65+i)+(p+1))});
    const o=single(q.filter(Boolean),take,s.thirdPlace);
    return[{name:(s.name?s.name+" · ":"")+"Group stage",type:"groups",groups},{name:(s.name?s.name+" · ":"")+"Knockout",type:"bracket",champion:o.champ,sections:[{rounds:o.rounds}]}]}
  console.warn("Shark’s Cup: unknown format",f);return[]};
})();
