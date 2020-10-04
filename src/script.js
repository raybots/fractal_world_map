// voronoi js
function Point(e,t){this.x=e;this.y=t}function VEdge(e,t,n){this.left=t;this.right=n;this.start=e;this.end=null;this.f=(n.x-t.x)/(t.y-n.y);this.g=e.y-this.f*e.x;this.direction=new Point(n.y-t.y,-(n.x-t.x));this.B=new Point(e.x+this.direction.x,e.y+this.direction.y);this.intersected=false;this.iCounted=false;this.neighbour=null}function VEvent(e,t){this.point=e;this.pe=t;this.y=e.y;this.key=Math.random()*1e8;this.arch=null;this.value=0}function VParabola(e){this.cEvent=null;this.parent=null;this._left=null;this._right=null;this.site=e;this.isLeaf=this.site!=null}function VQueue(){this.q=new Array;this.i=0}function sortOnY(e,t){return e.y>t.y?1:-1}function VPolygon(){this.size=0;this.vertices=[];this.first=null;this.last=null}function Voronoi(){with(this){this.places=null;this.edges=null;this.cells=null;this.queue=new VQueue;this.width=0;this.heght=0;this.root=null;this.ly=0;this.lasty=0;this.fp=null}}function GetLineIntersection(e,t,n,r){var i=e.x-t.x,s=n.x-r.x;var o=e.y-t.y,u=n.y-r.y;var a=i*u-o*s;if(a==0)return null;var f=e.x*t.y-e.y*t.x;var l=n.x*r.y-n.y*r.x;var c=new Point(0,0);c.x=(f*s-i*l)/a;c.y=(f*u-o*l)/a;return c}Point.prototype.distance=function(e,t){return Math.sqrt((t.x-e.x)*(t.x-e.x)+(t.y-e.y)*(t.y-e.y))};VEvent.prototype.compare=function(e){return this.y>e.y?1:-1};VParabola.prototype={get left(){return this._left},get right(){return this._right},set left(e){this._left=e;e.parent=this},set right(e){this._right=e;e.parent=this}};VQueue.prototype.enqueue=function(e){this.q.push(e)};VQueue.prototype.dequeue=function(){this.q.sort(sortOnY);return this.q.pop()};VQueue.prototype.remove=function(e){var t=-1;for(this.i=0;this.i<this.q.length;this.i++){if(this.q[this.i]==e){t=this.i;break}}this.q.splice(t,1)};VQueue.prototype.isEmpty=function(){return this.q.length==0};VQueue.prototype.clear=function(e){this.q=[]};VPolygon.prototype.addRight=function(e){this.vertices.push(e);++this.size;this.last=e;if(this.size==1)this.first=e};VPolygon.prototype.addLeft=function(e){var t=this.vertices;this.vertices=[e];for(var n=0;n<t.length;n++)this.vertices.push(t[n]);++this.size;this.first=e;if(this.size==1)this.last=e};Voronoi.prototype.Compute=function(e,t,n){if(e.length<2)return[];this.root=null;this.places=e;this.edges=[];this.cells=[];this.width=t;this.height=n;this.queue.clear(true);for(i=0;i<this.places.length;i++){var r=new VEvent(this.places[i],true);var s=new VPolygon;this.places[i].cell=s;this.queue.enqueue(r);this.cells.push(s)}var o=Number.MAX_VALUE;var u=0;while(!this.queue.isEmpty()){var a=this.queue.dequeue();this.ly=a.point.y;if(a.pe)this.InsertParabola(a.point);else this.RemoveParabola(a);this.lasty=a.y}this.FinishEdge(this.root);for(i=0;i<this.edges.length;i++)if(this.edges[i].neighbour)this.edges[i].start=this.edges[i].neighbour.end};Voronoi.prototype.GetEdges=function(){return this.edges};Voronoi.prototype.GetCells=function(){return this.cells};Voronoi.prototype.InsertParabola=function(e){if(!this.root){this.root=new VParabola(e);this.fp=e;return}if(this.root.isLeaf&&this.root.site.y-e.y<.01){this.root.isLeaf=false;this.root.left=new VParabola(this.fp);this.root.right=new VParabola(e);var t=new Point((e.x+this.fp.x)/2,this.height);if(e.x>this.fp.x)this.root.edge=new VEdge(t,this.fp,e);else this.root.edge=new VEdge(t,e,this.fp);this.edges.push(this.root.edge);return}var n=this.GetParabolaByX(e.x);if(n.cEvent){this.queue.remove(n.cEvent);n.cEvent=null}var r=new Point(e.x,this.GetY(n.site,e.x));var i=new VEdge(r,n.site,e);var s=new VEdge(r,e,n.site);i.neighbour=s;this.edges.push(i);n.edge=s;n.isLeaf=false;var o=new VParabola(n.site);var u=new VParabola(e);var a=new VParabola(n.site);n.right=a;n.left=new VParabola;n.left.edge=i;n.left.left=o;n.left.right=u;this.CheckCircle(o);this.CheckCircle(a)};Voronoi.prototype.RemoveParabola=function(e){var t=e.arch;var n=this.GetLeftParent(t);var r=this.GetRightParent(t);var i=this.GetLeftChild(n);var s=this.GetRightChild(r);if(i.cEvent){this.queue.remove(i.cEvent);i.cEvent=null}if(s.cEvent){this.queue.remove(s.cEvent);s.cEvent=null}var o=new Point(e.point.x,this.GetY(t.site,e.point.x));if(i.site.cell.last==t.site.cell.first)t.site.cell.addLeft(o);else t.site.cell.addRight(o);i.site.cell.addRight(o);s.site.cell.addLeft(o);this.lasty=e.point.y;n.edge.end=o;r.edge.end=o;var u;var a=t;while(a!=this.root){a=a.parent;if(a==n){u=n}if(a==r){u=r}}u.edge=new VEdge(o,i.site,s.site);this.edges.push(u.edge);var f=t.parent.parent;if(t.parent.left==t){if(f.left==t.parent)f.left=t.parent.right;else t.parent.parent.right=t.parent.right}else{if(f.left==t.parent)f.left=t.parent.left;else f.right=t.parent.left}this.CheckCircle(i);this.CheckCircle(s)};Voronoi.prototype.FinishEdge=function(e){var t;if(e.edge.direction.x>0){t=Math.max(this.width,e.edge.start.x+10)}else{t=Math.min(0,e.edge.start.x-10)}e.edge.end=new Point(t,e.edge.f*t+e.edge.g);if(!e.left.isLeaf)this.FinishEdge(e.left);if(!e.right.isLeaf)this.FinishEdge(e.right)};Voronoi.prototype.GetXOfEdge=function(e,t){var n=this.GetLeftChild(e);var r=this.GetRightChild(e);var i=n.site;var s=r.site;var o=2*(i.y-t);var u=1/o;var a=-2*i.x/o;var f=t+o*.25+i.x*i.x/o;o=2*(s.y-t);var l=1/o;var c=-2*s.x/o;var h=t+o*.25+s.x*s.x/o;var p=u-l;var d=a-c;var v=f-h;var m=d*d-4*p*v;var g=(-d+Math.sqrt(m))/(2*p);var y=(-d-Math.sqrt(m))/(2*p);var b;if(i.y<s.y)b=Math.max(g,y);else b=Math.min(g,y);return b};Voronoi.prototype.GetParabolaByX=function(e){var t=this.root;var n=0;while(!t.isLeaf){n=this.GetXOfEdge(t,this.ly);if(n>e)t=t.left;else t=t.right}return t};Voronoi.prototype.GetY=function(e,t){var n=2*(e.y-this.ly);var r=-2*e.x/n;var i=this.ly+n/4+e.x*e.x/n;return t*t/n+r*t+i};Voronoi.prototype.CheckCircle=function(e){var t=this.GetLeftParent(e);var n=this.GetRightParent(e);var r=this.GetLeftChild(t);var i=this.GetRightChild(n);if(!r||!i||r.site==i.site)return;var s=this.GetEdgeIntersection(t.edge,n.edge);if(!s)return;var o=Point.prototype.distance(r.site,s);if(s.y-o>=this.ly)return;var u=new VEvent(new Point(s.x,s.y-o),false);e.cEvent=u;u.arch=e;this.queue.enqueue(u)};Voronoi.prototype.GetEdgeIntersection=function(e,t){var n=GetLineIntersection(e.start,e.B,t.start,t.B);var r=(n.x-e.start.x)*e.direction.x<0||(n.y-e.start.y)*e.direction.y<0||(n.x-t.start.x)*t.direction.x<0||(n.y-t.start.y)*t.direction.y<0;if(r)return null;return n};Voronoi.prototype.GetLeft=function(e){return this.GetLeftChild(this.GetLeftParent(e))};Voronoi.prototype.GetRight=function(e){return this.GetRightChild(this.GetRightParent(e))};Voronoi.prototype.GetLeftParent=function(e){var t=e.parent;var n=e;while(t.left==n){if(!t.parent)return null;n=t;t=t.parent}return t};Voronoi.prototype.GetRightParent=function(e){var t=e.parent;var n=e;while(t.right==n){if(!t.parent)return null;n=t;t=t.parent}return t};Voronoi.prototype.GetLeftChild=function(e){if(!e)return null;var t=e.left;while(!t.isLeaf)t=t.right;return t};Voronoi.prototype.GetRightChild=function(e){if(!e)return null;var t=e.right;while(!t.isLeaf)t=t.left;return t};

