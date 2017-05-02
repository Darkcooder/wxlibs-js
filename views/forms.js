function ShowAlert(text){
    var win={__proto__:modalWindow, titleText: text};
    win.show();
}
var modalWindow={
    backgroundId: "formBackground",
    background: null,
    mainId: null,
    main: null,
    title: null,
    titleId: null,
    titleText: null,
    inner: null,
    show: function(){
        if(this.main==null)this.make();
        this.background.style.display="block";
        this.main.style.display="block";
    },
    hide: function(){
         this.main.style.display="none";
         this.background.style.display="none";
         this.afterHide();
    },
    get: function(){
         this.background=document.getElementById(this.backgroundId);
         this.main=document.getElementById(this.mainId);
    },
    make: function(){
        var _this=this;
        this.main=document.createElement("div");
        this.main.className="popupForm";
        this.main.id=this.id;
        if(this.mainId!=null)this.main=document.getElementById(this.mainId);

        document.body.appendChild(this.main);
        this.background=document.createElement("div");
        this.background.id=this.backgroundId;
        document.body.appendChild(this.background);
        this.background.onclick=function(){_this.hide();}
        if(this.titleText!=null){
            this.title=document.createElement("h3");
            this.title.innerText=this.titleText;
            this.main.appendChild(this.title);
        }
        if(this.titleId!=null)this.title.id=this.titleId;
        if(this.inner!=null)this.main.appendChild(this.inner);
    },
    afterHide: function(){}
}

var contextWindow={
    main: null,
    link: null,
    root: null,
    paerent: null,
    linkHtml: null,
    backgroundId: "contextBackground",
    background: null,
    showWindow: function(){
        this.main.style.display="block";
        this.background.style.display="block";
    },
    setPaerent: function(id){
        this.paerent=$("#"+id)[0];
    },
    makeWindow: function(){
        this.root=$(this.paerent).newel("div")[0];
        this.root.className="context-menu";
        if(!this.link)this.link=$(this.root).newel("div")[0];
        this.main=$(this.root).newel("div")[0];
        this.main.className="context-menu-handler";
        if(this.linkHtml)$(this.link).html(this.linkHtml);
        this.link.onclick=this.show.bind(this);

        this.background=$(document.body).newel("div")[0];
        this.background.id=this.backgroundId;
        this.background.onclick=this.hide.bind(this);
    },
    show: function(){
        this.showWindow();
    },
    hide: function(){
        this.main.style.display="none";
        this.background.style.display="none";
    }
}

var innerBlock={
    main: null,
    paerent: null,
    cssClass: "innerBlock",

    makeBlock: function(){
         this.main=$(this.paerent).newel("div")[0];
         this.main.className=this.cssClass;
    },
    show: function(){
         this.main.style.display="block";
    },
    hide: function(){
         this.main.style.display="none";
    }
}

var innerStructureForm={ __proto__: innerBlock,
    background: null,
    backgroundId: "contextBackground",

    makeForm: function(){
        this.main=$(this.paerent).newel("form")[0];
        this.main.className="context-menu-handler";

        this.background=$(document.body).newel("div")[0];
        this.background.id=this.backgroundId;
        this.background.onclick=this.callback.bind(this);
        return this;
    },

    addField: function(field){
        var $input=$(this.main).newel("input");
        $input.attr({
            name: field.name,
            value: field.value,
            style: "border: 0"
        });
        $input[0].focus();
        return this;
    },
    callback: function(){},

    show: function(){
        this.main.style.display="block";
        //this.paerent.style.zIndex=1600;
        this.background.style.display="block";
    },

    hide: function(){
        this.main.style.display="none";
        this.background.style.display="none";
    }
}

var contextMenu={__proto__: contextWindow,
    childWindow: null,
    makeListFromData: function(data){
        this.makeWindow();
        var moduletable=$(this.main).newel("div")[0];
        //moduletable.className="moduletable";
        this.list=$(moduletable).newel("ul")[0];
        this.list.className="menu";
        $.each(data, this.makeListItem.bind(this));
    },
    makeListItem: function(i, data){
        var $link=$(this.list).newel("li").newel("a");
        $link.html(data.properities[0].value);
        $link.attr({href: "javaScript:$()"});
        $link[0].onclick=function(){this.selectAction(i)}.bind(this)
    },
    selectAction: function(index){
        this.hide();
        this.childWindow.showByIndex(index);
    }

}

var modalForm={
    __proto__: modalWindow,
    htmlForm: null,

     showNCButtons: function(){

            var $ncp=$(this.htmlForm).newel("div");
              var $submit=$ncp.newel("button");
              $submit.html(str_next);
              $submit.attr({type: "button"});
              $submit[0].onclick=this.nextAction.bind(this);

              var $cancel=$ncp.newel("button");
              $cancel.html(str_cancel);
              $cancel.attr({type: "button"});
              $cancel[0].onclick=this.hide.bind(this);
        },

    showByIndex: function(index){
        this.make();
        this.htmlForm=$(this.main).newel("form")[0];
        this.init(index);
        this.htmlForm.onsubmit=function(){this.nextAction(index); return false;}.bind(this);
        this.htmlForm.onreset=function(){this.hide();}.bind(this);

        this.show();
    },

    fvar: function(id){
        var el=$(this.htmlForm).find("#"+id)[0];
        return encodeURIComponent(el.value);
    },
    init: function(index){}
}

