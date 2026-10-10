// Native Max jsui, no browser or external dependencies.
autowatch=0;inlets=1;outlets=1;
mgraphics.init();mgraphics.relative_coords=0;mgraphics.autofill=0;
var root=0,membership=2741,held={},whitePC=[0,2,4,5,7,9,11],blackPC=[1,3,6,8,10],blackPos=[1,2,4,5,6];
var pitchNames=['C','C#','D','Eb','E','F','F#','G','Ab','A','Bb','B'];
function view(r,m){root=Number(r);membership=Number(m);mgraphics.redraw();}
function playing(s,n,v){var ch=Number(s)&15,type=Number(s)&240,key=ch+':'+n;if(type===144&&v>0)held[key]=1;else delete held[key];mgraphics.redraw();}
function clear(){held={};mgraphics.redraw();}
function clearvoice(ch){for(var k in held)if(Number(k.split(':')[0])===Number(ch))delete held[k];mgraphics.redraw();}
function lit(pc){for(var k in held)if(Number(k.split(':')[1])%12===pc)return true;return false;}
function size(){return [box.rect[2]-box.rect[0],box.rect[3]-box.rect[1]];}
function color(a){mgraphics.set_source_rgba(a[0],a[1],a[2],a.length>3?a[3]:1);}
function key(pc,x,y,w,h,isblack){
    var member=(membership & (1<<((pc-root+12)%12)))!==0;
    var bg=isblack?(member?[120/255,153/255,104/255]:[27/255,32/255,29/255]):(member?[208/255,220/255,202/255]:[130/255,140/255,134/255]);
    if(lit(pc))bg=[0.97,0.76,0.41];color(bg);mgraphics.rectangle_rounded(x,y,w,h,3,3);mgraphics.fill();
    color(isblack?[41/255,46/255,44/255]:[41/255,46/255,44/255]);mgraphics.set_line_width(0.7);mgraphics.rectangle_rounded(x+.5,y+.5,w-1,h-1,3,3);mgraphics.stroke();
    if(pc===root){color([224/255,180/255,113/255]);mgraphics.rectangle(x+2,y+h-3,w-4,2);mgraphics.fill();}
    color(isblack?[239/255,247/255,234/255]:[38/255,50/255,41/255]);mgraphics.select_font_face('Arial');mgraphics.set_font_size(isblack?8:9);
    var t=pitchNames[pc],tw=mgraphics.text_measure(t)[0];mgraphics.move_to(x+(w-tw)/2,y+h-8);mgraphics.show_text(t);
}
function paint(){var dim=size(),w=dim[0]/7,h=dim[1];for(var i=0;i<7;i++)key(whitePC[i],i*w+1,0,w-2,h,false);for(i=0;i<5;i++)key(blackPC[i],blackPos[i]*w-w*.29,0,w*.58,h*.61,true);}
function onclick(x,y,but,cmd,shift,capslock,option,ctrl){
    var dim=size(),w=dim[0]/7,pc=-1;
    if(y<dim[1]*.61)for(var i=0;i<5;i++)if(x>=blackPos[i]*w-w*.29&&x<blackPos[i]*w+w*.29){pc=blackPC[i];break;}
    if(pc<0&&x>=0&&x<dim[0])pc=whitePC[Math.floor(x/w)];
    if(pc<0)return;
    outlet(0,option?'audition':'toggle',pc);
}
function onresize(){mgraphics.redraw();}
