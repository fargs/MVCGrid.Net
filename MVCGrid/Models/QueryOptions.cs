﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MVCGrid.Models
{
    public class QueryOptions
    {
        public SortDirection SortDirection { get; set; }
        public string SortColumn { get; set; }

        public int PageIndex { get; set; }
        public int ItemsPerPage { get; set; }

        public int GetLimitOffset()
        {
            return PageIndex * ItemsPerPage;
        }

        public int GetLimitRowcount()
        {
            return ItemsPerPage;
        }
    }
}