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
        function showWindow(divId=null, divLnk=null){
            showById('formBackground');
            if(divId!=null)showById(divId);
            if(divLnk!=null)divLnk.style.display="block";
        }
        function hideWindow(divId=null, divLnk=null){
            hideById('formBackground');
            if(divId!=null)hideById(divId);
            if(divLnk!=null)divLnk.style.display="none";
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