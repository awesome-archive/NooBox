var defaultValues=[
  ['userId',(Math.random().toString(36)+'00000000000000000').slice(2, 19)],
  ['imageSearch','1'],
  ['unitsConverter','-1'],
  ['crypter','1'],
  ['webmaster','1'],
  ['general','1'],
  ['background','-1'],
  ['imageSearchUrl_google','1'],	
  ['imageSearchUrl_baidu','1'],	
  ['imageSearchUrl_tineye','-1'],	
  ['imageSearchUrl_bing','1'],	
  ['imageSearchUrl_yandex','1'],	
  ['imageSearchUrl_saucenao','-1'],	
  ['imageSearchUrl_iqdb','-1'],	
  ['extractImage','1'],
  ['screenshotSearch','1']
];
var defaultInitNum=0;
var NooBox=NooBox||{};

NooBox.General={};
NooBox.General.extractImage=function(info,tab){
  chrome.tabs.sendMessage(tab.id,{job:"extractImage"},function(response){
    if(!response){
      chrome.notifications.create({
        type:'basic',
        iconUrl: '/images/icon_128.png',
        title: chrome.i18n.getMessage("extract_images"),
        message: chrome.i18n.getMessage("please_reload_the_page_to_initialize_noobox_component")
      });
    }
  });
};
NooBox.General.screenshotSearch=function(info,tab){
  chrome.tabs.captureVisibleTab(tab.windowId,function(dataURL){
    chrome.tabs.sendMessage(tab.id,{job:"screenshotSearch",data:dataURL},function(response){
      if(!response){
        chrome.notifications.create({
          type:'basic',
          iconUrl: '/images/icon_128.png',
          title: chrome.i18n.getMessage("screenshot_search"),
          message: chrome.i18n.getMessage("please_reload_the_page_to_initialize_noobox_component")
        });
      }
    });
  });
}
NooBox.General.updateContextMenu=function(){
  isOn('extractImage',
    function(){
    if(!NooBox.General.handle_extractImage){
      NooBox.General.handle_extractImage=chrome.contextMenus.create({
        "title": chrome.i18n.getMessage("extract_images"),
        "contexts": ["page","selection","frame","link","editable","video","audio"],
        "onclick": NooBox.General.extractImage
      });
    }},
    function(){
      if(NooBox.General.handle_extractImage){
        chrome.contextMenus.remove(NooBox.General.handle_extractImage);
        NooBox.General.handle_extractImage=null;
      }
    }
  );
  isOn('screenshotSearch',
    function(){
      if(!NooBox.General.handle_screenshotSearch){
        NooBox.General.handle_screenshotSearch=chrome.contextMenus.create({
          "title": chrome.i18n.getMessage("screenshot_search"),
          "contexts": ["all"],
          "onclick": NooBox.General.screenshotSearch
        });
      }
    },
    function(){
      if(NooBox.General.handle_screenshotSearch){
        chrome.contextMenus.remove(NooBox.General.handle_screenshotSearch);
        NooBox.General.handle_screenshotSearch=null;
      }
    }
  );
}

//Crypter
NooBox.Crypter={};
NooBox.Crypter.handle=null;
NooBox.Crypter.selection=null;
NooBox.Crypter.updateContextMenu=function(){
  isOn('crypter',
    function(){
      if(!NooBox.Crypter.handle){
        NooBox.Crypter.handle=chrome.contextMenus.create({
          "title": chrome.i18n.getMessage("crypt_it"),
          "contexts": ["selection"],
          "onclick": NooBox.Crypter.crypt
        });
      }
    },
    function(){
      if(NooBox.Crypter.handle){
        chrome.contextMenus.remove(NooBox.Crypter.handle);
        NooBox.Crypter.handle=null;
      }
    }
  );
}
NooBox.Crypter.crypt=function(info,tab){
  NooBox.Crypter.selection=info.selectionText;
  var url='/crypter.html';
  chrome.tabs.create({url:url});
}

