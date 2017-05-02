function IgList(frame){
    var list=frame.newel("div").attr({class: "List"});
    list.items=new Array();
    list.unselect=function(){
        $.each(list.items, function(i, item){
            item.unselect();
        });
    }
    list.map=frame.map;

    list.makeDragable=function(lists){
        $.each(list.items, function(i, item){
            item.makeDragable(lists);
        })
    }
    list.dropIn=function(item){
        list.droppedItem=item;
        item.showAsDroppingIn(list);
    }
    list.dropOut=function(item){
       list.dropedItem=item;
       item.showAsDroppingOut();
    }
    list.pushItem=function(){
       list.items.push(list.dropedItem);
       list.droppedItem.dropIn(list);
    }
    list.pullItem=function(){
       $.each(list.items, function(i, item){
           if(item.id==list.droppedItem.id){
                list.items.splice(i, 1);
           }
       });
       list.droppedItem.dropOut();
    }
    return list;
}

function IgListSearch(list){
    var search=list.newel("input").attr({class: "search",  placeholder: igText.search});
    search.insertBefore(list);
    search.on("focus", function(){search.attr({placeholder: null})});
    search.on("blur", function(){search.attr({placeholder: igText.search})});
    search.on("input", function(){
        $.each(list.items, function(i, item){
            item.filterByName(search[0].value);
        })
    });

    return search;
}

function IgListAddButton(list, menu, form, selector){
    var button=list.newel("div").attr({class: "listAddButton"});
    button.html(igText.add);
    if(menu)menu.selector="id";
    if(selector)menu.selector=selector;
    if(menu&form)button.on("mouseover", function(){
          menu.show();
          menu.select=function(id){
              form.showBtId({name: menu.selector, value:id});
          }

    });
    if(form&(!menu))button.on("click", function(){
        form.show();
    });
    if(menu&(!form))button.on("mouseover", function(){
        menu.show();
        menu.select=function(id){
            list.add(id);
        }
    });
    return button;
}

function IgListForm(structure, block){
    block.defaultClass=block.attr("class");
   var form=block.newel("form");
   form.dfels=[];
   $.each(structure, function(i, el){
       switch(el.type){
           case "string":
                var p=form.newel("p");
                if(el.label)p.html(igText[el.label]+": ");
                form.dfels[el.name]=p.newel("input").attr({name: el.name, value: el.value});
                form.dfels[el.name].on("input", function(){change(el.name)});
                form.dfels[el.name].on("blur", function(){if(form.id)blur(form.id, el.name, form.dfels[el.name][0].value)});
           break;
           case "hidden":
                form.dfels[el.name]=form.newel("input").attr({type: "hidden", name: el.name, value: el.value});
           break;
       }
   });
   block.form=form;
   form.defaultDisplay=form.css("display");
   block.hide=function(){
       form.css({display: "none"});
       block.attr({class: block.defaultClass});
   };
   block.show=function(){
       form.css({display: form.defaultDisplay});
       block.attr({class: "listForm"});
   };
   block.showById=function(id){
       form.dfels[id.name]=form.newel("input").attr({type: "hidden", name: id.name, value: id.value});
   }
   block.hide();

}

function IgListMenu(list, data){
   var menu=list.newel("div").attr({class: "listMenu"});
   $.each(data, function(i, data){
       var item=menu.newel("div");
       item.html(data.info.name);
       item.on("click", function(){
           menu.select(data.id);
           menu.hide();
       });
   });
   menu.defaultDisplay=menu.css("display");
   menu.select=function(id){};
   menu.hide=function(){
       menu.css({display: "none"});
   };
   menu.show=function(){
       menu.css({display: menu.defaultDisplay});
   };
   menu.hide();
   return menu;
}

function IgListItem(list, data){
     var block=list.newel("div");
     block.list=list;
     block.data=data;
     block.id=data.id;
     if(data.info.provider)block.avatar=block.newel("img").attr({src: getLocalAvatarURL(data.info.provider, data.info.slogin_id), class: "avatar"});
     if(data.info.avatar)block.avatar.attr({src: data.info.avatar});
     if(data.info.weekday)block.newel("p").attr({class: "dayShort"}).html(igText.weekshorts[data.info.weekday]);
     if(data.info.day)block.newel("p").attr({class: "dayShort"}).html(data.info.day);
     block.name=block.newel("h3");
     block.name.html(data.info.name);
     block.description=block.newel("p");
     if(data.info.description)block.description.html(block.description.html()+data.info.description);
     if(data.info.provider)block.description.newel("a").attr({href: getSocialLink(data.info.provider, data.info.slogin_id)}).newel("img").attr({src: getSocialIconURL(data.info.provider), class: "socialIcon"});
     if(data.info.registered)block.description.newel("img").attr({src: getIconURL("registered"), class: "registeredIcon"});
     if(data.info.isfriend)block.description.newel("img").attr({src: getIconURL("registered"), class: "friendIcon"});
     var act=block.newel("div").attr({class: "ActionsBlock"});
     $.each(data.actions, function(i, action){
           act.newel("img").attr({src: getIconURL(action), class: "link"}).on('click', function(){
                 block[action](data.id);
           });
     });

     block.on('click', function(){
         list.unselect();
         block.attr({class: "selected"});
         block.select(data.id);
     });

     block.showAsDroppingIn=function(list){
        block.attr({class:"droppingListItem"});
        block.remove();
        block.appendTo(list);
     }
     block.showAsDroppingOut=function(){
        block.attr({class:"droppingListItem"});
     }
     block.dropIn=function(list){
        block.attr({class: block.defaultClass});
        block.list=list;
     }
     block.dropOut=function(){

     }
     block.makeDragable=function(lists){
         block.on('mousedown', function(){
             var currentList=block.list;
             block.list._mouseleave=block.list.mouseleave();
             block.list.on('mouseleave', function(){
                 block.list.dropOut(block);
             })
             $.each(lists, function(i, list){
                 list.on('mouseover', function(){
                     list.dropIn(block);
                     currentList=list;
                 })
             })
             block._mouseup=block.mouseup();
             block.on('mouseup', function(){
                block.list.pullItem(block);
                currentList.pushItem(block);
                block.mouseup(block._mouseup);
                block.list.mouseleave(block.list._mouseleave);
             })
         })
     }

     block.select=function(id){};
     block.unselect=function(){
         block.attr({class: null})
     }
     block.filterByName=function(name){
         if(block.name.html().toLowerCase().indexOf(name.toLowerCase())==-1){
             block.attr({style: "display:none"});
         }else{
             block.attr({style: null});
         }
     }
     list.items.push(block);
     return block;
}
function getIconURL(name){
    return "/images/"+name+"_16.png";
}

function getLocalAvatarURL(provider, id){
    return "/images/avatar/"+provider+"_"+id+".jpg";
}

function getSocialIconURL(provider){
    return "/images/social/"+provider+".png";
}

function getSocialLink(provider, id){
    switch(provider){
        case "vkontakte":
            return "https://vk.com/id"+id;
        break;
        case "facebook":
            return "https:facebook.com/profile.php?id="+id;
        break;
        case "google":
            return "https://plus.google.com/u/0/"+id;
        break;
    }
}
