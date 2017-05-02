var noticeBar;
var topMapBar;
var igMap={__proto__: igFrame,
    mapCssClass: "bigMap",
    addPlaceString: "Add New Place",
    clear: function(){
        this.map.data.forEach(this.remove);
    },
    init: function(data){
        this.options = {
		    zoom: 14,
            mapTypeControl: false,
            streetViewControl: false
	    }

            if(data[0]){
                this.options.center=new google.maps.LatLng(data[0].location.lat, data[0].location.lng);
            } else {
                this.options.center=new google.maps.LatLng(-34.397, 150.644);
            }
            this.make(data);

    },
    makeMain: function(frame){
        frame.empty();
        var mapdiv=frame.newel("div").attr({class:this.mapCssClass});
        WXDiv({div:mapdiv, corr:15});
        this.map = new google.maps.Map(mapdiv[0], this.options);

        this.list = SourceList(this, this.data);
        this.list.update=this.update.bind(this);
        topMapBar=TopMapBar(this);

        noticeBar=NoticeBlock(this, $("#sn-position"));
        $.timer(noticeBar.load.bind(noticeBar)).set({time:5000, autostart:true});
        this.selector = LocationTypeSelector(this, this.data, this.setType.bind(this));
        return this.map;
    },
    click: function(position){

    },
    setType: function(type){
        $.each(this.list.items, function(i, item){
            item.filterByType(type)
        });
        //if(vk_auth)vk_auth();
        this.addButton= AddButton(type, this, this.list, this.data);
    }
}

function Selector(frame, data, callback){
    var content=frame.newel("div").attr({class: "LocationTypeSelector"});
    //content.on('click', vk_auth);
    content.blocks=new Array();
    function reset(){
        $.each(data, function(i,data){
             data.block.attr({class:null});
        })
    }
    $.each(data, function(i, _data){
        data[i].block=content.newel("div");
        if(_data.checked)data[i].block.attr({class: "checked"});
        if(_data.type)data[i].block.newel("img").attr({src:getIconURL(_data.type)});
        if(_data.lngText)data[i].block.newel("p").html(igText[_data.lngText]);
        data[i].block.select=function(){
            reset();
            data[i].block.attr({class: "checked"});
            callback(_data.id);
        }
        data[i].block.on('click', data[i].block.select);
        content.blocks[_data.id]=data[i].block;
    });
    return content;
}

function TopMapBar(frame){
     var content=$(document.createElement("div")).attr({class: "topMapBar"});
     frame.map.controls[google.maps.ControlPosition.TOP_CENTER].push(content[0]);
     return content;
}

function LocationTypeSelector(frame, data, callback){
    var content=Selector(topMapBar.newel("div"), new Array(
        {type: "people", id: "people", lngText: "peoples"},
        {type: "place", id: "place", lngText: "places"},
        {type: "meet", id: "meet", lngText: "meets"},
        {type: "task", id: "task", lngText: "tasks"}
    ), callback)
    return content;
}

function NoticeBlock(frame, topBar){
    var content=topMapBar.newel("div").attr({class: "hiddenBlock"});
    content.notice=function(set){
        content.empty();
         content.attr({class: "noticeBlock"});
         content.activated=true;
         content.newel("img").attr({class: "closeIcon", src: getIconURL("cancel")}).on("click", function(){
             content.close();
         });
         if(set.title)content.newel("h3").html(set.title);
         if(set.type)content.newel("img").attr({class: "mainIcon", src: getBigIconURL(set.type)});
         if(set.message)content.newel("p").attr({class: "message"}).html(set.message);
         if(set.item){
             var item=content.newel("div").attr({class: "innerItem"});
             ListItem(item, Location(item, set.item), set.item);
         }
         if(set.actions)content.actions=set.actions;

    }
    content.close=function(){
        content.empty();
        content.attr({class:"hiddenBlock"});
        if(content.actions)if(content.actions.close)content.actions.close();
        content.actions={};
        content.activated=false;
    }
    content.notices=new Array();
    content.init=function(data){
        topBar.empty();
        $.each(data, function(i, data){
            topBar.newel("img").attr({src: getAnimatedIconURL(data.type), class: "noticeIcon"}).on('click', function(){
                content.notice({item: data});
            });
            if(!content.activated)content.notice({item: data});
        });
    }
    content.load=function(){
        WXData({action: "notices", callback:content.init});
    }
    return content;
}
function ExMapList(frame, action){

    frame.items=new Array();
    frame.init=function(data){
        frame.empty();
        $.each(data, function(i, data){
            var marker=Location(frame, data);
            frame.items[i]=ListItem(frame, marker, data);
        });
        WXResize();
    }
    WXData({action: action, callback:frame.init});
    frame.unselect=function(){
        $.each(frame.items, function(i, item){
            item.unselect();
        });
    }
    return frame;
}