//Webmaster
NooBox.Webmaster={};
NooBox.Webmaster.host=window.location.hostname;
NooBox.Webmaster.generateSitemap=function(URL,maxDepth){
  var linkSet=new Set();
  var brokenLinks=new Map();
  var global={total:0,finished:0,linkSet:linkSet,brokenLinks:brokenLinks};
  NooBox.Webmaster.crawl(global,URL,URL,'',maxDepth,1);
  xyz=global;
}
NooBox.Webmaster.crawl=function(global,host,url,ref,maxDepth,currentDepth){
  if(currentDepth<=maxDepth||maxDepth==-1){
    global.total++;
    NooBox.Webmaster.updateSitemap(global);
    if(!url.match(/^((tel:)|(mailto:))/)){
      $.ajax({url:url}).done(function(data){
        if(data&&data.indexOf('</html>')!=-1){
          data=data.replace(/ src=/g," nb-src=");
          $(data).find('a').each(function(i){
            var url2=NooBox.Webmaster.getURL(host,$(this).attr('href'));
            if((!global.linkSet.has(url2))&&NooBox.Webmaster.sameHost(url2,host)){
              global.linkSet.add(url2);
              NooBox.Webmaster.crawl(global,host,url2,url,maxDepth,currentDepth+1);
            }
          });
        }
        else{
          console.log('the request address is not html: '+url);
        }
        global.finished++;
        NooBox.Webmaster.updateSitemap(global);
      }).fail(function(){
        if(global.brokenLinks.get(url)==undefined){
          global.brokenLinks.set(url,[]);
        }
        global.brokenLinks.get(url).push(ref);
        global.finished++;
        NooBox.Webmaster.updateSitemap(global);
      });
    }
    else{
      global.total--;
      NooBox.Webmaster.updateSitemap(global);
    }
  }
}
NooBox.Webmaster.updateSitemap=function(global){
  var obj={};
  obj.sitemap=chrome.i18n.getMessage("generating");
  obj.brokenLinks=NooBox.Webmaster.parseBrokenLinks(global.brokenLinks);
  obj.total=global.total;
  obj.finished=global.finished;
  if(global.finished==global.total){
    setTimeout(function(){
      if(global.finished==global.total){
        download('sitemap.xml',NooBox.Webmaster.toXML(global.linkSet));
      }
    },100);
  }
  chrome.runtime.sendMessage({job:"webmaster_sitemap_update",data: JSON.stringify(obj)}, function(response) {});
}

var t;

NooBox.Webmaster.parseBrokenLinks=function(brokenLinks){
  console.log(brokenLinks);
  t=brokenLinks;
  var s="";
  var keysIt=brokenLinks.keys();
  var link;
  var refList;
  var i;
  while(true){
    it=keysIt.next();
    if(it.done)
      break;
    link=it.value;
    console.log(link);
    refList=brokenLinks.get(link);
    console.log(refList);
    s+=link+'\n';
    s+='  from:\n';
    for(i=0;i<refList.length;i++){
      s+='    '+refList[i]+'\n';
    }
  }
  return s;
}
NooBox.Webmaster.toXML=function(linkSet){
  var xmlDoc=document.implementation.createDocument('','xml',null);
  var urlSet=xmlDoc.createElement('urlset');
  urlSet.setAttribute('xmlns','http://www.sitemaps.org/schemas/sitemap/0.9');
  linkSet.forEach(function(elem){
    var url=xmlDoc.createElement('url');
    var loc=xmlDoc.createElement('loc');
    var urlText=xmlDoc.createTextNode(elem);
    loc.appendChild(urlText);
    url.appendChild(loc);
    urlSet.appendChild(url);
  });
  var xml='<?xml version="1.0" encoding="UTF-8"?>'+(new XMLSerializer()).serializeToString(urlSet)
  return xml;
}

//working on
NooBox.Webmaster.sameHost=function(urlA,urlB){
  var infoA=NooBox.Webmaster.getURLInfo(urlA);
  var infoB=NooBox.Webmaster.getURLInfo(urlB);
  return infoA.host==infoB.host;
}
//working on
NooBox.Webmaster.getURLInfo=function(url){
  var info=document.createElement('a');
  info.href=url;
  return info;
}
//working on
NooBox.Webmaster.getURL=function(host,URL){
  var tempHost=NooBox.Webmaster.getURLInfo(URL).host;
  var r=URL;
  if(tempHost==NooBox.Webmaster.host){
    r=host+URL;
  }
  if(r.indexOf('http')==-1){
    r='http://'+r;
  }
  return r;
}