/*! simplex-noise.js: copyright 2012 Jonas Wagner, licensed under a MIT license. See https://github.com/jwagner/simplex-noise.js for details */
(function(){function o(e){e||(e=Math.random),this.p=new Uint8Array(256),this.perm=new Uint8Array(512),this.permMod12=new Uint8Array(512);for(var t=0;t<256;t++)this.p[t]=e()*256;for(t=0;t<512;t++)this.perm[t]=this.p[t&255],this.permMod12[t]=this.perm[t]%12}var e=.5*(Math.sqrt(3)-1),t=(3-Math.sqrt(3))/6,n=1/3,r=1/6,i=(Math.sqrt(5)-1)/4,s=(5-Math.sqrt(5))/20;o.prototype={grad3:new Float32Array([1,1,0,-1,1,0,1,-1,0,-1,-1,0,1,0,1,-1,0,1,1,0,-1,-1,0,-1,0,1,1,0,-1,1,0,1,-1,0,-1,-1]),grad4:new Float32Array([0,1,1,1,0,1,1,-1,0,1,-1,1,0,1,-1,-1,0,-1,1,1,0,-1,1,-1,0,-1,-1,1,0,-1,-1,-1,1,0,1,1,1,0,1,-1,1,0,-1,1,1,0,-1,-1,-1,0,1,1,-1,0,1,-1,-1,0,-1,1,-1,0,-1,-1,1,1,0,1,1,1,0,-1,1,-1,0,1,1,-1,0,-1,-1,1,0,1,-1,1,0,-1,-1,-1,0,1,-1,-1,0,-1,1,1,1,0,1,1,-1,0,1,-1,1,0,1,-1,-1,0,-1,1,1,0,-1,1,-1,0,-1,-1,1,0,-1,-1,-1,0]),noise2D:function(n,r){var i=this.permMod12,s=this.perm,o=this.grad3,u,a,f,l=(n+r)*e,c=Math.floor(n+l),h=Math.floor(r+l),p=(c+h)*t,d=c-p,v=h-p,m=n-d,g=r-v,y,b;m>g?(y=1,b=0):(y=0,b=1);var w=m-y+t,E=g-b+t,S=m-1+2*t,x=g-1+2*t,T=c&255,N=h&255,C=.5-m*m-g*g;if(C<0)u=0;else{var k=i[T+s[N]]*3;C*=C,u=C*C*(o[k]*m+o[k+1]*g)}var L=.5-w*w-E*E;if(L<0)a=0;else{var A=i[T+y+s[N+b]]*3;L*=L,a=L*L*(o[A]*w+o[A+1]*E)}var O=.5-S*S-x*x;if(O<0)f=0;else{var M=i[T+1+s[N+1]]*3;O*=O,f=O*O*(o[M]*S+o[M+1]*x)}return 70*(u+a+f)},noise3D:function(e,t,i){var s=this.permMod12,o=this.perm,u=this.grad3,a,f,l,c,h=(e+t+i)*n,p=Math.floor(e+h),d=Math.floor(t+h),v=Math.floor(i+h),m=(p+d+v)*r,g=p-m,y=d-m,b=v-m,w=e-g,E=t-y,S=i-b,x,T,N,C,k,L;w<E?E<S?(x=0,T=0,N=1,C=0,k=1,L=1):w<S?(x=0,T=1,N=0,C=0,k=1,L=1):(x=0,T=1,N=0,C=1,k=1,L=0):E<S?w<S?(x=0,T=0,N=1,C=1,k=0,L=1):(x=1,T=0,N=0,C=1,k=0,L=1):(x=1,T=0,N=0,C=1,k=1,L=0);var A=w-x+r,O=E-T+r,M=S-N+r,_=w-C+2*r,D=E-k+2*r,P=S-L+2*r,H=w-1+3*r,B=E-1+3*r,j=S-1+3*r,F=p&255,I=d&255,q=v&255,R=.6-w*w-E*E-S*S;if(R<0)a=0;else{var U=s[F+o[I+o[q]]]*3;R*=R,a=R*R*(u[U]*w+u[U+1]*E+u[U+2]*S)}var z=.6-A*A-O*O-M*M;if(z<0)f=0;else{var W=s[F+x+o[I+T+o[q+N]]]*3;z*=z,f=z*z*(u[W]*A+u[W+1]*O+u[W+2]*M)}var X=.6-_*_-D*D-P*P;if(X<0)l=0;else{var V=s[F+C+o[I+k+o[q+L]]]*3;X*=X,l=X*X*(u[V]*_+u[V+1]*D+u[V+2]*P)}var $=.6-H*H-B*B-j*j;if($<0)c=0;else{var J=s[F+1+o[I+1+o[q+1]]]*3;$*=$,c=$*$*(u[J]*H+u[J+1]*B+u[J+2]*j)}return 32*(a+f+l+c)},noise4D:function(e,t,n,r){var o=this.permMod12,u=this.perm,a=this.grad4,f,l,c,h,p,d=(e+t+n+r)*i,v=Math.floor(e+d),m=Math.floor(t+d),g=Math.floor(n+d),y=Math.floor(r+d),b=(v+m+g+y)*s,w=v-b,E=m-b,S=g-b,x=y-b,T=e-w,N=t-E,C=n-S,k=r-x,L=0,A=0,O=0,M=0;T>N?L++:A++,T>C?L++:O++,T>k?L++:M++,N>C?A++:O++,N>k?A++:M++,C>k?O++:M++;var _,D,P,H,B,j,F,I,q,R,U,z;_=L<3?0:1,D=A<3?0:1,P=O<3?0:1,H=M<3?0:1,B=L<2?0:1,j=A<2?0:1,F=O<2?0:1,I=M<2?0:1,q=L<1?0:1,R=A<1?0:1,U=O<1?0:1,z=M<1?0:1;var W=T-_+s,X=N-D+s,V=C-P+s,$=k-H+s,J=T-B+2*s,K=N-j+2*s,Q=C-F+2*s,G=k-I+2*s,Y=T-q+3*s,Z=N-R+3*s,et=C-U+3*s,tt=k-z+3*s,nt=T-1+4*s,rt=N-1+4*s,it=C-1+4*s,st=k-1+4*s,ot=v&255,ut=m&255,at=g&255,ft=y&255,lt=.6-T*T-N*N-C*C-k*k;if(lt<0)f=0;else{var ct=u[ot+u[ut+u[at+u[ft]]]]%32*4;lt*=lt,f=lt*lt*(a[ct]*T+a[ct+1]*N+a[ct+2]*C+a[ct+3]*k)}var ht=.6-W*W-X*X-V*V-$*$;if(ht<0)l=0;else{var pt=u[ot+_+u[ut+D+u[at+P+u[ft+H]]]]%32*4;ht*=ht,l=ht*ht*(a[pt]*W+a[pt+1]*X+a[pt+2]*V+a[pt+3]*$)}var dt=.6-J*J-K*K-Q*Q-G*G;if(dt<0)c=0;else{var vt=u[ot+B+u[ut+j+u[at+F+u[ft+I]]]]%32*4;dt*=dt,c=dt*dt*(a[vt]*J+a[vt+1]*K+a[vt+2]*Q+a[vt+3]*G)}var mt=.6-Y*Y-Z*Z-et*et-tt*tt;if(mt<0)h=0;else{var gt=u[ot+q+u[ut+R+u[at+U+u[ft+z]]]]%32*4;mt*=mt,h=mt*mt*(a[gt]*Y+a[gt+1]*Z+a[gt+2]*et+a[gt+3]*tt)}var yt=.6-nt*nt-rt*rt-it*it-st*st;if(yt<0)p=0;else{var bt=u[ot+1+u[ut+1+u[at+1+u[ft+1]]]]%32*4;yt*=yt,p=yt*yt*(a[bt]*nt+a[bt+1]*rt+a[bt+2]*it+a[bt+3]*st)}return 27*(f+l+c+h+p)}},typeof define!="undefined"&&define.amd?define(function(){return o}):typeof window!="undefined"&&(window.SimplexNoise=o),typeof exports!="undefined"&&(exports.SimplexNoise=o),typeof module!="undefined"&&(module.exports=o)})();

