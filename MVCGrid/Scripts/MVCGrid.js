﻿
var MVCGrid = new function () {

    var handlerPath = '%%HANDLERPATH%%';
    var controllerPath = '%%CONTROLLERPATH%%';
    var currentGrids = [];

    this.init = function () {
        $('.MVCGridContainer').each(function () {

            var mvcGridName = $("#" + this.id).find("input[name='MVCGridName']").val();

            var jsonData = $('#' + 'MVCGrid_' + mvcGridName + '_JsonData').html();

            currentGrids.push(
                $.parseJSON(jsonData)
            );
        });

        for (var i = 0; i < currentGrids.length; i++) {
            var obj = currentGrids[i];

            if (!obj.preloaded) {
                MVCGrid.reloadGrid(obj.name);
            }
        }
    }

    var getClientData = function (mvcGridName){
        var jsonData = $('#' + 'MVCGrid_' + mvcGridName + '_ContextJsonData').html();

        return $.parseJSON(jsonData);
    };

    var findGridDef = function (mvcGridName) {
        var gridDef;
        for (var i = 0; i < currentGrids.length; i++) {
            var obj = currentGrids[i];

            if (obj.name == mvcGridName) {
                gridDef = obj;
                break;
            }
        }
        return gridDef;
    };

    var updateURLParameter = function (url, param, paramVal) {

        param = param.toLowerCase();

        var TheAnchor = null;
        var newAdditionalURL = "";
        var tempArray = url.split("?");
        var baseURL = tempArray[0];
        var additionalURL = tempArray[1];
        var temp = "";

        if (additionalURL) {
            var tmpAnchor = additionalURL.split("#");
            var TheParams = tmpAnchor[0];
            TheAnchor = tmpAnchor[1];
            if (TheAnchor)
                additionalURL = TheParams;

            tempArray = additionalURL.split("&");

            for (i = 0; i < tempArray.length; i++) {
                if (tempArray[i].split('=')[0] != param) {
                    newAdditionalURL += temp + tempArray[i];
                    temp = "&";
                }
            }
        }
        else {
            var tmpAnchor = baseURL.split("#");
            var TheParams = tmpAnchor[0];
            TheAnchor = tmpAnchor[1];

            if (TheParams)
                baseURL = TheParams;
        }

        if (TheAnchor)
            paramVal += "#" + TheAnchor;

        var rows_txt = temp + "" + param + "=" + paramVal;
        return baseURL + "?" + newAdditionalURL + rows_txt;
    };

    this.getFilters = function (mvcGridName) {
        var clientJson = getClientData(mvcGridName);
        return clientJson.filters;
    }

    this.setFilters = function (mvcGridName, obj) {

        var gridDef = findGridDef(mvcGridName);

        var newUrl = window.location.href;

        $.each(obj, function (k, v) {
            newUrl = updateURLParameter(newUrl, gridDef.qsPrefix + k, v);
        });

        setURLAndReload(mvcGridName, newUrl);
    }

    this.getSortColumn = function (mvcGridName) {
        var clientJson = getClientData(mvcGridName);
        return clientJson.sortColumn;
    }

    this.getSortDirection = function (mvcGridName) {
        var clientJson = getClientData(mvcGridName);
        return clientJson.sortDirection;
    }

    this.setSort = function (mvcGridName, sortColumn, sortDirection) {

        var gridDef = findGridDef(mvcGridName);

        var newUrl = window.location.href;
        newUrl = updateURLParameter(newUrl, gridDef.qsPrefix + 'sort', sortColumn);
        newUrl = updateURLParameter(newUrl, gridDef.qsPrefix + 'dir', sortDirection);

        
        setURLAndReload(mvcGridName, newUrl);
    };

    this.getPage = function (mvcGridName) {
        var clientJson = getClientData(mvcGridName);
        return clientJson.pageNumber;
    }

    this.setPage = function (mvcGridName, pageNumber) {

        var gridDef = findGridDef(mvcGridName);

        var newUrl = window.location.href;
        newUrl = updateURLParameter(newUrl, gridDef.qsPrefix + 'page', pageNumber);
        setURLAndReload(mvcGridName, newUrl);
    };

    this.getPageSize = function (mvcGridName) {
        var clientJson = getClientData(mvcGridName);
        return clientJson.itemsPerPage;
    }

    this.setPageSize = function (mvcGridName, pageSize) {

        var gridDef = findGridDef(mvcGridName);

        var newUrl = window.location.href;
        newUrl = updateURLParameter(newUrl, gridDef.qsPrefix + 'pagesize', pageSize);
        setURLAndReload(mvcGridName, newUrl);
    };

    this.getAdditionalQueryOptions = function (mvcGridName) {
        var clientJson = getClientData(mvcGridName);
        return clientJson.additionalQueryOptions;
    }

    this.setAdditionalQueryOptions = function (mvcGridName, obj) {

        var gridDef = findGridDef(mvcGridName);

        var newUrl = window.location.href;

        $.each(obj, function (k, v) {
            newUrl = updateURLParameter(newUrl, gridDef.qsPrefix + k, v);
        });

        setURLAndReload(mvcGridName, newUrl);
    }

    var setURLAndReload = function (mvcGridName, newUrl) {

        if (history.pushState) {
            window.history.pushState({ path: newUrl }, '', newUrl);
            MVCGrid.reloadGrid(mvcGridName);
        }
        else {
            location.href = newUrl;
        }

    };

    this.reloadGrid = function(mvcGridName){
        var tableHolderHtmlId = 'MVCGridTableHolder_' + mvcGridName;
        var loadingHtmlId = 'MVCGrid_Loading_' + mvcGridName;
        var errorHtmlId = 'MVCGrid_ErrorMessage_' + mvcGridName;

        var gridDef = findGridDef(mvcGridName);;

        var ajaxBaseUrl = handlerPath;

        if (gridDef.renderingMode == 'controller') {
            ajaxBaseUrl = controllerPath;
        }

        $.ajax({
            type: "GET",
            url: ajaxBaseUrl + location.search,
            data: { 'Name': mvcGridName },
            cache: false,
            beforeSend: function () {
                if (gridDef.clientLoading != '') {
                    window[gridDef.clientLoading]();
                }
                else {
                    $('#' + loadingHtmlId).css("visibility", "visible");
                }
            },
            success: function (result) {
                $('#' + tableHolderHtmlId).html(result);
            },
            error: function (request, status, error) {
                var errorhtml = $('#' + errorHtmlId).html();
                $('#' + tableHolderHtmlId).html(errorhtml);
            },
            complete: function() {
                if (gridDef.clientLoadingComplete != '') {
                    window[gridDef.clientLoadingComplete]();
                }
                else {
                    $('#' + loadingHtmlId).css("visibility", "hidden");
                }
            }
        });
    }

    this.getExportUrl = function (mvcGridName) {
        var gridDef = findGridDef(mvcGridName);

        var exportUrl = handlerPath + location.search;
        exportUrl = updateURLParameter(exportUrl, 'engine', 'export');
        exportUrl = updateURLParameter(exportUrl, 'Name', mvcGridName);

        return exportUrl;
    }
};


$(function () {
    MVCGrid.init();
});