//Image
NooBox.Image={};
NooBox.Image.handle=null;
NooBox.Image.ids=["google","baidu","tineye","bing","yandex","saucenao","iqdb"];
//working on it 10/16/2016
NooBox.Image.screenshotSearch=function(){
  chrome.tabs.captureVisibleTab(function(dataUrl){
    chrome.runtime.sendMessage({job:"image_dataUrl",data:"dataUrl"});
  });
}

  
NooBox.Image.apiUrls={
  google:   "https://www.google.com/searchbyimage?&image_url=",
  baidu:    "http://image.baidu.com/n/pc_search?rn=10&queryImageUrl=",
  tineye:   "http://www.tineye.com/search/?url=",
  bing:     "http://www.bing.com/images/search?view=detailv2&iss=sbi&q=imgurl:",
  yandex:   "https://www.yandex.com/images/search?rpt=imageview&img_url=",
  saucenao: "http://saucenao.com/search.php?db=999&url=",
  iqdb:     "http://iqdb.org/?url="
};

NooBox.Image.updateContextMenu=function(){
  isOn('imageSearch',
    function(){
      if(!NooBox.Image.handle){
        NooBox.Image.handle=chrome.contextMenus.create({
          "title": chrome.i18n.getMessage("search_this_image"),
          "contexts": ["image"],
          "onclick": NooBox.Image.imageFromURL
        });
      }
    },
    function(){
      if(NooBox.Image.handle){
        chrome.contextMenus.remove(NooBox.Image.handle);
      }
    }
  );
}
NooBox.Image.fetchFunctions={};
NooBox.Image.result=[];
NooBox.Image.cursor=0;
NooBox.Image.POST={};
NooBox.Image.DataWrapper={};
NooBox.Image.imageFromURL=function(info,tab){
  NooBox.Image.cursor++;
  NooBox.Image.cursor%=30;
  cursor=NooBox.Image.cursor;
  NooBox.Image.result[cursor]={};
  NooBox.Image.result[cursor].imageUrl=info.srcUrl;
  NooBox.Image.result[cursor].remains=0;
  NooBox.Image.result[cursor].finished=[];
  getImageSearchEngines(NooBox.Image.ids,function(engines){
    NooBox.Image.result[cursor].remains=engines.length;
    var dataURI=encodeURI(info.srcUrl);
    if(dataURI.match(/^data/)){
      info.isDataURI=true;
      info.dataURI=dataURI;
      NooBox.Image.result[cursor].imageUrl='dataURI';
      NooBox.Image.result[cursor].dataURI=dataURI;
      if(engines.indexOf('baidu')!=-1){
        NooBox.Image.POST.baidu(cursor,info.dataURI);
      }
      NooBox.Image.POST.general(cursor,engines,info.dataURI);
    }
    else{
      for(var i=0;i<engines.length;i++){
        (function(cursor,engine){
          var url2=NooBox.Image.apiUrls[engine]+info.srcUrl;
          NooBox.Image.result[cursor][engine+'Url']=url2;
          $.ajax({url:url2}).done(function(data){
            NooBox.Image.fetchFunctions[engine](cursor,data);
          }).fail(function(e){
            NooBox.Image.result[cursor].remains--;
            NooBox.Image.update(cursor,engine);
            console.log(e);
          });
        })(cursor,engines[i]);
      }
    }  
    var url='/image.search.html?cursor='+cursor+'&image='+NooBox.Image.result[cursor].imageUrl;
    chrome.tabs.create({url:url});
    NooBox.Image.update(cursor,'none');
  });
}

NooBox.Image.POST.upload=function(cursor,data,callback){
  var formData=new FormData();
  formData.append('upload',dataURItoBlob(data),'NooBox');
  $.ajax({
    type:'POST',
    url:'http://old.postimage.org/index.php',
    contentType: false,
    processData: false,
    data: formData
  }).done(function(data){
    data=data.replace(/ src=/g," nb-src=");
    var url=$(data).find('.gallery').find('img').attr("nb-src");
    NooBox.Image.result[cursor].uploadedURL=url||"";
    callback();
  }).fail(function(err){
    console.log(err);
  });
}