var INIT_WIDTH = 10;
var INIT_HEIGHT = 10;
// 29% of land covers the Earth
var LAND_CHANCE = 25;
//15% forest looks okay
var FOREST_CHANCE = 0;
var FRACTAL_REPEAT = 6;
var CELL_AUT_REPEAT = 1;
var CELL_AUT_MIN = 3;
var LAND = "x";
var FOREST = "|";
var HILL = "T";
var WATER = "&nbsp;";
var MODE = 2;
var MAP_ID = 0;
var SHOW_STEPS = true;
var SCALE_CANVAS = true;
var CUSTOM_MAP = false;
var NOISE_CREATED = false;

var LONG_MOUNTAINS = false;
var voronoi = true;
var delaunay = false;
var colors = [];
var v = null;
var w = 640;
var h = 640;
var points = [];

$(document).ready(function(){

var yArray = [];

for (var y = 0; y < INIT_HEIGHT; y++)
{

	var xArray = [];

	for (var x = 0; x < INIT_WIDTH; x++)
	{
		if (CUSTOM_MAP)
			xArray.push(0);
		else
			xArray.push(placeLand());
	}

	yArray.push(xArray);	
}

if (CUSTOM_MAP)
{
// island
yArray[1][1] = 1;
yArray[1][6] = 1;
yArray[1][7] = 1;
yArray[2][8] = 1;

yArray[3][2] = 1;
yArray[3][3] = 1;
yArray[3][7] = 1;

yArray[4][2] = 1;
yArray[4][3] = 1;
yArray[4][4] = 1;
yArray[4][5] = 1;
yArray[4][6] = 1;
yArray[4][7] = 1;

yArray[5][2] = 1;
yArray[5][3] = 1;
yArray[5][4] = 1;
yArray[5][5] = 1;
yArray[5][6] = 1;
yArray[5][7] = 1;

yArray[6][3] = 1;
yArray[6][4] = 1;
yArray[6][5] = 1;
yArray[6][6] = 1;
yArray[6][8] = 1;

}
else
{
	// place water around edges
	for (var y = 0; y < INIT_HEIGHT; y++)
	{
		yArray[y][0] = 0;
	    yArray[y][INIT_HEIGHT-1] = 0;	
	}	

	for (var x = 0; x < INIT_WIDTH; x++)
	{
		yArray[0][x] = 0;
	    yArray[INIT_WIDTH-1][x] = 0;	
	}
}	

if (SHOW_STEPS)
	draw(yArray);

for (var i = 0; i < FRACTAL_REPEAT; i++)
{
	if (i == 2)
	{
		yArray = plantForest(yArray);

		if (SHOW_STEPS)
			draw(yArray);
	}

	yArray = refine(yArray);

	yArray = cull(yArray, 1);
	
	if (SHOW_STEPS)
		draw(yArray)
}

// cellular automata to remove jags
for (var i = 0; i < CELL_AUT_REPEAT; i++)
{	
	yArray = cull(yArray, 2);
}

if (SHOW_STEPS)
	draw(yArray)


if (LONG_MOUNTAINS)
{
	var hillNoiseArray = getHillNoise(yArray.length, yArray[0].length);
		
	if (SHOW_STEPS)	
		drawNoise(hillNoiseArray);

	yArray = plantHill(yArray, hillNoiseArray);


	//yArray = insertLine(0,0,400,400,yArray,3)

	draw(yArray);
}

// begin natural heat map //
var heightNoiseArray = getNaturalHeat(yArray.length, yArray[0].length);

if (SHOW_STEPS)	
	drawNoise(heightNoiseArray);
	
heatMap = createHeightMap(yArray, heightNoiseArray);	

drawNoise(heatMap);
// end natural heat map //

// begin temperature map creation //
var heightNoiseArray = getHeightNoiseBig(yArray.length, yArray[0].length);

if (SHOW_STEPS)	
	drawNoise(heightNoiseArray);
	
loveMap = createHeightMap(yArray, heightNoiseArray);	

drawNoise(loveMap);
// end temperature map //

// begin dry map creation //
var heightNoiseArray = getHeightNoiseBig(yArray.length, yArray[0].length);

if (SHOW_STEPS)	
	drawNoise(heightNoiseArray);
	
lifeMap = createHeightMap(yArray, heightNoiseArray);	

drawNoise(lifeMap);
// end temperature map //




drawFull(loveMap, lifeMap, heatMap);

if (voronoi || delaunay)
{
	var voronoiDiagram = createVoronoi(yArray);

	draw(voronoiDiagram);

	yArray = addOverlay(yArray, voronoiDiagram);

	draw(yArray);

}

});

