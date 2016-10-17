var c = document.getElementById('lightning'),
      ctx = c.getContext('2d'),
      cw = c.width = window.innerWidth,
      ch = c.height = window.innerHeight,
      lightnings = [],
      count = 1,
      full = false,
      tick = 0,
      startHue = 200;

function rand(min, max){
  return Math.random()*( max - min ) + min;
}

function Lightning(x, y, angle, vel, hue){
  var move = 15;
   this.x = x + rand(-move, move);
   this.y = y + rand(-move, move);
   this.points = [];
   this.life = 1;
   this.decay = .0015;
   this.dead = false;
   this.angle = angle != undefined ? angle : rand(0, Math.PI * 1);
   this.vel = vel != undefined ? angle : rand(-4, 4);
   this.hue = hue != undefined ? hue : startHue;
   this.spread = 0;
   this.points.push({
    x: this.x,
    y: this.y
   })
}

Lightning.prototype.step = function(i){
  this.life -= this.decay;
  if( this.life <= 0 ){
    this.dead = true;
  }
  if( !this.dead ){
    var endPoint = this.points[ this.points.length -1 ];
    this.points.push({
      x: endPoint.x + Math.cos(this.angle) * this.vel,
      y: endPoint.y + Math.sin(this.angle) * this.vel
    });
    this.angle += rand(-this.spread, this.spread );
    this.vel = .99* this.vel;
    this.spread = this.vel * .04;
    // this.hue += .3;
  }else{
    lightnings.splice( i, 1 );
  }
}

Lightning.prototype.draw = function(){
  if( !this.points.length || this.dead ){
    return false;
  }
  var i = this.points.length - 1,
        currentPoint = this.points[i],
        lastPoint = this.points[i-1];
  if(lastPoint){
    var jitter = 2+ this.life * 1;
    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(currentPoint.x + rand( -jitter, jitter ), currentPoint.y + rand( -jitter, jitter ) );
    ctx.lineWidth = 1;
    var alpha = this.life * .7;
    ctx.strokeStyle = 'hsla(' + this.hue + ', 70%, 30%, ' + alpha + ')';
    ctx.stroke();
  }
}

function init(){
  reset();
  loop();
}

function reset(){
  var cx = cw / 2;
  var cy = ch / 2;
  lightnings.length = 0;
  tick = 0;
  for(var i = 0; i < 500; i++){
    lightnings.push(new Lightning(cx, cy));
  }
}

function loop(){
  requestAnimationFrame(loop);
  step();
  draw();
}

function step(){
    var i = lightnings.length;
    while( i-- ){
      lightnings[i].step(i);
    }
}

function draw(){
  var i = lightnings.length;
  ctx.globalCompositeOperation = 'lighter';
  while( i--){
    lightnings[i].draw();   
  }
}

window.addEventListener('click', function(){
  ctx.clearRect(0,0,cw, ch);
  reset();
})

init();