function SourceList(frame, data){
    var content=$(document.createElement("div")).attr({class: "List"});
    WXDiv({div:content, corr:100});
    frame.map.controls[google.maps.ControlPosition.TOP_LEFT].push(content[0]);
    content.items=new Array();
    content.unselect=function(){
        $.each(content.items, function(i, item){
            item.unselect();
        });
    }
    content.map=frame.map;
    return content;
}




function OptionalList(frame, action, callback){
    var content=$(document.createElement("div")).attr({class: "List"});
    WXDiv({div:content, corr:100});
    content.items=new Array();
    content.init=function(data){
        $.each(data, function(i, data){
            var marker=Location(frame, data);
            content.items[i]=ListItem(content, marker, data);
            content.items[i].select=function(){
                callback (data);
            }
        })
    }
    WXData({action: action, callback: content.init});
    frame.map.controls[google.maps.ControlPosition.TOP_RIGHT].clear();
    frame.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(content[0]);

    content.unselect=function(){
        $.each(content.items, function(i, item){
            item.unselect();
        });
    }
    content.remove=function(){
         frame.map.controls[google.maps.ControlPosition.TOP_RIGHT].clear();
    }
    content.map=frame.map;
    return content;
}

function ListItem(list, marker, data){
    if (data.type=="hidden") return 0;
     var block=list.newel("div");
     block.data=data;
     block.id=data.id;
     block.type=data.type;

     if(data.is_favorite){
         block.newel("img").attr({src:getIconURL("favorite")});
     }

     if(data.info.avatar){
         block.avatar=block.newel("img");
         block.avatar.attr({src: data.info.avatar, class: "avatar"});
     }else{
         block.avatar=block.newel("img");
         block.avatar.attr({src: getBigIconURL(data.type), class: "avatar"});
     }
     block.name=block.newel("h3");
     block.name.html(data.info.name);
     block.distance=block.newel("p");
     if(data.info.distance){
         block.distance.html(data.info.distance+"м от меня");
         if(data.info.distance>1000) block.distance.html(Math.round(data.info.distance/1000)+" км от меня")
     }else if(data.type=="meet"&&data.proof!=1){
         if(data.isnew==1)block.distance.html("Ожидает подтверждения");
         else block.distance.html("Встреча отклонена");
     }
     else if(data.location==null)block.distance.html("За горизонтом");

     if(data.people){
         block.people=block.newel("p");
         block.people.newel("img").attr({src:getIconURL("people")});
         block.people.html(block.people.html()+data.people.name);
     }
     if(data.place){
         block.place=block.newel("p");
         block.place.newel("img").attr({src:getIconURL("place")});
         block.place.html(block.place.html()+data.place.name);
     }
     block.description=block.newel("p");
     if(data.info.description)block.description.html(data.info.description);


     //Заполняем Action Block
     var act=block.newel("div").attr({class: "ActionsBlock"});
     $.each(data.actions, function(i, action){
            var p=act.newel("p");
            p.html(igText.actions[action]);
           var img=act.newel("img").attr({src: getIconURL(action), class: "link"}).on('click', function(){
                 block.makeAction(action, data.id);
           });
           img.on("mouseover", function(){p.attr({class: "visible"})});
           img.on("mouseleave", function(){p.attr({class: ""})});
     });

     block.makeAction=function(action, id){
         if(action=="edit")return block.edit(id);
         var callback=list.update;
         if(action=="complete"||action=="cancel")callback=function(){};
         WXData({actionType: action, action: this.data.type, params:{id:id}, callback:callback});
     }

     block.edit=function(id){
         block.editForm=EditPlaceWindow(list, block);
         if(marker!=null){
             marker.infoWindow.close();
            marker.infoWindow.setContent(block.editForm[0]);
            marker.infoWindow.open(list.map, block.marker);
            google.maps.event.addListener(marker.infoWindow, 'closeclick', function(){
            var content=LocationContent(null, block.data)
            marker.infoWindow.setContent(content[0]);
         })
         }else{
             var modal={__proto__: modalWindow,
                 inner: block.editForm[0]
             };
             modal.show();
         }

     }
     block.on('mouseenter', function(){
         if(marker)marker.setIcon(marker.strongIcon);
     });
     block.on('mouseleave', function(){
         if(marker)marker.setIcon(marker.defaultIcon);
     });
     block.on('click', function(){
         if(list.unselect){
            list.unselect();
            block.attr({class: "selected"});
            block.select();
         }
     });
     block.select=function(){
         if(marker)marker.infoWindow.open(marker.map, marker);
     }
     block.unselect=function(){
         if(marker)marker.infoWindow.close();
         block.attr({class: null})
     };
     block.filterByType=function(type){
         if(block.type==type||block.type=="me")block.attr({style: null});
         else block.attr({style: "display: none"});
     }
     block.marker=marker;
     list.items.push(block);
     return block;
}

