/*
 * ADOBE CONFIDENTIAL
 *
 * Copyright 2016 Adobe Systems Incorporated
 * All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe Systems Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Adobe Systems Incorporated and its
 * suppliers and may be covered by U.S. and Foreign Patents,
 * patents in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe Systems Incorporated.
 */
(function(document, Granite, $) {
    "use strict";

    var $form, options;
    var aggregatedReferences = [], aggregatedReferencesStatus = [];

    var ui = $(window).adaptTo("foundation-ui");

    /**
     * Prepare the thumbnails of the references
     * @param data
     * @private
     */
    function _prepareThumbnails(data) {
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
    }

    /**
     * Sort the references by types
     *
     * @param json
     * @returns {{types: Array, data: {}, hasReferences: boolean}}
     * @private
     */
    function _createSortedData(json) {
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

    /**
     * build the table for the references
     * @param data
     * @private
     */
    function _buildTable(data) {
        // every section is an own table
        _prepareThumbnails(data);

        var itemTpl = function (data) {
            var thumbnail = data.thumbnail ? `<img src="${data.thumbnail}" class="image">` : '';
            return `<tr is="coral-table-row" data-path="${data.path}" data-type="${data.type}">  
                <td is="coral-table-cell"><coral-checkbox coral-table-rowselect></coral-checkbox></td>  
                    <td is="coral-table-cell"> ${thumbnail} </td>  
                    <td is="coral-table-cell"> ${data.name} </td>  
                    <td is="coral-table-cell"> ${data.status} </td>  
                </tr>`;
        };

        var sectionTpl = function (data) {
            data.type = data.type || '';
            return `<table is="coral-table" selectable multiple>  
                    <colgroup>  
                        <col is="coral-table-column" fixedwidth>  
                        <col is="coral-table-column" fixedwidth>  
                        <col is="coral-table-column" sortable alignment="left">  
                        <col is="coral-table-column" alignment="right">  
                    </colgroup>  
                    <thead is="coral-table-head">  
                    <tr is="coral-table-row">  
                        <th is="coral-table-headercell" class="select"><coral-checkbox coral-table-select></coral-checkbox></th>  
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
        $cont.find("coral-table").remove();
        $(html).appendTo($cont);
        $cont.find ("td img").off("click.wizard").on("click.wizard",
            function(e) {
                var $row = $(e.target).parents("tr");
                if ($row.data("type") === "asset") {
                    var path = $row.data("path");
                    if (path) {
                        window.open(Granite.HTTP.externalize(path));
                    }
                }
                e.stopPropagation();
                e.preventDefault();
            });
    }

    /**
     * Get the list of all references registered for all resources
     * @returns {Array}
     * @private
     */
    function _getAggregatedReferences() {
        var aggregatedReferences = [];
        var $refPathList = $("input[type='hidden'][name='refPathList']");
        if ($refPathList.length) {
            aggregatedReferences = JSON.parse($refPathList.val());
        }
        return aggregatedReferences;
    }

    /**
     * Get the list of the status of the references registered for all resources
     * Status of a resource is either selected or unselected
     * @returns {Array}
     * @private
     */
    function _getAggregatedReferencesStatus() {
        var aggregatedReferencesStatus = [];
        var $refIncludeList = $("input[type='hidden'][name='refIncludeList']");
        if ($refIncludeList.length) {
            aggregatedReferencesStatus = JSON.parse($refIncludeList.val());
        }
        return aggregatedReferencesStatus;
    }

    /**
     * Check if a reference is selected to be published or unselected to be ignored when publishing
     * @param path
     * @returns {*}
     * @private
     */
    function _isSelected(path) {
        var idx = $.inArray(path, aggregatedReferences);
        if (idx > -1) {
            return aggregatedReferencesStatus[idx];
        }
        return true;
    }

    /**
     * Process the result of the references retrieved from server side
     * Take care of the status of the references
     * @param xhr
     * @param status
     * @private
     */
    function _referencesRetrieved(xhr, status) {
        if (status === "success") {
            var json = JSON.parse(xhr.responseText);
            var tableData = _createSortedData(json);
            if (tableData.hasReferences) {
                _buildTable(tableData);


                var tables = document.querySelectorAll("#cq-common-publish-references-list" +
                    " .list table[is='coral-table']");

                Coral.commons.nextFrame(function() {
                    var resourcePath = Granite.HTTP.internalize($("#resourcePath").get(0).value);
                    item.setAttribute('selected', false);
                    for (var i = 0; i < tables.length; i++) {
                        Coral.commons.ready(tables[i], function(table) {
                            table.items.getAll().forEach(function(item) {
                             if (_isSelected($(item).data("path"))) {
                                   // item.setAttribute('selected', true);

                               }
                            });
                        });
                    }
                });
            }
        } else {
            // error handling
            var title = Granite.I18n.get("Error");
            var message = Granite.I18n.get("Failed to retrieve references for selected item.");
            ui.alert(title, message, "error");
        }

        var dialog = document.querySelector(".cq-common-publish-references-dialog");
        if (dialog) {
            dialog.center();
        }

        ui.clearWait();
    }

    /**
     * Load the references and take care of the correct status
     * @param opts
     * @private
     */
    function _loadReferences(opts) {
        ui.wait();

        if (opts && opts.referencesUrl) {
            options = opts;

            var prm = opts.urlParam;
            var data = { };
            data[prm] = opts.resourcePath;

            $.ajax(Granite.HTTP.externalize(opts.referencesUrl), {
                "type": "POST",
                "data": data,
                "cache": false,
                "dataType": "json",
                "complete": _referencesRetrieved
            });
        } else {
            ui.clearWait();
        }
    }

    $(function() {
        /**
         * Init the references
         */
        $(document).off("foundation-contentloaded.publishedReferences").on("foundation-contentloaded.publishedReferences", function(e) {
            aggregatedReferences = _getAggregatedReferences();
            aggregatedReferencesStatus = _getAggregatedReferencesStatus();

            if ($("#cq-common-publish-references-list").length) {
                $form = $("#cq-common-publish-references-form");
                var configOptions = $("#cq-common-publish-references-list .publish-references-config").data("config");
                _loadReferences(configOptions);
            }
        });

        /**
         * Submit the dialog
         */
        $(document).on("click", ".cq-common-publish-references-confirm", function(e){
            $(e.target).closest('.cq-common-publish-references-dialog').find("button[coral-close]").click();
            var selectedReferences = [];
            var unselectedReferences = [];
            var $rows = $("#cq-common-publish-references-list tbody [is='coral-table-row']");
            if ($rows.length) {
                $.each($rows, function( index, row ) {
                    if ($(row).hasClass("is-selected")) {
                        selectedReferences.push($(row).data("path"));
                    } else {
                        unselectedReferences.push($(row).data("path"));
                    }
                });

                $(document).trigger($.Event('publish-references-confirm', {
                    "totalReferences": $rows.length,
                    "selectedReferences": selectedReferences,
                    "unselectedReferences": unselectedReferences}
                ));
            }

        });
    });
})(document, Granite, Granite.$);
