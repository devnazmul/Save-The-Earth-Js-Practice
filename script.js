const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");


let btn = document.getElementById("btn");


const startGame = document.querySelector('#startGame');
const startGameBtn = document.querySelector('#start');
const score = document.getElementById('score');
const gameOverScore = document.querySelector('span');
const gameOver = document.getElementById('gameOver');

const gameOverBtn = document.getElementById('#restart');

canvas.width = innerWidth;
canvas.height = innerHeight;





//VARIABLES...................................
let bullets = [];
let enemys = [];
let stars = [];
let scr = 0;
let particles = [];
let velocity = {
	x:null,
	y:null
}
let velocityE = {
	x:null,
	y:null
}
let color = [
	'#235971',
	'#dca445',
	'#8297aa',
	'#a85042',
	'#485359'
];
function init(){
	bullets = [];
	enemys = [];
	scr = 0;
	particles = [];
	velocity = {
		x:null,
		y:null
	}
	velocityE = {
		x:null,
		y:null
	}
	color = [
		'#dca445',
		'#00ff00',
		'#ff5500',
		'#e600e6',
		'#ff0000'
	];
}

//FUNCTIONS..................................
function distance(x1,y1,x2,y2){
	return Math.sqrt(Math.pow((x1-x2),2)+Math.pow((y1-y2),2));
}
function randomColor(color){
	return color [Math.ceil(Math.random()*4)];
}

//CLASSES.....................................

//PLAYER OBJECT..................
class Player{
	constructor(x, y, r, c){
		this.x = x;
		this.y = y;
		this.r = r;
		this.c = c;
		
	}
	draw(){
		ctx.beginPath();
		ctx.arc(this.x,this.y,this.r,0,Math.PI * 2,false);
		ctx.fillStyle = this.c;

		ctx.fill();
	}
	update(){
		this.draw();
	}
}

//BULLET OBJECT....................
class Bullet{
	constructor(x, y, r, dx, dy, c){
		this.x = x;
		this.y = y;
		this.r = r;
		this.c = c;
		this.dx = dx;
		this.dy = dy;
	}
	draw(){
		ctx.beginPath();
		ctx.arc(this.x,this.y,this.r,0,Math.PI * 2,false);
		ctx.fillStyle = this.c;

		ctx.fill();
	}
	update(){
		this.x += this.dx;
		this.y += this.dy;
		this.draw();
	}
}
//ENEMY OBJECT....................
class Enemy{
	constructor(x, y, r, dx, dy, c){
		this.x = x;
		this.y = y;
		this.r = r;
		this.c = c;
		this.dx = dx;
		this.dy = dy;
	}
	draw(){
		ctx.beginPath();
		ctx.arc(this.x,this.y,this.r,0,Math.PI * 2,false);
		ctx.fillStyle = this.c;

		ctx.fill();
	}
	update(){
		this.x += this.dx;
		this.y += this.dy;
		this.draw();
	}
}
//PARTICLE OBJECT....................
class Particle{
	constructor(x, y, r, dx, dy, c){
		this.x = x;
		this.y = y;
		this.r = r;
		this.c = c;
		this.dx = dx;
		this.dy = dy;
		this.alpha = 1;
	}
	draw(){
		ctx.save();
		ctx.globalAlpha = this.alpha;
		ctx.beginPath();
		ctx.arc(this.x,this.y,this.r,0,Math.PI * 2,false);
		ctx.fillStyle = this.c;
		ctx.fill();
		ctx.restore();
	}
	update(){
		this.draw();
		this.x += this.dx;
		this.y += this.dy;
		this.alpha -= 0.01;
		
	}
}
//CREATE PLAYER.....................
let player = new Player(innerWidth/2,innerHeight/2,20,"#f6d912");
//STAR..............................
for (var i = 0;i <= 500;i++) {
	stars.push(new Player(Math.random()*innerWidth,Math.random()*innerHeight,Math.random()*1,"#fff"));
}
//CREATE ENEMY...................................
function createEnemy(){
	setInterval(() => {
		let radius = Math.random() * (30-5)+5;
		if (Math.random()<0.5) {
			x = Math.random()<0.5 ? 0-radius : innerWidth-radius;
			y = Math.random() * innerHeight;
		}else{
			x = Math.random() * innerWidth;
			y = Math.random()<0.5 ? 0-radius : innerHeight-radius;
		}
		let a = Math.atan2(innerHeight/2 - y,innerWidth/2 - x);
		velocityE.x = Math.cos(a);
		velocityE.y = Math.sin(a);
		enemys.push(new Enemy(x,y,radius,velocityE.x,velocityE.y,randomColor(color)));
	},1000);
}
function sound(a){
	let audio = new Audio(a);
	audio.play();
}


