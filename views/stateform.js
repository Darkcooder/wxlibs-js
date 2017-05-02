var stateForm= {
        formId: "setStateForm",
        windId: "setStateWindow",
        __proto__: modalForm,
        initiable: true,
        nextAction: function(){
            var formData=$(this.htmlForm).serializeArray();
            var params={layout: this.ajaxActionName, fields: new Array(), values: new Array()};
            $.each(formData, function(i, data){params.fields[i]=data.name; params.values[i]=encodeURIComponent(data.value)});
            $.post(ajax_url+"&action="+this.ajaxActionName, params, this.nextCallback.bind(this));
            this.hide();
        },
        makeBlank: function(){
            this.main=document.getElementById(this.windId).cloneNode(true);
            this.main.id=this.id;
            this.htmlForm=this.main.getElementsByTagName("form")[0];
        },


        makeFromData: function(data){
             this.htmlForm=document.createElement("form");
             this.main.appendChild(this.htmlForm);
             this.formTable=document.createElement("table");
             this.htmlForm.appendChild(this.formTable);
             this.makeFieldsHeader();
             $.each(data, this.makeField.bind(this));
             this.extMakeFromData();
             this.showNCButtons();

        },

        makeListFromData: function(data, listName){
            if(!this.htmlForm)this.htmlForm=document.createElement("form");
            this.listName=listName;

             $.each(data, this.makeListElement.bind(this));
             this.showNCButtons();
        },

        makeListElement: function(i, data){
            var $radio=$(this.htmlForm).newel("input");
            $radio.attr({type: "radio", name: this.listName, id: this.listName, value: data.id});
            var $label=$(this.htmlForm).newel("label");
            $label.attr({for: this.listName});
            $label.html(data.properities[0].value);
            if(data.properities.img)$label.newel("img").attr({src: data.properities.img});
        },

        makeFieldsHeader: function(){},

        makeField: function(i, data){
             var $tr=$(this.formTable).newel("tr");
             var $tdName=$tr.newel("td");
             var $tdValue=$tr.newel("td");
             $tdName.html(this.getFieldName(data));
             var input=$tdValue.newel("input")[0];
             input.className="small";
                 input.value=this.getFieldValue(data);
                 input.name=this.getFieldId(data);
        },

        extMakeFromData: function(){},

        init: function(index){
            this.index=index;
           this.makeFromData(this.dataTable.data[index].fields);
           if(this.title)this.title.innerText=this.dataTable.data[index].name+": "+this.titleText;
        },
        getFieldName: function(data){
            return data.name;
        },
        getFieldId: function(data){
            return data.id;
        }
};