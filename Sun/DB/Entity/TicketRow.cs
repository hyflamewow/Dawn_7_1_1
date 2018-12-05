using System;

namespace Sun.DB.Entity
{
    public class TicketRow
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Seat { get; set; }
        public double Amount { get; set; }
        public DateTime DateTime { get; set; }
    }
}