function WXList(set){
    if(set.main)this.main=set.main;
    if(set.frame){
           this.main=set.frame.newel("div");
           if(set.cssClass)this.main.attr({class:cssClass});
           else this.main.attr({class:"List"});
    }
    this.loadData=function(data){
        this.data=data;
        $.each(data, function(i,data){WXListItem(this, data)});
    }
    if(set.action)WXData({action: set.action, params: set.params, callback: this.loadData.bind(this)});
}

function WXListItem(list, data){
    var main=list.main.newel("div");
     this.data=data;
     this.id=data.id;
     this.type=data.type;

     if(data.info.avatar){
         block.avatar=block.newel("img");
         block.avatar.attr({src: data.info.avatar, class: "avatar"});
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
     else if(data.location==null)block.distance.html("Местоположение скрыто");

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
     var act=block.newel("div").attr({class: "ActionsBlock"});
     $.each(data.actions, function(i, action){
           act.newel("img").attr({src: getIconURL(action), class: "link"}).on('click', function(){
                 block[action](data.id);
           });
     });
     block.remove=function(id){
         //$.post(ajax_url, {action: "removePlace", id: id}, list.update);
         WXData({actionType:"remove", action: this.data.type, params:{id:id}, callback:list.update});
     };
     block.edit=function(id){
         block.editForm=EditPlaceWindow(list, block);
         marker.infoWindow.close();
         marker.infoWindow.setContent(block.editForm[0]);
         marker.infoWindow.open(list.map, block.marker);
         google.maps.event.addListener(marker.infoWindow, 'closeclick', function(){
            var content=LocationContent(null, block.data)
            marker.infoWindow.setContent(content[0]);
         })
     }
     block.on('mouseenter', function(){
         if(marker)marker.setIcon(marker.strongIcon);
     });
     block.on('mouseleave', function(){
         if(marker)marker.setIcon(marker.defaultIcon);
     });
     block.on('click', function(){
         list.unselect();
         block.attr({class: "selected"});
         block.select();
     });
     block.select=function(){
         if(marker)marker.infoWindow.open(marker.map, marker);
     }
     block.unselect=function(){
         if(marker)marker.infoWindow.close();
         block.attr({class: null})
     };
     block.filterByType=function(type){
         if(block.type==type)block.attr({style: null});
         else block.attr({style: "display: none"});
     }
     block.marker=marker;
     list.items.push(block);
     return block;
}