NooBox.Image.POST.general=function(cursor,engines,data){
  if(NooBox.Image.result[cursor].uploadedURL){
    for(var i=0;i<engines.length;i++){
      (function(engine){
        var engine=engines[i];
        if(engine!='baidu'){
          var url=NooBox.Image.apiUrls[engine]+NooBox.Image.result[cursor].uploadedURL;
          NooBox.Image.result[cursor][engine+'Url']=url;
          $.ajax({url:url}).done(NooBox.Image.fetchFunctions[engine].bind(null,cursor));
        }
      })(engines[i])
    }
  }
  else{
    NooBox.Image.POST.upload(cursor,data,NooBox.Image.POST.general.bind(null,cursor,engines,null));
  }
}

NooBox.Image.POST.baidu=function(cursor,data){
  $.ajax({
  type:'POST',
  url:'http://stu.baidu.com/i?appid=4',
  contentType:'multipart/form-data; boundary=----WebKitFormBoundary',
  data:NooBox.Image.DataWrapper.baidu({data:data,name:'dragimage'},'----WebKitFormBoundary')
  }).done(function(data){
    NooBox.Image.result[cursor]['baiduUrl']=data;
    $.ajax({url:data}).done(NooBox.Image.fetchFunctions.baidu.bind(null,cursor));
  });
}

NooBox.Image.DataWrapper.baidu=function(binaryData, boundary, otherParameters) {
  var commonHeader = 'Content-Disposition: form-data; ';
  var data = [];
  data.push('--' + boundary + '\r\n');

  data.push(commonHeader);

  data.push('name="image";filename=""\r\n');
  data.push('Content-Type: application/octet-stream\r\n\r\n\r\n');

  data.push('--' + boundary + '\r\n');
  data.push(commonHeader);

  data.push('name="' + (binaryData.name || 'binaryfilename') + '"; \r\n\r\n');
  data.push(binaryData.data + '\r\n');

  data.push('--' + boundary + '--\r\n');
  return data.join('');
}

NooBox.Image.update=function(i,engine){
  setDB('NooBox.Image.result_'+i,
    NooBox.Image.result[i],
    function(){
      chrome.runtime.sendMessage({job:'image_result_update',engine:engine,cursor:i}, function(response) {});
    }
  );
}


NooBox.Image.fetchFunctions.google=function(cursor,data){
  try{
    data=data.replace(/<img[^>]*>/g,"");
    var page=$(data);
    var keyword=page.find('._gUb').text();
    var relatedWebsites=[];
    var relatedWebsiteList=$(page.find('#rso').find('.rgsep')[0]).prev().find('.rc')
      for(var i=0;i<relatedWebsiteList.length;i++){
        var website={};
        var temp=$(relatedWebsiteList[i]);
        var x=temp.find('a')[0];
        website.link=x.href;
        website.title=x.innerText;
        var y=temp.find('.s').find('.st')[0];
        website.description=y.innerHTML;
        website.searchEngine='google';
        relatedWebsites.push(website);
      }
    var websites=[];
    var websiteList=$(page.find('#rso').find('.rgsep')).last().prev().find('.rc');
    for(var i=0;i<websiteList.length;i++){
      var website={};
      var temp=$(websiteList[i]);
      var x=temp.find('a')[0];
      website.link=x.href;
      website.title=x.innerText;
      var y=temp.find('.s').find('.st')[0];
      website.description=y.innerHTML;
      var z=temp.find('._lyb').find('a')[0];

      if(z!=null){
        var start=z.href.indexOf("imgurl=")+7;
        var end=z.href.indexOf("&",start);
        if(end==-1)
          website.imageUrl=z.href.slice(start);
        else
          website.imageUrl=z.href.slice(start,end);
        var cut=website.imageUrl.indexOf('jpg%');
        if(cut!=-1){
          website.imageUrl=website.imageUrl.slice(0,cut+3);
        }
        cut=website.imageUrl.indexOf('png%');
        if(cut!=-1){
          website.imageUrl=website.imageUrl.slice(0,cut+3);
        }
        cut=website.imageUrl.indexOf('gif%');
        if(cut!=-1){
          website.imageUrl=website.imageUrl.slice(0,cut+3);
        }
      }
      website.searchEngine='google';
      websites.push(website);
    }
    NooBox.Image.result[cursor].googleKeyword=keyword;
    NooBox.Image.result[cursor].googleRelatedWebsites=relatedWebsites;
    NooBox.Image.result[cursor].googleWebsites=websites;
    NooBox.Image.result[cursor].remains=NooBox.Image.result[cursor].remains-1;
    NooBox.Image.result[cursor].finished.push('google');
    NooBox.Image.update(cursor,'google');
  }
  catch(e){
    console.log(e);
    NooBox.Image.result[cursor].remains=NooBox.Image.result[cursor].remains-1;
    NooBox.Image.result[cursor].finished.push('google');
    NooBox.Image.update(cursor,'google');
  }
};

