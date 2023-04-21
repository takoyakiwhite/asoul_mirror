"use strict";var KTBlockUI=function(element,options){var the=this;if(typeof element==="undefined"||element===null){return;}
var defaultOptions={zIndex:false,overlayClass:'',overflow:'hidden',message:'<span class="spinner-border text-primary"></span>'};var _construct=function(){if(KTUtil.data(element).has('blockui')){the=KTUtil.data(element).get('blockui');}else{_init();}}
var _init=function(){the.options=KTUtil.deepExtend({},defaultOptions,options);the.element=element;the.overlayElement=null;the.blocked=false;the.positionChanged=false;the.overflowChanged=false;KTUtil.data(the.element).set('blockui',the);}
var _block=function(){if(KTEventHandler.trigger(the.element,'kt.blockui.block',the)===false){return;}
var isPage=(the.element.tagName==='BODY');var position=KTUtil.css(the.element,'position');var overflow=KTUtil.css(the.element,'overflow');var zIndex=isPage?10000:1;if(the.options.zIndex>0){zIndex=the.options.zIndex;}else{if(KTUtil.css(the.element,'z-index')!='auto'){zIndex=KTUtil.css(the.element,'z-index');}}
the.element.classList.add('blockui');if(position==="absolute"||position==="relative"||position==="fixed"){KTUtil.css(the.element,'position','relative');the.positionChanged=true;}
if(the.options.overflow==='hidden'&&overflow==='visible'){KTUtil.css(the.element,'overflow','hidden');the.overflowChanged=true;}
the.overlayElement=document.createElement('DIV');the.overlayElement.setAttribute('class','blockui-overlay '+the.options.overlayClass);the.overlayElement.innerHTML=the.options.message;KTUtil.css(the.overlayElement,'z-index',zIndex);the.element.append(the.overlayElement);the.blocked=true;KTEventHandler.trigger(the.element,'kt.blockui.after.blocked',the)===false}
var _release=function(){if(KTEventHandler.trigger(the.element,'kt.blockui.release',the)===false){return;}
the.element.classList.add('blockui');if(the.positionChanged){KTUtil.css(the.element,'position','');}
if(the.overflowChanged){KTUtil.css(the.element,'overflow','');}
if(the.overlayElement){KTUtil.remove(the.overlayElement);}
the.blocked=false;KTEventHandler.trigger(the.element,'kt.blockui.released',the);}
var _isBlocked=function(){return the.blocked;}
var _destroy=function(){KTUtil.data(the.element).remove('blockui');}
_construct();the.block=function(){_block();}
the.release=function(){_release();}
the.isBlocked=function(){return _isBlocked();}
the.destroy=function(){return _destroy();}
the.on=function(name,handler){return KTEventHandler.on(the.element,name,handler);}
the.one=function(name,handler){return KTEventHandler.one(the.element,name,handler);}
the.off=function(name){return KTEventHandler.off(the.element,name);}
the.trigger=function(name,event){return KTEventHandler.trigger(the.element,name,event,the,event);}};KTBlockUI.getInstance=function(element){if(element!==null&&KTUtil.data(element).has('blockui')){return KTUtil.data(element).get('blockui');}else{return null;}}
if(typeof module!=='undefined'&&typeof module.exports!=='undefined'){module.exports=KTBlockUI;}
"use strict";var KTCookie=function(){return{get:function(name){var matches=document.cookie.match(new RegExp("(?:^|; )"+name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g,'\\$1')+"=([^;]*)"));return matches?decodeURIComponent(matches[1]):null;},set:function(name,value,options){if(typeof options==="undefined"||options===null){options={};}
options=Object.assign({},{path:'/'},options);if(options.expires instanceof Date){options.expires=options.expires.toUTCString();}
var updatedCookie=encodeURIComponent(name)+"="+encodeURIComponent(value);for(var optionKey in options){if(options.hasOwnProperty(optionKey)===false){continue;}
updatedCookie+="; "+optionKey;var optionValue=options[optionKey];if(optionValue!==true){updatedCookie+="="+optionValue;}}
document.cookie=updatedCookie;},remove:function(name){this.set(name,"",{'max-age':-1});}}}();if(typeof module!=='undefined'&&typeof module.exports!=='undefined'){module.exports=KTCookie;}
"use strict";var KTDialer=function(element,options){var the=this;if(!element){return;}
var defaultOptions={min:null,max:null,step:1,decimals:0,prefix:"",suffix:""};var _construct=function(){if(KTUtil.data(element).has('dialer')===true){the=KTUtil.data(element).get('dialer');}else{_init();}}
var _init=function(){the.options=KTUtil.deepExtend({},defaultOptions,options);the.element=element;the.incElement=the.element.querySelector('[data-kt-dialer-control="increase"]');the.decElement=the.element.querySelector('[data-kt-dialer-control="decrease"]');the.inputElement=the.element.querySelector('input[type]');if(_getOption('decimals')){the.options.decimals=parseInt(_getOption('decimals'));}
if(_getOption('prefix')){the.options.prefix=_getOption('prefix');}
if(_getOption('suffix')){the.options.suffix=_getOption('suffix');}
if(_getOption('step')){the.options.step=parseFloat(_getOption('step'));}
if(_getOption('min')){the.options.min=parseFloat(_getOption('min'));}
if(_getOption('max')){the.options.max=parseFloat(_getOption('max'));}
the.value=parseFloat(the.inputElement.value.replace(/[^\d.]/g,''));_setValue();_handlers();KTUtil.data(the.element).set('dialer',the);}
var _handlers=function(){KTUtil.addEvent(the.incElement,'click',function(e){e.preventDefault();_increase();});KTUtil.addEvent(the.decElement,'click',function(e){e.preventDefault();_decrease();});KTUtil.addEvent(the.inputElement,'input',function(e){e.preventDefault();_setValue();});}
var _increase=function(){KTEventHandler.trigger(the.element,'kt.dialer.increase',the);the.inputElement.value=the.value+the.options.step;_setValue();KTEventHandler.trigger(the.element,'kt.dialer.increased',the);return the;}
var _decrease=function(){KTEventHandler.trigger(the.element,'kt.dialer.decrease',the);the.inputElement.value=the.value-the.options.step;console.log('dec:'+the.inputElement.value);_setValue();KTEventHandler.trigger(the.element,'kt.dialer.decreased',the);return the;}
var _setValue=function(){KTEventHandler.trigger(the.element,'kt.dialer.change',the);the.value=_parse(the.inputElement.value);console.log('min:'+the.options.min);if(the.options.min!==null&&the.value<the.options.min){the.value=the.options.min;console.log('reset: min');}
if(the.options.max!==null&&the.value>the.options.max){the.value=the.options.max;}
the.inputElement.value=_format(the.value);the.inputElement.dispatchEvent(new Event('change'));KTEventHandler.trigger(the.element,'kt.dialer.changed',the);}
var _parse=function(val){val=val.replace(/[^0-9.-]/g,'').replace(/(\..*)\./g,'$1').replace(/(?!^)-/g,'').replace(/^0+(\d)/gm,'$1');val=parseFloat(val);if(isNaN(val)){val=0;}
return val;}
var _format=function(val){console.log('val:'+val);return the.options.prefix+parseFloat(val).toFixed(the.options.decimals)+the.options.suffix;}
var _getOption=function(name){if(the.element.hasAttribute('data-kt-dialer-'+name)===true){var attr=the.element.getAttribute('data-kt-dialer-'+name);var value=attr;return value;}else{return null;}}
var _destroy=function(){KTUtil.data(the.element).remove('dialer');}
_construct();the.increase=function(){return _increase();}
the.decrease=function(){return _decrease();}
the.getElement=function(){return the.element;}
the.destroy=function(){return _destroy();}
the.on=function(name,handler){return KTEventHandler.on(the.element,name,handler);}
the.one=function(name,handler){return KTEventHandler.one(the.element,name,handler);}
the.off=function(name){return KTEventHandler.off(the.element,name);}
the.trigger=function(name,event){return KTEventHandler.trigger(the.element,name,event,the,event);}};KTDialer.getInstance=function(element){if(element!==null&&KTUtil.data(element).has('dialer')){return KTUtil.data(element).get('dialer');}else{return null;}}
KTDialer.createInstances=function(selector='[data-kt-dialer="true"]'){var elements=document.body.querySelectorAll(selector);if(elements&&elements.length>0){for(var i=0,len=elements.length;i<len;i++){new KTDialer(elements[i]);}}}
KTDialer.init=function(){KTDialer.createInstances();};if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',KTDialer.init);}else{KTDialer.init();}
if(typeof module!=='undefined'&&typeof module.exports!=='undefined'){module.exports=KTDialer;}
"use strict";var KTDrawer=function(element,options){var the=this;var body=document.getElementsByTagName("BODY")[0];if(typeof element==="undefined"||element===null){return;}
var defaultOptions={overlay:true,direction:'end',baseClass:'drawer',overlayClass:'drawer-overlay'};var _construct=function(){if(KTUtil.data(element).has('drawer')){the=KTUtil.data(element).get('drawer');}else{_init();}}
var _init=function(){the.options=KTUtil.deepExtend({},defaultOptions,options);the.uid=KTUtil.getUniqueId('drawer');the.element=element;the.overlayElement=null;the.name=the.element.getAttribute('data-kt-drawer-name');the.shown=false;the.lastWidth;the.toggleElement=null;the.element.setAttribute('data-kt-drawer','true');_handlers();_update();KTUtil.data(the.element).set('drawer',the);}
var _handlers=function(){var togglers=_getOption('toggle');var closers=_getOption('close');if(togglers!==null&&togglers.length>0){KTUtil.on(body,togglers,'click',function(e){e.preventDefault();the.toggleElement=this;_toggle();});}
if(closers!==null&&closers.length>0){KTUtil.on(body,closers,'click',function(e){e.preventDefault();the.closeElement=this;_hide();});}}
var _toggle=function(){if(KTEventHandler.trigger(the.element,'kt.drawer.toggle',the)===false){return;}
if(the.shown===true){_hide();}else{_show();}
KTEventHandler.trigger(the.element,'kt.drawer.toggled',the);}
var _hide=function(){if(KTEventHandler.trigger(the.element,'kt.drawer.hide',the)===false){return;}
the.shown=false;_deleteOverlay();body.removeAttribute('data-kt-drawer-'+the.name,'on');body.removeAttribute('data-kt-drawer');KTUtil.removeClass(the.element,the.options.baseClass+'-on');if(the.toggleElement!==null){KTUtil.removeClass(the.toggleElement,'active');}
KTEventHandler.trigger(the.element,'kt.drawer.after.hidden',the)===false}
var _show=function(){if(KTEventHandler.trigger(the.element,'kt.drawer.show',the)===false){return;}
the.shown=true;_createOverlay();body.setAttribute('data-kt-drawer-'+the.name,'on');body.setAttribute('data-kt-drawer','on');KTUtil.addClass(the.element,the.options.baseClass+'-on');if(the.toggleElement!==null){KTUtil.addClass(the.toggleElement,'active');}
KTEventHandler.trigger(the.element,'kt.drawer.shown',the);}
var _update=function(){var width=_getWidth();var direction=_getOption('direction');if(KTUtil.hasClass(the.element,the.options.baseClass+'-on')===true&&String(body.getAttribute('data-kt-drawer-'+the.name+'-'))==='on'){the.shown=true;}else{the.shown=false;}
if(_getOption('activate')===true){KTUtil.addClass(the.element,the.options.baseClass);KTUtil.addClass(the.element,the.options.baseClass+'-'+direction);KTUtil.css(the.element,'width',width,true);the.lastWidth=width;}else{KTUtil.css(the.element,'width','');KTUtil.removeClass(the.element,the.options.baseClass);KTUtil.removeClass(the.element,the.options.baseClass+'-'+direction);_hide();}}
var _createOverlay=function(){if(_getOption('overlay')===true){the.overlayElement=document.createElement('DIV');KTUtil.css(the.overlayElement,'z-index',KTUtil.css(the.element,'z-index')-1);body.append(the.overlayElement);KTUtil.addClass(the.overlayElement,_getOption('overlay-class'));KTUtil.addEvent(the.overlayElement,'click',function(e){e.preventDefault();_hide();});}}
var _deleteOverlay=function(){if(the.overlayElement!==null){KTUtil.remove(the.overlayElement);}}
var _getOption=function(name){if(the.element.hasAttribute('data-kt-drawer-'+name)===true){var attr=the.element.getAttribute('data-kt-drawer-'+name);var value=KTUtil.getResponsiveValue(attr);if(value!==null&&String(value)==='true'){value=true;}else if(value!==null&&String(value)==='false'){value=false;}
return value;}else{var optionName=KTUtil.snakeToCamel(name);if(the.options[optionName]){return KTUtil.getResponsiveValue(the.options[optionName]);}else{return null;}}}
var _getWidth=function(){var width=_getOption('width');if(width==='auto'){width=KTUtil.css(the.element,'width');}
return width;}
var _destroy=function(){KTUtil.data(the.element).remove('drawer');}
_construct();the.toggle=function(){return _toggle();}
the.show=function(){return _show();}
the.hide=function(){return _hide();}
the.isShown=function(){return the.shown;}
the.update=function(){_update();}
the.goElement=function(){return the.element;}
the.destroy=function(){return _destroy();}
the.on=function(name,handler){return KTEventHandler.on(the.element,name,handler);}
the.one=function(name,handler){return KTEventHandler.one(the.element,name,handler);}
the.off=function(name){return KTEventHandler.off(the.element,name);}
the.trigger=function(name,event){return KTEventHandler.trigger(the.element,name,event,the,event);}};KTDrawer.getInstance=function(element){if(element!==null&&KTUtil.data(element).has('drawer')){return KTUtil.data(element).get('drawer');}else{return null;}}
KTDrawer.hideAll=function(skip=null,selector='[data-kt-drawer="true"]'){var items=document.querySelectorAll(selector);if(items&&items.length>0){for(var i=0,len=items.length;i<len;i++){var item=items[i];var drawer=KTDrawer.getInstance(item);if(!drawer){continue;}
if(skip){if(item!==skip){drawer.hide();}}else{drawer.hide();}}}}
KTDrawer.updateAll=function(selector='[data-kt-drawer="true"]'){var items=document.querySelectorAll(selector);if(items&&items.length>0){for(var i=0,len=items.length;i<len;i++){var item=items[i];var drawer=KTDrawer.getInstance(item);if(drawer){drawer.update();;}}}}
KTDrawer.createInstances=function(selector='[data-kt-drawer="true"]'){var body=document.getElementsByTagName("BODY")[0];var elements=body.querySelectorAll(selector);var drawer;if(elements&&elements.length>0){for(var i=0,len=elements.length;i<len;i++){drawer=new KTDrawer(elements[i]);}}}
KTDrawer.handleShow=function(){KTUtil.on(document.body,'[data-kt-drawer-show="true"][data-kt-drawer-target]','click',function(e){var element=document.querySelector(this.getAttribute('data-kt-drawer-target'));if(element){KTDrawer.getInstance(element).show();}});}
KTDrawer.handleDismiss=function(){KTUtil.on(document.body,'[data-kt-drawer-dismiss="true"]','click',function(e){var element=this.closest('[data-kt-drawer="true"]');if(element){var drawer=KTDrawer.getInstance(element);if(drawer.isShown()){drawer.hide();}}});}
window.addEventListener('resize',function(){var timer;var body=document.getElementsByTagName("BODY")[0];KTUtil.throttle(timer,function(){var elements=body.querySelectorAll('[data-kt-drawer="true"]');if(elements&&elements.length>0){for(var i=0,len=elements.length;i<len;i++){var drawer=KTDrawer.getInstance(elements[i]);if(drawer){drawer.update();}}}},200);});KTDrawer.init=function(){KTDrawer.createInstances();KTDrawer.handleShow();KTDrawer.handleDismiss();};if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',KTDrawer.init);}else{KTDrawer.init();}
if(typeof module!=='undefined'&&typeof module.exports!=='undefined'){module.exports=KTDrawer;}
"use strict";var KTEventHandler=function(){var _handlers={};var _triggerEvent=function(element,name,target,e){if(KTUtil.data(element).has(name)===true){var handlerId=KTUtil.data(element).get(name);if(_handlers[name]&&_handlers[name][handlerId]){var handler=_handlers[name][handlerId];if(handler.name===name){if(handler.one==true){if(handler.fired==false){_handlers[name][handlerId].fired=true;return handler.callback.call(this,target,e);}}else{return handler.callback.call(this,target,e);}}}}
return null;}
var _addEvent=function(element,name,callback,one){var handlerId=KTUtil.getUniqueId('event');KTUtil.data(element).set(name,handlerId);if(!_handlers[name]){_handlers[name]={};}
_handlers[name][handlerId]={name:name,callback:callback,one:one,fired:false};}
var _removeEvent=function(element,name){var handlerId=KTUtil.data(element).get(name);if(_handlers[name]&&_handlers[name][handlerId]){delete _handlers[name][handlerId];}}
return{trigger:function(element,name,target,e){return _triggerEvent(element,name,target,e);},on:function(element,name,handler){return _addEvent(element,name,handler);},one:function(element,name,handler){return _addEvent(element,name,handler,true);},off:function(element,name){return _removeEvent(element,name);},debug:function(){for(var b in _handlers){if(_handlers.hasOwnProperty(b))console.log(b);}}}}();if(typeof module!=='undefined'&&typeof module.exports!=='undefined'){module.exports=KTEventHandler;}
"use strict";var KTFeedback=function(options){var the=this;var body=document.getElementsByTagName("BODY")[0];var defaultOptions={'width':100,'placement':'top-center','content':'','type':'popup'};var _construct=function(){_init();}
var _init=function(){the.options=KTUtil.deepExtend({},defaultOptions,options);the.uid=KTUtil.getUniqueId('feedback');the.element;the.shown=false;_handlers();KTUtil.data(the.element).set('feedback',the);}
var _handlers=function(){KTUtil.addEvent(the.element,'click',function(e){e.preventDefault();_go();});}
var _show=function(){if(KTEventHandler.trigger(the.element,'kt.feedback.show',the)===false){return;}
if(the.options.type==='popup'){_showPopup();}
KTEventHandler.trigger(the.element,'kt.feedback.shown',the);return the;}
var _hide=function(){if(KTEventHandler.trigger(the.element,'kt.feedback.hide',the)===false){return;}
if(the.options.type==='popup'){_hidePopup();}
the.shown=false;KTEventHandler.trigger(the.element,'kt.feedback.hidden',the);return the;}
var _showPopup=function(){the.element=document.createElement("DIV");KTUtil.addClass(the.element,'feedback feedback-popup');KTUtil.setHTML(the.element,the.options.content);if(the.options.placement=='top-center'){_setPopupTopCenterPosition();}
body.appendChild(the.element);KTUtil.addClass(the.element,'feedback-shown');the.shown=true;}
var _setPopupTopCenterPosition=function(){var width=KTUtil.getResponsiveValue(the.options.width);var height=KTUtil.css(the.element,'height');KTUtil.addClass(the.element,'feedback-top-center');KTUtil.css(the.element,'width',width);KTUtil.css(the.element,'left','50%');KTUtil.css(the.element,'top','-'+height);}
var _hidePopup=function(){the.element.remove();}
var _destroy=function(){KTUtil.data(the.element).remove('feedback');}
_construct();the.show=function(){return _show();}
the.hide=function(){return _hide();}
the.isShown=function(){return the.shown;}
the.getElement=function(){return the.element;}
the.destroy=function(){return _destroy();}
the.on=function(name,handler){return KTEventHandler.on(the.element,name,handler);}
the.one=function(name,handler){return KTEventHandler.one(the.element,name,handler);}
the.off=function(name){return KTEventHandler.off(the.element,name);}
the.trigger=function(name,event){return KTEventHandler.trigger(the.element,name,event,the,event);}};if(typeof module!=='undefined'&&typeof module.exports!=='undefined'){module.exports=KTFeedback;}
"use strict";var KTImageInput=function(element,options){var the=this;if(typeof element==="undefined"||element===null){return;}
var defaultOptions={};var _construct=function(){if(KTUtil.data(element).has('image-input')===true){the=KTUtil.data(element).get('image-input');}else{_init();}}
var _init=function(){the.options=KTUtil.deepExtend({},defaultOptions,options);the.uid=KTUtil.getUniqueId('image-input');the.element=element;the.inputElement=KTUtil.find(element,'input[type="file"]');the.wrapperElement=KTUtil.find(element,'.image-input-wrapper');the.cancelElement=KTUtil.find(element,'[data-kt-image-input-action="cancel"]');the.removeElement=KTUtil.find(element,'[data-kt-image-input-action="remove"]');the.hiddenElement=KTUtil.find(element,'input[type="hidden"]');the.src=KTUtil.css(the.wrapperElement,'backgroundImage');the.element.setAttribute('data-kt-image-input','true');_handlers();KTUtil.data(the.element).set('image-input',the);}
var _handlers=function(){KTUtil.addEvent(the.inputElement,'change',_change);KTUtil.addEvent(the.cancelElement,'click',_cancel);KTUtil.addEvent(the.removeElement,'click',_remove);}
var _change=function(e){e.preventDefault();if(the.inputElement!==null&&the.inputElement.files&&the.inputElement.files[0]){if(KTEventHandler.trigger(the.element,'kt.imageinput.change',the)===false){return;}
var reader=new FileReader();reader.onload=function(e){KTUtil.css(the.wrapperElement,'background-image','url('+e.target.result+')');}
reader.readAsDataURL(the.inputElement.files[0]);KTUtil.addClass(the.element,'image-input-changed');KTUtil.removeClass(the.element,'image-input-empty');KTEventHandler.trigger(the.element,'kt.imageinput.changed',the);}}
var _cancel=function(e){e.preventDefault();if(KTEventHandler.trigger(the.element,'kt.imageinput.cancel',the)===false){return;}
KTUtil.removeClass(the.element,'image-input-changed');KTUtil.removeClass(the.element,'image-input-empty');KTUtil.css(the.wrapperElement,'background-image',the.src);the.inputElement.value="";if(the.hiddenElement!==null){the.hiddenElement.value="0";}
KTEventHandler.trigger(the.element,'kt.imageinput.canceled',the);}
var _remove=function(e){e.preventDefault();if(KTEventHandler.trigger(the.element,'kt.imageinput.remove',the)===false){return;}
KTUtil.removeClass(the.element,'image-input-changed');KTUtil.addClass(the.element,'image-input-empty');KTUtil.css(the.wrapperElement,'background-image',"none");the.inputElement.value="";if(the.hiddenElement!==null){the.hiddenElement.value="1";}
KTEventHandler.trigger(the.element,'kt.imageinput.removed',the);}
var _destroy=function(){KTUtil.data(the.element).remove('image-input');}
_construct();the.getInputElement=function(){return the.inputElement;}
the.goElement=function(){return the.element;}
the.destroy=function(){return _destroy();}
the.on=function(name,handler){return KTEventHandler.on(the.element,name,handler);}
the.one=function(name,handler){return KTEventHandler.one(the.element,name,handler);}
the.off=function(name){return KTEventHandler.off(the.element,name);}
the.trigger=function(name,event){return KTEventHandler.trigger(the.element,name,event,the,event);}};KTImageInput.getInstance=function(element){if(element!==null&&KTUtil.data(element).has('image-input')){return KTUtil.data(element).get('image-input');}else{return null;}}
KTImageInput.createInstances=function(selector='[data-kt-image-input]'){var elements=document.querySelectorAll(selector);if(elements&&elements.length>0){for(var i=0,len=elements.length;i<len;i++){new KTImageInput(elements[i]);}}}
KTImageInput.init=function(){KTImageInput.createInstances();};if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',KTImageInput.init);}else{KTImageInput.init();}
if(typeof module!=='undefined'&&typeof module.exports!=='undefined'){module.exports=KTImageInput;}
"use strict";var KTMenu=function(element,options){var the=this;if(typeof element==="undefined"||element===null){return;}
var defaultOptions={dropdown:{hoverTimeout:200,zindex:105},accordion:{slideSpeed:250,expand:false}};var _construct=function(){if(KTUtil.data(element).has('menu')===true){the=KTUtil.data(element).get('menu');}else{_init();}}
var _init=function(){the.options=KTUtil.deepExtend({},defaultOptions,options);the.uid=KTUtil.getUniqueId('menu');the.element=element;the.triggerElement;the.element.setAttribute('data-kt-menu','true');_setTriggerElement();_update();KTUtil.data(the.element).set('menu',the);}
var _destroy=function(){}
var _click=function(element,e){e.preventDefault();var item=_getItemElement(element);if(_getItemOption(item,'trigger')!=='click'){return;}
if(_getItemOption(item,'toggle')===false){_show(item);}else{_toggle(item);}}
var _link=function(element,e){if(KTEventHandler.trigger(the.element,'kt.menu.link.click',the)===false){return;}
KTMenu.hideDropdowns();KTEventHandler.trigger(the.element,'kt.menu.link.clicked',the);}
var _dismiss=function(element,e){var item=_getItemElement(element);var items=_getItemChildElements(item);if(item!==null&&_getItemSubType(item)==='dropdown'){_hide(item);if(items.length>0){for(var i=0,len=items.length;i<len;i++){if(items[i]!==null&&_getItemSubType(items[i])==='dropdown'){_hide(tems[i]);}}}}}
var _mouseover=function(element,e){var item=_getItemElement(element);if(item===null){return;}
if(_getItemOption(item,'trigger')!=='hover'){return;}
if(KTUtil.data(item).get('hover')==='1'){clearTimeout(KTUtil.data(item).get('timeout'));KTUtil.data(item).remove('hover');KTUtil.data(item).remove('timeout');}
_show(item);}
var _mouseout=function(element,e){var item=_getItemElement(element);if(item===null){return;}
if(_getItemOption(item,'trigger')!=='hover'){return;}
var timeout=setTimeout(function(){if(KTUtil.data(item).get('hover')==='1'){_hide(item);}},the.options.dropdown.hoverTimeout);KTUtil.data(item).set('hover','1');KTUtil.data(item).set('timeout',timeout);}
var _toggle=function(item){if(!item){item=the.triggerElement;}
if(_isItemSubShown(item)===true){_hide(item);}else{_show(item);}}
var _show=function(item){if(!item){item=the.triggerElement;}
if(_isItemSubShown(item)===true){return;}
if(_getItemSubType(item)==='dropdown'){_showDropdown(item);}else if(_getItemSubType(item)==='accordion'){_showAccordion(item);}
KTUtil.data(item).set('type',_getItemSubType(item));}
var _hide=function(item){if(!item){item=the.triggerElement;}
if(_isItemSubShown(item)===false){return;}
if(_getItemSubType(item)==='dropdown'){_hideDropdown(item);}else if(_getItemSubType(item)==='accordion'){_hideAccordion(item);}}
var _reset=function(item){if(_hasItemSub(item)===false){return;}
var sub=_getItemSubElement(item);if(KTUtil.data(item).has('type')&&KTUtil.data(item).get('type')!==_getItemSubType(item)){KTUtil.removeClass(item,'hover');KTUtil.removeClass(item,'show');KTUtil.removeClass(sub,'show');}}
var _update=function(){var items=the.element.querySelectorAll('.menu-item[data-kt-menu-trigger]');if(items&&items.length>0){for(var i=0,len=items.length;i<len;i++){_reset(items[i]);}}}
var _setTriggerElement=function(){var target=document.querySelector('[data-kt-menu-target="# '+the.element.getAttribute('id')+'"]');if(target!==null){the.triggerElement=target;}else if(the.element.closest('[data-kt-menu-trigger]')){the.triggerElement=the.element.closest('[data-kt-menu-trigger]');}else if(the.element.parentNode&&KTUtil.child(the.element.parentNode,'[data-kt-menu-trigger]')){the.triggerElement=KTUtil.child(the.element.parentNode,'[data-kt-menu-trigger]');}
if(the.triggerElement){KTUtil.data(the.triggerElement).set('menu',the);}}
var _isTriggerElement=function(item){return(the.triggerElement===item)?true:false;}
var _isItemSubShown=function(item){var sub=_getItemSubElement(item);if(sub!==null){if(_getItemSubType(item)==='dropdown'){if(KTUtil.hasClass(sub,'show')===true&&sub.hasAttribute('data-popper-placement')===true){return true;}else{return false;}}else{return KTUtil.hasClass(item,'show');}}else{return false;}}
var _isItemDropdownPermanent=function(item){return _getItemOption(item,'permanent')===true?true:false;}
var _isItemParentShown=function(item){return KTUtil.parents(item,'.menu-item.show').length>0;}
var _isItemSubElement=function(item){return KTUtil.hasClass(item,'menu-sub');}
var _hasItemSub=function(item){return(KTUtil.hasClass(item,'menu-item')&&item.hasAttribute('data-kt-menu-trigger'));}
var _getItemLinkElement=function(item){return KTUtil.child(item,'.menu-link');}
var _getItemToggleElement=function(item){if(the.triggerElement){return the.triggerElement;}else{return _getItemLinkElement(item);}}
var _getItemSubElement=function(item){if(_isTriggerElement(item)===true){return the.element;}if(item.classList.contains('menu-sub')===true){return item;}else if(KTUtil.data(item).has('sub')){return KTUtil.data(item).get('sub');}else{return KTUtil.child(item,'.menu-sub');}}
var _getItemSubType=function(element){var sub=_getItemSubElement(element);if(sub&&parseInt(KTUtil.css(sub,'z-index'))>0){return "dropdown";}else{return "accordion";}}
var _getItemElement=function(element){var item,sub;if(_isTriggerElement(element)){return element;}
if(element.hasAttribute('data-kt-menu-trigger')){return element;}
if(KTUtil.data(element).has('item')){return KTUtil.data(element).get('item');}
if((item=element.closest('.menu-item[data-kt-menu-trigger]'))){return item;}
if((sub=element.closest('.menu-sub'))){if(KTUtil.data(sub).has('item')===true){return KTUtil.data(sub).get('item')}}}
var _getItemParentElement=function(item){var sub=item.closest('.menu-sub');var parentItem;if(KTUtil.data(sub).has('item')){return KTUtil.data(sub).get('item');}
if(sub&&(parentItem=sub.closest('.menu-item[data-kt-menu-trigger]'))){return parentItem;}
return null;}
var _getItemParentElements=function(item){var parents=[];var parent;var i=0;do{parent=_getItemParentElement(item);if(parent){parents.push(parent);item=parent;}
i++;}while(parent!==null&&i<20);if(the.triggerElement){parents.unshift(the.triggerElement);}
return parents;}
var _getItemChildElement=function(item){var selector=item;var element;if(KTUtil.data(item).get('sub')){selector=KTUtil.data(item).get('sub');}
if(selector!==null){element=selector.querySelector('.menu-item[data-kt-menu-trigger]');if(element){return element;}else{return null;}}else{return null;}}
var _getItemChildElements=function(item){var children=[];var child;var i=0;do{child=_getItemChildElement(item);if(child){children.push(child);item=child;}
i++;}while(child!==null&&i<20);return children;}
var _showDropdown=function(item){if(KTEventHandler.trigger(the.element,'kt.menu.dropdown.show',item)===false){return;}
KTMenu.hideDropdowns(item);var toggle=_isTriggerElement(item)?item:_getItemLinkElement(item);var sub=_getItemSubElement(item);var width=_getItemOption(item,'width');var height=_getItemOption(item,'height');var zindex=the.options.dropdown.zindex;var parentZindex=KTUtil.getHighestZindex(item);if(parentZindex!==null&&parentZindex>=zindex){zindex=parentZindex+1;}
if(zindex>0){KTUtil.css(sub,'z-index',zindex);}
if(width!==null){KTUtil.css(sub,'width',width);}
if(height!==null){KTUtil.css(sub,'height',height);}
KTUtil.css(sub,'display','');KTUtil.css(sub,'overflow','');_initDropdownPopper(item,sub);KTUtil.addClass(item,'show');KTUtil.addClass(item,'menu-dropdown');KTUtil.addClass(sub,'show');if(_getItemOption(item,'overflow')===true){document.body.appendChild(sub);KTUtil.data(item).set('sub',sub);KTUtil.data(sub).set('item',item);KTUtil.data(sub).set('menu',the);}else{KTUtil.data(sub).set('item',item);}
KTEventHandler.trigger(the.element,'kt.menu.dropdown.shown',item);}
var _hideDropdown=function(item){if(KTEventHandler.trigger(the.element,'kt.menu.dropdown.hide',item)===false){return;}
var sub=_getItemSubElement(item);KTUtil.css(sub,'z-index','');KTUtil.css(sub,'width','');KTUtil.css(sub,'height','');KTUtil.removeClass(item,'show');KTUtil.removeClass(item,'menu-dropdown');KTUtil.removeClass(sub,'show');if(_getItemOption(item,'overflow')===true){if(item.classList.contains('menu-item')){item.appendChild(sub);}else{KTUtil.insertAfter(the.element,item);}
KTUtil.data(item).remove('sub');KTUtil.data(sub).remove('item');KTUtil.data(sub).remove('menu');}
_destroyDropdownPopper(item);KTEventHandler.trigger(the.element,'kt.menu.dropdown.hidden',item);}
var _initDropdownPopper=function(item,sub){var reference;var attach=_getItemOption(item,'attach');if(attach){if(attach==='parent'){reference=item.parentNode;}else{reference=document.querySelector(attach);}}else{reference=item;}
var popper=Popper.createPopper(reference,sub,_getDropdownPopperConfig(item));KTUtil.data(item).set('popper',popper);}
var _destroyDropdownPopper=function(item){if(KTUtil.data(item).has('popper')===true){KTUtil.data(item).get('popper').destroy();KTUtil.data(item).remove('popper');}}
var _getDropdownPopperConfig=function(item){var placement=_getItemOption(item,'placement');if(!placement){placement='right';}
var offsetValue=_getItemOption(item,'offset');var offset=offsetValue?offsetValue.split(","):[];var strategy=_getItemOption(item,'overflow')===true?'absolute':'fixed';var altAxis=_getItemOption(item,'flip')!==false?true:false;var popperConfig={placement:placement,strategy:strategy,modifiers:[{name:'offset',options:{offset:offset}},{name:'preventOverflow',options:{altAxis:altAxis}},{name:'flip',options:{flipVariations:false}}]};return popperConfig;}
var _showAccordion=function(item){if(KTEventHandler.trigger(the.element,'kt.menu.accordion.show',item)===false){return;}
if(the.options.accordion.expand===false){_hideAccordions(item);}
var sub=_getItemSubElement(item);if(KTUtil.data(item).has('popper')===true){_hideDropdown(item);}
KTUtil.addClass(item,'hover');KTUtil.addClass(item,'showing');KTUtil.slideDown(sub,the.options.accordion.slideSpeed,function(){KTUtil.removeClass(item,'showing');KTUtil.addClass(item,'show');KTUtil.addClass(sub,'show');KTEventHandler.trigger(the.element,'kt.menu.accordion.shown',item);});}
var _hideAccordion=function(item){if(KTEventHandler.trigger(the.element,'kt.menu.accordion.hide',item)===false){return;}
var sub=_getItemSubElement(item);KTUtil.addClass(item,'hiding');KTUtil.slideUp(sub,the.options.accordion.slideSpeed,function(){KTUtil.removeClass(item,'hiding');KTUtil.removeClass(item,'show');KTUtil.removeClass(sub,'show');KTUtil.removeClass(item,'hover');KTEventHandler.trigger(the.element,'kt.menu.accordion.hidden',item);});}
var _hideAccordions=function(item){var itemsToHide=KTUtil.findAll(the.element,'.show[data-kt-menu-trigger]');var itemToHide;if(itemsToHide&&itemsToHide.length>0){for(var i=0,len=itemsToHide.length;i<len;i++){itemToHide=itemsToHide[i];if(_getItemSubType(itemToHide)==='accordion'&&itemToHide!==item&&item.contains(itemToHide)===false&&itemToHide.contains(item)===false){_hideAccordion(itemToHide);}}}}
var _getItemOption=function(item,name){var attr;var value=null;if(item&&item.hasAttribute('data-kt-menu-'+name)){attr=item.getAttribute('data-kt-menu-'+name);value=KTUtil.getResponsiveValue(attr);if(value!==null&&String(value)==='true'){value=true;}else if(value!==null&&String(value)==='false'){value=false;}}
return value;}
var _destroy=function(){KTUtil.data(the.element).remove('menu');}
_construct();the.click=function(element,e){return _click(element,e);}
the.link=function(element,e){return _link(element,e);}
the.dismiss=function(element,e){return _dismiss(element,e);}
the.mouseover=function(element,e){return _mouseover(element,e);}
the.mouseout=function(element,e){return _mouseout(element,e);}
the.getItemTriggerType=function(item){return _getItemOption(item,'trigger');}
the.getItemSubType=function(element){return _getItemSubType(element);}
the.show=function(item){return _show(item);}
the.hide=function(item){return _hide(item);}
the.reset=function(item){return _reset(item);}
the.update=function(){return _update();}
the.getElement=function(){return the.element;}
the.getItemLinkElement=function(item){return _getItemLinkElement(item);}
the.getItemToggleElement=function(item){return _getItemToggleElement(item);}
the.getItemSubElement=function(item){return _getItemSubElement(item);}
the.getItemParentElements=function(item){return _getItemParentElements(item);}
the.isItemSubShown=function(item){return _isItemSubShown(item);}
the.isItemParentShown=function(item){return _isItemParentShown(item);}
the.getTriggerElement=function(){return the.triggerElement;}
the.isItemDropdownPermanent=function(item){return _isItemDropdownPermanent(item);}
the.destroy=function(){return _destroy();}
the.hideAccordions=function(item){return _hideAccordions(item);}
the.on=function(name,handler){return KTEventHandler.on(the.element,name,handler);}
the.one=function(name,handler){return KTEventHandler.one(the.element,name,handler);}
the.off=function(name){return KTEventHandler.off(the.element,name);}};KTMenu.getInstance=function(element){var menu;var item;if(KTUtil.data(element).has('menu')){return KTUtil.data(element).get('menu');}
if(menu=element.closest('.menu')){if(KTUtil.data(menu).has('menu')){return KTUtil.data(menu).get('menu');}}
if(KTUtil.hasClass(element,'menu-link')){var sub=element.closest('.menu-sub');if(KTUtil.data(sub).has('menu')){return KTUtil.data(sub).get('menu');}}
return null;}
KTMenu.hideDropdowns=function(skip){var items=document.querySelectorAll('.show.menu-dropdown[data-kt-menu-trigger]');if(items&&items.length>0){for(var i=0,len=items.length;i<len;i++){var item=items[i];var menu=KTMenu.getInstance(item);if(menu&&menu.getItemSubType(item)==='dropdown'){if(skip){if(menu.getItemSubElement(item).contains(skip)===false&&item.contains(skip)===false&&item!==skip){menu.hide(item);}}else{menu.hide(item);}}}}}
KTMenu.updateDropdowns=function(){var items=document.querySelectorAll('.show.menu-dropdown[data-kt-menu-trigger]');if(items&&items.length>0){for(var i=0,len=items.length;i<len;i++){var item=items[i];if(KTUtil.data(item).has('popper')){KTUtil.data(item).get('popper').forceUpdate();}}}}
KTMenu.initGlobalHandlers=function(){document.addEventListener("click",function(e){var items=document.querySelectorAll('.show.menu-dropdown[data-kt-menu-trigger]');var menu;var item;var sub;var menuObj;if(items&&items.length>0){for(var i=0,len=items.length;i<len;i++){item=items[i];menuObj=KTMenu.getInstance(item);if(menuObj&&menuObj.getItemSubType(item)==='dropdown'){menu=menuObj.getElement();sub=menuObj.getItemSubElement(item);if(item===e.target||item.contains(e.target)){continue;}
if(sub===e.target||sub.contains(e.target)){continue;}
menuObj.hide(item);}}}});KTUtil.on(document.body,'.menu-item[data-kt-menu-trigger] > .menu-link, [data-kt-menu-trigger]:not(.menu-item):not([data-kt-menu-trigger="auto"])','click',function(e){var menu=KTMenu.getInstance(this);if(menu!==null){return menu.click(this,e);}});KTUtil.on(document.body,'.menu-item:not([data-kt-menu-trigger]) > .menu-link','click',function(e){var menu=KTMenu.getInstance(this);if(menu!==null){return menu.link(this,e);}});KTUtil.on(document.body,'[data-kt-menu-dismiss="true"]','click',function(e){var menu=KTMenu.getInstance(this);if(menu!==null){return menu.dismiss(this,e);}});KTUtil.on(document.body,'[data-kt-menu-trigger], .menu-sub','mouseover',function(e){var menu=KTMenu.getInstance(this);if(menu!==null&&menu.getItemSubType(this)==='dropdown'){return menu.mouseover(this,e);}});KTUtil.on(document.body,'[data-kt-menu-trigger], .menu-sub','mouseout',function(e){var menu=KTMenu.getInstance(this);if(menu!==null&&menu.getItemSubType(this)==='dropdown'){return menu.mouseout(this,e);}});window.addEventListener('resize',function(){var menu;var timer;KTUtil.throttle(timer,function(){var elements=document.querySelectorAll('[data-kt-menu="true"]');if(elements&&elements.length>0){for(var i=0,len=elements.length;i<len;i++){menu=KTMenu.getInstance(elements[i]);if(menu){menu.update();}}}},200);});}
KTMenu.createInstances=function(selector='[data-kt-menu="true"]'){var elements=document.querySelectorAll(selector);if(elements&&elements.length>0){for(var i=0,len=elements.length;i<len;i++){new KTMenu(elements[i]);}}}
KTMenu.init=function(){KTMenu.initGlobalHandlers();KTMenu.createInstances();};if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',KTMenu.init);}else{KTMenu.init();}
if(typeof module!=='undefined'&&typeof module.exports!=='undefined'){module.exports=KTMenu;}
"use strict";var KTPasswordMeter=function(element,options){var the=this;if(!element){return;}
var defaultOptions={minLength:8,checkUppercase:true,checkLowercase:true,checkDigit:true,checkChar:true,scoreHighlightClass:'active'};var _construct=function(){if(KTUtil.data(element).has('password-meter')===true){the=KTUtil.data(element).get('password-meter');}else{_init();}}
var _init=function(){the.options=KTUtil.deepExtend({},defaultOptions,options);the.score=0;the.checkSteps=5;the.element=element;the.inputElement=the.element.querySelector('input[type]');the.visibilityElement=the.element.querySelector('[data-kt-password-meter-control="visibility"]');the.highlightElement=the.element.querySelector('[data-kt-password-meter-control="highlight"]');the.element.setAttribute('data-kt-password-meter','true');_handlers();KTUtil.data(the.element).set('password-meter',the);}
var _handlers=function(){the.inputElement.addEventListener('input',function(){_check();});if(the.visibilityElement){the.visibilityElement.addEventListener('click',function(){_visibility();});}}
var _check=function(){var score=0;var checkScore=_getCheckScore();if(_checkLength()===true){score=score+checkScore;}
if(the.options.checkUppercase===true&&_checkLowercase()===true){score=score+checkScore;}
if(the.options.checkLowercase===true&&_checkUppercase()===true){score=score+checkScore;}
if(the.options.checkDigit===true&&_checkDigit()===true){score=score+checkScore;}
if(the.options.checkChar===true&&_checkChar()===true){score=score+checkScore;}
the.score=score;_highlight();}
var _checkLength=function(){return the.inputElement.value.length>=the.options.minLength;}
var _checkLowercase=function(){return /[a-z]/.test(the.inputElement.value);}
var _checkUppercase=function(){return /[A-Z]/.test(the.inputElement.value);}
var _checkDigit=function(){return /[0-9]/.test(the.inputElement.value);}
var _checkChar=function(){return /[~`!#$@%\^&*_+=\-\[\]\\';,/(){}|\\":<>\?]/g.test(the.inputElement.value);}
var _getCheckScore=function(){var count=1;if(the.options.checkUppercase===true){count++;}
if(the.options.checkLowercase===true){count++;}
if(the.options.checkDigit===true){count++;}
if(the.options.checkChar===true){count++;}
the.checkSteps=count;return 100/the.checkSteps;}
var _highlight=function(){var items=[].slice.call(the.highlightElement.querySelectorAll('div'));var total=items.length;var index=0;var checkScore=_getCheckScore();var score=_getScore();items.map(function(item){index++;if((checkScore*index*(the.checkSteps/total))<=score){item.classList.add('active');}else{item.classList.remove('active');}});}
var _visibility=function(){var visibleIcon=the.visibilityElement.querySelector('i:not(.d-none), .svg-icon:not(.d-none)');var hiddenIcon=the.visibilityElement.querySelector('i.d-none, .svg-icon.d-none');if(the.inputElement.getAttribute('type').toLowerCase()==='password'){the.inputElement.setAttribute('type','text');}else{the.inputElement.setAttribute('type','password');}
visibleIcon.classList.add('d-none');hiddenIcon.classList.remove('d-none');the.inputElement.focus();}
var _reset=function(){the.score=0;_highlight();}
var _getScore=function(){return the.score;}
var _destroy=function(){KTUtil.data(the.element).remove('password-meter');}
_construct();the.check=function(){return _check();}
the.getScore=function(){return _getScore();}
the.reset=function(){return _reset();}
the.destroy=function(){return _destroy();}};KTPasswordMeter.getInstance=function(element){if(element!==null&&KTUtil.data(element).has('password-meter')){return KTUtil.data(element).get('password-meter');}else{return null;}}
KTPasswordMeter.createInstances=function(selector='[data-kt-password-meter]'){var elements=document.body.querySelectorAll(selector);if(elements&&elements.length>0){for(var i=0,len=elements.length;i<len;i++){new KTPasswordMeter(elements[i]);}}}
KTPasswordMeter.init=function(){KTPasswordMeter.createInstances();};if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',KTPasswordMeter.init);}else{KTPasswordMeter.init();}
if(typeof module!=='undefined'&&typeof module.exports!=='undefined'){module.exports=KTPasswordMeter;}
"use strict";var KTScroll=function(element,options){var the=this;var body=document.getElementsByTagName("BODY")[0];if(!element){return;}
var defaultOptions={saveState:true};var _construct=function(){if(KTUtil.data(element).has('scroll')){the=KTUtil.data(element).get('scroll');}else{_init();}}
var _init=function(){the.options=KTUtil.deepExtend({},defaultOptions,options);the.element=element;the.id=the.element.getAttribute('id');the.element.setAttribute('data-kt-scroll','true');_update();KTUtil.data(the.element).set('scroll',the);}
var _setupHeight=function(){var heightType=_getHeightType();var height=_getHeight();if(height!==null&&height.length>0){KTUtil.css(the.element,heightType,height);}else{KTUtil.css(the.element,heightType,'');}}
var _setupState=function(){if(_getOption('save-state')===true&&typeof KTCookie!=='undefined'&&the.id){if(KTCookie.get(the.id+'st')){var pos=parseInt(KTCookie.get(the.id+'st'));if(pos>0){the.element.scrollTop=pos;}}}}
var _setupScrollHandler=function(){if(_getOption('save-state')===true&&typeof KTCookie!=='undefined'&&the.id){the.element.addEventListener('scroll',_scrollHandler);}else{the.element.removeEventListener('scroll',_scrollHandler);}}
var _destroyScrollHandler=function(){the.element.removeEventListener('scroll',_scrollHandler);}
var _resetHeight=function(){KTUtil.css(the.element,_getHeightType(),'');}
var _scrollHandler=function(){KTCookie.set(the.id+'st',the.element.scrollTop);}
var _update=function(){if(_getOption('activate')===true||the.element.hasAttribute('data-kt-scroll-activate')===false){_setupHeight();_setupScrollHandler();_setupState();}else{_resetHeight()
_destroyScrollHandler();}}
var _getHeight=function(){var height=_getOption(_getHeightType());if(height instanceof Function){return height.call();}else if(height!==null&&typeof height==='string'&&height.toLowerCase()==='auto'){return _getAutoHeight();}else{return height;}}
var _getAutoHeight=function(){var height=KTUtil.getViewPort().height;var dependencies=_getOption('dependencies');var wrappers=_getOption('wrappers');var offset=_getOption('offset');if(dependencies!==null){var elements=document.querySelectorAll(dependencies);if(elements&&elements.length>0){for(var i=0,len=elements.length;i<len;i++){var element=elements[i];if(KTUtil.visible(element)===false){continue;}
height=height-parseInt(KTUtil.css(element,'height'));height=height-parseInt(KTUtil.css(element,'margin-top'));height=height-parseInt(KTUtil.css(element,'margin-bottom'));if(KTUtil.css(element,'border-top')){height=height-parseInt(KTUtil.css(element,'border-top'));}
if(KTUtil.css(element,'border-bottom')){height=height-parseInt(KTUtil.css(element,'border-bottom'));}}}}
if(wrappers!==null){var elements=document.querySelectorAll(wrappers);if(elements&&elements.length>0){for(var i=0,len=elements.length;i<len;i++){var element=elements[i];if(KTUtil.visible(element)===false){continue;}
height=height-parseInt(KTUtil.css(element,'margin-top'));height=height-parseInt(KTUtil.css(element,'margin-bottom'));height=height-parseInt(KTUtil.css(element,'padding-top'));height=height-parseInt(KTUtil.css(element,'padding-bottom'));if(KTUtil.css(element,'border-top')){height=height-parseInt(KTUtil.css(element,'border-top'));}
if(KTUtil.css(element,'border-bottom')){height=height-parseInt(KTUtil.css(element,'border-bottom'));}}}}
if(offset!==null){height=height-parseInt(offset);}
height=height-parseInt(KTUtil.css(the.element,'margin-top'));height=height-parseInt(KTUtil.css(the.element,'margin-bottom'));if(KTUtil.css(element,'border-top')){height=height-parseInt(KTUtil.css(element,'border-top'));}
if(KTUtil.css(element,'border-bottom')){height=height-parseInt(KTUtil.css(element,'border-bottom'));}
height=String(height)+'px';return height;}
var _getOption=function(name){if(the.element.hasAttribute('data-kt-scroll-'+name)===true){var attr=the.element.getAttribute('data-kt-scroll-'+name);var value=KTUtil.getResponsiveValue(attr);if(value!==null&&String(value)==='true'){value=true;}else if(value!==null&&String(value)==='false'){value=false;}
return value;}else{var optionName=KTUtil.snakeToCamel(name);if(the.options[optionName]){return KTUtil.getResponsiveValue(the.options[optionName]);}else{return null;}}}
var _getHeightType=function(){if(_getOption('height')){return 'height';}if(_getOption('min-height')){return 'min-height';}if(_getOption('max-height')){return 'max-height';}}
var _destroy=function(){KTUtil.data(the.element).remove('scroll');}
_construct();the.update=function(){return _update();}
the.getHeight=function(){return _getHeight();}
the.getElement=function(){return the.element;}
the.destroy=function(){return _destroy();}};KTScroll.getInstance=function(element){if(element!==null&&KTUtil.data(element).has('scroll')){return KTUtil.data(element).get('scroll');}else{return null;}}
KTScroll.createInstances=function(selector='[data-kt-scroll="true"]'){var body=document.getElementsByTagName("BODY")[0];var elements=body.querySelectorAll(selector);if(elements&&elements.length>0){for(var i=0,len=elements.length;i<len;i++){new KTScroll(elements[i]);}}}
window.addEventListener('resize',function(){var timer;var body=document.getElementsByTagName("BODY")[0];KTUtil.throttle(timer,function(){var elements=body.querySelectorAll('[data-kt-scroll="true"]');if(elements&&elements.length>0){for(var i=0,len=elements.length;i<len;i++){var scroll=KTScroll.getInstance(elements[i]);if(scroll){scroll.update();}}}},200);});KTScroll.init=function(){KTScroll.createInstances();};if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',KTScroll.init);}else{KTScroll.init();}
if(typeof module!=='undefined'&&typeof module.exports!=='undefined'){module.exports=KTScroll;}
"use strict";var KTScrolltop=function(element,options){var the=this;var body=document.getElementsByTagName("BODY")[0];if(typeof element==="undefined"||element===null){return;}
var defaultOptions={offset:300,speed:600};var _construct=function(){if(KTUtil.data(element).has('scrolltop')){the=KTUtil.data(element).get('scrolltop');}else{_init();}}
var _init=function(){the.options=KTUtil.deepExtend({},defaultOptions,options);the.uid=KTUtil.getUniqueId('scrolltop');the.element=element;the.element.setAttribute('data-kt-scrolltop','true');_handlers();KTUtil.data(the.element).set('scrolltop',the);}
var _handlers=function(){var timer;window.addEventListener('scroll',function(){KTUtil.throttle(timer,function(){_scroll();},200);});KTUtil.addEvent(the.element,'click',function(e){e.preventDefault();_go();});}
var _scroll=function(){var offset=parseInt(_getOption('offset'));var pos=KTUtil.getScrollTop();if(pos>offset){if(body.hasAttribute('data-kt-scrolltop')===false){body.setAttribute('data-kt-scrolltop','on');}}else{if(body.hasAttribute('data-kt-scrolltop')===true){body.removeAttribute('data-kt-scrolltop');}}}
var _go=function(){var speed=parseInt(_getOption('speed'));KTUtil.scrollTop(0,speed);}
var _getOption=function(name){if(the.element.hasAttribute('data-kt-scrolltop-'+name)===true){var attr=the.element.getAttribute('data-kt-scrolltop-'+name);var value=KTUtil.getResponsiveValue(attr);if(value!==null&&String(value)==='true'){value=true;}else if(value!==null&&String(value)==='false'){value=false;}
return value;}else{var optionName=KTUtil.snakeToCamel(name);if(the.options[optionName]){return KTUtil.getResponsiveValue(the.options[optionName]);}else{return null;}}}
var _destroy=function(){KTUtil.data(the.element).remove('scrolltop');}
_construct();the.go=function(){return _go();}
the.getElement=function(){return the.element;}
the.destroy=function(){return _destroy();}};KTScrolltop.getInstance=function(element){if(element&&KTUtil.data(element).has('scrolltop')){return KTUtil.data(element).get('scrolltop');}else{return null;}}
KTScrolltop.createInstances=function(selector='[data-kt-scrolltop="true"]'){var body=document.getElementsByTagName("BODY")[0];var elements=body.querySelectorAll(selector);var scrolltop;if(elements&&elements.length>0){for(var i=0,len=elements.length;i<len;i++){scrolltop=new KTScrolltop(elements[i]);}}}
KTScrolltop.init=function(){KTScrolltop.createInstances();};if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',KTScrolltop.init);}else{KTScrolltop.init();}
if(typeof module!=='undefined'&&typeof module.exports!=='undefined'){module.exports=KTScrolltop;}
"use strict";var KTSearch=function(element,options){var the=this;if(!element){return;}
var defaultOptions={minLength:2,keypress:true,enter:true,layout:'menu',responsive:null,showOnFocus:true};var _construct=function(){if(KTUtil.data(element).has('search')===true){the=KTUtil.data(element).get('search');}else{_init();}}
var _init=function(){the.options=KTUtil.deepExtend({},defaultOptions,options);the.processing=false;the.element=element;the.contentElement=_getElement('content');the.formElement=_getElement('form');the.inputElement=_getElement('input');the.spinnerElement=_getElement('spinner');the.clearElement=_getElement('clear');the.toggleElement=_getElement('toggle');the.submitElement=_getElement('submit');the.toolbarElement=_getElement('toolbar');the.resultsElement=_getElement('results');the.suggestionElement=_getElement('suggestion');the.emptyElement=_getElement('empty');the.element.setAttribute('data-kt-search','true');the.layout=_getOption('layout');if(the.layout==='menu'){the.menuObject=new KTMenu(the.contentElement);}else{the.menuObject=null;}
_update();_handlers();KTUtil.data(the.element).set('search',the);}
var _handlers=function(){the.inputElement.addEventListener('focus',_focus);the.inputElement.addEventListener('blur',_blur);if(_getOption('keypress')===true){the.inputElement.addEventListener('input',_input);}
if(the.submitElement){the.submitElement.addEventListener('click',_search);}
if(_getOption('enter')===true){the.inputElement.addEventListener('keypress',_enter);}
if(the.clearElement){the.clearElement.addEventListener('click',_clear);}
if(the.menuObject){if(the.toggleElement){the.toggleElement.addEventListener('click',_show);the.menuObject.on('kt.menu.dropdown.show',function(item){if(KTUtil.visible(the.toggleElement)){the.toggleElement.classList.add('active');the.toggleElement.classList.add('show');}});the.menuObject.on('kt.menu.dropdown.hide',function(item){if(KTUtil.visible(the.toggleElement)){the.toggleElement.classList.remove('active');the.toggleElement.classList.remove('show');}});}
the.menuObject.on('kt.menu.dropdown.shown',function(){the.inputElement.focus();});}
window.addEventListener('resize',function(){var timer;KTUtil.throttle(timer,function(){_update();},200);});}
var _focus=function(){the.element.classList.add('focus');if(_getOption('show-on-focus')===true||the.inputElement.value.length>=minLength){_show();}}
var _blur=function(){the.element.classList.remove('focus');}
var _enter=function(e){var key=e.charCode||e.keyCode||0;if(key==13){e.preventDefault();_search();}}
var _input=function(){if(_getOption('min-length')){var minLength=parseInt(_getOption('min-length'));if(the.inputElement.value.length>=minLength){_search();}else if(the.inputElement.value.length===0){_clear();}}}
var _search=function(){if(the.processing===false){if(the.spinnerElement){the.spinnerElement.classList.remove("d-none");}
if(the.clearElement){the.clearElement.classList.add("d-none");}
if(the.toolbarElement&&the.formElement.contains(the.toolbarElement)){the.toolbarElement.classList.add("d-none");}
the.inputElement.focus();the.processing=true;KTEventHandler.trigger(the.element,'kt.search.process',the);}}
var _complete=function(){if(the.spinnerElement){the.spinnerElement.classList.add("d-none");}
if(the.clearElement){the.clearElement.classList.remove("d-none");}
if(the.inputElement.value.length===0){_clear();}
the.inputElement.focus();_show();the.processing=false;}
var _clear=function(){if(KTEventHandler.trigger(the.element,'kt.search.clear',the)===false){return;}
the.inputElement.value="";the.inputElement.focus();if(the.clearElement){the.clearElement.classList.add("d-none");}
if(the.toolbarElement&&the.formElement.contains(the.toolbarElement)){the.toolbarElement.classList.remove("d-none");}
if(_getOption('show-on-focus')===false){_hide();}
KTEventHandler.trigger(the.element,'kt.search.cleared',the);}
var _update=function(){if(the.layout==='menu'){var responsiveFormMode=_getResponsiveFormMode();if(responsiveFormMode==='on'&&the.contentElement.contains(the.formElement)===false){the.contentElement.prepend(the.formElement);the.formElement.classList.remove('d-none');}else if(responsiveFormMode==='off'&&the.contentElement.contains(the.formElement)===true){the.element.prepend(the.formElement);the.formElement.classList.add('d-none');}}}
var _show=function(){if(the.menuObject){_update();the.menuObject.show(the.element);}}
var _hide=function(){if(the.menuObject){_update();the.menuObject.hide(the.element);}}
var _getOption=function(name){if(the.element.hasAttribute('data-kt-search-'+name)===true){var attr=the.element.getAttribute('data-kt-search-'+name);var value=KTUtil.getResponsiveValue(attr);if(value!==null&&String(value)==='true'){value=true;}else if(value!==null&&String(value)==='false'){value=false;}
return value;}else{var optionName=KTUtil.snakeToCamel(name);if(the.options[optionName]){return KTUtil.getResponsiveValue(the.options[optionName]);}else{return null;}}}
var _getElement=function(name){return the.element.querySelector('[data-kt-search-element="'+name+'"]');}
var _getResponsiveFormMode=function(){var responsive=_getOption('responsive');var width=KTUtil.getViewPort().width;if(!responsive){return null;}
var breakpoint=KTUtil.getBreakpoint(responsive);if(!breakpoint){breakpoint=parseInt(responsive);}
if(width<breakpoint){return "on";}else{return "off";}}
var _destroy=function(){KTUtil.data(the.element).remove('search');}
_construct();the.show=function(){return _show();}
the.hide=function(){return _hide();}
the.update=function(){return _update();}
the.search=function(){return _search();}
the.complete=function(){return _complete();}
the.clear=function(){return _clear();}
the.isProcessing=function(){return the.processing;}
the.getQuery=function(){return the.inputElement.value;}
the.getMenu=function(){return the.menuObject;}
the.getFormElement=function(){return the.formElement;}
the.getInputElement=function(){return the.inputElement;}
the.getContentElement=function(){return the.contentElement;}
the.getElement=function(){return the.element;}
the.destroy=function(){return _destroy();}
the.on=function(name,handler){return KTEventHandler.on(the.element,name,handler);}
the.one=function(name,handler){return KTEventHandler.one(the.element,name,handler);}
the.off=function(name){return KTEventHandler.off(the.element,name);}};KTSearch.getInstance=function(element){if(element!==null&&KTUtil.data(element).has('search')){return KTUtil.data(element).get('search');}else{return null;}}
if(typeof module!=='undefined'&&typeof module.exports!=='undefined'){module.exports=KTSearch;}
"use strict";var KTStepper=function(element,options){var the=this;var body=document.getElementsByTagName("BODY")[0];if(typeof element==="undefined"||element===null){return;}
var defaultOptions={startIndex:1,animation:false,animationSpeed:'0.3s',animationNextClass:'animate__animated animate__slideInRight animate__fast',animationPreviousClass:'animate__animated animate__slideInLeft animate__fast'};var _construct=function(){if(KTUtil.data(element).has('stepper')===true){the=KTUtil.data(element).get('stepper');}else{_init();}}
var _init=function(){the.options=KTUtil.deepExtend({},defaultOptions,options);the.uid=KTUtil.getUniqueId('stepper');the.element=element;the.element.setAttribute('data-kt-stepper','true');the.steps=KTUtil.findAll(the.element,'[data-kt-stepper-element="nav"]');the.btnNext=KTUtil.find(the.element,'[data-kt-stepper-action="next"]');the.btnPrevious=KTUtil.find(the.element,'[data-kt-stepper-action="previous"]');the.btnSubmit=KTUtil.find(the.element,'[data-kt-stepper-action="submit"]');the.totalStepsNumber=the.steps.length;the.passedStepIndex=0;the.currentStepIndex=1;the.clickedStepIndex=0;if(the.options.startIndex>1){_goTo(the.options.startIndex);}
KTUtil.addEvent(the.btnNext,'click',function(e){e.preventDefault();KTEventHandler.trigger(the.element,'kt.stepper.next',the);});KTUtil.addEvent(the.btnPrevious,'click',function(e){e.preventDefault();KTEventHandler.trigger(the.element,'kt.stepper.previous',the);});KTUtil.on(the.element,'[data-kt-stepper-action="step"]','click',function(e){e.preventDefault();if(the.steps&&the.steps.length>0){for(var i=0,len=the.steps.length;i<len;i++){if(the.steps[i]===this){the.clickedStepIndex=i+1;KTEventHandler.trigger(the.element,'kt.stepper.click',the);return;}}}});KTUtil.data(the.element).set('stepper',the);}
var _goTo=function(index){KTEventHandler.trigger(the.element,'kt.stepper.change',the);if(index===the.currentStepIndex||index>the.totalStepsNumber||index<0){return;}
index=parseInt(index);the.passedStepIndex=the.currentStepIndex;the.currentStepIndex=index;_refreshUI();KTEventHandler.trigger(the.element,'kt.stepper.changed',the);return the;}
var _goNext=function(){return _goTo(_getNextStepIndex());}
var _goPrevious=function(){return _goTo(_getPreviousStepIndex());}
var _goLast=function(){return _goTo(_getLastStepIndex());}
var _goFirst=function(){return _goTo(_getFirstStepIndex());}
var _refreshUI=function(){var state='';if(_isLastStep()){state='last';}else if(_isFirstStep()){state='first';}else{state='between';}
KTUtil.removeClass(the.element,'last');KTUtil.removeClass(the.element,'first');KTUtil.removeClass(the.element,'between');KTUtil.addClass(the.element,state);var elements=KTUtil.findAll(the.element,'[data-kt-stepper-element="nav"], [data-kt-stepper-element="content"], [data-kt-stepper-element="info"]');if(elements&&elements.length>0){for(var i=0,len=elements.length;i<len;i++){var element=elements[i];var index=KTUtil.index(element)+1;KTUtil.removeClass(element,'current');KTUtil.removeClass(element,'completed');KTUtil.removeClass(element,'pending');if(index==the.currentStepIndex){KTUtil.addClass(element,'current');if(the.options.animation!==false&&element.getAttribute('data-kt-stepper-element')=='content'){KTUtil.css(element,'animationDuration',the.options.animationSpeed);var animation=_getStepDirection(the.passedStepIndex)==='previous'?the.options.animationPreviousClass:the.options.animationNextClass;KTUtil.animateClass(element,animation);}}else{if(index<the.currentStepIndex){KTUtil.addClass(element,'completed');}else{KTUtil.addClass(element,'pending');}}}}}
var _isLastStep=function(){return the.currentStepIndex===the.totalStepsNumber;}
var _isFirstStep=function(){return the.currentStepIndex===1;}
var _isBetweenStep=function(){return _isLastStep()===false&&_isFirstStep()===false;}
var _getNextStepIndex=function(){if(the.totalStepsNumber>=(the.currentStepIndex+1)){return the.currentStepIndex+1;}else{return the.totalStepsNumber;}}
var _getPreviousStepIndex=function(){if((the.currentStepIndex-1)>1){return the.currentStepIndex-1;}else{return 1;}}
var _getFirstStepIndex=function(){return 1;}
var _getLastStepIndex=function(){return the.totalStepsNumber;}
var _getTotalStepsNumber=function(){return the.totalStepsNumber;}
var _getStepDirection=function(index){if(index>the.currentStepIndex){return 'next';}else{return 'previous';}}
var _getStepContent=function(index){var content=KTUtil.findAll(the.element,'[data-kt-stepper-element="content"]');if(content[index-1]){return content[index-1];}else{return false;}}
var _destroy=function(){KTUtil.data(the.element).remove('stepper');}
_construct();the.getElement=function(index){return the.element;}
the.goTo=function(index){return _goTo(index);}
the.goPrevious=function(){return _goPrevious();}
the.goNext=function(){return _goNext();}
the.goFirst=function(){return _goFirst();}
the.goLast=function(){return _goLast();}
the.getCurrentStepIndex=function(){return the.currentStepIndex;}
the.getNextStepIndex=function(){return the.nextStepIndex;}
the.getPassedStepIndex=function(){return the.passedStepIndex;}
the.getClickedStepIndex=function(){return the.clickedStepIndex;}
the.getPreviousStepIndex=function(){return the.PreviousStepIndex;}
the.destroy=function(){return _destroy();}
the.on=function(name,handler){return KTEventHandler.on(the.element,name,handler);}
the.one=function(name,handler){return KTEventHandler.one(the.element,name,handler);}
the.off=function(name){return KTEventHandler.off(the.element,name);}
the.trigger=function(name,event){return KTEventHandler.trigger(the.element,name,event,the,event);}};KTStepper.getInstance=function(element){if(element!==null&&KTUtil.data(element).has('stepper')){return KTUtil.data(element).get('stepper');}else{return null;}}
if(typeof module!=='undefined'&&typeof module.exports!=='undefined'){module.exports=KTStepper;}
"use strict";var KTSticky=function(element,options){var the=this;var body=document.getElementsByTagName("BODY")[0];if(typeof element==="undefined"||element===null){return;}
var defaultOptions={offset:200,releaseOffset:0,reverse:false,animation:true,animationSpeed:'0.3s',animationClass:'animation-slide-in-down'};var _construct=function(){if(KTUtil.data(element).has('sticky')===true){the=KTUtil.data(element).get('sticky');}else{_init();}}
var _init=function(){the.element=element;the.options=KTUtil.deepExtend({},defaultOptions,options);the.uid=KTUtil.getUniqueId('sticky');the.name=the.element.getAttribute('data-kt-sticky-name');the.attributeName='data-kt-sticky-'+the.name;the.eventTriggerState=true;the.lastScrollTop=0;the.scrollHandler;the.element.setAttribute('data-kt-sticky','true');window.addEventListener('scroll',_scroll);_scroll();KTUtil.data(the.element).set('sticky',the);}
var _scroll=function(e){var offset=_getOption('offset');var releaseOffset=_getOption('release-offset');var reverse=_getOption('reverse');var st;var attrName;var diff;if(offset===false){return;}
offset=parseInt(offset);releaseOffset=releaseOffset?parseInt(releaseOffset):0;st=KTUtil.getScrollTop();diff=document.documentElement.scrollHeight-window.innerHeight-KTUtil.getScrollTop();if(reverse===true){if(st>offset&&(releaseOffset===0||releaseOffset<diff)){if(body.hasAttribute(the.attributeName)===false){_enable();body.setAttribute(the.attributeName,'on');}
if(the.eventTriggerState===true){KTEventHandler.trigger(the.element,'kt.sticky.on',the);KTEventHandler.trigger(the.element,'kt.sticky.change',the);the.eventTriggerState=false;}}else{if(body.hasAttribute(the.attributeName)===true){_disable();body.removeAttribute(the.attributeName);}
if(the.eventTriggerState===false){KTEventHandler.trigger(the.element,'kt.sticky.off',the);KTEventHandler.trigger(the.element,'kt.sticky.change',the);the.eventTriggerState=true;}}
the.lastScrollTop=st;}else{if(st>offset&&(releaseOffset===0||releaseOffset<diff)){if(body.hasAttribute(the.attributeName)===false){_enable();body.setAttribute(the.attributeName,'on');}
if(the.eventTriggerState===true){KTEventHandler.trigger(the.element,'kt.sticky.on',the);KTEventHandler.trigger(the.element,'kt.sticky.change',the);the.eventTriggerState=false;}}else{if(body.hasAttribute(the.attributeName)===true){_disable();body.removeAttribute(the.attributeName);}
if(the.eventTriggerState===false){KTEventHandler.trigger(the.element,'kt.sticky.off',the);KTEventHandler.trigger(the.element,'kt.sticky.change',the);the.eventTriggerState=true;}}}
if(releaseOffset>0){if(diff<releaseOffset){the.element.setAttribute('data-kt-sticky-released','true');}else{the.element.removeAttribute('data-kt-sticky-released');}}}
var _enable=function(update){var top=_getOption('top');var left=_getOption('left');var right=_getOption('right');var width=_getOption('width');var zindex=_getOption('zindex');if(update!==true&&_getOption('animation')===true){KTUtil.css(the.element,'animationDuration',_getOption('animationSpeed'));KTUtil.animateClass(the.element,'animation '+_getOption('animationClass'));}
if(zindex!==null){KTUtil.css(the.element,'z-index',zindex);KTUtil.css(the.element,'position','fixed');}
if(top!==null){KTUtil.css(the.element,'top',top);}
if(width!==null){if(width['target']){var targetElement=document.querySelector(width['target']);if(targetElement){width=KTUtil.css(targetElement,'width');}}
KTUtil.css(the.element,'width',width);}
if(left!==null){if(String(left).toLowerCase()==='auto'){var offsetLeft=KTUtil.offset(the.element).left;if(offsetLeft>0){KTUtil.css(the.element,'left',String(offsetLeft)+'px');}}}}
var _disable=function(){KTUtil.css(the.element,'top','');KTUtil.css(the.element,'width','');KTUtil.css(the.element,'left','');KTUtil.css(the.element,'right','');KTUtil.css(the.element,'z-index','');KTUtil.css(the.element,'position','');}
var _getOption=function(name){if(the.element.hasAttribute('data-kt-sticky-'+name)===true){var attr=the.element.getAttribute('data-kt-sticky-'+name);var value=KTUtil.getResponsiveValue(attr);if(value!==null&&String(value)==='true'){value=true;}else if(value!==null&&String(value)==='false'){value=false;}
return value;}else{var optionName=KTUtil.snakeToCamel(name);if(the.options[optionName]){return KTUtil.getResponsiveValue(the.options[optionName]);}else{return null;}}}
var _destroy=function(){window.removeEventListener('scroll',_scroll);KTUtil.data(the.element).remove('sticky');}
_construct();the.update=function(){if(body.hasAttribute(the.attributeName)===true){_disable();body.removeAttribute(the.attributeName);_enable(true);body.setAttribute(the.attributeName,'on');}}
the.destroy=function(){return _destroy();}
the.on=function(name,handler){return KTEventHandler.on(the.element,name,handler);}
the.one=function(name,handler){return KTEventHandler.one(the.element,name,handler);}
the.off=function(name){return KTEventHandler.off(the.element,name);}
the.trigger=function(name,event){return KTEventHandler.trigger(the.element,name,event,the,event);}};KTSticky.getInstance=function(element){if(element!==null&&KTUtil.data(element).has('sticky')){return KTUtil.data(element).get('sticky');}else{return null;}}
KTSticky.createInstances=function(selector='[data-kt-sticky="true"]'){var body=document.getElementsByTagName("BODY")[0];var elements=body.querySelectorAll(selector);var sticky;if(elements&&elements.length>0){for(var i=0,len=elements.length;i<len;i++){sticky=new KTSticky(elements[i]);}}}
window.addEventListener('resize',function(){var timer;var body=document.getElementsByTagName("BODY")[0];KTUtil.throttle(timer,function(){var elements=body.querySelectorAll('[data-kt-sticky="true"]');if(elements&&elements.length>0){for(var i=0,len=elements.length;i<len;i++){var sticky=KTSticky.getInstance(elements[i]);if(sticky){sticky.update();}}}},200);});KTSticky.init=function(){KTSticky.createInstances();};if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',KTSticky.init);}else{KTSticky.init();}
if(typeof module!=='undefined'&&typeof module.exports!=='undefined'){module.exports=KTSticky;}
"use strict";var KTSwapper=function(element,options){var the=this;if(typeof element==="undefined"||element===null){return;}
var defaultOptions={mode:'append'};var _construct=function(){if(KTUtil.data(element).has('swapper')===true){the=KTUtil.data(element).get('swapper');}else{_init();}}
var _init=function(){the.element=element;the.options=KTUtil.deepExtend({},defaultOptions,options);the.element.setAttribute('data-kt-swapper','true');_update();KTUtil.data(the.element).set('swapper',the);}
var _update=function(e){var parentSelector=_getOption('parent');var mode=_getOption('mode');var parentElement=parentSelector?document.querySelector(parentSelector):null;if(parentElement&&element.parentNode!==parentElement){if(mode==='prepend'){parentElement.prepend(element);}else if(mode==='append'){parentElement.append(element);}}}
var _getOption=function(name){if(the.element.hasAttribute('data-kt-swapper-'+name)===true){var attr=the.element.getAttribute('data-kt-swapper-'+name);var value=KTUtil.getResponsiveValue(attr);if(value!==null&&String(value)==='true'){value=true;}else if(value!==null&&String(value)==='false'){value=false;}
return value;}else{var optionName=KTUtil.snakeToCamel(name);if(the.options[optionName]){return KTUtil.getResponsiveValue(the.options[optionName]);}else{return null;}}}
var _destroy=function(){KTUtil.data(the.element).remove('swapper');}
_construct();the.update=function(){_update();}
the.destroy=function(){return _destroy();}
the.on=function(name,handler){return KTEventHandler.on(the.element,name,handler);}
the.one=function(name,handler){return KTEventHandler.one(the.element,name,handler);}
the.off=function(name){return KTEventHandler.off(the.element,name);}
the.trigger=function(name,event){return KTEventHandler.trigger(the.element,name,event,the,event);}};KTSwapper.getInstance=function(element){if(element!==null&&KTUtil.data(element).has('swapper')){return KTUtil.data(element).get('swapper');}else{return null;}}
KTSwapper.createInstances=function(selector='[data-kt-swapper="true"]'){var elements=document.querySelectorAll(selector);var swapper;if(elements&&elements.length>0){for(var i=0,len=elements.length;i<len;i++){swapper=new KTSwapper(elements[i]);}}}
window.addEventListener('resize',function(){var timer;KTUtil.throttle(timer,function(){var elements=document.querySelectorAll('[data-kt-swapper="true"]');if(elements&&elements.length>0){for(var i=0,len=elements.length;i<len;i++){var swapper=KTSwapper.getInstance(elements[i]);if(swapper){swapper.update();}}}},200);});KTSwapper.init=function(){KTSwapper.createInstances();};if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',KTSwapper.init);}else{KTSwapper.init();}
if(typeof module!=='undefined'&&typeof module.exports!=='undefined'){module.exports=KTSwapper;}
"use strict";var KTToggle=function(element,options){var the=this;var body=document.getElementsByTagName("BODY")[0];if(!element){return;}
var defaultOptions={saveState:true};var _construct=function(){if(KTUtil.data(element).has('toggle')===true){the=KTUtil.data(element).get('toggle');}else{_init();}}
var _init=function(){the.options=KTUtil.deepExtend({},defaultOptions,options);the.uid=KTUtil.getUniqueId('toggle');the.element=element;the.target=document.querySelector(the.element.getAttribute('data-kt-toggle-target'))?document.querySelector(the.element.getAttribute('data-kt-toggle-target')):the.element;the.state=the.element.hasAttribute('data-kt-toggle-state')?the.element.getAttribute('data-kt-toggle-state'):'';the.attribute='data-kt-'+the.element.getAttribute('data-kt-toggle-name');_handlers();KTUtil.data(the.element).set('toggle',the);}
var _handlers=function(){KTUtil.addEvent(the.element,'click',function(e){e.preventDefault();_toggle();});}
var _toggle=function(){KTEventHandler.trigger(the.element,'kt.toggle.change',the);if(_isEnabled()){_disable();}else{_enable();}
KTEventHandler.trigger(the.element,'kt.toggle.changed',the);return the;}
var _enable=function(){if(_isEnabled()===true){return;}
KTEventHandler.trigger(the.element,'kt.toggle.enable',the);the.target.setAttribute(the.attribute,'on');if(the.state.length>0){the.element.classList.add(the.state);}
if(typeof KTCookie!=='undefined'&&the.options.saveState===true){KTCookie.set(the.attribute,'on');}
KTEventHandler.trigger(the.element,'kt.toggle.enabled',the);return the;}
var _disable=function(){if(_isEnabled()===false){return;}
KTEventHandler.trigger(the.element,'kt.toggle.disable',the);the.target.removeAttribute(the.attribute);if(the.state.length>0){the.element.classList.remove(the.state);}
if(typeof KTCookie!=='undefined'&&the.options.saveState===true){KTCookie.remove(the.attribute);}
KTEventHandler.trigger(the.element,'kt.toggle.disabled',the);return the;}
var _isEnabled=function(){return(String(the.target.getAttribute(the.attribute)).toLowerCase()==='on');}
var _destroy=function(){KTUtil.data(the.element).remove('toggle');}
_construct();the.toggle=function(){return _toggle();}
the.enable=function(){return _enable();}
the.disable=function(){return _disable();}
the.isEnabled=function(){return _isEnabled();}
the.goElement=function(){return the.element;}
the.destroy=function(){return _destroy();}
the.on=function(name,handler){return KTEventHandler.on(the.element,name,handler);}
the.one=function(name,handler){return KTEventHandler.one(the.element,name,handler);}
the.off=function(name){return KTEventHandler.off(the.element,name);}
the.trigger=function(name,event){return KTEventHandler.trigger(the.element,name,event,the,event);}};KTToggle.getInstance=function(element){if(element!==null&&KTUtil.data(element).has('toggle')){return KTUtil.data(element).get('toggle');}else{return null;}}
KTToggle.createInstances=function(selector='[data-kt-toggle]'){var body=document.getElementsByTagName("BODY")[0];var elements=body.querySelectorAll(selector);if(elements&&elements.length>0){for(var i=0,len=elements.length;i<len;i++){new KTToggle(elements[i]);}}}
KTToggle.init=function(){KTToggle.createInstances();};if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',KTToggle.init);}else{KTToggle.init();}
if(typeof module!=='undefined'&&typeof module.exports!=='undefined'){module.exports=KTToggle;}
"use strict";if(!Element.prototype.matches){Element.prototype.matches=function(s){var matches=(this.document||this.ownerDocument).querySelectorAll(s),i=matches.length;while(--i>=0&&matches.item(i)!==this){}
return i>-1;};}
if(!Element.prototype.closest){Element.prototype.closest=function(s){var el=this;var ancestor=this;if(!document.documentElement.contains(el))return null;do{if(ancestor.matches(s))return ancestor;ancestor=ancestor.parentElement;}while(ancestor!==null);return null;};}
(function(elem){for(var i=0;i<elem.length;i++){if(!window[elem[i]]||'remove'in window[elem[i]].prototype)continue;window[elem[i]].prototype.remove=function(){this.parentNode.removeChild(this);};}})(['Element','CharacterData','DocumentType']);(function(){var lastTime=0;var vendors=['webkit','moz'];for(var x=0;x<vendors.length&&!window.requestAnimationFrame;++x){window.requestAnimationFrame=window[vendors[x]+'RequestAnimationFrame'];window.cancelAnimationFrame=window[vendors[x]+'CancelAnimationFrame']||window[vendors[x]+'CancelRequestAnimationFrame'];}
if(!window.requestAnimationFrame)
window.requestAnimationFrame=function(callback){var currTime=new Date().getTime();var timeToCall=Math.max(0,16-(currTime-lastTime));var id=window.setTimeout(function(){callback(currTime+timeToCall);},timeToCall);lastTime=currTime+timeToCall;return id;};if(!window.cancelAnimationFrame)
window.cancelAnimationFrame=function(id){clearTimeout(id);};}());(function(arr){arr.forEach(function(item){if(item.hasOwnProperty('prepend')){return;}
Object.defineProperty(item,'prepend',{configurable:true,enumerable:true,writable:true,value:function prepend(){var argArr=Array.prototype.slice.call(arguments),docFrag=document.createDocumentFragment();argArr.forEach(function(argItem){var isNode=argItem instanceof Node;docFrag.appendChild(isNode?argItem:document.createTextNode(String(argItem)));});this.insertBefore(docFrag,this.firstChild);}});});})([Element.prototype,Document.prototype,DocumentFragment.prototype]);if(Element.prototype.getAttributeNames==undefined){Element.prototype.getAttributeNames=function(){var attributes=this.attributes;var length=attributes.length;var result=new Array(length);for(var i=0;i<length;i++){result[i]=attributes[i].name;}
return result;};}
window.KTUtilElementDataStore={};window.KTUtilElementDataStoreID=0;window.KTUtilDelegatedEventHandlers={};var KTUtil=function(){var resizeHandlers=[];var _windowResizeHandler=function(){var _runResizeHandlers=function(){for(var i=0;i<resizeHandlers.length;i++){var each=resizeHandlers[i];each.call();}};var timer;window.addEventListener('resize',function(){KTUtil.throttle(timer,function(){_runResizeHandlers();},200);});};return{init:function(settings){_windowResizeHandler();},addResizeHandler:function(callback){resizeHandlers.push(callback);},removeResizeHandler:function(callback){for(var i=0;i<resizeHandlers.length;i++){if(callback===resizeHandlers[i]){delete resizeHandlers[i];}}},runResizeHandlers:function(){_runResizeHandlers();},resize:function(){if(typeof(Event)==='function'){window.dispatchEvent(new Event('resize'));}else{var evt=window.document.createEvent('UIEvents');evt.initUIEvent('resize',true,false,window,0);window.dispatchEvent(evt);}},getURLParam:function(paramName){var searchString=window.location.search.substring(1),i,val,params=searchString.split("&");for(i=0;i<params.length;i++){val=params[i].split("=");if(val[0]==paramName){return unescape(val[1]);}}
return null;},isMobileDevice:function(){var test=(this.getViewPort().width<this.getBreakpoint('lg')?true:false);if(test===false){test=navigator.userAgent.match(/iPad/i)!=null;}
return test;},isDesktopDevice:function(){return KTUtil.isMobileDevice()?false:true;},getViewPort:function(){var e=window,a='inner';if(!('innerWidth'in window)){a='client';e=document.documentElement||document.body;}
return{width:e[a+'Width'],height:e[a+'Height']};},isBreakpointUp:function(mode){var width=this.getViewPort().width;var breakpoint=this.getBreakpoint(mode);return(width>=breakpoint);},isBreakpointDown:function(mode){var width=this.getViewPort().width;var breakpoint=this.getBreakpoint(mode);return(width<breakpoint);},getViewportWidth:function(){return this.getViewPort().width;},getUniqueId:function(prefix){return prefix+Math.floor(Math.random()*(new Date()).getTime());},getBreakpoint:function(breakpoint){var value=this.getCssVariableValue('--bs-'+breakpoint);if(value){value=parseInt(value.trim());}
return value;},isset:function(obj,keys){var stone;keys=keys||'';if(keys.indexOf('[')!==-1){throw new Error('Unsupported object path notation.');}
keys=keys.split('.');do{if(obj===undefined){return false;}
stone=keys.shift();if(!obj.hasOwnProperty(stone)){return false;}
obj=obj[stone];}while(keys.length);return true;},getHighestZindex:function(el){var position,value;while(el&&el!==document){position=KTUtil.css(el,'position');if(position==="absolute"||position==="relative"||position==="fixed"){value=parseInt(KTUtil.css(el,'z-index'));if(!isNaN(value)&&value!==0){return value;}}
el=el.parentNode;}
return 1;},hasFixedPositionedParent:function(el){var position;while(el&&el!==document){position=KTUtil.css(el,'position');if(position==="fixed"){return true;}
el=el.parentNode;}
return false;},sleep:function(milliseconds){var start=new Date().getTime();for(var i=0;i<1e7;i++){if((new Date().getTime()-start)>milliseconds){break;}}},getRandomInt:function(min,max){return Math.floor(Math.random()*(max-min+1))+min;},isAngularVersion:function(){return window.Zone!==undefined?true:false;},deepExtend:function(out){out=out||{};for(var i=1;i<arguments.length;i++){var obj=arguments[i];if(!obj)continue;for(var key in obj){if(!obj.hasOwnProperty(key)){continue;}
if(Object.prototype.toString.call(obj[key])==='[object Object]'){out[key]=KTUtil.deepExtend(out[key],obj[key]);continue;}
out[key]=obj[key];}}
return out;},extend:function(out){out=out||{};for(var i=1;i<arguments.length;i++){if(!arguments[i])
continue;for(var key in arguments[i]){if(arguments[i].hasOwnProperty(key))
out[key]=arguments[i][key];}}
return out;},getBody:function(){return document.getElementsByTagName('body')[0];},hasClasses:function(el,classes){if(!el){return;}
var classesArr=classes.split(" ");for(var i=0;i<classesArr.length;i++){if(KTUtil.hasClass(el,KTUtil.trim(classesArr[i]))==false){return false;}}
return true;},hasClass:function(el,className){if(!el){return;}
return el.classList?el.classList.contains(className):new RegExp('\\b'+className+'\\b').test(el.className);},addClass:function(el,className){if(!el||typeof className==='undefined'){return;}
var classNames=className.split(' ');if(el.classList){for(var i=0;i<classNames.length;i++){if(classNames[i]&&classNames[i].length>0){el.classList.add(KTUtil.trim(classNames[i]));}}}else if(!KTUtil.hasClass(el,className)){for(var x=0;x<classNames.length;x++){el.className+=' '+KTUtil.trim(classNames[x]);}}},removeClass:function(el,className){if(!el||typeof className==='undefined'){return;}
var classNames=className.split(' ');if(el.classList){for(var i=0;i<classNames.length;i++){el.classList.remove(KTUtil.trim(classNames[i]));}}else if(KTUtil.hasClass(el,className)){for(var x=0;x<classNames.length;x++){el.className=el.className.replace(new RegExp('\\b'+KTUtil.trim(classNames[x])+'\\b','g'),'');}}},triggerCustomEvent:function(el,eventName,data){var event;if(window.CustomEvent){event=new CustomEvent(eventName,{detail:data});}else{event=document.createEvent('CustomEvent');event.initCustomEvent(eventName,true,true,data);}
el.dispatchEvent(event);},triggerEvent:function(node,eventName){var doc;if(node.ownerDocument){doc=node.ownerDocument;}else if(node.nodeType==9){doc=node;}else{throw new Error("Invalid node passed to fireEvent: "+node.id);}
if(node.dispatchEvent){var eventClass="";switch(eventName){case "click":case "mouseenter":case "mouseleave":case "mousedown":case "mouseup":eventClass="MouseEvents";break;case "focus":case "change":case "blur":case "select":eventClass="HTMLEvents";break;default:throw "fireEvent: Couldn't find an event class for event '"+eventName+"'.";break;}
var event=doc.createEvent(eventClass);var bubbles=eventName=="change"?false:true;event.initEvent(eventName,bubbles,true);event.synthetic=true;node.dispatchEvent(event,true);}else if(node.fireEvent){var event=doc.createEventObject();event.synthetic=true;node.fireEvent("on"+eventName,event);}},index:function(el){var c=el.parentNode.children,i=0;for(;i<c.length;i++)
if(c[i]==el)return i;},trim:function(string){return string.trim();},eventTriggered:function(e){if(e.currentTarget.dataset.triggered){return true;}else{e.currentTarget.dataset.triggered=true;return false;}},remove:function(el){if(el&&el.parentNode){el.parentNode.removeChild(el);}},find:function(parent,query){if(parent!==null){return parent.querySelector(query);}else{return null;}},findAll:function(parent,query){if(parent!==null){return parent.querySelectorAll(query);}else{return null;}},insertAfter:function(el,referenceNode){return referenceNode.parentNode.insertBefore(el,referenceNode.nextSibling);},parents:function(elem,selector){var parents=[];for(;elem&&elem!==document;elem=elem.parentNode){if(selector){if(elem.matches(selector)){parents.push(elem);}
continue;}
parents.push(elem);}
return parents;},children:function(el,selector,log){if(!el||!el.childNodes){return null;}
var result=[],i=0,l=el.childNodes.length;for(var i;i<l;++i){if(el.childNodes[i].nodeType==1&&KTUtil.matches(el.childNodes[i],selector,log)){result.push(el.childNodes[i]);}}
return result;},child:function(el,selector,log){var children=KTUtil.children(el,selector,log);return children?children[0]:null;},matches:function(el,selector,log){var p=Element.prototype;var f=p.matches||p.webkitMatchesSelector||p.mozMatchesSelector||p.msMatchesSelector||function(s){return[].indexOf.call(document.querySelectorAll(s),this)!==-1;};if(el&&el.tagName){return f.call(el,selector);}else{return false;}},data:function(el){return{set:function(name,data){if(!el){return;}
if(el.customDataTag===undefined){window.KTUtilElementDataStoreID++;el.customDataTag=window.KTUtilElementDataStoreID;}
if(window.KTUtilElementDataStore[el.customDataTag]===undefined){window.KTUtilElementDataStore[el.customDataTag]={};}
window.KTUtilElementDataStore[el.customDataTag][name]=data;},get:function(name){if(!el){return;}
if(el.customDataTag===undefined){return null;}
return this.has(name)?window.KTUtilElementDataStore[el.customDataTag][name]:null;},has:function(name){if(!el){return false;}
if(el.customDataTag===undefined){return false;}
return(window.KTUtilElementDataStore[el.customDataTag]&&window.KTUtilElementDataStore[el.customDataTag][name])?true:false;},remove:function(name){if(el&&this.has(name)){delete window.KTUtilElementDataStore[el.customDataTag][name];}}};},outerWidth:function(el,margin){var width;if(margin===true){width=parseFloat(el.offsetWidth);width+=parseFloat(KTUtil.css(el,'margin-left'))+parseFloat(KTUtil.css(el,'margin-right'));return parseFloat(width);}else{width=parseFloat(el.offsetWidth);return width;}},offset:function(el){var rect,win;if(!el){return;}
if(!el.getClientRects().length){return{top:0,left:0};}
rect=el.getBoundingClientRect();win=el.ownerDocument.defaultView;return{top:rect.top+win.pageYOffset,left:rect.left+win.pageXOffset,right:window.innerWidth-(el.offsetLeft+el.offsetWidth)};},height:function(el){return KTUtil.css(el,'height');},outerHeight:function(el,withMargin){var height=el.offsetHeight;var style;if(typeof withMargin!=='undefined'&&withMargin===true){style=getComputedStyle(el);height+=parseInt(style.marginTop)+parseInt(style.marginBottom);return height;}else{return height;}},visible:function(el){return!(el.offsetWidth===0&&el.offsetHeight===0);},attr:function(el,name,value){if(el==undefined){return;}
if(value!==undefined){el.setAttribute(name,value);}else{return el.getAttribute(name);}},hasAttr:function(el,name){if(el==undefined){return;}
return el.getAttribute(name)?true:false;},removeAttr:function(el,name){if(el==undefined){return;}
el.removeAttribute(name);},animate:function(from,to,duration,update,easing,done){var easings={};var easing;easings.linear=function(t,b,c,d){return c*t/d+b;};easing=easings.linear;if(typeof from!=='number'||typeof to!=='number'||typeof duration!=='number'||typeof update!=='function'){return;}
if(typeof done!=='function'){done=function(){};}
var rAF=window.requestAnimationFrame||function(callback){window.setTimeout(callback,1000/50);};var canceled=false;var change=to-from;function loop(timestamp){var time=(timestamp||+new Date())-start;if(time>=0){update(easing(time,from,change,duration));}
if(time>=0&&time>=duration){update(to);done();}else{rAF(loop);}}
update(from);var start=window.performance&&window.performance.now?window.performance.now():+new Date();rAF(loop);},actualCss:function(el,prop,cache){var css='';if(el instanceof HTMLElement===false){return;}
if(!el.getAttribute('kt-hidden-'+prop)||cache===false){var value;css=el.style.cssText;el.style.cssText='position: absolute; visibility: hidden; display: block;';if(prop=='width'){value=el.offsetWidth;}else if(prop=='height'){value=el.offsetHeight;}
el.style.cssText=css;el.setAttribute('kt-hidden-'+prop,value);return parseFloat(value);}else{return parseFloat(el.getAttribute('kt-hidden-'+prop));}},actualHeight:function(el,cache){return KTUtil.actualCss(el,'height',cache);},actualWidth:function(el,cache){return KTUtil.actualCss(el,'width',cache);},getScroll:function(element,method){method='scroll'+method;return(element==window||element==document)?(self[(method=='scrollTop')?'pageYOffset':'pageXOffset']||(browserSupportsBoxModel&&document.documentElement[method])||document.body[method]):element[method];},css:function(el,styleProp,value,important){if(!el){return;}
if(value!==undefined){if(important===true){el.style.setProperty(styleProp,value,'important');}else{el.style[styleProp]=value;}}else{var defaultView=(el.ownerDocument||document).defaultView;if(defaultView&&defaultView.getComputedStyle){styleProp=styleProp.replace(/([A-Z])/g,"-$1").toLowerCase();return defaultView.getComputedStyle(el,null).getPropertyValue(styleProp);}else if(el.currentStyle){styleProp=styleProp.replace(/\-(\w)/g,function(str,letter){return letter.toUpperCase();});value=el.currentStyle[styleProp];if(/^\d+(em|pt|%|ex)?$/i.test(value)){return(function(value){var oldLeft=el.style.left,oldRsLeft=el.runtimeStyle.left;el.runtimeStyle.left=el.currentStyle.left;el.style.left=value||0;value=el.style.pixelLeft+"px";el.style.left=oldLeft;el.runtimeStyle.left=oldRsLeft;return value;})(value);}
return value;}}},slide:function(el,dir,speed,callback,recalcMaxHeight){if(!el||(dir=='up'&&KTUtil.visible(el)===false)||(dir=='down'&&KTUtil.visible(el)===true)){return;}
speed=(speed?speed:600);var calcHeight=KTUtil.actualHeight(el);var calcPaddingTop=false;var calcPaddingBottom=false;if(KTUtil.css(el,'padding-top')&&KTUtil.data(el).has('slide-padding-top')!==true){KTUtil.data(el).set('slide-padding-top',KTUtil.css(el,'padding-top'));}
if(KTUtil.css(el,'padding-bottom')&&KTUtil.data(el).has('slide-padding-bottom')!==true){KTUtil.data(el).set('slide-padding-bottom',KTUtil.css(el,'padding-bottom'));}
if(KTUtil.data(el).has('slide-padding-top')){calcPaddingTop=parseInt(KTUtil.data(el).get('slide-padding-top'));}
if(KTUtil.data(el).has('slide-padding-bottom')){calcPaddingBottom=parseInt(KTUtil.data(el).get('slide-padding-bottom'));}
if(dir=='up'){el.style.cssText='display: block; overflow: hidden;';if(calcPaddingTop){KTUtil.animate(0,calcPaddingTop,speed,function(value){el.style.paddingTop=(calcPaddingTop-value)+'px';},'linear');}
if(calcPaddingBottom){KTUtil.animate(0,calcPaddingBottom,speed,function(value){el.style.paddingBottom=(calcPaddingBottom-value)+'px';},'linear');}
KTUtil.animate(0,calcHeight,speed,function(value){el.style.height=(calcHeight-value)+'px';},'linear',function(){el.style.height='';el.style.display='none';if(typeof callback==='function'){callback();}});}else if(dir=='down'){el.style.cssText='display: block; overflow: hidden;';if(calcPaddingTop){KTUtil.animate(0,calcPaddingTop,speed,function(value){el.style.paddingTop=value+'px';},'linear',function(){el.style.paddingTop='';});}
if(calcPaddingBottom){KTUtil.animate(0,calcPaddingBottom,speed,function(value){el.style.paddingBottom=value+'px';},'linear',function(){el.style.paddingBottom='';});}
KTUtil.animate(0,calcHeight,speed,function(value){el.style.height=value+'px';},'linear',function(){el.style.height='';el.style.display='';el.style.overflow='';if(typeof callback==='function'){callback();}});}},slideUp:function(el,speed,callback){KTUtil.slide(el,'up',speed,callback);},slideDown:function(el,speed,callback){KTUtil.slide(el,'down',speed,callback);},show:function(el,display){if(typeof el!=='undefined'){el.style.display=(display?display:'block');}},hide:function(el){if(typeof el!=='undefined'){el.style.display='none';}},addEvent:function(el,type,handler,one){if(typeof el!=='undefined'&&el!==null){el.addEventListener(type,handler);}},removeEvent:function(el,type,handler){if(el!==null){el.removeEventListener(type,handler);}},on:function(element,selector,event,handler){if(element===null){return;}
var eventId=KTUtil.getUniqueId('event');window.KTUtilDelegatedEventHandlers[eventId]=function(e){var targets=element.querySelectorAll(selector);var target=e.target;while(target&&target!==element){for(var i=0,j=targets.length;i<j;i++){if(target===targets[i]){handler.call(target,e);}}
target=target.parentNode;}}
KTUtil.addEvent(element,event,window.KTUtilDelegatedEventHandlers[eventId]);return eventId;},off:function(element,event,eventId){if(!element||!window.KTUtilDelegatedEventHandlers[eventId]){return;}
KTUtil.removeEvent(element,event,window.KTUtilDelegatedEventHandlers[eventId]);delete window.KTUtilDelegatedEventHandlers[eventId];},one:function onetime(el,type,callback){el.addEventListener(type,function callee(e){if(e.target&&e.target.removeEventListener){e.target.removeEventListener(e.type,callee);}
if(el&&el.removeEventListener){e.currentTarget.removeEventListener(e.type,callee);}
return callback(e);});},hash:function(str){var hash=0,i,chr;if(str.length===0)return hash;for(i=0;i<str.length;i++){chr=str.charCodeAt(i);hash=((hash<<5)-hash)+chr;hash|=0;}
return hash;},animateClass:function(el,animationName,callback){var animation;var animations={animation:'animationend',OAnimation:'oAnimationEnd',MozAnimation:'mozAnimationEnd',WebkitAnimation:'webkitAnimationEnd',msAnimation:'msAnimationEnd',};for(var t in animations){if(el.style[t]!==undefined){animation=animations[t];}}
KTUtil.addClass(el,animationName);KTUtil.one(el,animation,function(){KTUtil.removeClass(el,animationName);});if(callback){KTUtil.one(el,animation,callback);}},transitionEnd:function(el,callback){var transition;var transitions={transition:'transitionend',OTransition:'oTransitionEnd',MozTransition:'mozTransitionEnd',WebkitTransition:'webkitTransitionEnd',msTransition:'msTransitionEnd'};for(var t in transitions){if(el.style[t]!==undefined){transition=transitions[t];}}
KTUtil.one(el,transition,callback);},animationEnd:function(el,callback){var animation;var animations={animation:'animationend',OAnimation:'oAnimationEnd',MozAnimation:'mozAnimationEnd',WebkitAnimation:'webkitAnimationEnd',msAnimation:'msAnimationEnd'};for(var t in animations){if(el.style[t]!==undefined){animation=animations[t];}}
KTUtil.one(el,animation,callback);},animateDelay:function(el,value){var vendors=['webkit-','moz-','ms-','o-',''];for(var i=0;i<vendors.length;i++){KTUtil.css(el,vendors[i]+'animation-delay',value);}},animateDuration:function(el,value){var vendors=['webkit-','moz-','ms-','o-',''];for(var i=0;i<vendors.length;i++){KTUtil.css(el,vendors[i]+'animation-duration',value);}},scrollTo:function(target,offset,duration){var duration=duration?duration:500;var targetPos=target?KTUtil.offset(target).top:0;var scrollPos=window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop||0;var from,to;if(offset){targetPos=targetPos-offset;}
from=scrollPos;to=targetPos;KTUtil.animate(from,to,duration,function(value){document.documentElement.scrollTop=value;document.body.parentNode.scrollTop=value;document.body.scrollTop=value;});},scrollTop:function(offset,duration){KTUtil.scrollTo(null,offset,duration);},isArray:function(obj){return obj&&Array.isArray(obj);},isEmpty:function(obj){for(var prop in obj){if(obj.hasOwnProperty(prop)){return false;}}
return true;},numberString:function(nStr){nStr+='';var x=nStr.split('.');var x1=x[0];var x2=x.length>1?'.'+x[1]:'';var rgx=/(\d+)(\d{3})/;while(rgx.test(x1)){x1=x1.replace(rgx,'$1'+','+'$2');}
return x1+x2;},isRTL:function(){return(document.querySelector('html').getAttribute("direction")==='rtl');},snakeToCamel:function(s){return s.replace(/(\-\w)/g,function(m){return m[1].toUpperCase();});},filterBoolean:function(val){if(val===true||val==='true'){return true;}
if(val===false||val==='false'){return false;}
return val;},setHTML:function(el,html){el.innerHTML=html;},getHTML:function(el){if(el){return el.innerHTML;}},getDocumentHeight:function(){var body=document.body;var html=document.documentElement;return Math.max(body.scrollHeight,body.offsetHeight,html.clientHeight,html.scrollHeight,html.offsetHeight);},getScrollTop:function(){return(document.scrollingElement||document.documentElement).scrollTop;},colorLighten:function(color,amount){const addLight=function(color,amount){let cc=parseInt(color,16)+amount;let c=(cc>255)?255:(cc);c=(c.toString(16).length>1)?c.toString(16):`0${c.toString(16)}`;return c;}
color=(color.indexOf("#")>=0)?color.substring(1,color.length):color;amount=parseInt((255*amount)/100);return color=`#${addLight(color.substring(0,2),amount)}${addLight(color.substring(2,4),amount)}${addLight(color.substring(4,6),amount)}`;},colorDarken:function(color,amount){const subtractLight=function(color,amount){let cc=parseInt(color,16)-amount;let c=(cc<0)?0:(cc);c=(c.toString(16).length>1)?c.toString(16):`0${c.toString(16)}`;return c;}
color=(color.indexOf("#")>=0)?color.substring(1,color.length):color;amount=parseInt((255*amount)/100);return color=`#${subtractLight(color.substring(0,2),amount)}${subtractLight(color.substring(2,4),amount)}${subtractLight(color.substring(4,6),amount)}`;},throttle:function(timer,func,delay){if(timer){return;}
timer=setTimeout(function(){func();timer=undefined;},delay);},debounce:function(timer,func,delay){clearTimeout(timer)
timer=setTimeout(func,delay);},parseJson:function(value){if(typeof value==='string'){value=value.replace(/'/g,"\"");var jsonStr=value.replace(/(\w+:)|(\w+ :)/g,function(matched){return '"'+matched.substring(0,matched.length-1)+'":';});try{value=JSON.parse(jsonStr);}catch(e){}}
return value;},getResponsiveValue:function(value,defaultValue){var width=this.getViewPort().width;var result;value=KTUtil.parseJson(value);if(typeof value==='object'){var resultKey;var resultBreakpoint=-1;var breakpoint;for(var key in value){if(key==='default'){breakpoint=0;}else{breakpoint=this.getBreakpoint(key)?this.getBreakpoint(key):parseInt(key);}
if(breakpoint<=width&&breakpoint>resultBreakpoint){resultKey=key;resultBreakpoint=breakpoint;}}
if(resultKey){result=value[resultKey];}else{result=value;}}else{result=value;}
return result;},each:function(array,callback){return[].slice.call(array).map(callback);},getSelectorMatchValue:function(value){var result=null;value=KTUtil.parseJson(value);if(typeof value==='object'){if(value['match']!==undefined){var selector=Object.keys(value['match'])[0];value=Object.values(value['match'])[0];if(document.querySelector(selector)!==null){result=value;}}}else{result=value;}
return result;},getConditionalValue:function(value){var value=KTUtil.parseJson(value);var result=KTUtil.getResponsiveValue(value);if(result!==null&&result['match']!==undefined){result=KTUtil.getSelectorMatchValue(result);}
if(result===null&&value!==null&&value['default']!==undefined){result=value['default'];}
return result;},getCssVariableValue:function(variableName){var hex=getComputedStyle(document.documentElement).getPropertyValue(variableName);if(hex&&hex.length>0){hex=hex.trim();}
return hex;},isInViewport:function(element){var rect=element.getBoundingClientRect();return(rect.top>=0&&rect.left>=0&&rect.bottom<=(window.innerHeight||document.documentElement.clientHeight)&&rect.right<=(window.innerWidth||document.documentElement.clientWidth));},onDOMContentLoaded:function(callback){if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',callback);}else{callback();}},inIframe:function(){try{return window.self!==window.top;}catch(e){return true;}}}}();if(typeof module!=='undefined'&&typeof module.exports!=='undefined'){module.exports=KTUtil;}
"use strict";var KTApp=function(){var initPageLoader=function(){KTUtil.removeClass(document.body,'page-loading');}
var initBootstrapTooltip=function(el,options){var delay={};if(el.hasAttribute('data-bs-delay-hide')){delay['hide']=el.getAttribute('data-bs-delay-hide');}
if(el.hasAttribute('data-bs-delay-show')){delay['show']=el.getAttribute('data-bs-delay-show');}
if(delay){options['delay']=delay;}
if(el.hasAttribute('data-bs-dismiss')&&el.getAttribute('data-bs-dismiss')=='click'){options['dismiss']='click';}
var tp=new bootstrap.Tooltip(el,options);if(options['dismiss']&&options['dismiss']==='click'){el.addEventListener("click",function(e){tp.hide();});}
return tp;}
var initBootstrapTooltips=function(el,options){var tooltipTriggerList=[].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));var tooltipList=tooltipTriggerList.map(function(tooltipTriggerEl){initBootstrapTooltip(tooltipTriggerEl,{});});}
var initBootstrapPopover=function(el,options){var delay={};if(el.hasAttribute('data-bs-delay-hide')){delay['hide']=el.getAttribute('data-bs-delay-hide');}
if(el.hasAttribute('data-bs-delay-show')){delay['show']=el.getAttribute('data-bs-delay-show');}
if(delay){options['delay']=delay;}
if(el.getAttribute('data-bs-dismiss')=='true'){options['dismiss']=true;}
if(options['dismiss']===true){options['template']='<div class="popover" role="tooltip"><div class="popover-arrow"></div><span class="popover-dismiss btn btn-icon"><i class="bi bi-x fs-2"></i></span><h3 class="popover-header"></h3><div class="popover-body"></div></div>'}
var popover=new bootstrap.Popover(el,options);if(options['dismiss']===true){var dismissHandler=function(e){popover.hide();}
el.addEventListener('shown.bs.popover',function(){var dismissEl=document.getElementById(el.getAttribute('aria-describedby'));dismissEl.addEventListener('click',dismissHandler);});el.addEventListener('hide.bs.popover',function(){var dismissEl=document.getElementById(el.getAttribute('aria-describedby'));dismissEl.removeEventListener('click',dismissHandler);});}
return popover;}
var initBootstrapPopovers=function(){var popoverTriggerList=[].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));var popoverList=popoverTriggerList.map(function(popoverTriggerEl){initBootstrapPopover(popoverTriggerEl,{});});}
var initScrollSpy=function(){var elements=[].slice.call(document.querySelectorAll('[data-bs-spy="scroll"]'));elements.map(function(element){var sel=element.getAttribute('data-bs-target');var scrollContent=document.querySelector(element.getAttribute('data-bs-target'));var scrollSpy=bootstrap.ScrollSpy.getInstance(scrollContent);if(scrollSpy){scrollSpy.refresh();}});}
var initButtons=function(){var buttonsGroup=[].slice.call(document.querySelectorAll('[data-kt-buttons="true"]'));buttonsGroup.map(function(group){var selector=group.hasAttribute('data-kt-buttons-target')?group.getAttribute('data-kt-buttons-target'):'.btn';KTUtil.on(group,selector,'click',function(e){var buttons=[].slice.call(group.querySelectorAll(selector+'.active'));buttons.map(function(button){button.classList.remove('active');});this.classList.add('active');});});}
var initCheck=function(){KTUtil.on(document.body,'[data-kt-check="true"]','change',function(e){var check=this;var targets=document.querySelectorAll(check.getAttribute('data-kt-check-target'));KTUtil.each(targets,function(target){if(target.type=='checkbox'){target.checked=check.checked;}else{target.classList.toggle('active');}});});}
var initSelect2=function(){var elements=[].slice.call(document.querySelectorAll('[data-control="select2"], [data-kt-select2="true"]'));elements.map(function(element){var options={dir:document.body.getAttribute('direction')};if(element.getAttribute('data-hide-search')=='true'){options.minimumResultsForSearch=Infinity;}
$(element).select2(options);});}
var initAutosize=function(){var inputs=[].slice.call(document.querySelectorAll('[data-kt-autosize="true"]'));inputs.map(function(input){autosize(input);});}
var initCountUp=function(){var elements=[].slice.call(document.querySelectorAll('[data-kt-countup="true"]:not(.counted)'));elements.map(function(element){if(KTUtil.isInViewport(element)&&KTUtil.visible(element)){var options={};var value=element.getAttribute('data-kt-countup-value');value=parseFloat(value.replace(/,/g,""));if(element.hasAttribute('data-kt-countup-start-val')){options.startVal=parseFloat(element.getAttribute('data-kt-countup-start-val'));}
if(element.hasAttribute('data-kt-countup-duration')){options.duration=parseInt(element.getAttribute('data-kt-countup-duration'));}
if(element.hasAttribute('data-kt-countup-decimal-places')){options.decimalPlaces=parseInt(element.getAttribute('data-kt-countup-decimal-places'));}
if(element.hasAttribute('data-kt-countup-prefix')){options.prefix=element.getAttribute('data-kt-countup-prefix');}
if(element.hasAttribute('data-kt-countup-suffix')){options.suffix=element.getAttribute('data-kt-countup-suffix');}
var count=new countUp.CountUp(element,value,options);count.start();element.classList.add('counted');}});}
var initCountUpTabs=function(){initCountUp();window.addEventListener('scroll',initCountUp);var tabs=[].slice.call(document.querySelectorAll('[data-kt-countup-tabs="true"][data-bs-toggle="tab"]'));tabs.map(function(tab){tab.addEventListener('shown.bs.tab',initCountUp);});}
var initTinySliders=function(){var initSlider=function(el){if(!el){return;}
const tnsOptions={};const checkBool=function(val){if(val==='true'){return true;}
if(val==='false'){return false;}
return val;};el.getAttributeNames().forEach(function(attrName){if((/^data-tns-.*/g).test(attrName)){let optionName=attrName.replace('data-tns-','').toLowerCase().replace(/(?:[\s-])\w/g,function(match){return match.replace('-','').toUpperCase();});if(attrName==='data-tns-responsive'){const jsonStr=el.getAttribute(attrName).replace(/(\w+:)|(\w+ :)/g,function(matched){return '"'+matched.substring(0,matched.length-1)+'":';});try{tnsOptions[optionName]=JSON.parse(jsonStr);}
catch(e){}}
else{tnsOptions[optionName]=checkBool(el.getAttribute(attrName));}}});const opt=Object.assign({},{container:el,slideBy:'page',autoplay:true,autoplayButtonOutput:false,},tnsOptions);if(el.closest('.tns')){KTUtil.addClass(el.closest('.tns'),'tns-initiazlied');}
return tns(opt);}
const elements=Array.prototype.slice.call(document.querySelectorAll('[data-tns="true"]'),0);if(!elements&&elements.length===0){return;}
elements.forEach(function(el){initSlider(el);});}
var initSmoothScroll=function(){if(SmoothScroll){new SmoothScroll('a[data-kt-scroll-toggle][href*="#"]',{speed:900,offset:function(anchor,toggle){if(anchor.hasAttribute('data-kt-scroll-offset')){var val=KTUtil.getResponsiveValue(anchor.getAttribute('data-kt-scroll-offset'));return val;}else{return 0;}}});}}
var initBootstrapToast=()=>{var toastElList=[].slice.call(document.querySelectorAll('.toast'));var toastList=toastElList.map(function(toastEl){return new bootstrap.Toast(toastEl,{})});}
return{init:function(){this.initPageLoader();this.initBootstrapTooltips();this.initBootstrapPopovers();this.initScrollSpy();this.initButtons();this.initCheck();this.initSelect2();this.initCountUp();this.initCountUpTabs();this.initAutosize();this.initTinySliders();this.initSmoothScroll();this.initBootstrapToast();},initPageLoader:function(){initPageLoader();},initBootstrapTooltip:function(el,options){return initBootstrapTooltip(el,options);},initBootstrapTooltips:function(){initBootstrapTooltips();},initBootstrapPopovers:function(){initBootstrapPopovers();},initBootstrapPopover:function(el,options){return initBootstrapPopover(el,options);},initScrollSpy:function(){initScrollSpy();},initButtons:function(){initButtons();},initCheck:function(){initCheck();},initSelect2:function(){initSelect2();},initCountUp:function(){initCountUp();},initCountUpTabs:function(){initCountUpTabs();},initAutosize:function(){initAutosize();},initTinySliders:function(){initTinySliders();},initSmoothScroll:function(){initSmoothScroll();},initBootstrapToast:function(){initBootstrapToast();},isDarkMode:function(){return document.body.classList.contains('dark-mode');}};}();KTUtil.onDOMContentLoaded(function(){KTApp.init();});window.addEventListener("load",function(){KTApp.initPageLoader();});if(typeof module!=='undefined'&&typeof module.exports!=='undefined'){module.exports=KTApp;}
"use strict";var KTLayoutAside=function(){var toggle;var aside;var handleToggle=function(){var toggleObj=KTToggle.getInstance(toggle);toggleObj.on('kt.toggle.change',function(){aside.classList.add('animating');setTimeout(function(){aside.classList.remove('animating');},300);})}
return{init:function(){aside=document.querySelector('#kt_aside');toggle=document.querySelector('#kt_aside_toggle');if(!aside||!toggle){return;}
handleToggle();}};}();KTUtil.onDOMContentLoaded(function(){KTLayoutAside.init();});"use strict";var KTLayoutExplore=function(){var explore;return{init:function(){explore=document.querySelector('#kt_explore');if(!explore){return;}}};}();KTUtil.onDOMContentLoaded(function(){KTLayoutExplore.init();});"use strict";var KTLayoutSearch=function(){var element;var formElement;var mainElement;var resultsElement;var wrapperElement;var emptyElement;var preferencesElement;var preferencesShowElement;var preferencesDismissElement;var advancedOptionsFormElement;var advancedOptionsFormShowElement;var advancedOptionsFormCancelElement;var advancedOptionsFormSearchElement;var searchObject;var processs=function(search){var timeout=setTimeout(function(){var number=KTUtil.getRandomInt(1,3);mainElement.classList.add('d-none');if(number===3){resultsElement.classList.add('d-none');emptyElement.classList.remove('d-none');}else{resultsElement.classList.remove('d-none');emptyElement.classList.add('d-none');}
search.complete();},1500);}
var clear=function(search){mainElement.classList.remove('d-none');resultsElement.classList.add('d-none');emptyElement.classList.add('d-none');}
var handlePreferences=function(){preferencesShowElement.addEventListener('click',function(){wrapperElement.classList.add('d-none');preferencesElement.classList.remove('d-none');});preferencesDismissElement.addEventListener('click',function(){wrapperElement.classList.remove('d-none');preferencesElement.classList.add('d-none');});}
var handleAdvancedOptionsForm=function(){advancedOptionsFormShowElement.addEventListener('click',function(){wrapperElement.classList.add('d-none');advancedOptionsFormElement.classList.remove('d-none');});advancedOptionsFormCancelElement.addEventListener('click',function(){wrapperElement.classList.remove('d-none');advancedOptionsFormElement.classList.add('d-none');});advancedOptionsFormSearchElement.addEventListener('click',function(){});}
return{init:function(){element=document.querySelector('#kt_header_search');if(!element){return;}
wrapperElement=element.querySelector('[data-kt-search-element="wrapper"]');formElement=element.querySelector('[data-kt-search-element="form"]');mainElement=element.querySelector('[data-kt-search-element="main"]');resultsElement=element.querySelector('[data-kt-search-element="results"]');emptyElement=element.querySelector('[data-kt-search-element="empty"]');preferencesElement=element.querySelector('[data-kt-search-element="preferences"]');preferencesShowElement=element.querySelector('[data-kt-search-element="preferences-show"]');preferencesDismissElement=element.querySelector('[data-kt-search-element="preferences-dismiss"]');advancedOptionsFormElement=element.querySelector('[data-kt-search-element="advanced-options-form"]');advancedOptionsFormShowElement=element.querySelector('[data-kt-search-element="advanced-options-form-show"]');advancedOptionsFormCancelElement=element.querySelector('[data-kt-search-element="advanced-options-form-cancel"]');advancedOptionsFormSearchElement=element.querySelector('[data-kt-search-element="advanced-options-form-search"]');searchObject=new KTSearch(element);searchObject.on('kt.search.process',processs);searchObject.on('kt.search.clear',clear);handlePreferences();handleAdvancedOptionsForm();}};}();KTUtil.onDOMContentLoaded(function(){KTLayoutSearch.init();});"use strict";var KTLayoutToolbar=function(){var toolbar;var initForm=function(){var rangeSlider=document.querySelector("#kt_toolbar_slider");var rangeSliderValueElement=document.querySelector("#kt_toolbar_slider_value");if(!rangeSlider){return;}
noUiSlider.create(rangeSlider,{start:[5],connect:[true,false],step:1,format:wNumb({decimals:1}),range:{min:[1],max:[10]}});rangeSlider.noUiSlider.on("update",function(values,handle){rangeSliderValueElement.innerHTML=values[handle];});var handle=rangeSlider.querySelector(".noUi-handle");handle.setAttribute("tabindex",0);handle.addEventListener("click",function(){this.focus();});handle.addEventListener("keydown",function(event){var value=Number(rangeSlider.noUiSlider.get());switch(event.which){case 37:rangeSlider.noUiSlider.set(value-1);break;case 39:rangeSlider.noUiSlider.set(value+1);break;}});}
return{init:function(){toolbar=document.querySelector('#kt_toolbar');if(!toolbar){return;}
initForm();}};}();KTUtil.onDOMContentLoaded(function(){KTLayoutToolbar.init();});