using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HedgeMazeWithBros
{
    public class Player
    {
        public int x { get; set; }
        public int y { get; set; }

        public int num { get; set; }

        public bool isEnemy { get; set; }
        public Player(int x, int y, int num, bool isEnemy = false)
        {
            this.x = x;
            this.y = y;
            this.num = num;
            this.isEnemy = isEnemy;
        }
    }
}
