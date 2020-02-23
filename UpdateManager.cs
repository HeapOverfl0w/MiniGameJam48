using HedgeMazeWithBros.Hubs;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace HedgeMazeWithBros
{
    public class UpdateManager
    {
        private Timer _updateTimer;
        private Timer _resetGameTimer;
        private bool _initialized;
        private IHubContext<GameHub> _gameHub;
        private MazeBuilder _mazeBuilder;
        public int CurrentPlayerNumber { get; set; }

        public UpdateManager(MazeBuilder mazeBuilder)
        {
            _initialized = false;
            _updateTimer = new Timer(new TimerCallback(TimerTask), null, Timeout.Infinite, Timeout.Infinite);
            _resetGameTimer = new Timer(new TimerCallback(ResetGameTimer), null, 1000 * 60 * 10, 1000 * 60 * 10);
            Players = new List<Player>();
            Enemies = new List<Enemy>();
            _mazeBuilder = mazeBuilder;
            CreateEnemies();
        }

        public List<Player> Players { get; private set; }

        public List<Enemy> Enemies { get; private set; }

        public void Initialize(IHubContext<GameHub> gameHub)
        {
            if (!_initialized)
            {
                _gameHub = gameHub;
                _initialized = true;
                StartGame();
            }
        }
        public void StartGame()
        {
            _updateTimer.Change(0, 200);
        }

        public void StopGame()
        {
            _updateTimer.Change(Timeout.Infinite, Timeout.Infinite);
        }

        /// <summary>
        /// lol
        /// </summary>
        public void ResetResetGameTimer()
        {
            _resetGameTimer.Change(Timeout.Infinite, Timeout.Infinite);
            _resetGameTimer.Change(1000 * 60 * 10, 1000 * 60 * 10);
        }

        public void CreateEnemies()
        {
            Enemies.Clear();
            Random rand = new Random();
            for (int e = 0; e < rand.Next(20, 40); e++)
            {
                Enemies.Add(new Enemy(rand.Next(0, _mazeBuilder.CurrentWidth) * 16, rand.Next(0, _mazeBuilder.CurrentHeight) * 16));
            }
        }

        private void ResetGameTimer(object timerState)
        {
            StopGame();
            _mazeBuilder.CreateRandomMaze();
            CreateEnemies();
            StartGame();
            _gameHub.Clients.All.SendAsync("ResetGame");
            Console.WriteLine("Reset Maze after 10 Minutes without Completion.");
        }

        private void TimerTask(object timerState)
        {
            for (int e = 0; e < Enemies.Count; e++)
            {
                Enemies[e].Update();
            }
            List<Player> playersAndEnemies = new List<Player>();
            playersAndEnemies.AddRange(Players);
            playersAndEnemies.AddRange(Enemies);
            _gameHub.Clients.All.SendAsync("UpdateBros", playersAndEnemies);

            if (WinConditionHit())
            {
                StopGame();
                _mazeBuilder.CreateRandomMaze();
                CreateEnemies();
                ResetResetGameTimer();
                StartGame();
                _gameHub.Clients.All.SendAsync("ResetGame");
            }
        }

        private bool WinConditionHit()
        {
            if (Players.Count == 0)
                return false;

            for (int p = 0; p < Players.Count; p++)
            {
                if (Math.Round((double)(Players[p].x / 16)) != _mazeBuilder.CurrentEndX ||
                    Math.Round((double)(Players[p].y / 16)) != _mazeBuilder.CurrentEndY)
                    return false;
            }

            return true;
        }
    }
}
