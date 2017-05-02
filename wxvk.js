function WXVK(set){

        if(!set.callback)set.callback=this.init.bind(this);
        $.ajax({
            url:"https://api.vk.com/method/"+set.action+"?access_token="+vk_token,
            dataType: "jsonp",
            data: set.params,
            success: set.callback
        });
    }