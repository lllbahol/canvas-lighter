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


function Lightning(x, y, life, tick,  angle, vel, hue){
  var move = 15;
   this.x = x + rand(-move, move);
   this.y = y + rand(-move, move);
   this.points = [];
   this.life = life != undefined ? life : 1;
   this.tick = tick != undefined ? tick : 1;
   this.decay = .09;
   this.dead = false;
   this.angle = angle != undefined ? angle : rand(0, Math.PI * 1);
   this.vel = vel != undefined ? vel : rand(-10, 10);
   this.hue = hue != undefined ? hue : startHue;
   this.spread = 0;
   this.width = Math.pow(2, rand(-7, 1))
   this.points.push({
    x: this.x,
    y: this.y
   })
}

Lightning.prototype.step = function(i){
  this.life -= this.decay;
  if( this.life <= 0 ){
    this.dead = true;
    ctx.globalCompositeOperation = 'destination-out';
     ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
     ctx.fillRect(0, 0, cw, ch );
    addLightning();
  }
  if( !this.dead ){
    for(var t = 0; t < this.tick; t++ ){
      var endPoint = this.points[ this.points.length -1 ];
      var nextAngle =  this.angle + rand(0, Math.PI*0.8);
      var nextVel = this.vel * rand(0.01, 1);
      this.points.push({
        x: endPoint.x + Math.cos(nextAngle) * nextVel,
        y: endPoint.y + Math.sin(nextAngle) * nextVel
      });
      // console.log('tick', t, this.points.length)
    }
  }else{
    lightnings.splice( i, this.tick );
  }
}

Lightning.prototype.draw = function(){
  if( !this.points.length || this.dead ){
    return false;
  }
  for(var t = this.tick; t >=1; t--){
    var i = this.points.length - t,
          currentPoint = this.points[i],
          lastPoint = this.points[i-1];
    if(lastPoint){
      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(currentPoint.x, currentPoint.y);
      ctx.lineWidth = this.width;
      var alpha = this.life*0.9;
      ctx.strokeStyle = 'hsla(' + this.hue + ', 70%, 50%, ' + alpha + ')';
      ctx.stroke();
    }
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
  for(var i = 0; i < 1000; i++){
    lightnings.push(new Lightning(cx, cy, 1, 10));
  }
}

function addLightning(){
  var cx = cw / 2;
  var cy = ch / 2;
  lightnings.length = 0;
  tick = 0;
  var life = rand( 0.7, 1 );
  for(var i = 0; i < 300; i++){
    lightnings.push(new Lightning(cx, cy, life, 10));
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
  // clearInterval(interval);
  reset();
})

init();








