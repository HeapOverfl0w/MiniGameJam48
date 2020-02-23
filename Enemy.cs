using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HedgeMazeWithBros
{
    public class Enemy : Player
    {
        private int _tileMoveWidth;
        private int _tileMoveHeight;
        private int _currentDirection;

        private int _startX;
        private int _startY;

        public Enemy(int x, int y) : base (x, y, -1, true)
        {
            _startX = x;
            _startY = y;
            Random rand = new Random();
            _tileMoveWidth = rand.Next(3, 7);
            _tileMoveHeight = rand.Next(3, 7);
            _currentDirection = rand.Next(0, 1);
        }

        public void Update()
        {
            if (_currentDirection == 0)
            {
                this.x += 2 * 16 * 1 / 5;
                if (_startX + (_tileMoveWidth * 16) <= this.x)
                    _currentDirection = 1;
            }
            else if (_currentDirection == 1)
            {
                this.y += 2 * 16 * 1 / 5;
                if (_startY + (_tileMoveHeight * 16) <= this.y)
                    _currentDirection = 2;
            }
            else if (_currentDirection == 2)
            {
                this.x -= 2 * 16 * 1 / 5;
                if (_startX >= this.x)
                    _currentDirection = 3;
            }
            else if (_currentDirection == 3)
            {
                this.y -= 2 * 16 * 1 / 5;
                if (_startY >= this.y)
                    _currentDirection = 0;
            }

        }
    }
}
