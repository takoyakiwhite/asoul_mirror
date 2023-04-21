/*! DataTables 1.11.3
* ©2008-2021 SpryMedia Ltd - datatables.net/license
*/(function(factory){"use strict";if(typeof define==='function'&&define.amd){define(['jquery'],function($){return factory($,window,document);});}
else if(typeof exports==='object'){module.exports=function(root,$){if(!root){root=window;}
if(!$){$=typeof window!=='undefined'?require('jquery'):require('jquery')(root);}
return factory($,root,root.document);};}
else{window.DataTable=factory(jQuery,window,document);}}
(function($,window,document,undefined){"use strict";var DataTable=function(selector,options)
{if(this instanceof DataTable){return $(selector).DataTable(options);}
else{options=selector;}
this.$=function(sSelector,oOpts)
{return this.api(true).$(sSelector,oOpts);};this._=function(sSelector,oOpts)
{return this.api(true).rows(sSelector,oOpts).data();};this.api=function(traditional)
{return traditional?new _Api(_fnSettingsFromNode(this[_ext.iApiIndex])):new _Api(this);};this.fnAddData=function(data,redraw)
{var api=this.api(true);var rows=Array.isArray(data)&&(Array.isArray(data[0])||$.isPlainObject(data[0]))?api.rows.add(data):api.row.add(data);if(redraw===undefined||redraw){api.draw();}
return rows.flatten().toArray();};this.fnAdjustColumnSizing=function(bRedraw)
{var api=this.api(true).columns.adjust();var settings=api.settings()[0];var scroll=settings.oScroll;if(bRedraw===undefined||bRedraw){api.draw(false);}
else if(scroll.sX!==""||scroll.sY!==""){_fnScrollDraw(settings);}};this.fnClearTable=function(bRedraw)
{var api=this.api(true).clear();if(bRedraw===undefined||bRedraw){api.draw();}};this.fnClose=function(nTr)
{this.api(true).row(nTr).child.hide();};this.fnDeleteRow=function(target,callback,redraw)
{var api=this.api(true);var rows=api.rows(target);var settings=rows.settings()[0];var data=settings.aoData[rows[0][0]];rows.remove();if(callback){callback.call(this,settings,data);}
if(redraw===undefined||redraw){api.draw();}
return data;};this.fnDestroy=function(remove)
{this.api(true).destroy(remove);};this.fnDraw=function(complete)
{this.api(true).draw(complete);};this.fnFilter=function(sInput,iColumn,bRegex,bSmart,bShowGlobal,bCaseInsensitive)
{var api=this.api(true);if(iColumn===null||iColumn===undefined){api.search(sInput,bRegex,bSmart,bCaseInsensitive);}
else{api.column(iColumn).search(sInput,bRegex,bSmart,bCaseInsensitive);}
api.draw();};this.fnGetData=function(src,col)
{var api=this.api(true);if(src!==undefined){var type=src.nodeName?src.nodeName.toLowerCase():'';return col!==undefined||type=='td'||type=='th'?api.cell(src,col).data():api.row(src).data()||null;}
return api.data().toArray();};this.fnGetNodes=function(iRow)
{var api=this.api(true);return iRow!==undefined?api.row(iRow).node():api.rows().nodes().flatten().toArray();};this.fnGetPosition=function(node)
{var api=this.api(true);var nodeName=node.nodeName.toUpperCase();if(nodeName=='TR'){return api.row(node).index();}
else if(nodeName=='TD'||nodeName=='TH'){var cell=api.cell(node).index();return[cell.row,cell.columnVisible,cell.column];}
return null;};this.fnIsOpen=function(nTr)
{return this.api(true).row(nTr).child.isShown();};this.fnOpen=function(nTr,mHtml,sClass)
{return this.api(true).row(nTr).child(mHtml,sClass).show().child()[0];};this.fnPageChange=function(mAction,bRedraw)
{var api=this.api(true).page(mAction);if(bRedraw===undefined||bRedraw){api.draw(false);}};this.fnSetColumnVis=function(iCol,bShow,bRedraw)
{var api=this.api(true).column(iCol).visible(bShow);if(bRedraw===undefined||bRedraw){api.columns.adjust().draw();}};this.fnSettings=function()
{return _fnSettingsFromNode(this[_ext.iApiIndex]);};this.fnSort=function(aaSort)
{this.api(true).order(aaSort).draw();};this.fnSortListener=function(nNode,iColumn,fnCallback)
{this.api(true).order.listener(nNode,iColumn,fnCallback);};this.fnUpdate=function(mData,mRow,iColumn,bRedraw,bAction)
{var api=this.api(true);if(iColumn===undefined||iColumn===null){api.row(mRow).data(mData);}
else{api.cell(mRow,iColumn).data(mData);}
if(bAction===undefined||bAction){api.columns.adjust();}
if(bRedraw===undefined||bRedraw){api.draw();}
return 0;};this.fnVersionCheck=_ext.fnVersionCheck;var _that=this;var emptyInit=options===undefined;var len=this.length;if(emptyInit){options={};}
this.oApi=this.internal=_ext.internal;for(var fn in DataTable.ext.internal){if(fn){this[fn]=_fnExternApiFunc(fn);}}
this.each(function(){var o={};var oInit=len>1?_fnExtend(o,options,true):options;var i=0,iLen,j,jLen,k,kLen;var sId=this.getAttribute('id');var bInitHandedOff=false;var defaults=DataTable.defaults;var $this=$(this);if(this.nodeName.toLowerCase()!='table')
{_fnLog(null,0,'Non-table node initialisation ('+this.nodeName+')',2);return;}
_fnCompatOpts(defaults);_fnCompatCols(defaults.column);_fnCamelToHungarian(defaults,defaults,true);_fnCamelToHungarian(defaults.column,defaults.column,true);_fnCamelToHungarian(defaults,$.extend(oInit,$this.data()),true);var allSettings=DataTable.settings;for(i=0,iLen=allSettings.length;i<iLen;i++)
{var s=allSettings[i];if(s.nTable==this||(s.nTHead&&s.nTHead.parentNode==this)||(s.nTFoot&&s.nTFoot.parentNode==this)){var bRetrieve=oInit.bRetrieve!==undefined?oInit.bRetrieve:defaults.bRetrieve;var bDestroy=oInit.bDestroy!==undefined?oInit.bDestroy:defaults.bDestroy;if(emptyInit||bRetrieve)
{return s.oInstance;}
else if(bDestroy)
{s.oInstance.fnDestroy();break;}
else
{_fnLog(s,0,'Cannot reinitialise DataTable',3);return;}}
if(s.sTableId==this.id)
{allSettings.splice(i,1);break;}}
if(sId===null||sId==="")
{sId="DataTables_Table_"+(DataTable.ext._unique++);this.id=sId;}
var oSettings=$.extend(true,{},DataTable.models.oSettings,{"sDestroyWidth":$this[0].style.width,"sInstance":sId,"sTableId":sId});oSettings.nTable=this;oSettings.oApi=_that.internal;oSettings.oInit=oInit;allSettings.push(oSettings);oSettings.oInstance=(_that.length===1)?_that:$this.dataTable();_fnCompatOpts(oInit);_fnLanguageCompat(oInit.oLanguage);if(oInit.aLengthMenu&&!oInit.iDisplayLength)
{oInit.iDisplayLength=Array.isArray(oInit.aLengthMenu[0])?oInit.aLengthMenu[0][0]:oInit.aLengthMenu[0];}
oInit=_fnExtend($.extend(true,{},defaults),oInit);_fnMap(oSettings.oFeatures,oInit,["bPaginate","bLengthChange","bFilter","bSort","bSortMulti","bInfo","bProcessing","bAutoWidth","bSortClasses","bServerSide","bDeferRender"]);_fnMap(oSettings,oInit,["asStripeClasses","ajax","fnServerData","fnFormatNumber","sServerMethod","aaSorting","aaSortingFixed","aLengthMenu","sPaginationType","sAjaxSource","sAjaxDataProp","iStateDuration","sDom","bSortCellsTop","iTabIndex","fnStateLoadCallback","fnStateSaveCallback","renderer","searchDelay","rowId",["iCookieDuration","iStateDuration"],["oSearch","oPreviousSearch"],["aoSearchCols","aoPreSearchCols"],["iDisplayLength","_iDisplayLength"]]);_fnMap(oSettings.oScroll,oInit,[["sScrollX","sX"],["sScrollXInner","sXInner"],["sScrollY","sY"],["bScrollCollapse","bCollapse"]]);_fnMap(oSettings.oLanguage,oInit,"fnInfoCallback");_fnCallbackReg(oSettings,'aoDrawCallback',oInit.fnDrawCallback,'user');_fnCallbackReg(oSettings,'aoServerParams',oInit.fnServerParams,'user');_fnCallbackReg(oSettings,'aoStateSaveParams',oInit.fnStateSaveParams,'user');_fnCallbackReg(oSettings,'aoStateLoadParams',oInit.fnStateLoadParams,'user');_fnCallbackReg(oSettings,'aoStateLoaded',oInit.fnStateLoaded,'user');_fnCallbackReg(oSettings,'aoRowCallback',oInit.fnRowCallback,'user');_fnCallbackReg(oSettings,'aoRowCreatedCallback',oInit.fnCreatedRow,'user');_fnCallbackReg(oSettings,'aoHeaderCallback',oInit.fnHeaderCallback,'user');_fnCallbackReg(oSettings,'aoFooterCallback',oInit.fnFooterCallback,'user');_fnCallbackReg(oSettings,'aoInitComplete',oInit.fnInitComplete,'user');_fnCallbackReg(oSettings,'aoPreDrawCallback',oInit.fnPreDrawCallback,'user');oSettings.rowIdFn=_fnGetObjectDataFn(oInit.rowId);_fnBrowserDetect(oSettings);var oClasses=oSettings.oClasses;$.extend(oClasses,DataTable.ext.classes,oInit.oClasses);$this.addClass(oClasses.sTable);if(oSettings.iInitDisplayStart===undefined)
{oSettings.iInitDisplayStart=oInit.iDisplayStart;oSettings._iDisplayStart=oInit.iDisplayStart;}
if(oInit.iDeferLoading!==null)
{oSettings.bDeferLoading=true;var tmp=Array.isArray(oInit.iDeferLoading);oSettings._iRecordsDisplay=tmp?oInit.iDeferLoading[0]:oInit.iDeferLoading;oSettings._iRecordsTotal=tmp?oInit.iDeferLoading[1]:oInit.iDeferLoading;}
var oLanguage=oSettings.oLanguage;$.extend(true,oLanguage,oInit.oLanguage);if(oLanguage.sUrl)
{$.ajax({dataType:'json',url:oLanguage.sUrl,success:function(json){_fnCamelToHungarian(defaults.oLanguage,json);_fnLanguageCompat(json);$.extend(true,oLanguage,json);_fnCallbackFire(oSettings,null,'i18n',[oSettings]);_fnInitialise(oSettings);},error:function(){_fnInitialise(oSettings);}});bInitHandedOff=true;}
else{_fnCallbackFire(oSettings,null,'i18n',[oSettings]);}
if(oInit.asStripeClasses===null)
{oSettings.asStripeClasses=[oClasses.sStripeOdd,oClasses.sStripeEven];}
var stripeClasses=oSettings.asStripeClasses;var rowOne=$this.children('tbody').find('tr').eq(0);if($.inArray(true,$.map(stripeClasses,function(el,i){return rowOne.hasClass(el);}))!==-1){$('tbody tr',this).removeClass(stripeClasses.join(' '));oSettings.asDestroyStripes=stripeClasses.slice();}
var anThs=[];var aoColumnsInit;var nThead=this.getElementsByTagName('thead');if(nThead.length!==0)
{_fnDetectHeader(oSettings.aoHeader,nThead[0]);anThs=_fnGetUniqueThs(oSettings);}
if(oInit.aoColumns===null)
{aoColumnsInit=[];for(i=0,iLen=anThs.length;i<iLen;i++)
{aoColumnsInit.push(null);}}
else
{aoColumnsInit=oInit.aoColumns;}
for(i=0,iLen=aoColumnsInit.length;i<iLen;i++)
{_fnAddColumn(oSettings,anThs?anThs[i]:null);}
_fnApplyColumnDefs(oSettings,oInit.aoColumnDefs,aoColumnsInit,function(iCol,oDef){_fnColumnOptions(oSettings,iCol,oDef);});if(rowOne.length){var a=function(cell,name){return cell.getAttribute('data-'+name)!==null?name:null;};$(rowOne[0]).children('th, td').each(function(i,cell){var col=oSettings.aoColumns[i];if(col.mData===i){var sort=a(cell,'sort')||a(cell,'order');var filter=a(cell,'filter')||a(cell,'search');if(sort!==null||filter!==null){col.mData={_:i+'.display',sort:sort!==null?i+'.@data-'+sort:undefined,type:sort!==null?i+'.@data-'+sort:undefined,filter:filter!==null?i+'.@data-'+filter:undefined};_fnColumnOptions(oSettings,i);}}});}
var features=oSettings.oFeatures;var loadedInit=function(){if(oInit.aaSorting===undefined){var sorting=oSettings.aaSorting;for(i=0,iLen=sorting.length;i<iLen;i++){sorting[i][1]=oSettings.aoColumns[i].asSorting[0];}}
_fnSortingClasses(oSettings);if(features.bSort){_fnCallbackReg(oSettings,'aoDrawCallback',function(){if(oSettings.bSorted){var aSort=_fnSortFlatten(oSettings);var sortedColumns={};$.each(aSort,function(i,val){sortedColumns[val.src]=val.dir;});_fnCallbackFire(oSettings,null,'order',[oSettings,aSort,sortedColumns]);_fnSortAria(oSettings);}});}
_fnCallbackReg(oSettings,'aoDrawCallback',function(){if(oSettings.bSorted||_fnDataSource(oSettings)==='ssp'||features.bDeferRender){_fnSortingClasses(oSettings);}},'sc');var captions=$this.children('caption').each(function(){this._captionSide=$(this).css('caption-side');});var thead=$this.children('thead');if(thead.length===0){thead=$('<thead/>').appendTo($this);}
oSettings.nTHead=thead[0];var tbody=$this.children('tbody');if(tbody.length===0){tbody=$('<tbody/>').insertAfter(thead);}
oSettings.nTBody=tbody[0];var tfoot=$this.children('tfoot');if(tfoot.length===0&&captions.length>0&&(oSettings.oScroll.sX!==""||oSettings.oScroll.sY!=="")){tfoot=$('<tfoot/>').appendTo($this);}
if(tfoot.length===0||tfoot.children().length===0){$this.addClass(oClasses.sNoFooter);}
else if(tfoot.length>0){oSettings.nTFoot=tfoot[0];_fnDetectHeader(oSettings.aoFooter,oSettings.nTFoot);}
if(oInit.aaData){for(i=0;i<oInit.aaData.length;i++){_fnAddData(oSettings,oInit.aaData[i]);}}
else if(oSettings.bDeferLoading||_fnDataSource(oSettings)=='dom'){_fnAddTr(oSettings,$(oSettings.nTBody).children('tr'));}
oSettings.aiDisplay=oSettings.aiDisplayMaster.slice();oSettings.bInitialised=true;if(bInitHandedOff===false){_fnInitialise(oSettings);}};_fnCallbackReg(oSettings,'aoDrawCallback',_fnSaveState,'state_save');if(oInit.bStateSave)
{features.bStateSave=true;_fnLoadState(oSettings,oInit,loadedInit);}
else{loadedInit();}});_that=null;return this;};var _ext;var _Api;var _api_register;var _api_registerPlural;var _re_dic={};var _re_new_lines=/[\r\n\u2028]/g;var _re_html=/<.*?>/g;var _re_date=/^\d{2,4}[\.\/\-]\d{1,2}[\.\/\-]\d{1,2}([T ]{1}\d{1,2}[:\.]\d{2}([\.:]\d{2})?)?$/;var _re_escape_regex=new RegExp('(\\'+['/','.','*','+','?','|','(',')','[',']','{','}','\\','$','^','-'].join('|\\')+')','g');var _re_formatted_numeric=/['\u00A0,$£€¥%\u2009\u202F\u20BD\u20a9\u20BArfkɃΞ]/gi;var _empty=function(d){return!d||d===true||d==='-'?true:false;};var _intVal=function(s){var integer=parseInt(s,10);return!isNaN(integer)&&isFinite(s)?integer:null;};var _numToDecimal=function(num,decimalPoint){if(!_re_dic[decimalPoint]){_re_dic[decimalPoint]=new RegExp(_fnEscapeRegex(decimalPoint),'g');}
return typeof num==='string'&&decimalPoint!=='.'?num.replace(/\./g,'').replace(_re_dic[decimalPoint],'.'):num;};var _isNumber=function(d,decimalPoint,formatted){var strType=typeof d==='string';if(_empty(d)){return true;}
if(decimalPoint&&strType){d=_numToDecimal(d,decimalPoint);}
if(formatted&&strType){d=d.replace(_re_formatted_numeric,'');}
return!isNaN(parseFloat(d))&&isFinite(d);};var _isHtml=function(d){return _empty(d)||typeof d==='string';};var _htmlNumeric=function(d,decimalPoint,formatted){if(_empty(d)){return true;}
var html=_isHtml(d);return!html?null:_isNumber(_stripHtml(d),decimalPoint,formatted)?true:null;};var _pluck=function(a,prop,prop2){var out=[];var i=0,ien=a.length;if(prop2!==undefined){for(;i<ien;i++){if(a[i]&&a[i][prop]){out.push(a[i][prop][prop2]);}}}
else{for(;i<ien;i++){if(a[i]){out.push(a[i][prop]);}}}
return out;};var _pluck_order=function(a,order,prop,prop2)
{var out=[];var i=0,ien=order.length;if(prop2!==undefined){for(;i<ien;i++){if(a[order[i]][prop]){out.push(a[order[i]][prop][prop2]);}}}
else{for(;i<ien;i++){out.push(a[order[i]][prop]);}}
return out;};var _range=function(len,start)
{var out=[];var end;if(start===undefined){start=0;end=len;}
else{end=start;start=len;}
for(var i=start;i<end;i++){out.push(i);}
return out;};var _removeEmpty=function(a)
{var out=[];for(var i=0,ien=a.length;i<ien;i++){if(a[i]){out.push(a[i]);}}
return out;};var _stripHtml=function(d){return d.replace(_re_html,'');};var _areAllUnique=function(src){if(src.length<2){return true;}
var sorted=src.slice().sort();var last=sorted[0];for(var i=1,ien=sorted.length;i<ien;i++){if(sorted[i]===last){return false;}
last=sorted[i];}
return true;};var _unique=function(src)
{if(_areAllUnique(src)){return src.slice();}
var
out=[],val,i,ien=src.length,j,k=0;again:for(i=0;i<ien;i++){val=src[i];for(j=0;j<k;j++){if(out[j]===val){continue again;}}
out.push(val);k++;}
return out;};var _flatten=function(out,val){if(Array.isArray(val)){for(var i=0;i<val.length;i++){_flatten(out,val[i]);}}
else{out.push(val);}
return out;}
var _includes=function(search,start){if(start===undefined){start=0;}
return this.indexOf(search,start)!==-1;};if(!Array.isArray){Array.isArray=function(arg){return Object.prototype.toString.call(arg)==='[object Array]';};}
if(!Array.prototype.includes){Array.prototype.includes=_includes;}
if(!String.prototype.trim){String.prototype.trim=function(){return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,'');};}
if(!String.prototype.includes){String.prototype.includes=_includes;}
DataTable.util={throttle:function(fn,freq){var
frequency=freq!==undefined?freq:200,last,timer;return function(){var
that=this,now=+new Date(),args=arguments;if(last&&now<last+frequency){clearTimeout(timer);timer=setTimeout(function(){last=undefined;fn.apply(that,args);},frequency);}
else{last=now;fn.apply(that,args);}};},escapeRegex:function(val){return val.replace(_re_escape_regex,'\\$1');},set:function(source){if($.isPlainObject(source)){return DataTable.util.set(source._);}
else if(source===null){return function(){};}
else if(typeof source==='function'){return function(data,val,meta){source(data,'set',val,meta);};}
else if(typeof source==='string'&&(source.indexOf('.')!==-1||source.indexOf('[')!==-1||source.indexOf('(')!==-1))
{var setData=function(data,val,src){var a=_fnSplitObjNotation(src),b;var aLast=a[a.length-1];var arrayNotation,funcNotation,o,innerSrc;for(var i=0,iLen=a.length-1;i<iLen;i++){if(a[i]==='__proto__'||a[i]==='constructor'){throw new Error('Cannot set prototype values');}
arrayNotation=a[i].match(__reArray);funcNotation=a[i].match(__reFn);if(arrayNotation){a[i]=a[i].replace(__reArray,'');data[a[i]]=[];b=a.slice();b.splice(0,i+1);innerSrc=b.join('.');if(Array.isArray(val)){for(var j=0,jLen=val.length;j<jLen;j++){o={};setData(o,val[j],innerSrc);data[a[i]].push(o);}}
else{data[a[i]]=val;}
return;}
else if(funcNotation){a[i]=a[i].replace(__reFn,'');data=data[a[i]](val);}
if(data[a[i]]===null||data[a[i]]===undefined){data[a[i]]={};}
data=data[a[i]];}
if(aLast.match(__reFn)){data=data[aLast.replace(__reFn,'')](val);}
else{data[aLast.replace(__reArray,'')]=val;}};return function(data,val){return setData(data,val,source);};}
else{return function(data,val){data[source]=val;};}},get:function(source){if($.isPlainObject(source)){var o={};$.each(source,function(key,val){if(val){o[key]=DataTable.util.get(val);}});return function(data,type,row,meta){var t=o[type]||o._;return t!==undefined?t(data,type,row,meta):data;};}
else if(source===null){return function(data){return data;};}
else if(typeof source==='function'){return function(data,type,row,meta){return source(data,type,row,meta);};}
else if(typeof source==='string'&&(source.indexOf('.')!==-1||source.indexOf('[')!==-1||source.indexOf('(')!==-1))
{var fetchData=function(data,type,src){var arrayNotation,funcNotation,out,innerSrc;if(src!==""){var a=_fnSplitObjNotation(src);for(var i=0,iLen=a.length;i<iLen;i++){arrayNotation=a[i].match(__reArray);funcNotation=a[i].match(__reFn);if(arrayNotation){a[i]=a[i].replace(__reArray,'');if(a[i]!==""){data=data[a[i]];}
out=[];a.splice(0,i+1);innerSrc=a.join('.');if(Array.isArray(data)){for(var j=0,jLen=data.length;j<jLen;j++){out.push(fetchData(data[j],type,innerSrc));}}
var join=arrayNotation[0].substring(1,arrayNotation[0].length-1);data=(join==="")?out:out.join(join);break;}
else if(funcNotation){a[i]=a[i].replace(__reFn,'');data=data[a[i]]();continue;}
if(data===null||data[a[i]]===undefined){return undefined;}
data=data[a[i]];}}
return data;};return function(data,type){return fetchData(data,type,source);};}
else{return function(data,type){return data[source];};}}};function _fnHungarianMap(o)
{var
hungarian='a aa ai ao as b fn i m o s ',match,newKey,map={};$.each(o,function(key,val){match=key.match(/^([^A-Z]+?)([A-Z])/);if(match&&hungarian.indexOf(match[1]+' ')!==-1)
{newKey=key.replace(match[0],match[2].toLowerCase());map[newKey]=key;if(match[1]==='o')
{_fnHungarianMap(o[key]);}}});o._hungarianMap=map;}
function _fnCamelToHungarian(src,user,force)
{if(!src._hungarianMap){_fnHungarianMap(src);}
var hungarianKey;$.each(user,function(key,val){hungarianKey=src._hungarianMap[key];if(hungarianKey!==undefined&&(force||user[hungarianKey]===undefined))
{if(hungarianKey.charAt(0)==='o')
{if(!user[hungarianKey]){user[hungarianKey]={};}
$.extend(true,user[hungarianKey],user[key]);_fnCamelToHungarian(src[hungarianKey],user[hungarianKey],force);}
else{user[hungarianKey]=user[key];}}});}
function _fnLanguageCompat(lang)
{var defaults=DataTable.defaults.oLanguage;var defaultDecimal=defaults.sDecimal;if(defaultDecimal){_addNumericSort(defaultDecimal);}
if(lang){var zeroRecords=lang.sZeroRecords;if(!lang.sEmptyTable&&zeroRecords&&defaults.sEmptyTable==="No data available in table")
{_fnMap(lang,lang,'sZeroRecords','sEmptyTable');}
if(!lang.sLoadingRecords&&zeroRecords&&defaults.sLoadingRecords==="Loading...")
{_fnMap(lang,lang,'sZeroRecords','sLoadingRecords');}
if(lang.sInfoThousands){lang.sThousands=lang.sInfoThousands;}
var decimal=lang.sDecimal;if(decimal&&defaultDecimal!==decimal){_addNumericSort(decimal);}}}
var _fnCompatMap=function(o,knew,old){if(o[knew]!==undefined){o[old]=o[knew];}};function _fnCompatOpts(init)
{_fnCompatMap(init,'ordering','bSort');_fnCompatMap(init,'orderMulti','bSortMulti');_fnCompatMap(init,'orderClasses','bSortClasses');_fnCompatMap(init,'orderCellsTop','bSortCellsTop');_fnCompatMap(init,'order','aaSorting');_fnCompatMap(init,'orderFixed','aaSortingFixed');_fnCompatMap(init,'paging','bPaginate');_fnCompatMap(init,'pagingType','sPaginationType');_fnCompatMap(init,'pageLength','iDisplayLength');_fnCompatMap(init,'searching','bFilter');if(typeof init.sScrollX==='boolean'){init.sScrollX=init.sScrollX?'100%':'';}
if(typeof init.scrollX==='boolean'){init.scrollX=init.scrollX?'100%':'';}
var searchCols=init.aoSearchCols;if(searchCols){for(var i=0,ien=searchCols.length;i<ien;i++){if(searchCols[i]){_fnCamelToHungarian(DataTable.models.oSearch,searchCols[i]);}}}}
function _fnCompatCols(init)
{_fnCompatMap(init,'orderable','bSortable');_fnCompatMap(init,'orderData','aDataSort');_fnCompatMap(init,'orderSequence','asSorting');_fnCompatMap(init,'orderDataType','sortDataType');var dataSort=init.aDataSort;if(typeof dataSort==='number'&&!Array.isArray(dataSort)){init.aDataSort=[dataSort];}}
function _fnBrowserDetect(settings)
{if(!DataTable.__browser){var browser={};DataTable.__browser=browser;var n=$('<div/>').css({position:'fixed',top:0,left:$(window).scrollLeft()*-1,height:1,width:1,overflow:'hidden'}).append($('<div/>').css({position:'absolute',top:1,left:1,width:100,overflow:'scroll'}).append($('<div/>').css({width:'100%',height:10}))).appendTo('body');var outer=n.children();var inner=outer.children();browser.barWidth=outer[0].offsetWidth-outer[0].clientWidth;browser.bScrollOversize=inner[0].offsetWidth===100&&outer[0].clientWidth!==100;browser.bScrollbarLeft=Math.round(inner.offset().left)!==1;browser.bBounding=n[0].getBoundingClientRect().width?true:false;n.remove();}
$.extend(settings.oBrowser,DataTable.__browser);settings.oScroll.iBarWidth=DataTable.__browser.barWidth;}
function _fnReduce(that,fn,init,start,end,inc)
{var
i=start,value,isSet=false;if(init!==undefined){value=init;isSet=true;}
while(i!==end){if(!that.hasOwnProperty(i)){continue;}
value=isSet?fn(value,that[i],i,that):that[i];isSet=true;i+=inc;}
return value;}
function _fnAddColumn(oSettings,nTh)
{var oDefaults=DataTable.defaults.column;var iCol=oSettings.aoColumns.length;var oCol=$.extend({},DataTable.models.oColumn,oDefaults,{"nTh":nTh?nTh:document.createElement('th'),"sTitle":oDefaults.sTitle?oDefaults.sTitle:nTh?nTh.innerHTML:'',"aDataSort":oDefaults.aDataSort?oDefaults.aDataSort:[iCol],"mData":oDefaults.mData?oDefaults.mData:iCol,idx:iCol});oSettings.aoColumns.push(oCol);var searchCols=oSettings.aoPreSearchCols;searchCols[iCol]=$.extend({},DataTable.models.oSearch,searchCols[iCol]);_fnColumnOptions(oSettings,iCol,$(nTh).data());}
function _fnColumnOptions(oSettings,iCol,oOptions)
{var oCol=oSettings.aoColumns[iCol];var oClasses=oSettings.oClasses;var th=$(oCol.nTh);if(!oCol.sWidthOrig){oCol.sWidthOrig=th.attr('width')||null;var t=(th.attr('style')||'').match(/width:\s*(\d+[pxem%]+)/);if(t){oCol.sWidthOrig=t[1];}}
if(oOptions!==undefined&&oOptions!==null)
{_fnCompatCols(oOptions);_fnCamelToHungarian(DataTable.defaults.column,oOptions,true);if(oOptions.mDataProp!==undefined&&!oOptions.mData)
{oOptions.mData=oOptions.mDataProp;}
if(oOptions.sType)
{oCol._sManualType=oOptions.sType;}
if(oOptions.className&&!oOptions.sClass)
{oOptions.sClass=oOptions.className;}
if(oOptions.sClass){th.addClass(oOptions.sClass);}
$.extend(oCol,oOptions);_fnMap(oCol,oOptions,"sWidth","sWidthOrig");if(oOptions.iDataSort!==undefined)
{oCol.aDataSort=[oOptions.iDataSort];}
_fnMap(oCol,oOptions,"aDataSort");}
var mDataSrc=oCol.mData;var mData=_fnGetObjectDataFn(mDataSrc);var mRender=oCol.mRender?_fnGetObjectDataFn(oCol.mRender):null;var attrTest=function(src){return typeof src==='string'&&src.indexOf('@')!==-1;};oCol._bAttrSrc=$.isPlainObject(mDataSrc)&&(attrTest(mDataSrc.sort)||attrTest(mDataSrc.type)||attrTest(mDataSrc.filter));oCol._setter=null;oCol.fnGetData=function(rowData,type,meta){var innerData=mData(rowData,type,undefined,meta);return mRender&&type?mRender(innerData,type,rowData,meta):innerData;};oCol.fnSetData=function(rowData,val,meta){return _fnSetObjectDataFn(mDataSrc)(rowData,val,meta);};if(typeof mDataSrc!=='number'){oSettings._rowReadObject=true;}
if(!oSettings.oFeatures.bSort)
{oCol.bSortable=false;th.addClass(oClasses.sSortableNone);}
var bAsc=$.inArray('asc',oCol.asSorting)!==-1;var bDesc=$.inArray('desc',oCol.asSorting)!==-1;if(!oCol.bSortable||(!bAsc&&!bDesc))
{oCol.sSortingClass=oClasses.sSortableNone;oCol.sSortingClassJUI="";}
else if(bAsc&&!bDesc)
{oCol.sSortingClass=oClasses.sSortableAsc;oCol.sSortingClassJUI=oClasses.sSortJUIAscAllowed;}
else if(!bAsc&&bDesc)
{oCol.sSortingClass=oClasses.sSortableDesc;oCol.sSortingClassJUI=oClasses.sSortJUIDescAllowed;}
else
{oCol.sSortingClass=oClasses.sSortable;oCol.sSortingClassJUI=oClasses.sSortJUI;}}
function _fnAdjustColumnSizing(settings)
{if(settings.oFeatures.bAutoWidth!==false)
{var columns=settings.aoColumns;_fnCalculateColumnWidths(settings);for(var i=0,iLen=columns.length;i<iLen;i++)
{columns[i].nTh.style.width=columns[i].sWidth;}}
var scroll=settings.oScroll;if(scroll.sY!==''||scroll.sX!=='')
{_fnScrollDraw(settings);}
_fnCallbackFire(settings,null,'column-sizing',[settings]);}
function _fnVisibleToColumnIndex(oSettings,iMatch)
{var aiVis=_fnGetColumns(oSettings,'bVisible');return typeof aiVis[iMatch]==='number'?aiVis[iMatch]:null;}
function _fnColumnIndexToVisible(oSettings,iMatch)
{var aiVis=_fnGetColumns(oSettings,'bVisible');var iPos=$.inArray(iMatch,aiVis);return iPos!==-1?iPos:null;}
function _fnVisbleColumns(oSettings)
{var vis=0;$.each(oSettings.aoColumns,function(i,col){if(col.bVisible&&$(col.nTh).css('display')!=='none'){vis++;}});return vis;}
function _fnGetColumns(oSettings,sParam)
{var a=[];$.map(oSettings.aoColumns,function(val,i){if(val[sParam]){a.push(i);}});return a;}
function _fnColumnTypes(settings)
{var columns=settings.aoColumns;var data=settings.aoData;var types=DataTable.ext.type.detect;var i,ien,j,jen,k,ken;var col,cell,detectedType,cache;for(i=0,ien=columns.length;i<ien;i++){col=columns[i];cache=[];if(!col.sType&&col._sManualType){col.sType=col._sManualType;}
else if(!col.sType){for(j=0,jen=types.length;j<jen;j++){for(k=0,ken=data.length;k<ken;k++){if(cache[k]===undefined){cache[k]=_fnGetCellData(settings,k,i,'type');}
detectedType=types[j](cache[k],settings);if(!detectedType&&j!==types.length-1){break;}
if(detectedType==='html'&&!_empty(cache[k])){break;}}
if(detectedType){col.sType=detectedType;break;}}
if(!col.sType){col.sType='string';}}}}
function _fnApplyColumnDefs(oSettings,aoColDefs,aoCols,fn)
{var i,iLen,j,jLen,k,kLen,def;var columns=oSettings.aoColumns;if(aoColDefs)
{for(i=aoColDefs.length-1;i>=0;i--)
{def=aoColDefs[i];var aTargets=def.targets!==undefined?def.targets:def.aTargets;if(!Array.isArray(aTargets))
{aTargets=[aTargets];}
for(j=0,jLen=aTargets.length;j<jLen;j++)
{if(typeof aTargets[j]==='number'&&aTargets[j]>=0)
{while(columns.length<=aTargets[j])
{_fnAddColumn(oSettings);}
fn(aTargets[j],def);}
else if(typeof aTargets[j]==='number'&&aTargets[j]<0)
{fn(columns.length+aTargets[j],def);}
else if(typeof aTargets[j]==='string')
{for(k=0,kLen=columns.length;k<kLen;k++)
{if(aTargets[j]=="_all"||$(columns[k].nTh).hasClass(aTargets[j]))
{fn(k,def);}}}}}}
if(aoCols)
{for(i=0,iLen=aoCols.length;i<iLen;i++)
{fn(i,aoCols[i]);}}}
function _fnAddData(oSettings,aDataIn,nTr,anTds)
{var iRow=oSettings.aoData.length;var oData=$.extend(true,{},DataTable.models.oRow,{src:nTr?'dom':'data',idx:iRow});oData._aData=aDataIn;oSettings.aoData.push(oData);var nTd,sThisType;var columns=oSettings.aoColumns;for(var i=0,iLen=columns.length;i<iLen;i++)
{columns[i].sType=null;}
oSettings.aiDisplayMaster.push(iRow);var id=oSettings.rowIdFn(aDataIn);if(id!==undefined){oSettings.aIds[id]=oData;}
if(nTr||!oSettings.oFeatures.bDeferRender)
{_fnCreateTr(oSettings,iRow,nTr,anTds);}
return iRow;}
function _fnAddTr(settings,trs)
{var row;if(!(trs instanceof $)){trs=$(trs);}
return trs.map(function(i,el){row=_fnGetRowElements(settings,el);return _fnAddData(settings,row.data,el,row.cells);});}
function _fnNodeToDataIndex(oSettings,n)
{return(n._DT_RowIndex!==undefined)?n._DT_RowIndex:null;}
function _fnNodeToColumnIndex(oSettings,iRow,n)
{return $.inArray(n,oSettings.aoData[iRow].anCells);}
function _fnGetCellData(settings,rowIdx,colIdx,type)
{if(type==='search'){type='filter';}
else if(type==='order'){type='sort';}
var draw=settings.iDraw;var col=settings.aoColumns[colIdx];var rowData=settings.aoData[rowIdx]._aData;var defaultContent=col.sDefaultContent;var cellData=col.fnGetData(rowData,type,{settings:settings,row:rowIdx,col:colIdx});if(cellData===undefined){if(settings.iDrawError!=draw&&defaultContent===null){_fnLog(settings,0,"Requested unknown parameter "+
(typeof col.mData=='function'?'{function}':"'"+col.mData+"'")+
" for row "+rowIdx+", column "+colIdx,4);settings.iDrawError=draw;}
return defaultContent;}
if((cellData===rowData||cellData===null)&&defaultContent!==null&&type!==undefined){cellData=defaultContent;}
else if(typeof cellData==='function'){return cellData.call(rowData);}
if(cellData===null&&type==='display'){return '';}
if(type==='filter'){var fomatters=DataTable.ext.type.search;if(fomatters[col.sType]){cellData=fomatters[col.sType](cellData);}}
return cellData;}
function _fnSetCellData(settings,rowIdx,colIdx,val)
{var col=settings.aoColumns[colIdx];var rowData=settings.aoData[rowIdx]._aData;col.fnSetData(rowData,val,{settings:settings,row:rowIdx,col:colIdx});}
var __reArray=/\[.*?\]$/;var __reFn=/\(\)$/;function _fnSplitObjNotation(str)
{return $.map(str.match(/(\\.|[^\.])+/g)||[''],function(s){return s.replace(/\\\./g,'.');});}
var _fnGetObjectDataFn=DataTable.util.get;var _fnSetObjectDataFn=DataTable.util.set;function _fnGetDataMaster(settings)
{return _pluck(settings.aoData,'_aData');}
function _fnClearTable(settings)
{settings.aoData.length=0;settings.aiDisplayMaster.length=0;settings.aiDisplay.length=0;settings.aIds={};}
function _fnDeleteIndex(a,iTarget,splice)
{var iTargetIndex=-1;for(var i=0,iLen=a.length;i<iLen;i++)
{if(a[i]==iTarget)
{iTargetIndex=i;}
else if(a[i]>iTarget)
{a[i]--;}}
if(iTargetIndex!=-1&&splice===undefined)
{a.splice(iTargetIndex,1);}}
function _fnInvalidate(settings,rowIdx,src,colIdx)
{var row=settings.aoData[rowIdx];var i,ien;var cellWrite=function(cell,col){while(cell.childNodes.length){cell.removeChild(cell.firstChild);}
cell.innerHTML=_fnGetCellData(settings,rowIdx,col,'display');};if(src==='dom'||((!src||src==='auto')&&row.src==='dom')){row._aData=_fnGetRowElements(settings,row,colIdx,colIdx===undefined?undefined:row._aData).data;}
else{var cells=row.anCells;if(cells){if(colIdx!==undefined){cellWrite(cells[colIdx],colIdx);}
else{for(i=0,ien=cells.length;i<ien;i++){cellWrite(cells[i],i);}}}}
row._aSortData=null;row._aFilterData=null;var cols=settings.aoColumns;if(colIdx!==undefined){cols[colIdx].sType=null;}
else{for(i=0,ien=cols.length;i<ien;i++){cols[i].sType=null;}
_fnRowAttributes(settings,row);}}
function _fnGetRowElements(settings,row,colIdx,d)
{var
tds=[],td=row.firstChild,name,col,o,i=0,contents,columns=settings.aoColumns,objectRead=settings._rowReadObject;d=d!==undefined?d:objectRead?{}:[];var attr=function(str,td){if(typeof str==='string'){var idx=str.indexOf('@');if(idx!==-1){var attr=str.substring(idx+1);var setter=_fnSetObjectDataFn(str);setter(d,td.getAttribute(attr));}}};var cellProcess=function(cell){if(colIdx===undefined||colIdx===i){col=columns[i];contents=(cell.innerHTML).trim();if(col&&col._bAttrSrc){var setter=_fnSetObjectDataFn(col.mData._);setter(d,contents);attr(col.mData.sort,cell);attr(col.mData.type,cell);attr(col.mData.filter,cell);}
else{if(objectRead){if(!col._setter){col._setter=_fnSetObjectDataFn(col.mData);}
col._setter(d,contents);}
else{d[i]=contents;}}}
i++;};if(td){while(td){name=td.nodeName.toUpperCase();if(name=="TD"||name=="TH"){cellProcess(td);tds.push(td);}
td=td.nextSibling;}}
else{tds=row.anCells;for(var j=0,jen=tds.length;j<jen;j++){cellProcess(tds[j]);}}
var rowNode=row.firstChild?row:row.nTr;if(rowNode){var id=rowNode.getAttribute('id');if(id){_fnSetObjectDataFn(settings.rowId)(d,id);}}
return{data:d,cells:tds};}
function _fnCreateTr(oSettings,iRow,nTrIn,anTds)
{var
row=oSettings.aoData[iRow],rowData=row._aData,cells=[],nTr,nTd,oCol,i,iLen,create;if(row.nTr===null)
{nTr=nTrIn||document.createElement('tr');row.nTr=nTr;row.anCells=cells;nTr._DT_RowIndex=iRow;_fnRowAttributes(oSettings,row);for(i=0,iLen=oSettings.aoColumns.length;i<iLen;i++)
{oCol=oSettings.aoColumns[i];create=nTrIn?false:true;nTd=create?document.createElement(oCol.sCellType):anTds[i];nTd._DT_CellIndex={row:iRow,column:i};cells.push(nTd);if(create||((oCol.mRender||oCol.mData!==i)&&(!$.isPlainObject(oCol.mData)||oCol.mData._!==i+'.display'))){nTd.innerHTML=_fnGetCellData(oSettings,iRow,i,'display');}
if(oCol.sClass)
{nTd.className+=' '+oCol.sClass;}
if(oCol.bVisible&&!nTrIn)
{nTr.appendChild(nTd);}
else if(!oCol.bVisible&&nTrIn)
{nTd.parentNode.removeChild(nTd);}
if(oCol.fnCreatedCell)
{oCol.fnCreatedCell.call(oSettings.oInstance,nTd,_fnGetCellData(oSettings,iRow,i),rowData,iRow,i);}}
_fnCallbackFire(oSettings,'aoRowCreatedCallback',null,[nTr,rowData,iRow,cells]);}}
function _fnRowAttributes(settings,row)
{var tr=row.nTr;var data=row._aData;if(tr){var id=settings.rowIdFn(data);if(id){tr.id=id;}
if(data.DT_RowClass){var a=data.DT_RowClass.split(' ');row.__rowc=row.__rowc?_unique(row.__rowc.concat(a)):a;$(tr).removeClass(row.__rowc.join(' ')).addClass(data.DT_RowClass);}
if(data.DT_RowAttr){$(tr).attr(data.DT_RowAttr);}
if(data.DT_RowData){$(tr).data(data.DT_RowData);}}}
function _fnBuildHead(oSettings)
{var i,ien,cell,row,column;var thead=oSettings.nTHead;var tfoot=oSettings.nTFoot;var createHeader=$('th, td',thead).length===0;var classes=oSettings.oClasses;var columns=oSettings.aoColumns;if(createHeader){row=$('<tr/>').appendTo(thead);}
for(i=0,ien=columns.length;i<ien;i++){column=columns[i];cell=$(column.nTh).addClass(column.sClass);if(createHeader){cell.appendTo(row);}
if(oSettings.oFeatures.bSort){cell.addClass(column.sSortingClass);if(column.bSortable!==false){cell.attr('tabindex',oSettings.iTabIndex).attr('aria-controls',oSettings.sTableId);_fnSortAttachListener(oSettings,column.nTh,i);}}
if(column.sTitle!=cell[0].innerHTML){cell.html(column.sTitle);}
_fnRenderer(oSettings,'header')(oSettings,cell,column,classes);}
if(createHeader){_fnDetectHeader(oSettings.aoHeader,thead);}
$(thead).children('tr').children('th, td').addClass(classes.sHeaderTH);$(tfoot).children('tr').children('th, td').addClass(classes.sFooterTH);if(tfoot!==null){var cells=oSettings.aoFooter[0];for(i=0,ien=cells.length;i<ien;i++){column=columns[i];column.nTf=cells[i].cell;if(column.sClass){$(column.nTf).addClass(column.sClass);}}}}
function _fnDrawHead(oSettings,aoSource,bIncludeHidden)
{var i,iLen,j,jLen,k,kLen,n,nLocalTr;var aoLocal=[];var aApplied=[];var iColumns=oSettings.aoColumns.length;var iRowspan,iColspan;if(!aoSource)
{return;}
if(bIncludeHidden===undefined)
{bIncludeHidden=false;}
for(i=0,iLen=aoSource.length;i<iLen;i++)
{aoLocal[i]=aoSource[i].slice();aoLocal[i].nTr=aoSource[i].nTr;for(j=iColumns-1;j>=0;j--)
{if(!oSettings.aoColumns[j].bVisible&&!bIncludeHidden)
{aoLocal[i].splice(j,1);}}
aApplied.push([]);}
for(i=0,iLen=aoLocal.length;i<iLen;i++)
{nLocalTr=aoLocal[i].nTr;if(nLocalTr)
{while((n=nLocalTr.firstChild))
{nLocalTr.removeChild(n);}}
for(j=0,jLen=aoLocal[i].length;j<jLen;j++)
{iRowspan=1;iColspan=1;if(aApplied[i][j]===undefined)
{nLocalTr.appendChild(aoLocal[i][j].cell);aApplied[i][j]=1;while(aoLocal[i+iRowspan]!==undefined&&aoLocal[i][j].cell==aoLocal[i+iRowspan][j].cell)
{aApplied[i+iRowspan][j]=1;iRowspan++;}
while(aoLocal[i][j+iColspan]!==undefined&&aoLocal[i][j].cell==aoLocal[i][j+iColspan].cell)
{for(k=0;k<iRowspan;k++)
{aApplied[i+k][j+iColspan]=1;}
iColspan++;}
$(aoLocal[i][j].cell).attr('rowspan',iRowspan).attr('colspan',iColspan);}}}}
function _fnDraw(oSettings,ajaxComplete)
{var aPreDraw=_fnCallbackFire(oSettings,'aoPreDrawCallback','preDraw',[oSettings]);if($.inArray(false,aPreDraw)!==-1)
{_fnProcessingDisplay(oSettings,false);return;}
var i,iLen,n;var anRows=[];var iRowCount=0;var asStripeClasses=oSettings.asStripeClasses;var iStripes=asStripeClasses.length;var iOpenRows=oSettings.aoOpenRows.length;var oLang=oSettings.oLanguage;var iInitDisplayStart=oSettings.iInitDisplayStart;var bServerSide=_fnDataSource(oSettings)=='ssp';var aiDisplay=oSettings.aiDisplay;oSettings.bDrawing=true;if(iInitDisplayStart!==undefined&&iInitDisplayStart!==-1)
{oSettings._iDisplayStart=bServerSide?iInitDisplayStart:iInitDisplayStart>=oSettings.fnRecordsDisplay()?0:iInitDisplayStart;oSettings.iInitDisplayStart=-1;}
var iDisplayStart=oSettings._iDisplayStart;var iDisplayEnd=oSettings.fnDisplayEnd();if(oSettings.bDeferLoading)
{oSettings.bDeferLoading=false;oSettings.iDraw++;_fnProcessingDisplay(oSettings,false);}
else if(!bServerSide)
{oSettings.iDraw++;}
else if(!oSettings.bDestroying&&!ajaxComplete)
{_fnAjaxUpdate(oSettings);return;}
if(aiDisplay.length!==0)
{var iStart=bServerSide?0:iDisplayStart;var iEnd=bServerSide?oSettings.aoData.length:iDisplayEnd;for(var j=iStart;j<iEnd;j++)
{var iDataIndex=aiDisplay[j];var aoData=oSettings.aoData[iDataIndex];if(aoData.nTr===null)
{_fnCreateTr(oSettings,iDataIndex);}
var nRow=aoData.nTr;if(iStripes!==0)
{var sStripe=asStripeClasses[iRowCount%iStripes];if(aoData._sRowStripe!=sStripe)
{$(nRow).removeClass(aoData._sRowStripe).addClass(sStripe);aoData._sRowStripe=sStripe;}}
_fnCallbackFire(oSettings,'aoRowCallback',null,[nRow,aoData._aData,iRowCount,j,iDataIndex]);anRows.push(nRow);iRowCount++;}}
else
{var sZero=oLang.sZeroRecords;if(oSettings.iDraw==1&&_fnDataSource(oSettings)=='ajax')
{sZero=oLang.sLoadingRecords;}
else if(oLang.sEmptyTable&&oSettings.fnRecordsTotal()===0)
{sZero=oLang.sEmptyTable;}
anRows[0]=$('<tr/>',{'class':iStripes?asStripeClasses[0]:''}).append($('<td />',{'valign':'top','colSpan':_fnVisbleColumns(oSettings),'class':oSettings.oClasses.sRowEmpty}).html(sZero))[0];}
_fnCallbackFire(oSettings,'aoHeaderCallback','header',[$(oSettings.nTHead).children('tr')[0],_fnGetDataMaster(oSettings),iDisplayStart,iDisplayEnd,aiDisplay]);_fnCallbackFire(oSettings,'aoFooterCallback','footer',[$(oSettings.nTFoot).children('tr')[0],_fnGetDataMaster(oSettings),iDisplayStart,iDisplayEnd,aiDisplay]);var body=$(oSettings.nTBody);body.children().detach();body.append($(anRows));_fnCallbackFire(oSettings,'aoDrawCallback','draw',[oSettings]);oSettings.bSorted=false;oSettings.bFiltered=false;oSettings.bDrawing=false;}
function _fnReDraw(settings,holdPosition)
{var
features=settings.oFeatures,sort=features.bSort,filter=features.bFilter;if(sort){_fnSort(settings);}
if(filter){_fnFilterComplete(settings,settings.oPreviousSearch);}
else{settings.aiDisplay=settings.aiDisplayMaster.slice();}
if(holdPosition!==true){settings._iDisplayStart=0;}
settings._drawHold=holdPosition;_fnDraw(settings);settings._drawHold=false;}
function _fnAddOptionsHtml(oSettings)
{var classes=oSettings.oClasses;var table=$(oSettings.nTable);var holding=$('<div/>').insertBefore(table);var features=oSettings.oFeatures;var insert=$('<div/>',{id:oSettings.sTableId+'_wrapper','class':classes.sWrapper+(oSettings.nTFoot?'':' '+classes.sNoFooter)});oSettings.nHolding=holding[0];oSettings.nTableWrapper=insert[0];oSettings.nTableReinsertBefore=oSettings.nTable.nextSibling;var aDom=oSettings.sDom.split('');var featureNode,cOption,nNewNode,cNext,sAttr,j;for(var i=0;i<aDom.length;i++)
{featureNode=null;cOption=aDom[i];if(cOption=='<')
{nNewNode=$('<div/>')[0];cNext=aDom[i+1];if(cNext=="'"||cNext=='"')
{sAttr="";j=2;while(aDom[i+j]!=cNext)
{sAttr+=aDom[i+j];j++;}
if(sAttr=="H")
{sAttr=classes.sJUIHeader;}
else if(sAttr=="F")
{sAttr=classes.sJUIFooter;}
if(sAttr.indexOf('.')!=-1)
{var aSplit=sAttr.split('.');nNewNode.id=aSplit[0].substr(1,aSplit[0].length-1);nNewNode.className=aSplit[1];}
else if(sAttr.charAt(0)=="#")
{nNewNode.id=sAttr.substr(1,sAttr.length-1);}
else
{nNewNode.className=sAttr;}
i+=j;}
insert.append(nNewNode);insert=$(nNewNode);}
else if(cOption=='>')
{insert=insert.parent();}
else if(cOption=='l'&&features.bPaginate&&features.bLengthChange)
{featureNode=_fnFeatureHtmlLength(oSettings);}
else if(cOption=='f'&&features.bFilter)
{featureNode=_fnFeatureHtmlFilter(oSettings);}
else if(cOption=='r'&&features.bProcessing)
{featureNode=_fnFeatureHtmlProcessing(oSettings);}
else if(cOption=='t')
{featureNode=_fnFeatureHtmlTable(oSettings);}
else if(cOption=='i'&&features.bInfo)
{featureNode=_fnFeatureHtmlInfo(oSettings);}
else if(cOption=='p'&&features.bPaginate)
{featureNode=_fnFeatureHtmlPaginate(oSettings);}
else if(DataTable.ext.feature.length!==0)
{var aoFeatures=DataTable.ext.feature;for(var k=0,kLen=aoFeatures.length;k<kLen;k++)
{if(cOption==aoFeatures[k].cFeature)
{featureNode=aoFeatures[k].fnInit(oSettings);break;}}}
if(featureNode)
{var aanFeatures=oSettings.aanFeatures;if(!aanFeatures[cOption])
{aanFeatures[cOption]=[];}
aanFeatures[cOption].push(featureNode);insert.append(featureNode);}}
holding.replaceWith(insert);oSettings.nHolding=null;}
function _fnDetectHeader(aLayout,nThead)
{var nTrs=$(nThead).children('tr');var nTr,nCell;var i,k,l,iLen,jLen,iColShifted,iColumn,iColspan,iRowspan;var bUnique;var fnShiftCol=function(a,i,j){var k=a[i];while(k[j]){j++;}
return j;};aLayout.splice(0,aLayout.length);for(i=0,iLen=nTrs.length;i<iLen;i++)
{aLayout.push([]);}
for(i=0,iLen=nTrs.length;i<iLen;i++)
{nTr=nTrs[i];iColumn=0;nCell=nTr.firstChild;while(nCell){if(nCell.nodeName.toUpperCase()=="TD"||nCell.nodeName.toUpperCase()=="TH")
{iColspan=nCell.getAttribute('colspan')*1;iRowspan=nCell.getAttribute('rowspan')*1;iColspan=(!iColspan||iColspan===0||iColspan===1)?1:iColspan;iRowspan=(!iRowspan||iRowspan===0||iRowspan===1)?1:iRowspan;iColShifted=fnShiftCol(aLayout,i,iColumn);bUnique=iColspan===1?true:false;for(l=0;l<iColspan;l++)
{for(k=0;k<iRowspan;k++)
{aLayout[i+k][iColShifted+l]={"cell":nCell,"unique":bUnique};aLayout[i+k].nTr=nTr;}}}
nCell=nCell.nextSibling;}}}
function _fnGetUniqueThs(oSettings,nHeader,aLayout)
{var aReturn=[];if(!aLayout)
{aLayout=oSettings.aoHeader;if(nHeader)
{aLayout=[];_fnDetectHeader(aLayout,nHeader);}}
for(var i=0,iLen=aLayout.length;i<iLen;i++)
{for(var j=0,jLen=aLayout[i].length;j<jLen;j++)
{if(aLayout[i][j].unique&&(!aReturn[j]||!oSettings.bSortCellsTop))
{aReturn[j]=aLayout[i][j].cell;}}}
return aReturn;}
function _fnBuildAjax(oSettings,data,fn)
{_fnCallbackFire(oSettings,'aoServerParams','serverParams',[data]);if(data&&Array.isArray(data)){var tmp={};var rbracket=/(.*?)\[\]$/;$.each(data,function(key,val){var match=val.name.match(rbracket);if(match){var name=match[0];if(!tmp[name]){tmp[name]=[];}
tmp[name].push(val.value);}
else{tmp[val.name]=val.value;}});data=tmp;}
var ajaxData;var ajax=oSettings.ajax;var instance=oSettings.oInstance;var callback=function(json){var status=oSettings.jqXhr?oSettings.jqXhr.status:null;if(json===null||(typeof status==='number'&&status==204)){json={};_fnAjaxDataSrc(oSettings,json,[]);}
var error=json.error||json.sError;if(error){_fnLog(oSettings,0,error);}
oSettings.json=json;_fnCallbackFire(oSettings,null,'xhr',[oSettings,json,oSettings.jqXHR]);fn(json);};if($.isPlainObject(ajax)&&ajax.data)
{ajaxData=ajax.data;var newData=typeof ajaxData==='function'?ajaxData(data,oSettings):ajaxData;data=typeof ajaxData==='function'&&newData?newData:$.extend(true,data,newData);delete ajax.data;}
var baseAjax={"data":data,"success":callback,"dataType":"json","cache":false,"type":oSettings.sServerMethod,"error":function(xhr,error,thrown){var ret=_fnCallbackFire(oSettings,null,'xhr',[oSettings,null,oSettings.jqXHR]);if($.inArray(true,ret)===-1){if(error=="parsererror"){_fnLog(oSettings,0,'Invalid JSON response',1);}
else if(xhr.readyState===4){_fnLog(oSettings,0,'Ajax error',7);}}
_fnProcessingDisplay(oSettings,false);}};oSettings.oAjaxData=data;_fnCallbackFire(oSettings,null,'preXhr',[oSettings,data]);if(oSettings.fnServerData)
{oSettings.fnServerData.call(instance,oSettings.sAjaxSource,$.map(data,function(val,key){return{name:key,value:val};}),callback,oSettings);}
else if(oSettings.sAjaxSource||typeof ajax==='string')
{oSettings.jqXHR=$.ajax($.extend(baseAjax,{url:ajax||oSettings.sAjaxSource}));}
else if(typeof ajax==='function')
{oSettings.jqXHR=ajax.call(instance,data,callback,oSettings);}
else
{oSettings.jqXHR=$.ajax($.extend(baseAjax,ajax));ajax.data=ajaxData;}}
function _fnAjaxUpdate(settings)
{settings.iDraw++;_fnProcessingDisplay(settings,true);_fnBuildAjax(settings,_fnAjaxParameters(settings),function(json){_fnAjaxUpdateDraw(settings,json);});}
function _fnAjaxParameters(settings)
{var
columns=settings.aoColumns,columnCount=columns.length,features=settings.oFeatures,preSearch=settings.oPreviousSearch,preColSearch=settings.aoPreSearchCols,i,data=[],dataProp,column,columnSearch,sort=_fnSortFlatten(settings),displayStart=settings._iDisplayStart,displayLength=features.bPaginate!==false?settings._iDisplayLength:-1;var param=function(name,value){data.push({'name':name,'value':value});};param('sEcho',settings.iDraw);param('iColumns',columnCount);param('sColumns',_pluck(columns,'sName').join(','));param('iDisplayStart',displayStart);param('iDisplayLength',displayLength);var d={draw:settings.iDraw,columns:[],order:[],start:displayStart,length:displayLength,search:{value:preSearch.sSearch,regex:preSearch.bRegex}};for(i=0;i<columnCount;i++){column=columns[i];columnSearch=preColSearch[i];dataProp=typeof column.mData=="function"?'function':column.mData;d.columns.push({data:dataProp,name:column.sName,searchable:column.bSearchable,orderable:column.bSortable,search:{value:columnSearch.sSearch,regex:columnSearch.bRegex}});param("mDataProp_"+i,dataProp);if(features.bFilter){param('sSearch_'+i,columnSearch.sSearch);param('bRegex_'+i,columnSearch.bRegex);param('bSearchable_'+i,column.bSearchable);}
if(features.bSort){param('bSortable_'+i,column.bSortable);}}
if(features.bFilter){param('sSearch',preSearch.sSearch);param('bRegex',preSearch.bRegex);}
if(features.bSort){$.each(sort,function(i,val){d.order.push({column:val.col,dir:val.dir});param('iSortCol_'+i,val.col);param('sSortDir_'+i,val.dir);});param('iSortingCols',sort.length);}
var legacy=DataTable.ext.legacy.ajax;if(legacy===null){return settings.sAjaxSource?data:d;}
return legacy?data:d;}
function _fnAjaxUpdateDraw(settings,json)
{var compat=function(old,modern){return json[old]!==undefined?json[old]:json[modern];};var data=_fnAjaxDataSrc(settings,json);var draw=compat('sEcho','draw');var recordsTotal=compat('iTotalRecords','recordsTotal');var recordsFiltered=compat('iTotalDisplayRecords','recordsFiltered');if(draw!==undefined){if(draw*1<settings.iDraw){return;}
settings.iDraw=draw*1;}
if(!data){data=[];}
_fnClearTable(settings);settings._iRecordsTotal=parseInt(recordsTotal,10);settings._iRecordsDisplay=parseInt(recordsFiltered,10);for(var i=0,ien=data.length;i<ien;i++){_fnAddData(settings,data[i]);}
settings.aiDisplay=settings.aiDisplayMaster.slice();_fnDraw(settings,true);if(!settings._bInitComplete){_fnInitComplete(settings,json);}
_fnProcessingDisplay(settings,false);}
function _fnAjaxDataSrc(oSettings,json,write)
{var dataSrc=$.isPlainObject(oSettings.ajax)&&oSettings.ajax.dataSrc!==undefined?oSettings.ajax.dataSrc:oSettings.sAjaxDataProp;if(!write){if(dataSrc==='data'){return json.aaData||json[dataSrc];}
return dataSrc!==""?_fnGetObjectDataFn(dataSrc)(json):json;}
_fnSetObjectDataFn(dataSrc)(json,write);}
function _fnFeatureHtmlFilter(settings)
{var classes=settings.oClasses;var tableId=settings.sTableId;var language=settings.oLanguage;var previousSearch=settings.oPreviousSearch;var features=settings.aanFeatures;var input='<input type="search" class="'+classes.sFilterInput+'"/>';var str=language.sSearch;str=str.match(/_INPUT_/)?str.replace('_INPUT_',input):str+input;var filter=$('<div/>',{'id':!features.f?tableId+'_filter':null,'class':classes.sFilter}).append($('<label/>').append(str));var searchFn=function(event){var n=features.f;var val=!this.value?"":this.value;if(previousSearch.return&&event.key!=="Enter"){return;}
if(val!=previousSearch.sSearch){_fnFilterComplete(settings,{"sSearch":val,"bRegex":previousSearch.bRegex,"bSmart":previousSearch.bSmart,"bCaseInsensitive":previousSearch.bCaseInsensitive,"return":previousSearch.return});settings._iDisplayStart=0;_fnDraw(settings);}};var searchDelay=settings.searchDelay!==null?settings.searchDelay:_fnDataSource(settings)==='ssp'?400:0;var jqFilter=$('input',filter).val(previousSearch.sSearch).attr('placeholder',language.sSearchPlaceholder).on('keyup.DT search.DT input.DT paste.DT cut.DT',searchDelay?_fnThrottle(searchFn,searchDelay):searchFn).on('mouseup',function(e){setTimeout(function(){searchFn.call(jqFilter[0],e);},10);}).on('keypress.DT',function(e){if(e.keyCode==13){return false;}}).attr('aria-controls',tableId);$(settings.nTable).on('search.dt.DT',function(ev,s){if(settings===s){try{if(jqFilter[0]!==document.activeElement){jqFilter.val(previousSearch.sSearch);}}
catch(e){}}});return filter[0];}
function _fnFilterComplete(oSettings,oInput,iForce)
{var oPrevSearch=oSettings.oPreviousSearch;var aoPrevSearch=oSettings.aoPreSearchCols;var fnSaveFilter=function(oFilter){oPrevSearch.sSearch=oFilter.sSearch;oPrevSearch.bRegex=oFilter.bRegex;oPrevSearch.bSmart=oFilter.bSmart;oPrevSearch.bCaseInsensitive=oFilter.bCaseInsensitive;oPrevSearch.return=oFilter.return;};var fnRegex=function(o){return o.bEscapeRegex!==undefined?!o.bEscapeRegex:o.bRegex;};_fnColumnTypes(oSettings);if(_fnDataSource(oSettings)!='ssp')
{_fnFilter(oSettings,oInput.sSearch,iForce,fnRegex(oInput),oInput.bSmart,oInput.bCaseInsensitive,oInput.return);fnSaveFilter(oInput);for(var i=0;i<aoPrevSearch.length;i++)
{_fnFilterColumn(oSettings,aoPrevSearch[i].sSearch,i,fnRegex(aoPrevSearch[i]),aoPrevSearch[i].bSmart,aoPrevSearch[i].bCaseInsensitive);}
_fnFilterCustom(oSettings);}
else
{fnSaveFilter(oInput);}
oSettings.bFiltered=true;_fnCallbackFire(oSettings,null,'search',[oSettings]);}
function _fnFilterCustom(settings)
{var filters=DataTable.ext.search;var displayRows=settings.aiDisplay;var row,rowIdx;for(var i=0,ien=filters.length;i<ien;i++){var rows=[];for(var j=0,jen=displayRows.length;j<jen;j++){rowIdx=displayRows[j];row=settings.aoData[rowIdx];if(filters[i](settings,row._aFilterData,rowIdx,row._aData,j)){rows.push(rowIdx);}}
displayRows.length=0;$.merge(displayRows,rows);}}
function _fnFilterColumn(settings,searchStr,colIdx,regex,smart,caseInsensitive)
{if(searchStr===''){return;}
var data;var out=[];var display=settings.aiDisplay;var rpSearch=_fnFilterCreateSearch(searchStr,regex,smart,caseInsensitive);for(var i=0;i<display.length;i++){data=settings.aoData[display[i]]._aFilterData[colIdx];if(rpSearch.test(data)){out.push(display[i]);}}
settings.aiDisplay=out;}
function _fnFilter(settings,input,force,regex,smart,caseInsensitive)
{var rpSearch=_fnFilterCreateSearch(input,regex,smart,caseInsensitive);var prevSearch=settings.oPreviousSearch.sSearch;var displayMaster=settings.aiDisplayMaster;var display,invalidated,i;var filtered=[];if(DataTable.ext.search.length!==0){force=true;}
invalidated=_fnFilterData(settings);if(input.length<=0){settings.aiDisplay=displayMaster.slice();}
else{if(invalidated||force||regex||prevSearch.length>input.length||input.indexOf(prevSearch)!==0||settings.bSorted){settings.aiDisplay=displayMaster.slice();}
display=settings.aiDisplay;for(i=0;i<display.length;i++){if(rpSearch.test(settings.aoData[display[i]]._sFilterRow)){filtered.push(display[i]);}}
settings.aiDisplay=filtered;}}
function _fnFilterCreateSearch(search,regex,smart,caseInsensitive)
{search=regex?search:_fnEscapeRegex(search);if(smart){var a=$.map(search.match(/"[^"]+"|[^ ]+/g)||[''],function(word){if(word.charAt(0)==='"'){var m=word.match(/^"(.*)"$/);word=m?m[1]:word;}
return word.replace('"','');});search='^(?=.*?'+a.join(')(?=.*?')+').*$';}
return new RegExp(search,caseInsensitive?'i':'');}
var _fnEscapeRegex=DataTable.util.escapeRegex;var __filter_div=$('<div>')[0];var __filter_div_textContent=__filter_div.textContent!==undefined;function _fnFilterData(settings)
{var columns=settings.aoColumns;var column;var i,j,ien,jen,filterData,cellData,row;var wasInvalidated=false;for(i=0,ien=settings.aoData.length;i<ien;i++){row=settings.aoData[i];if(!row._aFilterData){filterData=[];for(j=0,jen=columns.length;j<jen;j++){column=columns[j];if(column.bSearchable){cellData=_fnGetCellData(settings,i,j,'filter');if(cellData===null){cellData='';}
if(typeof cellData!=='string'&&cellData.toString){cellData=cellData.toString();}}
else{cellData='';}
if(cellData.indexOf&&cellData.indexOf('&')!==-1){__filter_div.innerHTML=cellData;cellData=__filter_div_textContent?__filter_div.textContent:__filter_div.innerText;}
if(cellData.replace){cellData=cellData.replace(/[\r\n\u2028]/g,'');}
filterData.push(cellData);}
row._aFilterData=filterData;row._sFilterRow=filterData.join('  ');wasInvalidated=true;}}
return wasInvalidated;}
function _fnSearchToCamel(obj)
{return{search:obj.sSearch,smart:obj.bSmart,regex:obj.bRegex,caseInsensitive:obj.bCaseInsensitive};}
function _fnSearchToHung(obj)
{return{sSearch:obj.search,bSmart:obj.smart,bRegex:obj.regex,bCaseInsensitive:obj.caseInsensitive};}
function _fnFeatureHtmlInfo(settings)
{var
tid=settings.sTableId,nodes=settings.aanFeatures.i,n=$('<div/>',{'class':settings.oClasses.sInfo,'id':!nodes?tid+'_info':null});if(!nodes){settings.aoDrawCallback.push({"fn":_fnUpdateInfo,"sName":"information"});n.attr('role','status').attr('aria-live','polite');$(settings.nTable).attr('aria-describedby',tid+'_info');}
return n[0];}
function _fnUpdateInfo(settings)
{var nodes=settings.aanFeatures.i;if(nodes.length===0){return;}
var
lang=settings.oLanguage,start=settings._iDisplayStart+1,end=settings.fnDisplayEnd(),max=settings.fnRecordsTotal(),total=settings.fnRecordsDisplay(),out=total?lang.sInfo:lang.sInfoEmpty;if(total!==max){out+=' '+lang.sInfoFiltered;}
out+=lang.sInfoPostFix;out=_fnInfoMacros(settings,out);var callback=lang.fnInfoCallback;if(callback!==null){out=callback.call(settings.oInstance,settings,start,end,max,total,out);}
$(nodes).html(out);}
function _fnInfoMacros(settings,str)
{var
formatter=settings.fnFormatNumber,start=settings._iDisplayStart+1,len=settings._iDisplayLength,vis=settings.fnRecordsDisplay(),all=len===-1;return str.replace(/_START_/g,formatter.call(settings,start)).replace(/_END_/g,formatter.call(settings,settings.fnDisplayEnd())).replace(/_MAX_/g,formatter.call(settings,settings.fnRecordsTotal())).replace(/_TOTAL_/g,formatter.call(settings,vis)).replace(/_PAGE_/g,formatter.call(settings,all?1:Math.ceil(start/len))).replace(/_PAGES_/g,formatter.call(settings,all?1:Math.ceil(vis/len)));}
function _fnInitialise(settings)
{var i,iLen,iAjaxStart=settings.iInitDisplayStart;var columns=settings.aoColumns,column;var features=settings.oFeatures;var deferLoading=settings.bDeferLoading;if(!settings.bInitialised){setTimeout(function(){_fnInitialise(settings);},200);return;}
_fnAddOptionsHtml(settings);_fnBuildHead(settings);_fnDrawHead(settings,settings.aoHeader);_fnDrawHead(settings,settings.aoFooter);_fnProcessingDisplay(settings,true);if(features.bAutoWidth){_fnCalculateColumnWidths(settings);}
for(i=0,iLen=columns.length;i<iLen;i++){column=columns[i];if(column.sWidth){column.nTh.style.width=_fnStringToCss(column.sWidth);}}
_fnCallbackFire(settings,null,'preInit',[settings]);_fnReDraw(settings);var dataSrc=_fnDataSource(settings);if(dataSrc!='ssp'||deferLoading){if(dataSrc=='ajax'){_fnBuildAjax(settings,[],function(json){var aData=_fnAjaxDataSrc(settings,json);for(i=0;i<aData.length;i++){_fnAddData(settings,aData[i]);}
settings.iInitDisplayStart=iAjaxStart;_fnReDraw(settings);_fnProcessingDisplay(settings,false);_fnInitComplete(settings,json);},settings);}
else{_fnProcessingDisplay(settings,false);_fnInitComplete(settings);}}}
function _fnInitComplete(settings,json)
{settings._bInitComplete=true;if(json||settings.oInit.aaData){_fnAdjustColumnSizing(settings);}
_fnCallbackFire(settings,null,'plugin-init',[settings,json]);_fnCallbackFire(settings,'aoInitComplete','init',[settings,json]);}
function _fnLengthChange(settings,val)
{var len=parseInt(val,10);settings._iDisplayLength=len;_fnLengthOverflow(settings);_fnCallbackFire(settings,null,'length',[settings,len]);}
function _fnFeatureHtmlLength(settings)
{var
classes=settings.oClasses,tableId=settings.sTableId,menu=settings.aLengthMenu,d2=Array.isArray(menu[0]),lengths=d2?menu[0]:menu,language=d2?menu[1]:menu;var select=$('<select/>',{'name':tableId+'_length','aria-controls':tableId,'class':classes.sLengthSelect});for(var i=0,ien=lengths.length;i<ien;i++){select[0][i]=new Option(typeof language[i]==='number'?settings.fnFormatNumber(language[i]):language[i],lengths[i]);}
var div=$('<div><label/></div>').addClass(classes.sLength);if(!settings.aanFeatures.l){div[0].id=tableId+'_length';}
div.children().append(settings.oLanguage.sLengthMenu.replace('_MENU_',select[0].outerHTML));$('select',div).val(settings._iDisplayLength).on('change.DT',function(e){_fnLengthChange(settings,$(this).val());_fnDraw(settings);});$(settings.nTable).on('length.dt.DT',function(e,s,len){if(settings===s){$('select',div).val(len);}});return div[0];}
function _fnFeatureHtmlPaginate(settings)
{var
type=settings.sPaginationType,plugin=DataTable.ext.pager[type],modern=typeof plugin==='function',redraw=function(settings){_fnDraw(settings);},node=$('<div/>').addClass(settings.oClasses.sPaging+type)[0],features=settings.aanFeatures;if(!modern){plugin.fnInit(settings,node,redraw);}
if(!features.p)
{node.id=settings.sTableId+'_paginate';settings.aoDrawCallback.push({"fn":function(settings){if(modern){var
start=settings._iDisplayStart,len=settings._iDisplayLength,visRecords=settings.fnRecordsDisplay(),all=len===-1,page=all?0:Math.ceil(start/len),pages=all?1:Math.ceil(visRecords/len),buttons=plugin(page,pages),i,ien;for(i=0,ien=features.p.length;i<ien;i++){_fnRenderer(settings,'pageButton')(settings,features.p[i],i,buttons,page,pages);}}
else{plugin.fnUpdate(settings,redraw);}},"sName":"pagination"});}
return node;}
function _fnPageChange(settings,action,redraw)
{var
start=settings._iDisplayStart,len=settings._iDisplayLength,records=settings.fnRecordsDisplay();if(records===0||len===-1)
{start=0;}
else if(typeof action==="number")
{start=action*len;if(start>records)
{start=0;}}
else if(action=="first")
{start=0;}
else if(action=="previous")
{start=len>=0?start-len:0;if(start<0)
{start=0;}}
else if(action=="next")
{if(start+len<records)
{start+=len;}}
else if(action=="last")
{start=Math.floor((records-1)/len)*len;}
else
{_fnLog(settings,0,"Unknown paging action: "+action,5);}
var changed=settings._iDisplayStart!==start;settings._iDisplayStart=start;if(changed){_fnCallbackFire(settings,null,'page',[settings]);if(redraw){_fnDraw(settings);}}
return changed;}
function _fnFeatureHtmlProcessing(settings)
{return $('<div/>',{'id':!settings.aanFeatures.r?settings.sTableId+'_processing':null,'class':settings.oClasses.sProcessing}).html(settings.oLanguage.sProcessing).insertBefore(settings.nTable)[0];}
function _fnProcessingDisplay(settings,show)
{if(settings.oFeatures.bProcessing){$(settings.aanFeatures.r).css('display',show?'block':'none');}
_fnCallbackFire(settings,null,'processing',[settings,show]);}
function _fnFeatureHtmlTable(settings)
{var table=$(settings.nTable);var scroll=settings.oScroll;if(scroll.sX===''&&scroll.sY===''){return settings.nTable;}
var scrollX=scroll.sX;var scrollY=scroll.sY;var classes=settings.oClasses;var caption=table.children('caption');var captionSide=caption.length?caption[0]._captionSide:null;var headerClone=$(table[0].cloneNode(false));var footerClone=$(table[0].cloneNode(false));var footer=table.children('tfoot');var _div='<div/>';var size=function(s){return!s?null:_fnStringToCss(s);};if(!footer.length){footer=null;}
var scroller=$(_div,{'class':classes.sScrollWrapper}).append($(_div,{'class':classes.sScrollHead}).css({overflow:'hidden',position:'relative',border:0,width:scrollX?size(scrollX):'100%'}).append($(_div,{'class':classes.sScrollHeadInner}).css({'box-sizing':'content-box',width:scroll.sXInner||'100%'}).append(headerClone.removeAttr('id').css('margin-left',0).append(captionSide==='top'?caption:null).append(table.children('thead'))))).append($(_div,{'class':classes.sScrollBody}).css({position:'relative',overflow:'auto',width:size(scrollX)}).append(table));if(footer){scroller.append($(_div,{'class':classes.sScrollFoot}).css({overflow:'hidden',border:0,width:scrollX?size(scrollX):'100%'}).append($(_div,{'class':classes.sScrollFootInner}).append(footerClone.removeAttr('id').css('margin-left',0).append(captionSide==='bottom'?caption:null).append(table.children('tfoot')))));}
var children=scroller.children();var scrollHead=children[0];var scrollBody=children[1];var scrollFoot=footer?children[2]:null;if(scrollX){$(scrollBody).on('scroll.DT',function(e){var scrollLeft=this.scrollLeft;scrollHead.scrollLeft=scrollLeft;if(footer){scrollFoot.scrollLeft=scrollLeft;}});}
$(scrollBody).css('max-height',scrollY);if(!scroll.bCollapse){$(scrollBody).css('height',scrollY);}
settings.nScrollHead=scrollHead;settings.nScrollBody=scrollBody;settings.nScrollFoot=scrollFoot;settings.aoDrawCallback.push({"fn":_fnScrollDraw,"sName":"scrolling"});return scroller[0];}
function _fnScrollDraw(settings)
{var
scroll=settings.oScroll,scrollX=scroll.sX,scrollXInner=scroll.sXInner,scrollY=scroll.sY,barWidth=scroll.iBarWidth,divHeader=$(settings.nScrollHead),divHeaderStyle=divHeader[0].style,divHeaderInner=divHeader.children('div'),divHeaderInnerStyle=divHeaderInner[0].style,divHeaderTable=divHeaderInner.children('table'),divBodyEl=settings.nScrollBody,divBody=$(divBodyEl),divBodyStyle=divBodyEl.style,divFooter=$(settings.nScrollFoot),divFooterInner=divFooter.children('div'),divFooterTable=divFooterInner.children('table'),header=$(settings.nTHead),table=$(settings.nTable),tableEl=table[0],tableStyle=tableEl.style,footer=settings.nTFoot?$(settings.nTFoot):null,browser=settings.oBrowser,ie67=browser.bScrollOversize,dtHeaderCells=_pluck(settings.aoColumns,'nTh'),headerTrgEls,footerTrgEls,headerSrcEls,footerSrcEls,headerCopy,footerCopy,headerWidths=[],footerWidths=[],headerContent=[],footerContent=[],idx,correction,sanityWidth,zeroOut=function(nSizer){var style=nSizer.style;style.paddingTop="0";style.paddingBottom="0";style.borderTopWidth="0";style.borderBottomWidth="0";style.height=0;};var scrollBarVis=divBodyEl.scrollHeight>divBodyEl.clientHeight;if(settings.scrollBarVis!==scrollBarVis&&settings.scrollBarVis!==undefined){settings.scrollBarVis=scrollBarVis;_fnAdjustColumnSizing(settings);return;}
else{settings.scrollBarVis=scrollBarVis;}
table.children('thead, tfoot').remove();if(footer){footerCopy=footer.clone().prependTo(table);footerTrgEls=footer.find('tr');footerSrcEls=footerCopy.find('tr');}
headerCopy=header.clone().prependTo(table);headerTrgEls=header.find('tr');headerSrcEls=headerCopy.find('tr');headerCopy.find('th, td').removeAttr('tabindex');if(!scrollX)
{divBodyStyle.width='100%';divHeader[0].style.width='100%';}
$.each(_fnGetUniqueThs(settings,headerCopy),function(i,el){idx=_fnVisibleToColumnIndex(settings,i);el.style.width=settings.aoColumns[idx].sWidth;});if(footer){_fnApplyToChildren(function(n){n.style.width="";},footerSrcEls);}
sanityWidth=table.outerWidth();if(scrollX===""){tableStyle.width="100%";if(ie67&&(table.find('tbody').height()>divBodyEl.offsetHeight||divBody.css('overflow-y')=="scroll")){tableStyle.width=_fnStringToCss(table.outerWidth()-barWidth);}
sanityWidth=table.outerWidth();}
else if(scrollXInner!==""){tableStyle.width=_fnStringToCss(scrollXInner);sanityWidth=table.outerWidth();}
_fnApplyToChildren(zeroOut,headerSrcEls);_fnApplyToChildren(function(nSizer){var style=window.getComputedStyle?window.getComputedStyle(nSizer).width:_fnStringToCss($(nSizer).width());headerContent.push(nSizer.innerHTML);headerWidths.push(style);},headerSrcEls);_fnApplyToChildren(function(nToSize,i){nToSize.style.width=headerWidths[i];},headerTrgEls);$(headerSrcEls).height(0);if(footer)
{_fnApplyToChildren(zeroOut,footerSrcEls);_fnApplyToChildren(function(nSizer){footerContent.push(nSizer.innerHTML);footerWidths.push(_fnStringToCss($(nSizer).css('width')));},footerSrcEls);_fnApplyToChildren(function(nToSize,i){nToSize.style.width=footerWidths[i];},footerTrgEls);$(footerSrcEls).height(0);}
_fnApplyToChildren(function(nSizer,i){nSizer.innerHTML='<div class="dataTables_sizing">'+headerContent[i]+'</div>';nSizer.childNodes[0].style.height="0";nSizer.childNodes[0].style.overflow="hidden";nSizer.style.width=headerWidths[i];},headerSrcEls);if(footer)
{_fnApplyToChildren(function(nSizer,i){nSizer.innerHTML='<div class="dataTables_sizing">'+footerContent[i]+'</div>';nSizer.childNodes[0].style.height="0";nSizer.childNodes[0].style.overflow="hidden";nSizer.style.width=footerWidths[i];},footerSrcEls);}
if(table.outerWidth()<sanityWidth)
{correction=((divBodyEl.scrollHeight>divBodyEl.offsetHeight||divBody.css('overflow-y')=="scroll"))?sanityWidth+barWidth:sanityWidth;if(ie67&&(divBodyEl.scrollHeight>divBodyEl.offsetHeight||divBody.css('overflow-y')=="scroll")){tableStyle.width=_fnStringToCss(correction-barWidth);}
if(scrollX===""||scrollXInner!==""){_fnLog(settings,1,'Possible column misalignment',6);}}
else
{correction='100%';}
divBodyStyle.width=_fnStringToCss(correction);divHeaderStyle.width=_fnStringToCss(correction);if(footer){settings.nScrollFoot.style.width=_fnStringToCss(correction);}
if(!scrollY){if(ie67){divBodyStyle.height=_fnStringToCss(tableEl.offsetHeight+barWidth);}}
var iOuterWidth=table.outerWidth();divHeaderTable[0].style.width=_fnStringToCss(iOuterWidth);divHeaderInnerStyle.width=_fnStringToCss(iOuterWidth);var bScrolling=table.height()>divBodyEl.clientHeight||divBody.css('overflow-y')=="scroll";var padding='padding'+(browser.bScrollbarLeft?'Left':'Right');divHeaderInnerStyle[padding]=bScrolling?barWidth+"px":"0px";if(footer){divFooterTable[0].style.width=_fnStringToCss(iOuterWidth);divFooterInner[0].style.width=_fnStringToCss(iOuterWidth);divFooterInner[0].style[padding]=bScrolling?barWidth+"px":"0px";}
table.children('colgroup').insertBefore(table.children('thead'));divBody.trigger('scroll');if((settings.bSorted||settings.bFiltered)&&!settings._drawHold){divBodyEl.scrollTop=0;}}
function _fnApplyToChildren(fn,an1,an2)
{var index=0,i=0,iLen=an1.length;var nNode1,nNode2;while(i<iLen){nNode1=an1[i].firstChild;nNode2=an2?an2[i].firstChild:null;while(nNode1){if(nNode1.nodeType===1){if(an2){fn(nNode1,nNode2,index);}
else{fn(nNode1,index);}
index++;}
nNode1=nNode1.nextSibling;nNode2=an2?nNode2.nextSibling:null;}
i++;}}
var __re_html_remove=/<.*?>/g;function _fnCalculateColumnWidths(oSettings)
{var
table=oSettings.nTable,columns=oSettings.aoColumns,scroll=oSettings.oScroll,scrollY=scroll.sY,scrollX=scroll.sX,scrollXInner=scroll.sXInner,columnCount=columns.length,visibleColumns=_fnGetColumns(oSettings,'bVisible'),headerCells=$('th',oSettings.nTHead),tableWidthAttr=table.getAttribute('width'),tableContainer=table.parentNode,userInputs=false,i,column,columnIdx,width,outerWidth,browser=oSettings.oBrowser,ie67=browser.bScrollOversize;var styleWidth=table.style.width;if(styleWidth&&styleWidth.indexOf('%')!==-1){tableWidthAttr=styleWidth;}
for(i=0;i<visibleColumns.length;i++){column=columns[visibleColumns[i]];if(column.sWidth!==null){column.sWidth=_fnConvertToWidth(column.sWidthOrig,tableContainer);userInputs=true;}}
if(ie67||!userInputs&&!scrollX&&!scrollY&&columnCount==_fnVisbleColumns(oSettings)&&columnCount==headerCells.length){for(i=0;i<columnCount;i++){var colIdx=_fnVisibleToColumnIndex(oSettings,i);if(colIdx!==null){columns[colIdx].sWidth=_fnStringToCss(headerCells.eq(i).width());}}}
else
{var tmpTable=$(table).clone().css('visibility','hidden').removeAttr('id');tmpTable.find('tbody tr').remove();var tr=$('<tr/>').appendTo(tmpTable.find('tbody'));tmpTable.find('thead, tfoot').remove();tmpTable.append($(oSettings.nTHead).clone()).append($(oSettings.nTFoot).clone());tmpTable.find('tfoot th, tfoot td').css('width','');headerCells=_fnGetUniqueThs(oSettings,tmpTable.find('thead')[0]);for(i=0;i<visibleColumns.length;i++){column=columns[visibleColumns[i]];headerCells[i].style.width=column.sWidthOrig!==null&&column.sWidthOrig!==''?_fnStringToCss(column.sWidthOrig):'';if(column.sWidthOrig&&scrollX){$(headerCells[i]).append($('<div/>').css({width:column.sWidthOrig,margin:0,padding:0,border:0,height:1}));}}
if(oSettings.aoData.length){for(i=0;i<visibleColumns.length;i++){columnIdx=visibleColumns[i];column=columns[columnIdx];$(_fnGetWidestNode(oSettings,columnIdx)).clone(false).append(column.sContentPadding).appendTo(tr);}}
$('[name]',tmpTable).removeAttr('name');var holder=$('<div/>').css(scrollX||scrollY?{position:'absolute',top:0,left:0,height:1,right:0,overflow:'hidden'}:{}).append(tmpTable).appendTo(tableContainer);if(scrollX&&scrollXInner){tmpTable.width(scrollXInner);}
else if(scrollX){tmpTable.css('width','auto');tmpTable.removeAttr('width');if(tmpTable.width()<tableContainer.clientWidth&&tableWidthAttr){tmpTable.width(tableContainer.clientWidth);}}
else if(scrollY){tmpTable.width(tableContainer.clientWidth);}
else if(tableWidthAttr){tmpTable.width(tableWidthAttr);}
var total=0;for(i=0;i<visibleColumns.length;i++){var cell=$(headerCells[i]);var border=cell.outerWidth()-cell.width();var bounding=browser.bBounding?Math.ceil(headerCells[i].getBoundingClientRect().width):cell.outerWidth();total+=bounding;columns[visibleColumns[i]].sWidth=_fnStringToCss(bounding-border);}
table.style.width=_fnStringToCss(total);holder.remove();}
if(tableWidthAttr){table.style.width=_fnStringToCss(tableWidthAttr);}
if((tableWidthAttr||scrollX)&&!oSettings._reszEvt){var bindResize=function(){$(window).on('resize.DT-'+oSettings.sInstance,_fnThrottle(function(){_fnAdjustColumnSizing(oSettings);}));};if(ie67){setTimeout(bindResize,1000);}
else{bindResize();}
oSettings._reszEvt=true;}}
var _fnThrottle=DataTable.util.throttle;function _fnConvertToWidth(width,parent)
{if(!width){return 0;}
var n=$('<div/>').css('width',_fnStringToCss(width)).appendTo(parent||document.body);var val=n[0].offsetWidth;n.remove();return val;}
function _fnGetWidestNode(settings,colIdx)
{var idx=_fnGetMaxLenString(settings,colIdx);if(idx<0){return null;}
var data=settings.aoData[idx];return!data.nTr?$('<td/>').html(_fnGetCellData(settings,idx,colIdx,'display'))[0]:data.anCells[colIdx];}
function _fnGetMaxLenString(settings,colIdx)
{var s,max=-1,maxIdx=-1;for(var i=0,ien=settings.aoData.length;i<ien;i++){s=_fnGetCellData(settings,i,colIdx,'display')+'';s=s.replace(__re_html_remove,'');s=s.replace(/&nbsp;/g,' ');if(s.length>max){max=s.length;maxIdx=i;}}
return maxIdx;}
function _fnStringToCss(s)
{if(s===null){return '0px';}
if(typeof s=='number'){return s<0?'0px':s+'px';}
return s.match(/\d$/)?s+'px':s;}
function _fnSortFlatten(settings)
{var
i,iLen,k,kLen,aSort=[],aiOrig=[],aoColumns=settings.aoColumns,aDataSort,iCol,sType,srcCol,fixed=settings.aaSortingFixed,fixedObj=$.isPlainObject(fixed),nestedSort=[],add=function(a){if(a.length&&!Array.isArray(a[0])){nestedSort.push(a);}
else{$.merge(nestedSort,a);}};if(Array.isArray(fixed)){add(fixed);}
if(fixedObj&&fixed.pre){add(fixed.pre);}
add(settings.aaSorting);if(fixedObj&&fixed.post){add(fixed.post);}
for(i=0;i<nestedSort.length;i++)
{srcCol=nestedSort[i][0];aDataSort=aoColumns[srcCol].aDataSort;for(k=0,kLen=aDataSort.length;k<kLen;k++)
{iCol=aDataSort[k];sType=aoColumns[iCol].sType||'string';if(nestedSort[i]._idx===undefined){nestedSort[i]._idx=$.inArray(nestedSort[i][1],aoColumns[iCol].asSorting);}
aSort.push({src:srcCol,col:iCol,dir:nestedSort[i][1],index:nestedSort[i]._idx,type:sType,formatter:DataTable.ext.type.order[sType+"-pre"]});}}
return aSort;}
function _fnSort(oSettings)
{var
i,ien,iLen,j,jLen,k,kLen,sDataType,nTh,aiOrig=[],oExtSort=DataTable.ext.type.order,aoData=oSettings.aoData,aoColumns=oSettings.aoColumns,aDataSort,data,iCol,sType,oSort,formatters=0,sortCol,displayMaster=oSettings.aiDisplayMaster,aSort;_fnColumnTypes(oSettings);aSort=_fnSortFlatten(oSettings);for(i=0,ien=aSort.length;i<ien;i++){sortCol=aSort[i];if(sortCol.formatter){formatters++;}
_fnSortData(oSettings,sortCol.col);}
if(_fnDataSource(oSettings)!='ssp'&&aSort.length!==0)
{for(i=0,iLen=displayMaster.length;i<iLen;i++){aiOrig[displayMaster[i]]=i;}
if(formatters===aSort.length){displayMaster.sort(function(a,b){var
x,y,k,test,sort,len=aSort.length,dataA=aoData[a]._aSortData,dataB=aoData[b]._aSortData;for(k=0;k<len;k++){sort=aSort[k];x=dataA[sort.col];y=dataB[sort.col];test=x<y?-1:x>y?1:0;if(test!==0){return sort.dir==='asc'?test:-test;}}
x=aiOrig[a];y=aiOrig[b];return x<y?-1:x>y?1:0;});}
else{displayMaster.sort(function(a,b){var
x,y,k,l,test,sort,fn,len=aSort.length,dataA=aoData[a]._aSortData,dataB=aoData[b]._aSortData;for(k=0;k<len;k++){sort=aSort[k];x=dataA[sort.col];y=dataB[sort.col];fn=oExtSort[sort.type+"-"+sort.dir]||oExtSort["string-"+sort.dir];test=fn(x,y);if(test!==0){return test;}}
x=aiOrig[a];y=aiOrig[b];return x<y?-1:x>y?1:0;});}}
oSettings.bSorted=true;}
function _fnSortAria(settings)
{var label;var nextSort;var columns=settings.aoColumns;var aSort=_fnSortFlatten(settings);var oAria=settings.oLanguage.oAria;for(var i=0,iLen=columns.length;i<iLen;i++)
{var col=columns[i];var asSorting=col.asSorting;var sTitle=col.ariaTitle||col.sTitle.replace(/<.*?>/g,"");var th=col.nTh;th.removeAttribute('aria-sort');if(col.bSortable){if(aSort.length>0&&aSort[0].col==i){th.setAttribute('aria-sort',aSort[0].dir=="asc"?"ascending":"descending");nextSort=asSorting[aSort[0].index+1]||asSorting[0];}
else{nextSort=asSorting[0];}
label=sTitle+(nextSort==="asc"?oAria.sSortAscending:oAria.sSortDescending);}
else{label=sTitle;}
th.setAttribute('aria-label',label);}}
function _fnSortListener(settings,colIdx,append,callback)
{var col=settings.aoColumns[colIdx];var sorting=settings.aaSorting;var asSorting=col.asSorting;var nextSortIdx;var next=function(a,overflow){var idx=a._idx;if(idx===undefined){idx=$.inArray(a[1],asSorting);}
return idx+1<asSorting.length?idx+1:overflow?null:0;};if(typeof sorting[0]==='number'){sorting=settings.aaSorting=[sorting];}
if(append&&settings.oFeatures.bSortMulti){var sortIdx=$.inArray(colIdx,_pluck(sorting,'0'));if(sortIdx!==-1){nextSortIdx=next(sorting[sortIdx],true);if(nextSortIdx===null&&sorting.length===1){nextSortIdx=0;}
if(nextSortIdx===null){sorting.splice(sortIdx,1);}
else{sorting[sortIdx][1]=asSorting[nextSortIdx];sorting[sortIdx]._idx=nextSortIdx;}}
else{sorting.push([colIdx,asSorting[0],0]);sorting[sorting.length-1]._idx=0;}}
else if(sorting.length&&sorting[0][0]==colIdx){nextSortIdx=next(sorting[0]);sorting.length=1;sorting[0][1]=asSorting[nextSortIdx];sorting[0]._idx=nextSortIdx;}
else{sorting.length=0;sorting.push([colIdx,asSorting[0]]);sorting[0]._idx=0;}
_fnReDraw(settings);if(typeof callback=='function'){callback(settings);}}
function _fnSortAttachListener(settings,attachTo,colIdx,callback)
{var col=settings.aoColumns[colIdx];_fnBindAction(attachTo,{},function(e){if(col.bSortable===false){return;}
if(settings.oFeatures.bProcessing){_fnProcessingDisplay(settings,true);setTimeout(function(){_fnSortListener(settings,colIdx,e.shiftKey,callback);if(_fnDataSource(settings)!=='ssp'){_fnProcessingDisplay(settings,false);}},0);}
else{_fnSortListener(settings,colIdx,e.shiftKey,callback);}});}
function _fnSortingClasses(settings)
{var oldSort=settings.aLastSort;var sortClass=settings.oClasses.sSortColumn;var sort=_fnSortFlatten(settings);var features=settings.oFeatures;var i,ien,colIdx;if(features.bSort&&features.bSortClasses){for(i=0,ien=oldSort.length;i<ien;i++){colIdx=oldSort[i].src;$(_pluck(settings.aoData,'anCells',colIdx)).removeClass(sortClass+(i<2?i+1:3));}
for(i=0,ien=sort.length;i<ien;i++){colIdx=sort[i].src;$(_pluck(settings.aoData,'anCells',colIdx)).addClass(sortClass+(i<2?i+1:3));}}
settings.aLastSort=sort;}
function _fnSortData(settings,idx)
{var column=settings.aoColumns[idx];var customSort=DataTable.ext.order[column.sSortDataType];var customData;if(customSort){customData=customSort.call(settings.oInstance,settings,idx,_fnColumnIndexToVisible(settings,idx));}
var row,cellData;var formatter=DataTable.ext.type.order[column.sType+"-pre"];for(var i=0,ien=settings.aoData.length;i<ien;i++){row=settings.aoData[i];if(!row._aSortData){row._aSortData=[];}
if(!row._aSortData[idx]||customSort){cellData=customSort?customData[i]:_fnGetCellData(settings,i,idx,'sort');row._aSortData[idx]=formatter?formatter(cellData):cellData;}}}
function _fnSaveState(settings)
{if(settings._bLoadingState){return;}
var state={time:+new Date(),start:settings._iDisplayStart,length:settings._iDisplayLength,order:$.extend(true,[],settings.aaSorting),search:_fnSearchToCamel(settings.oPreviousSearch),columns:$.map(settings.aoColumns,function(col,i){return{visible:col.bVisible,search:_fnSearchToCamel(settings.aoPreSearchCols[i])};})};settings.oSavedState=state;_fnCallbackFire(settings,"aoStateSaveParams",'stateSaveParams',[settings,state]);if(settings.oFeatures.bStateSave&&!settings.bDestroying)
{settings.fnStateSaveCallback.call(settings.oInstance,settings,state);}}
function _fnLoadState(settings,oInit,callback)
{if(!settings.oFeatures.bStateSave){callback();return;}
var loaded=function(state){_fnImplementState(settings,state,callback);}
var state=settings.fnStateLoadCallback.call(settings.oInstance,settings,loaded);if(state!==undefined){_fnImplementState(settings,state,callback);}
return true;}
function _fnImplementState(settings,s,callback){var i,ien;var columns=settings.aoColumns;settings._bLoadingState=true;var api=settings._bInitComplete?new DataTable.Api(settings):null;if(!s||!s.time){settings._bLoadingState=false;callback();return;}
var abStateLoad=_fnCallbackFire(settings,'aoStateLoadParams','stateLoadParams',[settings,s]);if($.inArray(false,abStateLoad)!==-1){settings._bLoadingState=false;callback();return;}
var duration=settings.iStateDuration;if(duration>0&&s.time<+new Date()-(duration*1000)){settings._bLoadingState=false;callback();return;}
if(s.columns&&columns.length!==s.columns.length){settings._bLoadingState=false;callback();return;}
settings.oLoadedState=$.extend(true,{},s);if(s.start!==undefined){settings._iDisplayStart=s.start;if(api===null){settings.iInitDisplayStart=s.start;}}
if(s.length!==undefined){settings._iDisplayLength=s.length;}
if(s.order!==undefined){settings.aaSorting=[];$.each(s.order,function(i,col){settings.aaSorting.push(col[0]>=columns.length?[0,col[1]]:col);});}
if(s.search!==undefined){$.extend(settings.oPreviousSearch,_fnSearchToHung(s.search));}
if(s.columns){for(i=0,ien=s.columns.length;i<ien;i++){var col=s.columns[i];if(col.visible!==undefined){if(api){api.column(i).visible(col.visible,false);}
else{columns[i].bVisible=col.visible;}}
if(col.search!==undefined){$.extend(settings.aoPreSearchCols[i],_fnSearchToHung(col.search));}}
if(api){api.columns.adjust();}}
settings._bLoadingState=false;_fnCallbackFire(settings,'aoStateLoaded','stateLoaded',[settings,s]);callback();};function _fnSettingsFromNode(table)
{var settings=DataTable.settings;var idx=$.inArray(table,_pluck(settings,'nTable'));return idx!==-1?settings[idx]:null;}
function _fnLog(settings,level,msg,tn)
{msg='DataTables warning: '+
(settings?'table id='+settings.sTableId+' - ':'')+msg;if(tn){msg+='. For more information about this error, please see '+
'http://datatables.net/tn/'+tn;}
if(!level){var ext=DataTable.ext;var type=ext.sErrMode||ext.errMode;if(settings){_fnCallbackFire(settings,null,'error',[settings,tn,msg]);}
if(type=='alert'){alert(msg);}
else if(type=='throw'){throw new Error(msg);}
else if(typeof type=='function'){type(settings,tn,msg);}}
else if(window.console&&console.log){console.log(msg);}}
function _fnMap(ret,src,name,mappedName)
{if(Array.isArray(name)){$.each(name,function(i,val){if(Array.isArray(val)){_fnMap(ret,src,val[0],val[1]);}
else{_fnMap(ret,src,val);}});return;}
if(mappedName===undefined){mappedName=name;}
if(src[name]!==undefined){ret[mappedName]=src[name];}}
function _fnExtend(out,extender,breakRefs)
{var val;for(var prop in extender){if(extender.hasOwnProperty(prop)){val=extender[prop];if($.isPlainObject(val)){if(!$.isPlainObject(out[prop])){out[prop]={};}
$.extend(true,out[prop],val);}
else if(breakRefs&&prop!=='data'&&prop!=='aaData'&&Array.isArray(val)){out[prop]=val.slice();}
else{out[prop]=val;}}}
return out;}
function _fnBindAction(n,oData,fn)
{$(n).on('click.DT',oData,function(e){$(n).trigger('blur');fn(e);}).on('keypress.DT',oData,function(e){if(e.which===13){e.preventDefault();fn(e);}}).on('selectstart.DT',function(){return false;});}
function _fnCallbackReg(oSettings,sStore,fn,sName)
{if(fn)
{oSettings[sStore].push({"fn":fn,"sName":sName});}}
function _fnCallbackFire(settings,callbackArr,eventName,args)
{var ret=[];if(callbackArr){ret=$.map(settings[callbackArr].slice().reverse(),function(val,i){return val.fn.apply(settings.oInstance,args);});}
if(eventName!==null){var e=$.Event(eventName+'.dt');$(settings.nTable).trigger(e,args);ret.push(e.result);}
return ret;}
function _fnLengthOverflow(settings)
{var
start=settings._iDisplayStart,end=settings.fnDisplayEnd(),len=settings._iDisplayLength;if(start>=end)
{start=end-len;}
start-=(start%len);if(len===-1||start<0)
{start=0;}
settings._iDisplayStart=start;}
function _fnRenderer(settings,type)
{var renderer=settings.renderer;var host=DataTable.ext.renderer[type];if($.isPlainObject(renderer)&&renderer[type]){return host[renderer[type]]||host._;}
else if(typeof renderer==='string'){return host[renderer]||host._;}
return host._;}
function _fnDataSource(settings)
{if(settings.oFeatures.bServerSide){return 'ssp';}
else if(settings.ajax||settings.sAjaxSource){return 'ajax';}
return 'dom';}
var __apiStruct=[];var __arrayProto=Array.prototype;var _toSettings=function(mixed)
{var idx,jq;var settings=DataTable.settings;var tables=$.map(settings,function(el,i){return el.nTable;});if(!mixed){return[];}
else if(mixed.nTable&&mixed.oApi){return[mixed];}
else if(mixed.nodeName&&mixed.nodeName.toLowerCase()==='table'){idx=$.inArray(mixed,tables);return idx!==-1?[settings[idx]]:null;}
else if(mixed&&typeof mixed.settings==='function'){return mixed.settings().toArray();}
else if(typeof mixed==='string'){jq=$(mixed);}
else if(mixed instanceof $){jq=mixed;}
if(jq){return jq.map(function(i){idx=$.inArray(this,tables);return idx!==-1?settings[idx]:null;}).toArray();}};_Api=function(context,data)
{if(!(this instanceof _Api)){return new _Api(context,data);}
var settings=[];var ctxSettings=function(o){var a=_toSettings(o);if(a){settings.push.apply(settings,a);}};if(Array.isArray(context)){for(var i=0,ien=context.length;i<ien;i++){ctxSettings(context[i]);}}
else{ctxSettings(context);}
this.context=_unique(settings);if(data){$.merge(this,data);}
this.selector={rows:null,cols:null,opts:null};_Api.extend(this,this,__apiStruct);};DataTable.Api=_Api;$.extend(_Api.prototype,{any:function()
{return this.count()!==0;},concat:__arrayProto.concat,context:[],count:function()
{return this.flatten().length;},each:function(fn)
{for(var i=0,ien=this.length;i<ien;i++){fn.call(this,this[i],i,this);}
return this;},eq:function(idx)
{var ctx=this.context;return ctx.length>idx?new _Api(ctx[idx],this[idx]):null;},filter:function(fn)
{var a=[];if(__arrayProto.filter){a=__arrayProto.filter.call(this,fn,this);}
else{for(var i=0,ien=this.length;i<ien;i++){if(fn.call(this,this[i],i,this)){a.push(this[i]);}}}
return new _Api(this.context,a);},flatten:function()
{var a=[];return new _Api(this.context,a.concat.apply(a,this.toArray()));},join:__arrayProto.join,indexOf:__arrayProto.indexOf||function(obj,start)
{for(var i=(start||0),ien=this.length;i<ien;i++){if(this[i]===obj){return i;}}
return-1;},iterator:function(flatten,type,fn,alwaysNew){var
a=[],ret,i,ien,j,jen,context=this.context,rows,items,item,selector=this.selector;if(typeof flatten==='string'){alwaysNew=fn;fn=type;type=flatten;flatten=false;}
for(i=0,ien=context.length;i<ien;i++){var apiInst=new _Api(context[i]);if(type==='table'){ret=fn.call(apiInst,context[i],i);if(ret!==undefined){a.push(ret);}}
else if(type==='columns'||type==='rows'){ret=fn.call(apiInst,context[i],this[i],i);if(ret!==undefined){a.push(ret);}}
else if(type==='column'||type==='column-rows'||type==='row'||type==='cell'){items=this[i];if(type==='column-rows'){rows=_selector_row_indexes(context[i],selector.opts);}
for(j=0,jen=items.length;j<jen;j++){item=items[j];if(type==='cell'){ret=fn.call(apiInst,context[i],item.row,item.column,i,j);}
else{ret=fn.call(apiInst,context[i],item,i,j,rows);}
if(ret!==undefined){a.push(ret);}}}}
if(a.length||alwaysNew){var api=new _Api(context,flatten?a.concat.apply([],a):a);var apiSelector=api.selector;apiSelector.rows=selector.rows;apiSelector.cols=selector.cols;apiSelector.opts=selector.opts;return api;}
return this;},lastIndexOf:__arrayProto.lastIndexOf||function(obj,start)
{return this.indexOf.apply(this.toArray.reverse(),arguments);},length:0,map:function(fn)
{var a=[];if(__arrayProto.map){a=__arrayProto.map.call(this,fn,this);}
else{for(var i=0,ien=this.length;i<ien;i++){a.push(fn.call(this,this[i],i));}}
return new _Api(this.context,a);},pluck:function(prop)
{return this.map(function(el){return el[prop];});},pop:__arrayProto.pop,push:__arrayProto.push,reduce:__arrayProto.reduce||function(fn,init)
{return _fnReduce(this,fn,init,0,this.length,1);},reduceRight:__arrayProto.reduceRight||function(fn,init)
{return _fnReduce(this,fn,init,this.length-1,-1,-1);},reverse:__arrayProto.reverse,selector:null,shift:__arrayProto.shift,slice:function(){return new _Api(this.context,this);},sort:__arrayProto.sort,splice:__arrayProto.splice,toArray:function()
{return __arrayProto.slice.call(this);},to$:function()
{return $(this);},toJQuery:function()
{return $(this);},unique:function()
{return new _Api(this.context,_unique(this));},unshift:__arrayProto.unshift});_Api.extend=function(scope,obj,ext)
{if(!ext.length||!obj||(!(obj instanceof _Api)&&!obj.__dt_wrapper)){return;}
var
i,ien,struct,methodScoping=function(scope,fn,struc){return function(){var ret=fn.apply(scope,arguments);_Api.extend(ret,ret,struc.methodExt);return ret;};};for(i=0,ien=ext.length;i<ien;i++){struct=ext[i];obj[struct.name]=struct.type==='function'?methodScoping(scope,struct.val,struct):struct.type==='object'?{}:struct.val;obj[struct.name].__dt_wrapper=true;_Api.extend(scope,obj[struct.name],struct.propExt);}};_Api.register=_api_register=function(name,val)
{if(Array.isArray(name)){for(var j=0,jen=name.length;j<jen;j++){_Api.register(name[j],val);}
return;}
var
i,ien,heir=name.split('.'),struct=__apiStruct,key,method;var find=function(src,name){for(var i=0,ien=src.length;i<ien;i++){if(src[i].name===name){return src[i];}}
return null;};for(i=0,ien=heir.length;i<ien;i++){method=heir[i].indexOf('()')!==-1;key=method?heir[i].replace('()',''):heir[i];var src=find(struct,key);if(!src){src={name:key,val:{},methodExt:[],propExt:[],type:'object'};struct.push(src);}
if(i===ien-1){src.val=val;src.type=typeof val==='function'?'function':$.isPlainObject(val)?'object':'other';}
else{struct=method?src.methodExt:src.propExt;}}};_Api.registerPlural=_api_registerPlural=function(pluralName,singularName,val){_Api.register(pluralName,val);_Api.register(singularName,function(){var ret=val.apply(this,arguments);if(ret===this){return this;}
else if(ret instanceof _Api){return ret.length?Array.isArray(ret[0])?new _Api(ret.context,ret[0]):ret[0]:undefined;}
return ret;});};var __table_selector=function(selector,a)
{if(Array.isArray(selector)){return $.map(selector,function(item){return __table_selector(item,a);});}
if(typeof selector==='number'){return[a[selector]];}
var nodes=$.map(a,function(el,i){return el.nTable;});return $(nodes).filter(selector).map(function(i){var idx=$.inArray(this,nodes);return a[idx];}).toArray();};_api_register('tables()',function(selector){return selector!==undefined&&selector!==null?new _Api(__table_selector(selector,this.context)):this;});_api_register('table()',function(selector){var tables=this.tables(selector);var ctx=tables.context;return ctx.length?new _Api(ctx[0]):tables;});_api_registerPlural('tables().nodes()','table().node()',function(){return this.iterator('table',function(ctx){return ctx.nTable;},1);});_api_registerPlural('tables().body()','table().body()',function(){return this.iterator('table',function(ctx){return ctx.nTBody;},1);});_api_registerPlural('tables().header()','table().header()',function(){return this.iterator('table',function(ctx){return ctx.nTHead;},1);});_api_registerPlural('tables().footer()','table().footer()',function(){return this.iterator('table',function(ctx){return ctx.nTFoot;},1);});_api_registerPlural('tables().containers()','table().container()',function(){return this.iterator('table',function(ctx){return ctx.nTableWrapper;},1);});_api_register('draw()',function(paging){return this.iterator('table',function(settings){if(paging==='page'){_fnDraw(settings);}
else{if(typeof paging==='string'){paging=paging==='full-hold'?false:true;}
_fnReDraw(settings,paging===false);}});});_api_register('page()',function(action){if(action===undefined){return this.page.info().page;}
return this.iterator('table',function(settings){_fnPageChange(settings,action);});});_api_register('page.info()',function(action){if(this.context.length===0){return undefined;}
var
settings=this.context[0],start=settings._iDisplayStart,len=settings.oFeatures.bPaginate?settings._iDisplayLength:-1,visRecords=settings.fnRecordsDisplay(),all=len===-1;return{"page":all?0:Math.floor(start/len),"pages":all?1:Math.ceil(visRecords/len),"start":start,"end":settings.fnDisplayEnd(),"length":len,"recordsTotal":settings.fnRecordsTotal(),"recordsDisplay":visRecords,"serverSide":_fnDataSource(settings)==='ssp'};});_api_register('page.len()',function(len){if(len===undefined){return this.context.length!==0?this.context[0]._iDisplayLength:undefined;}
return this.iterator('table',function(settings){_fnLengthChange(settings,len);});});var __reload=function(settings,holdPosition,callback){if(callback){var api=new _Api(settings);api.one('draw',function(){callback(api.ajax.json());});}
if(_fnDataSource(settings)=='ssp'){_fnReDraw(settings,holdPosition);}
else{_fnProcessingDisplay(settings,true);var xhr=settings.jqXHR;if(xhr&&xhr.readyState!==4){xhr.abort();}
_fnBuildAjax(settings,[],function(json){_fnClearTable(settings);var data=_fnAjaxDataSrc(settings,json);for(var i=0,ien=data.length;i<ien;i++){_fnAddData(settings,data[i]);}
_fnReDraw(settings,holdPosition);_fnProcessingDisplay(settings,false);});}};_api_register('ajax.json()',function(){var ctx=this.context;if(ctx.length>0){return ctx[0].json;}});_api_register('ajax.params()',function(){var ctx=this.context;if(ctx.length>0){return ctx[0].oAjaxData;}});_api_register('ajax.reload()',function(callback,resetPaging){return this.iterator('table',function(settings){__reload(settings,resetPaging===false,callback);});});_api_register('ajax.url()',function(url){var ctx=this.context;if(url===undefined){if(ctx.length===0){return undefined;}
ctx=ctx[0];return ctx.ajax?$.isPlainObject(ctx.ajax)?ctx.ajax.url:ctx.ajax:ctx.sAjaxSource;}
return this.iterator('table',function(settings){if($.isPlainObject(settings.ajax)){settings.ajax.url=url;}
else{settings.ajax=url;}});});_api_register('ajax.url().load()',function(callback,resetPaging){return this.iterator('table',function(ctx){__reload(ctx,resetPaging===false,callback);});});var _selector_run=function(type,selector,selectFn,settings,opts)
{var
out=[],res,a,i,ien,j,jen,selectorType=typeof selector;if(!selector||selectorType==='string'||selectorType==='function'||selector.length===undefined){selector=[selector];}
for(i=0,ien=selector.length;i<ien;i++){a=selector[i]&&selector[i].split&&!selector[i].match(/[\[\(:]/)?selector[i].split(','):[selector[i]];for(j=0,jen=a.length;j<jen;j++){res=selectFn(typeof a[j]==='string'?(a[j]).trim():a[j]);if(res&&res.length){out=out.concat(res);}}}
var ext=_ext.selector[type];if(ext.length){for(i=0,ien=ext.length;i<ien;i++){out=ext[i](settings,opts,out);}}
return _unique(out);};var _selector_opts=function(opts)
{if(!opts){opts={};}
if(opts.filter&&opts.search===undefined){opts.search=opts.filter;}
return $.extend({search:'none',order:'current',page:'all'},opts);};var _selector_first=function(inst)
{for(var i=0,ien=inst.length;i<ien;i++){if(inst[i].length>0){inst[0]=inst[i];inst[0].length=1;inst.length=1;inst.context=[inst.context[i]];return inst;}}
inst.length=0;return inst;};var _selector_row_indexes=function(settings,opts)
{var
i,ien,tmp,a=[],displayFiltered=settings.aiDisplay,displayMaster=settings.aiDisplayMaster;var
search=opts.search,order=opts.order,page=opts.page;if(_fnDataSource(settings)=='ssp'){return search==='removed'?[]:_range(0,displayMaster.length);}
else if(page=='current'){for(i=settings._iDisplayStart,ien=settings.fnDisplayEnd();i<ien;i++){a.push(displayFiltered[i]);}}
else if(order=='current'||order=='applied'){if(search=='none'){a=displayMaster.slice();}
else if(search=='applied'){a=displayFiltered.slice();}
else if(search=='removed'){var displayFilteredMap={};for(var i=0,ien=displayFiltered.length;i<ien;i++){displayFilteredMap[displayFiltered[i]]=null;}
a=$.map(displayMaster,function(el){return!displayFilteredMap.hasOwnProperty(el)?el:null;});}}
else if(order=='index'||order=='original'){for(i=0,ien=settings.aoData.length;i<ien;i++){if(search=='none'){a.push(i);}
else{tmp=$.inArray(i,displayFiltered);if((tmp===-1&&search=='removed')||(tmp>=0&&search=='applied'))
{a.push(i);}}}}
return a;};var __row_selector=function(settings,selector,opts)
{var rows;var run=function(sel){var selInt=_intVal(sel);var i,ien;var aoData=settings.aoData;if(selInt!==null&&!opts){return[selInt];}
if(!rows){rows=_selector_row_indexes(settings,opts);}
if(selInt!==null&&$.inArray(selInt,rows)!==-1){return[selInt];}
else if(sel===null||sel===undefined||sel===''){return rows;}
if(typeof sel==='function'){return $.map(rows,function(idx){var row=aoData[idx];return sel(idx,row._aData,row.nTr)?idx:null;});}
if(sel.nodeName){var rowIdx=sel._DT_RowIndex;var cellIdx=sel._DT_CellIndex;if(rowIdx!==undefined){return aoData[rowIdx]&&aoData[rowIdx].nTr===sel?[rowIdx]:[];}
else if(cellIdx){return aoData[cellIdx.row]&&aoData[cellIdx.row].nTr===sel.parentNode?[cellIdx.row]:[];}
else{var host=$(sel).closest('*[data-dt-row]');return host.length?[host.data('dt-row')]:[];}}
if(typeof sel==='string'&&sel.charAt(0)==='#'){var rowObj=settings.aIds[sel.replace(/^#/,'')];if(rowObj!==undefined){return[rowObj.idx];}}
var nodes=_removeEmpty(_pluck_order(settings.aoData,rows,'nTr'));return $(nodes).filter(sel).map(function(){return this._DT_RowIndex;}).toArray();};return _selector_run('row',selector,run,settings,opts);};_api_register('rows()',function(selector,opts){if(selector===undefined){selector='';}
else if($.isPlainObject(selector)){opts=selector;selector='';}
opts=_selector_opts(opts);var inst=this.iterator('table',function(settings){return __row_selector(settings,selector,opts);},1);inst.selector.rows=selector;inst.selector.opts=opts;return inst;});_api_register('rows().nodes()',function(){return this.iterator('row',function(settings,row){return settings.aoData[row].nTr||undefined;},1);});_api_register('rows().data()',function(){return this.iterator(true,'rows',function(settings,rows){return _pluck_order(settings.aoData,rows,'_aData');},1);});_api_registerPlural('rows().cache()','row().cache()',function(type){return this.iterator('row',function(settings,row){var r=settings.aoData[row];return type==='search'?r._aFilterData:r._aSortData;},1);});_api_registerPlural('rows().invalidate()','row().invalidate()',function(src){return this.iterator('row',function(settings,row){_fnInvalidate(settings,row,src);});});_api_registerPlural('rows().indexes()','row().index()',function(){return this.iterator('row',function(settings,row){return row;},1);});_api_registerPlural('rows().ids()','row().id()',function(hash){var a=[];var context=this.context;for(var i=0,ien=context.length;i<ien;i++){for(var j=0,jen=this[i].length;j<jen;j++){var id=context[i].rowIdFn(context[i].aoData[this[i][j]]._aData);a.push((hash===true?'#':'')+id);}}
return new _Api(context,a);});_api_registerPlural('rows().remove()','row().remove()',function(){var that=this;this.iterator('row',function(settings,row,thatIdx){var data=settings.aoData;var rowData=data[row];var i,ien,j,jen;var loopRow,loopCells;data.splice(row,1);for(i=0,ien=data.length;i<ien;i++){loopRow=data[i];loopCells=loopRow.anCells;if(loopRow.nTr!==null){loopRow.nTr._DT_RowIndex=i;}
if(loopCells!==null){for(j=0,jen=loopCells.length;j<jen;j++){loopCells[j]._DT_CellIndex.row=i;}}}
_fnDeleteIndex(settings.aiDisplayMaster,row);_fnDeleteIndex(settings.aiDisplay,row);_fnDeleteIndex(that[thatIdx],row,false);if(settings._iRecordsDisplay>0){settings._iRecordsDisplay--;}
_fnLengthOverflow(settings);var id=settings.rowIdFn(rowData._aData);if(id!==undefined){delete settings.aIds[id];}});this.iterator('table',function(settings){for(var i=0,ien=settings.aoData.length;i<ien;i++){settings.aoData[i].idx=i;}});return this;});_api_register('rows.add()',function(rows){var newRows=this.iterator('table',function(settings){var row,i,ien;var out=[];for(i=0,ien=rows.length;i<ien;i++){row=rows[i];if(row.nodeName&&row.nodeName.toUpperCase()==='TR'){out.push(_fnAddTr(settings,row)[0]);}
else{out.push(_fnAddData(settings,row));}}
return out;},1);var modRows=this.rows(-1);modRows.pop();$.merge(modRows,newRows);return modRows;});_api_register('row()',function(selector,opts){return _selector_first(this.rows(selector,opts));});_api_register('row().data()',function(data){var ctx=this.context;if(data===undefined){return ctx.length&&this.length?ctx[0].aoData[this[0]]._aData:undefined;}
var row=ctx[0].aoData[this[0]];row._aData=data;if(Array.isArray(data)&&row.nTr&&row.nTr.id){_fnSetObjectDataFn(ctx[0].rowId)(data,row.nTr.id);}
_fnInvalidate(ctx[0],this[0],'data');return this;});_api_register('row().node()',function(){var ctx=this.context;return ctx.length&&this.length?ctx[0].aoData[this[0]].nTr||null:null;});_api_register('row.add()',function(row){if(row instanceof $&&row.length){row=row[0];}
var rows=this.iterator('table',function(settings){if(row.nodeName&&row.nodeName.toUpperCase()==='TR'){return _fnAddTr(settings,row)[0];}
return _fnAddData(settings,row);});return this.row(rows[0]);});$(document).on('plugin-init.dt',function(e,context){var api=new _Api(context);api.on('stateSaveParams',function(e,settings,data){var indexes=api.rows().iterator('row',function(settings,idx){return settings.aoData[idx]._detailsShow?idx:undefined;});data.childRows=api.rows(indexes).ids(true).toArray();})
var loaded=api.state.loaded();if(loaded&&loaded.childRows){api.rows(loaded.childRows).every(function(){_fnCallbackFire(context,null,'requestChild',[this])})}})
var __details_add=function(ctx,row,data,klass)
{var rows=[];var addRow=function(r,k){if(Array.isArray(r)||r instanceof $){for(var i=0,ien=r.length;i<ien;i++){addRow(r[i],k);}
return;}
if(r.nodeName&&r.nodeName.toLowerCase()==='tr'){rows.push(r);}
else{var created=$('<tr><td></td></tr>').addClass(k);$('td',created).addClass(k).html(r)
[0].colSpan=_fnVisbleColumns(ctx);rows.push(created[0]);}};addRow(data,klass);if(row._details){row._details.detach();}
row._details=$(rows);if(row._detailsShow){row._details.insertAfter(row.nTr);}};var __details_remove=function(api,idx)
{var ctx=api.context;if(ctx.length){var row=ctx[0].aoData[idx!==undefined?idx:api[0]];if(row&&row._details){row._details.remove();row._detailsShow=undefined;row._details=undefined;$(row.nTr).removeClass('dt-hasChild');_fnSaveState(ctx[0]);}}};var __details_display=function(api,show){var ctx=api.context;if(ctx.length&&api.length){var row=ctx[0].aoData[api[0]];if(row._details){row._detailsShow=show;if(show){row._details.insertAfter(row.nTr);$(row.nTr).addClass('dt-hasChild');}
else{row._details.detach();$(row.nTr).removeClass('dt-hasChild');}
_fnCallbackFire(ctx[0],null,'childRow',[show,api.row(api[0])])
__details_events(ctx[0]);_fnSaveState(ctx[0]);}}};var __details_events=function(settings)
{var api=new _Api(settings);var namespace='.dt.DT_details';var drawEvent='draw'+namespace;var colvisEvent='column-visibility'+namespace;var destroyEvent='destroy'+namespace;var data=settings.aoData;api.off(drawEvent+' '+colvisEvent+' '+destroyEvent);if(_pluck(data,'_details').length>0){api.on(drawEvent,function(e,ctx){if(settings!==ctx){return;}
api.rows({page:'current'}).eq(0).each(function(idx){var row=data[idx];if(row._detailsShow){row._details.insertAfter(row.nTr);}});});api.on(colvisEvent,function(e,ctx,idx,vis){if(settings!==ctx){return;}
var row,visible=_fnVisbleColumns(ctx);for(var i=0,ien=data.length;i<ien;i++){row=data[i];if(row._details){row._details.children('td[colspan]').attr('colspan',visible);}}});api.on(destroyEvent,function(e,ctx){if(settings!==ctx){return;}
for(var i=0,ien=data.length;i<ien;i++){if(data[i]._details){__details_remove(api,i);}}});}};var _emp='';var _child_obj=_emp+'row().child';var _child_mth=_child_obj+'()';_api_register(_child_mth,function(data,klass){var ctx=this.context;if(data===undefined){return ctx.length&&this.length?ctx[0].aoData[this[0]]._details:undefined;}
else if(data===true){this.child.show();}
else if(data===false){__details_remove(this);}
else if(ctx.length&&this.length){__details_add(ctx[0],ctx[0].aoData[this[0]],data,klass);}
return this;});_api_register([_child_obj+'.show()',_child_mth+'.show()'],function(show){__details_display(this,true);return this;});_api_register([_child_obj+'.hide()',_child_mth+'.hide()'],function(){__details_display(this,false);return this;});_api_register([_child_obj+'.remove()',_child_mth+'.remove()'],function(){__details_remove(this);return this;});_api_register(_child_obj+'.isShown()',function(){var ctx=this.context;if(ctx.length&&this.length){return ctx[0].aoData[this[0]]._detailsShow||false;}
return false;});var __re_column_selector=/^([^:]+):(name|visIdx|visible)$/;var __columnData=function(settings,column,r1,r2,rows){var a=[];for(var row=0,ien=rows.length;row<ien;row++){a.push(_fnGetCellData(settings,rows[row],column));}
return a;};var __column_selector=function(settings,selector,opts)
{var
columns=settings.aoColumns,names=_pluck(columns,'sName'),nodes=_pluck(columns,'nTh');var run=function(s){var selInt=_intVal(s);if(s===''){return _range(columns.length);}
if(selInt!==null){return[selInt>=0?selInt:columns.length+selInt];}
if(typeof s==='function'){var rows=_selector_row_indexes(settings,opts);return $.map(columns,function(col,idx){return s(idx,__columnData(settings,idx,0,0,rows),nodes[idx])?idx:null;});}
var match=typeof s==='string'?s.match(__re_column_selector):'';if(match){switch(match[2]){case 'visIdx':case 'visible':var idx=parseInt(match[1],10);if(idx<0){var visColumns=$.map(columns,function(col,i){return col.bVisible?i:null;});return[visColumns[visColumns.length+idx]];}
return[_fnVisibleToColumnIndex(settings,idx)];case 'name':return $.map(names,function(name,i){return name===match[1]?i:null;});default:return[];}}
if(s.nodeName&&s._DT_CellIndex){return[s._DT_CellIndex.column];}
var jqResult=$(nodes).filter(s).map(function(){return $.inArray(this,nodes);}).toArray();if(jqResult.length||!s.nodeName){return jqResult;}
var host=$(s).closest('*[data-dt-column]');return host.length?[host.data('dt-column')]:[];};return _selector_run('column',selector,run,settings,opts);};var __setColumnVis=function(settings,column,vis){var
cols=settings.aoColumns,col=cols[column],data=settings.aoData,row,cells,i,ien,tr;if(vis===undefined){return col.bVisible;}
if(col.bVisible===vis){return;}
if(vis){var insertBefore=$.inArray(true,_pluck(cols,'bVisible'),column+1);for(i=0,ien=data.length;i<ien;i++){tr=data[i].nTr;cells=data[i].anCells;if(tr){tr.insertBefore(cells[column],cells[insertBefore]||null);}}}
else{$(_pluck(settings.aoData,'anCells',column)).detach();}
col.bVisible=vis;};_api_register('columns()',function(selector,opts){if(selector===undefined){selector='';}
else if($.isPlainObject(selector)){opts=selector;selector='';}
opts=_selector_opts(opts);var inst=this.iterator('table',function(settings){return __column_selector(settings,selector,opts);},1);inst.selector.cols=selector;inst.selector.opts=opts;return inst;});_api_registerPlural('columns().header()','column().header()',function(selector,opts){return this.iterator('column',function(settings,column){return settings.aoColumns[column].nTh;},1);});_api_registerPlural('columns().footer()','column().footer()',function(selector,opts){return this.iterator('column',function(settings,column){return settings.aoColumns[column].nTf;},1);});_api_registerPlural('columns().data()','column().data()',function(){return this.iterator('column-rows',__columnData,1);});_api_registerPlural('columns().dataSrc()','column().dataSrc()',function(){return this.iterator('column',function(settings,column){return settings.aoColumns[column].mData;},1);});_api_registerPlural('columns().cache()','column().cache()',function(type){return this.iterator('column-rows',function(settings,column,i,j,rows){return _pluck_order(settings.aoData,rows,type==='search'?'_aFilterData':'_aSortData',column);},1);});_api_registerPlural('columns().nodes()','column().nodes()',function(){return this.iterator('column-rows',function(settings,column,i,j,rows){return _pluck_order(settings.aoData,rows,'anCells',column);},1);});_api_registerPlural('columns().visible()','column().visible()',function(vis,calc){var that=this;var ret=this.iterator('column',function(settings,column){if(vis===undefined){return settings.aoColumns[column].bVisible;}
__setColumnVis(settings,column,vis);});if(vis!==undefined){this.iterator('table',function(settings){_fnDrawHead(settings,settings.aoHeader);_fnDrawHead(settings,settings.aoFooter);if(!settings.aiDisplay.length){$(settings.nTBody).find('td[colspan]').attr('colspan',_fnVisbleColumns(settings));}
_fnSaveState(settings);that.iterator('column',function(settings,column){_fnCallbackFire(settings,null,'column-visibility',[settings,column,vis,calc]);});if(calc===undefined||calc){that.columns.adjust();}});}
return ret;});_api_registerPlural('columns().indexes()','column().index()',function(type){return this.iterator('column',function(settings,column){return type==='visible'?_fnColumnIndexToVisible(settings,column):column;},1);});_api_register('columns.adjust()',function(){return this.iterator('table',function(settings){_fnAdjustColumnSizing(settings);},1);});_api_register('column.index()',function(type,idx){if(this.context.length!==0){var ctx=this.context[0];if(type==='fromVisible'||type==='toData'){return _fnVisibleToColumnIndex(ctx,idx);}
else if(type==='fromData'||type==='toVisible'){return _fnColumnIndexToVisible(ctx,idx);}}});_api_register('column()',function(selector,opts){return _selector_first(this.columns(selector,opts));});var __cell_selector=function(settings,selector,opts)
{var data=settings.aoData;var rows=_selector_row_indexes(settings,opts);var cells=_removeEmpty(_pluck_order(data,rows,'anCells'));var allCells=$(_flatten([],cells));var row;var columns=settings.aoColumns.length;var a,i,ien,j,o,host;var run=function(s){var fnSelector=typeof s==='function';if(s===null||s===undefined||fnSelector){a=[];for(i=0,ien=rows.length;i<ien;i++){row=rows[i];for(j=0;j<columns;j++){o={row:row,column:j};if(fnSelector){host=data[row];if(s(o,_fnGetCellData(settings,row,j),host.anCells?host.anCells[j]:null)){a.push(o);}}
else{a.push(o);}}}
return a;}
if($.isPlainObject(s)){return s.column!==undefined&&s.row!==undefined&&$.inArray(s.row,rows)!==-1?[s]:[];}
var jqResult=allCells.filter(s).map(function(i,el){return{row:el._DT_CellIndex.row,column:el._DT_CellIndex.column};}).toArray();if(jqResult.length||!s.nodeName){return jqResult;}
host=$(s).closest('*[data-dt-row]');return host.length?[{row:host.data('dt-row'),column:host.data('dt-column')}]:[];};return _selector_run('cell',selector,run,settings,opts);};_api_register('cells()',function(rowSelector,columnSelector,opts){if($.isPlainObject(rowSelector)){if(rowSelector.row===undefined){opts=rowSelector;rowSelector=null;}
else{opts=columnSelector;columnSelector=null;}}
if($.isPlainObject(columnSelector)){opts=columnSelector;columnSelector=null;}
if(columnSelector===null||columnSelector===undefined){return this.iterator('table',function(settings){return __cell_selector(settings,rowSelector,_selector_opts(opts));});}
var internalOpts=opts?{page:opts.page,order:opts.order,search:opts.search}:{};var columns=this.columns(columnSelector,internalOpts);var rows=this.rows(rowSelector,internalOpts);var i,ien,j,jen;var cellsNoOpts=this.iterator('table',function(settings,idx){var a=[];for(i=0,ien=rows[idx].length;i<ien;i++){for(j=0,jen=columns[idx].length;j<jen;j++){a.push({row:rows[idx][i],column:columns[idx][j]});}}
return a;},1);var cells=opts&&opts.selected?this.cells(cellsNoOpts,opts):cellsNoOpts;$.extend(cells.selector,{cols:columnSelector,rows:rowSelector,opts:opts});return cells;});_api_registerPlural('cells().nodes()','cell().node()',function(){return this.iterator('cell',function(settings,row,column){var data=settings.aoData[row];return data&&data.anCells?data.anCells[column]:undefined;},1);});_api_register('cells().data()',function(){return this.iterator('cell',function(settings,row,column){return _fnGetCellData(settings,row,column);},1);});_api_registerPlural('cells().cache()','cell().cache()',function(type){type=type==='search'?'_aFilterData':'_aSortData';return this.iterator('cell',function(settings,row,column){return settings.aoData[row][type][column];},1);});_api_registerPlural('cells().render()','cell().render()',function(type){return this.iterator('cell',function(settings,row,column){return _fnGetCellData(settings,row,column,type);},1);});_api_registerPlural('cells().indexes()','cell().index()',function(){return this.iterator('cell',function(settings,row,column){return{row:row,column:column,columnVisible:_fnColumnIndexToVisible(settings,column)};},1);});_api_registerPlural('cells().invalidate()','cell().invalidate()',function(src){return this.iterator('cell',function(settings,row,column){_fnInvalidate(settings,row,src,column);});});_api_register('cell()',function(rowSelector,columnSelector,opts){return _selector_first(this.cells(rowSelector,columnSelector,opts));});_api_register('cell().data()',function(data){var ctx=this.context;var cell=this[0];if(data===undefined){return ctx.length&&cell.length?_fnGetCellData(ctx[0],cell[0].row,cell[0].column):undefined;}
_fnSetCellData(ctx[0],cell[0].row,cell[0].column,data);_fnInvalidate(ctx[0],cell[0].row,'data',cell[0].column);return this;});_api_register('order()',function(order,dir){var ctx=this.context;if(order===undefined){return ctx.length!==0?ctx[0].aaSorting:undefined;}
if(typeof order==='number'){order=[[order,dir]];}
else if(order.length&&!Array.isArray(order[0])){order=Array.prototype.slice.call(arguments);}
return this.iterator('table',function(settings){settings.aaSorting=order.slice();});});_api_register('order.listener()',function(node,column,callback){return this.iterator('table',function(settings){_fnSortAttachListener(settings,node,column,callback);});});_api_register('order.fixed()',function(set){if(!set){var ctx=this.context;var fixed=ctx.length?ctx[0].aaSortingFixed:undefined;return Array.isArray(fixed)?{pre:fixed}:fixed;}
return this.iterator('table',function(settings){settings.aaSortingFixed=$.extend(true,{},set);});});_api_register(['columns().order()','column().order()'],function(dir){var that=this;return this.iterator('table',function(settings,i){var sort=[];$.each(that[i],function(j,col){sort.push([col,dir]);});settings.aaSorting=sort;});});_api_register('search()',function(input,regex,smart,caseInsen){var ctx=this.context;if(input===undefined){return ctx.length!==0?ctx[0].oPreviousSearch.sSearch:undefined;}
return this.iterator('table',function(settings){if(!settings.oFeatures.bFilter){return;}
_fnFilterComplete(settings,$.extend({},settings.oPreviousSearch,{"sSearch":input+"","bRegex":regex===null?false:regex,"bSmart":smart===null?true:smart,"bCaseInsensitive":caseInsen===null?true:caseInsen}),1);});});_api_registerPlural('columns().search()','column().search()',function(input,regex,smart,caseInsen){return this.iterator('column',function(settings,column){var preSearch=settings.aoPreSearchCols;if(input===undefined){return preSearch[column].sSearch;}
if(!settings.oFeatures.bFilter){return;}
$.extend(preSearch[column],{"sSearch":input+"","bRegex":regex===null?false:regex,"bSmart":smart===null?true:smart,"bCaseInsensitive":caseInsen===null?true:caseInsen});_fnFilterComplete(settings,settings.oPreviousSearch,1);});});_api_register('state()',function(){return this.context.length?this.context[0].oSavedState:null;});_api_register('state.clear()',function(){return this.iterator('table',function(settings){settings.fnStateSaveCallback.call(settings.oInstance,settings,{});});});_api_register('state.loaded()',function(){return this.context.length?this.context[0].oLoadedState:null;});_api_register('state.save()',function(){return this.iterator('table',function(settings){_fnSaveState(settings);});});DataTable.versionCheck=DataTable.fnVersionCheck=function(version)
{var aThis=DataTable.version.split('.');var aThat=version.split('.');var iThis,iThat;for(var i=0,iLen=aThat.length;i<iLen;i++){iThis=parseInt(aThis[i],10)||0;iThat=parseInt(aThat[i],10)||0;if(iThis===iThat){continue;}
return iThis>iThat;}
return true;};DataTable.isDataTable=DataTable.fnIsDataTable=function(table)
{var t=$(table).get(0);var is=false;if(table instanceof DataTable.Api){return true;}
$.each(DataTable.settings,function(i,o){var head=o.nScrollHead?$('table',o.nScrollHead)[0]:null;var foot=o.nScrollFoot?$('table',o.nScrollFoot)[0]:null;if(o.nTable===t||head===t||foot===t){is=true;}});return is;};DataTable.tables=DataTable.fnTables=function(visible)
{var api=false;if($.isPlainObject(visible)){api=visible.api;visible=visible.visible;}
var a=$.map(DataTable.settings,function(o){if(!visible||(visible&&$(o.nTable).is(':visible'))){return o.nTable;}});return api?new _Api(a):a;};DataTable.camelToHungarian=_fnCamelToHungarian;_api_register('$()',function(selector,opts){var
rows=this.rows(opts).nodes(),jqRows=$(rows);return $([].concat(jqRows.filter(selector).toArray(),jqRows.find(selector).toArray()));});$.each(['on','one','off'],function(i,key){_api_register(key+'()',function(){var args=Array.prototype.slice.call(arguments);args[0]=$.map(args[0].split(/\s/),function(e){return!e.match(/\.dt\b/)?e+'.dt':e;}).join(' ');var inst=$(this.tables().nodes());inst[key].apply(inst,args);return this;});});_api_register('clear()',function(){return this.iterator('table',function(settings){_fnClearTable(settings);});});_api_register('settings()',function(){return new _Api(this.context,this.context);});_api_register('init()',function(){var ctx=this.context;return ctx.length?ctx[0].oInit:null;});_api_register('data()',function(){return this.iterator('table',function(settings){return _pluck(settings.aoData,'_aData');}).flatten();});_api_register('destroy()',function(remove){remove=remove||false;return this.iterator('table',function(settings){var orig=settings.nTableWrapper.parentNode;var classes=settings.oClasses;var table=settings.nTable;var tbody=settings.nTBody;var thead=settings.nTHead;var tfoot=settings.nTFoot;var jqTable=$(table);var jqTbody=$(tbody);var jqWrapper=$(settings.nTableWrapper);var rows=$.map(settings.aoData,function(r){return r.nTr;});var i,ien;settings.bDestroying=true;_fnCallbackFire(settings,"aoDestroyCallback","destroy",[settings]);if(!remove){new _Api(settings).columns().visible(true);}
jqWrapper.off('.DT').find(':not(tbody *)').off('.DT');$(window).off('.DT-'+settings.sInstance);if(table!=thead.parentNode){jqTable.children('thead').detach();jqTable.append(thead);}
if(tfoot&&table!=tfoot.parentNode){jqTable.children('tfoot').detach();jqTable.append(tfoot);}
settings.aaSorting=[];settings.aaSortingFixed=[];_fnSortingClasses(settings);$(rows).removeClass(settings.asStripeClasses.join(' '));$('th, td',thead).removeClass(classes.sSortable+' '+
classes.sSortableAsc+' '+classes.sSortableDesc+' '+classes.sSortableNone);jqTbody.children().detach();jqTbody.append(rows);var removedMethod=remove?'remove':'detach';jqTable[removedMethod]();jqWrapper[removedMethod]();if(!remove&&orig){orig.insertBefore(table,settings.nTableReinsertBefore);jqTable.css('width',settings.sDestroyWidth).removeClass(classes.sTable);ien=settings.asDestroyStripes.length;if(ien){jqTbody.children().each(function(i){$(this).addClass(settings.asDestroyStripes[i%ien]);});}}
var idx=$.inArray(settings,DataTable.settings);if(idx!==-1){DataTable.settings.splice(idx,1);}});});$.each(['column','row','cell'],function(i,type){_api_register(type+'s().every()',function(fn){var opts=this.selector.opts;var api=this;return this.iterator(type,function(settings,arg1,arg2,arg3,arg4){fn.call(api[type](arg1,type==='cell'?arg2:opts,type==='cell'?opts:undefined),arg1,arg2,arg3,arg4);});});});_api_register('i18n()',function(token,def,plural){var ctx=this.context[0];var resolved=_fnGetObjectDataFn(token)(ctx.oLanguage);if(resolved===undefined){resolved=def;}
if(plural!==undefined&&$.isPlainObject(resolved)){resolved=resolved[plural]!==undefined?resolved[plural]:resolved._;}
return resolved.replace('%d',plural);});DataTable.version="1.11.3";DataTable.settings=[];DataTable.models={};DataTable.models.oSearch={"bCaseInsensitive":true,"sSearch":"","bRegex":false,"bSmart":true,"return":false};DataTable.models.oRow={"nTr":null,"anCells":null,"_aData":[],"_aSortData":null,"_aFilterData":null,"_sFilterRow":null,"_sRowStripe":"","src":null,"idx":-1};DataTable.models.oColumn={"idx":null,"aDataSort":null,"asSorting":null,"bSearchable":null,"bSortable":null,"bVisible":null,"_sManualType":null,"_bAttrSrc":false,"fnCreatedCell":null,"fnGetData":null,"fnSetData":null,"mData":null,"mRender":null,"nTh":null,"nTf":null,"sClass":null,"sContentPadding":null,"sDefaultContent":null,"sName":null,"sSortDataType":'std',"sSortingClass":null,"sSortingClassJUI":null,"sTitle":null,"sType":null,"sWidth":null,"sWidthOrig":null};DataTable.defaults={"aaData":null,"aaSorting":[[0,'asc']],"aaSortingFixed":[],"ajax":null,"aLengthMenu":[10,25,50,100],"aoColumns":null,"aoColumnDefs":null,"aoSearchCols":[],"asStripeClasses":null,"bAutoWidth":true,"bDeferRender":false,"bDestroy":false,"bFilter":true,"bInfo":true,"bLengthChange":true,"bPaginate":true,"bProcessing":false,"bRetrieve":false,"bScrollCollapse":false,"bServerSide":false,"bSort":true,"bSortMulti":true,"bSortCellsTop":false,"bSortClasses":true,"bStateSave":false,"fnCreatedRow":null,"fnDrawCallback":null,"fnFooterCallback":null,"fnFormatNumber":function(toFormat){return toFormat.toString().replace(/\B(?=(\d{3})+(?!\d))/g,this.oLanguage.sThousands);},"fnHeaderCallback":null,"fnInfoCallback":null,"fnInitComplete":null,"fnPreDrawCallback":null,"fnRowCallback":null,"fnServerData":null,"fnServerParams":null,"fnStateLoadCallback":function(settings){try{return JSON.parse((settings.iStateDuration===-1?sessionStorage:localStorage).getItem('DataTables_'+settings.sInstance+'_'+location.pathname));}catch(e){return{};}},"fnStateLoadParams":null,"fnStateLoaded":null,"fnStateSaveCallback":function(settings,data){try{(settings.iStateDuration===-1?sessionStorage:localStorage).setItem('DataTables_'+settings.sInstance+'_'+location.pathname,JSON.stringify(data));}catch(e){}},"fnStateSaveParams":null,"iStateDuration":7200,"iDeferLoading":null,"iDisplayLength":10,"iDisplayStart":0,"iTabIndex":0,"oClasses":{},"oLanguage":{"oAria":{"sSortAscending":": activate to sort column ascending","sSortDescending":": activate to sort column descending"},"oPaginate":{"sFirst":"First","sLast":"Last","sNext":"Next","sPrevious":"Previous"},"sEmptyTable":"No data available in table","sInfo":"Showing _START_ to _END_ of _TOTAL_ entries","sInfoEmpty":"Showing 0 to 0 of 0 entries","sInfoFiltered":"(filtered from _MAX_ total entries)","sInfoPostFix":"","sDecimal":"","sThousands":",","sLengthMenu":"Show _MENU_ entries","sLoadingRecords":"Loading...","sProcessing":"Processing...","sSearch":"Search:","sSearchPlaceholder":"","sUrl":"","sZeroRecords":"No matching records found"},"oSearch":$.extend({},DataTable.models.oSearch),"sAjaxDataProp":"data","sAjaxSource":null,"sDom":"lfrtip","searchDelay":null,"sPaginationType":"simple_numbers","sScrollX":"","sScrollXInner":"","sScrollY":"","sServerMethod":"GET","renderer":null,"rowId":"DT_RowId"};_fnHungarianMap(DataTable.defaults);DataTable.defaults.column={"aDataSort":null,"iDataSort":-1,"asSorting":['asc','desc'],"bSearchable":true,"bSortable":true,"bVisible":true,"fnCreatedCell":null,"mData":null,"mRender":null,"sCellType":"td","sClass":"","sContentPadding":"","sDefaultContent":null,"sName":"","sSortDataType":"std","sTitle":null,"sType":null,"sWidth":null};_fnHungarianMap(DataTable.defaults.column);DataTable.models.oSettings={"oFeatures":{"bAutoWidth":null,"bDeferRender":null,"bFilter":null,"bInfo":null,"bLengthChange":null,"bPaginate":null,"bProcessing":null,"bServerSide":null,"bSort":null,"bSortMulti":null,"bSortClasses":null,"bStateSave":null},"oScroll":{"bCollapse":null,"iBarWidth":0,"sX":null,"sXInner":null,"sY":null},"oLanguage":{"fnInfoCallback":null},"oBrowser":{"bScrollOversize":false,"bScrollbarLeft":false,"bBounding":false,"barWidth":0},"ajax":null,"aanFeatures":[],"aoData":[],"aiDisplay":[],"aiDisplayMaster":[],"aIds":{},"aoColumns":[],"aoHeader":[],"aoFooter":[],"oPreviousSearch":{},"aoPreSearchCols":[],"aaSorting":null,"aaSortingFixed":[],"asStripeClasses":null,"asDestroyStripes":[],"sDestroyWidth":0,"aoRowCallback":[],"aoHeaderCallback":[],"aoFooterCallback":[],"aoDrawCallback":[],"aoRowCreatedCallback":[],"aoPreDrawCallback":[],"aoInitComplete":[],"aoStateSaveParams":[],"aoStateLoadParams":[],"aoStateLoaded":[],"sTableId":"","nTable":null,"nTHead":null,"nTFoot":null,"nTBody":null,"nTableWrapper":null,"bDeferLoading":false,"bInitialised":false,"aoOpenRows":[],"sDom":null,"searchDelay":null,"sPaginationType":"two_button","iStateDuration":0,"aoStateSave":[],"aoStateLoad":[],"oSavedState":null,"oLoadedState":null,"sAjaxSource":null,"sAjaxDataProp":null,"jqXHR":null,"json":undefined,"oAjaxData":undefined,"fnServerData":null,"aoServerParams":[],"sServerMethod":null,"fnFormatNumber":null,"aLengthMenu":null,"iDraw":0,"bDrawing":false,"iDrawError":-1,"_iDisplayLength":10,"_iDisplayStart":0,"_iRecordsTotal":0,"_iRecordsDisplay":0,"oClasses":{},"bFiltered":false,"bSorted":false,"bSortCellsTop":null,"oInit":null,"aoDestroyCallback":[],"fnRecordsTotal":function()
{return _fnDataSource(this)=='ssp'?this._iRecordsTotal*1:this.aiDisplayMaster.length;},"fnRecordsDisplay":function()
{return _fnDataSource(this)=='ssp'?this._iRecordsDisplay*1:this.aiDisplay.length;},"fnDisplayEnd":function()
{var
len=this._iDisplayLength,start=this._iDisplayStart,calc=start+len,records=this.aiDisplay.length,features=this.oFeatures,paginate=features.bPaginate;if(features.bServerSide){return paginate===false||len===-1?start+records:Math.min(start+len,this._iRecordsDisplay);}
else{return!paginate||calc>records||len===-1?records:calc;}},"oInstance":null,"sInstance":null,"iTabIndex":0,"nScrollHead":null,"nScrollFoot":null,"aLastSort":[],"oPlugins":{},"rowIdFn":null,"rowId":null};DataTable.ext=_ext={buttons:{},classes:{},builder:"-source-",errMode:"alert",feature:[],search:[],selector:{cell:[],column:[],row:[]},internal:{},legacy:{ajax:null},pager:{},renderer:{pageButton:{},header:{}},order:{},type:{detect:[],search:{},order:{}},_unique:0,fnVersionCheck:DataTable.fnVersionCheck,iApiIndex:0,oJUIClasses:{},sVersion:DataTable.version};$.extend(_ext,{afnFiltering:_ext.search,aTypes:_ext.type.detect,ofnSearch:_ext.type.search,oSort:_ext.type.order,afnSortData:_ext.order,aoFeatures:_ext.feature,oApi:_ext.internal,oStdClasses:_ext.classes,oPagination:_ext.pager});$.extend(DataTable.ext.classes,{"sTable":"dataTable","sNoFooter":"no-footer","sPageButton":"paginate_button","sPageButtonActive":"current","sPageButtonDisabled":"disabled","sStripeOdd":"odd","sStripeEven":"even","sRowEmpty":"dataTables_empty","sWrapper":"dataTables_wrapper","sFilter":"dataTables_filter","sInfo":"dataTables_info","sPaging":"dataTables_paginate paging_","sLength":"dataTables_length","sProcessing":"dataTables_processing","sSortAsc":"sorting_asc","sSortDesc":"sorting_desc","sSortable":"sorting","sSortableAsc":"sorting_desc_disabled","sSortableDesc":"sorting_asc_disabled","sSortableNone":"sorting_disabled","sSortColumn":"sorting_","sFilterInput":"","sLengthSelect":"","sScrollWrapper":"dataTables_scroll","sScrollHead":"dataTables_scrollHead","sScrollHeadInner":"dataTables_scrollHeadInner","sScrollBody":"dataTables_scrollBody","sScrollFoot":"dataTables_scrollFoot","sScrollFootInner":"dataTables_scrollFootInner","sHeaderTH":"","sFooterTH":"","sSortJUIAsc":"","sSortJUIDesc":"","sSortJUI":"","sSortJUIAscAllowed":"","sSortJUIDescAllowed":"","sSortJUIWrapper":"","sSortIcon":"","sJUIHeader":"","sJUIFooter":""});var extPagination=DataTable.ext.pager;function _numbers(page,pages){var
numbers=[],buttons=extPagination.numbers_length,half=Math.floor(buttons/2),i=1;if(pages<=buttons){numbers=_range(0,pages);}
else if(page<=half){numbers=_range(0,buttons-2);numbers.push('ellipsis');numbers.push(pages-1);}
else if(page>=pages-1-half){numbers=_range(pages-(buttons-2),pages);numbers.splice(0,0,'ellipsis');numbers.splice(0,0,0);}
else{numbers=_range(page-half+2,page+half-1);numbers.push('ellipsis');numbers.push(pages-1);numbers.splice(0,0,'ellipsis');numbers.splice(0,0,0);}
numbers.DT_el='span';return numbers;}
$.extend(extPagination,{simple:function(page,pages){return['previous','next'];},full:function(page,pages){return['first','previous','next','last'];},numbers:function(page,pages){return[_numbers(page,pages)];},simple_numbers:function(page,pages){return['previous',_numbers(page,pages),'next'];},full_numbers:function(page,pages){return['first','previous',_numbers(page,pages),'next','last'];},first_last_numbers:function(page,pages){return['first',_numbers(page,pages),'last'];},_numbers:_numbers,numbers_length:7});$.extend(true,DataTable.ext.renderer,{pageButton:{_:function(settings,host,idx,buttons,page,pages){var classes=settings.oClasses;var lang=settings.oLanguage.oPaginate;var aria=settings.oLanguage.oAria.paginate||{};var btnDisplay,btnClass,counter=0;var attach=function(container,buttons){var i,ien,node,button,tabIndex;var disabledClass=classes.sPageButtonDisabled;var clickHandler=function(e){_fnPageChange(settings,e.data.action,true);};for(i=0,ien=buttons.length;i<ien;i++){button=buttons[i];if(Array.isArray(button)){var inner=$('<'+(button.DT_el||'div')+'/>').appendTo(container);attach(inner,button);}
else{btnDisplay=null;btnClass=button;tabIndex=settings.iTabIndex;switch(button){case 'ellipsis':container.append('<span class="ellipsis">&#x2026;</span>');break;case 'first':btnDisplay=lang.sFirst;if(page===0){tabIndex=-1;btnClass+=' '+disabledClass;}
break;case 'previous':btnDisplay=lang.sPrevious;if(page===0){tabIndex=-1;btnClass+=' '+disabledClass;}
break;case 'next':btnDisplay=lang.sNext;if(pages===0||page===pages-1){tabIndex=-1;btnClass+=' '+disabledClass;}
break;case 'last':btnDisplay=lang.sLast;if(pages===0||page===pages-1){tabIndex=-1;btnClass+=' '+disabledClass;}
break;default:btnDisplay=settings.fnFormatNumber(button+1);btnClass=page===button?classes.sPageButtonActive:'';break;}
if(btnDisplay!==null){node=$('<a>',{'class':classes.sPageButton+' '+btnClass,'aria-controls':settings.sTableId,'aria-label':aria[button],'data-dt-idx':counter,'tabindex':tabIndex,'id':idx===0&&typeof button==='string'?settings.sTableId+'_'+button:null}).html(btnDisplay).appendTo(container);_fnBindAction(node,{action:button},clickHandler);counter++;}}}};var activeEl;try{activeEl=$(host).find(document.activeElement).data('dt-idx');}
catch(e){}
attach($(host).empty(),buttons);if(activeEl!==undefined){$(host).find('[data-dt-idx='+activeEl+']').trigger('focus');}}}});$.extend(DataTable.ext.type.detect,[function(d,settings)
{var decimal=settings.oLanguage.sDecimal;return _isNumber(d,decimal)?'num'+decimal:null;},function(d,settings)
{if(d&&!(d instanceof Date)&&!_re_date.test(d)){return null;}
var parsed=Date.parse(d);return(parsed!==null&&!isNaN(parsed))||_empty(d)?'date':null;},function(d,settings)
{var decimal=settings.oLanguage.sDecimal;return _isNumber(d,decimal,true)?'num-fmt'+decimal:null;},function(d,settings)
{var decimal=settings.oLanguage.sDecimal;return _htmlNumeric(d,decimal)?'html-num'+decimal:null;},function(d,settings)
{var decimal=settings.oLanguage.sDecimal;return _htmlNumeric(d,decimal,true)?'html-num-fmt'+decimal:null;},function(d,settings)
{return _empty(d)||(typeof d==='string'&&d.indexOf('<')!==-1)?'html':null;}]);$.extend(DataTable.ext.type.search,{html:function(data){return _empty(data)?data:typeof data==='string'?data.replace(_re_new_lines," ").replace(_re_html,""):'';},string:function(data){return _empty(data)?data:typeof data==='string'?data.replace(_re_new_lines," "):data;}});var __numericReplace=function(d,decimalPlace,re1,re2){if(d!==0&&(!d||d==='-')){return-Infinity;}
if(decimalPlace){d=_numToDecimal(d,decimalPlace);}
if(d.replace){if(re1){d=d.replace(re1,'');}
if(re2){d=d.replace(re2,'');}}
return d*1;};function _addNumericSort(decimalPlace){$.each({"num":function(d){return __numericReplace(d,decimalPlace);},"num-fmt":function(d){return __numericReplace(d,decimalPlace,_re_formatted_numeric);},"html-num":function(d){return __numericReplace(d,decimalPlace,_re_html);},"html-num-fmt":function(d){return __numericReplace(d,decimalPlace,_re_html,_re_formatted_numeric);}},function(key,fn){_ext.type.order[key+decimalPlace+'-pre']=fn;if(key.match(/^html\-/)){_ext.type.search[key+decimalPlace]=_ext.type.search.html;}});}
$.extend(_ext.type.order,{"date-pre":function(d){var ts=Date.parse(d);return isNaN(ts)?-Infinity:ts;},"html-pre":function(a){return _empty(a)?'':a.replace?a.replace(/<.*?>/g,"").toLowerCase():a+'';},"string-pre":function(a){return _empty(a)?'':typeof a==='string'?a.toLowerCase():!a.toString?'':a.toString();},"string-asc":function(x,y){return((x<y)?-1:((x>y)?1:0));},"string-desc":function(x,y){return((x<y)?1:((x>y)?-1:0));}});_addNumericSort('');$.extend(true,DataTable.ext.renderer,{header:{_:function(settings,cell,column,classes){$(settings.nTable).on('order.dt.DT',function(e,ctx,sorting,columns){if(settings!==ctx){return;}
var colIdx=column.idx;cell.removeClass(classes.sSortAsc+' '+
classes.sSortDesc).addClass(columns[colIdx]=='asc'?classes.sSortAsc:columns[colIdx]=='desc'?classes.sSortDesc:column.sSortingClass);});},jqueryui:function(settings,cell,column,classes){$('<div/>').addClass(classes.sSortJUIWrapper).append(cell.contents()).append($('<span/>').addClass(classes.sSortIcon+' '+column.sSortingClassJUI)).appendTo(cell);$(settings.nTable).on('order.dt.DT',function(e,ctx,sorting,columns){if(settings!==ctx){return;}
var colIdx=column.idx;cell.removeClass(classes.sSortAsc+" "+classes.sSortDesc).addClass(columns[colIdx]=='asc'?classes.sSortAsc:columns[colIdx]=='desc'?classes.sSortDesc:column.sSortingClass);cell.find('span.'+classes.sSortIcon).removeClass(classes.sSortJUIAsc+" "+
classes.sSortJUIDesc+" "+
classes.sSortJUI+" "+
classes.sSortJUIAscAllowed+" "+
classes.sSortJUIDescAllowed).addClass(columns[colIdx]=='asc'?classes.sSortJUIAsc:columns[colIdx]=='desc'?classes.sSortJUIDesc:column.sSortingClassJUI);});}}});var __htmlEscapeEntities=function(d){if(Array.isArray(d)){d=d.join(',');}
return typeof d==='string'?d.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'):d;};DataTable.render={number:function(thousands,decimal,precision,prefix,postfix){return{display:function(d){if(typeof d!=='number'&&typeof d!=='string'){return d;}
var negative=d<0?'-':'';var flo=parseFloat(d);if(isNaN(flo)){return __htmlEscapeEntities(d);}
flo=flo.toFixed(precision);d=Math.abs(flo);var intPart=parseInt(d,10);var floatPart=precision?decimal+(d-intPart).toFixed(precision).substring(2):'';if(intPart===0&&parseFloat(floatPart)===0){negative='';}
return negative+(prefix||'')+
intPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g,thousands)+
floatPart+
(postfix||'');}};},text:function(){return{display:__htmlEscapeEntities,filter:__htmlEscapeEntities};}};function _fnExternApiFunc(fn)
{return function(){var args=[_fnSettingsFromNode(this[DataTable.ext.iApiIndex])].concat(Array.prototype.slice.call(arguments));return DataTable.ext.internal[fn].apply(this,args);};}
$.extend(DataTable.ext.internal,{_fnExternApiFunc:_fnExternApiFunc,_fnBuildAjax:_fnBuildAjax,_fnAjaxUpdate:_fnAjaxUpdate,_fnAjaxParameters:_fnAjaxParameters,_fnAjaxUpdateDraw:_fnAjaxUpdateDraw,_fnAjaxDataSrc:_fnAjaxDataSrc,_fnAddColumn:_fnAddColumn,_fnColumnOptions:_fnColumnOptions,_fnAdjustColumnSizing:_fnAdjustColumnSizing,_fnVisibleToColumnIndex:_fnVisibleToColumnIndex,_fnColumnIndexToVisible:_fnColumnIndexToVisible,_fnVisbleColumns:_fnVisbleColumns,_fnGetColumns:_fnGetColumns,_fnColumnTypes:_fnColumnTypes,_fnApplyColumnDefs:_fnApplyColumnDefs,_fnHungarianMap:_fnHungarianMap,_fnCamelToHungarian:_fnCamelToHungarian,_fnLanguageCompat:_fnLanguageCompat,_fnBrowserDetect:_fnBrowserDetect,_fnAddData:_fnAddData,_fnAddTr:_fnAddTr,_fnNodeToDataIndex:_fnNodeToDataIndex,_fnNodeToColumnIndex:_fnNodeToColumnIndex,_fnGetCellData:_fnGetCellData,_fnSetCellData:_fnSetCellData,_fnSplitObjNotation:_fnSplitObjNotation,_fnGetObjectDataFn:_fnGetObjectDataFn,_fnSetObjectDataFn:_fnSetObjectDataFn,_fnGetDataMaster:_fnGetDataMaster,_fnClearTable:_fnClearTable,_fnDeleteIndex:_fnDeleteIndex,_fnInvalidate:_fnInvalidate,_fnGetRowElements:_fnGetRowElements,_fnCreateTr:_fnCreateTr,_fnBuildHead:_fnBuildHead,_fnDrawHead:_fnDrawHead,_fnDraw:_fnDraw,_fnReDraw:_fnReDraw,_fnAddOptionsHtml:_fnAddOptionsHtml,_fnDetectHeader:_fnDetectHeader,_fnGetUniqueThs:_fnGetUniqueThs,_fnFeatureHtmlFilter:_fnFeatureHtmlFilter,_fnFilterComplete:_fnFilterComplete,_fnFilterCustom:_fnFilterCustom,_fnFilterColumn:_fnFilterColumn,_fnFilter:_fnFilter,_fnFilterCreateSearch:_fnFilterCreateSearch,_fnEscapeRegex:_fnEscapeRegex,_fnFilterData:_fnFilterData,_fnFeatureHtmlInfo:_fnFeatureHtmlInfo,_fnUpdateInfo:_fnUpdateInfo,_fnInfoMacros:_fnInfoMacros,_fnInitialise:_fnInitialise,_fnInitComplete:_fnInitComplete,_fnLengthChange:_fnLengthChange,_fnFeatureHtmlLength:_fnFeatureHtmlLength,_fnFeatureHtmlPaginate:_fnFeatureHtmlPaginate,_fnPageChange:_fnPageChange,_fnFeatureHtmlProcessing:_fnFeatureHtmlProcessing,_fnProcessingDisplay:_fnProcessingDisplay,_fnFeatureHtmlTable:_fnFeatureHtmlTable,_fnScrollDraw:_fnScrollDraw,_fnApplyToChildren:_fnApplyToChildren,_fnCalculateColumnWidths:_fnCalculateColumnWidths,_fnThrottle:_fnThrottle,_fnConvertToWidth:_fnConvertToWidth,_fnGetWidestNode:_fnGetWidestNode,_fnGetMaxLenString:_fnGetMaxLenString,_fnStringToCss:_fnStringToCss,_fnSortFlatten:_fnSortFlatten,_fnSort:_fnSort,_fnSortAria:_fnSortAria,_fnSortListener:_fnSortListener,_fnSortAttachListener:_fnSortAttachListener,_fnSortingClasses:_fnSortingClasses,_fnSortData:_fnSortData,_fnSaveState:_fnSaveState,_fnLoadState:_fnLoadState,_fnImplementState:_fnImplementState,_fnSettingsFromNode:_fnSettingsFromNode,_fnLog:_fnLog,_fnMap:_fnMap,_fnBindAction:_fnBindAction,_fnCallbackReg:_fnCallbackReg,_fnCallbackFire:_fnCallbackFire,_fnLengthOverflow:_fnLengthOverflow,_fnRenderer:_fnRenderer,_fnDataSource:_fnDataSource,_fnRowAttributes:_fnRowAttributes,_fnExtend:_fnExtend,_fnCalculateEnd:function(){}});$.fn.dataTable=DataTable;DataTable.$=$;$.fn.dataTableSettings=DataTable.settings;$.fn.dataTableExt=DataTable.ext;$.fn.DataTable=function(opts){return $(this).dataTable(opts).api();};$.each(DataTable,function(prop,val){$.fn.DataTable[prop]=val;});return DataTable;}));/*! DataTables Bootstrap 5 integration
* 2020 SpryMedia Ltd - datatables.net/license
*/(function(factory){if(typeof define==='function'&&define.amd){define(['jquery','datatables.net'],function($){return factory($,window,document);});}
else if(typeof exports==='object'){module.exports=function(root,$){if(!root){root=window;}
if(!$||!$.fn.dataTable){$=require('datatables.net')(root,$).$;}
return factory($,root,root.document);};}
else{factory(jQuery,window,document);}}(function($,window,document,undefined){'use strict';var DataTable=$.fn.dataTable;$.extend(true,DataTable.defaults,{dom:"<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>"+
"<'row'<'col-sm-12'tr>>"+
"<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",renderer:'bootstrap'});$.extend(DataTable.ext.classes,{sWrapper:"dataTables_wrapper dt-bootstrap5",sFilterInput:"form-control form-control-sm",sLengthSelect:"form-select form-select-sm",sProcessing:"dataTables_processing card",sPageButton:"paginate_button page-item"});DataTable.ext.renderer.pageButton.bootstrap=function(settings,host,idx,buttons,page,pages){var api=new DataTable.Api(settings);var classes=settings.oClasses;var lang=settings.oLanguage.oPaginate;var aria=settings.oLanguage.oAria.paginate||{};var btnDisplay,btnClass,counter=0;var attach=function(container,buttons){var i,ien,node,button;var clickHandler=function(e){e.preventDefault();if(!$(e.currentTarget).hasClass('disabled')&&api.page()!=e.data.action){api.page(e.data.action).draw('page');}};for(i=0,ien=buttons.length;i<ien;i++){button=buttons[i];if(Array.isArray(button)){attach(container,button);}
else{btnDisplay='';btnClass='';switch(button){case 'ellipsis':btnDisplay='&#x2026;';btnClass='disabled';break;case 'first':btnDisplay=lang.sFirst;btnClass=button+(page>0?'':' disabled');break;case 'previous':btnDisplay=lang.sPrevious;btnClass=button+(page>0?'':' disabled');break;case 'next':btnDisplay=lang.sNext;btnClass=button+(page<pages-1?'':' disabled');break;case 'last':btnDisplay=lang.sLast;btnClass=button+(page<pages-1?'':' disabled');break;default:btnDisplay=button+1;btnClass=page===button?'active':'';break;}
if(btnDisplay){node=$('<li>',{'class':classes.sPageButton+' '+btnClass,'id':idx===0&&typeof button==='string'?settings.sTableId+'_'+button:null}).append($('<a>',{'href':'#','aria-controls':settings.sTableId,'aria-label':aria[button],'data-dt-idx':counter,'tabindex':settings.iTabIndex,'class':'page-link'}).html(btnDisplay)).appendTo(container);settings.oApi._fnBindAction(node,{action:button},clickHandler);counter++;}}}};var activeEl;try{activeEl=$(host).find(document.activeElement).data('dt-idx');}
catch(e){}
attach($(host).empty().html('<ul class="pagination"/>').children('ul'),buttons);if(activeEl!==undefined){$(host).find('[data-dt-idx='+activeEl+']').trigger('focus');}};return DataTable;}));"use strict";var defaults={"language":{"info":"Showing _START_ to _END_ of _TOTAL_ records","infoEmpty":"Showing no records","lengthMenu":"_MENU_","paginate":{"first":'<i class="first"></i>',"last":'<i class="last"></i>',"next":'<i class="next"></i>',"previous":'<i class="previous"></i>'}}};$.extend(true,$.fn.dataTable.defaults,defaults);/*! DataTables Bootstrap 4 integration
* ©2011-2017 SpryMedia Ltd - datatables.net/license
*/(function(factory){if(typeof define==='function'&&define.amd){define(['jquery','datatables.net'],function($){return factory($,window,document);});}
else if(typeof exports==='object'){module.exports=function(root,$){if(!root){root=window;}
if(!$||!$.fn.dataTable){$=require('datatables.net')(root,$).$;}
return factory($,root,root.document);};}
else{factory(jQuery,window,document);}}(function($,window,document,undefined){'use strict';var DataTable=$.fn.dataTable;$.extend(true,DataTable.defaults,{dom:"<'table-responsive'tr>"+
"<'row'"+
"<'col-sm-12 col-md-5 d-flex align-items-center justify-content-center justify-content-md-start'li>"+
"<'col-sm-12 col-md-7 d-flex align-items-center justify-content-center justify-content-md-end'p>"+
">",renderer:'bootstrap'});$.extend(DataTable.ext.classes,{sWrapper:"dataTables_wrapper dt-bootstrap4",sFilterInput:"form-control form-control-sm form-control-solid",sLengthSelect:"form-select form-select-sm form-select-solid",sProcessing:"dataTables_processing",sPageButton:"paginate_button page-item"});DataTable.ext.renderer.pageButton.bootstrap=function(settings,host,idx,buttons,page,pages){var api=new DataTable.Api(settings);var classes=settings.oClasses;var lang=settings.oLanguage.oPaginate;var aria=settings.oLanguage.oAria.paginate||{};var btnDisplay,btnClass,counter=0;var attach=function(container,buttons){var i,ien,node,button;var clickHandler=function(e){e.preventDefault();if(!$(e.currentTarget).hasClass('disabled')&&api.page()!=e.data.action){api.page(e.data.action).draw('page');}};for(i=0,ien=buttons.length;i<ien;i++){button=buttons[i];if(Array.isArray(button)){attach(container,button);}
else{btnDisplay='';btnClass='';switch(button){case 'ellipsis':btnDisplay='&#x2026;';btnClass='disabled';break;case 'first':btnDisplay=lang.sFirst;btnClass=button+(page>0?'':' disabled');break;case 'previous':btnDisplay=lang.sPrevious;btnClass=button+(page>0?'':' disabled');break;case 'next':btnDisplay=lang.sNext;btnClass=button+(page<pages-1?'':' disabled');break;case 'last':btnDisplay=lang.sLast;btnClass=button+(page<pages-1?'':' disabled');break;default:btnDisplay=button+1;btnClass=page===button?'active':'';break;}
if(btnDisplay){node=$('<li>',{'class':classes.sPageButton+' '+btnClass,'id':idx===0&&typeof button==='string'?settings.sTableId+'_'+button:null}).append($('<a>',{'href':'#','aria-controls':settings.sTableId,'aria-label':aria[button],'data-dt-idx':counter,'tabindex':settings.iTabIndex,'class':'page-link'}).html(btnDisplay)).appendTo(container);settings.oApi._fnBindAction(node,{action:button},clickHandler);counter++;}}}};var activeEl;try{activeEl=$(host).find(document.activeElement).data('dt-idx');}
catch(e){}
attach($(host).empty().html('<ul class="pagination"/>').children('ul'),buttons);if(activeEl!==undefined){$(host).find('[data-dt-idx='+activeEl+']').trigger('focus');}};return DataTable;}));/*!
JSZip v3.7.1 - A JavaScript class for generating and reading zip files
<http://stuartk.com/jszip>
(c) 2009-2016 Stuart Knightley <stuart [at] stuartk.com>
Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/master/LICENSE.markdown.
JSZip uses the library pako released under the MIT license :
https://github.com/nodeca/pako/blob/master/LICENSE
Buttons for DataTables 1.7.1
©2016-2021 SpryMedia Ltd - datatables.net/license
*/(function(e){"function"===typeof define&&define.amd?define(["jquery","datatables.net"],function(r){return e(r,window,document)}):"object"===typeof exports?module.exports=function(r,q){r||(r=window);if(!q||!q.fn.dataTable)q=require("datatables.net")(r,q).$;return e(q,r,r.document)}:e(jQuery,window,document)})(function(e,r,q,l){function t(a,b,c){e.fn.animate?a.stop().fadeIn(b,c):(a.css("display","block"),c&&c.call(a))}function u(a,b,c){e.fn.animate?a.stop().fadeOut(b,c):(a.css("display","none"),c&&c.call(a))}function w(a,b){var c=new j.Api(a),d=b?b:c.init().buttons||j.defaults.buttons;return(new o(c,d)).container()}var j=e.fn.dataTable,z=0,A=0,p=j.ext.buttons,o=function(a,b){if(!(this instanceof o))return function(b){return(new o(b,a)).container()};"undefined"===typeof b&&(b={});!0===b&&(b={});Array.isArray(b)&&(b={buttons:b});this.c=e.extend(!0,{},o.defaults,b);b.buttons&&(this.c.buttons=b.buttons);this.s={dt:new j.Api(a),buttons:[],listenKeys:"",namespace:"dtb"+z++};this.dom={container:e("<"+
this.c.dom.container.tag+"/>").addClass(this.c.dom.container.className)};this._constructor()};e.extend(o.prototype,{action:function(a,b){var c=this._nodeToButton(a);if(b===l)return c.conf.action;c.conf.action=b;return this},active:function(a,b){var c=this._nodeToButton(a),d=this.c.dom.button.active,c=e(c.node);if(b===l)return c.hasClass(d);c.toggleClass(d,b===l?!0:b);return this},add:function(a,b){var c=this.s.buttons;if("string"===typeof b){for(var d=b.split("-"),e=this.s,c=0,h=d.length-1;c<h;c++)e=e.buttons[1*d[c]];c=e.buttons;b=1*d[d.length-1]}this._expandButton(c,a,e!==l,b);this._draw();return this},container:function(){return this.dom.container},disable:function(a){a=this._nodeToButton(a);e(a.node).addClass(this.c.dom.button.disabled).attr("disabled",!0);return this},destroy:function(){e("body").off("keyup."+this.s.namespace);var a=this.s.buttons.slice(),b,c;b=0;for(c=a.length;b<c;b++)this.remove(a[b].node);this.dom.container.remove();a=this.s.dt.settings()[0];b=0;for(c=a.length;b<c;b++)if(a.inst===this){a.splice(b,1);break}return this},enable:function(a,b){if(!1===b)return this.disable(a);var c=this._nodeToButton(a);e(c.node).removeClass(this.c.dom.button.disabled).removeAttr("disabled");return this},name:function(){return this.c.name},node:function(a){if(!a)return this.dom.container;a=this._nodeToButton(a);return e(a.node)},processing:function(a,b){var c=this.s.dt,d=this._nodeToButton(a);if(b===l)return e(d.node).hasClass("processing");e(d.node).toggleClass("processing",b);e(c.table().node()).triggerHandler("buttons-processing.dt",[b,c.button(a),c,e(a),d.conf]);return this},remove:function(a){var b=this._nodeToButton(a),c=this._nodeToHost(a),d=this.s.dt;if(b.buttons.length)for(var f=b.buttons.length-1;0<=f;f--)this.remove(b.buttons[f].node);b.conf.destroy&&b.conf.destroy.call(d.button(a),d,e(a),b.conf);this._removeKey(b.conf);e(b.node).remove();a=e.inArray(b,c);c.splice(a,1);return this},text:function(a,b){var c=this._nodeToButton(a),d=this.c.dom.collection.buttonLiner,d=c.inCollection&&d&&d.tag?d.tag:this.c.dom.buttonLiner.tag,f=this.s.dt,h=e(c.node),i=function(a){return"function"===typeof a?a(f,h,c.conf):a};if(b===l)return i(c.conf.text);c.conf.text=b;d?h.children(d).html(i(b)):h.html(i(b));return this},_constructor:function(){var a=this,b=this.s.dt,c=b.settings()[0],d=this.c.buttons;c._buttons||(c._buttons=[]);c._buttons.push({inst:this,name:this.c.name});for(var f=0,h=d.length;f<h;f++)this.add(d[f]);b.on("destroy",function(b,d){d===c&&a.destroy()});e("body").on("keyup."+this.s.namespace,function(b){if(!q.activeElement||q.activeElement===q.body){var c=String.fromCharCode(b.keyCode).toLowerCase();a.s.listenKeys.toLowerCase().indexOf(c)!==-1&&a._keypress(c,b)}})},_addKey:function(a){a.key&&(this.s.listenKeys+=e.isPlainObject(a.key)?a.key.key:a.key)},_draw:function(a,b){a||(a=this.dom.container,b=this.s.buttons);a.children().detach();for(var c=0,d=b.length;c<d;c++)a.append(b[c].inserter),a.append(" "),b[c].buttons&&b[c].buttons.length&&this._draw(b[c].collection,b[c].buttons)},_expandButton:function(a,b,c,d){for(var f=this.s.dt,h=0,b=!Array.isArray(b)?[b]:b,i=0,k=b.length;i<k;i++){var m=this._resolveExtends(b[i]);if(m)if(Array.isArray(m))this._expandButton(a,m,c,d);else{var g=this._buildButton(m,c);g&&(d!==l&&null!==d?(a.splice(d,0,g),d++):a.push(g),g.conf.buttons&&(g.collection=e("<"+this.c.dom.collection.tag+"/>"),g.conf._collection=g.collection,this._expandButton(g.buttons,g.conf.buttons,!0,d)),m.init&&m.init.call(f.button(g.node),f,e(g.node),m),h++)}}},_buildButton:function(a,b){var c=this.c.dom.button,d=this.c.dom.buttonLiner,f=this.c.dom.collection,h=this.s.dt,i=function(b){return"function"===typeof b?b(h,g,a):b};b&&f.button&&(c=f.button);b&&f.buttonLiner&&(d=f.buttonLiner);if(a.available&&!a.available(h,a))return!1;var k=function(a,b,c,d){d.action.call(b.button(c),a,b,c,d);e(b.table().node()).triggerHandler("buttons-action.dt",[b.button(c),b,c,d])},f=a.tag||c.tag,m=a.clickBlurs===l?!0:a.clickBlurs,g=e("<"+f+"/>").addClass(c.className).attr("tabindex",this.s.dt.settings()[0].iTabIndex).attr("aria-controls",this.s.dt.table().node().id).on("click.dtb",function(b){b.preventDefault();!g.hasClass(c.disabled)&&a.action&&k(b,h,g,a);m&&g.trigger("blur")}).on("keyup.dtb",function(b){b.keyCode===13&&!g.hasClass(c.disabled)&&a.action&&k(b,h,g,a)});"a"===f.toLowerCase()&&g.attr("href","#");"button"===f.toLowerCase()&&g.attr("type","button");d.tag?(f=e("<"+d.tag+"/>").html(i(a.text)).addClass(d.className),"a"===d.tag.toLowerCase()&&f.attr("href","#"),g.append(f)):g.html(i(a.text));!1===a.enabled&&g.addClass(c.disabled);a.className&&g.addClass(a.className);a.titleAttr&&g.attr("title",i(a.titleAttr));a.attr&&g.attr(a.attr);a.namespace||(a.namespace=".dt-button-"+A++);d=(d=this.c.dom.buttonContainer)&&d.tag?e("<"+d.tag+"/>").addClass(d.className).append(g):g;this._addKey(a);this.c.buttonCreated&&(d=this.c.buttonCreated(a,d));return{conf:a,node:g.get(0),inserter:d,buttons:[],inCollection:b,collection:null}},_nodeToButton:function(a,b){b||(b=this.s.buttons);for(var c=0,d=b.length;c<d;c++){if(b[c].node===a)return b[c];if(b[c].buttons.length){var e=this._nodeToButton(a,b[c].buttons);if(e)return e}}},_nodeToHost:function(a,b){b||(b=this.s.buttons);for(var c=0,d=b.length;c<d;c++){if(b[c].node===a)return b;if(b[c].buttons.length){var e=this._nodeToHost(a,b[c].buttons);if(e)return e}}},_keypress:function(a,b){if(!b._buttonsHandled){var c=function(d){for(var f=0,h=d.length;f<h;f++){var i=d[f].conf,k=d[f].node;if(i.key)if(i.key===a)b._buttonsHandled=!0,e(k).click();else if(e.isPlainObject(i.key)&&i.key.key===a&&(!i.key.shiftKey||b.shiftKey))if(!i.key.altKey||b.altKey)if(!i.key.ctrlKey||b.ctrlKey)if(!i.key.metaKey||b.metaKey)b._buttonsHandled=!0,e(k).click();d[f].buttons.length&&c(d[f].buttons)}};c(this.s.buttons)}},_removeKey:function(a){if(a.key){var b=e.isPlainObject(a.key)?a.key.key:a.key,a=this.s.listenKeys.split(""),b=e.inArray(b,a);a.splice(b,1);this.s.listenKeys=a.join("")}},_resolveExtends:function(a){for(var b=this.s.dt,c,d,f=function(c){for(var d=0;!e.isPlainObject(c)&&!Array.isArray(c);){if(c===l)return;if("function"===typeof c){if(c=c(b,a),!c)return!1}else if("string"===typeof c){if(!p[c])throw"Unknown button type: "+c;c=p[c]}d++;if(30<d)throw"Buttons: Too many iterations";}return Array.isArray(c)?c:e.extend({},c)},a=f(a);a&&a.extend;){if(!p[a.extend])throw"Cannot extend unknown button type: "+a.extend;var h=f(p[a.extend]);if(Array.isArray(h))return h;if(!h)return!1;c=h.className;a=e.extend({},h,a);c&&a.className!==c&&(a.className=c+" "+a.className);var i=a.postfixButtons;if(i){a.buttons||(a.buttons=[]);c=0;for(d=i.length;c<d;c++)a.buttons.push(i[c]);a.postfixButtons=null}if(i=a.prefixButtons){a.buttons||(a.buttons=[]);c=0;for(d=i.length;c<d;c++)a.buttons.splice(c,0,i[c]);a.prefixButtons=null}a.extend=h.extend}return a},_popover:function(a,b,c){var d=this.c,f=e.extend({align:"button-left",autoClose:!1,background:!0,backgroundClassName:"dt-button-background",contentClassName:d.dom.collection.className,collectionLayout:"",collectionTitle:"",dropup:!1,fade:400,rightAlignClassName:"dt-button-right",tag:d.dom.collection.tag},c),h=b.node(),i=function(){u(e(".dt-button-collection"),f.fade,function(){e(this).detach()});e(b.buttons('[aria-haspopup="true"][aria-expanded="true"]').nodes()).attr("aria-expanded","false");e("div.dt-button-background").off("click.dtb-collection");o.background(!1,f.backgroundClassName,f.fade,h);e("body").off(".dtb-collection");b.off("buttons-action.b-internal")};!1===a&&i();c=e(b.buttons('[aria-haspopup="true"][aria-expanded="true"]').nodes());c.length&&(h=c.eq(0),i());c=e("<div/>").addClass("dt-button-collection").addClass(f.collectionLayout).css("display","none");a=e(a).addClass(f.contentClassName).attr("role","menu").appendTo(c);h.attr("aria-expanded","true");h.parents("body")[0]!==q.body&&(h=q.body.lastChild);f.collectionTitle&&c.prepend('<div class="dt-button-collection-title">'+f.collectionTitle+"</div>");t(c.insertAfter(h),f.fade);var d=e(b.table().container()),k=c.css("position");"dt-container"===f.align&&(h=h.parent(),c.css("width",d.width()));if("absolute"===k){var m=h.position(),k=e(b.node()).position();c.css({top:k.top+h.outerHeight(),left:m.left});var m=c.outerHeight(),g=d.offset().top+d.height(),g=k.top+h.outerHeight()+m-g,j=k.top-m,n=d.offset().top,k=k.top-m-5;(g>n-j||f.dropup)&&-k<n&&c.css("top",k);var k=d.offset().left,d=d.width(),d=k+d,m=c.offset().left,g=c.width(),g=m+g,j=h.offset().left,n=h.outerWidth(),l=j+n;c.hasClass(f.rightAlignClassName)||c.hasClass(f.leftAlignClassName)||"dt-container"===f.align?(n=0,c.hasClass(f.rightAlignClassName)?(n=l-g,k>m+n&&(k-=m+n,d-=g+n,n=k>d?n+d:n+k)):(n=k-m,d<g+n&&(k-=m+n,d-=g+n,n=k>d?n+d:n+k))):(d=h.offset().top,n=0,n="button-right"===f.align?l-g:j-m);c.css("left",c.position().left+n)}else d=c.height()/2,d>e(r).height()/2&&(d=e(r).height()/2),c.css("marginTop",-1*d);f.background&&o.background(!0,f.backgroundClassName,f.fade,h);e("div.dt-button-background").on("click.dtb-collection",function(){});e("body").on("click.dtb-collection",function(b){var c=e.fn.addBack?"addBack":"andSelf",d=e(b.target).parent()[0];(!e(b.target).parents()[c]().filter(a).length&&!e(d).hasClass("dt-buttons")||e(b.target).hasClass("dt-button-background"))&&i()}).on("keyup.dtb-collection",function(a){a.keyCode===27&&i()});f.autoClose&&setTimeout(function(){b.on("buttons-action.b-internal",function(a,b,c,d){d[0]!==h[0]&&i()})},0);e(c).trigger("buttons-popover.dt")}});o.background=function(a,b,c,d){c===l&&(c=400);d||(d=q.body);a?t(e("<div/>").addClass(b).css("display","none").insertAfter(d),c):u(e("div."+b),c,function(){e(this).removeClass(b).remove()})};o.instanceSelector=function(a,b){if(a===l||null===a)return e.map(b,function(a){return a.inst});var c=[],d=e.map(b,function(a){return a.name}),f=function(a){if(Array.isArray(a))for(var i=0,k=a.length;i<k;i++)f(a[i]);else"string"===typeof a?-1!==a.indexOf(",")?f(a.split(",")):(a=e.inArray(a.trim(),d),-1!==a&&c.push(b[a].inst)):"number"===typeof a&&c.push(b[a].inst)};f(a);return c};o.buttonSelector=function(a,b){for(var c=[],d=function(a,b,c){for(var e,f,h=0,i=b.length;h<i;h++)if(e=b[h])f=c!==l?c+h:h+"",a.push({node:e.node,name:e.conf.name,idx:f}),e.buttons&&d(a,e.buttons,f+"-")},f=function(a,b){var g,h,i=[];d(i,b.s.buttons);g=e.map(i,function(a){return a.node});if(Array.isArray(a)||a instanceof e){g=0;for(h=a.length;g<h;g++)f(a[g],b)}else if(null===a||a===l||"*"===a){g=0;for(h=i.length;g<h;g++)c.push({inst:b,node:i[g].node})}else if("number"===typeof a)c.push({inst:b,node:b.s.buttons[a].node});else if("string"===typeof a)if(-1!==a.indexOf(",")){i=a.split(",");g=0;for(h=i.length;g<h;g++)f(i[g].trim(),b)}else if(a.match(/^\d+(\-\d+)*$/))g=e.map(i,function(a){return a.idx}),c.push({inst:b,node:i[e.inArray(a,g)].node});else if(-1!==a.indexOf(":name")){var j=a.replace(":name","");g=0;for(h=i.length;g<h;g++)i[g].name===j&&c.push({inst:b,node:i[g].node})}else e(g).filter(a).each(function(){c.push({inst:b,node:this})});else"object"===typeof a&&a.nodeName&&(i=e.inArray(a,g),-1!==i&&c.push({inst:b,node:g[i]}))},h=0,i=a.length;h<i;h++)f(b,a[h]);return c};o.stripData=function(a,b){if("string"!==typeof a)return a;a=a.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,"");a=a.replace(/<!\-\-.*?\-\->/g,"");if(!b||b.stripHtml)a=a.replace(/<[^>]*>/g,"");if(!b||b.trim)a=a.replace(/^\s+|\s+$/g,"");if(!b||b.stripNewlines)a=a.replace(/\n/g," ");if(!b||b.decodeEntities)x.innerHTML=a,a=x.value;return a};o.defaults={buttons:["copy","excel","csv","pdf","print"],name:"main",tabIndex:0,dom:{container:{tag:"div",className:"dt-buttons"},collection:{tag:"div",className:""},button:{tag:"button",className:"dt-button",active:"active",disabled:"disabled"},buttonLiner:{tag:"span",className:""}}};o.version="1.7.1";e.extend(p,{collection:{text:function(a){return a.i18n("buttons.collection","Collection")},className:"buttons-collection",init:function(a,b){b.attr("aria-expanded",!1)},action:function(a,b,c,d){a.stopPropagation();d._collection.parents("body").length?this.popover(!1,d):this.popover(d._collection,d)},attr:{"aria-haspopup":!0}},copy:function(){if(p.copyHtml5)return"copyHtml5"},csv:function(a,b){if(p.csvHtml5&&p.csvHtml5.available(a,b))return"csvHtml5"},excel:function(a,b){if(p.excelHtml5&&p.excelHtml5.available(a,b))return"excelHtml5"},pdf:function(a,b){if(p.pdfHtml5&&p.pdfHtml5.available(a,b))return"pdfHtml5"},pageLength:function(a){var a=a.settings()[0].aLengthMenu,b=[],c=[];if(Array.isArray(a[0]))b=a[0],c=a[1];else for(var d=0;d<a.length;d++){var f=a[d];e.isPlainObject(f)?(b.push(f.value),c.push(f.label)):(b.push(f),c.push(f))}return{extend:"collection",text:function(a){return a.i18n("buttons.pageLength",{"-1":"Show all rows",_:"Show %d rows"},a.page.len())},className:"buttons-page-length",autoClose:!0,buttons:e.map(b,function(a,b){return{text:c[b],className:"button-page-length",action:function(b,c){c.page.len(a).draw()},init:function(b,c,d){var e=this,c=function(){e.active(b.page.len()===a)};b.on("length.dt"+d.namespace,c);c()},destroy:function(a,b,c){a.off("length.dt"+c.namespace)}}}),init:function(a,b,c){var d=this;a.on("length.dt"+c.namespace,function(){d.text(c.text)})},destroy:function(a,b,c){a.off("length.dt"+c.namespace)}}}});j.Api.register("buttons()",function(a,b){b===l&&(b=a,a=l);this.selector.buttonGroup=a;var c=this.iterator(!0,"table",function(c){if(c._buttons)return o.buttonSelector(o.instanceSelector(a,c._buttons),b)},!0);c._groupSelector=a;return c});j.Api.register("button()",function(a,b){var c=this.buttons(a,b);1<c.length&&c.splice(1,c.length);return c});j.Api.registerPlural("buttons().active()","button().active()",function(a){return a===l?this.map(function(a){return a.inst.active(a.node)}):this.each(function(b){b.inst.active(b.node,a)})});j.Api.registerPlural("buttons().action()","button().action()",function(a){return a===l?this.map(function(a){return a.inst.action(a.node)}):this.each(function(b){b.inst.action(b.node,a)})});j.Api.register(["buttons().enable()","button().enable()"],function(a){return this.each(function(b){b.inst.enable(b.node,a)})});j.Api.register(["buttons().disable()","button().disable()"],function(){return this.each(function(a){a.inst.disable(a.node)})});j.Api.registerPlural("buttons().nodes()","button().node()",function(){var a=e();e(this.each(function(b){a=a.add(b.inst.node(b.node))}));return a});j.Api.registerPlural("buttons().processing()","button().processing()",function(a){return a===l?this.map(function(a){return a.inst.processing(a.node)}):this.each(function(b){b.inst.processing(b.node,a)})});j.Api.registerPlural("buttons().text()","button().text()",function(a){return a===l?this.map(function(a){return a.inst.text(a.node)}):this.each(function(b){b.inst.text(b.node,a)})});j.Api.registerPlural("buttons().trigger()","button().trigger()",function(){return this.each(function(a){a.inst.node(a.node).trigger("click")})});j.Api.register("button().popover()",function(a,b){return this.map(function(c){return c.inst._popover(a,this.button(this[0].node),b)})});j.Api.register("buttons().containers()",function(){var a=e(),b=this._groupSelector;this.iterator(!0,"table",function(c){if(c._buttons)for(var c=o.instanceSelector(b,c._buttons),d=0,e=c.length;d<e;d++)a=a.add(c[d].container())});return a});j.Api.register("buttons().container()",function(){return this.containers().eq(0)});j.Api.register("button().add()",function(a,b){var c=this.context;c.length&&(c=o.instanceSelector(this._groupSelector,c[0]._buttons),c.length&&c[0].add(b,a));return this.button(this._groupSelector,a)});j.Api.register("buttons().destroy()",function(){this.pluck("inst").unique().each(function(a){a.destroy()});return this});j.Api.registerPlural("buttons().remove()","buttons().remove()",function(){this.each(function(a){a.inst.remove(a.node)});return this});var s;j.Api.register("buttons.info()",function(a,b,c){var d=this;if(!1===a)return this.off("destroy.btn-info"),u(e("#datatables_buttons_info"),400,function(){e(this).remove()}),clearTimeout(s),s=null,this;s&&clearTimeout(s);e("#datatables_buttons_info").length&&e("#datatables_buttons_info").remove();t(e('<div id="datatables_buttons_info" class="dt-button-info"/>').html(a?"<h2>"+a+"</h2>":"").append(e("<div/>")["string"===typeof b?"html":"append"](b)).css("display","none").appendTo("body"));c!==l&&0!==c&&(s=setTimeout(function(){d.buttons.info(!1)},c));this.on("destroy.btn-info",function(){d.buttons.info(!1)});return this});j.Api.register("buttons.exportData()",function(a){if(this.context.length){var b=new j.Api(this.context[0]),c=e.extend(!0,{},{rows:null,columns:"",modifier:{search:"applied",order:"applied"},orthogonal:"display",stripHtml:!0,stripNewlines:!0,decodeEntities:!0,trim:!0,format:{header:function(a){return o.stripData(a,c)},footer:function(a){return o.stripData(a,c)},body:function(a){return o.stripData(a,c)}},customizeData:null},a),a=b.columns(c.columns).indexes().map(function(a){var d=b.column(a).header();return c.format.header(d.innerHTML,a,d)}).toArray(),d=b.table().footer()?b.columns(c.columns).indexes().map(function(a){var d=b.column(a).footer();return c.format.footer(d?d.innerHTML:"",a,d)}).toArray():null,f=e.extend({},c.modifier);b.select&&"function"===typeof b.select.info&&f.selected===l&&b.rows(c.rows,e.extend({selected:!0},f)).any()&&e.extend(f,{selected:!0});for(var f=b.rows(c.rows,f).indexes().toArray(),h=b.cells(f,c.columns),f=h.render(c.orthogonal).toArray(),h=h.nodes().toArray(),i=a.length,k=[],m=0,g=0,q=0<i?f.length/i:0;g<q;g++){for(var n=[i],p=0;p<i;p++)n[p]=c.format.body(f[m],g,p,h[m]),m++;k[g]=n}a={header:a,footer:d,body:k};c.customizeData&&c.customizeData(a);return a}});j.Api.register("buttons.exportInfo()",function(a){a||(a={});var b;var c=a;b="*"===c.filename&&"*"!==c.title&&c.title!==l&&null!==c.title&&""!==c.title?c.title:c.filename;"function"===typeof b&&(b=b());b===l||null===b?b=null:(-1!==b.indexOf("*")&&(b=b.replace("*",e("head > title").text()).trim()),b=b.replace(/[^a-zA-Z0-9_\u00A1-\uFFFF\.,\-_ !\(\)]/g,""),(c=v(c.extension))||(c=""),b+=c);c=v(a.title);c=null===c?null:-1!==c.indexOf("*")?c.replace("*",e("head > title").text()||"Exported data"):c;return{filename:b,title:c,messageTop:y(this,a.message||a.messageTop,"top"),messageBottom:y(this,a.messageBottom,"bottom")}});var v=function(a){return null===a||a===l?null:"function"===typeof a?a():a},y=function(a,b,c){b=v(b);if(null===b)return null;a=e("caption",a.table().container()).eq(0);return"*"===b?a.css("caption-side")!==c?null:a.length?a.text():"":b},x=e("<textarea/>")[0];e.fn.dataTable.Buttons=o;e.fn.DataTable.Buttons=o;e(q).on("init.dt plugin-init.dt",function(a,b){if("dt"===a.namespace){var c=b.oInit.buttons||j.defaults.buttons;c&&!b._buttons&&(new o(b,c)).container()}});j.ext.feature.push({fnInit:w,cFeature:"B"});j.ext.features&&j.ext.features.register("buttons",w);return o});/*!
Bootstrap integration for DataTables' Buttons
©2016 SpryMedia Ltd - datatables.net/license
*/(function(b){"function"===typeof define&&define.amd?define(["jquery","datatables.net-bs5","datatables.net-buttons"],function(a){return b(a,window,document)}):"object"===typeof exports?module.exports=function(a,c){a||(a=window);if(!c||!c.fn.dataTable)c=require("datatables.net-bs5")(a,c).$;c.fn.dataTable.Buttons||require("datatables.net-buttons")(a,c);return b(c,a,a.document)}:b(jQuery,window,document)})(function(b){var a=b.fn.dataTable;b.extend(!0,a.Buttons.defaults,{dom:{container:{className:"dt-buttons btn-group flex-wrap"},button:{className:"btn btn-secondary"},collection:{tag:"div",className:"dropdown-menu",button:{tag:"a",className:"dt-button dropdown-item",active:"active",disabled:"disabled"}}},buttonCreated:function(a,d){return a.buttons?b('<div class="btn-group"/>').append(d):d}});a.ext.buttons.collection.className+=" dropdown-toggle";a.ext.buttons.collection.rightAlignClassName="dropdown-menu-right";return a.Buttons});/*!
* Column visibility buttons for Buttons and DataTables.
* 2016 SpryMedia Ltd - datatables.net/license
*/(function(factory){if(typeof define==='function'&&define.amd){define(['jquery','datatables.net','datatables.net-buttons'],function($){return factory($,window,document);});}
else if(typeof exports==='object'){module.exports=function(root,$){if(!root){root=window;}
if(!$||!$.fn.dataTable){$=require('datatables.net')(root,$).$;}
if(!$.fn.dataTable.Buttons){require('datatables.net-buttons')(root,$);}
return factory($,root,root.document);};}
else{factory(jQuery,window,document);}}(function($,window,document,undefined){'use strict';var DataTable=$.fn.dataTable;$.extend(DataTable.ext.buttons,{colvis:function(dt,conf){return{extend:'collection',text:function(dt){return dt.i18n('buttons.colvis','Column visibility');},className:'buttons-colvis',buttons:[{extend:'columnsToggle',columns:conf.columns,columnText:conf.columnText}]};},columnsToggle:function(dt,conf){var columns=dt.columns(conf.columns).indexes().map(function(idx){return{extend:'columnToggle',columns:idx,columnText:conf.columnText};}).toArray();return columns;},columnToggle:function(dt,conf){return{extend:'columnVisibility',columns:conf.columns,columnText:conf.columnText};},columnsVisibility:function(dt,conf){var columns=dt.columns(conf.columns).indexes().map(function(idx){return{extend:'columnVisibility',columns:idx,visibility:conf.visibility,columnText:conf.columnText};}).toArray();return columns;},columnVisibility:{columns:undefined,text:function(dt,button,conf){return conf._columnText(dt,conf);},className:'buttons-columnVisibility',action:function(e,dt,button,conf){var col=dt.columns(conf.columns);var curr=col.visible();col.visible(conf.visibility!==undefined?conf.visibility:!(curr.length?curr[0]:false));},init:function(dt,button,conf){var that=this;button.attr('data-cv-idx',conf.columns);dt.on('column-visibility.dt'+conf.namespace,function(e,settings){if(!settings.bDestroying&&settings.nTable==dt.settings()[0].nTable){that.active(dt.column(conf.columns).visible());}}).on('column-reorder.dt'+conf.namespace,function(e,settings,details){if(dt.columns(conf.columns).count()!==1){return;}
that.text(conf._columnText(dt,conf));that.active(dt.column(conf.columns).visible());});this.active(dt.column(conf.columns).visible());},destroy:function(dt,button,conf){dt.off('column-visibility.dt'+conf.namespace).off('column-reorder.dt'+conf.namespace);},_columnText:function(dt,conf){var idx=dt.column(conf.columns).index();var title=dt.settings()[0].aoColumns[idx].sTitle;if(!title){title=dt.column(idx).header().innerHTML;}
title=title.replace(/\n/g," ").replace(/<br\s*\/?>/gi," ").replace(/<select(.*?)<\/select>/g,"").replace(/<!\-\-.*?\-\->/g,"").replace(/<.*?>/g,"").replace(/^\s+|\s+$/g,"");return conf.columnText?conf.columnText(dt,idx,title):title;}},colvisRestore:{className:'buttons-colvisRestore',text:function(dt){return dt.i18n('buttons.colvisRestore','Restore visibility');},init:function(dt,button,conf){conf._visOriginal=dt.columns().indexes().map(function(idx){return dt.column(idx).visible();}).toArray();},action:function(e,dt,button,conf){dt.columns().every(function(i){var idx=dt.colReorder&&dt.colReorder.transpose?dt.colReorder.transpose(i,'toOriginal'):i;this.visible(conf._visOriginal[idx]);});}},colvisGroup:{className:'buttons-colvisGroup',action:function(e,dt,button,conf){dt.columns(conf.show).visible(true,false);dt.columns(conf.hide).visible(false,false);dt.columns.adjust();},show:[],hide:[]}});return DataTable.Buttons;}));/*!
* Flash export buttons for Buttons and DataTables.
* 2015-2017 SpryMedia Ltd - datatables.net/license
*
* ZeroClipbaord - MIT license
* Copyright (c) 2012 Joseph Huckaby
*/(function(factory){if(typeof define==='function'&&define.amd){define(['jquery','datatables.net','datatables.net-buttons'],function($){return factory($,window,document);});}
else if(typeof exports==='object'){module.exports=function(root,$){if(!root){root=window;}
if(!$||!$.fn.dataTable){$=require('datatables.net')(root,$).$;}
if(!$.fn.dataTable.Buttons){require('datatables.net-buttons')(root,$);}
return factory($,root,root.document);};}
else{factory(jQuery,window,document);}}(function($,window,document,undefined){'use strict';var DataTable=$.fn.dataTable;var ZeroClipboard_TableTools={version:"1.0.4-TableTools2",clients:{},moviePath:'',nextId:1,$:function(thingy){if(typeof(thingy)=='string'){thingy=document.getElementById(thingy);}
if(!thingy.addClass){thingy.hide=function(){this.style.display='none';};thingy.show=function(){this.style.display='';};thingy.addClass=function(name){this.removeClass(name);this.className+=' '+name;};thingy.removeClass=function(name){this.className=this.className.replace(new RegExp("\\s*"+name+"\\s*")," ").replace(/^\s+/,'').replace(/\s+$/,'');};thingy.hasClass=function(name){return!!this.className.match(new RegExp("\\s*"+name+"\\s*"));};}
return thingy;},setMoviePath:function(path){this.moviePath=path;},dispatch:function(id,eventName,args){var client=this.clients[id];if(client){client.receiveEvent(eventName,args);}},log:function(str){console.log('Flash: '+str);},register:function(id,client){this.clients[id]=client;},getDOMObjectPosition:function(obj){var info={left:0,top:0,width:obj.width?obj.width:obj.offsetWidth,height:obj.height?obj.height:obj.offsetHeight};if(obj.style.width!==""){info.width=obj.style.width.replace("px","");}
if(obj.style.height!==""){info.height=obj.style.height.replace("px","");}
while(obj){info.left+=obj.offsetLeft;info.top+=obj.offsetTop;obj=obj.offsetParent;}
return info;},Client:function(elem){this.handlers={};this.id=ZeroClipboard_TableTools.nextId++;this.movieId='ZeroClipboard_TableToolsMovie_'+this.id;ZeroClipboard_TableTools.register(this.id,this);if(elem){this.glue(elem);}}};ZeroClipboard_TableTools.Client.prototype={id:0,ready:false,movie:null,clipText:'',fileName:'',action:'copy',handCursorEnabled:true,cssEffects:true,handlers:null,sized:false,sheetName:'',glue:function(elem,title){this.domElement=ZeroClipboard_TableTools.$(elem);var zIndex=99;if(this.domElement.style.zIndex){zIndex=parseInt(this.domElement.style.zIndex,10)+1;}
var box=ZeroClipboard_TableTools.getDOMObjectPosition(this.domElement);this.div=document.createElement('div');var style=this.div.style;style.position='absolute';style.left='0px';style.top='0px';style.width=(box.width)+'px';style.height=box.height+'px';style.zIndex=zIndex;if(typeof title!="undefined"&&title!==""){this.div.title=title;}
if(box.width!==0&&box.height!==0){this.sized=true;}
if(this.domElement){this.domElement.appendChild(this.div);this.div.innerHTML=this.getHTML(box.width,box.height).replace(/&/g,'&amp;');}},positionElement:function(){var box=ZeroClipboard_TableTools.getDOMObjectPosition(this.domElement);var style=this.div.style;style.position='absolute';style.width=box.width+'px';style.height=box.height+'px';if(box.width!==0&&box.height!==0){this.sized=true;}else{return;}
var flash=this.div.childNodes[0];flash.width=box.width;flash.height=box.height;},getHTML:function(width,height){var html='';var flashvars='id='+this.id+
'&width='+width+
'&height='+height;if(navigator.userAgent.match(/MSIE/)){var protocol=location.href.match(/^https/i)?'https://':'http://';html+='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="'+protocol+'download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10,0,0,0" width="'+width+'" height="'+height+'" id="'+this.movieId+'" align="middle"><param name="allowScriptAccess" value="always" /><param name="allowFullScreen" value="false" /><param name="movie" value="'+ZeroClipboard_TableTools.moviePath+'" /><param name="loop" value="false" /><param name="menu" value="false" /><param name="quality" value="best" /><param name="bgcolor" value="#ffffff" /><param name="flashvars" value="'+flashvars+'"/><param name="wmode" value="transparent"/></object>';}
else{html+='<embed id="'+this.movieId+'" src="'+ZeroClipboard_TableTools.moviePath+'" loop="false" menu="false" quality="best" bgcolor="#ffffff" width="'+width+'" height="'+height+'" name="'+this.movieId+'" align="middle" allowScriptAccess="always" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" flashvars="'+flashvars+'" wmode="transparent" />';}
return html;},hide:function(){if(this.div){this.div.style.left='-2000px';}},show:function(){this.reposition();},destroy:function(){var that=this;if(this.domElement&&this.div){$(this.div).remove();this.domElement=null;this.div=null;$.each(ZeroClipboard_TableTools.clients,function(id,client){if(client===that){delete ZeroClipboard_TableTools.clients[id];}});}},reposition:function(elem){if(elem){this.domElement=ZeroClipboard_TableTools.$(elem);if(!this.domElement){this.hide();}}
if(this.domElement&&this.div){var box=ZeroClipboard_TableTools.getDOMObjectPosition(this.domElement);var style=this.div.style;style.left=''+box.left+'px';style.top=''+box.top+'px';}},clearText:function(){this.clipText='';if(this.ready){this.movie.clearText();}},appendText:function(newText){this.clipText+=newText;if(this.ready){this.movie.appendText(newText);}},setText:function(newText){this.clipText=newText;if(this.ready){this.movie.setText(newText);}},setFileName:function(newText){this.fileName=newText;if(this.ready){this.movie.setFileName(newText);}},setSheetData:function(data){if(this.ready){this.movie.setSheetData(JSON.stringify(data));}},setAction:function(newText){this.action=newText;if(this.ready){this.movie.setAction(newText);}},addEventListener:function(eventName,func){eventName=eventName.toString().toLowerCase().replace(/^on/,'');if(!this.handlers[eventName]){this.handlers[eventName]=[];}
this.handlers[eventName].push(func);},setHandCursor:function(enabled){this.handCursorEnabled=enabled;if(this.ready){this.movie.setHandCursor(enabled);}},setCSSEffects:function(enabled){this.cssEffects=!!enabled;},receiveEvent:function(eventName,args){var self;eventName=eventName.toString().toLowerCase().replace(/^on/,'');switch(eventName){case 'load':this.movie=document.getElementById(this.movieId);if(!this.movie){self=this;setTimeout(function(){self.receiveEvent('load',null);},1);return;}
if(!this.ready&&navigator.userAgent.match(/Firefox/)&&navigator.userAgent.match(/Windows/)){self=this;setTimeout(function(){self.receiveEvent('load',null);},100);this.ready=true;return;}
this.ready=true;this.movie.clearText();this.movie.appendText(this.clipText);this.movie.setFileName(this.fileName);this.movie.setAction(this.action);this.movie.setHandCursor(this.handCursorEnabled);break;case 'mouseover':if(this.domElement&&this.cssEffects){if(this.recoverActive){this.domElement.addClass('active');}}
break;case 'mouseout':if(this.domElement&&this.cssEffects){this.recoverActive=false;if(this.domElement.hasClass('active')){this.domElement.removeClass('active');this.recoverActive=true;}}
break;case 'mousedown':if(this.domElement&&this.cssEffects){this.domElement.addClass('active');}
break;case 'mouseup':if(this.domElement&&this.cssEffects){this.domElement.removeClass('active');this.recoverActive=false;}
break;}
if(this.handlers[eventName]){for(var idx=0,len=this.handlers[eventName].length;idx<len;idx++){var func=this.handlers[eventName][idx];if(typeof(func)=='function'){func(this,args);}
else if((typeof(func)=='object')&&(func.length==2)){func[0][func[1]](this,args);}
else if(typeof(func)=='string'){window[func](this,args);}}}}};ZeroClipboard_TableTools.hasFlash=function()
{try{var fo=new ActiveXObject('ShockwaveFlash.ShockwaveFlash');if(fo){return true;}}
catch(e){if(navigator.mimeTypes&&navigator.mimeTypes['application/x-shockwave-flash']!==undefined&&navigator.mimeTypes['application/x-shockwave-flash'].enabledPlugin){return true;}}
return false;};window.ZeroClipboard_TableTools=ZeroClipboard_TableTools;var _glue=function(flash,node)
{var id=node.attr('id');if(node.parents('html').length){flash.glue(node[0],'');}
else{setTimeout(function(){_glue(flash,node);},500);}};var _sheetname=function(config)
{var sheetName='Sheet1';if(config.sheetName){sheetName=config.sheetName.replace(/[\[\]\*\/\\\?\:]/g,'');}
return sheetName;};var _setText=function(flash,data)
{var parts=data.match(/[\s\S]{1,8192}/g)||[];flash.clearText();for(var i=0,len=parts.length;i<len;i++)
{flash.appendText(parts[i]);}};var _newLine=function(config)
{return config.newline?config.newline:navigator.userAgent.match(/Windows/)?'\r\n':'\n';};var _exportData=function(dt,config)
{var newLine=_newLine(config);var data=dt.buttons.exportData(config.exportOptions);var boundary=config.fieldBoundary;var separator=config.fieldSeparator;var reBoundary=new RegExp(boundary,'g');var escapeChar=config.escapeChar!==undefined?config.escapeChar:'\\';var join=function(a){var s='';for(var i=0,ien=a.length;i<ien;i++){if(i>0){s+=separator;}
s+=boundary?boundary+(''+a[i]).replace(reBoundary,escapeChar+boundary)+boundary:a[i];}
return s;};var header=config.header?join(data.header)+newLine:'';var footer=config.footer&&data.footer?newLine+join(data.footer):'';var body=[];for(var i=0,ien=data.body.length;i<ien;i++){body.push(join(data.body[i]));}
return{str:header+body.join(newLine)+footer,rows:body.length};};var flashButton={available:function(){return ZeroClipboard_TableTools.hasFlash();},init:function(dt,button,config){ZeroClipboard_TableTools.moviePath=DataTable.Buttons.swfPath;var flash=new ZeroClipboard_TableTools.Client();flash.setHandCursor(true);flash.addEventListener('mouseDown',function(client){config._fromFlash=true;dt.button(button[0]).trigger();config._fromFlash=false;});_glue(flash,button);config._flash=flash;},destroy:function(dt,button,config){config._flash.destroy();},fieldSeparator:',',fieldBoundary:'"',exportOptions:{},title:'*',messageTop:'*',messageBottom:'*',filename:'*',extension:'.csv',header:true,footer:false};function createCellPos(n){var ordA='A'.charCodeAt(0);var ordZ='Z'.charCodeAt(0);var len=ordZ-ordA+1;var s="";while(n>=0){s=String.fromCharCode(n%len+ordA)+s;n=Math.floor(n/len)-1;}
return s;}
function _createNode(doc,nodeName,opts){var tempNode=doc.createElement(nodeName);if(opts){if(opts.attr){$(tempNode).attr(opts.attr);}
if(opts.children){$.each(opts.children,function(key,value){tempNode.appendChild(value);});}
if(opts.text!==null&&opts.text!==undefined){tempNode.appendChild(doc.createTextNode(opts.text));}}
return tempNode;}
function _excelColWidth(data,col){var max=data.header[col].length;var len,lineSplit,str;if(data.footer&&data.footer[col].length>max){max=data.footer[col].length;}
for(var i=0,ien=data.body.length;i<ien;i++){var point=data.body[i][col];str=point!==null&&point!==undefined?point.toString():'';if(str.indexOf('\n')!==-1){lineSplit=str.split('\n');lineSplit.sort(function(a,b){return b.length-a.length;});len=lineSplit[0].length;}
else{len=str.length;}
if(len>max){max=len;}
if(max>40){return 52;}}
max*=1.3;return max>6?max:6;}
var _serialiser="";if(typeof window.XMLSerializer==='undefined'){_serialiser=new function(){this.serializeToString=function(input){return input.xml}};}else{_serialiser=new XMLSerializer();}
var _ieExcel;function _xlsxToStrings(obj){if(_ieExcel===undefined){_ieExcel=_serialiser.serializeToString($.parseXML(excelStrings['xl/worksheets/sheet1.xml'])).indexOf('xmlns:r')===-1;}
$.each(obj,function(name,val){if($.isPlainObject(val)){_xlsxToStrings(val);}
else{if(_ieExcel){var worksheet=val.childNodes[0];var i,ien;var attrs=[];for(i=worksheet.attributes.length-1;i>=0;i--){var attrName=worksheet.attributes[i].nodeName;var attrValue=worksheet.attributes[i].nodeValue;if(attrName.indexOf(':')!==-1){attrs.push({name:attrName,value:attrValue});worksheet.removeAttribute(attrName);}}
for(i=0,ien=attrs.length;i<ien;i++){var attr=val.createAttribute(attrs[i].name.replace(':','_dt_b_namespace_token_'));attr.value=attrs[i].value;worksheet.setAttributeNode(attr);}}
var str=_serialiser.serializeToString(val);if(_ieExcel){if(str.indexOf('<?xml')===-1){str='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+str;}
str=str.replace(/_dt_b_namespace_token_/g,':');}
str=str.replace(/<([^<>]*?) xmlns=""([^<>]*?)>/g,'<$1 $2>');obj[name]=str;}});}
var excelStrings={"_rels/.rels":'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'+
'<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>'+
'</Relationships>',"xl/_rels/workbook.xml.rels":'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'+
'<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>'+
'<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>'+
'</Relationships>',"[Content_Types].xml":'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
'<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'+
'<Default Extension="xml" ContentType="application/xml" />'+
'<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml" />'+
'<Default Extension="jpeg" ContentType="image/jpeg" />'+
'<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml" />'+
'<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml" />'+
'<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml" />'+
'</Types>',"xl/workbook.xml":'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
'<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'+
'<fileVersion appName="xl" lastEdited="5" lowestEdited="5" rupBuild="24816"/>'+
'<workbookPr showInkAnnotation="0" autoCompressPictures="0"/>'+
'<bookViews>'+
'<workbookView xWindow="0" yWindow="0" windowWidth="25600" windowHeight="19020" tabRatio="500"/>'+
'</bookViews>'+
'<sheets>'+
'<sheet name="" sheetId="1" r:id="rId1"/>'+
'</sheets>'+
'</workbook>',"xl/worksheets/sheet1.xml":'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
'<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac">'+
'<sheetData/>'+
'<mergeCells count="0"/>'+
'</worksheet>',"xl/styles.xml":'<?xml version="1.0" encoding="UTF-8"?>'+
'<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac">'+
'<numFmts count="6">'+
'<numFmt numFmtId="164" formatCode="#,##0.00_-\ [$$-45C]"/>'+
'<numFmt numFmtId="165" formatCode="&quot;£&quot;#,##0.00"/>'+
'<numFmt numFmtId="166" formatCode="[$€-2]\ #,##0.00"/>'+
'<numFmt numFmtId="167" formatCode="0.0%"/>'+
'<numFmt numFmtId="168" formatCode="#,##0;(#,##0)"/>'+
'<numFmt numFmtId="169" formatCode="#,##0.00;(#,##0.00)"/>'+
'</numFmts>'+
'<fonts count="5" x14ac:knownFonts="1">'+
'<font>'+
'<sz val="11" />'+
'<name val="Calibri" />'+
'</font>'+
'<font>'+
'<sz val="11" />'+
'<name val="Calibri" />'+
'<color rgb="FFFFFFFF" />'+
'</font>'+
'<font>'+
'<sz val="11" />'+
'<name val="Calibri" />'+
'<b />'+
'</font>'+
'<font>'+
'<sz val="11" />'+
'<name val="Calibri" />'+
'<i />'+
'</font>'+
'<font>'+
'<sz val="11" />'+
'<name val="Calibri" />'+
'<u />'+
'</font>'+
'</fonts>'+
'<fills count="6">'+
'<fill>'+
'<patternFill patternType="none" />'+
'</fill>'+
'<fill>'+
'<patternFill patternType="none" />'+
'</fill>'+
'<fill>'+
'<patternFill patternType="solid">'+
'<fgColor rgb="FFD9D9D9" />'+
'<bgColor indexed="64" />'+
'</patternFill>'+
'</fill>'+
'<fill>'+
'<patternFill patternType="solid">'+
'<fgColor rgb="FFD99795" />'+
'<bgColor indexed="64" />'+
'</patternFill>'+
'</fill>'+
'<fill>'+
'<patternFill patternType="solid">'+
'<fgColor rgb="ffc6efce" />'+
'<bgColor indexed="64" />'+
'</patternFill>'+
'</fill>'+
'<fill>'+
'<patternFill patternType="solid">'+
'<fgColor rgb="ffc6cfef" />'+
'<bgColor indexed="64" />'+
'</patternFill>'+
'</fill>'+
'</fills>'+
'<borders count="2">'+
'<border>'+
'<left />'+
'<right />'+
'<top />'+
'<bottom />'+
'<diagonal />'+
'</border>'+
'<border diagonalUp="false" diagonalDown="false">'+
'<left style="thin">'+
'<color auto="1" />'+
'</left>'+
'<right style="thin">'+
'<color auto="1" />'+
'</right>'+
'<top style="thin">'+
'<color auto="1" />'+
'</top>'+
'<bottom style="thin">'+
'<color auto="1" />'+
'</bottom>'+
'<diagonal />'+
'</border>'+
'</borders>'+
'<cellStyleXfs count="1">'+
'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" />'+
'</cellStyleXfs>'+
'<cellXfs count="61">'+
'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="1" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="2" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="3" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="4" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="0" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="1" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="2" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="3" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="4" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="0" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="1" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="2" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="3" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="4" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="0" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="1" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="2" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="3" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="4" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="0" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="1" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="2" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="3" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="4" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="0" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="1" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="2" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="3" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="4" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="0" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="1" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="2" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="3" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="4" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="0" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="1" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="2" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="3" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="4" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="0" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="1" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="2" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="3" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="4" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="0" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="1" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="2" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="3" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="4" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">'+
'<alignment horizontal="left"/>'+
'</xf>'+
'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">'+
'<alignment horizontal="center"/>'+
'</xf>'+
'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">'+
'<alignment horizontal="right"/>'+
'</xf>'+
'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">'+
'<alignment horizontal="fill"/>'+
'</xf>'+
'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">'+
'<alignment textRotation="90"/>'+
'</xf>'+
'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">'+
'<alignment wrapText="1"/>'+
'</xf>'+
'<xf numFmtId="9"   fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
'<xf numFmtId="164" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
'<xf numFmtId="165" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
'<xf numFmtId="166" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
'<xf numFmtId="167" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
'<xf numFmtId="168" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
'<xf numFmtId="169" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
'<xf numFmtId="3" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
'<xf numFmtId="4" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
'</cellXfs>'+
'<cellStyles count="1">'+
'<cellStyle name="Normal" xfId="0" builtinId="0" />'+
'</cellStyles>'+
'<dxfs count="0" />'+
'<tableStyles count="0" defaultTableStyle="TableStyleMedium9" defaultPivotStyle="PivotStyleMedium4" />'+
'</styleSheet>'};var _excelSpecials=[{match:/^\-?\d+\.\d%$/,style:60,fmt:function(d){return d/100;}},{match:/^\-?\d+\.?\d*%$/,style:56,fmt:function(d){return d/100;}},{match:/^\-?\$[\d,]+.?\d*$/,style:57},{match:/^\-?£[\d,]+.?\d*$/,style:58},{match:/^\-?€[\d,]+.?\d*$/,style:59},{match:/^\([\d,]+\)$/,style:61,fmt:function(d){return-1*d.replace(/[\(\)]/g,'');}},{match:/^\([\d,]+\.\d{2}\)$/,style:62,fmt:function(d){return-1*d.replace(/[\(\)]/g,'');}},{match:/^[\d,]+$/,style:63},{match:/^[\d,]+\.\d{2}$/,style:64}];DataTable.Buttons.swfPath='//cdn.datatables.net/buttons/'+DataTable.Buttons.version+'/swf/flashExport.swf';DataTable.Api.register('buttons.resize()',function(){$.each(ZeroClipboard_TableTools.clients,function(i,client){if(client.domElement!==undefined&&client.domElement.parentNode){client.positionElement();}});});DataTable.ext.buttons.copyFlash=$.extend({},flashButton,{className:'buttons-copy buttons-flash',text:function(dt){return dt.i18n('buttons.copy','Copy');},action:function(e,dt,button,config){if(!config._fromFlash){return;}
this.processing(true);var flash=config._flash;var exportData=_exportData(dt,config);var info=dt.buttons.exportInfo(config);var newline=_newLine(config);var output=exportData.str;if(info.title){output=info.title+newline+newline+output;}
if(info.messageTop){output=info.messageTop+newline+newline+output;}
if(info.messageBottom){output=output+newline+newline+info.messageBottom;}
if(config.customize){output=config.customize(output,config,dt);}
flash.setAction('copy');_setText(flash,output);this.processing(false);dt.buttons.info(dt.i18n('buttons.copyTitle','Copy to clipboard'),dt.i18n('buttons.copySuccess',{_:'Copied %d rows to clipboard',1:'Copied 1 row to clipboard'},data.rows),3000);},fieldSeparator:'\t',fieldBoundary:''});DataTable.ext.buttons.csvFlash=$.extend({},flashButton,{className:'buttons-csv buttons-flash',text:function(dt){return dt.i18n('buttons.csv','CSV');},action:function(e,dt,button,config){var flash=config._flash;var data=_exportData(dt,config);var info=dt.buttons.exportInfo(config);var output=config.customize?config.customize(data.str,config,dt):data.str;flash.setAction('csv');flash.setFileName(info.filename);_setText(flash,output);},escapeChar:'"'});DataTable.ext.buttons.excelFlash=$.extend({},flashButton,{className:'buttons-excel buttons-flash',text:function(dt){return dt.i18n('buttons.excel','Excel');},action:function(e,dt,button,config){this.processing(true);var flash=config._flash;var rowPos=0;var rels=$.parseXML(excelStrings['xl/worksheets/sheet1.xml']);var relsGet=rels.getElementsByTagName("sheetData")[0];var xlsx={_rels:{".rels":$.parseXML(excelStrings['_rels/.rels'])},xl:{_rels:{"workbook.xml.rels":$.parseXML(excelStrings['xl/_rels/workbook.xml.rels'])},"workbook.xml":$.parseXML(excelStrings['xl/workbook.xml']),"styles.xml":$.parseXML(excelStrings['xl/styles.xml']),"worksheets":{"sheet1.xml":rels}},"[Content_Types].xml":$.parseXML(excelStrings['[Content_Types].xml'])};var data=dt.buttons.exportData(config.exportOptions);var currentRow,rowNode;var addRow=function(row){currentRow=rowPos+1;rowNode=_createNode(rels,"row",{attr:{r:currentRow}});for(var i=0,ien=row.length;i<ien;i++){var cellId=createCellPos(i)+''+currentRow;var cell=null;if(row[i]===null||row[i]===undefined||row[i]===''){if(config.createEmptyCells===true){row[i]='';}
else{continue;}}
row[i]=typeof row[i].trim==='function'?row[i].trim():row[i];for(var j=0,jen=_excelSpecials.length;j<jen;j++){var special=_excelSpecials[j];if(row[i].match&&!row[i].match(/^0\d+/)&&row[i].match(special.match)){var val=row[i].replace(/[^\d\.\-]/g,'');if(special.fmt){val=special.fmt(val);}
cell=_createNode(rels,'c',{attr:{r:cellId,s:special.style},children:[_createNode(rels,'v',{text:val})]});break;}}
if(!cell){if(typeof row[i]==='number'||(row[i].match&&row[i].match(/^-?\d+(\.\d+)?$/)&&!row[i].match(/^0\d+/))){cell=_createNode(rels,'c',{attr:{t:'n',r:cellId},children:[_createNode(rels,'v',{text:row[i]})]});}
else{var text=!row[i].replace?row[i]:row[i].replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F-\x9F]/g,'');cell=_createNode(rels,'c',{attr:{t:'inlineStr',r:cellId},children:{row:_createNode(rels,'is',{children:{row:_createNode(rels,'t',{text:text})}})}});}}
rowNode.appendChild(cell);}
relsGet.appendChild(rowNode);rowPos++;};$('sheets sheet',xlsx.xl['workbook.xml']).attr('name',_sheetname(config));if(config.customizeData){config.customizeData(data);}
var mergeCells=function(row,colspan){var mergeCells=$('mergeCells',rels);mergeCells[0].appendChild(_createNode(rels,'mergeCell',{attr:{ref:'A'+row+':'+createCellPos(colspan)+row}}));mergeCells.attr('count',mergeCells.attr('count')+1);$('row:eq('+(row-1)+') c',rels).attr('s','51');};var exportInfo=dt.buttons.exportInfo(config);if(exportInfo.title){addRow([exportInfo.title],rowPos);mergeCells(rowPos,data.header.length-1);}
if(exportInfo.messageTop){addRow([exportInfo.messageTop],rowPos);mergeCells(rowPos,data.header.length-1);}
if(config.header){addRow(data.header,rowPos);$('row:last c',rels).attr('s','2');}
for(var n=0,ie=data.body.length;n<ie;n++){addRow(data.body[n],rowPos);}
if(config.footer&&data.footer){addRow(data.footer,rowPos);$('row:last c',rels).attr('s','2');}
if(exportInfo.messageBottom){addRow([exportInfo.messageBottom],rowPos);mergeCells(rowPos,data.header.length-1);}
var cols=_createNode(rels,'cols');$('worksheet',rels).prepend(cols);for(var i=0,ien=data.header.length;i<ien;i++){cols.appendChild(_createNode(rels,'col',{attr:{min:i+1,max:i+1,width:_excelColWidth(data,i),customWidth:1}}));}
if(config.customize){config.customize(xlsx,config,dt);}
_xlsxToStrings(xlsx);flash.setAction('excel');flash.setFileName(exportInfo.filename);flash.setSheetData(xlsx);_setText(flash,'');this.processing(false);},extension:'.xlsx',createEmptyCells:false});DataTable.ext.buttons.pdfFlash=$.extend({},flashButton,{className:'buttons-pdf buttons-flash',text:function(dt){return dt.i18n('buttons.pdf','PDF');},action:function(e,dt,button,config){this.processing(true);var flash=config._flash;var data=dt.buttons.exportData(config.exportOptions);var info=dt.buttons.exportInfo(config);var totalWidth=dt.table().node().offsetWidth;var ratios=dt.columns(config.columns).indexes().map(function(idx){return dt.column(idx).header().offsetWidth/totalWidth;});flash.setAction('pdf');flash.setFileName(info.filename);_setText(flash,JSON.stringify({title:info.title||'',messageTop:info.messageTop||'',messageBottom:info.messageBottom||'',colWidth:ratios.toArray(),orientation:config.orientation,size:config.pageSize,header:config.header?data.header:null,footer:config.footer?data.footer:null,body:data.body}));this.processing(false);},extension:'.pdf',orientation:'portrait',pageSize:'A4',newline:'\n'});return DataTable.Buttons;}));/*!
* HTML5 export buttons for Buttons and DataTables.
* 2016 SpryMedia Ltd - datatables.net/license
*
* FileSaver.js (1.3.3) - MIT license
* Copyright © 2016 Eli Grey - http://eligrey.com
*/(function(factory){if(typeof define==='function'&&define.amd){define(['jquery','datatables.net','datatables.net-buttons'],function($){return factory($,window,document);});}
else if(typeof exports==='object'){module.exports=function(root,$,jszip,pdfmake){if(!root){root=window;}
if(!$||!$.fn.dataTable){$=require('datatables.net')(root,$).$;}
if(!$.fn.dataTable.Buttons){require('datatables.net-buttons')(root,$);}
return factory($,root,root.document,jszip,pdfmake);};}
else{factory(jQuery,window,document);}}(function($,window,document,jszip,pdfmake,undefined){'use strict';var DataTable=$.fn.dataTable;function _jsZip(){return jszip||window.JSZip;}
function _pdfMake(){return pdfmake||window.pdfMake;}
DataTable.Buttons.pdfMake=function(_){if(!_){return _pdfMake();}
pdfmake=_;}
DataTable.Buttons.jszip=function(_){if(!_){return _jsZip();}
jszip=_;}
var _saveAs=(function(view){"use strict";if(typeof view==="undefined"||typeof navigator!=="undefined"&&/MSIE [1-9]\./.test(navigator.userAgent)){return;}
var
doc=view.document,get_URL=function(){return view.URL||view.webkitURL||view;},save_link=doc.createElementNS("http://www.w3.org/1999/xhtml","a"),can_use_save_link="download"in save_link,click=function(node){var event=new MouseEvent("click");node.dispatchEvent(event);},is_safari=/constructor/i.test(view.HTMLElement)||view.safari,is_chrome_ios=/CriOS\/[\d]+/.test(navigator.userAgent),throw_outside=function(ex){(view.setImmediate||view.setTimeout)(function(){throw ex;},0);},force_saveable_type="application/octet-stream",arbitrary_revoke_timeout=1000*40,revoke=function(file){var revoker=function(){if(typeof file==="string"){get_URL().revokeObjectURL(file);}else{file.remove();}};setTimeout(revoker,arbitrary_revoke_timeout);},dispatch=function(filesaver,event_types,event){event_types=[].concat(event_types);var i=event_types.length;while(i--){var listener=filesaver["on"+event_types[i]];if(typeof listener==="function"){try{listener.call(filesaver,event||filesaver);}catch(ex){throw_outside(ex);}}}},auto_bom=function(blob){if(/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)){return new Blob([String.fromCharCode(0xFEFF),blob],{type:blob.type});}
return blob;},FileSaver=function(blob,name,no_auto_bom){if(!no_auto_bom){blob=auto_bom(blob);}
var
filesaver=this,type=blob.type,force=type===force_saveable_type,object_url,dispatch_all=function(){dispatch(filesaver,"writestart progress write writeend".split(" "));},fs_error=function(){if((is_chrome_ios||(force&&is_safari))&&view.FileReader){var reader=new FileReader();reader.onloadend=function(){var url=is_chrome_ios?reader.result:reader.result.replace(/^data:[^;]*;/,'data:attachment/file;');var popup=view.open(url,'_blank');if(!popup)view.location.href=url;url=undefined;filesaver.readyState=filesaver.DONE;dispatch_all();};reader.readAsDataURL(blob);filesaver.readyState=filesaver.INIT;return;}
if(!object_url){object_url=get_URL().createObjectURL(blob);}
if(force){view.location.href=object_url;}else{var opened=view.open(object_url,"_blank");if(!opened){view.location.href=object_url;}}
filesaver.readyState=filesaver.DONE;dispatch_all();revoke(object_url);};filesaver.readyState=filesaver.INIT;if(can_use_save_link){object_url=get_URL().createObjectURL(blob);setTimeout(function(){save_link.href=object_url;save_link.download=name;click(save_link);dispatch_all();revoke(object_url);filesaver.readyState=filesaver.DONE;});return;}
fs_error();},FS_proto=FileSaver.prototype,saveAs=function(blob,name,no_auto_bom){return new FileSaver(blob,name||blob.name||"download",no_auto_bom);};if(typeof navigator!=="undefined"&&navigator.msSaveOrOpenBlob){return function(blob,name,no_auto_bom){name=name||blob.name||"download";if(!no_auto_bom){blob=auto_bom(blob);}
return navigator.msSaveOrOpenBlob(blob,name);};}
FS_proto.abort=function(){};FS_proto.readyState=FS_proto.INIT=0;FS_proto.WRITING=1;FS_proto.DONE=2;FS_proto.error=FS_proto.onwritestart=FS_proto.onprogress=FS_proto.onwrite=FS_proto.onabort=FS_proto.onerror=FS_proto.onwriteend=null;return saveAs;}(typeof self!=="undefined"&&self||typeof window!=="undefined"&&window||this.content));DataTable.fileSave=_saveAs;var _sheetname=function(config)
{var sheetName='Sheet1';if(config.sheetName){sheetName=config.sheetName.replace(/[\[\]\*\/\\\?\:]/g,'');}
return sheetName;};var _newLine=function(config)
{return config.newline?config.newline:navigator.userAgent.match(/Windows/)?'\r\n':'\n';};var _exportData=function(dt,config)
{var newLine=_newLine(config);var data=dt.buttons.exportData(config.exportOptions);var boundary=config.fieldBoundary;var separator=config.fieldSeparator;var reBoundary=new RegExp(boundary,'g');var escapeChar=config.escapeChar!==undefined?config.escapeChar:'\\';var join=function(a){var s='';for(var i=0,ien=a.length;i<ien;i++){if(i>0){s+=separator;}
s+=boundary?boundary+(''+a[i]).replace(reBoundary,escapeChar+boundary)+boundary:a[i];}
return s;};var header=config.header?join(data.header)+newLine:'';var footer=config.footer&&data.footer?newLine+join(data.footer):'';var body=[];for(var i=0,ien=data.body.length;i<ien;i++){body.push(join(data.body[i]));}
return{str:header+body.join(newLine)+footer,rows:body.length};};var _isDuffSafari=function()
{var safari=navigator.userAgent.indexOf('Safari')!==-1&&navigator.userAgent.indexOf('Chrome')===-1&&navigator.userAgent.indexOf('Opera')===-1;if(!safari){return false;}
var version=navigator.userAgent.match(/AppleWebKit\/(\d+\.\d+)/);if(version&&version.length>1&&version[1]*1<603.1){return true;}
return false;};function createCellPos(n){var ordA='A'.charCodeAt(0);var ordZ='Z'.charCodeAt(0);var len=ordZ-ordA+1;var s="";while(n>=0){s=String.fromCharCode(n%len+ordA)+s;n=Math.floor(n/len)-1;}
return s;}
try{var _serialiser=new XMLSerializer();var _ieExcel;}
catch(t){}
function _addToZip(zip,obj){if(_ieExcel===undefined){_ieExcel=_serialiser.serializeToString((new window.DOMParser()).parseFromString(excelStrings['xl/worksheets/sheet1.xml'],'text/xml')).indexOf('xmlns:r')===-1;}
$.each(obj,function(name,val){if($.isPlainObject(val)){var newDir=zip.folder(name);_addToZip(newDir,val);}
else{if(_ieExcel){var worksheet=val.childNodes[0];var i,ien;var attrs=[];for(i=worksheet.attributes.length-1;i>=0;i--){var attrName=worksheet.attributes[i].nodeName;var attrValue=worksheet.attributes[i].nodeValue;if(attrName.indexOf(':')!==-1){attrs.push({name:attrName,value:attrValue});worksheet.removeAttribute(attrName);}}
for(i=0,ien=attrs.length;i<ien;i++){var attr=val.createAttribute(attrs[i].name.replace(':','_dt_b_namespace_token_'));attr.value=attrs[i].value;worksheet.setAttributeNode(attr);}}
var str=_serialiser.serializeToString(val);if(_ieExcel){if(str.indexOf('<?xml')===-1){str='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+str;}
str=str.replace(/_dt_b_namespace_token_/g,':');str=str.replace(/xmlns:NS[\d]+="" NS[\d]+:/g,'');}
str=str.replace(/<([^<>]*?) xmlns=""([^<>]*?)>/g,'<$1 $2>');zip.file(name,str);}});}
function _createNode(doc,nodeName,opts){var tempNode=doc.createElement(nodeName);if(opts){if(opts.attr){$(tempNode).attr(opts.attr);}
if(opts.children){$.each(opts.children,function(key,value){tempNode.appendChild(value);});}
if(opts.text!==null&&opts.text!==undefined){tempNode.appendChild(doc.createTextNode(opts.text));}}
return tempNode;}
function _excelColWidth(data,col){var max=data.header[col].length;var len,lineSplit,str;if(data.footer&&data.footer[col].length>max){max=data.footer[col].length;}
for(var i=0,ien=data.body.length;i<ien;i++){var point=data.body[i][col];str=point!==null&&point!==undefined?point.toString():'';if(str.indexOf('\n')!==-1){lineSplit=str.split('\n');lineSplit.sort(function(a,b){return b.length-a.length;});len=lineSplit[0].length;}
else{len=str.length;}
if(len>max){max=len;}
if(max>40){return 54;}}
max*=1.35;return max>6?max:6;}
var excelStrings={"_rels/.rels":'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'+
'<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>'+
'</Relationships>',"xl/_rels/workbook.xml.rels":'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'+
'<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>'+
'<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>'+
'</Relationships>',"[Content_Types].xml":'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
'<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'+
'<Default Extension="xml" ContentType="application/xml" />'+
'<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml" />'+
'<Default Extension="jpeg" ContentType="image/jpeg" />'+
'<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml" />'+
'<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml" />'+
'<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml" />'+
'</Types>',"xl/workbook.xml":'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
'<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'+
'<fileVersion appName="xl" lastEdited="5" lowestEdited="5" rupBuild="24816"/>'+
'<workbookPr showInkAnnotation="0" autoCompressPictures="0"/>'+
'<bookViews>'+
'<workbookView xWindow="0" yWindow="0" windowWidth="25600" windowHeight="19020" tabRatio="500"/>'+
'</bookViews>'+
'<sheets>'+
'<sheet name="Sheet1" sheetId="1" r:id="rId1"/>'+
'</sheets>'+
'<definedNames/>'+
'</workbook>',"xl/worksheets/sheet1.xml":'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
'<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac">'+
'<sheetData/>'+
'<mergeCells count="0"/>'+
'</worksheet>',"xl/styles.xml":'<?xml version="1.0" encoding="UTF-8"?>'+
'<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac">'+
'<numFmts count="6">'+
'<numFmt numFmtId="164" formatCode="#,##0.00_-\ [$$-45C]"/>'+
'<numFmt numFmtId="165" formatCode="&quot;£&quot;#,##0.00"/>'+
'<numFmt numFmtId="166" formatCode="[$€-2]\ #,##0.00"/>'+
'<numFmt numFmtId="167" formatCode="0.0%"/>'+
'<numFmt numFmtId="168" formatCode="#,##0;(#,##0)"/>'+
'<numFmt numFmtId="169" formatCode="#,##0.00;(#,##0.00)"/>'+
'</numFmts>'+
'<fonts count="5" x14ac:knownFonts="1">'+
'<font>'+
'<sz val="11" />'+
'<name val="Calibri" />'+
'</font>'+
'<font>'+
'<sz val="11" />'+
'<name val="Calibri" />'+
'<color rgb="FFFFFFFF" />'+
'</font>'+
'<font>'+
'<sz val="11" />'+
'<name val="Calibri" />'+
'<b />'+
'</font>'+
'<font>'+
'<sz val="11" />'+
'<name val="Calibri" />'+
'<i />'+
'</font>'+
'<font>'+
'<sz val="11" />'+
'<name val="Calibri" />'+
'<u />'+
'</font>'+
'</fonts>'+
'<fills count="6">'+
'<fill>'+
'<patternFill patternType="none" />'+
'</fill>'+
'<fill>'+
'<patternFill patternType="none" />'+
'</fill>'+
'<fill>'+
'<patternFill patternType="solid">'+
'<fgColor rgb="FFD9D9D9" />'+
'<bgColor indexed="64" />'+
'</patternFill>'+
'</fill>'+
'<fill>'+
'<patternFill patternType="solid">'+
'<fgColor rgb="FFD99795" />'+
'<bgColor indexed="64" />'+
'</patternFill>'+
'</fill>'+
'<fill>'+
'<patternFill patternType="solid">'+
'<fgColor rgb="ffc6efce" />'+
'<bgColor indexed="64" />'+
'</patternFill>'+
'</fill>'+
'<fill>'+
'<patternFill patternType="solid">'+
'<fgColor rgb="ffc6cfef" />'+
'<bgColor indexed="64" />'+
'</patternFill>'+
'</fill>'+
'</fills>'+
'<borders count="2">'+
'<border>'+
'<left />'+
'<right />'+
'<top />'+
'<bottom />'+
'<diagonal />'+
'</border>'+
'<border diagonalUp="false" diagonalDown="false">'+
'<left style="thin">'+
'<color auto="1" />'+
'</left>'+
'<right style="thin">'+
'<color auto="1" />'+
'</right>'+
'<top style="thin">'+
'<color auto="1" />'+
'</top>'+
'<bottom style="thin">'+
'<color auto="1" />'+
'</bottom>'+
'<diagonal />'+
'</border>'+
'</borders>'+
'<cellStyleXfs count="1">'+
'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" />'+
'</cellStyleXfs>'+
'<cellXfs count="68">'+
'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="1" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="2" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="3" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="4" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="0" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="1" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="2" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="3" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="4" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="0" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="1" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="2" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="3" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="4" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="0" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="1" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="2" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="3" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="4" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="0" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="1" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="2" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="3" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="4" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="0" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="1" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="2" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="3" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="4" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="0" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="1" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="2" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="3" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="4" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="0" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="1" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="2" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="3" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="4" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="0" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="1" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="2" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="3" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="4" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="0" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="1" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="2" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="3" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="4" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/>'+
'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">'+
'<alignment horizontal="left"/>'+
'</xf>'+
'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">'+
'<alignment horizontal="center"/>'+
'</xf>'+
'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">'+
'<alignment horizontal="right"/>'+
'</xf>'+
'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">'+
'<alignment horizontal="fill"/>'+
'</xf>'+
'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">'+
'<alignment textRotation="90"/>'+
'</xf>'+
'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1">'+
'<alignment wrapText="1"/>'+
'</xf>'+
'<xf numFmtId="9"   fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
'<xf numFmtId="164" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
'<xf numFmtId="165" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
'<xf numFmtId="166" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
'<xf numFmtId="167" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
'<xf numFmtId="168" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
'<xf numFmtId="169" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
'<xf numFmtId="3" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
'<xf numFmtId="4" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
'<xf numFmtId="1" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
'<xf numFmtId="2" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
'<xf numFmtId="14" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>'+
'</cellXfs>'+
'<cellStyles count="1">'+
'<cellStyle name="Normal" xfId="0" builtinId="0" />'+
'</cellStyles>'+
'<dxfs count="0" />'+
'<tableStyles count="0" defaultTableStyle="TableStyleMedium9" defaultPivotStyle="PivotStyleMedium4" />'+
'</styleSheet>'};var _excelSpecials=[{match:/^\-?\d+\.\d%$/,style:60,fmt:function(d){return d/100;}},{match:/^\-?\d+\.?\d*%$/,style:56,fmt:function(d){return d/100;}},{match:/^\-?\$[\d,]+.?\d*$/,style:57},{match:/^\-?£[\d,]+.?\d*$/,style:58},{match:/^\-?€[\d,]+.?\d*$/,style:59},{match:/^\-?\d+$/,style:65},{match:/^\-?\d+\.\d{2}$/,style:66},{match:/^\([\d,]+\)$/,style:61,fmt:function(d){return-1*d.replace(/[\(\)]/g,'');}},{match:/^\([\d,]+\.\d{2}\)$/,style:62,fmt:function(d){return-1*d.replace(/[\(\)]/g,'');}},{match:/^\-?[\d,]+$/,style:63},{match:/^\-?[\d,]+\.\d{2}$/,style:64},{match:/^[\d]{4}\-[\d]{2}\-[\d]{2}$/,style:67,fmt:function(d){return Math.round(25569+(Date.parse(d)/(86400*1000)));}}];DataTable.ext.buttons.copyHtml5={className:'buttons-copy buttons-html5',text:function(dt){return dt.i18n('buttons.copy','Copy');},action:function(e,dt,button,config){this.processing(true);var that=this;var exportData=_exportData(dt,config);var info=dt.buttons.exportInfo(config);var newline=_newLine(config);var output=exportData.str;var hiddenDiv=$('<div/>').css({height:1,width:1,overflow:'hidden',position:'fixed',top:0,left:0});if(info.title){output=info.title+newline+newline+output;}
if(info.messageTop){output=info.messageTop+newline+newline+output;}
if(info.messageBottom){output=output+newline+newline+info.messageBottom;}
if(config.customize){output=config.customize(output,config,dt);}
var textarea=$('<textarea readonly/>').val(output).appendTo(hiddenDiv);if(document.queryCommandSupported('copy')){hiddenDiv.appendTo(dt.table().container());textarea[0].focus();textarea[0].select();try{var successful=document.execCommand('copy');hiddenDiv.remove();if(successful){dt.buttons.info(dt.i18n('buttons.copyTitle','Copy to clipboard'),dt.i18n('buttons.copySuccess',{1:'Copied one row to clipboard',_:'Copied %d rows to clipboard'},exportData.rows),2000);this.processing(false);return;}}
catch(t){}}
var message=$('<span>'+dt.i18n('buttons.copyKeys','Press <i>ctrl</i> or <i>\u2318</i> + <i>C</i> to copy the table data<br>to your system clipboard.<br><br>'+
'To cancel, click this message or press escape.')+'</span>').append(hiddenDiv);dt.buttons.info(dt.i18n('buttons.copyTitle','Copy to clipboard'),message,0);textarea[0].focus();textarea[0].select();var container=$(message).closest('.dt-button-info');var close=function(){container.off('click.buttons-copy');$(document).off('.buttons-copy');dt.buttons.info(false);};container.on('click.buttons-copy',close);$(document).on('keydown.buttons-copy',function(e){if(e.keyCode===27){close();that.processing(false);}}).on('copy.buttons-copy cut.buttons-copy',function(){close();that.processing(false);});},exportOptions:{},fieldSeparator:'\t',fieldBoundary:'',header:true,footer:false,title:'*',messageTop:'*',messageBottom:'*'};DataTable.ext.buttons.csvHtml5={bom:false,className:'buttons-csv buttons-html5',available:function(){return window.FileReader!==undefined&&window.Blob;},text:function(dt){return dt.i18n('buttons.csv','CSV');},action:function(e,dt,button,config){this.processing(true);var output=_exportData(dt,config).str;var info=dt.buttons.exportInfo(config);var charset=config.charset;if(config.customize){output=config.customize(output,config,dt);}
if(charset!==false){if(!charset){charset=document.characterSet||document.charset;}
if(charset){charset=';charset='+charset;}}
else{charset='';}
if(config.bom){output=String.fromCharCode(0xFEFF)+output;}
_saveAs(new Blob([output],{type:'text/csv'+charset}),info.filename,true);this.processing(false);},filename:'*',extension:'.csv',exportOptions:{},fieldSeparator:',',fieldBoundary:'"',escapeChar:'"',charset:null,header:true,footer:false};DataTable.ext.buttons.excelHtml5={className:'buttons-excel buttons-html5',available:function(){return window.FileReader!==undefined&&_jsZip()!==undefined&&!_isDuffSafari()&&_serialiser;},text:function(dt){return dt.i18n('buttons.excel','Excel');},action:function(e,dt,button,config){this.processing(true);var that=this;var rowPos=0;var dataStartRow,dataEndRow;var getXml=function(type){var str=excelStrings[type];return $.parseXML(str);};var rels=getXml('xl/worksheets/sheet1.xml');var relsGet=rels.getElementsByTagName("sheetData")[0];var xlsx={_rels:{".rels":getXml('_rels/.rels')},xl:{_rels:{"workbook.xml.rels":getXml('xl/_rels/workbook.xml.rels')},"workbook.xml":getXml('xl/workbook.xml'),"styles.xml":getXml('xl/styles.xml'),"worksheets":{"sheet1.xml":rels}},"[Content_Types].xml":getXml('[Content_Types].xml')};var data=dt.buttons.exportData(config.exportOptions);var currentRow,rowNode;var addRow=function(row){currentRow=rowPos+1;rowNode=_createNode(rels,"row",{attr:{r:currentRow}});for(var i=0,ien=row.length;i<ien;i++){var cellId=createCellPos(i)+''+currentRow;var cell=null;if(row[i]===null||row[i]===undefined||row[i]===''){if(config.createEmptyCells===true){row[i]='';}
else{continue;}}
var originalContent=row[i];row[i]=typeof row[i].trim==='function'?row[i].trim():row[i];for(var j=0,jen=_excelSpecials.length;j<jen;j++){var special=_excelSpecials[j];if(row[i].match&&!row[i].match(/^0\d+/)&&row[i].match(special.match)){var val=row[i].replace(/[^\d\.\-]/g,'');if(special.fmt){val=special.fmt(val);}
cell=_createNode(rels,'c',{attr:{r:cellId,s:special.style},children:[_createNode(rels,'v',{text:val})]});break;}}
if(!cell){if(typeof row[i]==='number'||(row[i].match&&row[i].match(/^-?\d+(\.\d+)?$/)&&!row[i].match(/^0\d+/))){cell=_createNode(rels,'c',{attr:{t:'n',r:cellId},children:[_createNode(rels,'v',{text:row[i]})]});}
else{var text=!originalContent.replace?originalContent:originalContent.replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F-\x9F]/g,'');cell=_createNode(rels,'c',{attr:{t:'inlineStr',r:cellId},children:{row:_createNode(rels,'is',{children:{row:_createNode(rels,'t',{text:text,attr:{'xml:space':'preserve'}})}})}});}}
rowNode.appendChild(cell);}
relsGet.appendChild(rowNode);rowPos++;};if(config.customizeData){config.customizeData(data);}
var mergeCells=function(row,colspan){var mergeCells=$('mergeCells',rels);mergeCells[0].appendChild(_createNode(rels,'mergeCell',{attr:{ref:'A'+row+':'+createCellPos(colspan)+row}}));mergeCells.attr('count',parseFloat(mergeCells.attr('count'))+1);$('row:eq('+(row-1)+') c',rels).attr('s','51');};var exportInfo=dt.buttons.exportInfo(config);if(exportInfo.title){addRow([exportInfo.title],rowPos);mergeCells(rowPos,data.header.length-1);}
if(exportInfo.messageTop){addRow([exportInfo.messageTop],rowPos);mergeCells(rowPos,data.header.length-1);}
if(config.header){addRow(data.header,rowPos);$('row:last c',rels).attr('s','2');}
dataStartRow=rowPos;for(var n=0,ie=data.body.length;n<ie;n++){addRow(data.body[n],rowPos);}
dataEndRow=rowPos;if(config.footer&&data.footer){addRow(data.footer,rowPos);$('row:last c',rels).attr('s','2');}
if(exportInfo.messageBottom){addRow([exportInfo.messageBottom],rowPos);mergeCells(rowPos,data.header.length-1);}
var cols=_createNode(rels,'cols');$('worksheet',rels).prepend(cols);for(var i=0,ien=data.header.length;i<ien;i++){cols.appendChild(_createNode(rels,'col',{attr:{min:i+1,max:i+1,width:_excelColWidth(data,i),customWidth:1}}));}
var workbook=xlsx.xl['workbook.xml'];$('sheets sheet',workbook).attr('name',_sheetname(config));if(config.autoFilter){$('mergeCells',rels).before(_createNode(rels,'autoFilter',{attr:{ref:'A'+dataStartRow+':'+createCellPos(data.header.length-1)+dataEndRow}}));$('definedNames',workbook).append(_createNode(workbook,'definedName',{attr:{name:'_xlnm._FilterDatabase',localSheetId:'0',hidden:1},text:_sheetname(config)+'!$A$'+dataStartRow+':'+createCellPos(data.header.length-1)+dataEndRow}));}
if(config.customize){config.customize(xlsx,config,dt);}
if($('mergeCells',rels).children().length===0){$('mergeCells',rels).remove();}
var jszip=_jsZip();var zip=new jszip();var zipConfig={type:'blob',mimeType:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'};_addToZip(zip,xlsx);if(zip.generateAsync){zip.generateAsync(zipConfig).then(function(blob){_saveAs(blob,exportInfo.filename);that.processing(false);});}
else{_saveAs(zip.generate(zipConfig),exportInfo.filename);this.processing(false);}},filename:'*',extension:'.xlsx',exportOptions:{},header:true,footer:false,title:'*',messageTop:'*',messageBottom:'*',createEmptyCells:false,autoFilter:false,sheetName:''};DataTable.ext.buttons.pdfHtml5={className:'buttons-pdf buttons-html5',available:function(){return window.FileReader!==undefined&&_pdfMake();},text:function(dt){return dt.i18n('buttons.pdf','PDF');},action:function(e,dt,button,config){this.processing(true);var that=this;var data=dt.buttons.exportData(config.exportOptions);var info=dt.buttons.exportInfo(config);var rows=[];if(config.header){rows.push($.map(data.header,function(d){return{text:typeof d==='string'?d:d+'',style:'tableHeader'};}));}
for(var i=0,ien=data.body.length;i<ien;i++){rows.push($.map(data.body[i],function(d){if(d===null||d===undefined){d='';}
return{text:typeof d==='string'?d:d+'',style:i%2?'tableBodyEven':'tableBodyOdd'};}));}
if(config.footer&&data.footer){rows.push($.map(data.footer,function(d){return{text:typeof d==='string'?d:d+'',style:'tableFooter'};}));}
var doc={pageSize:config.pageSize,pageOrientation:config.orientation,content:[{table:{headerRows:1,body:rows},layout:'noBorders'}],styles:{tableHeader:{bold:true,fontSize:11,color:'white',fillColor:'#2d4154',alignment:'center'},tableBodyEven:{},tableBodyOdd:{fillColor:'#f3f3f3'},tableFooter:{bold:true,fontSize:11,color:'white',fillColor:'#2d4154'},title:{alignment:'center',fontSize:15},message:{}},defaultStyle:{fontSize:10}};if(info.messageTop){doc.content.unshift({text:info.messageTop,style:'message',margin:[0,0,0,12]});}
if(info.messageBottom){doc.content.push({text:info.messageBottom,style:'message',margin:[0,0,0,12]});}
if(info.title){doc.content.unshift({text:info.title,style:'title',margin:[0,0,0,12]});}
if(config.customize){config.customize(doc,config,dt);}
var pdf=_pdfMake().createPdf(doc);if(config.download==='open'&&!_isDuffSafari()){pdf.open();}
else{pdf.download(info.filename);}
this.processing(false);},title:'*',filename:'*',extension:'.pdf',exportOptions:{},orientation:'portrait',pageSize:'A4',header:true,footer:false,messageTop:'*',messageBottom:'*',customize:null,download:'download'};return DataTable.Buttons;}));/*!
* Print button for Buttons and DataTables.
* 2016 SpryMedia Ltd - datatables.net/license
*/(function(factory){if(typeof define==='function'&&define.amd){define(['jquery','datatables.net','datatables.net-buttons'],function($){return factory($,window,document);});}
else if(typeof exports==='object'){module.exports=function(root,$){if(!root){root=window;}
if(!$||!$.fn.dataTable){$=require('datatables.net')(root,$).$;}
if(!$.fn.dataTable.Buttons){require('datatables.net-buttons')(root,$);}
return factory($,root,root.document);};}
else{factory(jQuery,window,document);}}(function($,window,document,undefined){'use strict';var DataTable=$.fn.dataTable;var _link=document.createElement('a');var _styleToAbs=function(el){var url;var clone=$(el).clone()[0];var linkHost;if(clone.nodeName.toLowerCase()==='link'){clone.href=_relToAbs(clone.href);}
return clone.outerHTML;};var _relToAbs=function(href){_link.href=href;var linkHost=_link.host;if(linkHost.indexOf('/')===-1&&_link.pathname.indexOf('/')!==0){linkHost+='/';}
return _link.protocol+"//"+linkHost+_link.pathname+_link.search;};DataTable.ext.buttons.print={className:'buttons-print',text:function(dt){return dt.i18n('buttons.print','Print');},action:function(e,dt,button,config){var data=dt.buttons.exportData($.extend({decodeEntities:false},config.exportOptions));var exportInfo=dt.buttons.exportInfo(config);var columnClasses=dt.columns(config.exportOptions.columns).flatten().map(function(idx){return dt.settings()[0].aoColumns[dt.column(idx).index()].sClass;}).toArray();var addRow=function(d,tag){var str='<tr>';for(var i=0,ien=d.length;i<ien;i++){var dataOut=d[i]===null||d[i]===undefined?'':d[i];var classAttr=columnClasses[i]?'class="'+columnClasses[i]+'"':'';str+='<'+tag+' '+classAttr+'>'+dataOut+'</'+tag+'>';}
return str+'</tr>';};var html='<table class="'+dt.table().node().className+'">';if(config.header){html+='<thead>'+addRow(data.header,'th')+'</thead>';}
html+='<tbody>';for(var i=0,ien=data.body.length;i<ien;i++){html+=addRow(data.body[i],'td');}
html+='</tbody>';if(config.footer&&data.footer){html+='<tfoot>'+addRow(data.footer,'th')+'</tfoot>';}
html+='</table>';var win=window.open('','');if(!win){dt.buttons.info(dt.i18n('buttons.printErrorTitle','Unable to open print view'),dt.i18n('buttons.printErrorMsg','Please allow popups in your browser for this site to be able to view the print view.'),5000);return;}
win.document.close();var head='<title>'+exportInfo.title+'</title>';$('style, link').each(function(){head+=_styleToAbs(this);});try{win.document.head.innerHTML=head;}
catch(e){$(win.document.head).html(head);}
win.document.body.innerHTML='<h1>'+exportInfo.title+'</h1>'+
'<div>'+(exportInfo.messageTop||'')+'</div>'+
html+
'<div>'+(exportInfo.messageBottom||'')+'</div>';$(win.document.body).addClass('dt-print-view');$('img',win.document.body).each(function(i,img){img.setAttribute('src',_relToAbs(img.getAttribute('src')));});if(config.customize){config.customize(win,config,dt);}
var autoPrint=function(){if(config.autoPrint){win.print();win.close();}};if(navigator.userAgent.match(/Trident\/\d.\d/)){autoPrint();}
else{win.setTimeout(autoPrint,1000);}},title:'*',messageTop:'*',messageBottom:'*',exportOptions:{},header:true,footer:false,autoPrint:true,customize:null};return DataTable.Buttons;}));/*!
Copyright 2010-2021 SpryMedia Ltd.
This source file is free software, available under the following license:
MIT license - http://datatables.net/license/mit
This source file is distributed in the hope that it will be useful, but
WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
For details please refer to: http://www.datatables.net
ColReorder 1.5.5
©2010-2021 SpryMedia Ltd - datatables.net/license
*/(function(e){"function"===typeof define&&define.amd?define(["jquery","datatables.net"],function(u){return e(u,window,document)}):"object"===typeof exports?module.exports=function(u,t){u||(u=window);t&&t.fn.dataTable||(t=require("datatables.net")(u,t).$);return e(t,u,u.document)}:e(jQuery,window,document)})(function(e,u,t,z){function y(a){for(var b=[],c=0,f=a.length;c<f;c++)b[a[c]]=c;return b}function v(a,b,c){b=a.splice(b,1)[0];a.splice(c,0,b)}function A(a,b,c){for(var f=[],h=0,g=a.childNodes.length;h<g;h++)1==a.childNodes[h].nodeType&&f.push(a.childNodes[h]);b=f[b];null!==c?a.insertBefore(b,f[c]):a.appendChild(b)}var D=e.fn.dataTable;e.fn.dataTableExt.oApi.fnColReorder=function(a,b,c,f,h){var g,l,k=a.aoColumns.length;var p=function(w,x,E){if(w[x]&&"function"!==typeof w[x]){var B=w[x].split("."),C=B.shift();isNaN(1*C)||(w[x]=E[1*C]+"."+B.join("."))}};if(b!=c)if(0>b||b>=k)this.oApi._fnLog(a,1,"ColReorder 'from' index is out of bounds: "+b);else if(0>c||c>=k)this.oApi._fnLog(a,1,"ColReorder 'to' index is out of bounds: "+
c);else{var m=[];var d=0;for(g=k;d<g;d++)m[d]=d;v(m,b,c);var q=y(m);d=0;for(g=a.aaSorting.length;d<g;d++)a.aaSorting[d][0]=q[a.aaSorting[d][0]];if(null!==a.aaSortingFixed)for(d=0,g=a.aaSortingFixed.length;d<g;d++)a.aaSortingFixed[d][0]=q[a.aaSortingFixed[d][0]];d=0;for(g=k;d<g;d++){var n=a.aoColumns[d];m=0;for(l=n.aDataSort.length;m<l;m++)n.aDataSort[m]=q[n.aDataSort[m]];n.idx=q[n.idx]}e.each(a.aLastSort,function(w,x){a.aLastSort[w].src=q[x.src]});d=0;for(g=k;d<g;d++)n=a.aoColumns[d],"number"==typeof n.mData?n.mData=q[n.mData]:e.isPlainObject(n.mData)&&(p(n.mData,"_",q),p(n.mData,"filter",q),p(n.mData,"sort",q),p(n.mData,"type",q));if(a.aoColumns[b].bVisible){p=this.oApi._fnColumnIndexToVisible(a,b);l=null;for(d=c<b?c:c+1;null===l&&d<k;)l=this.oApi._fnColumnIndexToVisible(a,d),d++;m=a.nTHead.getElementsByTagName("tr");d=0;for(g=m.length;d<g;d++)A(m[d],p,l);if(null!==a.nTFoot)for(m=a.nTFoot.getElementsByTagName("tr"),d=0,g=m.length;d<g;d++)A(m[d],p,l);d=0;for(g=a.aoData.length;d<g;d++)null!==a.aoData[d].nTr&&A(a.aoData[d].nTr,p,l)}v(a.aoColumns,b,c);d=0;for(g=k;d<g;d++)a.oApi._fnColumnOptions(a,d,{});v(a.aoPreSearchCols,b,c);d=0;for(g=a.aoData.length;d<g;d++){l=a.aoData[d];if(n=l.anCells)for(v(n,b,c),m=0,p=n.length;m<p;m++)n[m]&&n[m]._DT_CellIndex&&(n[m]._DT_CellIndex.column=m);"dom"!==l.src&&Array.isArray(l._aData)&&v(l._aData,b,c)}d=0;for(g=a.aoHeader.length;d<g;d++)v(a.aoHeader[d],b,c);if(null!==a.aoFooter)for(d=0,g=a.aoFooter.length;d<g;d++)v(a.aoFooter[d],b,c);(h||h===z)&&e.fn.dataTable.Api(a).rows().invalidate();d=0;for(g=k;d<g;d++)e(a.aoColumns[d].nTh).off(".DT"),this.oApi._fnSortAttachListener(a,a.aoColumns[d].nTh,d);e(a.oInstance).trigger("column-reorder.dt",[a,{from:b,to:c,mapping:q,drop:f,iFrom:b,iTo:c,aiInvertMapping:q}])}};var r=function(a,b){a=(new e.fn.dataTable.Api(a)).settings()[0];if(a._colReorder)return a._colReorder;!0===b&&(b={});var c=e.fn.dataTable.camelToHungarian;c&&(c(r.defaults,r.defaults,!0),c(r.defaults,b||{}));this.s={dt:null,enable:null,init:e.extend(!0,{},r.defaults,b),fixed:0,fixedRight:0,reorderCallback:null,mouse:{startX:-1,startY:-1,offsetX:-1,offsetY:-1,target:-1,targetIndex:-1,fromIndex:-1},aoTargets:[]};this.dom={drag:null,pointer:null};this.s.enable=this.s.init.bEnable;this.s.dt=a;this.s.dt._colReorder=this;this._fnConstruct();return this};e.extend(r.prototype,{fnEnable:function(a){if(!1===a)return fnDisable();this.s.enable=!0},fnDisable:function(){this.s.enable=!1},fnReset:function(){this._fnOrderColumns(this.fnOrder());return this},fnGetCurrentOrder:function(){return this.fnOrder()},fnOrder:function(a,b){var c=[],f,h=this.s.dt.aoColumns;if(a===z){b=0;for(f=h.length;b<f;b++)c.push(h[b]._ColReorder_iOrigCol);return c}if(b){h=this.fnOrder();b=0;for(f=a.length;b<f;b++)c.push(e.inArray(a[b],h));a=c}this._fnOrderColumns(y(a));return this},fnTranspose:function(a,b){b||(b="toCurrent");var c=this.fnOrder(),f=this.s.dt.aoColumns;return"toCurrent"===b?Array.isArray(a)?e.map(a,function(h){return e.inArray(h,c)}):e.inArray(a,c):Array.isArray(a)?e.map(a,function(h){return f[h]._ColReorder_iOrigCol}):f[a]._ColReorder_iOrigCol},_fnConstruct:function(){var a=this,b=this.s.dt.aoColumns.length,c=this.s.dt.nTable,f;this.s.init.iFixedColumns&&(this.s.fixed=this.s.init.iFixedColumns);this.s.init.iFixedColumnsLeft&&(this.s.fixed=this.s.init.iFixedColumnsLeft);this.s.fixedRight=this.s.init.iFixedColumnsRight?this.s.init.iFixedColumnsRight:0;this.s.init.fnReorderCallback&&(this.s.reorderCallback=this.s.init.fnReorderCallback);for(f=0;f<b;f++)f>this.s.fixed-1&&f<b-this.s.fixedRight&&this._fnMouseListener(f,this.s.dt.aoColumns[f].nTh),this.s.dt.aoColumns[f]._ColReorder_iOrigCol=f;this.s.dt.oApi._fnCallbackReg(this.s.dt,"aoStateSaveParams",function(l,k){a._fnStateSave.call(a,k)},"ColReorder_State");this.s.dt.oApi._fnCallbackReg(this.s.dt,"aoStateLoadParams",function(l,k){a.s.dt._colReorder.fnOrder(k.ColReorder,!0)});var h=null;this.s.init.aiOrder&&(h=this.s.init.aiOrder.slice());this.s.dt.oLoadedState&&"undefined"!=typeof this.s.dt.oLoadedState.ColReorder&&this.s.dt.oLoadedState.ColReorder.length==this.s.dt.aoColumns.length&&(h=this.s.dt.oLoadedState.ColReorder);if(h)if(a.s.dt._bInitComplete)b=y(h),a._fnOrderColumns.call(a,b);else{var g=!1;e(c).on("draw.dt.colReorder",function(){if(!a.s.dt._bInitComplete&&!g){g=!0;var l=y(h);a._fnOrderColumns.call(a,l)}})}else this._fnSetColumnIndexes();e(c).on("destroy.dt.colReorder",function(){e(c).off("destroy.dt.colReorder draw.dt.colReorder");e.each(a.s.dt.aoColumns,function(l,k){e(k.nTh).off(".ColReorder");e(k.nTh).removeAttr("data-column-index")});a.s.dt._colReorder=null;a.s=null})},_fnOrderColumns:function(a){var b=!1;if(a.length!=this.s.dt.aoColumns.length)this.s.dt.oInstance.oApi._fnLog(this.s.dt,1,"ColReorder - array reorder does not match known number of columns. Skipping.");else{for(var c=0,f=a.length;c<f;c++){var h=e.inArray(c,a);c!=h&&(v(a,h,c),this.s.dt.oInstance.fnColReorder(h,c,!0,!1),b=!0)}this._fnSetColumnIndexes();b&&(e.fn.dataTable.Api(this.s.dt).rows().invalidate(),""===this.s.dt.oScroll.sX&&""===this.s.dt.oScroll.sY||this.s.dt.oInstance.fnAdjustColumnSizing(!1),this.s.dt.oInstance.oApi._fnSaveState(this.s.dt),null!==this.s.reorderCallback&&this.s.reorderCallback.call(this))}},_fnStateSave:function(a){if(null!==this.s){var b,c,f=this.s.dt.aoColumns;a.ColReorder=[];if(a.aaSorting){for(b=0;b<a.aaSorting.length;b++)a.aaSorting[b][0]=f[a.aaSorting[b][0]]._ColReorder_iOrigCol;var h=e.extend(!0,[],a.aoSearchCols);b=0;for(c=f.length;b<c;b++){var g=f[b]._ColReorder_iOrigCol;a.aoSearchCols[g]=h[b];a.abVisCols[g]=f[b].bVisible;a.ColReorder.push(g)}}else if(a.order){for(b=0;b<a.order.length;b++)a.order[b][0]=f[a.order[b][0]]._ColReorder_iOrigCol;h=e.extend(!0,[],a.columns);b=0;for(c=f.length;b<c;b++)g=f[b]._ColReorder_iOrigCol,a.columns[g]=h[b],a.ColReorder.push(g)}}},_fnMouseListener:function(a,b){var c=this;e(b).on("mousedown.ColReorder",function(f){c.s.enable&&1===f.which&&c._fnMouseDown.call(c,f,b)}).on("touchstart.ColReorder",function(f){c.s.enable&&c._fnMouseDown.call(c,f,b)})},_fnMouseDown:function(a,b){var c=this,f=e(a.target).closest("th, td").offset();b=parseInt(e(b).attr("data-column-index"),10);b!==z&&(this.s.mouse.startX=this._fnCursorPosition(a,"pageX"),this.s.mouse.startY=this._fnCursorPosition(a,"pageY"),this.s.mouse.offsetX=this._fnCursorPosition(a,"pageX")-f.left,this.s.mouse.offsetY=this._fnCursorPosition(a,"pageY")-f.top,this.s.mouse.target=this.s.dt.aoColumns[b].nTh,this.s.mouse.targetIndex=b,this.s.mouse.fromIndex=b,this._fnRegions(),e(t).on("mousemove.ColReorder touchmove.ColReorder",function(h){c._fnMouseMove.call(c,h)}).on("mouseup.ColReorder touchend.ColReorder",function(h){c._fnMouseUp.call(c,h)}))},_fnMouseMove:function(a){var b=this;if(null===this.dom.drag){if(5>Math.pow(Math.pow(this._fnCursorPosition(a,"pageX")-this.s.mouse.startX,2)+Math.pow(this._fnCursorPosition(a,"pageY")-this.s.mouse.startY,2),.5))return;this._fnCreateDragNode()}this.dom.drag.css({left:this._fnCursorPosition(a,"pageX")-this.s.mouse.offsetX,top:this._fnCursorPosition(a,"pageY")-this.s.mouse.offsetY});var c=this.s.mouse.toIndex;a=this._fnCursorPosition(a,"pageX");for(var f=function(d){for(;0<=d;){d--;if(0>=d)return null;if(b.s.aoTargets[d+1].x!==b.s.aoTargets[d].x)return b.s.aoTargets[d]}},h=function(){for(var d=0;d<b.s.aoTargets.length-1;d++)if(b.s.aoTargets[d].x!==b.s.aoTargets[d+1].x)return b.s.aoTargets[d]},g=function(){for(var d=b.s.aoTargets.length-1;0<d;d--)if(b.s.aoTargets[d].x!==b.s.aoTargets[d-1].x)return b.s.aoTargets[d]},l=1;l<this.s.aoTargets.length;l++){var k=f(l);k||(k=h());var p=k.x+(this.s.aoTargets[l].x-k.x)/2;if(this._fnIsLtr()){if(a<p){var m=k;break}}else if(a>p){m=k;break}}m?(this.dom.pointer.css("left",m.x),this.s.mouse.toIndex=m.to):(this.dom.pointer.css("left",g().x),this.s.mouse.toIndex=g().to);this.s.init.bRealtime&&c!==this.s.mouse.toIndex&&(this.s.dt.oInstance.fnColReorder(this.s.mouse.fromIndex,this.s.mouse.toIndex),this.s.mouse.fromIndex=this.s.mouse.toIndex,""===this.s.dt.oScroll.sX&&""===this.s.dt.oScroll.sY||this.s.dt.oInstance.fnAdjustColumnSizing(!1),this._fnRegions())},_fnMouseUp:function(a){e(t).off(".ColReorder");null!==this.dom.drag&&(this.dom.drag.remove(),this.dom.pointer.remove(),this.dom.drag=null,this.dom.pointer=null,this.s.dt.oInstance.fnColReorder(this.s.mouse.fromIndex,this.s.mouse.toIndex,!0),this._fnSetColumnIndexes(),""===this.s.dt.oScroll.sX&&""===this.s.dt.oScroll.sY||this.s.dt.oInstance.fnAdjustColumnSizing(!1),this.s.dt.oInstance.oApi._fnSaveState(this.s.dt),null!==this.s.reorderCallback&&this.s.reorderCallback.call(this))},_fnRegions:function(){var a=this.s.dt.aoColumns,b=this._fnIsLtr();this.s.aoTargets.splice(0,this.s.aoTargets.length);var c=e(this.s.dt.nTable).offset().left,f=[];e.each(a,function(l,k){if(k.bVisible&&"none"!==k.nTh.style.display){k=e(k.nTh);var p=k.offset().left;b&&(p+=k.outerWidth());f.push({index:l,bound:p});c=p}else f.push({index:l,bound:c})});var h=f[0];a=e(a[h.index].nTh).outerWidth();this.s.aoTargets.push({to:0,x:h.bound-a});for(h=0;h<f.length;h++){a=f[h];var g=a.index;a.index<this.s.mouse.fromIndex&&g++;this.s.aoTargets.push({to:g,x:a.bound})}0!==this.s.fixedRight&&this.s.aoTargets.splice(this.s.aoTargets.length-
this.s.fixedRight);0!==this.s.fixed&&this.s.aoTargets.splice(0,this.s.fixed)},_fnCreateDragNode:function(){var a=""!==this.s.dt.oScroll.sX||""!==this.s.dt.oScroll.sY,b=this.s.dt.aoColumns[this.s.mouse.targetIndex].nTh,c=b.parentNode,f=c.parentNode,h=f.parentNode,g=e(b).clone();this.dom.drag=e(h.cloneNode(!1)).addClass("DTCR_clonedTable").append(e(f.cloneNode(!1)).append(e(c.cloneNode(!1)).append(g[0]))).css({position:"absolute",top:0,left:0,width:e(b).outerWidth(),height:e(b).outerHeight()}).appendTo("body");this.dom.pointer=e("<div></div>").addClass("DTCR_pointer").css({position:"absolute",top:a?e(e(this.s.dt.nScrollBody).parent()).offset().top:e(this.s.dt.nTable).offset().top,height:a?e(e(this.s.dt.nScrollBody).parent()).height():e(this.s.dt.nTable).height()}).appendTo("body")},_fnSetColumnIndexes:function(){e.each(this.s.dt.aoColumns,function(a,b){e(b.nTh).attr("data-column-index",a)})},_fnCursorPosition:function(a,b){return-1!==a.type.indexOf("touch")?a.originalEvent.touches[0][b]:a[b]},_fnIsLtr:function(){return"rtl"!==e(this.s.dt.nTable).css("direction")}});r.defaults={aiOrder:null,bEnable:!0,bRealtime:!0,iFixedColumnsLeft:0,iFixedColumnsRight:0,fnReorderCallback:null};r.version="1.5.5";e.fn.dataTable.ColReorder=r;e.fn.DataTable.ColReorder=r;"function"==typeof e.fn.dataTable&&"function"==typeof e.fn.dataTableExt.fnVersionCheck&&e.fn.dataTableExt.fnVersionCheck("1.10.8")?e.fn.dataTableExt.aoFeatures.push({fnInit:function(a){var b=a.oInstance;a._colReorder?b.oApi._fnLog(a,1,"ColReorder attempted to initialise twice. Ignoring second"):(b=a.oInit,new r(a,b.colReorder||b.oColReorder||{}));return null},cFeature:"R",sFeature:"ColReorder"}):alert("Warning: ColReorder requires DataTables 1.10.8 or greater - www.datatables.net/download");e(t).on("preInit.dt.colReorder",function(a,b){if("dt"===a.namespace){a=b.oInit.colReorder;var c=D.defaults.colReorder;if(a||c)c=e.extend({},a,c),!1!==a&&new r(b,c)}});e.fn.dataTable.Api.register("colReorder.reset()",function(){return this.iterator("table",function(a){a._colReorder.fnReset()})});e.fn.dataTable.Api.register("colReorder.order()",function(a,b){return a?this.iterator("table",function(c){c._colReorder.fnOrder(a,b)}):this.context.length?this.context[0]._colReorder.fnOrder():null});e.fn.dataTable.Api.register("colReorder.transpose()",function(a,b){return this.context.length&&this.context[0]._colReorder?this.context[0]._colReorder.fnTranspose(a,b):a});e.fn.dataTable.Api.register("colReorder.move()",function(a,b,c,f){this.context.length&&(this.context[0]._colReorder.s.dt.oInstance.fnColReorder(a,b,c,f),this.context[0]._colReorder._fnSetColumnIndexes());return this});e.fn.dataTable.Api.register("colReorder.enable()",function(a){return this.iterator("table",function(b){b._colReorder&&b._colReorder.fnEnable(a)})});e.fn.dataTable.Api.register("colReorder.disable()",function(){return this.iterator("table",function(a){a._colReorder&&a._colReorder.fnDisable()})});return r});/*! Bootstrap 5 styling wrapper for ColReorder
* ©2018 SpryMedia Ltd - datatables.net/license
*/(function(factory){if(typeof define==='function'&&define.amd){define(['jquery','datatables.net-bs5','datatables.net-colreorder'],function($){return factory($,window,document);});}
else if(typeof exports==='object'){module.exports=function(root,$){if(!root){root=window;}
if(!$||!$.fn.dataTable){$=require('datatables.net-bs5')(root,$).$;}
if(!$.fn.dataTable.ColReorder){require('datatables.net-colreorder')(root,$);}
return factory($,root,root.document);};}
else{factory(jQuery,window,document);}}(function($,window,document,undefined){return $.fn.dataTable;}));/*!
FixedColumns 3.3.3
©2010-2021 SpryMedia Ltd - datatables.net/license
*/(function(d){"function"===typeof define&&define.amd?define(["jquery","datatables.net"],function(p){return d(p,window,document)}):"object"===typeof exports?module.exports=function(p,r){p||(p=window);if(!r||!r.fn.dataTable)r=require("datatables.net")(p,r).$;return d(r,p,p.document)}:d(jQuery,window,document)})(function(d,p,r,t){var s=d.fn.dataTable,u,m=function(a,b){var c=this;if(this instanceof m){if(b===t||!0===b)b={};var e=d.fn.dataTable.camelToHungarian;e&&(e(m.defaults,m.defaults,!0),e(m.defaults,b));e=(new d.fn.dataTable.Api(a)).settings()[0];this.s={dt:e,iTableColumns:e.aoColumns.length,aiOuterWidths:[],aiInnerWidths:[],rtl:"rtl"===d(e.nTable).css("direction")};this.dom={scroller:null,header:null,body:null,footer:null,grid:{wrapper:null,dt:null,left:{wrapper:null,head:null,body:null,foot:null},right:{wrapper:null,head:null,body:null,foot:null}},clone:{left:{header:null,body:null,footer:null},right:{header:null,body:null,footer:null}}};if(e._oFixedColumns)throw"FixedColumns already initialised on this table";e._oFixedColumns=this;e._bInitComplete?this._fnConstruct(b):e.oApi._fnCallbackReg(e,"aoInitComplete",function(){c._fnConstruct(b)},"FixedColumns")}else alert("FixedColumns warning: FixedColumns must be initialised with the 'new' keyword.")};d.extend(m.prototype,{fnUpdate:function(){this._fnDraw(!0)},fnRedrawLayout:function(){this._fnColCalc();this._fnGridLayout();this.fnUpdate()},fnRecalculateHeight:function(a){delete a._DTTC_iHeight;a.style.height="auto"},fnSetRowHeight:function(a,b){a.style.height=b+"px"},fnGetPosition:function(a){var b=this.s.dt.oInstance;if(d(a).parents(".DTFC_Cloned").length){if("tr"===a.nodeName.toLowerCase())return a=d(a).index(),b.fnGetPosition(d("tr",this.s.dt.nTBody)[a]);var c=d(a).index(),a=d(a.parentNode).index();return[b.fnGetPosition(d("tr",this.s.dt.nTBody)[a]),c,b.oApi._fnVisibleToColumnIndex(this.s.dt,c)]}return b.fnGetPosition(a)},fnToFixedNode:function(a,b){var c;b<this.s.iLeftColumns?c=d(this.dom.clone.left.body).find("[data-dt-row="+a+"][data-dt-column="+
b+"]"):b>=this.s.iRightColumns&&(c=d(this.dom.clone.right.body).find("[data-dt-row="+a+"][data-dt-column="+b+"]"));return c&&c.length?c[0]:(new d.fn.dataTable.Api(this.s.dt)).cell(a,b).node()},_fnConstruct:function(a){var b=this;if("function"!=typeof this.s.dt.oInstance.fnVersionCheck||!0!==this.s.dt.oInstance.fnVersionCheck("1.8.0"))alert("FixedColumns "+m.VERSION+" required DataTables 1.8.0 or later. Please upgrade your DataTables installation");else if(""===this.s.dt.oScroll.sX)this.s.dt.oInstance.oApi._fnLog(this.s.dt,1,"FixedColumns is not needed (no x-scrolling in DataTables enabled), so no action will be taken. Use 'FixedHeader' for column fixing when scrolling is not enabled");else{this.s=d.extend(!0,this.s,m.defaults,a);a=this.s.dt.oClasses;this.dom.grid.dt=d(this.s.dt.nTable).parents("div."+a.sScrollWrapper)[0];this.dom.scroller=d("div."+a.sScrollBody,this.dom.grid.dt)[0];this._fnColCalc();this._fnGridSetup();var c,e=!1;d(this.s.dt.nTableWrapper).on("mousedown.DTFC",function(a){0===a.button&&(e=!0,d(r).one("mouseup",function(){e=!1}))});d(this.dom.scroller).on("mouseover.DTFC touchstart.DTFC",function(){e||(c="main")}).on("scroll.DTFC",function(a){!c&&a.originalEvent&&(c="main");if("main"===c||"key"===c)if(0<b.s.iLeftColumns&&(b.dom.grid.left.liner.scrollTop=b.dom.scroller.scrollTop),0<b.s.iRightColumns)b.dom.grid.right.liner.scrollTop=b.dom.scroller.scrollTop});var f="onwheel"in r.createElement("div")?"wheel.DTFC":"mousewheel.DTFC";0<b.s.iLeftColumns&&(d(b.dom.grid.left.liner).on("mouseover.DTFC touchstart.DTFC",function(){!e&&"key"!==c&&(c="left")}).on("scroll.DTFC",function(a){!c&&a.originalEvent&&(c="left");"left"===c&&(b.dom.scroller.scrollTop=b.dom.grid.left.liner.scrollTop,0<b.s.iRightColumns&&(b.dom.grid.right.liner.scrollTop=b.dom.grid.left.liner.scrollTop))}).on(f,function(a){c="left";b.dom.scroller.scrollLeft-="wheel"===a.type?-a.originalEvent.deltaX:a.originalEvent.wheelDeltaX}),d(b.dom.grid.left.head).on("mouseover.DTFC touchstart.DTFC",function(){c="main"}));0<b.s.iRightColumns&&(d(b.dom.grid.right.liner).on("mouseover.DTFC touchstart.DTFC",function(){!e&&c!=="key"&&(c="right")}).on("scroll.DTFC",function(a){!c&&a.originalEvent&&(c="right");if(c==="right"){b.dom.scroller.scrollTop=b.dom.grid.right.liner.scrollTop;if(b.s.iLeftColumns>0)b.dom.grid.left.liner.scrollTop=b.dom.grid.right.liner.scrollTop}}).on(f,function(a){c="right";b.dom.scroller.scrollLeft=b.dom.scroller.scrollLeft-(a.type==="wheel"?-a.originalEvent.deltaX:a.originalEvent.wheelDeltaX)}),d(b.dom.grid.right.head).on("mouseover.DTFC touchstart.DTFC",function(){c="main"}));d(p).on("resize.DTFC",function(){b._fnGridLayout.call(b)});var g=!0,h=d(this.s.dt.nTable);h.on("draw.dt.DTFC",function(){b._fnColCalc();b._fnDraw.call(b,g);g=false}).on("key-focus.dt.DTFC",function(){c="key"}).on("column-sizing.dt.DTFC",function(){b._fnColCalc();b._fnGridLayout(b)}).on("column-visibility.dt.DTFC",function(a,c,d,e,f){if(f===t||f){b._fnColCalc();b._fnGridLayout(b);b._fnDraw(true)}}).on("select.dt.DTFC deselect.dt.DTFC",function(a){a.namespace==="dt"&&b._fnDraw(false)}).on("position.dts.dt.DTFC",function(a,c){b.dom.grid.left.body&&d(b.dom.grid.left.body).find("table").eq(0).css("top",c);b.dom.grid.right.body&&d(b.dom.grid.right.body).find("table").eq(0).css("top",c)}).on("destroy.dt.DTFC",function(){h.off(".DTFC");d(b.dom.scroller).off(".DTFC");d(p).off(".DTFC");d(b.s.dt.nTableWrapper).off(".DTFC");d(b.dom.grid.left.liner).off(".DTFC "+f);d(b.dom.grid.left.wrapper).remove();d(b.dom.grid.right.liner).off(".DTFC "+f);d(b.dom.grid.right.wrapper).remove()});this._fnGridLayout();this.s.dt.oInstance.fnDraw(!1)}},_fnColCalc:function(){var a=this,b=0,c=0;this.s.aiInnerWidths=[];this.s.aiOuterWidths=[];d.each(this.s.dt.aoColumns,function(e,f){var g=d(f.nTh),h;if(g.filter(":visible").length){var i=g.outerWidth();0===a.s.aiOuterWidths.length&&(h=d(a.s.dt.nTable).css("border-left-width"),i+="string"===typeof h&&-1===h.indexOf("px")?1:parseInt(h,10));a.s.aiOuterWidths.length===a.s.dt.aoColumns.length-1&&(h=d(a.s.dt.nTable).css("border-right-width"),i+="string"===typeof h&&-1===h.indexOf("px")?1:parseInt(h,10));a.s.aiOuterWidths.push(i);a.s.aiInnerWidths.push(g.width());e<a.s.iLeftColumns&&(b+=i);a.s.iTableColumns-a.s.iRightColumns<=e&&(c+=i)}else a.s.aiInnerWidths.push(0),a.s.aiOuterWidths.push(0)});this.s.iLeftWidth=b;this.s.iRightWidth=c},_fnGridSetup:function(){var a=this._fnDTOverflow(),b;this.dom.body=this.s.dt.nTable;this.dom.header=this.s.dt.nTHead.parentNode;this.dom.header.parentNode.parentNode.style.position="relative";var c=d('<div class="DTFC_ScrollWrapper" style="position:relative; clear:both;"><div class="DTFC_LeftWrapper" style="position:absolute; top:0; left:0;" aria-hidden="true"><div class="DTFC_LeftHeadWrapper" style="position:relative; top:0; left:0; overflow:hidden;"></div><div class="DTFC_LeftBodyWrapper" style="position:relative; top:0; left:0; height:0; overflow:hidden;"><div class="DTFC_LeftBodyLiner" style="position:relative; top:0; left:0; overflow-y:scroll;"></div></div><div class="DTFC_LeftFootWrapper" style="position:relative; top:0; left:0; overflow:hidden;"></div></div><div class="DTFC_RightWrapper" style="position:absolute; top:0; right:0;" aria-hidden="true"><div class="DTFC_RightHeadWrapper" style="position:relative; top:0; left:0;"><div class="DTFC_RightHeadBlocker DTFC_Blocker" style="position:absolute; top:0; bottom:0;"></div></div><div class="DTFC_RightBodyWrapper" style="position:relative; top:0; left:0; height:0; overflow:hidden;"><div class="DTFC_RightBodyLiner" style="position:relative; top:0; left:0; overflow-y:scroll;"></div></div><div class="DTFC_RightFootWrapper" style="position:relative; top:0; left:0;"><div class="DTFC_RightFootBlocker DTFC_Blocker" style="position:absolute; top:0; bottom:0;"></div></div></div></div>')[0],e=c.childNodes[0],f=c.childNodes[1];this.dom.grid.dt.parentNode.insertBefore(c,this.dom.grid.dt);c.appendChild(this.dom.grid.dt);this.dom.grid.wrapper=c;0<this.s.iLeftColumns&&(this.dom.grid.left.wrapper=e,this.dom.grid.left.head=e.childNodes[0],this.dom.grid.left.body=e.childNodes[1],this.dom.grid.left.liner=d("div.DTFC_LeftBodyLiner",c)[0],c.appendChild(e));0<this.s.iRightColumns&&(this.dom.grid.right.wrapper=f,this.dom.grid.right.head=f.childNodes[0],this.dom.grid.right.body=f.childNodes[1],this.dom.grid.right.liner=d("div.DTFC_RightBodyLiner",c)[0],f.style.right=a.bar+"px",b=d("div.DTFC_RightHeadBlocker",c)[0],b.style.width=a.bar+"px",b.style.right=-a.bar+"px",this.dom.grid.right.headBlock=b,b=d("div.DTFC_RightFootBlocker",c)[0],b.style.width=a.bar+"px",b.style.right=-a.bar+"px",this.dom.grid.right.footBlock=b,c.appendChild(f));if(this.s.dt.nTFoot&&(this.dom.footer=this.s.dt.nTFoot.parentNode,0<this.s.iLeftColumns&&(this.dom.grid.left.foot=e.childNodes[2]),0<this.s.iRightColumns))this.dom.grid.right.foot=f.childNodes[2];this.s.rtl&&d("div.DTFC_RightHeadBlocker",c).css({left:-a.bar+"px",right:""})},_fnGridLayout:function(){var a=this,b=this.dom.grid;d(b.wrapper).width();var c=this.s.dt.nTable.parentNode.offsetHeight,e=this.s.dt.nTable.parentNode.parentNode.offsetHeight,f=this._fnDTOverflow(),g=this.s.iLeftWidth,h=this.s.iRightWidth,i="rtl"===d(this.dom.body).css("direction"),j=function(b,c){f.bar?a._firefoxScrollError()?34<d(b).height()&&(b.style.width=c+f.bar+"px"):b.style.width=c+f.bar+"px":(b.style.width=c+20+
"px",b.style.paddingRight="20px",b.style.boxSizing="border-box")};f.x&&(c-=f.bar);b.wrapper.style.height=e+"px";0<this.s.iLeftColumns&&(e=b.left.wrapper,e.style.width=g+"px",e.style.height="1px",i?(e.style.left="",e.style.right=0):(e.style.left=0,e.style.right=""),b.left.body.style.height=c+"px",b.left.foot&&(b.left.foot.style.top=(f.x?f.bar:0)+"px"),j(b.left.liner,g),b.left.liner.style.height=c+"px",b.left.liner.style.maxHeight=c+"px");0<this.s.iRightColumns&&(e=b.right.wrapper,e.style.width=h+"px",e.style.height="1px",this.s.rtl?(e.style.left=f.y?f.bar+"px":0,e.style.right=""):(e.style.left="",e.style.right=f.y?f.bar+"px":0),b.right.body.style.height=c+"px",b.right.foot&&(b.right.foot.style.top=(f.x?f.bar:0)+"px"),j(b.right.liner,h),b.right.liner.style.height=c+"px",b.right.liner.style.maxHeight=c+"px",b.right.headBlock.style.display=f.y?"block":"none",b.right.footBlock.style.display=f.y?"block":"none")},_fnDTOverflow:function(){var a=this.s.dt.nTable,b=a.parentNode,c={x:!1,y:!1,bar:this.s.dt.oScroll.iBarWidth};a.offsetWidth>b.clientWidth&&(c.x=!0);a.offsetHeight>b.clientHeight&&(c.y=!0);return c},_fnDraw:function(a){this._fnGridLayout();this._fnCloneLeft(a);this._fnCloneRight(a);d(this.dom.scroller).trigger("scroll");null!==this.s.fnDrawCallback&&this.s.fnDrawCallback.call(this,this.dom.clone.left,this.dom.clone.right);d(this).trigger("draw.dtfc",{leftClone:this.dom.clone.left,rightClone:this.dom.clone.right})},_fnCloneRight:function(a){if(!(0>=this.s.iRightColumns)){var b,c=[];for(b=this.s.iTableColumns-
this.s.iRightColumns;b<this.s.iTableColumns;b++)this.s.dt.aoColumns[b].bVisible&&c.push(b);this._fnClone(this.dom.clone.right,this.dom.grid.right,c,a)}},_fnCloneLeft:function(a){if(!(0>=this.s.iLeftColumns)){var b,c=[];for(b=0;b<this.s.iLeftColumns;b++)this.s.dt.aoColumns[b].bVisible&&c.push(b);this._fnClone(this.dom.clone.left,this.dom.grid.left,c,a)}},_fnCopyLayout:function(a,b,c){for(var e=[],f=[],g=[],h=0,i=a.length;h<i;h++){var j=[];j.nTr=d(a[h].nTr).clone(c,!1)[0];for(var l=0,o=this.s.iTableColumns;l<o;l++)if(-1!==d.inArray(l,b)){var q=d.inArray(a[h][l].cell,g);-1===q?(q=d(a[h][l].cell).clone(c,!1)[0],f.push(q),g.push(a[h][l].cell),j.push({cell:q,unique:a[h][l].unique})):j.push({cell:f[q],unique:a[h][l].unique})}e.push(j)}return e},_fnClone:function(a,b,c,e){var f=this,g,h,i,j,l,o,q,n,m,k=this.s.dt;if(e){d(a.header).remove();a.header=d(this.dom.header).clone(!0,!1)[0];a.header.className+=" DTFC_Cloned";a.header.style.width="100%";b.head.appendChild(a.header);n=this._fnCopyLayout(k.aoHeader,c,!0);j=d(">thead",a.header);j.empty();g=0;for(h=n.length;g<h;g++)j[0].appendChild(n[g].nTr);k.oApi._fnDrawHead(k,n,!0)}else{n=this._fnCopyLayout(k.aoHeader,c,!1);m=[];k.oApi._fnDetectHeader(m,d(">thead",a.header)[0]);g=0;for(h=n.length;g<h;g++){i=0;for(j=n[g].length;i<j;i++)m[g][i].cell.className=n[g][i].cell.className,d("span.DataTables_sort_icon",m[g][i].cell).each(function(){this.className=d("span.DataTables_sort_icon",n[g][i].cell)[0].className})}}this._fnEqualiseHeights("thead",this.dom.header,a.header);"auto"==this.s.sHeightMatch&&d(">tbody>tr",f.dom.body).css("height","auto");null!==a.body&&(d(a.body).remove(),a.body=null);a.body=d(this.dom.body).clone(!0)[0];a.body.className+=" DTFC_Cloned";a.body.style.paddingBottom=k.oScroll.iBarWidth+"px";a.body.style.marginBottom=2*k.oScroll.iBarWidth+"px";null!==a.body.getAttribute("id")&&a.body.removeAttribute("id");d(">thead>tr",a.body).empty();d(">tfoot",a.body).remove();var p=d("tbody",a.body)[0];d(p).empty();if(0<k.aiDisplay.length){h=d(">thead>tr",a.body)[0];for(q=0;q<c.length;q++)l=c[q],o=d(k.aoColumns[l].nTh).clone(!0)[0],o.innerHTML="",j=o.style,j.paddingTop="0",j.paddingBottom="0",j.borderTopWidth="0",j.borderBottomWidth="0",j.height=0,j.width=f.s.aiInnerWidths[l]+"px",h.appendChild(o);d(">tbody>tr",f.dom.body).each(function(a){var a=f.s.dt.oFeatures.bServerSide===false?f.s.dt.aiDisplay[f.s.dt._iDisplayStart+a]:a,b=f.s.dt.aoData[a].anCells||d(this).children("td, th"),e=this.cloneNode(false);e.removeAttribute("id");e.setAttribute("data-dt-row",a);for(q=0;q<c.length;q++){l=c[q];if(b.length>0){o=d(b[l]).clone(true,true)[0];o.removeAttribute("id");o.setAttribute("data-dt-row",a);o.setAttribute("data-dt-column",l);e.appendChild(o)}}p.appendChild(e)})}else d(">tbody>tr",f.dom.body).each(function(){o=this.cloneNode(true);o.className=o.className+" DTFC_NoData";d("td",o).html("");p.appendChild(o)});a.body.style.width="100%";a.body.style.margin="0";a.body.style.padding="0";k.oScroller!==t&&(h=k.oScroller.dom.force,b.forcer?b.forcer.style.height=h.style.height:(b.forcer=h.cloneNode(!0),b.liner.appendChild(b.forcer)));b.liner.appendChild(a.body);this._fnEqualiseHeights("tbody",f.dom.body,a.body);if(null!==k.nTFoot){if(e){null!==a.footer&&a.footer.parentNode.removeChild(a.footer);a.footer=d(this.dom.footer).clone(!0,!0)[0];a.footer.className+=" DTFC_Cloned";a.footer.style.width="100%";b.foot.appendChild(a.footer);n=this._fnCopyLayout(k.aoFooter,c,!0);b=d(">tfoot",a.footer);b.empty();g=0;for(h=n.length;g<h;g++)b[0].appendChild(n[g].nTr);k.oApi._fnDrawHead(k,n,!0)}else{n=this._fnCopyLayout(k.aoFooter,c,!1);b=[];k.oApi._fnDetectHeader(b,d(">tfoot",a.footer)[0]);g=0;for(h=n.length;g<h;g++){i=0;for(j=n[g].length;i<j;i++)b[g][i].cell.className=n[g][i].cell.className}}this._fnEqualiseHeights("tfoot",this.dom.footer,a.footer)}b=k.oApi._fnGetUniqueThs(k,d(">thead",a.header)[0]);d(b).each(function(a){l=c[a];this.style.width=f.s.aiInnerWidths[l]+"px"});null!==f.s.dt.nTFoot&&(b=k.oApi._fnGetUniqueThs(k,d(">tfoot",a.footer)[0]),d(b).each(function(a){l=c[a];this.style.width=f.s.aiInnerWidths[l]+"px"}))},_fnGetTrNodes:function(a){for(var b=[],c=0,d=a.childNodes.length;c<d;c++)"TR"==a.childNodes[c].nodeName.toUpperCase()&&b.push(a.childNodes[c]);return b},_fnEqualiseHeights:function(a,b,c){if(!("none"==this.s.sHeightMatch&&"thead"!==a&&"tfoot"!==a)){var e,f,g=b.getElementsByTagName(a)[0],c=c.getElementsByTagName(a)[0],a=d(">"+a+">tr:eq(0)",b).children(":first");a.outerHeight();a.height();for(var g=this._fnGetTrNodes(g),b=this._fnGetTrNodes(c),h=[],c=0,a=b.length;c<a;c++)e=g[c].offsetHeight,f=b[c].offsetHeight,e=f>e?f:e,"semiauto"==this.s.sHeightMatch&&(g[c]._DTTC_iHeight=e),h.push(e);c=0;for(a=b.length;c<a;c++)b[c].style.height=h[c]+"px",g[c].style.height=h[c]+"px"}},_firefoxScrollError:function(){if(u===t){var a=d("<div/>").css({position:"absolute",top:0,left:0,height:10,width:50,overflow:"scroll"}).appendTo("body");u=a[0].clientWidth===a[0].offsetWidth&&0!==this._fnDTOverflow().bar;a.remove()}return u}});m.defaults={iLeftColumns:1,iRightColumns:0,fnDrawCallback:null,sHeightMatch:"semiauto"};m.version="3.3.3";s.Api.register("fixedColumns()",function(){return this});s.Api.register("fixedColumns().update()",function(){return this.iterator("table",function(a){a._oFixedColumns&&a._oFixedColumns.fnUpdate()})});s.Api.register("fixedColumns().relayout()",function(){return this.iterator("table",function(a){a._oFixedColumns&&a._oFixedColumns.fnRedrawLayout()})});s.Api.register("rows().recalcHeight()",function(){return this.iterator("row",function(a,b){a._oFixedColumns&&a._oFixedColumns.fnRecalculateHeight(this.row(b).node())})});s.Api.register("fixedColumns().rowIndex()",function(a){a=d(a);return a.parents(".DTFC_Cloned").length?this.rows({page:"current"}).indexes()[a.index()]:this.row(a).index()});s.Api.register("fixedColumns().cellIndex()",function(a){a=d(a);if(a.parents(".DTFC_Cloned").length){var b=a.parent().index(),b=this.rows({page:"current"}).indexes()[b],a=a.parents(".DTFC_LeftWrapper").length?a.index():this.columns().flatten().length-this.context[0]._oFixedColumns.s.iRightColumns+
a.index();return{row:b,column:this.column.index("toData",a),columnVisible:a}}return this.cell(a).index()});s.Api.registerPlural("cells().fixedNodes()","cell().fixedNode()",function(){return this.iterator("cell",function(a,b,c){return a._oFixedColumns?a._oFixedColumns.fnToFixedNode(b,c):this.cell(b,c).node()},1)});d(r).on("init.dt.fixedColumns",function(a,b){if("dt"===a.namespace){var c=b.oInit.fixedColumns,e=s.defaults.fixedColumns;if(c||e)e=d.extend({},c,e),!1!==c&&new m(b,e)}});d.fn.dataTable.FixedColumns=m;return d.fn.DataTable.FixedColumns=m});/*! Bootstrap 5 styling wrapper for FixedColumns
* ©2018 SpryMedia Ltd - datatables.net/license
*/(function(factory){if(typeof define==='function'&&define.amd){define(['jquery','datatables.net-bs5','datatables.net-fixedcolumns'],function($){return factory($,window,document);});}
else if(typeof exports==='object'){module.exports=function(root,$){if(!root){root=window;}
if(!$||!$.fn.dataTable){$=require('datatables.net-bs5')(root,$).$;}
if(!$.fn.dataTable.FixedColumns){require('datatables.net-fixedcolumns')(root,$);}
return factory($,root,root.document);};}
else{factory(jQuery,window,document);}}(function($,window,document,undefined){return $.fn.dataTable;}));/*!
Copyright 2009-2021 SpryMedia Ltd.
This source file is free software, available under the following license:
MIT license - http://datatables.net/license/mit
This source file is distributed in the hope that it will be useful, but
WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
For details please refer to: http://www.datatables.net
FixedHeader 3.2.0
©2009-2021 SpryMedia Ltd - datatables.net/license
*/var $jscomp=$jscomp||{};$jscomp.scope={};$jscomp.findInternal=function(b,g,h){b instanceof String&&(b=String(b));for(var l=b.length,k=0;k<l;k++){var v=b[k];if(g.call(h,v,k,b))return{i:k,v:v}}return{i:-1,v:void 0}};$jscomp.ASSUME_ES5=!1;$jscomp.ASSUME_NO_NATIVE_MAP=!1;$jscomp.ASSUME_NO_NATIVE_SET=!1;$jscomp.SIMPLE_FROUND_POLYFILL=!1;$jscomp.ISOLATE_POLYFILLS=!1;$jscomp.defineProperty=$jscomp.ASSUME_ES5||"function"==typeof Object.defineProperties?Object.defineProperty:function(b,g,h){if(b==Array.prototype||b==Object.prototype)return b;b[g]=h.value;return b};$jscomp.getGlobal=function(b){b=["object"==typeof globalThis&&globalThis,b,"object"==typeof window&&window,"object"==typeof self&&self,"object"==typeof global&&global];for(var g=0;g<b.length;++g){var h=b[g];if(h&&h.Math==Math)return h}throw Error("Cannot find global object");};$jscomp.global=$jscomp.getGlobal(this);$jscomp.IS_SYMBOL_NATIVE="function"===typeof Symbol&&"symbol"===typeof Symbol("x");$jscomp.TRUST_ES6_POLYFILLS=!$jscomp.ISOLATE_POLYFILLS||$jscomp.IS_SYMBOL_NATIVE;$jscomp.polyfills={};$jscomp.propertyToPolyfillSymbol={};$jscomp.POLYFILL_PREFIX="$jscp$";var $jscomp$lookupPolyfilledValue=function(b,g){var h=$jscomp.propertyToPolyfillSymbol[g];if(null==h)return b[g];h=b[h];return void 0!==h?h:b[g]};$jscomp.polyfill=function(b,g,h,l){g&&($jscomp.ISOLATE_POLYFILLS?$jscomp.polyfillIsolated(b,g,h,l):$jscomp.polyfillUnisolated(b,g,h,l))};$jscomp.polyfillUnisolated=function(b,g,h,l){h=$jscomp.global;b=b.split(".");for(l=0;l<b.length-1;l++){var k=b[l];if(!(k in h))return;h=h[k]}b=b[b.length-1];l=h[b];g=g(l);g!=l&&null!=g&&$jscomp.defineProperty(h,b,{configurable:!0,writable:!0,value:g})};$jscomp.polyfillIsolated=function(b,g,h,l){var k=b.split(".");b=1===k.length;l=k[0];l=!b&&l in $jscomp.polyfills?$jscomp.polyfills:$jscomp.global;for(var v=0;v<k.length-1;v++){var t=k[v];if(!(t in l))return;l=l[t]}k=k[k.length-1];h=$jscomp.IS_SYMBOL_NATIVE&&"es6"===h?l[k]:null;g=g(h);null!=g&&(b?$jscomp.defineProperty($jscomp.polyfills,k,{configurable:!0,writable:!0,value:g}):g!==h&&($jscomp.propertyToPolyfillSymbol[k]=$jscomp.IS_SYMBOL_NATIVE?$jscomp.global.Symbol(k):$jscomp.POLYFILL_PREFIX+k,k=$jscomp.propertyToPolyfillSymbol[k],$jscomp.defineProperty(l,k,{configurable:!0,writable:!0,value:g})))};$jscomp.polyfill("Array.prototype.find",function(b){return b?b:function(g,h){return $jscomp.findInternal(this,g,h).v}},"es6","es3");(function(b){"function"===typeof define&&define.amd?define(["jquery","datatables.net"],function(g){return b(g,window,document)}):"object"===typeof exports?module.exports=function(g,h){g||(g=window);h&&h.fn.dataTable||(h=require("datatables.net")(g,h).$);return b(h,g,g.document)}:b(jQuery,window,document)})(function(b,g,h,l){var k=b.fn.dataTable,v=0,t=function(a,c){if(!(this instanceof t))throw"FixedHeader must be initialised with the 'new' keyword.";!0===c&&(c={});a=new k.Api(a);this.c=b.extend(!0,{},t.defaults,c);this.s={dt:a,position:{theadTop:0,tbodyTop:0,tfootTop:0,tfootBottom:0,width:0,left:0,tfootHeight:0,theadHeight:0,windowHeight:b(g).height(),visible:!0},headerMode:null,footerMode:null,autoWidth:a.settings()[0].oFeatures.bAutoWidth,namespace:".dtfc"+v++,scrollLeft:{header:-1,footer:-1},enable:!0};this.dom={floatingHeader:null,thead:b(a.table().header()),tbody:b(a.table().body()),tfoot:b(a.table().footer()),header:{host:null,floating:null,floatingParent:b('<div class="dtfh-floatingparent">'),placeholder:null},footer:{host:null,floating:null,floatingParent:b('<div class="dtfh-floatingparent">'),placeholder:null}};this.dom.header.host=this.dom.thead.parent();this.dom.footer.host=this.dom.tfoot.parent();a=a.settings()[0];if(a._fixedHeader)throw"FixedHeader already initialised on table "+a.nTable.id;a._fixedHeader=this;this._constructor()};b.extend(t.prototype,{destroy:function(){this.s.dt.off(".dtfc");b(g).off(this.s.namespace);this.c.header&&this._modeChange("in-place","header",!0);this.c.footer&&this.dom.tfoot.length&&this._modeChange("in-place","footer",!0)},enable:function(a,c){this.s.enable=a;if(c||c===l)this._positions(),this._scroll(!0)},enabled:function(){return this.s.enable},headerOffset:function(a){a!==l&&(this.c.headerOffset=a,this.update());return this.c.headerOffset},footerOffset:function(a){a!==l&&(this.c.footerOffset=a,this.update());return this.c.footerOffset},update:function(a){var c=this.s.dt.table().node();b(c).is(":visible")?this.enable(!0,!1):this.enable(!1,!1);0!==b(c).children("thead").length&&(this._positions(),this._scroll(a!==l?a:!0))},_constructor:function(){var a=this,c=this.s.dt;b(g).on("scroll"+this.s.namespace,function(){a._scroll()}).on("resize"+this.s.namespace,k.util.throttle(function(){a.s.position.windowHeight=b(g).height();a.update()},50));var d=b(".fh-fixedHeader");!this.c.headerOffset&&d.length&&(this.c.headerOffset=d.outerHeight());d=b(".fh-fixedFooter");!this.c.footerOffset&&d.length&&(this.c.footerOffset=d.outerHeight());c.on("column-reorder.dt.dtfc column-visibility.dt.dtfc column-sizing.dt.dtfc responsive-display.dt.dtfc",function(f,e){a.update()}).on("draw.dt.dtfc",function(f,e){a.update(e===c.settings()[0]?!1:!0)});c.on("destroy.dtfc",function(){a.destroy()});this._positions();b("div.dataTables_scrollHeadInner").height(this.s.position.theadHeight);this._scroll()},_clone:function(a,c){var d=this,f=this.s.dt,e=this.dom[a],p="header"===a?this.dom.thead:this.dom.tfoot;if("footer"!==a||!this._scrollEnabled())if(!c&&e.floating)e.floating.removeClass("fixedHeader-floating fixedHeader-locked");else{e.floating&&(null!==e.placeholder&&e.placeholder.remove(),this._unsize(a),e.floating.children().detach(),e.floating.remove());c=b(f.table().node());var n=b(c.parent()),q=this._scrollEnabled();e.floating=b(f.table().node().cloneNode(!1)).attr("aria-hidden","true").css({"table-layout":"fixed",top:0,left:0}).removeAttr("id").append(p);e.floatingParent.css({width:n.width(),overflow:"hidden",height:"fit-content",position:"fixed",left:q?c.offset().left+n.scrollLeft():0}).css("header"===a?{top:this.c.headerOffset,bottom:""}:{top:"",bottom:this.c.footerOffset}).addClass("footer"===a?"dtfh-floatingparentfoot":"dtfh-floatingparenthead").append(e.floating).appendTo("body");this._stickyPosition(e.floating,"-");a=function(){var r=n.scrollLeft();d.s.scrollLeft={footer:r,header:r};e.floatingParent.scrollLeft(d.s.scrollLeft.header)};a();n.scroll(a);e.placeholder=p.clone(!1);e.placeholder.find("*[id]").removeAttr("id");e.host.prepend(e.placeholder);this._matchWidths(e.placeholder,e.floating)}},_stickyPosition:function(a,c){if(this._scrollEnabled()){var d=this,f="rtl"===b(d.s.dt.table().node()).css("direction");a.find("th").each(function(){if("sticky"===b(this).css("position")){var e=b(this).css("right"),p=b(this).css("left");"auto"===e||f?"auto"!==p&&f&&(e=+p.replace(/px/g,"")+("-"===c?-1:1)*d.s.dt.settings()[0].oBrowser.barWidth,b(this).css("left",0<e?e:0)):(e=+e.replace(/px/g,"")+("-"===c?-1:1)*d.s.dt.settings()[0].oBrowser.barWidth,b(this).css("right",0<e?e:0))}})}},_matchWidths:function(a,c){var d=function(p){return b(p,a).map(function(){return 1*b(this).css("width").replace(/[^\d\.]/g,"")}).toArray()},f=function(p,n){b(p,c).each(function(q){b(this).css({width:n[q],minWidth:n[q]})})},e=d("th");d=d("td");f("th",e);f("td",d)},_unsize:function(a){var c=this.dom[a].floating;c&&("footer"===a||"header"===a&&!this.s.autoWidth)?b("th, td",c).css({width:"",minWidth:""}):c&&"header"===a&&b("th, td",c).css("min-width","")},_horizontal:function(a,c){var d=this.dom[a],f=this.s.scrollLeft;if(d.floating&&f[a]!==c){if(this._scrollEnabled()){var e=b(b(this.s.dt.table().node()).parent()).scrollLeft();d.floating.scrollLeft(e);d.floatingParent.scrollLeft(e)}f[a]=c}},_modeChange:function(a,c,d){var f=this.dom[c],e=this.s.position,p=this._scrollEnabled();if("footer"!==c||!p){var n=function(B){f.floating.attr("style",function(w,x){return(x||"")+"width: "+B+"px !important;"});p||f.floatingParent.attr("style",function(w,x){return(x||"")+"width: "+B+"px !important;"})},q=this.dom["footer"===c?"tfoot":"thead"],r=b.contains(q[0],h.activeElement)?h.activeElement:null,m=b(b(this.s.dt.table().node()).parent());if("in-place"===a)f.placeholder&&(f.placeholder.remove(),f.placeholder=null),this._unsize(c),"header"===c?f.host.prepend(q):f.host.append(q),f.floating&&(f.floating.remove(),f.floating=null,this._stickyPosition(f.host,"+")),f.floatingParent&&f.floatingParent.remove(),b(b(f.host.parent()).parent()).scrollLeft(m.scrollLeft());else if("in"===a){this._clone(c,d);q=m.offset();d=b(h).scrollTop();var y=b(g).height();y=d+y;var z=p?q.top:e.tbodyTop;m=p?q.top+m.outerHeight():e.tfootTop;d="footer"===c?z>y?e.tfootHeight:z+e.tfootHeight-y:d+
this.c.headerOffset+e.theadHeight-m;m="header"===c?"top":"bottom";d=this.c[c+"Offset"]-(0<d?d:0);f.floating.addClass("fixedHeader-floating");f.floatingParent.css(m,d).css({left:e.left,height:"header"===c?e.theadHeight:e.tfootHeight,"z-index":2}).append(f.floating);n(e.width);"footer"===c&&f.floating.css("top","")}else"below"===a?(this._clone(c,d),f.floating.addClass("fixedHeader-locked"),f.floatingParent.css({position:"absolute",top:e.tfootTop-e.theadHeight,left:e.left+"px"}),n(e.width)):"above"===a&&(this._clone(c,d),f.floating.addClass("fixedHeader-locked"),f.floatingParent.css({position:"absolute",top:e.tbodyTop,left:e.left+"px"}),n(e.width));r&&r!==h.activeElement&&setTimeout(function(){r.focus()},10);this.s.scrollLeft.header=-1;this.s.scrollLeft.footer=-1;this.s[c+"Mode"]=a}},_positions:function(){var a=this.s.dt,c=a.table(),d=this.s.position,f=this.dom;c=b(c.node());var e=this._scrollEnabled(),p=b(a.table().header());a=b(a.table().footer());f=f.tbody;var n=c.parent();d.visible=c.is(":visible");d.width=c.outerWidth();d.left=c.offset().left;d.theadTop=p.offset().top;d.tbodyTop=e?n.offset().top:f.offset().top;d.tbodyHeight=e?n.outerHeight():f.outerHeight();d.theadHeight=p.outerHeight();d.theadBottom=d.theadTop+d.theadHeight;a.length?(d.tfootTop=d.tbodyTop+d.tbodyHeight,d.tfootBottom=d.tfootTop+a.outerHeight(),d.tfootHeight=a.outerHeight()):(d.tfootTop=d.tbodyTop+f.outerHeight(),d.tfootBottom=d.tfootTop,d.tfootHeight=d.tfootTop)},_scroll:function(a){var c=this._scrollEnabled(),d=b(this.s.dt.table().node()).parent(),f=d.offset(),e=d.outerHeight(),p=b(h).scrollLeft(),n=b(h).scrollTop(),q=b(g).height(),r=q+n,m=this.s.position,y=c?f.top:m.tbodyTop,z=c?f.left:m.left;e=c?f.top+e:m.tfootTop;var B=c?d.outerWidth():m.tbodyWidth;r=n+q;this.c.header&&(this.s.enable?!m.visible||n+this.c.headerOffset+m.theadHeight<=y?q="in-place":n+this.c.headerOffset+m.theadHeight>y&&n+this.c.headerOffset<e?(q="in",d=b(b(this.s.dt.table().node()).parent()),n+this.c.headerOffset+m.theadHeight>e||this.dom.header.floatingParent===l?a=!0:this.dom.header.floatingParent.css({top:this.c.headerOffset,position:"fixed"}).append(this.dom.header.floating)):q="below":q="in-place",(a||q!==this.s.headerMode)&&this._modeChange(q,"header",a),this._horizontal("header",p));var w={offset:{top:0,left:0},height:0},x={offset:{top:0,left:0},height:0};this.c.footer&&this.dom.tfoot.length&&(this.s.enable?!m.visible||m.tfootBottom+this.c.footerOffset<=r?m="in-place":e+m.tfootHeight+this.c.footerOffset>r&&y+this.c.footerOffset<r?(m="in",a=!0):m="above":m="in-place",(a||m!==this.s.footerMode)&&this._modeChange(m,"footer",a),this._horizontal("footer",p),a=function(A){return{offset:A.offset(),height:A.outerHeight()}},w=this.dom.header.floating?a(this.dom.header.floating):a(this.dom.thead),x=this.dom.footer.floating?a(this.dom.footer.floating):a(this.dom.tfoot),c&&x.offset.top>n&&(c=n-f.top,r=r+(c>-w.height?c:0)-(w.offset.top+(c<-w.height?w.height:0)+x.height),0>r&&(r=0),d.outerHeight(r),Math.round(d.outerHeight())>=Math.round(r)?b(this.dom.tfoot.parent()).addClass("fixedHeader-floating"):b(this.dom.tfoot.parent()).removeClass("fixedHeader-floating")));this.dom.header.floating&&this.dom.header.floatingParent.css("left",z-p);this.dom.footer.floating&&this.dom.footer.floatingParent.css("left",z-p);this.s.dt.settings()[0]._fixedColumns!==l&&(d=function(A,C,u){u===l&&(u=b("div.dtfc-"+A+"-"+C+"-blocker"),u=0===u.length?null:u.clone().appendTo("body").css("z-index",1));null!==u&&u.css({top:"top"===C?w.offset.top:x.offset.top,left:"right"===A?z+B-u.width():z});return u},this.dom.header.rightBlocker=d("right","top",this.dom.header.rightBlocker),this.dom.header.leftBlocker=d("left","top",this.dom.header.leftBlocker),this.dom.footer.rightBlocker=d("right","bottom",this.dom.footer.rightBlocker),this.dom.footer.leftBlocker=d("left","bottom",this.dom.footer.leftBlocker))},_scrollEnabled:function(){var a=this.s.dt.settings()[0].oScroll;return""!==a.sY||""!==a.sX?!0:!1}});t.version="3.2.0";t.defaults={header:!0,footer:!1,headerOffset:0,footerOffset:0};b.fn.dataTable.FixedHeader=t;b.fn.DataTable.FixedHeader=t;b(h).on("init.dt.dtfh",function(a,c,d){"dt"===a.namespace&&(a=c.oInit.fixedHeader,d=k.defaults.fixedHeader,!a&&!d||c._fixedHeader||(d=b.extend({},d,a),!1!==a&&new t(c,d)))});k.Api.register("fixedHeader()",function(){});k.Api.register("fixedHeader.adjust()",function(){return this.iterator("table",function(a){(a=a._fixedHeader)&&a.update()})});k.Api.register("fixedHeader.enable()",function(a){return this.iterator("table",function(c){c=c._fixedHeader;a=a!==l?a:!0;c&&a!==c.enabled()&&c.enable(a)})});k.Api.register("fixedHeader.enabled()",function(){if(this.context.length){var a=this.context[0]._fixedHeader;if(a)return a.enabled()}return!1});k.Api.register("fixedHeader.disable()",function(){return this.iterator("table",function(a){(a=a._fixedHeader)&&a.enabled()&&a.enable(!1)})});b.each(["header","footer"],function(a,c){k.Api.register("fixedHeader."+c+"Offset()",function(d){var f=this.context;return d===l?f.length&&f[0]._fixedHeader?f[0]._fixedHeader[c+"Offset"]():l:this.iterator("table",function(e){if(e=e._fixedHeader)e[c+"Offset"](d)})})});return t});/*! Bootstrap 5 styling wrapper for FixedHeader
* ©2018 SpryMedia Ltd - datatables.net/license
*/(function(factory){if(typeof define==='function'&&define.amd){define(['jquery','datatables.net-bs5','datatables.net-fixedheader'],function($){return factory($,window,document);});}
else if(typeof exports==='object'){module.exports=function(root,$){if(!root){root=window;}
if(!$||!$.fn.dataTable){$=require('datatables.net-bs5')(root,$).$;}
if(!$.fn.dataTable.FixedHeader){require('datatables.net-fixedheader')(root,$);}
return factory($,root,root.document);};}
else{factory(jQuery,window,document);}}(function($,window,document,undefined){return $.fn.dataTable;}));/*!
Copyright 2014-2021 SpryMedia Ltd.
This source file is free software, available under the following license:
MIT license - http://datatables.net/license/mit
This source file is distributed in the hope that it will be useful, but
WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
For details please refer to: http://www.datatables.net
Responsive 2.2.9
2014-2021 SpryMedia Ltd - datatables.net/license
*/var $jscomp=$jscomp||{};$jscomp.scope={};$jscomp.findInternal=function(b,k,m){b instanceof String&&(b=String(b));for(var n=b.length,p=0;p<n;p++){var y=b[p];if(k.call(m,y,p,b))return{i:p,v:y}}return{i:-1,v:void 0}};$jscomp.ASSUME_ES5=!1;$jscomp.ASSUME_NO_NATIVE_MAP=!1;$jscomp.ASSUME_NO_NATIVE_SET=!1;$jscomp.SIMPLE_FROUND_POLYFILL=!1;$jscomp.ISOLATE_POLYFILLS=!1;$jscomp.defineProperty=$jscomp.ASSUME_ES5||"function"==typeof Object.defineProperties?Object.defineProperty:function(b,k,m){if(b==Array.prototype||b==Object.prototype)return b;b[k]=m.value;return b};$jscomp.getGlobal=function(b){b=["object"==typeof globalThis&&globalThis,b,"object"==typeof window&&window,"object"==typeof self&&self,"object"==typeof global&&global];for(var k=0;k<b.length;++k){var m=b[k];if(m&&m.Math==Math)return m}throw Error("Cannot find global object");};$jscomp.global=$jscomp.getGlobal(this);$jscomp.IS_SYMBOL_NATIVE="function"===typeof Symbol&&"symbol"===typeof Symbol("x");$jscomp.TRUST_ES6_POLYFILLS=!$jscomp.ISOLATE_POLYFILLS||$jscomp.IS_SYMBOL_NATIVE;$jscomp.polyfills={};$jscomp.propertyToPolyfillSymbol={};$jscomp.POLYFILL_PREFIX="$jscp$";var $jscomp$lookupPolyfilledValue=function(b,k){var m=$jscomp.propertyToPolyfillSymbol[k];if(null==m)return b[k];m=b[m];return void 0!==m?m:b[k]};$jscomp.polyfill=function(b,k,m,n){k&&($jscomp.ISOLATE_POLYFILLS?$jscomp.polyfillIsolated(b,k,m,n):$jscomp.polyfillUnisolated(b,k,m,n))};$jscomp.polyfillUnisolated=function(b,k,m,n){m=$jscomp.global;b=b.split(".");for(n=0;n<b.length-1;n++){var p=b[n];if(!(p in m))return;m=m[p]}b=b[b.length-1];n=m[b];k=k(n);k!=n&&null!=k&&$jscomp.defineProperty(m,b,{configurable:!0,writable:!0,value:k})};$jscomp.polyfillIsolated=function(b,k,m,n){var p=b.split(".");b=1===p.length;n=p[0];n=!b&&n in $jscomp.polyfills?$jscomp.polyfills:$jscomp.global;for(var y=0;y<p.length-1;y++){var z=p[y];if(!(z in n))return;n=n[z]}p=p[p.length-1];m=$jscomp.IS_SYMBOL_NATIVE&&"es6"===m?n[p]:null;k=k(m);null!=k&&(b?$jscomp.defineProperty($jscomp.polyfills,p,{configurable:!0,writable:!0,value:k}):k!==m&&($jscomp.propertyToPolyfillSymbol[p]=$jscomp.IS_SYMBOL_NATIVE?$jscomp.global.Symbol(p):$jscomp.POLYFILL_PREFIX+p,p=$jscomp.propertyToPolyfillSymbol[p],$jscomp.defineProperty(n,p,{configurable:!0,writable:!0,value:k})))};$jscomp.polyfill("Array.prototype.find",function(b){return b?b:function(k,m){return $jscomp.findInternal(this,k,m).v}},"es6","es3");(function(b){"function"===typeof define&&define.amd?define(["jquery","datatables.net"],function(k){return b(k,window,document)}):"object"===typeof exports?module.exports=function(k,m){k||(k=window);m&&m.fn.dataTable||(m=require("datatables.net")(k,m).$);return b(m,k,k.document)}:b(jQuery,window,document)})(function(b,k,m,n){function p(a,c,d){var f=c+"-"+d;if(A[f])return A[f];var g=[];a=a.cell(c,d).node().childNodes;c=0;for(d=a.length;c<d;c++)g.push(a[c]);return A[f]=g}function y(a,c,d){var f=c+"-"+
d;if(A[f]){a=a.cell(c,d).node();d=A[f][0].parentNode.childNodes;c=[];for(var g=0,l=d.length;g<l;g++)c.push(d[g]);d=0;for(g=c.length;d<g;d++)a.appendChild(c[d]);A[f]=n}}var z=b.fn.dataTable,u=function(a,c){if(!z.versionCheck||!z.versionCheck("1.10.10"))throw"DataTables Responsive requires DataTables 1.10.10 or newer";this.s={dt:new z.Api(a),columns:[],current:[]};this.s.dt.settings()[0].responsive||(c&&"string"===typeof c.details?c.details={type:c.details}:c&&!1===c.details?c.details={type:!1}:c&&!0===c.details&&(c.details={type:"inline"}),this.c=b.extend(!0,{},u.defaults,z.defaults.responsive,c),a.responsive=this,this._constructor())};b.extend(u.prototype,{_constructor:function(){var a=this,c=this.s.dt,d=c.settings()[0],f=b(k).innerWidth();c.settings()[0]._responsive=this;b(k).on("resize.dtr orientationchange.dtr",z.util.throttle(function(){var g=b(k).innerWidth();g!==f&&(a._resize(),f=g)}));d.oApi._fnCallbackReg(d,"aoRowCreatedCallback",function(g,l,h){-1!==b.inArray(!1,a.s.current)&&b(">td, >th",g).each(function(e){e=c.column.index("toData",e);!1===a.s.current[e]&&b(this).css("display","none")})});c.on("destroy.dtr",function(){c.off(".dtr");b(c.table().body()).off(".dtr");b(k).off("resize.dtr orientationchange.dtr");c.cells(".dtr-control").nodes().to$().removeClass("dtr-control");b.each(a.s.current,function(g,l){!1===l&&a._setColumnVis(g,!0)})});this.c.breakpoints.sort(function(g,l){return g.width<l.width?1:g.width>l.width?-1:0});this._classLogic();this._resizeAuto();d=this.c.details;!1!==d.type&&(a._detailsInit(),c.on("column-visibility.dtr",function(){a._timer&&clearTimeout(a._timer);a._timer=setTimeout(function(){a._timer=null;a._classLogic();a._resizeAuto();a._resize(!0);a._redrawChildren()},100)}),c.on("draw.dtr",function(){a._redrawChildren()}),b(c.table().node()).addClass("dtr-"+d.type));c.on("column-reorder.dtr",function(g,l,h){a._classLogic();a._resizeAuto();a._resize(!0)});c.on("column-sizing.dtr",function(){a._resizeAuto();a._resize()});c.on("preXhr.dtr",function(){var g=[];c.rows().every(function(){this.child.isShown()&&g.push(this.id(!0))});c.one("draw.dtr",function(){a._resizeAuto();a._resize();c.rows(g).every(function(){a._detailsDisplay(this,!1)})})});c.on("draw.dtr",function(){a._controlClass()}).on("init.dtr",function(g,l,h){"dt"===g.namespace&&(a._resizeAuto(),a._resize(),b.inArray(!1,a.s.current)&&c.columns.adjust())});this._resize()},_columnsVisiblity:function(a){var c=this.s.dt,d=this.s.columns,f,g=d.map(function(t,v){return{columnIdx:v,priority:t.priority}}).sort(function(t,v){return t.priority!==v.priority?t.priority-v.priority:t.columnIdx-v.columnIdx}),l=b.map(d,function(t,v){return!1===c.column(v).visible()?"not-visible":t.auto&&null===t.minWidth?!1:!0===t.auto?"-":-1!==b.inArray(a,t.includeIn)}),h=0;var e=0;for(f=l.length;e<f;e++)!0===l[e]&&(h+=d[e].minWidth);e=c.settings()[0].oScroll;e=e.sY||e.sX?e.iBarWidth:0;h=c.table().container().offsetWidth-e-h;e=0;for(f=l.length;e<f;e++)d[e].control&&(h-=d[e].minWidth);var r=!1;e=0;for(f=g.length;e<f;e++){var q=g[e].columnIdx;"-"===l[q]&&!d[q].control&&d[q].minWidth&&(r||0>h-d[q].minWidth?(r=!0,l[q]=!1):l[q]=!0,h-=d[q].minWidth)}g=!1;e=0;for(f=d.length;e<f;e++)if(!d[e].control&&!d[e].never&&!1===l[e]){g=!0;break}e=0;for(f=d.length;e<f;e++)d[e].control&&(l[e]=g),"not-visible"===l[e]&&(l[e]=!1);-1===b.inArray(!0,l)&&(l[0]=!0);return l},_classLogic:function(){var a=this,c=this.c.breakpoints,d=this.s.dt,f=d.columns().eq(0).map(function(h){var e=this.column(h),r=e.header().className;h=d.settings()[0].aoColumns[h].responsivePriority;e=e.header().getAttribute("data-priority");h===n&&(h=e===n||null===e?1E4:1*e);return{className:r,includeIn:[],auto:!1,control:!1,never:r.match(/\bnever\b/)?!0:!1,priority:h}}),g=function(h,e){h=f[h].includeIn;-1===b.inArray(e,h)&&h.push(e)},l=function(h,e,r,q){if(!r)f[h].includeIn.push(e);else if("max-"===r)for(q=a._find(e).width,e=0,r=c.length;e<r;e++)c[e].width<=q&&g(h,c[e].name);else if("min-"===r)for(q=a._find(e).width,e=0,r=c.length;e<r;e++)c[e].width>=q&&g(h,c[e].name);else if("not-"===r)for(e=0,r=c.length;e<r;e++)-1===c[e].name.indexOf(q)&&g(h,c[e].name)};f.each(function(h,e){for(var r=h.className.split(" "),q=!1,t=0,v=r.length;t<v;t++){var B=r[t].trim();if("all"===B){q=!0;h.includeIn=b.map(c,function(w){return w.name});return}if("none"===B||h.never){q=!0;return}if("control"===B||"dtr-control"===B){q=!0;h.control=!0;return}b.each(c,function(w,D){w=D.name.split("-");var x=B.match(new RegExp("(min\\-|max\\-|not\\-)?("+w[0]+")(\\-[_a-zA-Z0-9])?"));x&&(q=!0,x[2]===w[0]&&x[3]==="-"+w[1]?l(e,D.name,x[1],x[2]+x[3]):x[2]!==w[0]||x[3]||l(e,D.name,x[1],x[2]))})}q||(h.auto=!0)});this.s.columns=f},_controlClass:function(){if("inline"===this.c.details.type){var a=this.s.dt,c=b.inArray(!0,this.s.current);a.cells(null,function(d){return d!==c},{page:"current"}).nodes().to$().filter(".dtr-control").removeClass("dtr-control");a.cells(null,c,{page:"current"}).nodes().to$().addClass("dtr-control")}},_detailsDisplay:function(a,c){var d=this,f=this.s.dt,g=this.c.details;if(g&&!1!==g.type){var l=g.display(a,c,function(){return g.renderer(f,a[0],d._detailsObj(a[0]))});!0!==l&&!1!==l||b(f.table().node()).triggerHandler("responsive-display.dt",[f,a,l,c])}},_detailsInit:function(){var a=this,c=this.s.dt,d=this.c.details;"inline"===d.type&&(d.target="td.dtr-control, th.dtr-control");c.on("draw.dtr",function(){a._tabIndexes()});a._tabIndexes();b(c.table().body()).on("keyup.dtr","td, th",function(g){13===g.keyCode&&b(this).data("dtr-keyboard")&&b(this).click()});var f=d.target;d="string"===typeof f?f:"td, th";if(f!==n||null!==f)b(c.table().body()).on("click.dtr mousedown.dtr mouseup.dtr",d,function(g){if(b(c.table().node()).hasClass("collapsed")&&-1!==b.inArray(b(this).closest("tr").get(0),c.rows().nodes().toArray())){if("number"===typeof f){var l=0>f?c.columns().eq(0).length+f:f;if(c.cell(this).index().column!==l)return}l=c.row(b(this).closest("tr"));"click"===g.type?a._detailsDisplay(l,!1):"mousedown"===g.type?b(this).css("outline","none"):"mouseup"===g.type&&b(this).trigger("blur").css("outline","")}})},_detailsObj:function(a){var c=this,d=this.s.dt;return b.map(this.s.columns,function(f,g){if(!f.never&&!f.control)return f=d.settings()[0].aoColumns[g],{className:f.sClass,columnIndex:g,data:d.cell(a,g).render(c.c.orthogonal),hidden:d.column(g).visible()&&!c.s.current[g],rowIndex:a,title:null!==f.sTitle?f.sTitle:b(d.column(g).header()).text()}})},_find:function(a){for(var c=this.c.breakpoints,d=0,f=c.length;d<f;d++)if(c[d].name===a)return c[d]},_redrawChildren:function(){var a=this,c=this.s.dt;c.rows({page:"current"}).iterator("row",function(d,f){c.row(f);a._detailsDisplay(c.row(f),!0)})},_resize:function(a){var c=this,d=this.s.dt,f=b(k).innerWidth(),g=this.c.breakpoints,l=g[0].name,h=this.s.columns,e,r=this.s.current.slice();for(e=g.length-1;0<=e;e--)if(f<=g[e].width){l=g[e].name;break}var q=this._columnsVisiblity(l);this.s.current=q;g=!1;e=0;for(f=h.length;e<f;e++)if(!1===q[e]&&!h[e].never&&!h[e].control&&!1===!d.column(e).visible()){g=!0;break}b(d.table().node()).toggleClass("collapsed",g);var t=!1,v=0;d.columns().eq(0).each(function(B,w){!0===q[w]&&v++;if(a||q[w]!==r[w])t=!0,c._setColumnVis(B,q[w])});t&&(this._redrawChildren(),b(d.table().node()).trigger("responsive-resize.dt",[d,this.s.current]),0===d.page.info().recordsDisplay&&b("td",d.table().body()).eq(0).attr("colspan",v));c._controlClass()},_resizeAuto:function(){var a=this.s.dt,c=this.s.columns;if(this.c.auto&&-1!==b.inArray(!0,b.map(c,function(e){return e.auto}))){b.isEmptyObject(A)||b.each(A,function(e){e=e.split("-");y(a,1*e[0],1*e[1])});a.table().node();var d=a.table().node().cloneNode(!1),f=b(a.table().header().cloneNode(!1)).appendTo(d),g=b(a.table().body()).clone(!1,!1).empty().appendTo(d);d.style.width="auto";var l=a.columns().header().filter(function(e){return a.column(e).visible()}).to$().clone(!1).css("display","table-cell").css("width","auto").css("min-width",0);b(g).append(b(a.rows({page:"current"}).nodes()).clone(!1)).find("th, td").css("display","");if(g=a.table().footer()){g=b(g.cloneNode(!1)).appendTo(d);var h=a.columns().footer().filter(function(e){return a.column(e).visible()}).to$().clone(!1).css("display","table-cell");b("<tr/>").append(h).appendTo(g)}b("<tr/>").append(l).appendTo(f);"inline"===this.c.details.type&&b(d).addClass("dtr-inline collapsed");b(d).find("[name]").removeAttr("name");b(d).css("position","relative");d=b("<div/>").css({width:1,height:1,overflow:"hidden",clear:"both"}).append(d);d.insertBefore(a.table().node());l.each(function(e){e=a.column.index("fromVisible",e);c[e].minWidth=this.offsetWidth||0});d.remove()}},_responsiveOnlyHidden:function(){var a=this.s.dt;return b.map(this.s.current,function(c,d){return!1===a.column(d).visible()?!0:c})},_setColumnVis:function(a,c){var d=this.s.dt;c=c?"":"none";b(d.column(a).header()).css("display",c);b(d.column(a).footer()).css("display",c);d.column(a).nodes().to$().css("display",c);b.isEmptyObject(A)||d.cells(null,a).indexes().each(function(f){y(d,f.row,f.column)})},_tabIndexes:function(){var a=this.s.dt,c=a.cells({page:"current"}).nodes().to$(),d=a.settings()[0],f=this.c.details.target;c.filter("[data-dtr-keyboard]").removeData("[data-dtr-keyboard]");"number"===typeof f?a.cells(null,f,{page:"current"}).nodes().to$().attr("tabIndex",d.iTabIndex).data("dtr-keyboard",1):("td:first-child, th:first-child"===f&&(f=">td:first-child, >th:first-child"),b(f,a.rows({page:"current"}).nodes()).attr("tabIndex",d.iTabIndex).data("dtr-keyboard",1))}});u.breakpoints=[{name:"desktop",width:Infinity},{name:"tablet-l",width:1024},{name:"tablet-p",width:768},{name:"mobile-l",width:480},{name:"mobile-p",width:320}];u.display={childRow:function(a,c,d){if(c){if(b(a.node()).hasClass("parent"))return a.child(d(),"child").show(),!0}else{if(a.child.isShown())return a.child(!1),b(a.node()).removeClass("parent"),!1;a.child(d(),"child").show();b(a.node()).addClass("parent");return!0}},childRowImmediate:function(a,c,d){if(!c&&a.child.isShown()||!a.responsive.hasHidden())return a.child(!1),b(a.node()).removeClass("parent"),!1;a.child(d(),"child").show();b(a.node()).addClass("parent");return!0},modal:function(a){return function(c,d,f){if(d)b("div.dtr-modal-content").empty().append(f());else{var g=function(){l.remove();b(m).off("keypress.dtr")},l=b('<div class="dtr-modal"/>').append(b('<div class="dtr-modal-display"/>').append(b('<div class="dtr-modal-content"/>').append(f())).append(b('<div class="dtr-modal-close">&times;</div>').click(function(){g()}))).append(b('<div class="dtr-modal-background"/>').click(function(){g()})).appendTo("body");b(m).on("keyup.dtr",function(h){27===h.keyCode&&(h.stopPropagation(),g())})}a&&a.header&&b("div.dtr-modal-content").prepend("<h2>"+a.header(c)+"</h2>")}}};var A={};u.renderer={listHiddenNodes:function(){return function(a,c,d){var f=b('<ul data-dtr-index="'+c+'" class="dtr-details"/>'),g=!1;b.each(d,function(l,h){h.hidden&&(b("<li "+(h.className?'class="'+h.className+'"':"")+' data-dtr-index="'+h.columnIndex+'" data-dt-row="'+h.rowIndex+'" data-dt-column="'+h.columnIndex+'"><span class="dtr-title">'+h.title+"</span> </li>").append(b('<span class="dtr-data"/>').append(p(a,h.rowIndex,h.columnIndex))).appendTo(f),g=!0)});return g?f:!1}},listHidden:function(){return function(a,c,d){return(a=b.map(d,function(f){var g=f.className?'class="'+f.className+'"':"";return f.hidden?"<li "+g+' data-dtr-index="'+f.columnIndex+'" data-dt-row="'+f.rowIndex+'" data-dt-column="'+f.columnIndex+'"><span class="dtr-title">'+f.title+'</span> <span class="dtr-data">'+f.data+"</span></li>":""}).join(""))?b('<ul data-dtr-index="'+c+'" class="dtr-details"/>').append(a):!1}},tableAll:function(a){a=b.extend({tableClass:""},a);return function(c,d,f){c=b.map(f,function(g){return"<tr "+(g.className?'class="'+g.className+'"':"")+' data-dt-row="'+g.rowIndex+'" data-dt-column="'+g.columnIndex+'"><td>'+g.title+":</td> <td>"+g.data+"</td></tr>"}).join("");return b('<table class="'+a.tableClass+' dtr-details" width="100%"/>').append(c)}}};u.defaults={breakpoints:u.breakpoints,auto:!0,details:{display:u.display.childRow,renderer:u.renderer.listHidden(),target:0,type:"inline"},orthogonal:"display"};var C=b.fn.dataTable.Api;C.register("responsive()",function(){return this});C.register("responsive.index()",function(a){a=b(a);return{column:a.data("dtr-index"),row:a.parent().data("dtr-index")}});C.register("responsive.rebuild()",function(){return this.iterator("table",function(a){a._responsive&&a._responsive._classLogic()})});C.register("responsive.recalc()",function(){return this.iterator("table",function(a){a._responsive&&(a._responsive._resizeAuto(),a._responsive._resize())})});C.register("responsive.hasHidden()",function(){var a=this.context[0];return a._responsive?-1!==b.inArray(!1,a._responsive._responsiveOnlyHidden()):!1});C.registerPlural("columns().responsiveHidden()","column().responsiveHidden()",function(){return this.iterator("column",function(a,c){return a._responsive?a._responsive._responsiveOnlyHidden()[c]:!1},1)});u.version="2.2.9";b.fn.dataTable.Responsive=u;b.fn.DataTable.Responsive=u;b(m).on("preInit.dt.dtr",function(a,c,d){"dt"===a.namespace&&(b(c.nTable).hasClass("responsive")||b(c.nTable).hasClass("dt-responsive")||c.oInit.responsive||z.defaults.responsive)&&(a=c.oInit.responsive,!1!==a&&new u(c,b.isPlainObject(a)?a:{}))});return u});/*!
Bootstrap 5 integration for DataTables' Responsive
©2021 SpryMedia Ltd - datatables.net/license
*/var $jscomp=$jscomp||{};$jscomp.scope={};$jscomp.findInternal=function(a,b,c){a instanceof String&&(a=String(a));for(var e=a.length,d=0;d<e;d++){var f=a[d];if(b.call(c,f,d,a))return{i:d,v:f}}return{i:-1,v:void 0}};$jscomp.ASSUME_ES5=!1;$jscomp.ASSUME_NO_NATIVE_MAP=!1;$jscomp.ASSUME_NO_NATIVE_SET=!1;$jscomp.SIMPLE_FROUND_POLYFILL=!1;$jscomp.ISOLATE_POLYFILLS=!1;$jscomp.defineProperty=$jscomp.ASSUME_ES5||"function"==typeof Object.defineProperties?Object.defineProperty:function(a,b,c){if(a==Array.prototype||a==Object.prototype)return a;a[b]=c.value;return a};$jscomp.getGlobal=function(a){a=["object"==typeof globalThis&&globalThis,a,"object"==typeof window&&window,"object"==typeof self&&self,"object"==typeof global&&global];for(var b=0;b<a.length;++b){var c=a[b];if(c&&c.Math==Math)return c}throw Error("Cannot find global object");};$jscomp.global=$jscomp.getGlobal(this);$jscomp.IS_SYMBOL_NATIVE="function"===typeof Symbol&&"symbol"===typeof Symbol("x");$jscomp.TRUST_ES6_POLYFILLS=!$jscomp.ISOLATE_POLYFILLS||$jscomp.IS_SYMBOL_NATIVE;$jscomp.polyfills={};$jscomp.propertyToPolyfillSymbol={};$jscomp.POLYFILL_PREFIX="$jscp$";var $jscomp$lookupPolyfilledValue=function(a,b){var c=$jscomp.propertyToPolyfillSymbol[b];if(null==c)return a[b];c=a[c];return void 0!==c?c:a[b]};$jscomp.polyfill=function(a,b,c,e){b&&($jscomp.ISOLATE_POLYFILLS?$jscomp.polyfillIsolated(a,b,c,e):$jscomp.polyfillUnisolated(a,b,c,e))};$jscomp.polyfillUnisolated=function(a,b,c,e){c=$jscomp.global;a=a.split(".");for(e=0;e<a.length-1;e++){var d=a[e];if(!(d in c))return;c=c[d]}a=a[a.length-1];e=c[a];b=b(e);b!=e&&null!=b&&$jscomp.defineProperty(c,a,{configurable:!0,writable:!0,value:b})};$jscomp.polyfillIsolated=function(a,b,c,e){var d=a.split(".");a=1===d.length;e=d[0];e=!a&&e in $jscomp.polyfills?$jscomp.polyfills:$jscomp.global;for(var f=0;f<d.length-1;f++){var g=d[f];if(!(g in e))return;e=e[g]}d=d[d.length-1];c=$jscomp.IS_SYMBOL_NATIVE&&"es6"===c?e[d]:null;b=b(c);null!=b&&(a?$jscomp.defineProperty($jscomp.polyfills,d,{configurable:!0,writable:!0,value:b}):b!==c&&($jscomp.propertyToPolyfillSymbol[d]=$jscomp.IS_SYMBOL_NATIVE?$jscomp.global.Symbol(d):$jscomp.POLYFILL_PREFIX+d,d=$jscomp.propertyToPolyfillSymbol[d],$jscomp.defineProperty(e,d,{configurable:!0,writable:!0,value:b})))};$jscomp.polyfill("Array.prototype.find",function(a){return a?a:function(b,c){return $jscomp.findInternal(this,b,c).v}},"es6","es3");(function(a){"function"===typeof define&&define.amd?define(["jquery","datatables.net-bs5","datatables.net-responsive"],function(b){return a(b,window,document)}):"object"===typeof exports?module.exports=function(b,c){b||(b=window);c&&c.fn.dataTable||(c=require("datatables.net-bs5")(b,c).$);c.fn.dataTable.Responsive||require("datatables.net-responsive")(b,c);return a(c,b,b.document)}:a(jQuery,window,document)})(function(a,b,c,e){b=a.fn.dataTable;c=b.Responsive.display;var d=c.modal,f=a('<div class="modal fade dtr-bs-modal" role="dialog"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div><div class="modal-body"/></div></div></div>'),g;a(function(){g=new bootstrap.Modal(f[0])});c.modal=function(k){return function(l,h,m){if(!a.fn.modal)d(l,h,m);else if(!h){if(k&&k.header){h=f.find("div.modal-header");var n=h.find("button").detach();h.empty().append('<h4 class="modal-title">'+k.header(l)+"</h4>").append(n)}f.find("div.modal-body").empty().append(m());f.appendTo("body").modal();g.show()}}};return b.Responsive});/*!
Copyright 2017-2021 SpryMedia Ltd.
This source file is free software, available under the following license:
MIT license - http://datatables.net/license/mit
This source file is distributed in the hope that it will be useful, but
WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
For details please refer to: http://www.datatables.net
RowGroup 1.1.4
©2017-2021 SpryMedia Ltd - datatables.net/license
*/var $jscomp=$jscomp||{};$jscomp.scope={};$jscomp.findInternal=function(b,c,d){b instanceof String&&(b=String(b));for(var g=b.length,e=0;e<g;e++){var k=b[e];if(c.call(d,k,e,b))return{i:e,v:k}}return{i:-1,v:void 0}};$jscomp.ASSUME_ES5=!1;$jscomp.ASSUME_NO_NATIVE_MAP=!1;$jscomp.ASSUME_NO_NATIVE_SET=!1;$jscomp.SIMPLE_FROUND_POLYFILL=!1;$jscomp.ISOLATE_POLYFILLS=!1;$jscomp.defineProperty=$jscomp.ASSUME_ES5||"function"==typeof Object.defineProperties?Object.defineProperty:function(b,c,d){if(b==Array.prototype||b==Object.prototype)return b;b[c]=d.value;return b};$jscomp.getGlobal=function(b){b=["object"==typeof globalThis&&globalThis,b,"object"==typeof window&&window,"object"==typeof self&&self,"object"==typeof global&&global];for(var c=0;c<b.length;++c){var d=b[c];if(d&&d.Math==Math)return d}throw Error("Cannot find global object");};$jscomp.global=$jscomp.getGlobal(this);$jscomp.IS_SYMBOL_NATIVE="function"===typeof Symbol&&"symbol"===typeof Symbol("x");$jscomp.TRUST_ES6_POLYFILLS=!$jscomp.ISOLATE_POLYFILLS||$jscomp.IS_SYMBOL_NATIVE;$jscomp.polyfills={};$jscomp.propertyToPolyfillSymbol={};$jscomp.POLYFILL_PREFIX="$jscp$";var $jscomp$lookupPolyfilledValue=function(b,c){var d=$jscomp.propertyToPolyfillSymbol[c];if(null==d)return b[c];d=b[d];return void 0!==d?d:b[c]};$jscomp.polyfill=function(b,c,d,g){c&&($jscomp.ISOLATE_POLYFILLS?$jscomp.polyfillIsolated(b,c,d,g):$jscomp.polyfillUnisolated(b,c,d,g))};$jscomp.polyfillUnisolated=function(b,c,d,g){d=$jscomp.global;b=b.split(".");for(g=0;g<b.length-1;g++){var e=b[g];if(!(e in d))return;d=d[e]}b=b[b.length-1];g=d[b];c=c(g);c!=g&&null!=c&&$jscomp.defineProperty(d,b,{configurable:!0,writable:!0,value:c})};$jscomp.polyfillIsolated=function(b,c,d,g){var e=b.split(".");b=1===e.length;g=e[0];g=!b&&g in $jscomp.polyfills?$jscomp.polyfills:$jscomp.global;for(var k=0;k<e.length-1;k++){var a=e[k];if(!(a in g))return;g=g[a]}e=e[e.length-1];d=$jscomp.IS_SYMBOL_NATIVE&&"es6"===d?g[e]:null;c=c(d);null!=c&&(b?$jscomp.defineProperty($jscomp.polyfills,e,{configurable:!0,writable:!0,value:c}):c!==d&&($jscomp.propertyToPolyfillSymbol[e]=$jscomp.IS_SYMBOL_NATIVE?$jscomp.global.Symbol(e):$jscomp.POLYFILL_PREFIX+e,e=$jscomp.propertyToPolyfillSymbol[e],$jscomp.defineProperty(g,e,{configurable:!0,writable:!0,value:c})))};$jscomp.polyfill("Array.prototype.find",function(b){return b?b:function(c,d){return $jscomp.findInternal(this,c,d).v}},"es6","es3");(function(b){"function"===typeof define&&define.amd?define(["jquery","datatables.net"],function(c){return b(c,window,document)}):"object"===typeof exports?module.exports=function(c,d){c||(c=window);d&&d.fn.dataTable||(d=require("datatables.net")(c,d).$);return b(d,c,c.document)}:b(jQuery,window,document)})(function(b,c,d,g){var e=b.fn.dataTable,k=function(a,f){if(!e.versionCheck||!e.versionCheck("1.10.8"))throw"RowGroup requires DataTables 1.10.8 or newer";this.c=b.extend(!0,{},e.defaults.rowGroup,k.defaults,f);this.s={dt:new e.Api(a)};this.dom={};a=this.s.dt.settings()[0];if(f=a.rowGroup)return f;a.rowGroup=this;this._constructor()};b.extend(k.prototype,{dataSrc:function(a){if(a===g)return this.c.dataSrc;var f=this.s.dt;this.c.dataSrc=a;b(f.table().node()).triggerHandler("rowgroup-datasrc.dt",[f,a]);return this},disable:function(){this.c.enable=!1;return this},enable:function(a){if(!1===a)return this.disable();this.c.enable=!0;return this},enabled:function(){return this.c.enable},_constructor:function(){var a=this,f=this.s.dt,h=f.settings()[0];f.on("draw.dtrg",function(m,r){a.c.enable&&h===r&&a._draw()});f.on("column-visibility.dt.dtrg responsive-resize.dt.dtrg",function(){a._adjustColspan()});f.on("destroy",function(){f.off(".dtrg")})},_adjustColspan:function(){b("tr."+this.c.className,this.s.dt.table().body()).find("td:visible").attr("colspan",this._colspan())},_colspan:function(){return this.s.dt.columns().visible().reduce(function(a,f){return a+f},0)},_draw:function(){var a=this._group(0,this.s.dt.rows({page:"current"}).indexes());this._groupDisplay(0,a)},_group:function(a,f){for(var h=Array.isArray(this.c.dataSrc)?this.c.dataSrc:[this.c.dataSrc],m=e.ext.oApi._fnGetObjectDataFn(h[a]),r=this.s.dt,n,q,p=[],l=0,t=f.length;l<t;l++){var u=f[l];n=r.row(u).data();n=m(n);if(null===n||n===g)n=this.c.emptyDataGroup;if(q===g||n!==q)p.push({dataPoint:n,rows:[]}),q=n;p[p.length-1].rows.push(u)}if(h[a+1]!==g)for(l=0,t=p.length;l<t;l++)p[l].children=this._group(a+1,p[l].rows);return p},_groupDisplay:function(a,f){for(var h=this.s.dt,m,r=0,n=f.length;r<n;r++){var q=f[r],p=q.dataPoint,l=q.rows;this.c.startRender&&(m=this.c.startRender.call(this,h.rows(l),p,a),(m=this._rowWrap(m,this.c.startClassName,a))&&m.insertBefore(h.row(l[0]).node()));this.c.endRender&&(m=this.c.endRender.call(this,h.rows(l),p,a),(m=this._rowWrap(m,this.c.endClassName,a))&&m.insertAfter(h.row(l[l.length-1]).node()));q.children&&this._groupDisplay(a+1,q.children)}},_rowWrap:function(a,f,h){if(null===a||""===a)a=this.c.emptyDataGroup;return a===g||null===a?null:("object"===typeof a&&a.nodeName&&"tr"===a.nodeName.toLowerCase()?b(a):a instanceof b&&a.length&&"tr"===a[0].nodeName.toLowerCase()?a:b("<tr/>").append(b("<td/>").attr("colspan",this._colspan()).append(a))).addClass(this.c.className).addClass(f).addClass("dtrg-level-"+h)}});k.defaults={className:"dtrg-group",dataSrc:0,emptyDataGroup:"No group",enable:!0,endClassName:"dtrg-end",endRender:null,startClassName:"dtrg-start",startRender:function(a,f){return f}};k.version="1.1.4";b.fn.dataTable.RowGroup=k;b.fn.DataTable.RowGroup=k;e.Api.register("rowGroup()",function(){return this});e.Api.register("rowGroup().disable()",function(){return this.iterator("table",function(a){a.rowGroup&&a.rowGroup.enable(!1)})});e.Api.register("rowGroup().enable()",function(a){return this.iterator("table",function(f){f.rowGroup&&f.rowGroup.enable(a===g?!0:a)})});e.Api.register("rowGroup().enabled()",function(){var a=this.context;return a.length&&a[0].rowGroup?a[0].rowGroup.enabled():!1});e.Api.register("rowGroup().dataSrc()",function(a){return a===g?this.context[0].rowGroup.dataSrc():this.iterator("table",function(f){f.rowGroup&&f.rowGroup.dataSrc(a)})});b(d).on("preInit.dt.dtrg",function(a,f,h){"dt"===a.namespace&&(a=f.oInit.rowGroup,h=e.defaults.rowGroup,a||h)&&(h=b.extend({},h,a),!1!==a&&new k(f,h))});return k});/*! Bootstrap 5 styling wrapper for RowGroup
* ©2018 SpryMedia Ltd - datatables.net/license
*/(function(factory){if(typeof define==='function'&&define.amd){define(['jquery','datatables.net-bs5','datatables.net-rowgroup'],function($){return factory($,window,document);});}
else if(typeof exports==='object'){module.exports=function(root,$){if(!root){root=window;}
if(!$||!$.fn.dataTable){$=require('datatables.net-bs5')(root,$).$;}
if(!$.fn.dataTable.RowGroup){require('datatables.net-rowgroup')(root,$);}
return factory($,root,root.document);};}
else{factory(jQuery,window,document);}}(function($,window,document,undefined){return $.fn.dataTable;}));/*!
RowReorder 1.2.8
2015-2020 SpryMedia Ltd - datatables.net/license
*/(function(e){"function"===typeof define&&define.amd?define(["jquery","datatables.net"],function(f){return e(f,window,document)}):"object"===typeof exports?module.exports=function(f,g){f||(f=window);if(!g||!g.fn.dataTable)g=require("datatables.net")(f,g).$;return e(g,f,f.document)}:e(jQuery,window,document)})(function(e,f,g,o){var i=e.fn.dataTable,j=function(d,c){if(!i.versionCheck||!i.versionCheck("1.10.8"))throw"DataTables RowReorder requires DataTables 1.10.8 or newer";this.c=e.extend(!0,{},i.defaults.rowReorder,j.defaults,c);this.s={bodyTop:null,dt:new i.Api(d),getDataFn:i.ext.oApi._fnGetObjectDataFn(this.c.dataSrc),middles:null,scroll:{},scrollInterval:null,setDataFn:i.ext.oApi._fnSetObjectDataFn(this.c.dataSrc),start:{top:0,left:0,offsetTop:0,offsetLeft:0,nodes:[]},windowHeight:0,documentOuterHeight:0,domCloneOuterHeight:0};this.dom={clone:null,dtScroll:e("div.dataTables_scrollBody",this.s.dt.table().container())};var b=this.s.dt.settings()[0],a=b.rowreorder;if(a)return a;this.dom.dtScroll.length||(this.dom.dtScroll=e(this.s.dt.table().container(),"tbody"));b.rowreorder=this;this._constructor()};e.extend(j.prototype,{_constructor:function(){var d=this,c=this.s.dt,b=e(c.table().node());"static"===b.css("position")&&b.css("position","relative");e(c.table().container()).on("mousedown.rowReorder touchstart.rowReorder",this.c.selector,function(a){if(d.c.enable){if(e(a.target).is(d.c.excludedChildren))return!0;var b=e(this).closest("tr"),h=c.row(b);if(h.any())return d._emitEvent("pre-row-reorder",{node:h.node(),index:h.index()}),d._mouseDown(a,b),!1}});c.on("destroy.rowReorder",function(){e(c.table().container()).off(".rowReorder");c.off(".rowReorder")})},_cachePositions:function(){var d=this.s.dt,c=e(d.table().node()).find("thead").outerHeight(),b=e.unique(d.rows({page:"current"}).nodes().toArray()),b=e.map(b,function(b){var d=e(b).position().top-c;return(d+d+e(b).outerHeight())/2});this.s.middles=b;this.s.bodyTop=e(d.table().body()).offset().top;this.s.windowHeight=e(f).height();this.s.documentOuterHeight=e(g).outerHeight()},_clone:function(d){var c=e(this.s.dt.table().node().cloneNode(!1)).addClass("dt-rowReorder-float").append("<tbody/>").append(d.clone(!1)),b=d.outerWidth(),a=d.outerHeight(),g=d.children().map(function(){return e(this).width()});c.width(b).height(a).find("tr").children().each(function(b){this.style.width=g[b]+"px"});c.appendTo("body");this.dom.clone=c;this.s.domCloneOuterHeight=c.outerHeight()},_clonePosition:function(d){var c=this.s.start,b=this._eventToPage(d,"Y")-c.top,d=this._eventToPage(d,"X")-
c.left,a=this.c.snapX,b=b+c.offsetTop,c=!0===a?c.offsetLeft:"number"===typeof a?c.offsetLeft+a:d+c.offsetLeft;0>b?b=0:b+this.s.domCloneOuterHeight>this.s.documentOuterHeight&&(b=this.s.documentOuterHeight-this.s.domCloneOuterHeight);this.dom.clone.css({top:b,left:c})},_emitEvent:function(d,c){this.s.dt.iterator("table",function(b){e(b.nTable).triggerHandler(d+".dt",c)})},_eventToPage:function(d,c){return-1!==d.type.indexOf("touch")?d.originalEvent.touches[0]["page"+c]:d["page"+c]},_mouseDown:function(d,c){var b=this,a=this.s.dt,m=this.s.start,h=c.offset();m.top=this._eventToPage(d,"Y");m.left=this._eventToPage(d,"X");m.offsetTop=h.top;m.offsetLeft=h.left;m.nodes=e.unique(a.rows({page:"current"}).nodes().toArray());this._cachePositions();this._clone(c);this._clonePosition(d);this.dom.target=c;c.addClass("dt-rowReorder-moving");e(g).on("mouseup.rowReorder touchend.rowReorder",function(a){b._mouseUp(a)}).on("mousemove.rowReorder touchmove.rowReorder",function(a){b._mouseMove(a)});e(f).width()===e(g).width()&&e(g.body).addClass("dt-rowReorder-noOverflow");a=this.dom.dtScroll;this.s.scroll={windowHeight:e(f).height(),windowWidth:e(f).width(),dtTop:a.length?a.offset().top:null,dtLeft:a.length?a.offset().left:null,dtHeight:a.length?a.outerHeight():null,dtWidth:a.length?a.outerWidth():null}},_mouseMove:function(d){this._clonePosition(d);for(var c=this._eventToPage(d,"Y")-this.s.bodyTop,b=this.s.middles,a=null,g=this.s.dt,h=0,f=b.length;h<f;h++)if(c<b[h]){a=h;break}null===a&&(a=b.length);if(null===this.s.lastInsert||this.s.lastInsert!==a)c=e.unique(g.rows({page:"current"}).nodes().toArray()),a>this.s.lastInsert?this.dom.target.insertAfter(c[a-1]):this.dom.target.insertBefore(c[a]),this._cachePositions(),this.s.lastInsert=a;this._shiftScroll(d)},_mouseUp:function(d){var c=this,b=this.s.dt,a,f,h=this.c.dataSrc;this.dom.clone.remove();this.dom.clone=null;this.dom.target.removeClass("dt-rowReorder-moving");e(g).off(".rowReorder");e(g.body).removeClass("dt-rowReorder-noOverflow");clearInterval(this.s.scrollInterval);this.s.scrollInterval=null;var n=this.s.start.nodes,l=e.unique(b.rows({page:"current"}).nodes().toArray()),j={},i=[],k=[],p=this.s.getDataFn,o=this.s.setDataFn;a=0;for(f=n.length;a<f;a++)if(n[a]!==l[a]){var q=b.row(l[a]).id(),u=b.row(l[a]).data(),r=b.row(n[a]).data();q&&(j[q]=p(r));i.push({node:l[a],oldData:p(u),newData:p(r),newPosition:a,oldPosition:e.inArray(l[a],n)});k.push(l[a])}var s=[i,{dataSrc:h,nodes:k,values:j,triggerRow:b.row(this.dom.target),originalEvent:d}];this._emitEvent("row-reorder",s);var t=function(){if(c.c.update){a=0;for(f=i.length;a<f;a++){var d=b.row(i[a].node).data();o(d,i[a].newData);b.columns().every(function(){this.dataSrc()===h&&b.cell(i[a].node,this.index()).invalidate("data")})}c._emitEvent("row-reordered",s);b.draw(!1)}};this.c.editor?(this.c.enable=!1,this.c.editor.edit(k,!1,e.extend({submit:"changed"},this.c.formOptions)).multiSet(h,j).one("preSubmitCancelled.rowReorder",function(){c.c.enable=!0;c.c.editor.off(".rowReorder");b.draw(!1)}).one("submitUnsuccessful.rowReorder",function(){b.draw(!1)}).one("submitSuccess.rowReorder",function(){t()}).one("submitComplete",function(){c.c.enable=!0;c.c.editor.off(".rowReorder")}).submit()):t()},_shiftScroll:function(d){var c=this,b=this.s.scroll,a=!1,i=d.pageY-g.body.scrollTop,h,j;i<e(f).scrollTop()+65?h=-5:i>b.windowHeight+e(f).scrollTop()-65&&(h=5);null!==b.dtTop&&d.pageY<b.dtTop+65?j=-5:null!==b.dtTop&&d.pageY>b.dtTop+b.dtHeight-65&&(j=5);h||j?(b.windowVert=h,b.dtVert=j,a=!0):this.s.scrollInterval&&(clearInterval(this.s.scrollInterval),this.s.scrollInterval=null);!this.s.scrollInterval&&a&&(this.s.scrollInterval=setInterval(function(){if(b.windowVert){var a=e(g).scrollTop();e(g).scrollTop(a+b.windowVert);if(a!==e(g).scrollTop()){a=parseFloat(c.dom.clone.css("top"));c.dom.clone.css("top",a+b.windowVert)}}if(b.dtVert){a=c.dom.dtScroll[0];if(b.dtVert)a.scrollTop=a.scrollTop+b.dtVert}},20))}});j.defaults={dataSrc:0,editor:null,enable:!0,formOptions:{},selector:"td:first-child",snapX:!1,update:!0,excludedChildren:"a"};var k=e.fn.dataTable.Api;k.register("rowReorder()",function(){return this});k.register("rowReorder.enable()",function(d){d===o&&(d=!0);return this.iterator("table",function(c){c.rowreorder&&(c.rowreorder.c.enable=d)})});k.register("rowReorder.disable()",function(){return this.iterator("table",function(d){d.rowreorder&&(d.rowreorder.c.enable=!1)})});j.version="1.2.8";e.fn.dataTable.RowReorder=j;e.fn.DataTable.RowReorder=j;e(g).on("init.dt.dtr",function(d,c){if("dt"===d.namespace){var b=c.oInit.rowReorder,a=i.defaults.rowReorder;if(b||a)a=e.extend({},b,a),!1!==b&&new j(c,a)}});return j});/*! Bootstrap 5 styling wrapper for RowReorder
* ©2018 SpryMedia Ltd - datatables.net/license
*/(function(factory){if(typeof define==='function'&&define.amd){define(['jquery','datatables.net-bs5','datatables.net-rowreorder'],function($){return factory($,window,document);});}
else if(typeof exports==='object'){module.exports=function(root,$){if(!root){root=window;}
if(!$||!$.fn.dataTable){$=require('datatables.net-bs5')(root,$).$;}
if(!$.fn.dataTable.RowReorder){require('datatables.net-rowreorder')(root,$);}
return factory($,root,root.document);};}
else{factory(jQuery,window,document);}}(function($,window,document,undefined){return $.fn.dataTable;}));/*!
Copyright 2011-2021 SpryMedia Ltd.
This source file is free software, available under the following license:
MIT license - http://datatables.net/license/mit
This source file is distributed in the hope that it will be useful, but
WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
For details please refer to: http://www.datatables.net
Scroller 2.0.5
©2011-2021 SpryMedia Ltd - datatables.net/license
*/var $jscomp=$jscomp||{};$jscomp.scope={};$jscomp.findInternal=function(c,f,g){c instanceof String&&(c=String(c));for(var h=c.length,k=0;k<h;k++){var m=c[k];if(f.call(g,m,k,c))return{i:k,v:m}}return{i:-1,v:void 0}};$jscomp.ASSUME_ES5=!1;$jscomp.ASSUME_NO_NATIVE_MAP=!1;$jscomp.ASSUME_NO_NATIVE_SET=!1;$jscomp.SIMPLE_FROUND_POLYFILL=!1;$jscomp.ISOLATE_POLYFILLS=!1;$jscomp.defineProperty=$jscomp.ASSUME_ES5||"function"==typeof Object.defineProperties?Object.defineProperty:function(c,f,g){if(c==Array.prototype||c==Object.prototype)return c;c[f]=g.value;return c};$jscomp.getGlobal=function(c){c=["object"==typeof globalThis&&globalThis,c,"object"==typeof window&&window,"object"==typeof self&&self,"object"==typeof global&&global];for(var f=0;f<c.length;++f){var g=c[f];if(g&&g.Math==Math)return g}throw Error("Cannot find global object");};$jscomp.global=$jscomp.getGlobal(this);$jscomp.IS_SYMBOL_NATIVE="function"===typeof Symbol&&"symbol"===typeof Symbol("x");$jscomp.TRUST_ES6_POLYFILLS=!$jscomp.ISOLATE_POLYFILLS||$jscomp.IS_SYMBOL_NATIVE;$jscomp.polyfills={};$jscomp.propertyToPolyfillSymbol={};$jscomp.POLYFILL_PREFIX="$jscp$";var $jscomp$lookupPolyfilledValue=function(c,f){var g=$jscomp.propertyToPolyfillSymbol[f];if(null==g)return c[f];g=c[g];return void 0!==g?g:c[f]};$jscomp.polyfill=function(c,f,g,h){f&&($jscomp.ISOLATE_POLYFILLS?$jscomp.polyfillIsolated(c,f,g,h):$jscomp.polyfillUnisolated(c,f,g,h))};$jscomp.polyfillUnisolated=function(c,f,g,h){g=$jscomp.global;c=c.split(".");for(h=0;h<c.length-1;h++){var k=c[h];if(!(k in g))return;g=g[k]}c=c[c.length-1];h=g[c];f=f(h);f!=h&&null!=f&&$jscomp.defineProperty(g,c,{configurable:!0,writable:!0,value:f})};$jscomp.polyfillIsolated=function(c,f,g,h){var k=c.split(".");c=1===k.length;h=k[0];h=!c&&h in $jscomp.polyfills?$jscomp.polyfills:$jscomp.global;for(var m=0;m<k.length-1;m++){var q=k[m];if(!(q in h))return;h=h[q]}k=k[k.length-1];g=$jscomp.IS_SYMBOL_NATIVE&&"es6"===g?h[k]:null;f=f(g);null!=f&&(c?$jscomp.defineProperty($jscomp.polyfills,k,{configurable:!0,writable:!0,value:f}):f!==g&&($jscomp.propertyToPolyfillSymbol[k]=$jscomp.IS_SYMBOL_NATIVE?$jscomp.global.Symbol(k):$jscomp.POLYFILL_PREFIX+k,k=$jscomp.propertyToPolyfillSymbol[k],$jscomp.defineProperty(h,k,{configurable:!0,writable:!0,value:f})))};$jscomp.polyfill("Array.prototype.find",function(c){return c?c:function(f,g){return $jscomp.findInternal(this,f,g).v}},"es6","es3");(function(c){"function"===typeof define&&define.amd?define(["jquery","datatables.net"],function(f){return c(f,window,document)}):"object"===typeof exports?module.exports=function(f,g){f||(f=window);g&&g.fn.dataTable||(g=require("datatables.net")(f,g).$);return c(g,f,f.document)}:c(jQuery,window,document)})(function(c,f,g,h){var k=c.fn.dataTable,m=function(a,b){this instanceof m?(b===h&&(b={}),a=c.fn.dataTable.Api(a),this.s={dt:a.settings()[0],dtApi:a,tableTop:0,tableBottom:0,redrawTop:0,redrawBottom:0,autoHeight:!0,viewportRows:0,stateTO:null,stateSaveThrottle:function(){},drawTO:null,heights:{jump:null,page:null,virtual:null,scroll:null,row:null,viewport:null,labelHeight:0,xbar:0},topRowFloat:0,scrollDrawDiff:null,loaderVisible:!1,forceReposition:!1,baseRowTop:0,baseScrollTop:0,mousedown:!1,lastScrollTop:0},this.s=c.extend(this.s,m.oDefaults,b),this.s.heights.row=this.s.rowHeight,this.dom={force:g.createElement("div"),label:c('<div class="dts_label">0</div>'),scroller:null,table:null,loader:null},this.s.dt.oScroller||(this.s.dt.oScroller=this,this.construct())):alert("Scroller warning: Scroller must be initialised with the 'new' keyword.")};c.extend(m.prototype,{measure:function(a){this.s.autoHeight&&this._calcRowHeight();var b=this.s.heights;b.row&&(b.viewport=this._parseHeight(c(this.dom.scroller).css("max-height")),this.s.viewportRows=parseInt(b.viewport/b.row,10)+1,this.s.dt._iDisplayLength=this.s.viewportRows*this.s.displayBuffer);var d=this.dom.label.outerHeight();b.xbar=this.dom.scroller.offsetHeight-
this.dom.scroller.clientHeight;b.labelHeight=d;(a===h||a)&&this.s.dt.oInstance.fnDraw(!1)},pageInfo:function(){var a=this.dom.scroller.scrollTop,b=this.s.dt.fnRecordsDisplay(),d=Math.ceil(this.pixelsToRow(a+this.s.heights.viewport,!1,this.s.ani));return{start:Math.floor(this.pixelsToRow(a,!1,this.s.ani)),end:b<d?b-1:d-1}},pixelsToRow:function(a,b,d){a-=this.s.baseScrollTop;d=d?(this._domain("physicalToVirtual",this.s.baseScrollTop)+a)/this.s.heights.row:a/this.s.heights.row+this.s.baseRowTop;return b||b===h?parseInt(d,10):d},rowToPixels:function(a,b,d){a-=this.s.baseRowTop;d=d?this._domain("virtualToPhysical",this.s.baseScrollTop):this.s.baseScrollTop;d+=a*this.s.heights.row;return b||b===h?parseInt(d,10):d},scrollToRow:function(a,b){var d=this,e=!1,l=this.rowToPixels(a),n=a-(this.s.displayBuffer-1)/2*this.s.viewportRows;0>n&&(n=0);(l>this.s.redrawBottom||l<this.s.redrawTop)&&this.s.dt._iDisplayStart!==n&&(e=!0,l=this._domain("virtualToPhysical",a*this.s.heights.row),this.s.redrawTop<l&&l<this.s.redrawBottom&&(this.s.forceReposition=!0,b=!1));b===h||b?(this.s.ani=e,c(this.dom.scroller).animate({scrollTop:l},function(){setTimeout(function(){d.s.ani=!1},250)})):c(this.dom.scroller).scrollTop(l)},construct:function(){var a=this,b=this.s.dtApi;if(this.s.dt.oFeatures.bPaginate){this.dom.force.style.position="relative";this.dom.force.style.top="0px";this.dom.force.style.left="0px";this.dom.force.style.width="1px";this.dom.scroller=c("div."+this.s.dt.oClasses.sScrollBody,this.s.dt.nTableWrapper)[0];this.dom.scroller.appendChild(this.dom.force);this.dom.scroller.style.position="relative";this.dom.table=c(">table",this.dom.scroller)[0];this.dom.table.style.position="absolute";this.dom.table.style.top="0px";this.dom.table.style.left="0px";c(b.table().container()).addClass("dts DTS");this.s.loadingIndicator&&(this.dom.loader=c('<div class="dataTables_processing dts_loading">'+this.s.dt.oLanguage.sLoadingRecords+"</div>").css("display","none"),c(this.dom.scroller.parentNode).css("position","relative").append(this.dom.loader));this.dom.label.appendTo(this.dom.scroller);this.s.heights.row&&"auto"!=this.s.heights.row&&(this.s.autoHeight=!1);this.s.ingnoreScroll=!0;c(this.dom.scroller).on("scroll.dt-scroller",function(l){a._scroll.call(a)});c(this.dom.scroller).on("touchstart.dt-scroller",function(){a._scroll.call(a)});c(this.dom.scroller).on("mousedown.dt-scroller",function(){a.s.mousedown=!0}).on("mouseup.dt-scroller",function(){a.s.labelVisible=!1;a.s.mousedown=!1;a.dom.label.css("display","none")});c(f).on("resize.dt-scroller",function(){a.measure(!1);a._info()});var d=!0,e=b.state.loaded();b.on("stateSaveParams.scroller",function(l,n,p){d&&e?(p.scroller=e.scroller,d=!1):p.scroller={topRow:a.s.topRowFloat,baseScrollTop:a.s.baseScrollTop,baseRowTop:a.s.baseRowTop,scrollTop:a.s.lastScrollTop}});e&&e.scroller&&(this.s.topRowFloat=e.scroller.topRow,this.s.baseScrollTop=e.scroller.baseScrollTop,this.s.baseRowTop=e.scroller.baseRowTop);this.measure(!1);a.s.stateSaveThrottle=a.s.dt.oApi._fnThrottle(function(){a.s.dtApi.state.save()},500);b.on("init.scroller",function(){a.measure(!1);a.s.scrollType="jump";a._draw();b.on("draw.scroller",function(){a._draw()})});b.on("preDraw.dt.scroller",function(){a._scrollForce()});b.on("destroy.scroller",function(){c(f).off("resize.dt-scroller");c(a.dom.scroller).off(".dt-scroller");c(a.s.dt.nTable).off(".scroller");c(a.s.dt.nTableWrapper).removeClass("DTS");c("div.DTS_Loading",a.dom.scroller.parentNode).remove();a.dom.table.style.position="";a.dom.table.style.top="";a.dom.table.style.left=""})}else this.s.dt.oApi._fnLog(this.s.dt,0,"Pagination must be enabled for Scroller")},_calcRowHeight:function(){var a=this.s.dt,b=a.nTable,d=b.cloneNode(!1),e=c("<tbody/>").appendTo(d),l=c('<div class="'+a.oClasses.sWrapper+' DTS"><div class="'+a.oClasses.sScrollWrapper+'"><div class="'+a.oClasses.sScrollBody+'"></div></div></div>');c("tbody tr:lt(4)",b).clone().appendTo(e);var n=c("tr",e).length;if(1===n)e.prepend("<tr><td>&#160;</td></tr>"),e.append("<tr><td>&#160;</td></tr>");else for(;3>n;n++)e.append("<tr><td>&#160;</td></tr>");c("div."+a.oClasses.sScrollBody,l).append(d);a=this.s.dt.nHolding||b.parentNode;c(a).is(":visible")||(a="body");l.find("input").removeAttr("name");l.appendTo(a);this.s.heights.row=c("tr",e).eq(1).outerHeight();l.remove()},_draw:function(){var a=this,b=this.s.heights,d=this.dom.scroller.scrollTop,e=c(this.s.dt.nTable).height(),l=this.s.dt._iDisplayStart,n=this.s.dt._iDisplayLength,p=this.s.dt.fnRecordsDisplay();this.s.skip=!0;!this.s.dt.bSorted&&!this.s.dt.bFiltered||0!==l||this.s.dt._drawHold||(this.s.topRowFloat=0);d="jump"===this.s.scrollType?this._domain("virtualToPhysical",this.s.topRowFloat*b.row):d;this.s.baseScrollTop=d;this.s.baseRowTop=this.s.topRowFloat;var r=d-(this.s.topRowFloat-l)*b.row;0===l?r=0:l+n>=p&&(r=b.scroll-e);this.dom.table.style.top=r+"px";this.s.tableTop=r;this.s.tableBottom=e+this.s.tableTop;e=(d-this.s.tableTop)*this.s.boundaryScale;this.s.redrawTop=d-e;this.s.redrawBottom=d+e>b.scroll-b.viewport-b.row?b.scroll-b.viewport-b.row:d+e;this.s.skip=!1;this.s.dt.oFeatures.bStateSave&&null!==this.s.dt.oLoadedState&&"undefined"!=typeof this.s.dt.oLoadedState.scroller?((b=!this.s.dt.sAjaxSource&&!a.s.dt.ajax||this.s.dt.oFeatures.bServerSide?!1:!0)&&2==this.s.dt.iDraw||!b&&1==this.s.dt.iDraw)&&setTimeout(function(){c(a.dom.scroller).scrollTop(a.s.dt.oLoadedState.scroller.scrollTop);setTimeout(function(){a.s.ingnoreScroll=!1},0)},0):a.s.ingnoreScroll=!1;this.s.dt.oFeatures.bInfo&&setTimeout(function(){a._info.call(a)},0);c(this.s.dt.nTable).triggerHandler("position.dts.dt",r);this.dom.loader&&this.s.loaderVisible&&(this.dom.loader.css("display","none"),this.s.loaderVisible=!1)},_domain:function(a,b){var d=this.s.heights;if(d.virtual===d.scroll||1E4>b)return b;if("virtualToPhysical"===a&&b>=d.virtual-1E4)return a=d.virtual-b,d.scroll-a;if("physicalToVirtual"===a&&b>=d.scroll-1E4)return a=d.scroll-b,d.virtual-a;d=(d.virtual-1E4-1E4)/(d.scroll-1E4-1E4);var e=1E4-1E4*d;return"virtualToPhysical"===a?(b-e)/d:d*b+e},_info:function(){if(this.s.dt.oFeatures.bInfo){var a=this.s.dt,b=a.oLanguage,d=this.dom.scroller.scrollTop,e=Math.floor(this.pixelsToRow(d,!1,this.s.ani)+1),l=a.fnRecordsTotal(),n=a.fnRecordsDisplay();d=Math.ceil(this.pixelsToRow(d+this.s.heights.viewport,!1,this.s.ani));d=n<d?n:d;var p=a.fnFormatNumber(e),r=a.fnFormatNumber(d),t=a.fnFormatNumber(l),u=a.fnFormatNumber(n);p=0===a.fnRecordsDisplay()&&a.fnRecordsDisplay()==a.fnRecordsTotal()?b.sInfoEmpty+b.sInfoPostFix:0===a.fnRecordsDisplay()?b.sInfoEmpty+" "+b.sInfoFiltered.replace("_MAX_",t)+b.sInfoPostFix:a.fnRecordsDisplay()==a.fnRecordsTotal()?b.sInfo.replace("_START_",p).replace("_END_",r).replace("_MAX_",t).replace("_TOTAL_",u)+b.sInfoPostFix:b.sInfo.replace("_START_",p).replace("_END_",r).replace("_MAX_",t).replace("_TOTAL_",u)+" "+b.sInfoFiltered.replace("_MAX_",a.fnFormatNumber(a.fnRecordsTotal()))+b.sInfoPostFix;(b=b.fnInfoCallback)&&(p=b.call(a.oInstance,a,e,d,l,n,p));e=a.aanFeatures.i;if("undefined"!=typeof e)for(l=0,n=e.length;l<n;l++)c(e[l]).html(p);c(a.nTable).triggerHandler("info.dt")}},_parseHeight:function(a){var b,d=/^([+-]?(?:\d+(?:\.\d+)?|\.\d+))(px|em|rem|vh)$/.exec(a);if(null===d)return 0;a=parseFloat(d[1]);d=d[2];"px"===d?b=a:"vh"===d?b=a/100*c(f).height():"rem"===d?b=a*parseFloat(c(":root").css("font-size")):"em"===d&&(b=a*parseFloat(c("body").css("font-size")));return b?b:0},_scroll:function(){var a=this,b=this.s.heights,d=this.dom.scroller.scrollTop;if(!this.s.skip&&!this.s.ingnoreScroll&&d!==this.s.lastScrollTop)if(this.s.dt.bFiltered||this.s.dt.bSorted)this.s.lastScrollTop=0;else{this._info();clearTimeout(this.s.stateTO);this.s.stateTO=setTimeout(function(){a.s.dtApi.state.save()},250);this.s.scrollType=Math.abs(d-this.s.lastScrollTop)>b.viewport?"jump":"cont";this.s.topRowFloat="cont"===this.s.scrollType?this.pixelsToRow(d,!1,!1):this._domain("physicalToVirtual",d)/b.row;0>this.s.topRowFloat&&(this.s.topRowFloat=0);if(this.s.forceReposition||d<this.s.redrawTop||d>this.s.redrawBottom){var e=Math.ceil((this.s.displayBuffer-1)/2*this.s.viewportRows);e=parseInt(this.s.topRowFloat,10)-e;this.s.forceReposition=!1;0>=e?e=0:e+this.s.dt._iDisplayLength>this.s.dt.fnRecordsDisplay()?(e=this.s.dt.fnRecordsDisplay()-this.s.dt._iDisplayLength,0>e&&(e=0)):0!==e%2&&e++;this.s.targetTop=e;e!=this.s.dt._iDisplayStart&&(this.s.tableTop=c(this.s.dt.nTable).offset().top,this.s.tableBottom=c(this.s.dt.nTable).height()+this.s.tableTop,e=function(){a.s.dt._iDisplayStart=a.s.targetTop;a.s.dt.oApi._fnDraw(a.s.dt)},this.s.dt.oFeatures.bServerSide?(this.s.forceReposition=!0,clearTimeout(this.s.drawTO),this.s.drawTO=setTimeout(e,this.s.serverWait)):e(),this.dom.loader&&!this.s.loaderVisible&&(this.dom.loader.css("display","block"),this.s.loaderVisible=!0))}else this.s.topRowFloat=this.pixelsToRow(d,!1,!0);this.s.lastScrollTop=d;this.s.stateSaveThrottle();"jump"===this.s.scrollType&&this.s.mousedown&&(this.s.labelVisible=!0);this.s.labelVisible&&(b=(b.viewport-b.labelHeight-b.xbar)/b.scroll,this.dom.label.html(this.s.dt.fnFormatNumber(parseInt(this.s.topRowFloat,10)+1)).css("top",d+d*b).css("display","block"))}},_scrollForce:function(){var a=this.s.heights;a.virtual=a.row*this.s.dt.fnRecordsDisplay();a.scroll=a.virtual;1E6<a.scroll&&(a.scroll=1E6);this.dom.force.style.height=a.scroll>this.s.heights.row?a.scroll+"px":this.s.heights.row+"px"}});m.defaults={boundaryScale:.5,displayBuffer:9,loadingIndicator:!1,rowHeight:"auto",serverWait:200};m.oDefaults=m.defaults;m.version="2.0.5";c(g).on("preInit.dt.dtscroller",function(a,b){if("dt"===a.namespace){a=b.oInit.scroller;var d=k.defaults.scroller;if(a||d)d=c.extend({},a,d),!1!==a&&new m(b,d)}});c.fn.dataTable.Scroller=m;c.fn.DataTable.Scroller=m;var q=c.fn.dataTable.Api;q.register("scroller()",function(){return this});q.register("scroller().rowToPixels()",function(a,b,d){var e=this.context;if(e.length&&e[0].oScroller)return e[0].oScroller.rowToPixels(a,b,d)});q.register("scroller().pixelsToRow()",function(a,b,d){var e=this.context;if(e.length&&e[0].oScroller)return e[0].oScroller.pixelsToRow(a,b,d)});q.register(["scroller().scrollToRow()","scroller.toPosition()"],function(a,b){this.iterator("table",function(d){d.oScroller&&d.oScroller.scrollToRow(a,b)});return this});q.register("row().scrollTo()",function(a){var b=this;this.iterator("row",function(d,e){d.oScroller&&(e=b.rows({order:"applied",search:"applied"}).indexes().indexOf(e),d.oScroller.scrollToRow(e,a))});return this});q.register("scroller.measure()",function(a){this.iterator("table",function(b){b.oScroller&&b.oScroller.measure(a)});return this});q.register("scroller.page()",function(){var a=this.context;if(a.length&&a[0].oScroller)return a[0].oScroller.pageInfo()});return m});/*!
Copyright 2015-2021 SpryMedia Ltd.
This source file is free software, available under the following license:
MIT license - http://datatables.net/license/mit
This source file is distributed in the hope that it will be useful, but
WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
For details please refer to: http://www.datatables.net/extensions/select
Select for DataTables 1.3.4-dev
2015-2021 SpryMedia Ltd - datatables.net/license/mit
*/(function(h){"function"===typeof define&&define.amd?define(["jquery","datatables.net"],function(r){return h(r,window,document)}):"object"===typeof exports?module.exports=function(r,v){r||(r=window);v&&v.fn.dataTable||(v=require("datatables.net")(r,v).$);return h(v,r,r.document)}:h(jQuery,window,document)})(function(h,r,v,l){function I(a,b,c){var d=function(g,f){if(g>f){var k=f;f=g;g=k}var n=!1;return a.columns(":visible").indexes().filter(function(q){q===g&&(n=!0);return q===f?(n=!1,!0):n})};var e=function(g,f){var k=a.rows({search:"applied"}).indexes();if(k.indexOf(g)>k.indexOf(f)){var n=f;f=g;g=n}var q=!1;return k.filter(function(y){y===g&&(q=!0);return y===f?(q=!1,!0):q})};a.cells({selected:!0}).any()||c?(d=d(c.column,b.column),c=e(c.row,b.row)):(d=d(0,b.column),c=e(0,b.row));c=a.cells(c,d).flatten();a.cells(b,{selected:!0}).any()?a.cells(c).deselect():a.cells(c).select()}function C(a){var b=a.settings()[0]._select.selector;h(a.table().container()).off("mousedown.dtSelect",b).off("mouseup.dtSelect",b).off("click.dtSelect",b);h("body").off("click.dtSelect"+D(a.table().node()))}function J(a){var b=h(a.table().container()),c=a.settings()[0],d=c._select.selector,e;b.on("mousedown.dtSelect",d,function(g){if(g.shiftKey||g.metaKey||g.ctrlKey)b.css("-moz-user-select","none").one("selectstart.dtSelect",d,function(){return!1});r.getSelection&&(e=r.getSelection())}).on("mouseup.dtSelect",d,function(){b.css("-moz-user-select","")}).on("click.dtSelect",d,function(g){var f=a.select.items();if(e){var k=r.getSelection();if((!k.anchorNode||h(k.anchorNode).closest("table")[0]===a.table().node())&&k!==e)return}k=a.settings()[0];var n=a.settings()[0].oClasses.sWrapper.trim().replace(/ +/g,".");if(h(g.target).closest("div."+n)[0]==a.table().container()&&(n=a.cell(h(g.target).closest("td, th")),n.any())){var q=h.Event("user-select.dt");u(a,q,[f,n,g]);q.isDefaultPrevented()||(q=n.index(),"row"===f?(f=q.row,E(g,a,k,"row",f)):"column"===f?(f=n.index().column,E(g,a,k,"column",f)):"cell"===f&&(f=n.index(),E(g,a,k,"cell",f)),k._select_lastCell=q)}});h("body").on("click.dtSelect"+D(a.table().node()),function(g){!c._select.blurable||h(g.target).parents().filter(a.table().container()).length||0===h(g.target).parents("html").length||h(g.target).parents("div.DTE").length||z(c,!0)})}function u(a,b,c,d){if(!d||a.flatten().length)"string"===typeof b&&(b+=".dt"),c.unshift(a),h(a.table().node()).trigger(b,c)}function N(a){var b=a.settings()[0];if(b._select.info&&b.aanFeatures.i&&"api"!==a.select.style()){var c=a.rows({selected:!0}).flatten().length,d=a.columns({selected:!0}).flatten().length,e=a.cells({selected:!0}).flatten().length,g=function(f,k,n){f.append(h('<span class="select-item"/>').append(a.i18n("select."+k+"s",{_:"%d "+k+"s selected",0:"",1:"1 "+k+" selected"},n)))};h.each(b.aanFeatures.i,function(f,k){k=h(k);f=h('<span class="select-info"/>');g(f,"row",c);g(f,"column",d);g(f,"cell",e);var n=k.children("span.select-info");n.length&&n.remove();""!==f.text()&&k.append(f)})}}function O(a){var b=new m.Api(a);a._select_init=!0;a.aoRowCreatedCallback.push({fn:function(c,d,e){d=a.aoData[e];d._select_selected&&h(c).addClass(a._select.className);c=0;for(e=a.aoColumns.length;c<e;c++)(a.aoColumns[c]._select_selected||d._selected_cells&&d._selected_cells[c])&&h(d.anCells[c]).addClass(a._select.className)},sName:"select-deferRender"});b.on("preXhr.dt.dtSelect",function(c,d){if(d===b.settings()[0]){var e=b.rows({selected:!0}).ids(!0).filter(function(f){return f!==l}),g=b.cells({selected:!0}).eq(0).map(function(f){var k=b.row(f.row).id(!0);return k?{row:k,column:f.column}:l}).filter(function(f){return f!==l});b.one("draw.dt.dtSelect",function(){b.rows(e).select();g.any()&&g.each(function(f){b.cells(f.row,f.column).select()})})}});b.on("draw.dtSelect.dt select.dtSelect.dt deselect.dtSelect.dt info.dt",function(){N(b);b.state.save()});b.on("destroy.dtSelect",function(){b.rows({selected:!0}).deselect();C(b);b.off(".dtSelect");h("body").off(".dtSelect"+D(b.table().node()))})}function K(a,b,c,d){var e=a[b+"s"]({search:"applied"}).indexes();d=h.inArray(d,e);var g=h.inArray(c,e);if(a[b+"s"]({selected:!0}).any()||-1!==d){if(d>g){var f=g;g=d;d=f}e.splice(g+1,e.length);e.splice(0,d)}else e.splice(h.inArray(c,e)+1,e.length);a[b](c,{selected:!0}).any()?(e.splice(h.inArray(c,e),1),a[b+"s"](e).deselect()):a[b+"s"](e).select()}function z(a,b){if(b||"single"===a._select.style)a=new m.Api(a),a.rows({selected:!0}).deselect(),a.columns({selected:!0}).deselect(),a.cells({selected:!0}).deselect()}function E(a,b,c,d,e){var g=b.select.style(),f=b.select.toggleable(),k=b[d](e,{selected:!0}).any();if(!k||f)"os"===g?a.ctrlKey||a.metaKey?b[d](e).select(!k):a.shiftKey?"cell"===d?I(b,e,c._select_lastCell||null):K(b,d,e,c._select_lastCell?c._select_lastCell[d]:null):(a=b[d+"s"]({selected:!0}),k&&1===a.flatten().length?b[d](e).deselect():(a.deselect(),b[d](e).select())):"multi+shift"==g?a.shiftKey?"cell"===d?I(b,e,c._select_lastCell||null):K(b,d,e,c._select_lastCell?c._select_lastCell[d]:null):b[d](e).select(!k):b[d](e).select(!k)}function D(a){return a.id.replace(/[^a-zA-Z0-9\-_]/g,"-")}function A(a,b){return function(c){return c.i18n("buttons."+a,b)}}function F(a){a=a._eventNamespace;return"draw.dt.DT"+a+" select.dt.DT"+a+" deselect.dt.DT"+a}function P(a,b){return-1!==h.inArray("rows",b.limitTo)&&a.rows({selected:!0}).any()||-1!==h.inArray("columns",b.limitTo)&&a.columns({selected:!0}).any()||-1!==h.inArray("cells",b.limitTo)&&a.cells({selected:!0}).any()?!0:!1}var m=h.fn.dataTable;m.select={};m.select.version="1.3.4-dev";m.select.init=function(a){var b=a.settings()[0];if(!b._select){var c=a.state.loaded(),d=function(t,G,p){if(null!==p&&p.select!==l){a.rows().deselect();a.columns().deselect();a.cells().deselect();p.select.rows!==l&&a.rows(p.select.rows).select();p.select.columns!==l&&a.columns(p.select.columns).select();if(p.select.cells!==l)for(t=0;t<p.select.cells.length;t++)a.cell(p.select.cells[t].row,p.select.cells[t].column).select();a.state.save()}};a.one("init",function(){a.on("stateSaveParams",function(t,G,p){p.select={};p.select.rows=a.rows({selected:!0}).ids(!0).toArray();p.select.columns=a.columns({selected:!0})[0];p.select.cells=a.cells({selected:!0})[0].map(function(L){return{row:a.row(L.row).id(!0),column:L.column}})});d(l,l,c);a.on("stateLoaded stateLoadParams",d)});var e=b.oInit.select,g=m.defaults.select;e=e===l?g:e;g="row";var f="api",k=!1,n=!0,q=!0,y="td, th",M="selected",B=!1;b._select={};!0===e?(f="os",B=!0):"string"===typeof e?(f=e,B=!0):h.isPlainObject(e)&&(e.blurable!==l&&(k=e.blurable),e.toggleable!==l&&(n=e.toggleable),e.info!==l&&(q=e.info),e.items!==l&&(g=e.items),f=e.style!==l?e.style:"os",B=!0,e.selector!==l&&(y=e.selector),e.className!==l&&(M=e.className));a.select.selector(y);a.select.items(g);a.select.style(f);a.select.blurable(k);a.select.toggleable(n);a.select.info(q);b._select.className=M;h.fn.dataTable.ext.order["select-checkbox"]=function(t,G){return this.api().column(G,{order:"index"}).nodes().map(function(p){return"row"===t._select.items?h(p).parent().hasClass(t._select.className):"cell"===t._select.items?h(p).hasClass(t._select.className):!1})};!B&&h(a.table().node()).hasClass("selectable")&&a.select.style("os")}};h.each([{type:"row",prop:"aoData"},{type:"column",prop:"aoColumns"}],function(a,b){m.ext.selector[b.type].push(function(c,d,e){d=d.selected;var g=[];if(!0!==d&&!1!==d)return e;for(var f=0,k=e.length;f<k;f++){var n=c[b.prop][e[f]];(!0===d&&!0===n._select_selected||!1===d&&!n._select_selected)&&g.push(e[f])}return g})});m.ext.selector.cell.push(function(a,b,c){b=b.selected;var d=[];if(b===l)return c;for(var e=0,g=c.length;e<g;e++){var f=a.aoData[c[e].row];(!0===b&&f._selected_cells&&!0===f._selected_cells[c[e].column]||!(!1!==b||f._selected_cells&&f._selected_cells[c[e].column]))&&d.push(c[e])}return d});var w=m.Api.register,x=m.Api.registerPlural;w("select()",function(){return this.iterator("table",function(a){m.select.init(new m.Api(a))})});w("select.blurable()",function(a){return a===l?this.context[0]._select.blurable:this.iterator("table",function(b){b._select.blurable=a})});w("select.toggleable()",function(a){return a===l?this.context[0]._select.toggleable:this.iterator("table",function(b){b._select.toggleable=a})});w("select.info()",function(a){return a===l?this.context[0]._select.info:this.iterator("table",function(b){b._select.info=a})});w("select.items()",function(a){return a===l?this.context[0]._select.items:this.iterator("table",function(b){b._select.items=a;u(new m.Api(b),"selectItems",[a])})});w("select.style()",function(a){return a===l?this.context[0]._select.style:this.iterator("table",function(b){b._select||m.select.init(new m.Api(b));b._select_init||O(b);b._select.style=a;var c=new m.Api(b);C(c);"api"!==a&&J(c);u(new m.Api(b),"selectStyle",[a])})});w("select.selector()",function(a){return a===l?this.context[0]._select.selector:this.iterator("table",function(b){C(new m.Api(b));b._select.selector=a;"api"!==b._select.style&&J(new m.Api(b))})});x("rows().select()","row().select()",function(a){var b=this;if(!1===a)return this.deselect();this.iterator("row",function(c,d){z(c);c.aoData[d]._select_selected=!0;h(c.aoData[d].nTr).addClass(c._select.className)});this.iterator("table",function(c,d){u(b,"select",["row",b[d]],!0)});return this});x("columns().select()","column().select()",function(a){var b=this;if(!1===a)return this.deselect();this.iterator("column",function(c,d){z(c);c.aoColumns[d]._select_selected=!0;d=(new m.Api(c)).column(d);h(d.header()).addClass(c._select.className);h(d.footer()).addClass(c._select.className);d.nodes().to$().addClass(c._select.className)});this.iterator("table",function(c,d){u(b,"select",["column",b[d]],!0)});return this});x("cells().select()","cell().select()",function(a){var b=this;if(!1===a)return this.deselect();this.iterator("cell",function(c,d,e){z(c);d=c.aoData[d];d._selected_cells===l&&(d._selected_cells=[]);d._selected_cells[e]=!0;d.anCells&&h(d.anCells[e]).addClass(c._select.className)});this.iterator("table",function(c,d){u(b,"select",["cell",b.cells(b[d]).indexes().toArray()],!0)});return this});x("rows().deselect()","row().deselect()",function(){var a=this;this.iterator("row",function(b,c){b.aoData[c]._select_selected=!1;b._select_lastCell=null;h(b.aoData[c].nTr).removeClass(b._select.className)});this.iterator("table",function(b,c){u(a,"deselect",["row",a[c]],!0)});return this});x("columns().deselect()","column().deselect()",function(){var a=this;this.iterator("column",function(b,c){b.aoColumns[c]._select_selected=!1;var d=new m.Api(b),e=d.column(c);h(e.header()).removeClass(b._select.className);h(e.footer()).removeClass(b._select.className);d.cells(null,c).indexes().each(function(g){var f=b.aoData[g.row],k=f._selected_cells;!f.anCells||k&&k[g.column]||h(f.anCells[g.column]).removeClass(b._select.className)})});this.iterator("table",function(b,c){u(a,"deselect",["column",a[c]],!0)});return this});x("cells().deselect()","cell().deselect()",function(){var a=this;this.iterator("cell",function(b,c,d){c=b.aoData[c];c._selected_cells!==l&&(c._selected_cells[d]=!1);c.anCells&&!b.aoColumns[d]._select_selected&&h(c.anCells[d]).removeClass(b._select.className)});this.iterator("table",function(b,c){u(a,"deselect",["cell",a[c]],!0)});return this});var H=0;h.extend(m.ext.buttons,{selected:{text:A("selected","Selected"),className:"buttons-selected",limitTo:["rows","columns","cells"],init:function(a,b,c){var d=this;c._eventNamespace=".select"+H++;a.on(F(c),function(){d.enable(P(a,c))});this.disable()},destroy:function(a,b,c){a.off(c._eventNamespace)}},selectedSingle:{text:A("selectedSingle","Selected single"),className:"buttons-selected-single",init:function(a,b,c){var d=this;c._eventNamespace=".select"+H++;a.on(F(c),function(){var e=a.rows({selected:!0}).flatten().length+a.columns({selected:!0}).flatten().length+a.cells({selected:!0}).flatten().length;d.enable(1===e)});this.disable()},destroy:function(a,b,c){a.off(c._eventNamespace)}},selectAll:{text:A("selectAll","Select all"),className:"buttons-select-all",action:function(){this[this.select.items()+"s"]().select()}},selectNone:{text:A("selectNone","Deselect all"),className:"buttons-select-none",action:function(){z(this.settings()[0],!0)},init:function(a,b,c){var d=this;c._eventNamespace=".select"+H++;a.on(F(c),function(){var e=a.rows({selected:!0}).flatten().length+a.columns({selected:!0}).flatten().length+a.cells({selected:!0}).flatten().length;d.enable(0<e)});this.disable()},destroy:function(a,b,c){a.off(c._eventNamespace)}}});h.each(["Row","Column","Cell"],function(a,b){var c=b.toLowerCase();m.ext.buttons["select"+b+"s"]={text:A("select"+b+"s","Select "+c+"s"),className:"buttons-select-"+c+"s",action:function(){this.select.items(c)},init:function(d){var e=this;d.on("selectItems.dt.DT",function(g,f,k){e.active(k===c)})}}});h(v).on("preInit.dt.dtSelect",function(a,b){"dt"===a.namespace&&m.select.init(new m.Api(b))});return m.select});/*!
DateTime picker for DataTables.net v1.1.1
© SpryMedia Ltd, all rights reserved.
License: MIT datatables.net/license/mit
*/var $jscomp=$jscomp||{};$jscomp.scope={};$jscomp.findInternal=function(d,f,l){d instanceof String&&(d=String(d));for(var m=d.length,g=0;g<m;g++){var q=d[g];if(f.call(l,q,g,d))return{i:g,v:q}}return{i:-1,v:void 0}};$jscomp.ASSUME_ES5=!1;$jscomp.ASSUME_NO_NATIVE_MAP=!1;$jscomp.ASSUME_NO_NATIVE_SET=!1;$jscomp.SIMPLE_FROUND_POLYFILL=!1;$jscomp.ISOLATE_POLYFILLS=!1;$jscomp.defineProperty=$jscomp.ASSUME_ES5||"function"==typeof Object.defineProperties?Object.defineProperty:function(d,f,l){if(d==Array.prototype||d==Object.prototype)return d;d[f]=l.value;return d};$jscomp.getGlobal=function(d){d=["object"==typeof globalThis&&globalThis,d,"object"==typeof window&&window,"object"==typeof self&&self,"object"==typeof global&&global];for(var f=0;f<d.length;++f){var l=d[f];if(l&&l.Math==Math)return l}throw Error("Cannot find global object");};$jscomp.global=$jscomp.getGlobal(this);$jscomp.IS_SYMBOL_NATIVE="function"===typeof Symbol&&"symbol"===typeof Symbol("x");$jscomp.TRUST_ES6_POLYFILLS=!$jscomp.ISOLATE_POLYFILLS||$jscomp.IS_SYMBOL_NATIVE;$jscomp.polyfills={};$jscomp.propertyToPolyfillSymbol={};$jscomp.POLYFILL_PREFIX="$jscp$";var $jscomp$lookupPolyfilledValue=function(d,f){var l=$jscomp.propertyToPolyfillSymbol[f];if(null==l)return d[f];l=d[l];return void 0!==l?l:d[f]};$jscomp.polyfill=function(d,f,l,m){f&&($jscomp.ISOLATE_POLYFILLS?$jscomp.polyfillIsolated(d,f,l,m):$jscomp.polyfillUnisolated(d,f,l,m))};$jscomp.polyfillUnisolated=function(d,f,l,m){l=$jscomp.global;d=d.split(".");for(m=0;m<d.length-1;m++){var g=d[m];if(!(g in l))return;l=l[g]}d=d[d.length-1];m=l[d];f=f(m);f!=m&&null!=f&&$jscomp.defineProperty(l,d,{configurable:!0,writable:!0,value:f})};$jscomp.polyfillIsolated=function(d,f,l,m){var g=d.split(".");d=1===g.length;m=g[0];m=!d&&m in $jscomp.polyfills?$jscomp.polyfills:$jscomp.global;for(var q=0;q<g.length-1;q++){var a=g[q];if(!(a in m))return;m=m[a]}g=g[g.length-1];l=$jscomp.IS_SYMBOL_NATIVE&&"es6"===l?m[g]:null;f=f(l);null!=f&&(d?$jscomp.defineProperty($jscomp.polyfills,g,{configurable:!0,writable:!0,value:f}):f!==l&&($jscomp.propertyToPolyfillSymbol[g]=$jscomp.IS_SYMBOL_NATIVE?$jscomp.global.Symbol(g):$jscomp.POLYFILL_PREFIX+g,g=$jscomp.propertyToPolyfillSymbol[g],$jscomp.defineProperty(m,g,{configurable:!0,writable:!0,value:f})))};$jscomp.polyfill("Array.prototype.find",function(d){return d?d:function(f,l){return $jscomp.findInternal(this,f,l).v}},"es6","es3");(function(d){"function"===typeof define&&define.amd?define(["jquery"],function(f){return d(f,window,document)}):"object"===typeof exports?module.exports=function(f,l){f||(f=window);return d(l,f,f.document)}:d(jQuery,window,document)})(function(d,f,l,m){var g,q=function(a,b){"undefined"===typeof g&&(g=f.moment?f.moment:f.dayjs?f.dayjs:f.luxon?f.luxon:null);this.c=d.extend(!0,{},q.defaults,b);b=this.c.classPrefix;var c=this.c.i18n;if(!g&&"YYYY-MM-DD"!==this.c.format)throw"DateTime: Without momentjs, dayjs or luxon only the format 'YYYY-MM-DD' can be used";"string"===typeof this.c.minDate&&(this.c.minDate=new Date(this.c.minDate));"string"===typeof this.c.maxDate&&(this.c.maxDate=new Date(this.c.maxDate));c=d('<div class="'+b+'"><div class="'+b+'-date"><div class="'+b+'-title"><div class="'+b+'-iconLeft"><button title="'+c.previous+'">'+c.previous+'</button></div><div class="'+b+'-iconRight"><button title="'+c.next+'">'+c.next+'</button></div><div class="'+b+'-label"><span></span><select class="'+b+'-month"></select></div><div class="'+b+'-label"><span></span><select class="'+
b+'-year"></select></div></div><div class="'+b+'-buttons"><a class="'+b+'-clear">'+c.clear+'</a><a class="'+b+'-today">'+c.today+'</a></div><div class="'+b+'-calendar"></div></div><div class="'+b+'-time"><div class="'+b+'-hours"></div><div class="'+b+'-minutes"></div><div class="'+b+'-seconds"></div></div><div class="'+b+'-error"></div></div>');this.dom={container:c,date:c.find("."+b+"-date"),title:c.find("."+b+"-title"),calendar:c.find("."+b+"-calendar"),time:c.find("."+b+"-time"),error:c.find("."+
b+"-error"),buttons:c.find("."+b+"-buttons"),clear:c.find("."+b+"-clear"),today:c.find("."+b+"-today"),input:d(a)};this.s={d:null,display:null,minutesRange:null,secondsRange:null,namespace:"dateime-"+q._instance++,parts:{date:null!==this.c.format.match(/[YMD]|L(?!T)|l/),time:null!==this.c.format.match(/[Hhm]|LT|LTS/),seconds:-1!==this.c.format.indexOf("s"),hours12:null!==this.c.format.match(/[haA]/)}};this.dom.container.append(this.dom.date).append(this.dom.time).append(this.dom.error);this.dom.date.append(this.dom.title).append(this.dom.buttons).append(this.dom.calendar);this._constructor()};d.extend(q.prototype,{destroy:function(){this._hide(!0);this.dom.container.off().empty();this.dom.input.removeAttr("autocomplete").off(".datetime")},errorMsg:function(a){var b=this.dom.error;a?b.html(a):b.empty();return this},hide:function(){this._hide();return this},max:function(a){this.c.maxDate="string"===typeof a?new Date(a):a;this._optionsTitle();this._setCalander();return this},min:function(a){this.c.minDate="string"===typeof a?new Date(a):a;this._optionsTitle();this._setCalander();return this},owns:function(a){return 0<d(a).parents().filter(this.dom.container).length},val:function(a,b){if(a===m)return this.s.d;if(a instanceof Date)this.s.d=this._dateToUtc(a);else if(null===a||""===a)this.s.d=null;else if("--now"===a)this.s.d=new Date;else if("string"===typeof a)if(g&&g==f.luxon){var c=g.DateTime.fromFormat(a,this.c.format);this.s.d=c.isValid?c.toJSDate():null}else g?(c=g.utc(a,this.c.format,this.c.locale,this.c.strict),this.s.d=c.isValid()?c.toDate():null):(c=a.match(/(\d{4})\-(\d{2})\-(\d{2})/),this.s.d=c?new Date(Date.UTC(c[1],c[2]-1,c[3])):null);if(b||b===m)this.s.d?this._writeOutput():this.dom.input.val(a);this.s.display=this.s.d?new Date(this.s.d.toString()):new Date;this.s.display.setUTCDate(1);this._setTitle();this._setCalander();this._setTime();return this},_constructor:function(){var a=this,b=this.c.classPrefix,c=this.dom.input.val(),k=function(){var e=a.dom.input.val();e!==c&&(a.c.onChange.call(a,e,a.s.d,a.dom.input),c=e)};this.s.parts.date||this.dom.date.css("display","none");this.s.parts.time||this.dom.time.css("display","none");this.s.parts.seconds||(this.dom.time.children("div."+b+"-seconds").remove(),this.dom.time.children("span").eq(1).remove());this.c.buttons.clear||this.dom.clear.css("display","none");this.c.buttons.today||this.dom.today.css("display","none");this._optionsTitle();d(l).on("i18n.dt",function(e,h){h.oLanguage.datetime&&(d.extend(!0,a.c.i18n,h.oLanguage.datetime),a._optionsTitle())});"hidden"===this.dom.input.attr("type")&&(this.dom.container.addClass("inline"),this.c.attachTo="input",this.val(this.dom.input.val(),!1),this._show());c&&this.val(c,!1);this.dom.input.attr("autocomplete","off").on("focus.datetime click.datetime",function(){a.dom.container.is(":visible")||a.dom.input.is(":disabled")||(a.val(a.dom.input.val(),!1),a._show())}).on("keyup.datetime",function(){a.dom.container.is(":visible")&&a.val(a.dom.input.val(),!1)});this.dom.container.on("change","select",function(){var e=d(this),h=e.val();e.hasClass(b+"-month")?(a._correctMonth(a.s.display,h),a._setTitle(),a._setCalander()):e.hasClass(b+"-year")?(a.s.display.setUTCFullYear(h),a._setTitle(),a._setCalander()):e.hasClass(b+"-hours")||e.hasClass(b+"-ampm")?(a.s.parts.hours12?(e=1*d(a.dom.container).find("."+b+"-hours").val(),h="pm"===d(a.dom.container).find("."+b+"-ampm").val(),a.s.d.setUTCHours(12!==e||h?h&&12!==e?e+12:e:0)):a.s.d.setUTCHours(h),a._setTime(),a._writeOutput(!0),k()):e.hasClass(b+"-minutes")?(a.s.d.setUTCMinutes(h),a._setTime(),a._writeOutput(!0),k()):e.hasClass(b+"-seconds")&&(a.s.d.setSeconds(h),a._setTime(),a._writeOutput(!0),k());a.dom.input.focus();a._position()}).on("click",function(e){var h=a.s.d;h=e.target.nodeName.toLowerCase();var r="span"===h?e.target.parentNode:e.target;h=r.nodeName.toLowerCase();if("select"!==h)if(e.stopPropagation(),"a"===h&&(e.preventDefault(),d(r).hasClass(b+"-clear")?(a.s.d=null,a.dom.input.val(""),a._writeOutput(),a._setCalander(),a._setTime(),k()):d(r).hasClass(b+"-today")&&(a.s.display=new Date,a._setTitle(),a._setCalander())),"button"===h){var p=d(r);e=p.parent();if(e.hasClass("disabled")&&!e.hasClass("range"))p.blur();else if(e.hasClass(b+"-iconLeft"))a.s.display.setUTCMonth(a.s.display.getUTCMonth()-1),a._setTitle(),a._setCalander(),a.dom.input.focus();else if(e.hasClass(b+"-iconRight"))a._correctMonth(a.s.display,a.s.display.getUTCMonth()+1),a._setTitle(),a._setCalander(),a.dom.input.focus();else{if(p.parents("."+b+"-time").length){r=p.data("value");p=p.data("unit");h=a._needValue();if("minutes"===p){if(e.hasClass("disabled")&&e.hasClass("range")){a.s.minutesRange=r;a._setTime();return}a.s.minutesRange=null}if("seconds"===p){if(e.hasClass("disabled")&&e.hasClass("range")){a.s.secondsRange=r;a._setTime();return}a.s.secondsRange=null}if("am"===r)if(12<=h.getUTCHours())r=h.getUTCHours()-12;else return;else if("pm"===r)if(12>h.getUTCHours())r=h.getUTCHours()+12;else return;h["hours"===p?"setUTCHours":"minutes"===p?"setUTCMinutes":"setSeconds"](r);a._setTime();a._writeOutput(!0)}else h=a._needValue(),h.setUTCDate(1),h.setUTCFullYear(p.data("year")),h.setUTCMonth(p.data("month")),h.setUTCDate(p.data("day")),a._writeOutput(!0),a.s.parts.time?a._setCalander():setTimeout(function(){a._hide()},10);k()}}else a.dom.input.focus()})},_compareDates:function(a,b){return g&&g==f.luxon?g.DateTime.fromJSDate(a).toISODate()===g.DateTime.fromJSDate(b).toISODate():this._dateToUtcString(a)===this._dateToUtcString(b)},_correctMonth:function(a,b){var c=this._daysInMonth(a.getUTCFullYear(),b),k=a.getUTCDate()>c;a.setUTCMonth(b);k&&(a.setUTCDate(c),a.setUTCMonth(b))},_daysInMonth:function(a,b){return[31,0!==a%4||0===a%100&&0!==a%400?28:29,31,30,31,30,31,31,30,31,30,31][b]},_dateToUtc:function(a){return new Date(Date.UTC(a.getFullYear(),a.getMonth(),a.getDate(),a.getHours(),a.getMinutes(),a.getSeconds()))},_dateToUtcString:function(a){return g&&g==f.luxon?g.DateTime.fromJSDate(a).toISODate():a.getUTCFullYear()+"-"+this._pad(a.getUTCMonth()+1)+"-"+this._pad(a.getUTCDate())},_hide:function(a){if(a||"hidden"!==this.dom.input.attr("type"))a=this.s.namespace,this.dom.container.detach(),d(f).off("."+a),d(l).off("keydown."+a),d("div.dataTables_scrollBody").off("scroll."+a),d("div.DTE_Body_Content").off("scroll."+a),d("body").off("click."+a)},_hours24To12:function(a){return 0===a?12:12<a?a-12:a},_htmlDay:function(a){if(a.empty)return'<td class="empty"></td>';var b=["selectable"],c=this.c.classPrefix;a.disabled&&b.push("disabled");a.today&&b.push("now");a.selected&&b.push("selected");return'<td data-day="'+a.day+'" class="'+b.join(" ")+'"><button class="'+c+"-button "+c+'-day" type="button" data-year="'+
a.year+'" data-month="'+a.month+'" data-day="'+a.day+'"><span>'+a.day+"</span></button></td>"},_htmlMonth:function(a,b){var c=this._dateToUtc(new Date),k=this._daysInMonth(a,b),e=(new Date(Date.UTC(a,b,1))).getUTCDay(),h=[],r=[];0<this.c.firstDay&&(e-=this.c.firstDay,0>e&&(e+=7));for(var p=k+e,u=p;7<u;)u-=7;p+=7-u;var w=this.c.minDate;u=this.c.maxDate;w&&(w.setUTCHours(0),w.setUTCMinutes(0),w.setSeconds(0));u&&(u.setUTCHours(23),u.setUTCMinutes(59),u.setSeconds(59));for(var n=0,t=0;n<p;n++){var x=new Date(Date.UTC(a,b,1+(n-e))),A=this.s.d?this._compareDates(x,this.s.d):!1,v=this._compareDates(x,c),B=n<e||n>=k+e,z=w&&x<w||u&&x>u,y=this.c.disableDays;Array.isArray(y)&&-1!==d.inArray(x.getUTCDay(),y)?z=!0:"function"===typeof y&&!0===y(x)&&(z=!0);r.push(this._htmlDay({day:1+(n-e),month:b,year:a,selected:A,today:v,disabled:z,empty:B}));7===++t&&(this.c.showWeekNumber&&r.unshift(this._htmlWeekOfYear(n-e,b,a)),h.push("<tr>"+r.join("")+"</tr>"),r=[],t=0)}c=this.c.classPrefix;k=c+"-table";this.c.showWeekNumber&&(k+=" weekNumber");w&&(w=w>=new Date(Date.UTC(a,b,1,0,0,0)),this.dom.title.find("div."+c+"-iconLeft").css("display",w?"none":"block"));u&&(a=u<new Date(Date.UTC(a,b+1,1,0,0,0)),this.dom.title.find("div."+c+"-iconRight").css("display",a?"none":"block"));return'<table class="'+k+'"><thead>'+this._htmlMonthHead()+"</thead><tbody>"+h.join("")+"</tbody></table>"},_htmlMonthHead:function(){var a=[],b=this.c.firstDay,c=this.c.i18n,k=function(h){for(h+=b;7<=h;)h-=7;return c.weekdays[h]};this.c.showWeekNumber&&a.push("<th></th>");for(var e=0;7>e;e++)a.push("<th>"+k(e)+"</th>");return a.join("")},_htmlWeekOfYear:function(a,b,c){a=new Date(c,b,a,0,0,0,0);a.setDate(a.getDate()+4-(a.getDay()||7));return'<td class="'+this.c.classPrefix+'-week">'+Math.ceil(((a-new Date(c,0,1))/864E5+1)/7)+"</td>"},_needValue:function(){this.s.d||(this.s.d=this._dateToUtc(new Date));return this.s.d},_options:function(a,b,c){c||(c=b);a=this.dom.container.find("select."+this.c.classPrefix+"-"+a);a.empty();for(var k=0,e=b.length;k<e;k++)a.append('<option value="'+b[k]+'">'+c[k]+"</option>")},_optionSet:function(a,b){var c=this.dom.container.find("select."+this.c.classPrefix+"-"+a);a=c.parent().children("span");c.val(b);b=c.find("option:selected");a.html(0!==b.length?b.text():this.c.i18n.unknown)},_optionsTime:function(a,b,c,k,e){var h=this.c.classPrefix,r=this.dom.container.find("div."+h+"-"+a),p=12===b?function(v){return v}:this._pad;h=this.c.classPrefix;var u=h+"-table",w=this.c.i18n;if(r.length){var n="";var t=10;var x=function(v,B,z){12===b&&"number"===typeof v&&(12<=c&&(v+=12),12==v?v=0:24==v&&(v=12));var y=c===v||"am"===v&&12>c||"pm"===v&&12<=c?"selected":"";k&&-1===d.inArray(v,k)&&(y+=" disabled");z&&(y+=" "+z);return'<td class="selectable '+y+'"><button class="'+h+"-button "+h+'-day" type="button" data-unit="'+a+'" data-value="'+v+'"><span>'+B+"</span></button></td>"};if(12===b){n+="<tr>";for(e=1;6>=e;e++)n+=x(e,p(e));n+=x("am",w.amPm[0]);n+="</tr><tr>";for(e=7;12>=e;e++)n+=x(e,p(e));n+=x("pm",w.amPm[1]);n+="</tr>";t=7}else{if(24===b){var A=0;for(t=0;4>t;t++){n+="<tr>";for(e=0;6>e;e++)n+=x(A,p(A)),A++;n+="</tr>"}}else{n+="<tr>";for(t=0;60>t;t+=10)n+=x(t,p(t),"range");e=null!==e?e:10*Math.floor(c/10);n=n+'</tr></tbody></thead><table class="'+(u+" "+u+'-nospace"><tbody><tr>');for(t=e+1;t<e+10;t++)n+=x(t,p(t));n+="</tr>"}t=6}r.empty().append('<table class="'+u+'"><thead><tr><th colspan="'+t+'">'+w[a]+"</th></tr></thead><tbody>"+n+"</tbody></table>")}},_optionsTitle:function(){var a=this.c.i18n,b=this.c.minDate,c=this.c.maxDate;b=b?b.getFullYear():null;c=c?c.getFullYear():null;b=null!==b?b:(new Date).getFullYear()-this.c.yearRange;c=null!==c?c:(new Date).getFullYear()+this.c.yearRange;this._options("month",this._range(0,11),a.months);this._options("year",this._range(b,c))},_pad:function(a){return 10>a?"0"+a:a},_position:function(){var a="input"===this.c.attachTo?this.dom.input.position():this.dom.input.offset(),b=this.dom.container,c=this.dom.input.outerHeight();if(b.hasClass("inline"))b.insertAfter(this.dom.input);else{this.s.parts.date&&this.s.parts.time&&550<d(f).width()?b.addClass("horizontal"):b.removeClass("horizontal");"input"===this.c.attachTo?b.css({top:a.top+c,left:a.left}).insertAfter(this.dom.input):b.css({top:a.top+c,left:a.left}).appendTo("body");var k=b.outerHeight(),e=b.outerWidth(),h=d(f).scrollTop();a.top+c+k-h>d(f).height()&&(c=a.top-k,b.css("top",0>c?0:c));e+a.left>d(f).width()&&(a=d(f).width()-e,"input"===this.c.attachTo&&(a-=d(b).offsetParent().offset().left),b.css("left",0>a?0:a))}},_range:function(a,b,c){var k=[];for(c||(c=1);a<=b;a+=c)k.push(a);return k},_setCalander:function(){this.s.display&&this.dom.calendar.empty().append(this._htmlMonth(this.s.display.getUTCFullYear(),this.s.display.getUTCMonth()))},_setTitle:function(){this._optionSet("month",this.s.display.getUTCMonth());this._optionSet("year",this.s.display.getUTCFullYear())},_setTime:function(){var a=this,b=this.s.d,c=null;g&&g==f.luxon&&(c=g.DateTime.fromJSDate(b));var k=null!=c?c.hour:b?b.getUTCHours():0,e=function(h){return a.c[h+
"Available"]?a.c[h+"Available"]:a._range(0,59,a.c[h+"Increment"])};this._optionsTime("hours",this.s.parts.hours12?12:24,k,this.c.hoursAvailable);this._optionsTime("minutes",60,null!=c?c.minute:b?b.getUTCMinutes():0,e("minutes"),this.s.minutesRange);this._optionsTime("seconds",60,null!=c?c.second:b?b.getSeconds():0,e("seconds"),this.s.secondsRange)},_show:function(){var a=this,b=this.s.namespace;this._position();d(f).on("scroll."+b+" resize."+b,function(){a._position()});d("div.DTE_Body_Content").on("scroll."+
b,function(){a._position()});d("div.dataTables_scrollBody").on("scroll."+b,function(){a._position()});var c=this.dom.input[0].offsetParent;if(c!==l.body)d(c).on("scroll."+b,function(){a._position()});d(l).on("keydown."+b,function(k){9!==k.keyCode&&27!==k.keyCode&&13!==k.keyCode||a._hide()});setTimeout(function(){d("body").on("click."+b,function(k){d(k.target).parents().filter(a.dom.container).length||k.target===a.dom.input[0]||a._hide()})},10)},_writeOutput:function(a){var b=this.s.d,c="";b&&(c=g&&g==f.luxon?g.DateTime.fromJSDate(this.s.d).toFormat(this.c.format):g?g.utc(b,m,this.c.locale,this.c.strict).format(this.c.format):b.getUTCFullYear()+"-"+this._pad(b.getUTCMonth()+1)+"-"+this._pad(b.getUTCDate()));this.dom.input.val(c).trigger("change",{write:b});"hidden"===this.dom.input.attr("type")&&this.val(c,!1);a&&this.dom.input.focus()}});q.use=function(a){g=a};q._instance=0;q.defaults={attachTo:"body",buttons:{clear:!1,today:!1},classPrefix:"dt-datetime",disableDays:null,firstDay:1,format:"YYYY-MM-DD",hoursAvailable:null,i18n:{clear:"Clear",previous:"Previous",next:"Next",months:"January February March April May June July August September October November December".split(" "),weekdays:"Sun Mon Tue Wed Thu Fri Sat".split(" "),amPm:["am","pm"],hours:"Hour",minutes:"Minute",seconds:"Second",unknown:"-",today:"Today"},maxDate:null,minDate:null,minutesAvailable:null,minutesIncrement:1,strict:!0,locale:"en",onChange:function(){},secondsAvailable:null,secondsIncrement:1,showWeekNumber:!1,yearRange:25};q.version="1.1.1";f.DateTime||(f.DateTime=q);d.fn.dtDateTime=function(a){return this.each(function(){new q(this,a)})};d.fn.dataTable&&(d.fn.dataTable.DateTime=q,d.fn.DataTable.DateTime=q,d.fn.dataTable.Editor&&(d.fn.dataTable.Editor.DateTime=q));return q});(function(window,document,$){$(document).on('init.dt',function(e,dtSettings){if(e.namespace!=='dt'){return;}
var options=dtSettings.oInit.conditionalPaging||$.fn.dataTable.defaults.conditionalPaging;if($.isPlainObject(options)||options===true){var config=$.isPlainObject(options)?options:{},api=new $.fn.dataTable.Api(dtSettings),speed='slow',conditionalPaging=function(e){var $paging=$(api.table().container()).find('div.dataTables_paginate'),pages=api.page.info().pages;if(e instanceof $.Event){if(pages<=1){if(config.style==='fade'){$paging.stop().fadeTo(speed,0);}
else{$paging.css('visibility','hidden');}}
else{if(config.style==='fade'){$paging.stop().fadeTo(speed,1);}
else{$paging.css('visibility','');}}}
else if(pages<=1){if(config.style==='fade'){$paging.css('opacity',0);}
else{$paging.css('visibility','hidden');}}};if(config.speed!==undefined){speed=config.speed;}
conditionalPaging();api.on('draw.dt',conditionalPaging);}});})(window,document,jQuery);