// //CREATE PARTICLE FUNCTION...................................
// function createParticle(){
// 	setInterval(() => {
// 		let radius = Math.random() * (30-5)+5;
// 		if (Math.random()<0.5) {
// 			x = Math.random()<0.5 ? 0-radius : innerWidth-radius;
// 			y = Math.random() * innerHeight;
// 		}else{
// 			x = Math.random() * innerWidth;
// 			y = Math.random()<0.5 ? 0-radius : innerHeight-radius;
// 		}
// 		let a = Math.atan2(innerHeight/2 - y,innerWidth/2 - x);
// 		velocityE.x = Math.cos(a);
// 		velocityE.y = Math.sin(a);
// 		enemys.push(new Enemy(x,y,radius,velocityE.x,velocityE.y,randomColor(color)));
// 	},1000);
// }

let animation;
//FRAME FUNCTION...................................
function animate(){
	animation = requestAnimationFrame(animate);
	//CLEAR SCREEN PER FRAME...............................
	ctx.fillStyle = 'rgba(0,0,0,0.1)';
	ctx.fillRect(0,0,innerWidth,innerHeight);
	gameOverScore.innerHTML = scr;
	//UPDATE PLAYER........................................
	player.update();
	for (var i = 0;i < stars.length;i++) {
			stars[i].draw();
		}
	//UPDATE BULLETS........................................
	bullets.forEach((bullet)=>{ 
		bullet.update();
		//REMOVE BULLETS FROM OUT OF FRAME......................
		if (bullet.x+bullet.r > innerWidth || bullet.x-bullet.r < 0 || bullet.y-bullet.r > innerHeight || bullet.y+bullet.r < 0) {
			setTimeout(()=>{
				bullets.splice(bullet,1);
			},0);
		}
	});

	//COLUTION FUNCTIONALITY................................
	enemys.forEach((enemy,indexEnem) => {
		enemy.update()
		const disBtnEnmAndPlyr = Math.hypot((player.x-enemy.x),(player.y-enemy.y));
		if (disBtnEnmAndPlyr - (player.r + enemy.r) < 1) {
			//END THE GAME..................................
			cancelAnimationFrame(animation);
			startGame.style.display = 'flex';

		}
		bullets.forEach((bullet,indexBullet) =>{
			const disBtnEnmAndBull = Math.hypot((bullet.x - enemy.x),(bullet.y - enemy.y));
			if (disBtnEnmAndBull - (enemy.r + bullet.r) < 1) {
				for (var i = 0; i <20; i++) {
					let x = enemy.x;
					let y = enemy.y;
					let r = Math.random()*2;
					if (Math.random()<0.5) {
						gox = Math.random()<0.5 ? 0-r : innerWidth-r;
						goy = Math.random() * innerHeight;
					}else{
						gox = Math.random() * innerWidth;
						goy = Math.random()<0.5 ? 0-r : innerHeight-r;
					}
					let a = Math.atan2(goy - y,gox - x);
					let dx = Math.cos(a) * Math.random()*2;
					let dy = Math.sin(a) * Math.random()*2;
					let color = enemy.c;
					particles.push(new Particle(x,y,r,dx,dy,color));
				}
				if (enemy.r-10 > 10) {
					gsap.to(enemy,{
						radius : enemy.r-=10
					})
					bullets.splice(indexBullet,1);
					scr += 5;
				}else{
					setTimeout(() => {
						sound('src/blast.mp3');
						enemys.splice(indexEnem,1);
						bullets.splice(indexBullet,1);
						scr += 5;
					},0);
				}
			}
		});
	});
	particles.forEach((particle,index) =>{
		if (particle.alpha <= 0) {
			particles.splice(index,1);
		}else{
			particle.update();
		}
		
	});
	score.innerHTML = 'Score: '+scr;
	
	
}
//ONCLICK EVENT......................
addEventListener('click', (e)=>{
	//CREATE BULLETS....................
	let angle = Math.atan2(e.clientY-innerHeight/2, e.clientX-innerWidth/2);
	velocity.x = Math.cos(angle);
	velocity.y = Math.sin(angle);
	
	bullets.push(new Bullet(innerWidth/2,innerHeight/2,5,velocity.x*5,velocity.y*5,"#00ffff"));
	sound('src/bulletsound.mp3');
});


//FUNCTIONS DECLEARATION...........................
startGameBtn.addEventListener('click', (e)=>{
	init();
	animate();
	sound('src/bgSound.mp3')
	createEnemy();
	startGame.style.display = 'none';
})
window.addEventListener('resize',()=>{
	init();
})
// stars..................................................
function menuToggle(){
		btn.classList.toggle("extand2");
}
function iconToggle(){
	if(btn.innerHTML == '<i class="fas fa-play"></i>'){
		btn.innerHTML = '<i class="fas fa-pause"></i>';
		animate();
	}else{
		btn.innerHTML = '<i class="fas fa-play"></i>';
		cancelAnimationFrame(animation);
	}
}