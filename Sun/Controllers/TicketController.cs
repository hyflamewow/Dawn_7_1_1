using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sun.DB;
using Sun.DB.Entity;

namespace Sun.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TicketController : ControllerBase
    {
        private static NLog.Logger _logger = NLog.LogManager.GetCurrentClassLogger();
        private readonly DBHelper _dbHelper;
        public TicketController(DBHelper dbHelper)
        {
            _dbHelper = dbHelper;
            _dbHelper.CreateDB();
        }
        [HttpGet]
        
        public ActionResult<IEnumerable<TicketRow>> Get()
        {
            var list = _dbHelper.GetTicketList();
            return Ok(list);
        }

        [HttpPost()]
        [Authorize]
        public void Post([FromBody] TicketRow ticket)
        {
            // #日期要換成本地時間
            ticket.DateTime = ticket.DateTime.ToLocalTime();
            _dbHelper.InsertTicket(ticket);
        }
    }
}