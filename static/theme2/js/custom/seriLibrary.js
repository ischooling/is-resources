var UA=navigator.userAgent?navigator.userAgent:navigator.appName;
var M={toString:function(){return 'Master Object';},W:window,promptExit:function(m){if(m==undefined||!m||m.length==0)m="Ar"+"e You S"+"ure to Lea"+"ve this We"+"bsite";M.W.onbeforeunload=function(){return m;};},unpromptExit:function(){/* M.detachEvent(M.W,'beforeunload',M.W.beforeunload); */M.W.onbeforeunload=function(){};},FB:!(("console" in window) && ("firebug" in console)),FRAME:function(n){return M.W.frames[n];},DOC:window.document,
    StartUp:new Date().toString(),
    SW:window.screen.width,
    SH:window.screen.height,
    UA:{
        name:UA,
        IE:UA.match(/msie/ig)!=null,
        IE6:UA.match(/msie\s6\.0/ig)!=null,
        IE7:UA.match(/msie\s7\.0/ig)!=null,
        IE8:UA.match(/msie\s8\.0/ig)!=null,
        IE9:UA.match(/msie\s9\.0/ig)!=null,
        FF:UA.match(/(firefox|minefield|namoroka)/ig)!=null,
        OP:UA.match(/(opera|presto)/ig)!=null,
        SF:UA.match(/(chrome|safari)/ig)!=null,
        KK:UA.match(/(konqueror|khtml\/)/ig)!=null,
        OS:UA.match(/windows/ig)!=null,
        LX:UA.match(/linux/ig)!=null,
        MK:UA.match(/mac/ig)!=null,
        offset:((this.name.indexOf("Mac")!=-1||this.name.indexOf("Gecko")!=-1||this.name.indexOf("Netscape")!=-1)?true:false),
        NNArgs:"alwaysLowered=0,alwaysRaised=1,copyhistory=0,dependent=1,directories=0,hotkeys=0,location=0,menubar=0,resizable=0,screenX,screenY,scrollbars=1,status=0,titlebar=0,toolbar=0,z-lock=1",
        IEArgs:"channelMode=0,directories=0,fullscreen=1,location=0,menubar,resizable=1,scrollbars=1,status=0,toolbar=0"
    },
    trim:function(str){if(!str||this.isEmpty(str)||typeof(str)!="string")return null;return str.replace(/(^\s+|\s+$)/g,'');},
    remove:function(theElem){theElem=this.byId(theElem);theElem.parentNode.removeChild(theElem);},
    randomHexColor:function(){return this.RGB2Hex(Math.floor(Math.random()*255),Math.floor(Math.random()*255),Math.floor(Math.random()*255));},
    RGB2Hex:function(r,g,b){return '#'+this.byte2Hex(r)+this.byte2Hex(g)+this.byte2Hex(b);},
    byte2Hex:function(n){return String("0123456789ABCDEF".substr((n>>4) & 0x0F,1))+"0123456789ABCDEF".substr(n & 0x0F,1);},
    unformatMoney:function(str){if(str!=undefined&&M.trim(str))return str.replace(/[,\s+]/g,'');if(!this.value)return '';this.value=this.value.replace(/[,\s+]/g,'');return 1;},
    formatAsMoney:function(str){if(str!=undefined&&M.trim(str))return M.moneyFormat(str);if(!this.value)return false;this.value=M.moneyFormat(this.value);return true;},
    formatAsMoneyStr:function(str){
        if(str!=undefined&&M.trim(str))return M.moneyFormat(str);
        return;
    },
    moneyFormat:function(str) {
        str+='';
        if(!str||!str.length)return null;
        str=str.split('.');
        var dP='';
        if(str.length>1&&str[1].match(/^[0-9]+$/)){
            dP='.' + str[1];
        }
        str=str[0];
        str=str.replace(/^[0]{1,20}/,'');
        str=str.replace(/[,\s+]/g,'');
        var tmp="";
        var tmpcount=0;
        var hsep=true;
        var prev=0;

        for(prev=str.length-1;prev>=0;prev--) {
            tmp+=str.substr(prev,1);
            tmpcount++;
            if(hsep&&tmpcount==3&&prev) {
                tmp+=",";
                hsep=false;
                tmpcount=0;
            } else if(!hsep&&tmpcount==2&&prev) {
                tmp+=",";
                tmpcount=0;
            }
        }
        str="";                
        for(prev=tmp.length-1;prev>=0;prev--)
            str+=tmp.substr(prev,1);
        return str + dP;
    },
    format:function(str){if(!str)return null;str=this.trim(str);var tmp='';var count=0;var f=3;for(var nxt=str.length-1;nxt>=0;nxt--){count++;tmp=str[nxt]+tmp;if(f==count){tmp=","+tmp;f=2;}}return 'Rs. '+str;},
    decimal:function(value,decimals){return Math.round(value*Math.pow(10,decimals))/Math.pow(10,decimals);},
    getCookie:function(cn){var ar={};var t="";var C=document.cookie.split('; ');for(var nxt=0;nxt<C.length;nxt++){var s=M.trim(C[nxt].substring(0,C[nxt].indexOf('=')));var v=C[nxt].substr(C[nxt].indexOf('=')+1);if(cn&&s==cn)return unescape(v);}if(cn)return null;return unescape(ar);},
    setCookieOld:function(name, value){var expire=new Date();var nowPlusOneWeek=expire.getTime()+(7*24*60*60*1000);expire.setTime(nowPlusOneWeek);document.cookie=name+"="+value+";expires="+expire.toGMTString()+";";},
    setCookie:function(name,value,expire){if(expire==undefined||isNaN(expire))expire=7;document.cookie=name+"="+escape(value)+"; expires="+new Date(new Date().getTime()+expire*24*60*60*1000).toGMTString()+"; domain=internationalschooling.org; path=/; secure;";},
    isSpecialCharsWithN:function(str){return str.match(/\<|\>|\"|\'|\~|\@|\#|\$|\^|\*|\(|\)|\_|\+|\=|\:|\?|\"|\/|\!|\%|\;|\(|\)|\&|\+|\-|\[|\]|[0-9]/g);},
    isSpecialChars:function(str){return str.match(/\<|\>|\"|\'|\~|\@|\#|\$|\^|\*|\(|\)|\_|\+|\=|\:|\?|\"|\/|\!|\%|\;|\(|\)|\&|\+|\-|\[|\]/g);},
    isAlpha:function(str){
        if(str==undefined)return null;
        return str.match(/^[a-zA-Z]+$/);
    },
    isAlphaSpace:function(str){ // this is for the enters middle name in first
								// name or last name
        if(str==undefined)return null;
        var length = str.length;
        for(var i=0;i<length;i++) {
            if(str[0]=='') {
                break;
            } else if(str[length-1] == ' ') {
                break;
            } else {
                return str.match(/^[a-zA-Z ]+$/);
            }
        }
        
    },
    isPAN:function(str){if(str==null || str=='')return true;if(str==undefined)return false;str=M.trim(str);var m=str.match(/^([A-Za-z]{3})+(P|C|F|H|A|T|B|J|G|p|c|f|h|a|t|b|j|g)+([A-Za-z]{1})+([0-9]{4})+([A-Za-z]{1})$/);return (m&&m[0].length==10);},
    isPANSalaried:function(str){if(str==undefined)return false;str=M.trim(str);var m=str.match(/^([A-Za-z]{3})+(P|C|F|p|c|f)+([A-Za-z]{1})+([0-9]{4})+([A-Za-z]{1})$/);return (m&&m[0].length==10);},
    isPIN:function(cont){cont=cont.toString();if(!$.isNumeric(cont)){return false;}if(cont.length < 6) { return false; }else if(cont < '100001' || cont > '999999') {return false; } else {return true;}},
    IsNumeric:function(sText){var ValidChars = "0123456789.";var IsNumber=true;var Char;for (var i = 0; i < sText.length && IsNumber == true; i++){Char = sText.charAt(i);if (ValidChars.indexOf(Char) == -1) {IsNumber = false;}}return IsNumber;},
    isDigitOnly:function(sText) {return sText.match(/^[\d\.]/);},
    isEmail:function(mailid){mailid=mailid.toString();return mailid.match(/^[a-zA-Z0-9._-]+@([a-zA-Z0-9.-]+\.)+[a-zA-Z0-9.-]{2,4}$/);},
    isMobile:function(cont){cont=cont.toString();if(!$.isNumeric(cont)){return null;}if(cont.length < 10) { return null; }else if(cont < '6000000000' || cont > '9999999999') {return null; } else {return cont;}},
    isNRIMobile:function(cont){cont=cont.toString();if(!$.isNumeric(cont)){return null;}if(cont < '1' || cont > '9999999999'){return null;}else{return cont;}},
    isPhone:function(phone){phone=phone.toString();return phone.match(/^(((\+){0,1}91(\-){1})\d{2,5}(\-){1}\d{6,8})|(\d{2,5}(\-){1}\d{6,8})$/);},
    checkMobNo:function(mobNo,countryType){var regEx ="";var checkCountry = /^[7-9]\d{9}$/;if(mobNo.match(checkCountry)){regEx = checkCountry;}else{regEx = /^[1-9]\d{9}$/;}if(mobNo.match(regEx)){return true;}else{return false;}},
    isDate:function(date,byToday){
        if(date==undefined||typeof(date)!="string")return false;
        if(date.match(/^\d{2}\-\d{2}\-\d{4}$/)){
            date=date.split("-");
            var days=M.daysInMonth(date[1]-1, date[2]);
            if(date[1] == 2){
                days = (((date[2] % 4 == 0) && (date[2] % 100 != 0)) || (date[2] % 400 == 0) ? 29 : 28); 
            }
            var R=(date[0]>0&&date[0]<=days&&date[1]>0&&date[1]<=12);
            if(R&&byToday!=undefined){
                return M.countAge(date[0],date[1],date[2]);
            }
            return R;
        }
        return false;
    },
    isDateReverse:function(date,byToday){
        if(date==undefined||typeof(date)!="string")return false;
        if(date.match(/^\d{4}\-\d{2}\-\d{2}$/)){
            date=date.split("-");
            var days=M.daysInMonth(date[1]-1, date[0]);
            var R=(date[2]>0&&date[2]<=days&&date[1]>0&&date[1]<=12);
            if(R&&byToday!=undefined) {
                return M.countAge(date[2],date[1],date[0]);
            }
            return R;
        }
        return false;
    },
    isFeb:function(date){if(M.isDate(date).length)date=date.split('-');return((((date[2]%4==0)&&((!(date[2]%100==0))||(date[2]%400==0)))?29:28)==date[0]);},
    daysInMonth:function(iMonth,iYear){return 32-(new Date(iYear,iMonth,32).getDate());},
    daysWillBe:function (trg,Year,Month){if(Year.selectedIndex&&Month.selectedIndex){var days=parseInt(M.daysInMonth(M.getSelectValue(Month)-1,M.getSelectValue(Year)));trg.options.length=1;for(var d=1;d<=days;d++){trg.options[trg.options.length]=new Option(d,d,false,false);}}},
    countAge:function(a1,a2,a3){
        if(a1==undefined)return 0;
        var day=0,month=0,year=0;        
        if(a2!=undefined&&a3!=undefined){
            day=parseFloat(0+a1);
            day=(day<10?"0"+day.toString():day);
            month=parseFloat(0+a2);
            month=(month<10?"0"+month.toString():month);
            year=a3;
            if(!M.isDate(day+"-"+month+"-"+year)) return 0;
        }else if(typeof(a1)=="string"&&a1.match(/\d{4}-\d{2}-\d{2}/)){
            a1=a1.split("-");
            year=a1[0];
            month=a1[1];
            day=a1[2];
            if(!M.isDate(day+"-"+month+"-"+year)) return 0;
        }else if(typeof(a1)=="string"&&a1.match(/\d{2}-\d{2}-\d{4}/)){
            a1=a1.split("-");
            year=a1[2];
            month=a1[1];
            day=a1[0];
            if(!M.isDate(day+"-"+month+"-"+year)) return 0;
        }
        return Math.round(parseFloat((new Date()-new Date(year,month,day))/(1000*60*60*24*365)));
    },
    countAgeNew:function(a1,a2,a3){
        if(a1==undefined)return 0;
        var day=0,month=0,year=0;        
        if(a2!=undefined&&a3!=undefined){
            day=parseFloat(0+a1);
            day=(day<10?"0"+day.toString():day);
            month=parseFloat(0+a2);
            month=(month<10?"0"+month.toString():month);
            year=a3;
            if(!M.isDate(day+"-"+month+"-"+year)) return 0;
        }else if(typeof(a1)=="string"&&a1.match(/\d{4}-\d{2}-\d{2}/)){
            a1=a1.split("-");
            year=a1[0];
            month=a1[1];
            day=a1[2];
            if(!M.isDate(day+"-"+month+"-"+year)) return 0;
        }else if(typeof(a1)=="string"&&a1.match(/\d{2}-\d{2}-\d{4}/)){
            a1=a1.split("-");
            year=a1[2];
            month=a1[1];
            day=a1[0];
            if(!M.isDate(day+"-"+month+"-"+year)) return 0;
        }
        return (((new Date()-new Date(year,month,day))/(1000*60*60*24*365)));
    },
    isTime:function(time){
        if(time==undefined||typeof(time)!="string"||!time.match(/^\d{1,2}:\d{2}\s([ap]m)?$/i))return false;
        time=time.split(" ")[0].split(":");
        return (time[0]<24&&time[1]<60);
    },
    dateDiff:function(date1,td){var bd=date1.split("-");bd=new Date(bd[2],bd[1]-1,bd[0]);if(td){td=td.split('-');td=new Date(td[2],td[1]-1,td[0]);}else td=new Date();var dy=td.getFullYear()-bd.getFullYear();var dm=(td.getMonth()+1)-bd.getMonth();var dd=td.getDate()-bd.getDate();if(dm<=0){dy--;dm=12-Math.abs(dm);}return [dy,dm,dd];},
    dateDiffDays:function(date1,td){var bd=date1.split("-");bd=new Date(bd[2],bd[1]-1,bd[0]);if(td){td=td.split('-');td=new Date(td[2],td[1]-1,td[0]);}else td=new Date();var one_day=1000*60*60*24;var diffInDays = Math.ceil((bd.getTime()-td.getTime())/(one_day));return diffInDays;}, 
    dateDiffSecs:function(date1){var bd=date1.split("-");bd=new Date(bd[2],(bd[1]-1),bd[0]);var todayDate=new Date();var secondsDifference=bd.getTime()-todayDate.getTime();return secondsDifference;},
    duplicate:function(cont){var pattern=/([A-Z]|[a-z]|[0-9])(\1)(\1)(\1)/;if(pattern.test(cont))return false;return true;},
    alphaNumWithoutSpace:function(cont){var pattern=/([A-Z]|[a-z]|[0-9])/;if(pattern.test(cont))return false;return true;},
    isEmpty:function(inputStr){if(null==inputStr||""==inputStr)return true;return false;},
    getRadioValue:function(radio,form){form=M.getForm(form);if(!form)return null;if(form[radio]==undefined)return null;for(var i=0;i<form[radio].length;i++)if(form[radio][i].checked)return form[radio][i].value;return false;},
    getSelectValue:function(elem,i){
        if(!elem||elem.selectedIndex==undefined||elem.options.length==0)return false;
        return elem.options[(i==undefined?elem.selectedIndex:i)].value;
    },
    checkAll:function(frm,chk){frm=this.getForm(frm);for(var n=0;n<frm.elements.length;n++)if(frm.elements[n].type!=undefined&&frm.elements[n].type=='checkbox')frm.elements[n].checked=(chk!=undefined&&typeof(chk)=="boolean"?chk:true);},
    getForm:function(src){if(document.forms[src]!=undefined)return document.forms[src];else if(src.tagName=="FORM")return src;else return null;},
    months:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    monthsFull:['January','Febuary','March','April','May','June','July','August','September','October','November','December'],
    byId:function(id){if(typeof(id)!="string")return id;return (this.DOC.getElementById?(this.DOC.getElementById(id)!=undefined?this.DOC.getElementById(id):null):(this.DOC.all?(this.DOC.all[id]!=undefined?this.DOC.all[id]:null):(this.DOC.layers[id]!=undefined?this.DOC.layers[id]:null)));},
    byTag:function(tagName,target){var p=target||document;return p.getElementsByTagName(tagName);},
    docHeight:function(){return ((document.height!=undefined)?document.height:document.body.clientHeight);},
    docWidth:function(){return ((document.width!=undefined)?document.width:document.body.clientWidth);},
    isValidColorHex:function(c){return /^(#)?([0-9a-fA-F]{3})([0-9a-fA-F]{3})?$/.test(c);},
    addE:function(e){document.body.appendChild(e);},
    
    scrollTopValue:function(){
        return M.offset?window.pageYOffset:document.documentElement&&document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop;
    },
    scrollTop:function(){
        var py=M.scrollTopValue();
        window.scrollBy(0,py-(py*2));
    },
    createOver:function(H,W,Color,Opa,floated){var XPND=M.docOverlay(Color, Opa==undefined?60:Opa);var CNTNT=M.create("div");CNTNT.id="overElementContainerBox";CNTNT.setAttribute("id","overElementContainerBox");CNTNT.className="above_hider";var height=H;var width=W;STYle=CNTNT.style;STYle.height=height+"px";STYle.width=width+"px";STYle.top=((this.visibleHeight-height)/2)+"px";STYle.left=((this.visibleWidth-width)/2)+"px";document.body.appendChild(CNTNT);var C=M.create("div");C.className="content_title";C.appendChild(document.createTextNode("Esc(Close)"));var CB=M.create("a");CB.href="javascript:;";CB.innerHTML="X";CB.setAttribute("title","Close");C.appendChild(CB);CNTNT.appendChild(C);C=M.create("div");C.style.height=(height-48)+"px";C.style.overflow="auto";CNTNT.appendChild(C);var timer=this.floatDiv("overElementContainerBox",((this.visibleWidth-width)/2),((this.visibleHeight-height)/2)).floatIt();var listener=function(){document.body.removeChild(CNTNT);document.body.removeChild(XPND);M.detachEvent(document,"keypress",listener);clearTimeout(timer);};C.removeout=listener;M.addEventListener(CB,'click',listener);listener=function(){evO=M.objEvent(arguments.length?arguments[0]:event);if(evO&&evO.e.keyCode==27){document.body.removeChild(CNTNT);document.body.removeChild(XPND);M.detachEvent(document,"keypress",listener);clearTimeout(timer);}};M.addEventListener(document,'keypress',listener);return C;},
    alertMessage:function(msg,title,color){},
    floatDiv:function(id,sx,sy){var el=this.byId(id);if(!el) return false;var px=document.layers?"":"px";window[id+"_obj"]=el;if(document.layers)el.style=el;el.cx=el.sx=sx;el.cy=el.sy=sy;el.style.position="absolute";el.sP=function(x,y){this.style.left=x+px;this.style.top=y+px;};el.floatIt=function(){var pX,pY;pX=(this.sx>=0)?0:this.offset?innerWidth:document.documentElement&&document.documentElement.clientWidth?document.documentElement.clientWidth:document.body.clientWidth;pY=this.offset?pageYOffset:document.documentElement&&document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop;if(this.sy<0)pY+=this.offset?innerHeight:document.documentElement&&document.documentElement.clientHeight?document.documentElement.clientHeight:document.body.clientHeight;this.cx+=(pX+this.sx-this.cx)/8;this.cy+=(pY+this.sy-this.cy)/8;this.sP(this.cx,this.cy);return setTimeout(this.id+"_obj.floatIt()",40);};return el;},
    getElementValue:function(elem){if(!elem||(elem==undefined)||(elem.tagName==undefined))return false;var val=null;switch(elem.tagName.toUpperCase()){case 'SELECT':val=M.getSelectValue(elem);break;case 'INPUT':switch(elem.type.toUpperCase()){case 'RADIO':M.getRadioValue(elem, elem.form);break;case 'CHECKBOX':val=this.getRadioValue(elem);break;case 'TEXT':case 'BUTTON':case 'HIDDEN':case 'FILE':val=elem.value;}break;case 'TEXTAREA':val=elem.value;break;}return val;},
    addEventListener:function(el,evname,func){if(el.attachEvent)el.attachEvent("on"+evname,func);else if(el.addEventListener)el.addEventListener(evname,func,true);else el["on"+evname]=func;},
    detachEventListener:function(el,evname){if(el.detachEvent)el.detachEvent("on"+evname,"");else if(el.removeEventListener)el.removeEventListener(evname,"",false);else el["on"+evname]="";},
    removeEventListener:function(event){if(event.preventDefault){event.preventDefault();event.stopPropagation();}else{event.returnValue=false;event.cancelBubble=true;}},
    objEvent:function(evt){evt=evt?evt:(event?event:null);if(evt)return{e:evt,src:(evt.srcElement?evt.srcElement:evt.target),form:(evt.srcElement?evt.srcElement:evt.target).form};return null;},
    pick:function(target,src,c){src.style.display="none";target=document.getElementById(target);target.style.display="block";if(c){c=document.getElementById(c);c.onclick=function(){src.style.display="block";target.style.display="none";}}},
    animateScroll:function(target,size,coOrd){target.animate=function(){var obj=this;var inc=15,aniTime=5;if(coOrd=='y'){obj.height+=inc;obj.style.height=this.height+"px";if(obj.height<=size)setTimeout(function(){obj.animate();},aniTime);}else if(coOrd=='x'){obj.width+=inc;obj.style.width=obj.width+"px";if(obj.width<=size)setTimeout(function(){obj.animate();},aniTime);}};target.animate();},
    createPopup:function(preview,evt){var evO=M.objEvent(evt);if(!evO) return false;if(evO.e.pageX||evO.e.pageY){posx=evO.e.pageX+2;posy=evO.e.pageY;}else if(evO.e.clientX||evO.e.clientY){posx=evO.e.clientX+document.body.scrollLeft+document.documentElement.scrollLeft;posy=evO.e.clientY+document.body.scrollTop+document.documentElement.scrollTop;}if(M.W.previousSource==undefined)M.W.previousSource="";if((M.W.popup==undefined)||(!M.W.popup)){M.W.popup=M.create("div");M.W.popup.className="hlpopup";var xp=M.create("p");M.W.popup.appendChild(xp);var x=M.create("a");x.setAttribute("href","javascript:;");x.innerHTML="X";x.setAttribute("title","close");x.onclick=function(evt){document.body.removeChild(M.W.popup);M.W.popup=null;};xp.appendChild(x);xp=M.create("div");xp.innerHTML=preview;M.W.popup.appendChild(xp);M.W.popup.timer=null;M.W.popup.onmousemove=function(){if(this.timer!=null)clearTimeout(this.timer);};M.W.popup.onmouseout=function(){if(this.timer!=null)clearTimeout(this.timer);this.timer=setTimeout("document.body.removeChild(window.popup);window.popup=null;",1000);};document.body.appendChild(M.W.popup);M.W.previousSource=evO.src;}if(evO.src!=M.W.previousSource){M.W.popup.getElementsByTagName('div')[0].innerHTML=preview;M.W.previousSource=evO.src;}M.W.popup.style.left=(posx+10)+"px";M.W.popup.style.top=posy+"px";return true;},
    attachEvent:function(obj,ev,fn){obj=M.byId(obj);if(obj.addEventListener)obj.addEventListener(ev,fn,true);else if(obj.attachEvent)obj.attachEvent("on"+ev,fn);},
    detachEvent:function(el,ev,fn){if(el.detachEvent)el.detachEvent("on"+ev,fn);else if(el.removeEventListener)el.removeEventListener(ev,fn,false);else el["on"+evname]="";},
    isWebKit:function(){return RegExp(" AppleWebKit/").test(M.UA);},
    search:function(v,a){for(var i=0;i<a.length;i++)if(a[i]==v)return i;return -1;},
    toInt:function(n){return parseInt(n);},
    toChar:function(code){return String.fromCharCode(code);},
    keys:[8,9,13,37,46,110],
    digit:function(evO){
        evO=M.objEvent(evO);
        if(!evO)return false;
        if(evO.e.keyCode==0||evO.e.keyCode==229){
        	return true;// case for tablet
        }
        if(evO.e.shiftKey&&evO.e.keyCode==9)return true;
        if(evO.e.shiftKey||evO.e.keyCode==16||evO.e.keyCode==110)return false;
        var r=(evO.e.keyCode>=48&&evO.e.keyCode<=57);
        if(r)return true;
        r=(evO.e.keyCode>=96&&evO.e.keyCode<=105);
        if(r)return true;
        r=(evO.e.keyCode>=37&&evO.e.keyCode<=40);
        if(r)return true;
        var is=M.search(evO.e.keyCode,M.keys);
        return (is>=0);
    },
    phoneNo:function(evO){
        evO=M.objEvent(evO);
        if(!evO)return false;
        if(evO.e.keyCode==0||evO.e.keyCode==229){
        	return true;// case for tablet
        }
        if(evO.e.shiftKey&&evO.e.keyCode==9)return true;
        if(evO.e.shiftKey||evO.e.keyCode==16||evO.e.keyCode==110)return false;
        var r=(evO.e.keyCode>=48&&evO.e.keyCode<=57);
        if(r)return true;
        r=(evO.e.keyCode>=96&&evO.e.keyCode<=105);
        if(r)return true;
        r=(evO.e.keyCode>=37&&evO.e.keyCode<=40);
        if(r)return true;
        r=(evO.e.keyCode==32);
        if(r)return true;
        var is=M.search(evO.e.keyCode,M.keys);
        return (is>=0);
    },
    floatDigit:function(evO){
		evO=M.objEvent(evO);
		if(!evO)return false;
		if(evO.e.keyCode==0||evO.e.keyCode==229){
        	return true;// case for tablet
        }
		if(evO.e.shiftKey&&evO.e.keyCode==9)return true;
		if(evO.e.shiftKey||evO.e.keyCode==16)return false;
		var r=(evO.e.keyCode>=48&&evO.e.keyCode<=57);
		if(r)return true;
		r=(evO.e.keyCode>=96&&evO.e.keyCode<=105);
		if(r)return true;
		r=(evO.e.keyCode==110 || evO.e.keyCode==190 || evO.e.keyCode==39);
		if(r)return true;
		r=((evO.e.keyCode>=65&&evO.e.keyCode<=90));
		if(r)return false;
		var is=M.search(evO.e.keyCode,M.keys);
		return (is>=0);
	},
    isAlphaNumericWithNoSpecialCharacter:function(evO){
        evO=M.objEvent(evO);
        if(!evO)return false;
        if(evO.e.keyCode==0||evO.e.keyCode==229){
        	return true;// case for tablet
        }
        if(evO.e.shiftKey == true) {
        	var r=((evO.e.keyCode>=65&&evO.e.keyCode<=90));
            if(r)return true;
            else return false;
        } 
        if(evO.e.shiftKey&&evO.e.keyCode==9)return true;
        if(evO.e.shiftKey||evO.e.keyCode==16)return false;
        //if(evO.e.shiftKey&&evO.e.keyCode==32)return true;
        var r=(evO.e.keyCode>=48&&evO.e.keyCode<=57);
        if(r)return true;
        r=(evO.e.keyCode>=96&&evO.e.keyCode<=105);
        if(r)return true;
        r=(evO.e.keyCode>=37&&evO.e.keyCode<=40);
        if(r)return true;
        var r=(evO.e.keyCode>=65&&evO.e.keyCode<=90);
        if(r)return true;
        var is=M.search(evO.e.keyCode,M.keys);
        return (is>=0);
    },
    isAlphaNumericWithSpace:function(evO){
        evO=M.objEvent(evO);
        if(!evO)return false;
        if(evO.e.keyCode==0||evO.e.keyCode==229||evO.e.keyCode==32){
        	return true;// case for tablet
        }
        if(evO.e.shiftKey == true) {
        	var r=((evO.e.keyCode>=65&&evO.e.keyCode<=90));
            if(r)return true;
            else return false;
        } 
        if(evO.e.shiftKey&&evO.e.keyCode==9)return true;
        if(evO.e.shiftKey||evO.e.keyCode==16)return false;
        //if(evO.e.shiftKey&&evO.e.keyCode==32)return true;
        var r=(evO.e.keyCode>=48&&evO.e.keyCode<=57);
        if(r)return true;
        r=(evO.e.keyCode>=96&&evO.e.keyCode<=105);
        if(r)return true;
        r=(evO.e.keyCode>=37&&evO.e.keyCode<=40);
        if(r)return true;
        var r=(evO.e.keyCode>=65&&evO.e.keyCode<=90);
        if(r)return true;
        var is=M.search(evO.e.keyCode,M.keys);
        return (is>=0);
    },
    isAlphaWithSpace:function(evO){
        evO=M.objEvent(evO);
        if(!evO)return false;
        if(evO.e.keyCode==0||evO.e.keyCode==229||evO.e.keyCode==32){
        	return true;// case for tablet
        }
        if(evO.e.shiftKey == true) {
        	var r=((evO.e.keyCode>=65&&evO.e.keyCode<=90));
            if(r)return true;
            else return false;
        } 
        if(evO.e.shiftKey&&evO.e.keyCode==9)return true;
        if(evO.e.shiftKey||evO.e.keyCode==16)return false;
        r=(evO.e.keyCode>=96&&evO.e.keyCode<=105);
        if(r)return true;
        r=(evO.e.keyCode>=37&&evO.e.keyCode<=40);
        if(r)return true;
        var r=(evO.e.keyCode>=65&&evO.e.keyCode<=90);
        if(r)return true;
        var is=M.search(evO.e.keyCode,M.keys);
        return (is>=0);
    },
    isAlphaWithoutSpace:function(evO){
        evO=M.objEvent(evO);
        if(!evO)return false;
        if(evO.e.keyCode==0||evO.e.keyCode==229){
        	return true;// case for tablet
        }
        if(evO.e.shiftKey == true) {
        	var r=((evO.e.keyCode>=65&&evO.e.keyCode<=90));
            if(r)return true;
            else return false;
        } 
        if(evO.e.shiftKey&&evO.e.keyCode==9)return true;
        if(evO.e.shiftKey||evO.e.keyCode==16)return false;
        r=(evO.e.keyCode>=96&&evO.e.keyCode<=105);
        if(r)return true;
        r=(evO.e.keyCode>=37&&evO.e.keyCode<=40);
        if(r)return true;
        var r=(evO.e.keyCode>=65&&evO.e.keyCode<=90);
        if(r)return true;
        var is=M.search(evO.e.keyCode,M.keys);
        return (is>=0);
    },
    isChars:function(evO){ // this is for the enters middle name in first name
							// or last name
        evO=M.objEvent(evO);
        if(!evO)return false;
        if(evO.e.keyCode==0||evO.e.keyCode==229){
        	return true;// case for tablet
        }
        if(evO.e.shiftKey == true) {
        	var r=((evO.e.keyCode>=65&&evO.e.keyCode<=90));
            if(r)return true;
            else return false;
        } 
        r=(evO.e.keyCode>96&&evO.e.keyCode<=122);
        if(r)return false;
        if(evO.e.shiftKey&&evO.e.keyCode==9)return true;
        if(evO.e.shiftKey||evO.e.keyCode==16 || evO.e.keyCode==39)return true;
        var r = (evO.e.keyCode==32 || evO.e.keyCode==127);
        if(r)return true;
        
        var r=(evO.e.keyCode>=65&&evO.e.keyCode<=90);
        if(r)return true;
        var is=M.search(evO.e.keyCode,M.keys);
        return (is>=0);
    },
    isNameWithNoSpecialCharacter:function(evO){ // this is for the enters middle name in first name
		// or last name
        evO=M.objEvent(evO);
        if(!evO)return false;
        if(evO.e.keyCode==0||evO.e.keyCode==229){
        return true;// case for tablet
        }
        if(evO.e.shiftKey == true) {
        var r=((evO.e.keyCode>=65&&evO.e.keyCode<=90));
        if(r)return true;
        else return false;
        } 
        r=(evO.e.keyCode>96&&evO.e.keyCode<=122);
        if(r)return false;
        if(evO.e.shiftKey&&evO.e.keyCode==9)return true;
        if(evO.e.keyCode==190)return true;
        if(evO.e.shiftKey||evO.e.keyCode==16 || evO.e.keyCode==39)return true;
       var r = (evO.e.keyCode==32 || evO.e.keyCode==127);
       if(r)return true;

       var r=(evO.e.keyCode>=65&&evO.e.keyCode<=90);
       if(r)return true;
       var is=M.search(evO.e.keyCode,M.keys);
       return (is>=0);
    },
    isCollege:function(evO){ // this is for the enters middle name in first
								// name or last name
        evO=M.objEvent(evO);
        if(!evO)return false;
        if(evO.e.keyCode==0||evO.e.keyCode==229){
        	return true;// case for tablet
        }
        if(evO.e.keyCode == 190){
        	return true;
        }
        if(evO.e.shiftKey == true) {
        	var r=((evO.e.keyCode>=65&&evO.e.keyCode<=90));
            if(r)return true;
            else return false;
        } 
        if(!evO)return false;
        r=(evO.e.keyCode>96&&evO.e.keyCode<=122);
        if(r)return false;
        if(evO.e.shiftKey&&evO.e.keyCode==9)return true;
        if(evO.e.shiftKey||evO.e.keyCode==16)return true;
        var r = (evO.e.keyCode==32 || evO.e.keyCode==127);
        if(r)return true;
        
        var r=(evO.e.keyCode>=65&&evO.e.keyCode<=90);
        if(r)return true;
        var is=M.search(evO.e.keyCode,M.keys);
        return (is>=0);
    },
    isString:function(evO){ // this is for the enters middle name in first name
							// or last name
        evO=M.objEvent(evO);
        if(!evO)return false;
        if(evO.e.keyCode==0||evO.e.keyCode==229){
        	return true;// case for tablet
        }
        if(evO.e.shiftKey == true) {
        	var r=((evO.e.keyCode>=65&&evO.e.keyCode<=90));
            if(r)return true;
            r = (evO.e.keyCode==48||evO.e.keyCode==57);
            if(r)return true;
            else return false;
        } 
        if(evO.e.shiftKey&&evO.e.keyCode==9)return true;
        // if(evO.e.shiftKey||evO.e.keyCode==16)return true;
        
        var r=(evO.e.keyCode>=48&&evO.e.keyCode<=57);
        if(r)return true;
        r = (evO.e.keyCode==32 || evO.e.keyCode==189 || evO.e.keyCode==173);
        if(r)return true;
        r=(evO.e.keyCode>=96&&evO.e.keyCode<=105);
        if(r)return true;
        r=(evO.e.keyCode>=37&&evO.e.keyCode<40);
        if(r)return true;
        var r=(evO.e.keyCode>=65&&evO.e.keyCode<=90);
        if(r)return true;
        var is=M.search(evO.e.keyCode,M.keys);
        return (is>=0);
    },
    isDescriptionLine:function(evO){ // this is for the enters middle name in
    	 evO=M.objEvent(evO);
         if(!evO)return false;
         if(evO.e.keyCode==0||evO.e.keyCode==229){
         	return true;
         }
         if(evO.e.keyCode==191 || evO.e.keyCode==59 || evO.e.keyCode==173){
         	return true;
         }
         if(evO.e.shiftKey == true) {
         	var r=((evO.e.keyCode>=65&&evO.e.keyCode<=90));
             if(r)return true;
             r = (evO.e.keyCode==48||evO.e.keyCode==57);
             if(r)return true;
             else return false;
         } 
         if(evO.e.shiftKey&&evO.e.keyCode==9)return true;
         if(evO.e.shiftKey||evO.e.keyCode==16)return true;
         
         var r=(evO.e.keyCode>=48&&evO.e.keyCode<=57);
         if(r)return true;
         r = (evO.e.keyCode==32 || evO.e.keyCode==189 || evO.e.keyCode==173);
         if(r)return true;
         r=(evO.e.keyCode>=96&&evO.e.keyCode<=105);
         if(r)return true;
         r=(evO.e.keyCode>=37&&evO.e.keyCode<40);
         if(r)return true;
         var r=(evO.e.keyCode>=65&&evO.e.keyCode<=90);
         if(r)return true;
         var r=(evO.e.keyCode==188 || evO.e.keyCode==189 || evO.e.keyCode==190);
         if(r)return true;
         
         var is=M.search(evO.e.keyCode,M.keys);
         return (is>=0);
    }, 
    isampersandDisable:function(evO){ // this is for the ampersand disable
      console.log('isampersandDisable');
    	evO=M.objEvent(evO);
         if(!evO)return false;
         if(evO.e.keyCode==0||evO.e.keyCode==229){
         	return true;
         }
        
         if( evO.e.keyCode==59 || evO.e.keyCode==173 || evO.e.keyCode==50 || evO.e.keyCode==51 || evO.e.keyCode==52 || evO.e.keyCode==53 || evO.e.keyCode==49 || evO.e.keyCode==189 || evO.e.keyCode==187 || evO.e.keyCode==186 || evO.e.keyCode==222 || evO.e.keyCode==187 || evO.e.keyCode==191){
         	return true;
         }
         if(evO.e.shiftKey == true) {
         	var r=(evO.e.keyCode>=61 && evO.e.keyCode<=54);
             if(r)return true;
             r = (evO.e.keyCode==48||evO.e.keyCode==57 || evO.e.keyCode==61 || evO.e.keyCode==51 || evO.e.keyCode==43 || evO.e.keyCode==187 || evO.e.keyCode==186 || evO.e.keyCode==222 || evO.e.keyCode==187 || evO.e.keyCode==191 );
             if(r)return true;
             else return false;
         } 
         if(evO.e.keyCode==13 || evO.e.keyCode==61 ){
         	return true;
         }
         if(evO.e.shiftKey&&evO.e.keyCode==55)return false;
         if(evO.e.shiftKey&&evO.e.keyCode==49)return true;
         if(evO.e.shiftKey&&evO.e.keyCode==189)return true;
          if(evO.e.shiftKey||evO.e.keyCode==16)return true;
         
         var r=(evO.e.keyCode>=48&&evO.e.keyCode<=57);
         if(r)return true;
         r = (evO.e.keyCode==32 || evO.e.keyCode==189 || evO.e.keyCode==173 || evO.e.keyCode==188 ||evO.e.keyCode==190 || evO.e.keyCode==220 || evO.e.keyCode==191);
         if(r)return true;
         r=(evO.e.keyCode>=96&&evO.e.keyCode<=105);
         if(r)return true;
         r=(evO.e.keyCode>=37&&evO.e.keyCode<40);
         if(r)return true;
         var r=(evO.e.keyCode>=65&&evO.e.keyCode<=90);
         if(r)return true;
         if(evO.e.shiftKey == true) {
         	if(evO.e.keyCode==49)return true;
         }
         var is=M.search(evO.e.keyCode,M.keys);
         return (is>=0);
    },
    
    isAddressLine:function(evO){ // this is for the enters middle name in
   	 evO=M.objEvent(evO);
        if(!evO)return false;
        if(evO.e.keyCode==0||evO.e.keyCode==229){
        	return true;
        }
       
        if( evO.e.keyCode==59 || evO.e.keyCode==173 || evO.e.keyCode==50 || evO.e.keyCode==52 || evO.e.keyCode==53 || evO.e.keyCode==49 || evO.e.keyCode==189 || evO.e.keyCode==55){
        	return true;
        }
        if(evO.e.shiftKey == true) {
        	var r=((evO.e.keyCode>=65&&evO.e.keyCode<=90));
            if(r)return true;
            r = (evO.e.keyCode==48||evO.e.keyCode==57);
            if(r)return true;
            else return false;
        } 
        if(evO.e.keyCode==13){
        	return false;
        }
        if(evO.e.shiftKey&&evO.e.keyCode==55)return true;
        if(evO.e.shiftKey&&evO.e.keyCode==49)return true;
        if(evO.e.shiftKey&&evO.e.keyCode==189)return true;
         if(evO.e.shiftKey||evO.e.keyCode==16)return true;
        
        var r=(evO.e.keyCode>=48&&evO.e.keyCode<=57);
        if(r)return true;
        r = (evO.e.keyCode==32 || evO.e.keyCode==189 || evO.e.keyCode==173 || evO.e.keyCode==188 ||evO.e.keyCode==190 || evO.e.keyCode==220 || evO.e.keyCode==191);
        if(r)return true;
        r=(evO.e.keyCode>=96&&evO.e.keyCode<=105);
        if(r)return true;
        r=(evO.e.keyCode>=37&&evO.e.keyCode<40);
        if(r)return true;
        var r=(evO.e.keyCode>=65&&evO.e.keyCode<=90);
        if(r)return true;
        if(evO.e.shiftKey == true) {
        	if(evO.e.keyCode==49)return true;
        }
        var is=M.search(evO.e.keyCode,M.keys);
        return (is>=0);
   },
   
   isAddressLineNew:function(evO){ // this is for the enters middle name in
	   	 evO=M.objEvent(evO);
	        if(!evO)return false;
	        if(evO.e.keyCode==0||evO.e.keyCode==229){
	        	return true;
	        }
	       
	        if( evO.e.keyCode==59 || evO.e.keyCode==173 || evO.e.keyCode==50 || evO.e.keyCode==52 || evO.e.keyCode==49 || evO.e.keyCode==189 || evO.e.keyCode==55){
	        	return true;
	        }
	        if(evO.e.shiftKey == true) {
	        	var r=((evO.e.keyCode>=65&&evO.e.keyCode<=90));
	            if(r)return true;
	            r = (evO.e.keyCode==48||evO.e.keyCode==57);
	            if(r)return true;
	            else return false;
	        } 
	        if(evO.e.keyCode==13){
	        	return false;
	        }
	        if(evO.e.shiftKey&&evO.e.keyCode==55)return true;
	        if(evO.e.shiftKey&&evO.e.keyCode==49)return true;
	        if(evO.e.shiftKey&&evO.e.keyCode==189)return true;
	         if(evO.e.shiftKey||evO.e.keyCode==16)return true;
	        
	        var r=(evO.e.keyCode>=48&&evO.e.keyCode<=57);
	        if(r)return true;
	        r = (evO.e.keyCode==32 || evO.e.keyCode==189 || evO.e.keyCode==173 || evO.e.keyCode==188 ||evO.e.keyCode==190 || evO.e.keyCode==220 || evO.e.keyCode==191);
	        if(r)return true;
	        r=(evO.e.keyCode>=96&&evO.e.keyCode<=105);
	        if(r)return true;
	        r=(evO.e.keyCode>=37&&evO.e.keyCode<40);
	        if(r)return true;
	        var r=(evO.e.keyCode>=65&&evO.e.keyCode<=90);
	        if(r)return true;
	        if(evO.e.shiftKey == true) {
	        	if(evO.e.keyCode==49)return true;
	        }
	        var is=M.search(evO.e.keyCode,M.keys);
	        return (is>=0);
	   },
    isBlockName:function(evO){ 
        evO=M.objEvent(evO);
        if(!evO)return false;
        if(evO.e.keyCode==0||evO.e.keyCode==229){
        	return true;// case for tablet
        }
        if(evO.e.shiftKey == true) {
        	var r=((evO.e.keyCode>=65&&evO.e.keyCode<=90));
            if(r)return true;
            r = (evO.e.keyCode==57||evO.e.keyCode==48);
            if(r)return true;
            else return false;
        } 
        if(evO.e.shiftKey&&evO.e.keyCode==9)return true;
        r = (evO.e.keyCode==32);
        if(r)return true;
        r=(evO.e.keyCode>=37&&evO.e.keyCode<40);
        if(r)return true;
        var r=(evO.e.keyCode>=65&&evO.e.keyCode<=90);
        if(r)return true;
        var is=M.search(evO.e.keyCode,M.keys);
        return (is>=0);
    },
    isZipCode:function(evO){
        evO=M.objEvent(evO);
        if(!evO)return false;
        if(evO.e.keyCode==0||evO.e.keyCode==229||evO.e.keyCode==32){
        	return true;// case for tablet
        }
        
        if(evO.e.shiftKey == true) {
        	var r=((evO.e.keyCode>=65&&evO.e.keyCode<=90));
            if(r)return true;
            else return false;
        } 
//        console.log('evO.e.keyCode '+evO.e.keyCode);
        if(evO.e.shiftKey&&evO.e.keyCode==9)return true;
        if(evO.e.shiftKey||evO.e.keyCode==16)return false;
        if(evO.e.keyCode==189 || evO.e.keyCode==173)return true;
        var r=(evO.e.keyCode>=48&&evO.e.keyCode<=57);
        if(r)return true;
        r=(evO.e.keyCode>=96&&evO.e.keyCode<=105);
        if(r)return true;
        r=(evO.e.keyCode>=37&&evO.e.keyCode<=40);
        if(r)return true;
        var r=(evO.e.keyCode>=65&&evO.e.keyCode<=90);
        if(r)return true;
        var is=M.search(evO.e.keyCode,M.keys);
        return (is>=0);
    },
    dateFormat : function () {
        var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
            timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
            timezoneClip = /[^-+\dA-Z]/g,
            pad = function (val, len) {
                val = String(val);
                len = len || 2;
                while (val.length < len) val = "0" + val;
                return val;
            };
        this.masks = {
            "default":"ddd mmm dd yyyy HH:MM:ss",
            shortDate:"m/d/yy",
            mediumDate:"mmm d, yyyy",
            longDate:"mmmm d, yyyy",
            fullDate:"dddd, mmmm d, yyyy",
            shortTime:"h:MM TT",
            mediumTime:"h:MM:ss TT",
            longTime:"h:MM:ss TT Z",
            isoDate:"yyyy-mm-dd",
            isoTime:"HH:MM:ss",
            isoDateTime:"yyyy-mm-dd'T'HH:MM:ss",
            isoUtcDateTime:"UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
        };

        this.i18n = {
            dayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat","Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec","January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        };

        // Regexes and supporting functions are cached through closure
        return function (date, mask, utc) {
            var dF = M.dateFormat;

            // You can't provide utc if you skip other args (use the "UTC:" mask
			// prefix)
            if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
                mask = date;
                date = undefined;
            }

            // Passing date through Date applies Date.parse, if necessary
            date = date ? new Date(date) : new Date;
            if (isNaN(date)) throw SyntaxError("invalid date");

            mask = String(dF.masks[mask] || mask || dF.masks["default"]);

            // Allow setting the utc argument via the mask
            if (mask.slice(0, 4) == "UTC:") {
                mask = mask.slice(4);
                utc = true;
            }

            var _ = utc ? "getUTC" : "get",
                d = date[_ + "Date"](),
                D = date[_ + "Day"](),
                m = date[_ + "Month"](),
                y = date[_ + "FullYear"](),
                H = date[_ + "Hours"](),
                M = date[_ + "Minutes"](),
                s = date[_ + "Seconds"](),
                L = date[_ + "Milliseconds"](),
                o = utc ? 0 : date.getTimezoneOffset(),
                flags = {
                    d:    d,
                    dd:   pad(d),
                    ddd:  dF.i18n.dayNames[D],
                    dddd: dF.i18n.dayNames[D + 7],
                    m:    m + 1,
                    mm:   pad(m + 1),
                    mmm:  dF.i18n.monthNames[m],
                    mmmm: dF.i18n.monthNames[m + 12],
                    yy:   String(y).slice(2),
                    yyyy: y,
                    h:    H % 12 || 12,
                    hh:   pad(H % 12 || 12),
                    H:    H,
                    HH:   pad(H),
                    M:    M,
                    MM:   pad(M),
                    s:    s,
                    ss:   pad(s),
                    l:    pad(L, 3),
                    L:    pad(L > 99 ? Math.round(L / 10) : L),
                    t:    H < 12 ? "a"  : "p",
                    tt:   H < 12 ? "am" : "pm",
                    T:    H < 12 ? "A"  : "P",
                    TT:   H < 12 ? "AM" : "PM",
                    Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                    o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                    S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
                };

            return mask.replace(token, function ($0) {
                return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
            });
        };
    }
};