var yesNoForm={
    __proto__: modalForm,
    content: null,
    yesButtonText: null,
    yesButton: null,
    noButton: null,
    noButtonText:null,
    text: null,
   showByIndex: function(index){
        this.make();
        if(this.text!=null){
            this.content=document.createElement("p");
            this.content.innerText=this.text;
            this.main.appendChild(this.content);
        }
        _this=this;
        this.yesButton=document.createElement("button");
        this.yesButton.innerText=this.yesButtonText;
        this.yesButton.onclick=function(){_this.nextAction(index)};
        this.main.appendChild(this.yesButton);
        this.noButton=document.createElement("button");
        this.noButton.innerText=this.noButtonText;
        this.noButton.onclick=function(){_this.hide()};
        this.main.appendChild(this.noButton);
        this.show();
   }

}

var floatCheckbox={
    lables: [],
    paerent: $(document),
    cssClass: "innerBlock",
    checkboxCssClass: "floatCheckbox",
    addLabelAction: "addLabel",
    removeLabelAction: "removeLabel",
    addLabelParams: {},
    removeLabelParams: {},

    make: function(lables, postName){
        this.lables=lables;
        this.postName=postName;
        this.main=this.paerent.newel("div").attr({class: this.cssClass});
        $.each(lables, function(i,label){
            p=this.main.newel("p");
            var checkbox=p.newel("input").attr({
                type: "checkbox",
                class: this.checkboxCssClass,
                name: this.postName,
                value: label.id,
                id: this.postName+label.id
            });
            if(label.checked)checkbox[0].checked=true;
            checkbox.click(function(){
                if(checkbox[0].checked){
                    this.addLabel(label.id);
                }else{
                    this.removeLabel(label.id);
                }
            }.bind(this));
            p.newel("label").attr({for:this.postName+label.id}).html(label.name);
        }.bind(this));
        return this;
    },
    show: function(){
         this.main[0].style.display="block";
         return this;
    },
    hide: function(){
         this.main[0].style.display="none";
         return this;
    },
    addLabel: function(id){
        this.addLabelParams.action=this.addLabelAction;
        this.addLabelParams.label_id=id;
        $.post(ajax_url, this.addLabelParams, this.update);
    },
    removeLabel: function(id){
        this.removeLabelParams.action=this.removeLabelAction;
        this.removeLabelParams.label_id=id;
        $.post(ajax_url, this.removeLabelParams, this.update);
    },
    update: function(){}
}


        function showWindow(divId=false, divLnk=false){
            var _window={__proto__: modalWindow};
            if(divLnk)_window.main=divLnk;
            if(divId)_window.mainId=divId;
            _window.show();
        }
        function hideWindow(divId=false, divLnk=false){
            var _window={__proto__: modalWindow};
            if(divLnk)_window.main=divLink;
            if(divId)_window.mainId=divId;
            _window.get();
            _window.hide();
        }
function showYesNoWindow(form, id=0){
            document.getElementById('yesNoTitle').innerText=form.title;
            document.getElementById('yesNoText').innerText=form.text;
            document.getElementById('yesNoYesButton').onclick=function(){form.yesAction(id);};
            document.getElementById('yesNoNoButton').onclick=function(){hideWindow("yesNoWindow");};
            document.getElementById('formBackground').onclick=function(){hideWindow("yesNoWindow");};
            showWindow("yesNoWindow");
        }

        function showFormWindow(form, idx=0){
           // alert("Show window started!");
            if(form.form){
                form.init(idx);
                form.form.onsubmit=function(){form.nextAction(idx); return false;};
                form.form.onreset=function () {hideWindow(null, form.win);};
                document.body.appendChild(form.win);
                showWindow(null, form.win);
                document.getElementById('formBackground').onclick=function(){hideWindow(null, form.win);};
            }else{
                if(form.nextId)document.getElementById(form.nextId).onclick=function(){form.nextAction(id);};
                if(form.formId)document.getElementById(form.formId).onsubmit=function(){form.nextAction(id); return false;};
                if(form.cancelId)document.getElementById(form.cancelId).onclick=function(){hideWindow(form.id);};
                if(form.formId)document.getElementById(form.formId).onreset=function () {hideWindow(form.id);}
                showWindow(form.id);
                document.getElementById('formBackground').onclick=function(){hideWindow(form.id);};
            }



        }

        function showById($id) {
            document.getElementById($id).style.display="block";
        }
        function hideById($id) {
            document.getElementById($id).style.display="none";
        }
        function showClass($className) {
            var classArray=document.getElementsByClassName($className);
            for(i=0; i < classArray.length; i++) {
                classArray[i].style.display = 'block';
            }
        }
        function hideClass($className) {
            var classArray=document.getElementsByClassName($className);
            for(i=0; i < classArray.length; i++) {
                classArray[i].style.display = 'none';
            }
        }

        function addButtonClone(target, buttonId, buttonAction){
            var buttonOrign=document.getElementById(buttonId);
            var button=buttonOrign.cloneNode(true);
            button.onclick=buttonAction;
            target.appendChild(button);
            return button;
        }

function addFormClone(target, formId, submitId,  submitAction, resetId, resetAction){
    //document.getElementById(submitId).onclick=submitAction;
    var formOrign=document.getElementById(formId);
    var form=formOrign.cloneNode(true);

    target.appendChild(form);
    form.onsubmit=submitAction;
    return form;
}

function addEmptyChild(target, tag){
    var child=document.createElement(tag);
    target.appendChild(child);
    return child;
}