function addOverlay(yArrayOld, overlayArray)
{
	var newWidth= yArrayOld[0].length;
	var newHeight = yArrayOld.length;
	
	var yArray = []
	
	// init
	for (var y = 0; y < newHeight; y++)
	{
		yArray.push([]);

		for (var x = 0; x < newWidth; x++)
		{
			yArray[y].push(yArrayOld[y][x]);

			if (overlayArray[y][x] > 0)
			{
				yArray[y][x] = overlayArray[y][x];
			}		
		}
	}
	
	return yArray;	
}

function createVoronoi(yArrayOld)
{
	var newWidth= yArrayOld[0].length;
	var newHeight = yArrayOld.length;

	v = new Voronoi();

	// init
	for (var y = 0; y < newHeight; y++)
	{

		for (var x = 0; x < newWidth; x++)
		{
			if (yArrayOld[y][x] == 1 || yArrayOld[y][x] == 2)
			{
				if ( dice(10000) == 1 )
				{
					points.push( new Point(x, y) );
					colors.push(rndCol());
				}
			}		
		}
	}	
	
	// random points anywhere on the map
	/*
	for(i = 0; i < 20; i++)
	{
		points.push( new Point(Math.round(Math.random() * newWidth), Math.round(Math.random() * newHeight)) );
		colors.push(rndCol());
	}
	*/

	var yArray = []
	
	// init
	for (var y = 0; y < newHeight; y++)
	{
		yArray.push([]);

		for (var x = 0; x < newWidth; x++)
		{
			yArray[y].push(0);			
		}
	}
	
	v.Compute(points, newWidth, newHeight);
	edges = v.GetEdges();
	cells = v.GetCells();
	

	for(var i=0; i<cells.length; i++)
	{
		var p = cells[i].vertices;
		if(p.length == 0) continue;
		if(p.length == 4)
		{
			//console.log(cells[i].vs);
			//console.log(p);
		}
		
		/*
		c.fillStyle = colors[i];
		c.beginPath();
		c.moveTo(p[0].x, p[0].y);
		for(var j=1; j<p.length; j++) c.lineTo(p[j].x, p[j].y);
		c.closePath();
		c.fill();
		*/
	}
	

	if(delaunay)
	{
			//c.lineWidth = 3;
			//c.strokeStyle = "#888888";
			for(i=0; i<edges.length; i++)
			{
				var e = edges[i];
				//c.beginPath();
				//c.moveTo(e.left.x, e.left.y);
				//c.lineTo(e.right.x, e.right.y);
				//c.closePath();
				//c.stroke();

				yArray = insertLine(Math.round(e.left.x), Math.round(e.left.y), Math.round(e.right.x), Math.round(e.right.y), yArray,5);
			}
	}						
	
	if (voronoi)
	{
		for(i = 0; i < edges.length; i++)
		{
			var e = edges[i];
			//c.moveTo(e.start.x, e.start.y);
			//c.lineTo(e.end.x, e.end.y);

			yArray = insertLine(Math.round(e.start.x),Math.round(e.start.y),Math.round(e.end.x),Math.round(e.end.y),yArray,4);
		}
	}
	
	return yArray;
	
}
function rndCol() {
	var letters = '0123456789ABCDEF'.split('');
	var color = '#';
	for (var i = 0; i < 6; i++ ) {
		color += letters[Math.round(Math.random() * 15)];
	}
	return color;
}