NooBox.Image.fetchFunctions.baidu=function(cursor,data){
  try{
    data=data.replace(/<img[^>]*>/g,"");
    var page=$(data);
    var keyword=page.find('.guess-info-word-link').text()||page.find('.guess-info-text-link').text();
    var relatedWebsites=[];
    var relatedWebsiteLinks=page.find('.guess-baike').find('.guess-baike-title').find('a');
    var relatedWebsiteDescriptions=page.find('.guess-baike').find('.guess-baike-text');
    for(var i=0;i<relatedWebsiteLinks.length;i++){
      var website={};
      website.link=relatedWebsiteLinks[i].href;
      website.title=relatedWebsiteLinks[i].innerText;
      website.description=relatedWebsiteDescriptions[i].innerHTML;
      website.searchEngine='baidu';
      relatedWebsites.push(website);
    }
    var relatedWebsiteLinks=page.find('.guess-newbaike').find('.guess-newbaike-text-title').find('a');
    var relatedWebsiteDescriptions=page.find('.guess-newbaike').find('.guess-newbaike-text-box');
    for(var i=0;i<relatedWebsiteLinks.length;i++){
      var website={};
      website.link=relatedWebsiteLinks[i].href;
      website.title=relatedWebsiteLinks[i].innerText;
      website.description=relatedWebsiteDescriptions[i].innerHTML;
      website.searchEngine='baidu';
      relatedWebsites.push(website);
    }
    var websites=[];
    var websiteList=page.find('.source-card-topic');
    for(var i=0;i<websiteList.length;i++){
      var website={};
      var temp=$(websiteList[i]);
      var x=temp.find('a')[0];
      website.link=x.href;
      website.title=x.innerText;
      var y=temp.find('.source-card-topic-content')[0];
      website.description=y.innerHTML;
      var z=temp.find('.source-card-topic-same-image')[0];
      if(z){
        var start=z.style.backgroundImage.indexOf('http');
        var end=z.style.backgroundImage.indexOf('")');
        website.imageUrl=z.style.backgroundImage.slice(start,end);
        website.imageUrl=website.imageUrl.replace(/&amp;/g,'');
      }
      website.searchEngine='baidu';
      websites.push(website);
    }
    NooBox.Image.result[cursor].baiduKeyword=keyword;
    NooBox.Image.result[cursor].baiduRelatedWebsites=relatedWebsites;
    NooBox.Image.result[cursor].baiduWebsites=websites;
    NooBox.Image.result[cursor].remains=NooBox.Image.result[cursor].remains-1;
    NooBox.Image.result[cursor].finished.push('baidu');
    NooBox.Image.update(cursor,'baidu');
  }
  catch(e){
    console.log(e);
    NooBox.Image.result[cursor].remains=NooBox.Image.result[cursor].remains-1;
    NooBox.Image.result[cursor].finished.push('baidu');
    NooBox.Image.update(cursor,'baidu');
  }
};

NooBox.Image.fetchFunctions.tineye=function(cursor,data){
  data=data.replace(/<img[^>]*>/g,"");
  try{
    data=data.replace(/<img[^>]*>/g,"");
    var page=$(data);
    var websites=[];
    var relatedWebsites=[];
    var websiteList=$(page.find('.match'));
    for(var i=0;i<websiteList.length;i++){
      var website={};
      var temp=$(websiteList[i]);
      if(temp.find('.top-padding').length>0){
        var x=temp.find('.top-padding').find('a')[0];
        website.link=x.href;
        website.title=x.title;
        website.searchEngine='tineye';
        website.description="";
        relatedWebsites.push(website);
      }
      else{
        var x=$(temp).find('p').find('a')[2];
        website.link=x.href;
        website.description=x.href;
        website.title=x.title;
        var y=$(temp).find('p').find('a')[1];
        website.imageUrl=y.href;
        website.searchEngine='tineye';
        websites.push(website);
      }
    }
    NooBox.Image.result[cursor].tineyeWebsites=websites;
    NooBox.Image.result[cursor].tineyeRelatedWebsites=relatedWebsites;
    NooBox.Image.result[cursor].remains=NooBox.Image.result[cursor].remains-1;
    NooBox.Image.result[cursor].finished.push('tineye');
    NooBox.Image.update(cursor,'tineye');
  }
  catch(e){
    NooBox.Image.result[cursor].remains=NooBox.Image.result[cursor].remains-1;
    NooBox.Image.result[cursor].finished.push('tineye');
    NooBox.Image.update(cursor,'tineye');
    console.log(e);
  }
};

