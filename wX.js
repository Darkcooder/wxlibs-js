var wX={}

wX.data=function(name, set){
    var data={name: name, set: set, Name: name[0].toUpperCase() + name.slice(1)};
    data.srv=function(act, callback){
        var params=data.set;
        params.action=act;
        params.object=data.name;
        $.ajax({
            url:ajax_url,
            dataType: "json",
            data: params,
            success: callback
        });
    }
    data.get=function(callback){data.srv("get", callback)};
    data.add=function(obj, callback){
        data.set=Object.assign(data.set, obj);
        data.srv("add", callback);
    }
    data.edit=function(opt, callback){
        data.set=Object.assign(data.set, opt);
        data.srv=("edit", callback);
    }
    data.remove=function(opt, callback){
        data.set=Object.assign(data.set, opt);
        data.srv("remove", callback);
    }
    data.clear=function(){
        //data={name: data.name, set: data.set, }
    }
    return data;
}

wX.list=function(set){
    var list={set: set};
    if(set.ess)list.data=wX.data(set.ess.name, set.ess.opt);

    list.make=function(){

        list.$=list.set.main;
        list=Object.assign(list.$, list);

        if(list.set.child)list.set.child.set.frame=list;
        list.items=[];
        if(list.set.wigets)$.each(list.set.wigets, function(i, wiget){
            wiget.set.frame=list;
            wiget.make();
        })

        list.data.get(function(srv){
            list.data.items=srv.data;
           $.each(srv.data, function(i, data){
               if(list.set.child) list.items[i]=new list.set.child.make(data, list.set.child);
           });
           if(list.callback)list.callback();
        })
        list.addTemplate=function(set){
            if(list.set.child)list.items[list.items.length]=new list.set.child.makeForm(static, data, list.set.child);
        }
        list.unselect=function(){
        $.each(this.items, function(i, item){
            item.unselect();
        });

    }
        return list;
    }

    list.update=function(){
        if(list.empty)list.empty();
        list.make();
    }

    list.dropIn=function(item){
        list.droppedItem=item;
        item.dropTo(list);
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

wX.item=function(set){
    this.set=set;

    this.update=function(data){
        this.$.empty();
        this.make(data, this);
    }

    this.make=function(data, pattern){
        var presentor={
            name: function(name){var h=this.$.newel("h3"); h.html(name); return h;},
            description: function(d){var p=this.$.newel("p"); p.html(p.html()+d); return d;},
            avatar: function(a){return this.$.newel("img").attr({src: a});},
            weekday: function(w){var p=this.$.newel("p").attr({class: "dayShort"}); p.html(igText.weekshorts[w]); return p;},
            day: function(d){var p=this.$.newel("p").attr({class: "dayShort"}); p.html(d); return p;},
            account: function(ac){return this.$.newel("a").attr({href:  wX.socLink(ac.provider, ac.slogin_id)}).newel("img").attr({src: wX.socIcon(acc.provider), class: "socialIcon"});},
            registered: function(r){if(r)return this.$.newel("img").attr({src: getIconURL("registered"), class: "registeredIcon"});},
            isfriend: function(f){if(f)return this.$.newel("img").attr({src: getIconURL("registered"), class: "friendIcon"});},
            category: function(d){var p=this.$.newel("p"); p.html(p.html()+d); return d;}

        }
        this.pattern=pattern;
        this.set=pattern.set;
        this.update=pattern.update.bind(this);

        if(this.set.frame){
             this.$=this.set.frame.newel("div");
             presentor.$=this.$;
        }
        this.data=data;
        this.id=data.id;
        this.info={};
        $.each(data.info, function(key, value){if(presentor[key])this.info[key]=presentor[key](value);}.bind(this));
        this.list=this.set.frame;

        if(this.set.dragable){
            this.$.draggable({ drag:function(event, ui_it){
                //item=this;
                $.each(this.set.dragable.to, function(i, list){
                    list.$.droppable({drop: function(event, ui_li){
                        list.dropIn(this);
                    }.bind(this)});
                }.bind(this))
            }.bind(this),  helper: "clone", revert: "invalid", containment: "document"});
            this.list.css({position: "static"});
        }

     var act=this.$.newel("div").attr({class: "ActionsBlock"});

        $.each(data.actions, function(i, action){
           act.newel("img").attr({src: getIconURL(action), class: "link"}).on('click', function(){
                 this[action](data.id);
           });
     });

     this.$.on('click', function(){
         this.set.frame.unselect();
         this.$.attr({class: "selected"});
         this.select(data.id);
     }.bind(this));

     this.select=function(id){
             this.set.events.select.run(id);
     };
     this.unselect=function(){
            this.$.attr({class: null})
     }
     this.filterByName=function(name){
            if(this.data.info.name.toLowerCase().indexOf(name.toLowerCase())==-1){
                this.$.attr({style: "display:none"});
            }else{
             this.$.attr({style: null});
         }
     }
        this.set.frame.items.push(this);

     this.dropTo=function(list){

        if(this.set.dragable.copy)item=this.$.clone();
        else item=this.$; //Не копировать шаблон, а вставлять новый item под форму
        item.attr({class:"droppingListItem"});
        item.appendTo(list);
        //показать форму добавления элемента
        if(list.set.events.drop)list.set.events.drop.run({frame: item, list: list, data: this.data});
        //item.attr({style: null});
     }.bind(this)
     this.showAsDroppingOut=function(){
        this.$.attr({class:"droppingListItem"});
     }
     this.dropIn=function(list){
        this.$.attr({class: item.defaultClass});
        this.list=list;
     }
     this.dropOut=function(){

     }

        return this;
    }

    return this;
}
wX.search=function(set){
    var search={set: set};

    search.make=function(){
        search=set.frame.newel("input").attr({class: "search",  placeholder: igText.search});
        search.insertBefore(set.frame);
        search.on("focus", function(){search.attr({placeholder: null})});
        search.on("blur", function(){search.attr({placeholder: igText.search})});
        search.on("input", function(){
        $.each(set.frame.items, function(i, item){
            item.filterByName(search[0].value);
        })
        });
        return search;
    }

    return search;
}
wX.event={};
wX.event.idChanger=function(set){
    this.set=set;
    this.run=function(id){
       $.each(this.set.queue, function(i, el){
            if(this.set.queue[i-(-1)])el.callback=this.set.queue[i-(-1)].update.bind(this.set.queue[i-(-1)]);
            $.each(this.set.ess, function(key, value){
                if(value=="#id") value=id;
                el.set.ess.opt[key]=value;
            }.bind(this))
       }.bind(this))
       this.set.queue[0].update();
    }
    return this;
}
wX.event.formMaker=function(set){
    this.set=set;
    this.run=function(runset){
        var form=runset.frame.newel("form");
        $.each(this.set.static, function(i, field){
            form.newel("input").attr({name: runset.data.info[field]});
        });
    }
}
wX.event.infoExtender=function(set){

}
wX.event.editor=function(set){

}
wX.event.remover=function(set){

}