function insertLine(x0, y0, x1, y1, yArrayOld, num)
{
	var newWidth= yArrayOld[0].length;
	var newHeight = yArrayOld.length;
	
	var yArray = []
	
	// init
	for (var y = 0; y < newHeight; y++)
	{
		yArray.push([]);

		for (var x = 0; x < newWidth; x++)
		{
			yArray[y].push(yArrayOld[y][x]);			
		}
	}

   var dx = Math.abs(x1-x0);
   var dy = Math.abs(y1-y0);
   var sx = (x0 < x1) ? 1 : -1;
   var sy = (y0 < y1) ? 1 : -1;
   var err = dx-dy;

   while(true){
   
	// only draw within bounds - need to check for voronoi diagram
	if (y0 >= 0 && y0< yArrayOld.length && x0 >= 0 && x0< yArrayOld[0].length)
	{
		 yArray[y0][x0] = num;
	}
	
	 //setPixel(x0,y0);  // Do what you need to for this

	 if ((x0==x1) && (y0==y1)) break;
	 var e2 = 2*err;
	 if (e2 >-dy){ err -= dy; x0  += sx; }
	 if (e2 < dx){ err += dx; y0  += sy; }

   }
   
   return yArray;
}

function createHeightMap(yArrayOld, noiseMap)
{
	var newWidth= yArrayOld[0].length;
	var newHeight = yArrayOld.length;
	
	var yArray = []
	
	// init
	for (var y = 0; y < newHeight; y++)
	{
		yArray.push([]);

		for (var x = 0; x < newWidth; x++)
		{
			yArray[y].push(yArrayOld[y][x]);

			if (yArrayOld[y][x] == 1 || yArrayOld[y][x] == 2 || yArrayOld[y][x] == 3)
			{
				yArray[y][x] = noiseMap[y][x];
			}		
			else
			{
				yArray[y][x] = null;
			}
		}
	}
	
	return yArray;	
}

function getNaturalHeat(height, width)
{
	var NOISE_CREATED = false;
	var yArray = []
	
	// init
	for (var y = 0; y < width; y++)
	{
		yArray.push([]);

		for (var x = 0; x < height; x++)
		{
			yArray[y].push(0);
		}
	}		

	yArray = createNoise(yArray, 1, 0.5, 1);
	yArray = createNoise(yArray, 2, 0.5, 1);
	yArray = createNoise(yArray, 4, 0.5, 1);
	yArray = createNoise(yArray, 8, 0.5, 1);
	yArray = createNoise(yArray, 16, 0.5, 1);
	yArray = createNoise(yArray, 32, 0.5, 1);
	yArray = createNoise(yArray, 64, 0.5, 1);
	yArray = createNoise(yArray, 128, 0.5, 1);

	var halfHeight = Math.round(height / 2);

	for (var y = 0; y < halfHeight; y++)
	{
		for (var x = 0; x < width; x++)
		{
			var val = 1 * (y / height);
			yArray[y][x] = val + (yArray[y][x] * 0.4);
		}
	}

	for (var y = halfHeight; y < height; y++)
	{
		for (var x = 0; x < width; x++)
		{
			var val = 1 - (1 * (y / height));
			yArray[y][x] = val + (yArray[y][x] * 0.4); 
		}
	}	
	
	return yArray;	
}

function getHeightNoiseBig(height, width)
{
	var NOISE_CREATED = false;
	var yArray = []
	
	// init
	for (var y = 0; y < width; y++)
	{
		yArray.push([]);

		for (var x = 0; x < height; x++)
		{
			yArray[y].push(0);
		}
	}
	
	yArray = createNoise(yArray, 64, 0.5, 1);
	yArray = createNoise(yArray, 128, 0.5, 1);
	yArray = createNoise(yArray, 256, 0.5, 1);

	
	return yArray;	
}

function getHeightNoise(height, width)
{
	var NOISE_CREATED = false;
	var yArray = []
	
	// init
	for (var y = 0; y < width; y++)
	{
		yArray.push([]);

		for (var x = 0; x < height; x++)
		{
			yArray[y].push(0);
		}
	}
	
	yArray = createNoise(yArray, 1, 0.5, 1);
	yArray = createNoise(yArray, 2, 0.5, 1);
	yArray = createNoise(yArray, 4, 0.5, 1);
	yArray = createNoise(yArray, 8, 0.5, 1);
	yArray = createNoise(yArray, 16, 0.5, 1);
	yArray = createNoise(yArray, 32, 0.5, 1);
	yArray = createNoise(yArray, 64, 0.5, 1);
	yArray = createNoise(yArray, 128, 0.5, 1);
	
	return yArray;	
}

function getHillNoise(height, width)
{
	var NOISE_CREATED = false;
	var yArray = []
	
	// init
	for (var y = 0; y < width; y++)
	{
		yArray.push([]);

		for (var x = 0; x < height; x++)
		{
			yArray[y].push(0);
		}
	}

	
	yArray = createNoise(yArray, 512, 20, 4);

	//yArray = createNoise(yArray, 128, 20, 2);		

	
	return yArray;	
}

