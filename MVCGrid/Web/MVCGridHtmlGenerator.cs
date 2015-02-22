﻿using MVCGrid.Interfaces;
using MVCGrid.Models;
using MVCGrid.Utility;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace MVCGrid.Web
{
    //Feature Requests
    //Show/hide fields
    internal class MVCGridHtmlGenerator
    {
        internal static string GenerateClientDataTransferHtml(GridContext gridContext)
        {
            StringBuilder sb = new StringBuilder();

            sb.AppendFormat("<div id='MVCGrid_{0}_ContextJsonData' style='display: none;'>", gridContext.GridName);

            sb.Append("{");

            sb.AppendFormat("\"name\": \"{0}\"", gridContext.GridName);
            sb.Append(",");
            sb.AppendFormat("\"sortColumn\": \"{0}\"", gridContext.QueryOptions.SortColumnName);
            sb.Append(",");
            sb.AppendFormat("\"sortDirection\": \"{0}\"", gridContext.QueryOptions.SortDirection);
            sb.Append(",");
            sb.AppendFormat("\"itemsPerPage\": {0}", gridContext.QueryOptions.ItemsPerPage);
            sb.Append(",");
            sb.AppendFormat("\"pageNumber\": {0}", gridContext.QueryOptions.PageIndex + 1);
            sb.Append(",");


            sb.Append("\"filters\": {");
            bool hasFilter = false;
            var filterableColumns = gridContext.GridDefinition.GetColumns().Where(p => p.EnableFiltering);
            foreach (var col in filterableColumns)
            {
                string val = "";
                if (gridContext.QueryOptions.Filters.ContainsKey(col.ColumnName))
                {
                    val = gridContext.QueryOptions.Filters[col.ColumnName];
                }

                if (hasFilter)
                {
                    sb.Append(",");
                }
                sb.AppendFormat("\"{0}\": \"{1}\"", col.ColumnName, val);
                hasFilter = true;
            }
            sb.Append("}");

            sb.Append(",");

            sb.Append("\"additionalQueryOptions\": {");
            bool hasAdditionalQueryOptions = false;
            foreach (var aqon in gridContext.GridDefinition.AdditionalQueryOptionNames)
            {
                string val = "";
                if (gridContext.QueryOptions.AdditionalQueryOptions.ContainsKey(aqon))
                {
                    val = gridContext.QueryOptions.AdditionalQueryOptions[aqon];
                }

                if (hasAdditionalQueryOptions)
                {
                    sb.Append(",");
                }
                sb.AppendFormat("\"{0}\": \"{1}\"", aqon, val);
                hasAdditionalQueryOptions = true;
            }
            sb.Append("}");



            sb.Append("}");

            sb.Append("</div>");

            return sb.ToString();
        }

        internal static string GenerateBasePageHtml(string gridName, IMVCGridDefinition def)
        {
            string definitionJson = GenerateClientDefinitionJson(gridName, def);

            StringBuilder sbHtml = new StringBuilder();

            sbHtml.AppendFormat("<div id='{0}' class='{1}'>", HtmlUtility.GetContainerHtmlId(gridName), HtmlUtility.ContainerCssClass);

            sbHtml.AppendFormat("<input type='hidden' name='MVCGridName' value='{0}' />", gridName);
            sbHtml.AppendFormat("<div id='MVCGrid_{0}_JsonData' style='display: none'>{1}</div>", gridName, definitionJson);

            sbHtml.AppendFormat("<div id='MVCGrid_ErrorMessage_{0}' style='display: none;'>", gridName);
            if (String.IsNullOrWhiteSpace(def.ErrorMessageHtml))
            {
                sbHtml.Append("An error has occured.");
            }
            else
            {
                sbHtml.Append(def.ErrorMessageHtml);
            }
            sbHtml.Append("</div>");


            sbHtml.AppendFormat("<div id='MVCGrid_Loading_{0}' class='text-center' style='visibility: hidden'>", gridName);
            sbHtml.AppendFormat("&nbsp;&nbsp;&nbsp;<img src='{0}/ajaxloader.gif' alt='Processing' style='width: 15px; height: 15px;' />", HtmlUtility.GetHandlerPath());
            sbHtml.Append("Processing...");
            sbHtml.Append("</div>");

            sbHtml.AppendFormat("<div id='{0}'>", HtmlUtility.GetTableHolderHtmlId(gridName));
            sbHtml.Append("%%PRELOAD%%");
            sbHtml.Append("</div>");

            sbHtml.AppendLine("</div>");

            return sbHtml.ToString();
        }

        private static string GenerateClientDefinitionJson(string gridName, IMVCGridDefinition def)
        {
            StringBuilder sbJson = new StringBuilder();

            sbJson.Append("{");
            sbJson.AppendFormat("\"name\": \"{0}\"", gridName);
            sbJson.Append(",");
            sbJson.AppendFormat("\"qsPrefix\": \"{0}\"", def.QueryStringPrefix);
            sbJson.Append(",");
            sbJson.AppendFormat("\"preloaded\": {0}", def.PreloadData.ToString().ToLower());

            sbJson.Append(",");
            sbJson.AppendFormat("\"clientLoading\": \"{0}\"", def.ClientSideLoadingMessageFunctionName);

            sbJson.Append(",");
            sbJson.AppendFormat("\"clientLoadingComplete\": \"{0}\"", def.ClientSideLoadingCompleteFunctionName);

            sbJson.Append(",");
            sbJson.AppendFormat("\"renderingMode\": \"{0}\"", def.RenderingMode.ToString().ToLower());

            sbJson.Append("}");
            return sbJson.ToString();
        }
    }
}