function AddButton(type, main, list, data){
    var content=list.newel("div").attr({class: "AddButton"});
    addFunctions=new Array ();
    addFunctions['place']=function(){
        main.map.addListener('click', function(position){
            if(main.map.addActivated){
                list.newItem.empty();
                var image=new google.maps.MarkerImage(getBigMarkerIconURL("place"));
                var marker=new google.maps.Marker({position:position.latLng, map: main.map, icon: image});
                list.newItem=ListItem(list, marker, {info:{name:igText.name, description:igText.name}});
                list.AddForm=EditPlaceWindow(list, list.newItem);
                list.AddForm.add();
                list.addWindow=new google.maps.InfoWindow({content: list.AddForm[0]});
                list.addWindow.open(main.map, list.newItem.marker);
                main.map.addActivated=false;
                noticeBar.close();
            }

        });
        main.map.deactivate=function(){main.map.addActivated=false;}

        list.newItem=list.newel("div").attr({class: "newListItem"});
        noticeBar.notice({type: "place", title: igText.addPlace, message: igText.selectPlaceOnMap, actions: {close: main.map.deactivate.bind(this)}});
        list.newItem.html(igText.selectPlaceOnMap);
        main.map.addActivated=true;
    }
    addFunctions['people']=function(){
        content.optionalList=new OptionalList(main, "allFriends", addFunctions['people_2']);
        noticeBar.notice({type: "people", title: igText.addPeople, message: igText.selectPeopleOnList, actions:{close: content.optionalList.remove.bind(this)}});

    }
    addFunctions['people_2']=function(data){
        //Приглашение друга из ВК в приложение
        noticeBar.close();
        WXData({actionType: "invite", action: "people", params: {id: data.id}, callback: function(){
             alert ("Приглшение другу "+data.info.name+" отправлено");
        }})


    }
    addFunctions['meet']=function(){
        content.optionalList=new OptionalList(main, "peoples", addFunctions['meet_2']);
        noticeBar.notice({type: "meet", title: igText.addMeet, message: igText.selectPeopleToMeet, actions:{close:content.optionalList.remove.bind(this)}});
    }
    addFunctions['meet_2']=function(data){
         //Форма добавления встречи: название, описание, дистанция
         noticeBar.close();
         //content.optionalList.remove();
         var form={__proto__:modalForm,
            titleText: "Новая встреча с другом "+data.info.name,
            init: function(index){
               $(this.htmlForm).newel("input").attr({id: "newMeetName", placeholder: "Название встречи"});
               $(this.htmlForm).newel("input").attr({id: "newMeetDescription", placeholder: "Описание встречи"});
               $(this.htmlForm).newel("input").attr({id: "newMeetDistance", placeholder: "Расстояние оповещения"});
               this.showNCButtons();
            },
            nextAction: function(id){
               WXData({actionType: "add", action: "meet", callback: main.update.bind(main),
                params:{
                    name: form.fvar("newMeetName"),
                    description: form.fvar("newMeetDescription"),
                    distance: form.fvar("newMeetDistance"),
                    people_id: data.id
                }
               });
               form.hide();
            }
         }
         form.showByIndex(data.id);
    }
    addFunctions['task']=function(){
        content.optionalList=new OptionalList(main, "places", addFunctions['task_2']);
        noticeBar.notice({type: "task", title: igText.addTask, message: igText.selectPlaceToTask, actions:{close:content.optionalList.remove.bind(this)}});
    }
    addFunctions['task_2']=function(data){
         //Форма добавления задачи: название, описание, дистанция
         noticeBar.close();
         //content.optionalList.remove();
         var form={__proto__:modalForm,
            titleText: "Новая задача в "+data.info.name,
            init: function(index){
               $(this.htmlForm).newel("input").attr({id: "newTaskName", placeholder: "Название задачи"});
               $(this.htmlForm).newel("input").attr({id: "newTaskDescription", placeholder: "Описание задачи"});
               $(this.htmlForm).newel("input").attr({id: "newTaskDistance", placeholder: "Расстояние оповещения"});
               this.showNCButtons();
            },
            nextAction: function(id){
               WXData({actionType: "add", action: "anchor", callback: main.update.bind(main),
                params:{
                    name: form.fvar("newTaskName"),
                    description: form.fvar("newTaskDescription"),
                    distance: form.fvar("newTaskDistance"),
                    place_id: data.id
                }
               });
               form.hide();
            }
         }
         form.showByIndex(data.id);
    }
    content.on('click', addFunctions[type]);
    return content;
}



