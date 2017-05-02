
var dataTable = {
    data:null,
    rowsName: "fields",

    getBlocksProperities: function(i=0){
         return this.data[i].properities;
    },
    getRowsProperities: function(blockIndex, rowIndex=0){
         return this.data[blockIndex][this.rowsName][rowIndex].properities;
    },

    getBlockProperity: function(name, i){
         var properities=this.getBlocksProperities(i);
         var value;
         $.each(properities, function(i, data){
             if(data.name==name) value=data.value;
         }.bind(this));
         return value;
    },

    getRowProperity: function(blockIndex, name, rowIndex){
         var properities=this.getRowsProperities(blockIndex, rowIndex);
         var value;
         $.each(properities, function(i, data){
             if(data.name=name) value=data.value;
         }.bind(this));
         return value;
    },

    getBlockIndexById(id){
        var index;
        $.each(this.data, function(i, data){
            if(data.id==id) index= i;
        });
        return index;
    },

    loadData: function(data){
        this.data=data.data;
        this.clear();

        this.blocks={};
        $.each(this.data, this.loadBlock.bind(this));
        this.extUpdate(this.data);
    },

    loadBlock: function(i,data){
        this.blocks[i]={tbody: $("#"+this.tableId).newel("tbody")[0], rows: new Array()}
        this.tbody=this.blocks[i].tbody;
        if(data.id==null){
            return this.noBlocksAction(data);
        }
        this.blockIndex=i;
        this.blockId=data.id;

        if(data.properities){
            this._loadBlockHeader(i, data.properities);
        }else{
            this.loadBlockHeader(data);
        }
        $.each(data[this.rowsName], this.loadRow.bind(this));
    },

    _loadBlockHeader: function(i, data){
        var $tr=$(this.tbody).newel("tr");
        if(this.multiHeader) this.blocks[this.blockIndex].header=$tr[0];
        else{
            this.blocks[this.blockIndex].header=$tr.newel("th")[0];
            this.blocks[this.blockIndex].header.className="float";
        }
        $.each(data, this.loadHeaderProperity.bind(this));
        this.extBlockHeader(this.blocks[this.blockIndex].header, data);
    },

    loadHeaderProperity: function(i, data){
         this.blocks[this.blockIndex].header.innerHTML+=data.value;
    },

    loadBlockHeader: function(data){
        var $tr=$(this.tbody).newel("tr");

        var $th=$tr.newel("th");
        this.blocks[this.blockIndex].header=$th[0];

        $th[0].className="float";
        $th.html(data.name);

        this.extBlockHeader($th[0], data);
    },

    loadSimpleRow: function(i, data, rowData){
        var tr=$(this.tbody).newel("tr");
        this.rowIndex=i;
        this.rowId=rowData.id;

        if(rowData.id==null) return this.noRowsAction(rowData);
        this.blocks[this.blockIndex].rows[i]=tr;
        var td=null;
        $.each(data, function(i,data){td=tr.newel("td");
        td.html(data)});
        this.extRow(td, data);
        return tr[0];
    },

    extRow: function(tr, data){},

    loadRow: function(i, data){                         //abstract methid
        this.loadSimpleRow(i, data);
    },

    extBlockHeader: function(th, data){},                 //abstract method
    extUpdate: function(){},                               //abstract method
    noBlocksAction: function(data){},
    noRowsAction: function(data){},

    update: function(){
        if(this.updateParams)params=this.updateParams;
        else params={};
        $.ajax({
            url:ajax_url+"&action="+this.updateAction,
            dataType: "json",
            data: params,
            success: this.loadData.bind(this)
        });
    },

    clear: function(){
        $("#"+this.tableId).empty();
    }
}