function createNoise(yArrayOld, size, persistence, type)
{

	var simplex = new SimplexNoise();

	var t = 0;

	var newWidth= yArrayOld[0].length;
	var newHeight = yArrayOld.length;
	
	var yArray = []
	
	// init
	for (var y = 0; y < newHeight; y++)
	{
		yArray.push([]);

		for (var x = 0; x < newWidth; x++)
		{
			yArray[y].push(yArrayOld[y][x]);

	        var noise = simplex.noise2D(x / size, y / size) * persistence + 0.5;
	        //var g = simplex.noise3D(x / 8, y / 8, t/16) * 0.5 + 0.5;

	        if (type == 1)
	        {
		        // standard brain pattern

		        //noise = noise;
	        }
	        else if (type == 2)
	        {
		        // cos function creates circles
				noise = (Math.cos(noise));
			}
	        else if (type == 3)
	        {
	        	// mixe of above

	        	var num = Math.round(noise);
		        // cos function creates circles

		        if (num == 1)
					noise = (Math.cos(noise * 20));
			}
	        else if (type == 4)
	        {
	        	// thin lines, like mountain ranges
				noise =  2 / noise;
			}							

			if (NOISE_CREATED)
				yArray[y][x] = (noise + yArrayOld[y][x]) / 2;
			else
			{
				yArray[y][x] = noise;
				NOISE_CREATED = true;
			}

		}
	}
	
	return yArray;	
}

function plantHill(yArrayOld, noiseArray)
{
	var newWidth= yArrayOld[0].length;
	var newHeight = yArrayOld.length;
	
	var yArray = []
	
	// init
	for (var y = 0; y < newHeight; y++)
	{
		yArray.push([]);

		for (var x = 0; x < newWidth; x++)
		{
			yArray[y].push(yArrayOld[y][x]);

			if (yArrayOld[y][x] == 1 || yArrayOld[y][x] == 2)
			{
				if (noiseArray[y][x] >= 0.5)
				{
					yArray[y][x] = 3;
				}	
			}			
		}
	}
	
	return yArray;	
}

function plantForest(yArrayOld)
{
	var newWidth= yArrayOld[0].length;
	var newHeight = yArrayOld.length;
	
	var yArray = []
	
	// init
	for (var y = 0; y < newHeight; y++)
	{
		yArray.push([]);

		for (var x = 0; x < newWidth; x++)
		{
			yArray[y].push(yArrayOld[y][x]);

			if (yArrayOld[y][x] == 1)
			{
				if ( dice(100) <= FOREST_CHANCE )
					yArray[y][x] = 2;
			}		
		}
	}
	
	return yArray;
}

function cull(yArrayOld, type)
{
	var newWidth= yArrayOld[0].length;
	var newHeight = yArrayOld.length;
	
	var yArray = []
	
	// init
	for (var y = 0; y < newHeight; y++)
	{
		yArray.push([]);

		for (var x = 0; x < newWidth; x++)
		{
			yArray[y].push(yArrayOld[y][x]);

			var landCount = 0;
			var forestCount = 0;
			var hillCount = 0;
		
			for (var yCheck = y - 1; yCheck < (y + 2); yCheck++)
			{
				for (var xCheck = x - 1; xCheck < (x + 2); xCheck++)
				{
					if (yCheck >= 0 && yCheck < yArrayOld.length && xCheck >= 0 && xCheck < yArrayOld[y].length)
					{
						if (yArrayOld[yCheck][xCheck] == 1 || yArrayOld[yCheck][xCheck] == 2 ||  yArrayOld[yCheck][xCheck] == 3)
							landCount++;

						if (yArrayOld[yCheck][xCheck] == 2)
							forestCount++;

						if (yArrayOld[yCheck][xCheck] == 3)
							hillCount++;													
					}
				}
			}

			// fractal vs cellular automata	
			if (type == 1)	
			{
					yArray[y][x] = 0;
					
					if (checkSurround(landCount) != -1)
						yArray[y][x] = 1

					if (checkSurround(forestCount) != -1)
						yArray[y][x] = 2;	

					if (checkSurround(hillCount) != -1)
						yArray[y][x] = 3;											
			}
			else if (type == 2)
			{
				if (landCount >=CELL_AUT_MIN )
					yArray[y][x] = 1;

				if (yArrayOld[y][x] == 2)
					yArray[y][x] = 2;	

				if (yArrayOld[y][x] == 3)
					yArray[y][x] = 3;					

			}
			else if (type == 3)
			{
				// smooth out mountains
				yArray[y][x] = yArrayOld[y][x];

				if (hillCount > 3)
					yArray[y][x] = 3;				
			}
			else if (type == 4)
			{
				if (landCount >=CELL_AUT_MIN )
					yArray[y][x] = 1;

				if (yArrayOld[y][x] == 2)
					yArray[y][x] = 2;	

				if (yArrayOld[y][x] == 3)
					yArray[y][x] = 3;				
			}

		}
	}

	return yArray;
}

function refine(yArrayOld)
{
	var newWidth= yArrayOld[0].length * 2;
	var newHeight = yArrayOld.length * 2;
	
	// init
	var yArray = []
	
	for (var y = 0; y < newHeight; y++)
	{
		yArray.push([]);

		for (var x = 0; x < newWidth; x++)
		{
			yArray[y].push(0);
		}
	}

	// creates four new squares for every old one
	for (var y = 0; y < yArrayOld.length; y++)
	{
		for (var x = 0; x < yArrayOld[y].length; x++)
		{	
			var tileType = yArrayOld[y][x];

			yArray[(y * 2)][(x * 2)] = tileType;
			yArray[(y * 2)][(x * 2) + 1] = tileType; 
			yArray[(y * 2) + 1][(x * 2)] = tileType;
			yArray[(y * 2) + 1][(x * 2) + 1] = tileType;	
		}
	}
	
	return yArray;

}