NooBox.Image.fetchFunctions.bing=function(cursor,data){
  try{
    data=data.replace(/<img[^>]*>/g,"");
    var keyword=$(data).find('.query').text();
    NooBox.Image.result[cursor].bingKeyword=keyword;
    NooBox.Image.result[cursor].remains=NooBox.Image.result[cursor].remains-1;
    NooBox.Image.result[cursor].finished.push('bing');
    NooBox.Image.update(cursor,'bing');
  }
  catch(e){
    NooBox.Image.result[cursor].remains=NooBox.Image.result[cursor].remains-1;
    NooBox.Image.result[cursor].finished.push('bing');
    NooBox.Image.update(cursor,'bing');
    console.log(e);
  }
};

NooBox.Image.fetchFunctions.yandex=function(cursor,data){
  try{
    data=data.replace(/<img[^>]*>/g,"");
    var page=$(data);
    var websites=[];
    var websiteList=$(page.find('.other-sites__item'));
    for(var i=0;i<websiteList.length;i++){
      var website={};
      var temp=$(websiteList[i]);
      var x=temp.find('.other-sites__snippet').find('a')[0];
      website.link=x.href;
      website.title=x.innerText;
      var y=temp.find('.other-sites__desc')[0];
      website.description=y.innerHTML;
      var z=temp.find('.other-sites__preview-link')[0];

      website.imageUrl=z.href;
      website.searchEngine='yandex';
      websites.push(website);
    }
    NooBox.Image.result[cursor].yandexWebsites=websites;
    NooBox.Image.result[cursor].remains=NooBox.Image.result[cursor].remains-1;
    NooBox.Image.result[cursor].finished.push('yandex');
    NooBox.Image.update(cursor,'yandex');
  }
  catch(e){
    NooBox.Image.result[cursor].remains=NooBox.Image.result[cursor].remains-1;
    NooBox.Image.result[cursor].finished.push('yandex');
    NooBox.Image.update(cursor,'yandex');
    console.log(e);
  }
};

NooBox.Image.fetchFunctions.saucenao=function(cursor,data){
  try{
    data=data.replace(/ src=/g," nb-src=");
    var page=$(data);
    var websites=[];
    var websiteList=$(page.find('#result-hidden-notification').prevAll('.result'));
    for(var i=0;i<websiteList.length;i++){
      var website={};
      var temp=$(websiteList[i]);
      website.link="";
      website.title="";
      var y=temp.find('.resulttablecontent')[0];
      website.description=y.innerHTML.replace(/(nb-src="\/image|nb-src="image)/g,'src="http://saucenao.com/image');
      var z=temp.find('.resultimage').find('img')[0];
      website.imageUrl=z.getAttribute('nb-src');
      website.searchEngine='saucenao';
      websites.push(website);
    }
    NooBox.Image.result[cursor].saucenaoRelatedWebsites=websites;
    websites=[];
    var websiteList=$(page.find('#result-hidden-notification').nextAll('.result'));
    for(var i=0;i<websiteList.length;i++){
      var website={};
      var temp=$(websiteList[i]);
      website.link="";
      website.title="";
      var y=temp.find('.resulttablecontent')[0];
      website.description=y.innerHTML.replace(/(nb-src="\/image|nb-src="image)/g,'src="http://saucenao.com/image');
      var z=temp.find('.resultimage').find('img')[0];
      website.imageUrl=z.getAttribute('data-src');
      website.searchEngine='saucenao';
      websites.push(website);
    }
    NooBox.Image.result[cursor].saucenaoWebsites=websites;
    NooBox.Image.result[cursor].remains=NooBox.Image.result[cursor].remains-1;
    NooBox.Image.result[cursor].finished.push('saucenao');
    NooBox.Image.update(cursor,'saucenao');
  }
  catch(e){
    NooBox.Image.result[cursor].remains=NooBox.Image.result[cursor].remains-1;
    NooBox.Image.result[cursor].finished.push('saucenao');
    NooBox.Image.update(cursor,'saucenao');
    console.log(e);
  }
};

