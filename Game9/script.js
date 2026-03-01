// ============================================================
//  PAC-MAN  -  Fixed & Enhanced
// ============================================================
const CELL = 30, COLS = 18, ROWS = 22;
const canvas = document.getElementById('gameCanvas');
const ctx    = canvas.getContext('2d');

const $score     = document.getElementById('score');
const $hi        = document.getElementById('highScore');
const $level     = document.getElementById('level');
const $lives     = document.getElementById('livesDisplay');
const $over      = document.getElementById('gameOverScreen');
const $final     = document.getElementById('finalScore');
const $hiMsg     = document.getElementById('highScoreMsg');
const $restart   = document.getElementById('restartButton');
const $start     = document.getElementById('startScreen');
const $startBtn  = document.getElementById('startButton');
const $pause     = document.getElementById('pauseScreen');
const $resume    = document.getElementById('resumeButton');
const $lvl       = document.getElementById('levelScreen');
const $lvlTitle  = document.getElementById('levelTitle');
const $lvlMsg    = document.getElementById('levelMsg');

/* ── 18x22 maze  0=dot 1=wall 2=power-pellet 3=empty(passable) ──
   Fully connected, ghost-house in centre rows 9-11, tunnels at rows 10 */
const MAZE_T = [
 [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
 [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
 [1,0,1,1,0,1,1,1,0,0,1,1,1,0,1,1,0,1],
 [1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1],
 [1,0,1,0,1,0,1,1,1,1,1,1,0,1,0,1,0,1],
 [1,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,1],
 [1,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,1],
 [3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3],
 [1,1,1,0,1,0,1,1,3,3,1,1,0,1,0,1,1,1],
 [1,1,1,0,1,0,1,3,3,3,3,1,0,1,0,1,1,1],
 [3,3,0,0,0,0,3,3,3,3,3,3,0,0,0,0,3,3],
 [1,1,1,0,1,0,1,1,1,1,1,1,0,1,0,1,1,1],
 [1,1,1,0,1,0,0,0,0,0,0,0,0,1,0,1,1,1],
 [3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3],
 [1,0,1,0,1,1,0,1,1,1,1,0,1,1,0,1,0,1],
 [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
 [1,2,1,1,0,1,0,1,1,1,1,0,1,0,1,1,2,1],
 [1,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,1],
 [1,0,1,1,0,1,1,1,0,0,1,1,1,0,1,1,0,1],
 [1,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,1],
 [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
 [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

const OPP = {up:'down',down:'up',left:'right',right:'left'};
const DIR_DX = {right:1,left:-1,up:0,down:0};
const DIR_DY = {right:0,left:0,up:-1,down:1};
const FRIGHT_BASE = 360;

// ── state ──
let maze,dots,pellets,ghosts,pac;
let score=0,hi=0,lives=3,level=1;
let running=false,paused=false,lvlDone=false,lvlTrans=false;
let frightTimer=0,eatMul=1,popups=[],fruit=null,dotsEaten=0,animId=null;

hi = +(localStorage.getItem('pacman_hs')||0);

// helpers
const cell  = v => Math.floor(v/CELL);
const center= c => c*CELL + CELL/2;
const wall  = (c,r)=> r<0||r>=ROWS||c<0||c>=COLS||maze[r][c]===1;

// ── init ──
function init(full){
  maze = MAZE_T.map(r=>[...r]);
  dots=[]; pellets=[]; dotsEaten=0; fruit=null; popups=[];
  lvlDone=false; lvlTrans=false;
  if(full){score=0;lives=3;level=1;}
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){
    if(maze[r][c]===0) dots.push({x:center(c),y:center(r),eaten:false});
    else if(maze[r][c]===2) pellets.push({x:center(c),y:center(r),eaten:false});
  }
  const sp = Math.min(2+(level-1)*0.2, 4);
  pac = {x:center(9),y:center(15),r:11,spd:sp,dir:'left',next:'left',mouth:0.1,md:1};
  const gs = Math.min(1.6+(level-1)*0.15, 3);
  ghosts = [
    {x:center(8),y:center(9),col:'#FF0000',dir:'left', spd:gs,mode:'chase',type:0},
    {x:center(9),y:center(9),col:'#FFB8FF',dir:'up',   spd:gs,mode:'chase',type:1},
    {x:center(10),y:center(9),col:'#00FFFF',dir:'down', spd:gs,mode:'chase',type:2},
    {x:center(9),y:center(10),col:'#FFB852',dir:'right',spd:gs,mode:'chase',type:3}
  ];
  frightTimer=0; eatMul=1;
  ui();
}

function resetPos(){
  pac.x=center(9); pac.y=center(15); pac.dir='left'; pac.next='left';
  const positions = [[8,9],[9,9],[10,9],[9,10]];
  ghosts.forEach((g,i)=>{g.x=center(positions[i][0]);g.y=center(positions[i][1]);g.mode='chase';});
  frightTimer=0;
}

// ── grid-aligned movement ──
function tryMove(obj,dir,spd){
  let nx=obj.x+DIR_DX[dir]*spd, ny=obj.y+DIR_DY[dir]*spd;
  // check corners of bounding box
  const half = (obj.r||10)-2;
  if(dir==='left'||dir==='right'){
    const edge = dir==='right'? nx+half : nx-half;
    if(wall(cell(edge),cell(ny-half+1))||wall(cell(edge),cell(ny+half-1))) return false;
  } else {
    const edge = dir==='down'? ny+half : ny-half;
    if(wall(cell(nx-half+1),cell(edge))||wall(cell(nx+half-1),cell(edge))) return false;
  }
  return true;
}

function snapAxis(v){
  // snap towards cell centre if close enough (allows turning at intersections)
  const c = Math.round((v - CELL/2)/CELL)*CELL + CELL/2;
  return Math.abs(v-c)<4 ? c : v;
}

function movePac(){
  // try desired direction first (snap cross-axis to allow turning)
  if(pac.next !== pac.dir){
    let tx=pac.x, ty=pac.y;
    if(pac.next==='up'||pac.next==='down') tx=snapAxis(tx);
    else ty=snapAxis(ty);
    const testPac = {x:tx,y:ty,r:pac.r};
    if(tryMove(testPac,pac.next,pac.spd)){
      pac.x=tx; pac.y=ty; pac.dir=pac.next;
    }
  }
  if(tryMove(pac,pac.dir,pac.spd)){
    pac.x += DIR_DX[pac.dir]*pac.spd;
    pac.y += DIR_DY[pac.dir]*pac.spd;
  }
  // tunnel
  if(pac.x < -pac.r) pac.x = canvas.width+pac.r;
  else if(pac.x > canvas.width+pac.r) pac.x = -pac.r;

  // eat dots
  for(const d of dots){
    if(!d.eaten && Math.hypot(pac.x-d.x,pac.y-d.y)<pac.r+3){
      d.eaten=true; score+=10; dotsEaten++;
      if(dotsEaten===70&&!fruit) spawnFruit();
      ui();
    }
  }
  // eat pellets
  for(const p of pellets){
    if(!p.eaten && Math.hypot(pac.x-p.x,pac.y-p.y)<pac.r+6){
      p.eaten=true; score+=50;
      frightTimer = Math.max(FRIGHT_BASE-(level-1)*40, 120);
      eatMul=1;
      ghosts.forEach(g=>{if(g.mode!=='eaten')g.mode='frightened';});
      ui();
    }
  }
  // eat fruit
  if(fruit&&!fruit.eaten&&Math.hypot(pac.x-fruit.x,pac.y-fruit.y)<pac.r+12){
    fruit.eaten=true; score+=500; popup(fruit.x,fruit.y,500); ui();
  }
}

// ── ghost movement (grid-aligned at cell centres) ──
function validDirs(c,r,cur){
  return ['up','right','down','left'].filter(d=>{
    if(d===OPP[cur]) return false;
    return !wall(c+DIR_DX[d], r+DIR_DY[d]);
  });
}

function pickDir(g,dirs,gc,gr){
  if(!dirs.length) return g.dir;
  let tx=pac.x, ty=pac.y;
  if(g.mode==='frightened'){
    // random walk away
    let best=dirs[0],bd=-1;
    dirs.forEach(d=>{
      const dist=Math.hypot(center(gc+DIR_DX[d])-pac.x, center(gr+DIR_DY[d])-pac.y);
      if(Math.random()<0.35||dist>bd){bd=dist;best=d;}
    });
    return best;
  }
  // per-ghost personality
  if(g.type===1){const a=CELL*4;tx+=DIR_DX[pac.dir]*a;ty+=DIR_DY[pac.dir]*a;}
  else if(g.type===3&&Math.hypot(g.x-pac.x,g.y-pac.y)<CELL*8){tx=CELL;ty=(ROWS-2)*CELL;}
  let best=dirs[0],bd=1e9;
  dirs.forEach(d=>{
    const dist=Math.hypot(center(gc+DIR_DX[d])-tx, center(gr+DIR_DY[d])-ty);
    if(dist<bd){bd=dist;best=d;}
  });
  return Math.random()<0.1 ? dirs[Math.random()*dirs.length|0] : best;
}

function moveGhost(g){
  if(g.mode==='eaten') return;
  const gc=cell(g.x), gr=cell(g.y);
  const cx=center(gc), cy=center(gr);
  if(Math.abs(g.x-cx)<=g.spd+1 && Math.abs(g.y-cy)<=g.spd+1){
    g.x=cx; g.y=cy;
    let dirs=validDirs(gc,gr,g.dir);
    if(!dirs.length) dirs=validDirs(gc,gr,''); // u-turn
    if(dirs.length) g.dir=pickDir(g,dirs,gc,gr);
  }
  const nx=g.x+DIR_DX[g.dir]*g.spd, ny=g.y+DIR_DY[g.dir]*g.spd;
  if(!wall(cell(nx),cell(ny))){g.x=nx;g.y=ny;}
  // tunnel
  if(g.x<-CELL)g.x=canvas.width+CELL;
  else if(g.x>canvas.width+CELL)g.x=-CELL;
}

// ── fright ──
function tickFright(){
  if(frightTimer<=0) return;
  frightTimer--;
  if(frightTimer===0){ghosts.forEach(g=>{if(g.mode==='frightened')g.mode='chase';});eatMul=1;}
}

// ── collision ──
function collisions(){
  for(const g of ghosts){
    if(g.mode==='eaten') continue;
    if(Math.hypot(pac.x-g.x,pac.y-g.y)<CELL*0.7){
      if(g.mode==='frightened'){
        const pts=200*eatMul; score+=pts; eatMul*=2;
        popup(g.x,g.y,pts); g.mode='eaten';
        const gg=g;
        setTimeout(()=>{gg.x=center(9);gg.y=center(9);gg.mode='chase';},1500);
        ui();
      } else {
        lives--; ui();
        if(lives<=0) gameOver(); else resetPos();
        return;
      }
    }
  }
}

// ── level check ──
function checkLevel(){
  if(lvlDone) return;
  if(dots.every(d=>d.eaten)&&pellets.every(p=>p.eaten)){
    lvlDone=true; lvlTrans=true;
    score+=level*100; level++; ui();
    $lvlTitle.textContent='LEVEL '+level+'!';
    $lvlMsg.textContent='Bonus: '+((level-1)*100)+' pts!';
    $lvl.classList.remove('hidden');
    setTimeout(()=>{$lvl.classList.add('hidden');lvlTrans=false;init(false);},2200);
  }
}

// ── fruit ──
function spawnFruit(){fruit={x:center(9),y:center(13),eaten:false,timer:600};}

// ── popups ──
function popup(x,y,pts){popups.push({x,y,text:'+'+pts,a:1,vy:-.7,life:80});}
function tickPopups(){
  popups=popups.filter(p=>p.life>0);
  popups.forEach(p=>{p.y+=p.vy;p.life--;p.a=p.life/80;});
}

// ── UI ──
function ui(){
  $score.textContent=score;
  if(score>hi){hi=score;localStorage.setItem('pacman_hs',hi);}
  $hi.textContent=hi; $level.textContent=level;
  $lives.innerHTML='';
  for(let i=0;i<lives;i++) $lives.innerHTML+='<span class="life-icon"></span>';
}

// ── draw ──
function drawMaze(){
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){
    const x=c*CELL,y=r*CELL;
    if(maze[r][c]===1){
      ctx.fillStyle='#0e1478'; ctx.fillRect(x,y,CELL,CELL);
      ctx.strokeStyle='#3355ff'; ctx.lineWidth=1.5; ctx.strokeRect(x+1,y+1,CELL-2,CELL-2);
    } else {ctx.fillStyle='#000010'; ctx.fillRect(x,y,CELL,CELL);}
  }
}

function drawDots(){
  const pv=5+Math.sin(Date.now()/220)*2;
  ctx.shadowColor='#FFD700';
  for(const d of dots){
    if(d.eaten) continue;
    ctx.fillStyle='#FFD700'; ctx.shadowBlur=4;
    ctx.beginPath();ctx.arc(d.x,d.y,3,0,Math.PI*2);ctx.fill();
  }
  for(const p of pellets){
    if(p.eaten) continue;
    ctx.fillStyle='#FFD700'; ctx.shadowBlur=16;
    ctx.beginPath();ctx.arc(p.x,p.y,pv,0,Math.PI*2);ctx.fill();
  }
  ctx.shadowBlur=0;
}

function drawPac(){
  pac.mouth+=0.07*pac.md;
  if(pac.mouth>0.45)pac.md=-1; else if(pac.mouth<0.02)pac.md=1;
  const rot={right:0,down:Math.PI/2,left:Math.PI,up:Math.PI*1.5};
  ctx.save(); ctx.translate(pac.x,pac.y); ctx.rotate(rot[pac.dir]||0);
  ctx.shadowColor='#FFD700'; ctx.shadowBlur=12; ctx.fillStyle='#FFD700';
  ctx.beginPath(); ctx.moveTo(0,0);
  ctx.arc(0,0,pac.r,pac.mouth,Math.PI*2-pac.mouth);
  ctx.lineTo(0,0); ctx.fill(); ctx.shadowBlur=0; ctx.restore();
}

function drawGhost(g){
  if(g.mode==='eaten') return;
  const x=g.x,y=g.y,r=11;
  let c;
  if(g.mode==='frightened') c=(frightTimer<100&&(frightTimer/12|0)%2===0)?'#fff':'#2233ee';
  else c=g.col;
  ctx.save(); ctx.shadowColor=c; ctx.shadowBlur=8; ctx.fillStyle=c;
  ctx.beginPath(); ctx.arc(x,y-2,r,Math.PI,0);
  ctx.lineTo(x+r,y+r);
  const w=r*2/3;
  for(let i=3;i>=0;i--) ctx.lineTo(x-r+i*w,(i%2===0)?y+r:y+r-5);
  ctx.closePath(); ctx.fill(); ctx.shadowBlur=0;
  if(g.mode!=='frightened'){
    ctx.fillStyle='white'; ctx.beginPath();
    ctx.ellipse(x-4,y-4,3.5,4.5,0,0,Math.PI*2);
    ctx.ellipse(x+4,y-4,3.5,4.5,0,0,Math.PI*2); ctx.fill();
    const p=(({right:[2,0],left:[-2,0],up:[0,-2],down:[0,2]})[g.dir])||[0,0];
    ctx.fillStyle='#0000cc'; ctx.beginPath();
    ctx.arc(x-4+p[0],y-4+p[1],1.8,0,Math.PI*2);
    ctx.arc(x+4+p[0],y-4+p[1],1.8,0,Math.PI*2); ctx.fill();
  } else {
    ctx.fillStyle='#aaddff'; ctx.font='9px Arial'; ctx.textAlign='center';
    ctx.fillText('><',x,y);
  }
  ctx.restore();
}

function drawFruit(){
  if(!fruit||fruit.eaten) return;
  ctx.save(); ctx.font='22px serif'; ctx.textAlign='center';
  ctx.shadowColor='red'; ctx.shadowBlur=12;
  ctx.fillText('\uD83C\uDF52',fruit.x,fruit.y+9);
  ctx.shadowBlur=0; ctx.restore();
}

function drawPopups(){
  for(const p of popups){
    ctx.save(); ctx.globalAlpha=p.a; ctx.fillStyle='#FFD700';
    ctx.font='bold 14px Arial'; ctx.textAlign='center';
    ctx.shadowColor='#FFD700'; ctx.shadowBlur=6;
    ctx.fillText(p.text,p.x,p.y); ctx.shadowBlur=0; ctx.restore();
  }
}

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawMaze(); drawDots(); drawFruit(); drawPac();
  ghosts.forEach(drawGhost); drawPopups();
}

// ── loop ──
function loop(){
  if(!running){animId=null;return;}
  if(!paused&&!lvlTrans){
    movePac(); ghosts.forEach(moveGhost); tickFright(); tickPopups();
    collisions(); checkLevel();
    if(fruit&&!fruit.eaten){fruit.timer--;if(fruit.timer<=0)fruit=null;}
  }
  draw(); animId=requestAnimationFrame(loop);
}

function gameOver(){
  running=false;
  $final.textContent=score;
  $hiMsg.textContent=score>=hi?'\u2605 New High Score!':'High Score: '+hi;
  $over.classList.remove('hidden'); draw();
}

function togglePause(){paused=!paused;$pause.classList.toggle('hidden',!paused);}

// ── controls ──
document.addEventListener('keydown',e=>{
  const m={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',
           w:'up',s:'down',a:'left',d:'right',W:'up',S:'down',A:'left',D:'right'};
  if(m[e.key]){pac.next=m[e.key];e.preventDefault();}
  if(e.key===' '){if(running)togglePause();e.preventDefault();}
});

['btnUp','btnDown','btnLeft','btnRight'].forEach(id=>{
  const d=id.replace('btn','').toLowerCase();
  document.getElementById(id).addEventListener('pointerdown',e=>{pac.next=d;e.preventDefault();});
});

let ts={x:0,y:0};
canvas.addEventListener('touchstart',e=>{ts.x=e.touches[0].clientX;ts.y=e.touches[0].clientY;e.preventDefault();},{passive:false});
canvas.addEventListener('touchend',e=>{
  const dx=e.changedTouches[0].clientX-ts.x, dy=e.changedTouches[0].clientY-ts.y;
  if(Math.abs(dx)>Math.abs(dy)) pac.next=dx>0?'right':'left';
  else pac.next=dy>0?'down':'up';
  e.preventDefault();
},{passive:false});

$startBtn.addEventListener('click',()=>{$start.classList.add('hidden');running=true;init(true);if(!animId)loop();});
$restart.addEventListener('click',()=>{$over.classList.add('hidden');running=true;init(true);if(!animId)loop();});
$resume.addEventListener('click',togglePause);

window.addEventListener('load',()=>{$hi.textContent=hi;init(true);draw();});