function EditPlaceWindow(list, item){
    var content=$(document.createElement("div"));
    var header={
        place:igText.editPlace,
        meet:igText.editMeet,
        task:igText.editTask
    };
    content.newel("h3").html(header[item.data.type]);

    var form;
    function change(id){
        item[id].html(form.dfels[id][0].value);
    }
    function blur(id, properity, value){
        item.data.info[properity]=value;
        $.post(ajax_url, {action: "editProperity", properity: properity, value: encodeURIComponent(value), type: item.data.type, id: id});
    }
    content.add=function(){
         sendForm("addPlace", form, form.setId);
         change("name"); change("description");
    }

    var fields=new Array(
        {type: "string",  name: "name", value: item.name.html(), label: "name"},
        {type: "string",  name: "description", value: item.description.html(), label: "description"}
    );

    if(item.data.type=="meet"||item.data.type=="task"){
        fields.push({type: "string",  name: "radius", value: item.data.info.radius, label: "alarmRadius"})
    }

    if(item.marker!=null) fields.push(
        {type: "hidden",  name: "lat", value: item.marker.position.lat},
        {type: "hidden",  name: "lng", value: item.marker.position.lng}
    );

    form=DynamicForm(content, fields, change, blur);
    if(item.id)form.id=item.id;
    form.complete=function(){
        list.update();
        return false;
    }
    form.on('submit', form.complete);
    content.change=change;
    content.blur=blur;

    return content;
}

function sendForm(action, form, callback){
    var params={};
    $.each(form.serializeArray(), function(i, field){params[field.name]=encodeURIComponent(field.value)});
    $.ajax({url: ajax_url+"?action="+action, data: params, success: callback, dataType: "json"});
}

function DynamicForm(paerent, structure, change, blur){
   var form=paerent.newel("form");
   form.dfels=new Array();
   form.setId=function(data){
       form.data=data;
       form.id=data.id;
       form.dfels["id"]=form.newel("input").attr({type: "hidden", name: "id", value: "data.data.id"});
       var ok=form.newel("button");
        ok.html("OK");
   }
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
   return form;
}

function Location(mapFrame, data){
    if(data.location==null)return null;
    var position=new google.maps.LatLng(data.location.lat, data.location.lng);

    var image=new google.maps.MarkerImage(getMarkerIconURL(data.type));
    var marker=new google.maps.Marker({position: position, map: mapFrame, title: data.info.name, icon: image});
    marker.defaultIcon=image;
    marker.strongIcon=new google.maps.MarkerImage(getBigMarkerIconURL(data.type));

    marker.infoWindow = new google.maps.InfoWindow({content: LocationContent(this, data).html()});
    google.maps.event.addListener(marker, 'click', function(){
        marker.infoWindow.open(mapFrame, marker);
    });
    return marker;
}

function LocationContent(paerent, data){
    var content=$(document.createElement("div"));
    if(data.info.avatar)content.newel("img").attr({src:data.info.avatar});
    content.newel("h3").html(data.info.name);
    content.newel("p").html(data.info.description);
    return content;
}

function getIconURL(name){
    return "/images/icons/32/"+name+".png";
}
function getBigIconURL(name){
    return "/images/icons/64/"+name+".png";
}
function getMarkerIconURL(name){
    return "/images/markers/32/"+name+".png";
}
function getBigMarkerIconURL(name){
    return "/images/markers/64/"+name+".png";
}
function getAnimatedIconURL(name){
    return "/images/icons/"+name+".gif";
}