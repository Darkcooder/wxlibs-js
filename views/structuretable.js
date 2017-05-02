var structureTable={__proto__: dataTable,

    addBlockAction: "addBlock",
    addRowAction: "addRow",
    editBlockAction: "editBlock",
    editRowAction: "editRow",
    cancelButtonContent: "Cancel",
    removeBlockAction: "removeBlock",
    removeRowAction: "removeRow",
    addFieldAction: "addField",
    blockIdName: "block_id",
    rowIdName: "row_id",
    editImageUrl:"/images/edit_16.png",
    addImageUrl: "/images/add_16.png",
    removeImageUrl: "/images/remove_16.png",
    fieldsImageUrl: "/images/fields_16.png",
    addBlockString: "Add Block",
    objectName: "structureTable",
    fieldsText: "Fields",

    fieldsWindow: {__proto__: stateForm,
            dataTable: this,
            addFieldText: "addField",
            titleText: "Fields",
            _super: this,
            makeField: function(i, data){

                var $tr=$(this.formTable).newel("tr");
                var $tdName=$tr.newel("td");
                var $tdValue=$tr.newel("td");
                var nameInput=$tdName.newel("input").attr({class: "small"})[0];
                    nameInput.value=data.name;
                    nameInput.name=data.id+"_name";
                var measureInput=$tdValue.newel("input").attr({class: "small"})[0];
                    measureInput.value=data.measure;
                    measureInput.name=data.id+"_measure";
                var $removeLink=$tdValue.newel("a").attr({href:"JavaScript:"+this._super.objectName+".removeField("+this.index.block.id+","+this.index.row.id+","+data.id+")"});
                $removeLink.newel("img").attr({src:"/images/remove_16.png"});
            },

            makeFieldsHeader: function(){
                var $tr_header=$(this.formTable).newel("tr");
                var $thName=$tr_header.newel("th").html(str_name);
                var $thValue=$tr_header.newel("th").html(str_measure);
            },
            extMakeFromData: function(){
                var $addLink=$(this.htmlForm).newel("p").newel("a").attr({href: "JavaScript:"+this._super.objectName+".showAddFieldWindow("+this.index.block.id+","+this.index.row.id+")"});
                $addLink.newel("img").attr({src: "/images/add_16.png"});
                $addLink.html($addLink.html()+this.addFieldText);
            },
            init: function(index){
                this.index=index;
                this.makeFromData(this.dataTable.data[index.block.index][this.dataTable.rowsName][index.row.index].fields);
                this.title.innerHTML=this._super.getRowProperity(index.block.index, "name", index.row.index)+": "+this._super.fieldsText;

            },
            update: function(){
                $(this.htmlForm).html("");
                this.init(this.index);
            },
            nextAction: function(){
                alert("itworks");
            }
    },



    extBlockHeader: function(th, data){
        $(th).attr({colspan: this.columns})
        var $editLink=$(th).newel("img");
        $editLink.attr({src: this.editImageUrl});
        var blockIndex={index:this.blockIndex, id:this.blockId};
        $editLink[0].onclick=function(){this.showEditBlockForm(blockIndex)}.bind(this);

        var $addRowLink=$(th).newel("img");
        $addRowLink.attr({src: this.addImageUrl, style: "float: left"});
        $addRowLink[0].onclick=function(){this.showAddRowForm(blockIndex)}.bind(this);

        var $removeBlockLink=$(th).newel("img");
        $removeBlockLink.attr({src: this.removeImageUrl, style: "float: right"});
        $removeBlockLink[0].onclick=function(){this.removeBlock(blockIndex.id)}.bind(this);
    },

    extRow: function($td, data){
         var $extTd=$td;

         var blockIndex={id:this.blockId, index: this.blockIndex};
         var rowIndex={id:this.rowId, index: this.rowIndex};

         var $editLink=$extTd.newel("img");
         $editLink.attr({src: this.editImageUrl});
         $editLink[0].onclick=function(){this.showEditRowForm(blockIndex, rowIndex)}.bind(this);

         var $addFieldLink=$extTd.newel("img");
         $addFieldLink.attr({src: this.fieldsImageUrl, style: "float: left"});
         $addFieldLink[0].onclick=function(){this.showFieldsWindow(blockIndex, rowIndex)}.bind(this);

         var $removeRowLink=$extTd.newel("img");
        $removeRowLink.attr({src: this.removeImageUrl, style: "float: right"});
        $removeRowLink[0].onclick=function(){this.removeRow(blockIndex.id, rowIndex.id)}.bind(this);
    },

    extUpdate: function(data){
        var $th=$("#"+this.tableId).newel("tbody").newel("tr").newel("th");
        $th.attr({colspan: this.columns});
        var $addBlockLink=$th.newel("a");
        $addBlockLink.attr({href: "javascript: update()"})
        $addBlockLink[0].onclick=this.showAddBlockForm.bind(this);
        $addBlockLink.newel("img").attr({src: this.addImageUrl});
        $addBlockLink[0].innerHTML+=this.addBlockString;
        this.updateCallback();
        this.updateCallback=function(){};
    },
    updateCallback: function(){},
    showAddFieldWindow: function(blockIndex, rowIndex){
        var _this=this;
        this.addFieldForm={__proto__: innerStructureForm,
            paerent: this.fieldsWindow.formTable,
            _super: _this,
            rowIndex: rowIndex,
            callback: function(){
                this._super._form=this.main;
                this._super.updateCallback=this._super.fieldsWindow.update.bind(this._super.fieldsWindow);
                this._super.sendForm(this._super.addFieldAction);
                this.hide();
            },
            addFieldsAsTr: function(fields){
                this.$tr=$(this.main).newel("tr");
                $(this.main).newel("input").attr({type: "hidden", name: this._super.rowIdName, value: this.rowIndex});
                $(this.main).newel("input").attr({type: "hidden", name: this._super.blockIdName, value: this.blockIndex});
                 $.each(fields, function(i, field){
                     this.$tr.newel("td").newel("input").attr({name: field.name, value: field.value, class: "small"});
                 }.bind(this));
                 return this;
            }
        };
        this.addFieldForm.makeForm().addFieldsAsTr(new Array({name: "name"}, {name: "measure"})).show();
    },

    removeField: function(blockIndex, rowIndex, fieldIndex){
        var params={};
        params[this.blockIdName]=blockIndex;
        params[this.rowIdName]=rowIndex;
        params["field_id"]=fieldIndex;
        params.action=this.removeRowAction+"Field";
        this.updateCallback=this.fieldsWindow.update.bind(this.fieldsWindow);
         $.post(ajax_url, params, this.update.bind(this));
    },

    showFieldsWindow: function(blockIndex, rowIndex){
        this.fieldsWindow.dataTable=this;
        this.fieldsWindow._super=this;
        this.fieldsWindow.showByIndex({block: blockIndex, row: rowIndex});
    },

    showInnerForm: function($node, data, _callback){
        var innerForm={    __proto__: innerStructureForm,
            paerent: $node[0],
            callback: function(){
                _callback();
                this.hide();
            }
        };
        innerForm.makeForm();
        innerForm.show();
        this._form=innerForm.main;

        //$(this._form).attr({style: "margin:0"});
        $.each(data, function(i,field){innerForm.addField(field)});
    },

    showAddBlockForm: function(){
       this.showInnerForm(
            $("#"+this.tableId).newel("tbody").newel("tr").newel("td"),
            this.getBlocksProperities(),
            this.addBlock.bind(this)
       );
    },

    showAddRowForm: function(blockIndex){
        this.showInnerForm(
            $(this.blocks[blockIndex.index].tbody).newel("tr").newel("td"),
            this.getRowsProperities(blockIndex.index),
            this.addRow.bind(this)
       );
       $(this._form).newel("input").attr({type: "hidden", name: this.blockIdName, value: blockIndex.id});
    },

    showEditBlockForm: function(blockIndex){

        var header=this.blocks[blockIndex.index].header;
        $(header).empty();
        this.showInnerForm(
            $(header),
            this.getBlocksProperities(blockIndex.index),
            this.editBlock.bind(this)
       );
        $(this._form).newel("input").attr({type: "hidden", name: this.blockIdName, value: blockIndex.id});
    },

    showEditRowForm: function(blockIndex, rowIndex){
        var tr=$(this.blocks[blockIndex.index].rows[rowIndex.index])[0];
        $(tr).empty();
        this.showInnerForm(
            $(tr),
            this.getRowsProperities(blockIndex.index, rowIndex.index),
            this.editRow.bind(this)
       );
        $(this._form).newel("input").attr({type: "hidden", name: this.blockIdName, value: blockIndex.id});
        $(this._form).newel("input").attr({type: "hidden", name: this.rowIdName, value:rowIndex.id});
    },

    addFieldToForm: function(form, field){
        $(form).newel("td").newel("input").attr({
            name: field.name,
            value: field.value
        });
    },

    addFieldToBlockForm: function(form, field){
        var $input=$(form).newel("input");
        $input.attr({
            name: field.name,
            value: field.value,
            style: "border: 0"
        });
        $input[0].focus();
    },
    sendForm: function(action, callback=this.update.bind(this)){
        var formData=$(this._form).serializeArray();
        var params={};
        $.each(formData, function(i, data){params[data.name]=encodeURIComponent(data.value)});
        $.post(ajax_url+"&action="+action, params, callback);
    },

    addBlock: function(){
        this.sendForm(this.addBlockAction);
        return false;
    },
    addRow: function(){
        this.sendForm(this.addRowAction);
        return false;
    },

    editBlock: function(){
        this.sendForm(this.editBlockAction);
        return false;
    },
    editRow: function(){
        this.sendForm(this.editRowAction);
        return false;
    },

    removeBlock: function(index){
        var params={action: this.removeBlockAction};
        params[this.blockIdName]=index;
        $.post(ajax_url, params, this.update.bind(this));
    },
    removeRow: function(blockIndex, rowIndex){
        var params={};
        params[this.blockIdName]=blockIndex;
        params[this.rowIdName]=rowIndex;
        params.action=this.removeRowAction;
        $.post(ajax_url, params, this.update.bind(this));
        this.update();
    }


}