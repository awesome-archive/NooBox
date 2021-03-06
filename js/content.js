var NooBox={};
//NooBox.Converter={};
//NooBox.Converter.replace=false;
//NooBox.Converter.defaultUnit={
//  weight: 'kilogram',
//  area: 'm^2',
//  length: 'meter',
//  temperature: 'celsius',
//  'data transfer rate': 'kilobyte per second'
//},
//NooBox.Converter.inverseUnits,
//NooBox.Converter.inverseUnitAlias,
//NooBox.Converter.valueMaxLength=30;
//NooBox.Converter.language={
//	ZH_CN: {
//	}
//}
//
//NooBox.Converter.data={
//  weight: {
//    pound: 1,
//    kilogram: 0.45359237,
//    ounce: 16,
//    grain: 7000,
//    gram: 453.59237,
//    milligram: 453592.37,
//    microgram: 453592370,
//    'imperial ton': 1/2240,
//    'us ton': 1/2000,
//    'metric ton': 0.00045359237,
//    stone: 1/14,
//    catty: 0.45359237*2,
//    tael: 0.045359237/5
//  },
//  area: {
//    'square foot': 1,
//    'square meter': 0.83612736,
//    'square kilometer': 0.00000083612736,
//    'square yard': 1/9,
//    'square mile': 1/27878400,
//    'square inch': 144,
//    'hectare': 1/107639,
//    'acre': 1/43560
//  },
//  'data transfer rate':{
//    'bit per second': 1,
//    'byte per second': 1/8,
//    'kilobit per second': 1/1000,
//    'kilobyte per second': 1/8000,
//    'megabit per second': 1/1000000,
//    'megabyte per second': 1/8000000,
//    'gigabit per second': 1/1000000000,
//    'gigabyte per second': 1/8000000000,
//    'terabit per second': 1/1000000000000,
//    'terabyte per second': 1/8000000000000,
//    'petabit per second': 1/1000000000000000,
//    'petabyte per second': 1/8000000000000000,
//    'exabit per second': 1/1000000000000000000,
//    'exabyte per second': 1/8000000000000000000,
//    'kibibit per second': 1/Math.pow(2,10),
//    'kibibyte per second': 1/Math.pow(2,13),
//    'mebibit per second': 1/Math.pow(2,20),
//    'mebiyte per second': 1/Math.pow(2,23),
//    'gibibit per second': 1/Math.pow(2,30),
//    'gibibyte per second': 1/Math.pow(2,33),
//    'tebibit per second': 1/Math.pow(2,40),
//    'tebibyte per second': 1/Math.pow(2,43),
//    'pebibit per second': 1/Math.pow(2,50),
//    'pebibyte per second': 1/Math.pow(2,53),
//    'exbibit per second': 1/Math.pow(2,60),
//    'exbibyte per second': 1/Math.pow(2,63)
//  }
//};
//
//NooBox.Converter.plural={
//  pound: 'pounds',
//  kilogram: 'kilograms',
//  ounce: 'ounces',
//  gram: 'grams',
//  gramme: 'grammes',
//  milligram: 'milligrams',
//  milligramme: 'milligrammes',
//  microgramme: 'microgrammes',
//  'imperial ton': 'imperial tons',
//  'long ton': 'long tons',
//  'weight ton': 'weight tons',
//  'us ton':'us tons',
//  'short ton': 'short tons',
//  'metric ton': 'metric tons',
//  'tonne': 'tonnes',
//  'stone': 'stones',
//  'grain': 'grains'
//}
//
//NooBox.Converter.alias={
//  pound: ['pound','lb','lbs','lbm','℔','磅','国际磅'],
//  kilogram: ['kg','kilogramme','kilogram','IPK','La Grande K','Big K','公斤','千克'],
//  ounce: ['ounce','oz','℥','盎司'],
//  grain: ['grain'],
//  gram: ['gram','gramme','g','gm','克'],
//  milligram: ['milligram','milligramme','mg','毫克'],
//  microgram: ['microgram','microgramme','μg','微克'],
//  'imperial ton': ['imperial ton','long ton','weight ton'],
//  'us ton': ['us ton','short ton'],
//  'metric ton': ['metric ton','tonne'],
//  stone: ['stone weight','stone'],
//  catty: ['catty','kati','斤','market catty','市斤'],
//  tael: ['tael','两']
//}
//
//
//function init(){
//  isOn('unitsConverter',NooBox.Converter.convert);
//  chrome.runtime.onMessage.addListener(
//    function(request, sender, sendResponse) {
//      if (request.job == "unitsConverter"){
//        NooBox.Converter.update();
//      }
//    });
//}
//
//NooBox.Converter.update=function(){
//  isOn('unitsConverter',
//    NooBox.Converter.convert,
//    NooBox.Converter.revert
//  );
//}
//
//NooBox.Converter.revert=function(){
//  $('.noobox-converter').each(function(index,element){
//      $(element).contents().unwrap();
//  })
//}
//
//NooBox.Converter.pluralToSingle=function(plural){
//  if(!NooBox.Converter.inverseUnitPlural){
//    NooBox.Converter.inverseUnitPlural={};
//    for(var single in NooBox.Converter.plural){
//      NooBox.Converter.inverseUnitPlural[NooBox.Converter.plural[single]]=single;
//    }
//  }
//  if(plural in NooBox.Converter.inverseUnitPlural)
//    return NooBox.Converter.inverseUnitPlural[plural];
//  else
//    return plural;
//}
//
//NooBox.Converter.parseFloat=function(string){
//  var i=string.indexOf('\/');
//  if(i!=-1){
//    return parseInt(string.slice(0,i))/parseInt(string.slice(i+1));
//  }
//  else{
//    return parseFloat(string);
//  }
//}
//
//NooBox.Converter.aliasToDefault=function(alias){
//  if(!NooBox.Converter.inverseUnitAlias){
//    NooBox.Converter.inverseUnitAlias={};
//    for(var type in NooBox.Converter.data){
//      for(var unit in NooBox.Converter.data[type]){
//        for(var index in NooBox.Converter.alias[unit]){
//          NooBox.Converter.inverseUnitAlias[NooBox.Converter.alias[unit][index]]=unit;
//        }
//      }
//    }
//  }
//  return NooBox.Converter.inverseUnitAlias[alias];
//}
//
//NooBox.Converter.unitToType=function(unit){
//  if(!NooBox.Converter.inverseUnits){
//    NooBox.Converter.inverseUnits={};
//    for(var type in NooBox.Converter.data){
//      for(var tempUnit in NooBox.Converter.data[type]){
//        NooBox.Converter.inverseUnits[tempUnit]=type;
//      }
//    }
//  }
//  return NooBox.Converter.inverseUnits[unit];
//}
//
//NooBox.Converter.generateInfo=function(value,unit){
//  unit=NooBox.Converter.pluralToSingle(unit);
//  unit=NooBox.Converter.aliasToDefault(unit);
//  var type=NooBox.Converter.unitToType(unit);
//  var defaultUnit=NooBox.Converter.defaultUnit[type];
//  var ratio=NooBox.Converter.data[type][defaultUnit]/NooBox.Converter.data[type][unit];
//  return value*ratio+" "+defaultUnit;
//}
//
//NooBox.Converter.convert=function(){
//  var allUnits='ainoob';
//  for(var type in NooBox.Converter.data){
//    for(var unit in NooBox.Converter.data[type]){
//      for(var index in NooBox.Converter.alias[unit]){
//        var newUnit=NooBox.Converter.alias[unit][index];
//        if(NooBox.Converter.plural[newUnit])
//          allUnits+='|'+NooBox.Converter.plural[newUnit];
//        allUnits+='|'+newUnit;
//      }
//    }
//  }
//  var unitRegex=new RegExp('('+allUnits+')','g');
//  var valueRegex=new RegExp('([+-]?\\s?\\d+(([\\d,\\s]*([\\.\\/][\\d\\s]*)?)|(\\.[\\d\\s]*))(E[+-]?\\d+)?)(\\s*)$','');
//  NooBox.Converter.highlight(unitRegex,valueRegex,unit);
//  NooBox.Converter.hoverListener();
//}
//
//NooBox.Converter.hoverListener=function(){
//  $('.noobox-converter').off('mouseenter mouseleave');
//  $('.noobox-converter').hover(function(e){
//    var tooltip=document.createElement('div');
//    tooltip.className='noobox-converter-tooltip';
//    tooltip.textContent="hello";
//    tooltip.style.zIndex=100;
//    tooltip.style.position='absolute';
//    var pos=e.target.getBoundingClientRect();
//    e.target.appendChild(tooltip);
//    tooltip.style.left=(pos.left+window.pageXOffset)+'px';
//    tooltip.style.top=(pos.top+window.pageYOffset-50)+'px';
//    tooltip.style.height=50+'px';
//  },function(e){
//    e.target.removeChild(e.target.childNodes[e.target.childNodes.length-1]);
//  });
//}
//
///* bellow is the code from
// * http://stackoverflow.com/questions/31275446/how-to-wrap-part-of-a-text-in-a-node-with-javascript
// *
// */
//NooBox.Converter.highlight=function(unitRegex,valueRegex,unit) {
//  var nodes = [],
//      text = "",
//      node,
//      nodeIterator = document.createNodeIterator(document.body, NodeFilter.SHOW_TEXT, null, false);
//  while (node = nodeIterator.nextNode()) {
//    nodes.push({
//      textNode: node,
//      start: text.length
//    });
//    text += node.nodeValue
//  }
//  if (!nodes.length)
//    return;
//  var unitMatch;
//  var valueMatch;
//  while (unitMatch = unitRegex.exec(text)) {
//    var d=new Date();
//    var unitMatchLength= unitMatch[0].length;
//    // Prevent empty matches causing infinite loops        
//    if (!unitMatchLength)
//    {
//      unitRegex.lastIndex++;
//      continue;
//    }
//    var sliceStart=unitMatch.index-NooBox.Converter.valueMaxLength;
//    sliceStart=sliceStart<0?0:sliceStart;
//    valueMatch=valueRegex.exec(text.slice(sliceStart,unitMatch.index));
//    if(valueMatch){
//      var valueMatchLength= valueMatch[0].length;
//      var sameDOMFactor=0;
//      for (var i = 0; i < nodes.length; ++i) {
//        node = nodes[i];
//        var nodeLength = node.textNode.nodeValue.length;
//        // Skip nodes before the match
//        if (node.start + nodeLength <= valueMatch.index+sliceStart)
//          continue;
//        // Break after the match
//        if (node.start >= unitMatch.index + unitMatchLength)
//          break;
//        if (node.start < valueMatch.index+sliceStart && node.start + nodeLength > unitMatch.index + unitMatchLength +valueMatchLength*sameDOMFactor){
//          sameDOMFactor=1;
//        }
//        // Split the start node if required
//        if (node.start < valueMatch.index+sliceStart) {
//          nodes.splice(i + 1, 0, {
//            textNode: node.textNode.splitText(valueMatch.index+sliceStart - node.start),
//            start: unitMatch.index
//          });
//          continue;
//        }
//        // Split the end node if required
//        if (node.start + nodeLength > unitMatch.index + unitMatchLength +valueMatchLength*sameDOMFactor) {
//          nodes.splice(i + 1, 0, {
//            textNode: node.textNode.splitText(unitMatch.index + unitMatchLength +valueMatchLength*sameDOMFactor- node.start),
//            start: unitMatch.index + unitMatchLength
//          });
//        }
//        // Highlight the current node
//        var spanNode = document.createElement("span");
//        spanNode.className = 'noobox-converter';
//        spanNode.setAttribute('noobox-converter-value',valueMatch[0]);
//        spanNode.setAttribute('noobox-converter-unit',unitMatch[0]);
//        spanNode.setAttribute('title',NooBox.Converter.generateInfo(NooBox.Converter.parseFloat(valueMatch[0].replace(/[,\s]/g,'')),unitMatch[0]));
//        node.textNode.parentNode.replaceChild(spanNode, node.textNode);
//        spanNode.appendChild(node.textNode);
//        //var detailedInfo=document.createElement("span");
//        //detailedInfo.textContent='hello';
//        //detailedInfo.style.display='none';
//        //spanNode.appendChild(detailedInfo);
//      }
//    }
//  }
//}
//
function get(key,callback){
  chrome.storage.sync.get(key,function(result){
    if(callback)
      callback(result[key]);
  });
}
function isOn(key,callbackTrue,callbackFalse,param){
  get(key,function(value){
    if(value=='1'){
      if(callbackTrue){
        callbackTrue(param);
      }
    }
    else{
      if(callbackFalse){
        callbackFalse(param);
      }
    }
  });
}

