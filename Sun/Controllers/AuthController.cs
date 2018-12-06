using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Sun.DB;

namespace Sun.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly NLog.Logger _logger = NLog.LogManager.GetCurrentClassLogger();
        private readonly DBHelper _dbHelper;

        public AuthController(DBHelper dbHelper)
        {
            _dbHelper = dbHelper;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody]LoginModel user)
        {
            if (user == null)
            {
                return BadRequest("Invalid client request");
            }

            var userInfo = this._dbHelper.GetUser(user.Account, user.Password);
            if (userInfo == null)
            {
                return BadRequest("Invalid client request");
            }

            bool isAuth = true;
            if (isAuth)
            {
                var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("119d036e-1343-4a8a-b5e7-bd6f165d1aea"));
                var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
                var claims = new List<Claim>()
                    {
                        new Claim(ClaimTypes.Name, user.Account),
                        new Claim(ClaimTypes.Role, "Manager")
                    };

                var tokeOptions = new JwtSecurityToken(
                    issuer: "https://github.com/hyflamewow/",
                    audience: "https://github.com/hyflamewow/",
                    claims: claims,
                    expires: DateTime.Now.AddMinutes(5),
                    signingCredentials: signinCredentials
                );

                var tokenString = new JwtSecurityTokenHandler().WriteToken(tokeOptions);
                return Ok(new { Token = tokenString });
            }
            else
            {
                return Unauthorized();
            }
        }
        public class LoginModel
        {
            public string Account { get; set; }
            public string Password { get; set; }
        }
    }

}