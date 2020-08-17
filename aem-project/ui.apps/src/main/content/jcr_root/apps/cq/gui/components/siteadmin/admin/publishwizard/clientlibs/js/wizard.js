(function($) {

    var options, $form, actErrModal;

    function prepareThumbnails(data) {
        if (data.data && data.data.asset) {
            var ck = new Date().getTime();
            var assets = data.data.asset;
            for (var a = 0; a < assets.length; a++) {
                var asset = assets[a];
                var path = asset.path;
                var suffix = options.thumbSuffix.replace(/\{\{ck\}\}/gi, ck);
                asset.thumbnail = Granite.HTTP.externalize(path + "." + suffix);
            }
        }
        if (data.data && data.data.contentfragmentmodel) {
            var ck = new Date().getTime();
            var models = data.data.contentfragmentmodel;
            for (var a = 0; a < models.length; a++) {
                var cfm = models[a];
                var path = cfm.path;
                var suffix = options.cfmThumbnailSuffix.replace(/\{\{ck\}\}/gi, ck);
                cfm.thumbnail = Granite.HTTP.externalize(path + "/" + suffix);
            }
        }
    }

    function createSortedData(json) {
        var types = [ ];
        var byType = { };
        var assets = json["assets"];
        var hasReferences = false;
        for (var a = 0; a < assets.length; a++) {
            var asset = assets[a];
            var type = asset.type;
            var typeSlot = byType[type];
            if (!typeSlot) {
                typeSlot = [ ];
                byType[type] = typeSlot;
                types.push(type);
            }
            typeSlot.push(asset);
            hasReferences = true;
        }
        // TODO correct/additional sorting ...?
        types.sort();
        return {
            "types": types,
            "data": byType,
            "hasReferences": hasReferences
        };
    }

    function buildTable(data) {
        prepareThumbnails(data);
        var itemTpl = function (data) {
            var thumbnail =  data.thumbnail ? `<img src="${data.thumbnail}" class="image">` : '';
            return `<tr is="coral-table-row" data-path="${data.path}" data-type="${data.type}"> 
                    <td is="coral-table-cell"> 
                        <coral-checkbox coral-table-rowselect></coral-checkbox> 
                    </td> 
                    <td is="coral-table-cell"> ${thumbnail} </td> 
                    <td is="coral-table-cell"> ${data.name} </td> 
                    <td is="coral-table-cell"> ${data.status} </td> 
                   </tr>`;
        };

        var sectionTpl = function (data) {
         return `<table is="coral-table" selectable multiple> 
                 <colgroup> 
                  <col is="coral-table-column" fixedwidth> 
                  <col is="coral-table-column" fixedwidth> 
                  <col is="coral-table-column" sortable alignment="left"> 
                  <col is="coral-table-column" fixedwidth alignment="right"> 
                 </colgroup> 
                 <thead is="coral-table-head"> 
                  <tr is="coral-table-row"> 
                   <th is="coral-table-headercell" class="select"> 
                    <coral-checkbox coral-table-select></coral-checkbox> 
                   </th> 
                   <th is="coral-table-headercell" class="image"></th> 
                   <th is="coral-table-headercell"> ${data.type} </th> 
                   <th is="coral-table-headercell"></th> 
                  </tr> 
                 </thead> 
                 <tbody is="coral-table-body"> ${data.itemHtml} </tbody> 
                </table>`;
        };

        var types = data.types;
        var html = "";
        for (var t = 0; t < types.length; t++) {
            var itemHtml = "";
            var items = data.data[types[t]];
            for (var i = 0; i < items.length; i++) {
                var itemData = items[i];
                //i18n
                if (itemData.status) {
                    if (itemData.status === "not available") {
                        itemData.status = "";
                    } else {
                        itemData.status = Granite.I18n.getVar(itemData.status);
                    }
                }
                itemHtml += itemTpl(itemData);
            }
            html += sectionTpl({
                "type": options.texts.types[types[t]],
                "itemHtml": itemHtml
            });
        }
        var $cont = $($form.find(".list"));
        $cont.find('table[is="coral-table"]').remove();
        $(html).appendTo($cont);
        $cont.find ("td img").off("click.wizard").on("click.wizard",
            function(e) {
                var $article = $(e.target).parents("tr");
                if ($article.data("type") === "asset") {
                    var path = $article.data("path");
                    if (path) {
                        window.open(Granite.HTTP.externalize(path));
                    }
                }
                e.stopPropagation();
                e.preventDefault();
            });
    }

    function referencesRetrieved(xhr, status) {
        if (status === "success") {
            var json = $.parseJSON(xhr.responseText);
            var tableData = createSortedData(json);
            if (tableData.hasReferences) {
                buildTable(tableData);

                var $tables = $('#references .list table[is="coral-table"]');

                Coral.commons.nextFrame(function() {
                    item.setAttribute('selected', false);
                    $.each($tables, function(i, table) {
                        Coral.commons.ready(table, function(el) {
                            el.items.getAll().forEach(function(item) {
                                item.setAttribute('selected', true);
                            });
                        });
                    });
                });
            } else if(options.schedule || !options.hasReplicationRights){
                $("#references").hide();
            }
        } else {
            // error handling
            var errMsg = Granite.I18n.get("Failed to retrieve references.");
            actErrModal = document.querySelector('#activation-error');
            actErrModal.content.textContent = errMsg;
            actErrModal.show();
            wiz = options.wizard.adaptTo("foundation-wizard");
            wiz.toggleNext(true);
            wiz.toggleCancel(true);
        }

        $(window).adaptTo("foundation-ui").clearWait();
    }

    function replicationStarted(xhr, status) {
        if (status === "success") {
            var message = Granite.I18n.get("The page has been published");
            if($("input[name='activationDate']").val()) {
                // message changes if activation date has been specified
                message = Granite.I18n.get("The page has been scheduled for publication");
            }
            // store message so that it can be displayed after the redirect
            sessionStorage.setItem("cq-page-published-message", message);


            location.href = $(".foundation-wizard-control[data-foundation-wizard-control-action='cancel']").attr("href");
        } else {
            $(window).adaptTo("foundation-ui").clearWait();
            var errorMsg = "";
            if(options.hasReplicationRights && options.schedule){
                errorMsg = Granite.I18n.get("Failed to schedule the selected page(s).");
            }else if(!options.hasReplicationRights){
                errorMsg = Granite.I18n.get("Failed to request publishing for the selected page(s).");
            } else {
                errorMsg = Granite.I18n.getVar($(xhr.responseText).find("#Message").text());
            }
            actErrModal = document.querySelector('#activation-error');
            actErrModal.content.textContent = errorMsg;
            actErrModal.show();
            var wiz = options.wizard.adaptTo("foundation-wizard");
            wiz.toggleNext(true);
            wiz.toggleCancel(true);
        }
    }


    $.fn.CQ_UI_siteadmin_activate = function(opts) {
        $(window).adaptTo("foundation-ui").wait();

        $form = opts.wizard;
        options = opts;
        var url = Granite.HTTP.externalize(opts.referencesUrl);
        var prm = opts.urlParam;
        var data = { };
        data[prm] = opts.toActivate;

        if(!options.hasReplicationRights || options.schedule){
            $form.find("#schedule").show();
            if(!options.hasReplicationRights){
                $form.find("#workflow").show();
            }else{
                $form.find("#workflow").hide();
            }
        }else{
            $form.find("#schedule").hide();
        }

        $.ajax(url, {
            "type": "POST",
            "data": data,
            "cache": false,
            "dataType": "json",
            "complete": referencesRetrieved
        });
    };

    $.fn.CQ_UI_siteadmin_startReplication = function() {
        $(window).adaptTo("foundation-ui").wait();
        var paths = [ ];

        var tables = $('.list table[is="coral-table"]');
        $.each(tables, function(i, table) {
            var selected = table.selectedItems;
            for (var s = 0; s < selected.length; s++) {
                var $item = $(selected[s]);
                var path = $item.data("path");
                var type = $item.data("type");

                paths.push(path);
            }
        });

        // Paths to activate must always be last.
        options.toActivate.forEach(function (path) {
            var index = paths.indexOf(path);
            if (index > -1) {
                paths.splice(index, 1);
                paths.push(path);
            } else {
                paths.push(path);
            }
        });

        if (paths.length > 0) {
            var url = null;
            var settings = null;

            if(options.hasReplicationRights){
                if(options.schedule){
                    url = Granite.HTTP.externalize(options.workflowUrl);
                    var datepicker = $("input[name='activationDate']");
                    var absTime = new Date().getTime();
                    if(datepicker && datepicker.val().length > 0){
                        absTime = Date.parse(datepicker.val());
                    }
                    settings = {
                        "type": "POST",
                        "data": {
                            "_charset_": "UTF-8",
                            "model": options.workflowModel,
                            "absoluteTime": absTime,
                            "payload": paths,
                            "payloadType": "JCR_PATH"
                        },
                        "complete": replicationStarted
                    };
                }else{
                    url = Granite.HTTP.externalize(options.replicationUrl);
                    var cmd = encodeURI(options.activationCommand);
                    settings = {
                        "type": "POST",
                        "data": {
                            "_charset_": "utf-8",
                            "cmd": cmd,
                            "path": paths
                        },
                        "complete": replicationStarted
                    };
                }
            }else{
                //request for activation
                url = Granite.HTTP.externalize(options.workflowUrl);
                var datepicker = $("input[name='activationDate']");
                var absTime = new Date().getTime();
                var commentField = $("#comment");
                var comment = "";
                if(commentField){
                    comment = commentField.val();
                }
                if(datepicker && datepicker.val().length > 0){
                    absTime = Date.parse(datepicker.val());
                }
                settings = {
                    "type": "POST",
                    "data": {
                        "_charset_": "UTF-8",
                        "model": options.workflowModel,
                        "absoluteTime": absTime,
                        "startComment": comment,
                        "payload": paths,
                        "payloadType": "JCR_PATH"
                    },
                    "complete": replicationStarted
                };
            }
            $.ajax(url, settings);
        }
    };


    $(document).on("submit.publishWizard", ".cq-siteadmin-admin-publishpage-form", function(e) {
        e.preventDefault();
        $("#references").CQ_UI_siteadmin_startReplication();
    });


    $(document).off("foundation-contentloaded.publishWizard").on("foundation-contentloaded.publishWizard", function(e) {

        var configOptions = $(".publish-wizard-config").data("config");

        //change text of Publish button based on replication rights
        $(".foundation-wizard-control:submit").text(configOptions.publishLabel);

        $.extend(configOptions, {'wizard': $(".cq-siteadmin-admin-publishpage.foundation-wizard"), 'activationCommand': "Activate"});
        $("#references").CQ_UI_siteadmin_activate(configOptions);

    });


})(jQuery);