var taskTable={ __proto__: dataTable,
    loadData: function(){
        for(var i=0; i<this.data.length; i++){
            this.blockIndex=i;
            this.blockData=this.data[i].actions;
            this.loadBlock();
        }
    }
}