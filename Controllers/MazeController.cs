using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HedgeMazeWithBros.Controllers
{
    [Route("/hedge")]
    [ApiController]
    public class MazeController : ControllerBase
    {
        MazeBuilder _mazeBuilder;
        public MazeController(MazeBuilder mazeBuilder)
        {
            _mazeBuilder = mazeBuilder;
        }

        [HttpGet]
        public ActionResult<int[,]> Get()
        {
            return _mazeBuilder.CurrentMaze;
        }
    }
}
