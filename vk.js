function VKIG(){
   VK.init(function(data) {
     //VK.callMethod("showOrderBox", {type: "votes", votes: 1});
     //$("#list").html(VK.loadParams("access_token"));
     //window.location.href="https://intent.guide/component/slogin/provider/vkontakte/auth";
     var title=$(".h2");
     title.html(igText.intents);
     $("#infoHeader").html(igText.schedules);
     $("#dailyHeader").html(igText.daily);
     $("#weeklyHeader").html(igText.weekly);
     $("#monthlyHeader").html(igText.monthly);
     $("#taskTemplatesHeader").html(igText.taskTemplates);
  }, function() {
     $("#list").html("Error");
}, '5.59');
}