function drawFull(yArray, lifeArray, heatArray)
{	

	if (MODE == 1)
	{
    	var output = "Map Generated: "
    	output+= yArray[0].length + "x" + yArray.length + "<br/>";
    }	
    else
    {
		var width = yArray[0].length;
		var height = yArray.length;

		if (FRACTAL_REPEAT > 0 && SCALE_CANVAS)
		{
			var newWidth = INIT_WIDTH;
			var newHeight = INIT_HEIGHT;

			for (var i = 0; i < FRACTAL_REPEAT; i++)
			{
				newWidth*= 2;
				newHeight*= 2;
			}

			var squareWidth = newWidth / width;
			var squareHeight = newHeight/ height;

			this.element = jQuery('<canvas id="map_' + MAP_ID + '" width = ' + newWidth + ' height = ' + newHeight + '></canvas><br/>')
		}
		else
		{
			this.element = jQuery('<canvas id="map_' + MAP_ID + '" width = ' + width + ' height = ' + height + '></canvas><br/>')
		}

		MAP_ID++;

		jQuery("body").append(this.element);

		this.canvas = document.getElementById(this.element.attr('id'));

		this.ctx=this.canvas.getContext("2d");

		if (FRACTAL_REPEAT > 0 && SCALE_CANVAS)
			this.imgData = this.ctx.createImageData(newWidth, newHeight);		
		else
			this.imgData = this.ctx.createImageData(width, height);	

		var data = imgData.data;  // the array of RGBA values			
    }

	for (var y = 0; y < yArray.length; y++)
	{
		var xArray = yArray[y];

		for (var x = 0; x < xArray.length; x++)
		{

			if (MODE == 1)
			{
				if (yArray[y][x] >= 0.5)
				{
					output+=LAND;
				}							
				else
				{
					output+=WATER;
				}
			}			
			else
			{

				
				var red = null;
				var green = null;
				var blue = null;
				
				var love = yArray[y][x];
				var life = lifeArray[y][x];
				var heat = heatArray[y][x];

				// ice
				if (heat < 0.3)
				{
					red = 255;
					green = 255;
					blue = 255;					
				}

				// tundra
				if (heat >= 0.3 && heat < 0.35)
				{
					red = 100;
					green = 150;
					blue = 100;					
				}

				// dry earth
				if (heat > 0.65)
				{
					red = 104;
					green = 77;
					blue = 2;					
				}	

				// desert
				if (heat > 0.7)
				{
					red = 154;
					green = 114;
					blue = 3;					
				}			

				// forest
				if (heat >= 0.4 && heat < 0.55)
				{
					// average forest
					if (love > 0.4)
					{
						red = 0;
						green = 70;
						blue = 0;				
					}

					// elf forest
					if (love > 0.65)
					{
						red = 0;
						green = 60;
						blue = 0;				
					}

					// evil forest
					if (love < 0.25)
					{
						red = 0;
						green = 80;
						blue = 0;				
					}					

				}	

				// if nothing is assigned just paint it green
				if (!red && !green && !blue)
				{
					red = 0;
					green = 100;
					blue = 0;


				}


				// if nothing is assigned just paint it green
				if (!red && !green && !blue)
				{
					red = 0;
					green = 100;
					blue = 0;
				}	

				// water
				if (yArray[y][x] == null)
				{
					red = 0;
					green = 0;
					blue = 100;				
				}

				if (FRACTAL_REPEAT > 0 && SCALE_CANVAS)
				{
					var yPos = y * squareHeight;
					var xPos = x * squareWidth;

					// create a rect that will fit into the scaled canvas
					for (var y2 = 0; y2 < squareHeight; y2++)
					{
						for (var x2 = 0; x2 < squareWidth; x2++)
						{

							var yNew = (yPos+y2);
							var xNew = (xPos+x2);

					        var s = 4 * yNew * newWidth + 4 * xNew;  // calculate the index in the array

					        data[s] = red;
					        data[s + 1] = green;
					        data[s + 2] = blue;
					        data[s + 3] = 255;  // fully opaque	
						}
					}
				}
				else
				{
			        var s = 4 * y * width + 4 * x;  // calculate the index in the array

			        data[s] = red;
			        data[s + 1] = green;
			        data[s + 2] = blue;
			        data[s + 3] = 255;  // fully opaque	
		        }			
			}
		}

		if (MODE == 1)
			output+="<br/>";

	}

	if (MODE == 1)
	{
		output+="<br/>";

		var elem = jQuery("<div class = 'map'>" + output + "</div>");

		jQuery("body").append(elem);
	}
	else
	{
		this.ctx.putImageData(this.imgData, 0, 0);

		var text = "Grid " + width + "x" + height;

		this.ctx.fillStyle = "#FFFFFF";
		this.ctx.font = "12px Helvetica";
		this.ctx.fillText(text, 5, 15);
	}

}

function drawNoise(yArray)
{	

	if (MODE == 1)
	{
    	var output = "Map Generated: "
    	output+= yArray[0].length + "x" + yArray.length + "<br/>";
    }	
    else
    {
		var width = yArray[0].length;
		var height = yArray.length;

		if (FRACTAL_REPEAT > 0 && SCALE_CANVAS)
		{
			var newWidth = INIT_WIDTH;
			var newHeight = INIT_HEIGHT;

			for (var i = 0; i < FRACTAL_REPEAT; i++)
			{
				newWidth*= 2;
				newHeight*= 2;
			}

			var squareWidth = newWidth / width;
			var squareHeight = newHeight/ height;

			this.element = jQuery('<canvas id="map_' + MAP_ID + '" width = ' + newWidth + ' height = ' + newHeight + '></canvas><br/>')
		}
		else
		{
			this.element = jQuery('<canvas id="map_' + MAP_ID + '" width = ' + width + ' height = ' + height + '></canvas><br/>')
		}

		MAP_ID++;

		jQuery("body").append(this.element);

		this.canvas = document.getElementById(this.element.attr('id'));

		this.ctx=this.canvas.getContext("2d");

		if (FRACTAL_REPEAT > 0 && SCALE_CANVAS)
			this.imgData = this.ctx.createImageData(newWidth, newHeight);		
		else
			this.imgData = this.ctx.createImageData(width, height);	

		var data = imgData.data;  // the array of RGBA values			
    }

	for (var y = 0; y < yArray.length; y++)
	{
		var xArray = yArray[y];

		for (var x = 0; x < xArray.length; x++)
		{

			if (MODE == 1)
			{
				if (yArray[y][x] >= 0.5)
				{
					output+=LAND;
				}							
				else
				{
					output+=WATER;
				}
			}			
			else
			{

		        var red = Math.round(yArray[y][x] * 255);
		        var green = Math.round(yArray[y][x] * 255);
		        var blue = Math.round(yArray[y][x] * 255);	

				if (FRACTAL_REPEAT > 0 && SCALE_CANVAS)
				{
					var yPos = y * squareHeight;
					var xPos = x * squareWidth;

					// create a rect that will fit into the scaled canvas
					for (var y2 = 0; y2 < squareHeight; y2++)
					{
						for (var x2 = 0; x2 < squareWidth; x2++)
						{

							var yNew = (yPos+y2);
							var xNew = (xPos+x2);

					        var s = 4 * yNew * newWidth + 4 * xNew;  // calculate the index in the array

					        data[s] = red;
					        data[s + 1] = green;
					        data[s + 2] = blue;
					        data[s + 3] = 255;  // fully opaque	
						}
					}
				}
				else
				{
			        var s = 4 * y * width + 4 * x;  // calculate the index in the array

			        data[s] = red;
			        data[s + 1] = green;
			        data[s + 2] = blue;
			        data[s + 3] = 255;  // fully opaque	
		        }			
			}
		}

		if (MODE == 1)
			output+="<br/>";

	}

	if (MODE == 1)
	{
		output+="<br/>";

		var elem = jQuery("<div class = 'map'>" + output + "</div>");

		jQuery("body").append(elem);
	}
	else
	{
		this.ctx.putImageData(this.imgData, 0, 0);

		var text = "Grid " + width + "x" + height;

		this.ctx.fillStyle = "#FFFFFF";
		this.ctx.font = "12px Helvetica";
		this.ctx.fillText(text, 5, 15);
	}

}

