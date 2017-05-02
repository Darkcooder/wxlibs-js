var igFrame={
    clear: function(){
        this.frame.empty();
        return this;
    },
    make: function(data){
        this.frame=$("#"+this.getName());
        if(this.frameId)this.frame=$("#"+this.frameId);
        if(this.frameClass)this.frame=$("."+this.frameClass);
        if(this.data)this.clear();
        this.data=data;
        this.main=this.makeMain(this.frame);
        $.each(this.data, function(i, data){
            var $block=this.makeBlock(i, data, this.main);
            $.each(this.data[this.rowName], function(i, data){
                this.makeRow(i, data, $block);
            }.bind(this))
        }.bind(this))
    },
    update: function(){
        if(!this.updateParams)this.updateParams={};
        if(!this.updateAction)this.updateAction="get"+ucFirst(this.getName());
        $.ajax({
            url:ajax_url+"?action="+this.updateAction,
            dataType: "json",
            data: this.updateParams,
            success: this.init.bind(this)
        });
    },
    getName: function() {
    for(var i in window) {
        if(window[i]==this) {
            return i;
        }
    }},
    init: function(data){this.make(data)},
    makeMain: function(frame){return frame},
    makeBlock: function(i, data, main){},
    makeRow: function(i, data, block){}
}

function ucFirst(str) {
  // только пустая строка в логическом контексте даст false
  if (!str) return str;

  return str[0].toUpperCase() + str.slice(1);
}

function IgData(action, params, callback){
     $.ajax({
            url:ajax_url+"?action="+action,
            dataType: "json",
            data: params,
            success: function(data){this.data=data; callback();}.bind(this)
        });
        return this;
}