NooBox.Image.fetchFunctions.iqdb=function(cursor,data){
  try{
    data=data.replace(/ src=\'\/([^\/])/g," nb-src='$1");
    data=data.replace(/ src=\"\/\//g,' nb1-src="');
    data=data.replace(/ href=\"\/\//g,' nb-href="');
    var page=$(data);
    var websites=[];
    var websiteList=$(page.find('table'));
    for(var i=1;i<websiteList.length-2;i++){
      var description='<table>'+websiteList[i].innerHTML.replace(/nb-src="/g,'src="http://iqdb.org/')+'</table>';
      description=description.replace(/nb1-src="/g,'src="http://');
      description=description.replace(/nb-href="/g,'href="http://');
      var website={link:"",title:"",imageUrl:"",searchEngine:"iqdb",description:description};
      if(websiteList[i].innerHTML.indexOf("Best match")!=-1){
        NooBox.Image.result[cursor].saucenaoRelatedWebsites=[website];
      }
      else{
        websites.push(website);
      }
    }
    NooBox.Image.result[cursor].iqdbWebsites=websites;
    NooBox.Image.result[cursor].remains=NooBox.Image.result[cursor].remains-1;
    NooBox.Image.result[cursor].finished.push('iqdb');
    NooBox.Image.update(cursor,'iqdb');
  }
  catch(e){
    NooBox.Image.result[cursor].remains=NooBox.Image.result[cursor].remains-1;
    NooBox.Image.result[cursor].finished.push('iqdb');
    NooBox.Image.update(cursor,'iqdb');
    console.log(e);
  }
};

function initDefault(i){
  if(!i)
    i=0;
  if(i<defaultValues.length)
    setIfNull(defaultValues[i][0],defaultValues[i][1],initDefault.bind(null,i+1));
  NooBox.Image.updateContextMenu();
  NooBox.Crypter.updateContextMenu();
  NooBox.General.updateContextMenu();
}

function init(){
  initDefault();
}

document.addEventListener('DOMContentLoaded', function(){
  init();
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if('job' in request){
        if (request.job == "imageSearch"){
          NooBox.Image.updateContextMenu();
        }
        else if(request.job=="image_search_re_search"){
          NooBox.Image.imageFromURL({srcUrl:request.data});
          chrome.notifications.create({
            type:'basic',
            iconUrl: '/images/icon_128.png',
            title: chrome.i18n.getMessage("Reverse_Image_Search"),
            message: chrome.i18n.getMessage("Uploading_image_to_get_more_results")
          });
          sendResponse({'status':'done'});
        }
        else if(request.job=="image_search_upload"){
          console.log(request.data);
          NooBox.Image.imageFromURL({srcUrl:request.data});
        }
        else if(request.job=="crypter"){
          NooBox.Crypter.updateContextMenu();
        }
        else if(request.job=="crypter_getSelection"){
          sendResponse({selection: NooBox.Crypter.selection});
        }
        else if(request.job=="webmaster_sitemap_get"){
          var temp=JSON.parse(request.data);
          NooBox.Webmaster.generateSitemap(temp.URL,temp.maxDepth);
        }
        else if(request.job=="general"){
          NooBox.General.updateContextMenu();
        }
        else if(request.job=="extractImage"){
          NooBox.General.updateContextMenu();
        }
        else if(request.job=="screenshotSearch"){
          NooBox.General.updateContextMenu();
        }
        else if(request.job=="notification"){
          if(request.data=="NooBox_does_not_support_iframe_image_extraction"){
            chrome.notifications.create({
              type:'basic',
              iconUrl: '/images/icon_128.png',
              title: chrome.i18n.getMessage("Extract_Images2"),
              message: chrome.i18n.getMessage("NooBox_does_not_support_iframe_image_extraction")
            });
          }
        }

      }
    });
});
