using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Cors.Internal;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using NLog.Config;
using Sun.DB;

namespace Sun
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = "https://github.com/hyflamewow/",
                        ValidAudience = "https://github.com/hyflamewow/",
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("119d036e-1343-4a8a-b5e7-bd6f165d1aea"))
                    };
                });
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1)
                .AddJsonOptions(options =>
                {   // #維持屬性名稱大小寫
                    options.SerializerSettings.ContractResolver = new Newtonsoft.Json.Serialization.DefaultContractResolver();
                });
            services.AddCors(options =>
                {
                    options.AddPolicy("CorsPolicy",
                        builder => builder
                            .AllowAnyOrigin()
                            .AllowAnyMethod()
                            .AllowAnyHeader()
                            .AllowCredentials()
                    );
                });
            services.Configure<MvcOptions>(options =>
            {
                options.Filters.Add(new CorsAuthorizationFilterFactory("CorsPolicy"));
            });
            ConfigFiles configFiles = Configuration.GetSection("ConfigFiles").Get<ConfigFiles>();
            // #目前不考慮整合ASP.NET的Log機制, 因為看不出優點, 單純用NLog就夠了。
            NLog.LogManager.Configuration = new XmlLoggingConfiguration(configFiles.NLogConfig);
            var dbConfig = JsonConvert.DeserializeObject<Dictionary<string, DBConfig>>(File.ReadAllText(configFiles.DBConfig));
            // #將DBHelper放入DI
            services.AddSingleton<DBHelper>(new DBHelper(dbConfig));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
            }

            // app.UseHttpsRedirection();
            app.UseAuthentication();
            app.UseMvc();
            app.UseDefaultFiles();
            app.UseStaticFiles();
            // #使用CORS
            app.UseCors("CorsPolicy");
            // #實作SPA
            app.Run(async (context) =>
            {
                if (!Path.HasExtension(context.Request.Path.Value))
                {
                    await context.Response.SendFileAsync(Path.Combine(env.WebRootPath, "index.html"));
                }
            });
            app.UseMvc();
        }
    }
}