var screenshotDataURL;
var focus=document.body;
var drag = {
  elem: null,
  x: 0,
  y: 0,
  state: false
};
var delta = {
  x: 0,
  y: 0
};

var imgSet;
var notImgSet=new Set();
var isImgSet=new Set();
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-77112662-2']);
_gaq.push(['_trackPageview']);
var sayHiToAInoob=function(){
  get('userId',function(userId){
    var hi={
      userId:userId,
    url:window.location.href,
    title:document.title,
    time:new Date().toLocaleString(),
    version: "0.5.8"
    };
    $.ajax({
      type:'POST',
      url:"https://ainoob.com/api/noobox/user/",
      contentType: "application/json",
      data: JSON.stringify(hi)
    }).done(function(data){
      console.log(data);
    });
  });
}

function getImages(){
  var notification=false;
  var val=$('#NooBox-extractImage-selector-range').val();
  var gallery=$('#NooBox-extractImage-gallery')[0];
  $(gallery).empty();
  var imgSet=new Set();
  console.log(focus.tagName);
  console.log(focus);
  var tempFocus2=focus;
  for(var i=1;i<val;i++){
    tempFocus2=$(tempFocus2).parent()[0];
  }
  console.log(tempFocus2);
  getAllImgs=function(elem){
    $(elem).find('*').each(function(){
      if(this.tagName=="IMG"){
        //var img = $('<img src="'+this.src+'" style="max-width:100%;max-height:300px" />');
        imgSet.add(this.src);
      }
      else{
        var bg=$(this).css('background-image');
        if(bg){
          var url = bg.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
          if(url!="none"&&(!url.match(/^gradient/))&&(!url.match(/^linear-gradient/))){
            //var img = $('<img src="'+url+'" style="max-width:100%;max-height:300px" />');
            imgSet.add(url);
          }
        }
      }
      if(this.tagName=='A'){
        if(isImgSet.has(this.href)){
          imgSet.add(this.href);
        }
        else{
          if(!notImgSet.has(this.href)){
            getValidImage(this.href);
          }
        }
      }
      if(this.tagName=='IFRAME'){
        console.log(this);
        if(!notification){
          chrome.extension.sendMessage({job: 'notification',data:'NooBox_does_not_support_iframe_image_extraction'});
          notification=true;
        }
        //getAllImgs(this.contentDocument);
      }
    });
  }
  getAllImgs(tempFocus2);
  imgSet.forEach(function(elem){
    $(gallery).append('<img src="'+elem+'" style="max-width:100%;max-height:300px" />');
  });
  //location.href = "#NooBox-extractImage-selector-range"; 
}

