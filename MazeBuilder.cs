using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HedgeMazeWithBros
{
    public class MazeBuilder
    {
        const int MIN_WIDTH = 30;
        const int MIN_HEIGHT = 30;
        const int MAX_WIDTH = 80;
        const int MAX_HEIGHT = 80;

        const int WALL = 0;
        const int PATH = 1;
        const int START = 2;
        const int END = 3;
        public int[,] CurrentMaze { get; private set; }
        public int CurrentStartX { get; private set; }
        public int CurrentStartY { get; private set; }
        public int CurrentEndX { get; private set; }
        public int CurrentEndY { get; private set; }

        public int CurrentWidth { get; private set; }
        public int CurrentHeight { get; private set; }

        public MazeBuilder()
        {
            CreateRandomMaze();
        }

        public void CreateRandomMaze()
        {
            Random random = new Random();
            var width = random.Next(MIN_WIDTH, MAX_WIDTH);
            var height = random.Next(MIN_HEIGHT, MAX_HEIGHT);

            int[,] maze = new int[width, height];
            bool[,] visitedMaze = new bool[width, height];
            //PRIM'S ALGORITHUMMM
            //default to walls
            for (int wallx = 0; wallx < width; wallx++)
            {
                for (int wally = 0; wally < height; wally++)
                {
                    maze[wallx, wally] = WALL;
                }
            }

            List<int[]> frontiers = new List<int[]>();
            var x = random.Next(1, width - 2);
            var y = random.Next(1, height - 2);
            frontiers.Add(new int[] { x, y, x, y });

            while(frontiers.Count != 0)
            {
                var randoF = random.Next(0, frontiers.Count - 1);
                int[] f = frontiers[randoF];
                frontiers.RemoveAt(randoF);
                x = f[2];
                y = f[3];
                if ( maze[x,y] == WALL)
                {
                    maze[f[0], f[1]] = maze[x, y] = PATH;
                    if (x >= 2 && maze[x - 2,y] == WALL)
                        frontiers.Add(new int[] { x - 1, y, x - 2, y });
                    if (y >= 2 && maze[x,y - 2] == WALL)
                        frontiers.Add(new int[] { x, y - 1, x, y - 2 });
                    if (x < width - 2 && maze[x + 2,y] == WALL)
                        frontiers.Add(new int[] { x + 1, y, x + 2, y });
                    if (y < height - 2 && maze[x,y + 2] == WALL)
                        frontiers.Add(new int[] { x, y + 1, x, y + 2 });
                }
            }

            var startx = random.Next(1, width - 2);
            var endx = random.Next(1, width - 2);
            while (maze[startx, height - 2] == WALL ||
                   maze[endx, 1] == WALL)
            {
                //keep randomly finding start and end
                if (maze[startx, height - 2] == WALL)
                    startx = random.Next(1, width - 2);
                if (maze[endx, 1] == WALL)
                    endx = random.Next(1, width - 2);
            }

            maze[startx, height - 2] = START;
            maze[endx, 1] = END;

            var mazeBigger = new int[width + 2, height + 2];
            for (int wallx = 0; wallx < width; wallx++)
            {
                for (int wally = 0; wally < height; wally++)
                {
                   mazeBigger[wallx + 1, wally + 1] = maze[wallx, wally];
                }
            }

            var correctPath = new bool[width + 2, height + 2];
            DetermineSolutionPath(mazeBigger, new bool[width + 2, height + 2], correctPath, startx + 1, height - 1, endx + 1, 2);

            var doorCount = random.Next(2, 5);

            if (height < 35)
            {
                doorCount = 2;
            }

            for (int i = 0; i < doorCount; i++)
            {
                int doorStartY = (height / doorCount) * i + 5;

                //var doorx = random.Next(5, width - 2);
                var doory = random.Next(doorStartY, doorStartY + (height / doorCount) - 6);
                var doorx = 0;
                for (int cx = 0; cx < width + 2; cx++)
                {
                    if (correctPath[cx, doory])
                    {
                        doorx = cx;
                        break;
                    }
                }

                //find button 1
                var btnx = random.Next(doorx - 2, doorx + 2);
                var btny = random.Next(doory + 1, doory + 3);
                for (int cx = 0; cx < width + 2; cx++)
                {
                    if (correctPath[cx, btny])
                    {
                        btnx = cx;
                        break;
                    }
                }

                if (btnx == 0)
                    continue;

                var btn2x = random.Next(doorx - 2, doorx + 2);
                var btn2y = random.Next(doory - 3, doory - 1);
                for (int cx = 0; cx < width + 2; cx++)
                {
                    if (correctPath[cx, btn2y])
                    {
                        btn2x = cx;
                        break;
                    }
                }

                if (btn2x == 0)
                    continue;

                mazeBigger[btnx, btny] = END + 1 + i;
                mazeBigger[btn2x, btn2y] = END + 1 + i;
                mazeBigger[doorx, doory] = END + 1 + i + 100;
            }

            CurrentStartX = startx + 1;
            CurrentStartY = height - 1;
            CurrentEndX = endx + 1;
            CurrentEndY = 2;

            CurrentWidth = width + 2;
            CurrentHeight = height + 2;

            CurrentMaze = mazeBigger;
        }

        private bool DetermineSolutionPath(int[,] maze, bool[,] wasHere, bool [,] correctPath, int x, int y, int endX, int endY)
        {
            if (x == endX && y == endY) return true; // If you reached the end
            if (maze[x, y] == 0 || wasHere[x, y]) return false;
            // If you are on a wall or already were here
            wasHere[x, y] = true;
            if (DetermineSolutionPath(maze, wasHere, correctPath, x - 1, y, endX, endY))
            { // Recalls method one to the left
                correctPath[x,y] = true; // Sets that path value to true;
                return true;
            }
            if (DetermineSolutionPath(maze, wasHere, correctPath, x + 1, y, endX, endY))
            { // Recalls method one to the right
                correctPath[x,y] = true;
                return true;
            }
            if (DetermineSolutionPath(maze, wasHere, correctPath, x, y - 1, endX, endY))
            { // Recalls method one up
                correctPath[x,y] = true;
                return true;
            }
            if (DetermineSolutionPath(maze, wasHere, correctPath, x, y + 1, endX, endY))
            { // Recalls method one down
                correctPath[x,y] = true;
                return true;
            }
            return false;
        }
    }
}
