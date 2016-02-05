/*
 * @author Shaumik "Dada" Daityari
 * @copyright December 2013
 */

/* Some info
Using newer versions of jQuery and jQuery UI in place of the links given in problem statement
All data is stored in local storage
User data is extracted from local storage and saved in variable todo.data
Otherwise, comments are provided at appropriate places
*/

var todo = todo || {};
  data = JSON.parse(localStorage.getItem("todoData"));

 data = data || {};

(function(todo, data, $) {

    var defaults = {
        todoTask: "todo-task",
        todoHeader: "task-header",
        todoDate1: "task-startdate",
        todoDate2: "task-duedate",
        todoDescription: "task-description",
        taskId: "task-",
        formId: "todo-form",
        dataAttribute: "data",
        deleteDiv: "delete-div"
    }, codes = {
        "1": "#pending",
        "2": "#inProgress",
        "3": "#completed"
    };

    todo.init = function (options) {

        options = options || {};
        options = $.extend({}, defaults, options);

        $.each(data, function (index, params) {
            generateElement(params);
        });

        /*generateElement({
         id: "123",
         code: "1",
         title: "asd",
         date: "22/12/2013",
         description: "Blah Blah"
         });*/

        /*removeElement({
         id: "123",
         code: "1",
         title: "asd",
         date: "22/12/2013",
         description: "Blah Blah"
         });*/

        // Adding drop function to each category of task
        $.each(codes, function (index, value) {
            $(value).droppable({
                drop: function (event, ui) {
                    var element = ui.helper,
                        css_id = element.attr("id"),
                        id = css_id.replace(options.taskId, ""),
                        object = data[id];

                    // Removing old element
                    removeElement(object);

                    // Changing object code
                    object.code = index;

                    // Generating new element
                    generateElement(object);

                    // Updating Local Storage
                    data[id] = object;
                    localStorage.setItem("todoData", JSON.stringify(data));

                    // Hiding Delete Area
                    $("#" + defaults.deleteDiv).hide();


                    todo.badge();
                }
            });
        });

        // Adding drop function to delete div
        $("#" + options.deleteDiv).droppable({
            drop: function (event, ui) {
                var element = ui.helper,
                    css_id = element.attr("id"),
                    id = css_id.replace(options.taskId, ""),
                    object = data[id];

                // Removing old element
                removeElement(object);

                // Updating local storage
                delete data[id];
                localStorage.setItem("todoData", JSON.stringify(data));

                // Hiding Delete Area
                $("#" + defaults.deleteDiv).hide();
            }
        })
        todo.badge();
    };

    // Add Task
    var generateElement = function (params) {
        var parent = $(codes[params.code]),
            wrapper;

        if (!parent) {
            return;
        }

        wrapper = $("<div />", {
            "class": defaults.todoTask,
            "id": defaults.taskId + params.id,
            "data": params.id
        }).appendTo(parent);

        $("<div />", {
            "class": defaults.todoHeader,
            "text": params.title
        }).appendTo(wrapper);

        $("<div />", {
            "class": defaults.todoDate,
            "text": params.startdate
        }).appendTo(wrapper);

        $("<div />", {
            "class": defaults.todoDate,
            "text": params.duedate
        }).appendTo(wrapper);


        $("<div />", {
            "class": defaults.todoDescription,
            "text": params.description
        }).appendTo(wrapper);



        //change the color of wrapper with respective to pending,progress and completed
        var index = params.code;
        if (index === "1") {
            wrapper.attr('style', 'background-color:red')
        } else if (index === "2") {
            wrapper.attr('style', 'background-color:yellow')
        } else {
            wrapper.attr('style', 'background-color:green')
        }


        wrapper.draggable({
            start: function () {
                $("#" + defaults.deleteDiv).show();
            },
            stop: function () {
                $("#" + defaults.deleteDiv).hide();
            },
            revert: "invalid",
            revertDuration: 200
        });


        //access the value of wrapper and assign them to respective form elements when mouse clicked
        wrapper.click(function (event) {
            var title = $(this).find('.task-header').html();
            $('#todo-form')[0][0].value = title;

            var description = $(this).find('.task-description').html();
            $('#todo-form')[0][1].value = description;

            var date = $(this).find('.task-startdate').html();
            $('#todo-form')[0][2].value = startdate;

            var date = $(this).find('.task-duedate').html();
            $('#todo-form')[0][3].value = duedate;



            // compare title of form with wrapper if it equals then assign edited description and date to wrapper
            var obj = JSON.parse(localStorage['todoData']);
            for (var key in obj) {
                console.log(obj[key]);
                if (obj[key].title === $(this).find('.task-header').html()) {
                    obj[key].description = $('#todo-form')[0][1].value;
                    obj[key].startdate = $('#todo-form')[0][2].value;
                    obj[key].duedate = $('#todo-form')[0][3].value;

                }
            }
        });
        todo.badge();
           };

    // Remove task
    var removeElement = function (params) {
        $("#" + defaults.taskId + params.id).remove();
        todo.badge();
    };
    //RHS is assigned to LHS
    todo.edit = function () {
        var obj = JSON.parse(localStorage['todoData']);
        for (var key in obj) {
            console.log(obj[key]);
            if (obj[key].title === $('#todo-form')[0][0].value) {
                obj[key].description = $('#todo-form')[0][1].value;
                obj[key].startdate = $('#todo-form')[0][2].value;
                obj[key].duedate = $('#todo-form')[0][3].value;
            }
        }

        //object to string conversion
        localStorage.setItem("todoData", JSON.stringify(obj));


        //Update DOM |update and save the new edited values into DOM
        var allWrappers = $($('div[class="task-header"]'));           //var allWrappers=$($(".task-header"));
        for (var i = 0; i < allWrappers.length; i++) {
            if ($('#todo-form')[0][0].value === $(allWrappers[i]).html()) {
                var parent = $(allWrappers[i]).parent();
                $(parent).find('.task-description')[0].innerHTML = $('#todo-form')[0][1].value;
                $(parent).find('.task-startdate')[0].innerHTML = $('#todo-form')[0][2].value;
                $(parent).find('.task-duedate')[0].innerHTML = $('#todo-form')[0][3].value;
            }
        }

    };
    //When the to-do form is submitted, a new task is created and added to local storage,
    // and the contents of the page are updated. The following function implements this functionality.

    todo.add = function () {
        var inputs = $("#" + defaults.formId + " :input"),
            errorMessage = "Title can not be empty",
            id, title, description, startdate,duedate, tempData;

        if (inputs.length !== 9) {
            return;
        }

        title = inputs[0].value;
        description = inputs[1].value;
        startdate = inputs[2].value;
        duedate=inputs[3].value;

        if (!title) {
            generateDialog(errorMessage);
            return;
        }

        id = new Date().getTime();

        tempData = {
            id: id,
            code: "1",
            title: title,
            stardate: startdate,
            duedate: duedate,
            description: description
        };

        // Saving element in local storage
        data[id] = tempData;
        localStorage.setItem("todoData", JSON.stringify(data));

        // Generate Todo Element
        generateElement(tempData);

        todo.currrentDate();

        // Reset Form
        inputs[0].value = "";
        inputs[1].value = "";
        inputs[2].value = "";
        inputs[3].value= "";


        todo.badge();


    };

    var generateDialog = function (message) {
        var responseId = "response-dialog",
            title = "Messaage",
            responseDialog = $("#" + responseId),
            buttonOptions;

        if (!responseDialog.length) {
            responseDialog = $("<div />", {
                title: title,
                id: responseId
            }).appendTo($("body"));
        }

        responseDialog.html(message);

        buttonOptions = {
            "Ok": function () {
                responseDialog.dialog("close");
            }
        };

        responseDialog.dialog({
            autoOpen: true,
            width: 200,
            height: 200,
            modal: true,
            closeOnEscape: true,
            buttons: buttonOptions
        });
    };

    todo.clear = function () {

        //Deleting the elements only after refreshing the page


        //fetch all items from local storage
        var allItems = JSON.parse(localStorage.getItem("todoData"));
        //iterate all the elements from local storage using for in loop
        for (var key in allItems) {
            //check code value is equall to "3"
            if (allItems[key].code === "3") {
                //if it is true, remove that item from obj using delete operator
                delete allItems[key];
            }

        }

        localStorage.setItem('todoData', JSON.stringify(allItems));


// Deletes the only data from Completed wrapper(3rd wrapper)
        var allWrappers = $('.todo-task');
        debugger;//fetch all data from all wrappers
        for (var i = 0; i < allWrappers.length; i++) {
            var styleContent = $(allWrappers[i]).attr('style');
            var id = $(allWrappers[i]).attr('id');
            if (styleContent === "position: relative; background-color: green;") {
                var rmData=$("#" + id).remove();
            }
        }
        todo.badge();
    };


    todo.badge = function() {
            //fetch all the wrappers - $('.todo-task')
        var allWrappers = $('.todo-task');
        var totalCnt = allWrappers.length;
        $('button#totalCount').attr('totalCount',totalCnt);
        var pendingCount = 0, inprogressCount = 0, completedCount = 0;
            //iterate all the wrappers
        for (var i = 0; i < allWrappers.length; i++) {
            var styleContent = $(allWrappers[i]).attr('style');
                    //check background-color

                   // increment counter for each type of the tasks
            if (styleContent === "position: relative; background-color: red;") {
                pendingCount++;
            } else if (styleContent === "position: relative; background-color: yellow;") {
                inprogressCount++;

            } else {
                completedCount++;
            }
            $('button#pendingcount').attr('pendingcount', pendingCount);
            $('button#inprogresscount').attr('inprogresscount', inprogressCount);
            $('button#completedCount').attr('completedcount',completedCount);
               //finally update all badge values

        }
    }
    todo.redo=function(){
        var allItems= JSON.parse(localStorage.getItem("todoData"));
        for (var i in allItems){
            if (allItems[i].code==='2'|| allItems[i].code==='3'){
                allItems[i].code='1';
            }

        }
        localStorage.setItem('todoData',JSON.stringify(allItems))

        //fetch all wrapper
        var allWrappers=$('.todo-task');
        //iterate
        for(var i=0;i<allWrappers.length;i++){
            var stylectnt=$(allWrappers[i]).attr('style')
            //check if yellow and green
            if (stylectnt==='position:relative;background-color: yellow;'|| 'position:relative;background-color: green;'){
                $(allWrappers[i]).attr('style', 'position: relative; background-color: red;')
                var pendingList=$('#pending');
                pendingList.append(allWrappers[i])
              }
        }
        //window.setTimeout(todo.badge(), 1000);
        todo.badge();

        //if yes, append to #ispending list
        //remove all wrappers from yellow and green list

    }
       todo.currrentDate=function(){
           var curDate=Date();

           if($('#todo-form')[0][2].value === '' || $('#todo-form')[0][2].value === null || $('#todo-form')[0][2].value === undefined){
               alert("Please enter the start date")
           }
           else if($('#todo-form')[0][3].value<$('#todo-form')[0][2].value){
               alert("Please enter valid date");

           }

       }
})      (todo, data, jQuery);