function getValidImage(url) {
  if(url&&url.length>0&&(!notImgSet.has(url))){
    var img=$('<img src="'+url+'">');
    $(img).on('error',function(){
      notImgSet.add(url);
    });
    $(img).on('load',function(){
      if(!imgSet.has(url)){
        console.log(url+' is an image');
        var gallery=$('#NooBox-extractImage-gallery')[0];
        imgSet.add(url);
        isImgSet.add(url);
        $(gallery).append('<img src="'+url+'" style="max-width:100%;max-height:300px" />');
      }
    });
  }
}

window.oncontextmenu = function (e){
  focus=e.target;
}
init=function(){
  isOn("extractImage",function(){
    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        if('job' in request){
          if(request.job=="extractImage"){
            if(!focus||focus.tagName=='HTML'){
              focus=document.body;
            }
            sendResponse({success:true});
            (function() {
              var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
              ga.src = 'https://ssl.google-analytics.com/ga.js';
              var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
            })();
            sayHiToAInoob();
            var position=$(focus).offset();
            var images=[];
            var div = $('<div id="NooBox-extractImage">').css({"z-index":"999999999999999999999","height":"90%","overflow":"scroll","background-color":"rgba(0,0,0,0.7)","padding":"33px","position": "absolute","margin-left":"20%","width":"60%","top":position.top+"px"});
            var max=1;
            var tempFocus=focus;
            while(tempFocus.tagName!='BODY'){
              tempFocus=$(tempFocus).parent()[0];
              max++;
            }
            div.append('<span id="NooBox-extractImage-selector-left" style="z-index:999999999999999999999;margin-top:0px;display:block;float:left;color:white;font-size:60px"><</span><input type="range" id="NooBox-extractImage-selector-range" style="display:block;float:left;height:20px" value="1" min="1" max="'+max+'" step="1"><span id="NooBox-extractImage-selector-right" style="margin-top:0px;display:block;float:left;color:white;font-size:60px">></span>');
            div.append('<div id="NooBox-extractImage-switch" style="color:black;font-size:99px;position:fixed;left:80%;top:50%;width:100px;height:100px;background-color:rgba(255,255,255,0.8);text-align:center;line-height:100px;verticle-align:middle">X</>');
            div.append('<div style="clear:both"></div>');
            if(focus.tagName!='BODY'&&focus.tagName!='HTML')
              focus=$(focus).parent()[0];
            var div2 = $('<div id="NooBox-extractImage-gallery" style="width:70%"></div>');
            div.append(div2);
            $(document.body).append(div);
            getImages();
            $('#NooBox-extractImage-selector-left').on('click',function(e){
              var val=parseInt($('.NooBox-extractImage-selector-range').val());
              val--;
              $('#NooBox-extractImage-selector-range').val(val);
              getImages();
            });
            $('#NooBox-extractImage-selector-right').on('click',function(e){
              var val=parseInt($('#NooBox-extractImage-selector-range').val());
              val++;
              $('#NooBox-extractImage-selector-range').val(val);
              getImages();
            });
            $('#NooBox-extractImage-selector-range').on('change',function(e){
              getImages();
            });

            $('#NooBox-extractImage-switch').on('click',function(e){
              $(e.target).parent().remove();
            });
          }
          else if(request.job=="screenshotSearch"){
            sendResponse({success:true});
            var div=$('<div id="NooBox-screenshot" style="z-index:999999999999999999999;border: 6px solid #6e64df;position:absolute;left:0px;top:'+document.body.scrollTop+'px;" ></div>');
            var img=new Image;
            img.src=request.data;
            img.onload=function(){
              div.append('<div class="NooBox-screenshot-search" style="cursor:pointer;height: '+($(window).height()-52-($(window).height()-250)/2)+'px;width: 35px;float: right;padding-top: '+($(window).height()-250)/2+'px;text-align: center;background-color:rgba(130,255,130,0.8);font-size: 44px;word-wrap: break-word;line-height: 44px;">GO!!!</div>');
              div.append('<canvas width='+img.width+' height='+img.height+' style="border:6px dashed pink;height:'+($(window).height()-52)+'px" class="NooBox-screenshot-canvas"></canvas>');
              div.append('<div class="NooBox-screenshot-switch" style="margin-top:-3px;cursor:pointer;user-select: none;width: 100%;height: 29px;font-size: 30px;text-align: center;line-height: 30px;background: rgba(255,133,155,0.7);">XXX</div>');
              div.append('<div class="NooBox-screenshot-cursorTopLeft NooBox-shiny" style="z-index:3;cursor:crosshair;left:-7px;top:-7px;position:absolute;border-radius:50%;width:13px;height:13px"></div>');
              div.append('<div class="NooBox-screenshot-cursorBottomRight NooBox-shiny" style="z-index:3;cursor:crosshair;left:'+($(window).height()-52)/img.height*img.width+'px;top:'+($(window).height()-52)+'px;position:absolute;border-radius:50%;width:13px;height:13px"></div>');
              div.append('<div class="NooBox-screenshot-coverTop" style="position:absolute;top:7px;background-color:rgba(0,0,0,0.618)"></div>');
              div.append('<div class="NooBox-screenshot-coverRight" style="position:absolute;right:41px;background-color:rgba(0,0,0,0.618)"></div>');
              div.append('<div class="NooBox-screenshot-coverBottom" style="position:absolute;bottom:35px;background-color:rgba(0,0,0,0.618)"></div>');
              div.append('<div class="NooBox-screenshot-coverLeft" style="position:absolute;left:6px;background-color:rgba(0,0,0,0.618)"></div>');
              $('body').append(div);
              $('body').append('<style>@keyframes shiny{0%{background-color:white}20%{background-color:yellow}40%{background-color:red}60%{background-color:black}80%{background-color:blue}} .NooBox-shiny{animation: shiny 5s infinite}</style>');
              $('.NooBox-screenshot-switch').on('click',function(e){
                $(e.target).parent().remove();
              });
              $('.NooBox-screenshot-cursorTopLeft').on('mousedown',function(e){
                if(!drag.state){
                  drag.elem = this;
                  drag.x = e.pageX;
                  drag.y = e.pageY;
                  drag.state = true;
                }
              });
              $('.NooBox-screenshot-cursorBottomRight').on('mousedown',function(e){
                if(!drag.state){
                  drag.elem = this;
                  drag.x = e.pageX;
                  drag.y = e.pageY;
                  drag.state = true;
                }
              });
              $(document).mousemove(function(e) {
                if (drag.state) {
                  delta.x = e.pageX - drag.x;
                  delta.y = e.pageY - drag.y;
                  var cur_offset = $(drag.elem).offset();
                  $(drag.elem).offset({
                    left: (cur_offset.left + delta.x),
                    top: (cur_offset.top + delta.y)
                  });
                  drag.x = e.pageX;
                  drag.y = e.pageY;
                  var left1=$(e.target).parent().find('.NooBox-screenshot-cursorTopLeft').offset().left;
                  var top1=$(e.target).parent().find('.NooBox-screenshot-cursorTopLeft').offset().top;
                  var left2=$(e.target).parent().find('.NooBox-screenshot-cursorBottomRight').offset().left;
                  var top2=$(e.target).parent().find('.NooBox-screenshot-cursorBottomRight').offset().top;
                  var canvasTop=$(e.target).parent().find('.NooBox-screenshot-canvas').offset().top;
                  var canvasLeft=$(e.target).parent().find('.NooBox-screenshot-canvas').offset().left;
                  var canvasWidth=$(e.target).parent().find('.NooBox-screenshot-canvas').width();
                  var canvasHeight=$(e.target).parent().find('.NooBox-screenshot-canvas').height();
                  var left=Math.min(left1,left2);
                  var top=Math.min(top1,top2);
                  var width=Math.abs(left1-left2);
                  var height=Math.abs(top1-top2);
                  console.log(canvasHeight+' '+top+' '+height);
                  var temp;
                  $(e.target).parent().find('.NooBox-screenshot-coverTop').css({left:(left-canvasLeft+7)+'px',width:(canvasWidth-(left-canvasLeft))+'px',height:(top-canvasTop)+'px'});
                  temp=Math.max((top-canvasTop+7),6);
                  $(e.target).parent().find('.NooBox-screenshot-coverRight').css({top:temp+'px',width:(canvasWidth-(left+width)+6)+'px',height:(canvasHeight-temp+6)+'px'});
                  $(e.target).parent().find('.NooBox-screenshot-coverBottom').css({left:'6px',width:(canvasWidth-(canvasWidth-(left+width))-6)+'px',height:(canvasHeight-height-top+canvasTop)+'px'});
                  $(e.target).parent().find('.NooBox-screenshot-coverLeft').css({top:'6px',width:(left-4)+'px',height:(top+height-canvasTop+1)+'px'});
                }
              });
              $(document).mouseup(function() {
                if (drag.state) {
                  drag.state = false;
                }
              });
              $('.NooBox-screenshot-search').on('click',function(e){
                var left1=$(e.target).parent().find('.NooBox-screenshot-cursorTopLeft').offset().left;
                var top1=$(e.target).parent().find('.NooBox-screenshot-cursorTopLeft').offset().top;
                var left2=$(e.target).parent().find('.NooBox-screenshot-cursorBottomRight').offset().left;
                var top2=$(e.target).parent().find('.NooBox-screenshot-cursorBottomRight').offset().top;
                var left=Math.min(left1,left2)+2;
                var top=Math.min(top1,top2)+1;
                var width=Math.abs(left1-left2);
                var height=Math.abs(top1-top2);
                var canvasTop=$(e.target).parent().find('.NooBox-screenshot-canvas').offset().top;
                var canvasLeft=$(e.target).parent().find('.NooBox-screenshot-canvas').offset().left;
                var ratio=img.height/$(e.target).parent().find('.NooBox-screenshot-canvas').height();
                var imgData=$(e.target).parent().find('.NooBox-screenshot-canvas')[0].getContext('2d').getImageData((left-canvasLeft)*ratio,(top-canvasTop)*ratio,(width)*ratio,(height)*ratio);
                var canvas1 = document.createElement("canvas");
                canvas1.width=(width)*ratio;
                canvas1.height=(height)*ratio;
                var ctx=canvas1.getContext('2d');
                ctx.putImageData(imgData,0,0);
                var dataURL=canvas1.toDataURL();
                chrome.extension.sendMessage({job: 'image_search_upload',data:dataURL});
              });
              setTimeout(loadScreenshot,300);
            }
            var loadScreenshot=function(){
              var canvas=$('.NooBox-screenshot-canvas').last()[0];
              if(!canvas){
                setTimeout(loadScreenshot,300);
              }
              else{
                var ctx=canvas.getContext('2d');
                ctx.drawImage(img,0,0);
              }
            }
          }
        }
      }
    );
  });
}
init();