function draw(yArray)
{	
	if (MODE == 1)
	{
    	var output = "Map Generated: "
    	output+= yArray[0].length + "x" + yArray.length + "<br/>";
    }
    else
    {
		var width = yArray[0].length;
		var height = yArray.length;

		if (FRACTAL_REPEAT > 0 && SCALE_CANVAS)
		{
			var newWidth = INIT_WIDTH;
			var newHeight = INIT_HEIGHT;

			for (var i = 0; i < FRACTAL_REPEAT; i++)
			{
				newWidth*= 2;
				newHeight*= 2;
			}

			var squareWidth = newWidth / width;
			var squareHeight = newHeight/ height;

			this.element = jQuery('<canvas id="map_' + MAP_ID + '" width = ' + newWidth + ' height = ' + newHeight + '></canvas><br/>')
		}
		else
		{
			this.element = jQuery('<canvas id="map_' + MAP_ID + '" width = ' + width + ' height = ' + height + '></canvas><br/>')
		}

		MAP_ID++;

		jQuery("body").append(this.element);

		this.canvas = document.getElementById(this.element.attr('id'));

		this.ctx=this.canvas.getContext("2d");

		if (FRACTAL_REPEAT > 0 && SCALE_CANVAS)
			this.imgData = this.ctx.createImageData(newWidth, newHeight);		
		else
			this.imgData = this.ctx.createImageData(width, height);	

		var data = imgData.data;  // the array of RGBA values			
    }

	for (var y = 0; y < yArray.length; y++)
	{
		var xArray = yArray[y];

		for (var x = 0; x < xArray.length; x++)
		{
			if (MODE == 1)
			{
				if (yArray[y][x] == 1)
				{
					output+=LAND;
				}
				else if (yArray[y][x] == 2)
				{
					output+=FOREST;
				}
				else if (yArray[y][x] == 3)
				{
					output+=HILL;
				}
				else if (yArray[y][x] == 4)
				{
					output+= "*";
				}
				else if (yArray[y][x] == 5)
				{
					output+= "@";
				}													
				else if (yArray[y][x] == 0)
				{
					output+=WATER;
				}
			}
			else
			{

		        var red = 0;
		        var green = 0;
		        var blue = 0;

				if (yArray[y][x] == 1)
				{
					red = 0;
					green = 100;
					blue = 0;
				}
				else if (yArray[y][x] == 2)
				{
					red = 0;
					green = 50;
					blue = 0;
				}
				else if (yArray[y][x] == 3)
				{
					red = 45;
					green = 45;
					blue = 20;
				}
				else if (yArray[y][x] == 4)
				{
					red = 255;
					green = 0;
					blue = 0;
				}
				else if (yArray[y][x] == 5)
				{
					red = 255;
					green = 255;
					blue = 0;
				}																		
				else if (yArray[y][x] == 0)
				{
					red = 0;
					green = 0;
					blue = 100;
				}		

				if (FRACTAL_REPEAT > 0 && SCALE_CANVAS)
				{
					var yPos = y * squareHeight;
					var xPos = x * squareWidth;

					// create a rect that will fit into the scaled canvas
					for (var y2 = 0; y2 < squareHeight; y2++)
					{
						for (var x2 = 0; x2 < squareWidth; x2++)
						{

							var yNew = (yPos+y2);
							var xNew = (xPos+x2);

					        var s = 4 * yNew * newWidth + 4 * xNew;  // calculate the index in the array

					        data[s] = red;
					        data[s + 1] = green;
					        data[s + 2] = blue;
					        data[s + 3] = 255;  // fully opaque	
						}
					}
				}
				else
				{
			        var s = 4 * y * width + 4 * x;  // calculate the index in the array

			        data[s] = red;
			        data[s + 1] = green;
			        data[s + 2] = blue;
			        data[s + 3] = 255;  // fully opaque	
		        }			
			}
		}
		
		if (MODE == 1)
			output+="<br/>";
	}

	if (MODE == 1)
	{
		output+="<br/>";

		var elem = jQuery("<div class = 'map'>" + output + "</div>");

		jQuery("body").append(elem);
	}
	else
	{
		this.ctx.putImageData(this.imgData, 0, 0);

		var text = "Grid " + width + "x" + height;

		this.ctx.fillStyle = "#FFFFFF";
		this.ctx.font = "12px Helvetica";
		this.ctx.fillText(text, 5, 15);
	}

}

function placeLand()
{
	// mostly land, some water
	if (dice(100) <= LAND_CHANCE)
		return 1;
	else
		return 0;
}

function checkSurround(num)
{
	if (dice(9) <= num)
		return 1;
	else
		return -1;
}

function dice(max)
{
	return Math.floor(Math.random() * max) + 1;
}