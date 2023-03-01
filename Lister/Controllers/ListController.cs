using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using Lister.Models;
using Lister.Models.ModelData;

namespace Lister.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class ListController : ControllerBase
    {
        [HttpPost]
        public ActionResult<ListData> SortByAsc(ListData listData)
        {
            var list = new Lister<string>(listData.Values);
            list.Sort();
            return Ok(new ListData(list.ToArray()));
        }

        [HttpPost]
        public ActionResult<ListData> SortByDesc(ListData listData)
        {
            var list = new Lister<string>(listData.Values);
            list.Sort((a, b) => b.CompareTo(a));
            return Ok(new ListData(list.ToArray()));
        }

        [HttpPost]
        public ActionResult<ListData> Reverse(ListData listData)
        {
            var list = new Lister<string>(listData.Values);
            list.Reverse();
            return Ok(new ListData(list.ToArray()));
        }
    }
}
