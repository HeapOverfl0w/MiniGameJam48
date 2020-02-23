using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HedgeMazeWithBros.Hubs
{
    public class GameHub : Hub
    {
        private MazeBuilder _mazeBuilder;
        private UpdateManager _updatedManager;
        public GameHub(MazeBuilder mazeBuilder, UpdateManager updateManager, IHubContext<GameHub> gameHub)
        {
            _mazeBuilder = mazeBuilder;
            _updatedManager = updateManager;
            _updatedManager.Initialize(gameHub);
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            _updatedManager.Players.Remove(Context.Items["player"] as Player);
            return Clients.All.SendAsync("BroConnect", "Bro disconnected.");
        }

        public async Task Connect()
        {
            await Clients.All.SendAsync("BroConnect", "Bro connected.");
            await Clients.Caller.SendAsync("PlayerNumber", ++_updatedManager.CurrentPlayerNumber);
            Context.Items.Add("player", new Player(_mazeBuilder.CurrentStartX * 16, _mazeBuilder.CurrentStartY * 16, _updatedManager.CurrentPlayerNumber));
            _updatedManager.Players.Add(Context.Items["player"] as Player);
            //await Clients.Client(Context.ConnectionId).SendAsync("ReceiveMaze", _mazeBuilder.CurrentMaze);
        }

        public async Task SendLocation(int x, int y)
        {
            (Context.Items["player"] as Player).x = x;
            (Context.Items["player"] as Player).y = y;
        }

        public async Task SendBroMessage(string message)
        {
            Clients.All.SendAsync("BroMessage", message);
        }
    }
}
