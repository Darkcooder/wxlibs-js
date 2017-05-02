function WXData(set){
        if(!set.actionType)set.actionType="get";
        if(!set.action)set.action=this.getName();
        if(!set.params)set.params={};
        if(!set.callback)set.callback=this.init.bind(this);
        $.ajax({
            url:ajax_url+"?action="+set.actionType+ucFirst(set.action),
            dataType: "json",
            data: set.params,
            success: set.callback
        });
    }

    function WXPOST(set){
         if(!set.actionType)set.actionType="get";
        if(!set.action)set.action=this.getName();
        if(!set.params)set.params={};
        if(!set.callback)set.callback=this.init.bind(this);
        $.post({
            url:ajax_url+"?action="+set.actionType+ucFirst(set.action),
            data: set.params,
            success: set.callback
        });
    };