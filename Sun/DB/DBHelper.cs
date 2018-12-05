using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Data.SQLite;
using System.IO;
using System.Linq;
using Dapper;
using Sun.DB.Entity;

namespace Sun.DB
{
    public class DBHelper
    {
        private static NLog.Logger _logger = NLog.LogManager.GetCurrentClassLogger();
        private Dictionary<string, DBConfig> _config;
        public DBHelper(Dictionary<string, DBConfig> config)
        {
            _config = config;
        }
        private DbConnection CreateConn(string key)
        {
            DBConfig dbConfig = _config[key];
            DbConnection conn = null;
            if (dbConfig.Driver.ToUpper() == "SQLITE")
            {
                conn = new SQLiteConnection($"data source={dbConfig.ConnStr}");
            }
            return conn;
        }
        public void CreateDB()
        {
            DBConfig dbConfig = _config["MainDB"];
            if (!File.Exists(dbConfig.ConnStr))
            {
                DbConnection conn = CreateConn("MainDB");
                try
                {
                    string strSQL = $@"
CREATE TABLE Ticket (
    ID INTEGER NOT NULL,
    Name TEXT NOT NULL,
    Seat TEXT NOT NULL,
    Amount REAL NOT NULL,
    DateTime DATETIME NOT NULL)
";
                    conn.Execute(strSQL);
                }
                catch (Exception ex)
                {
                    _logger.Error(ex, "CreateDB");
                    throw ex;
                }
                finally
                {
                    conn?.Close();
                }
            }
        }
        #region Ticket
        public List<TicketRow> GetTicketList()
        {
            DbConnection conn = CreateConn("MainDB");
            try
            {
                string strSQL = $@"
SELECT * FROM Ticket
";
                var list = conn.Query<TicketRow>(strSQL).ToList();
                return list;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "GetTicketList");
                throw ex;
            }
            finally
            {
                conn?.Close();
            }
        }
        public void InsertTicket(TicketRow ticket)
        {
            DbConnection conn = CreateConn("MainDB");
            try
            {
                string strSQL = $@"
INSERT INTO Ticket
       ( ID,  Name,  Seat,  Amount,  DateTime)
VALUES (@ID, @Name, @Seat, @Amount, @DateTime)
";
                conn.Execute(strSQL, ticket);
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "InsertTicket");
                throw ex;
            }
            finally
            {
                conn?.Close();
            }
        }
        #endregion Ticket
    }
}