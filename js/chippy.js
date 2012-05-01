// Class to represent a row in the seat reservations grid
function Score(name, score, date) {
    var self = this;
    self.name = name;
    self.score = score;
    self.date = date;
}

// Overall viewmodel for this screen, along with initial state
function LeaderboardViewModel() {
    var self = this;
    self.scores = ko.observableArray();
    self.leaderboard = ko.observable(false);
    self.level = new Array();
    self.level.push(ko.observable(false));

    // Operations
    self.addScore = function(name, score) {
        self.scores.push(new Score(name, score, new Date()));
        self.save();
    }

    self.load = function() {
        if (localStorage.getItem("chippy_leaderboard"))
        {
            var existingLeaderboard = JSON.parse(localStorage.getItem("chippy_leaderboard"));
            for (var index = 0; index < existingLeaderboard.length; ++index)
            {
                self.scores.push(existingLeaderboard[index]);
            }
        }
    }

    self.save = function() {
        var leaderBoardToSave = new Array();
        for(var index = 0; index < self.scores().length; ++index)
        {
            leaderBoardToSave.push(self.scores()[index]);
        }
        localStorage.setItem("chippy_leaderboard", JSON.stringify(leaderBoardToSave));
    }

    self.load();
}

LeaderboardViewModel.prototype.showLeaderboard = function()
{
  // Hide all level tabs.
  this.showLevel(-1);
  
  this.leaderboard(true);

}

LeaderboardViewModel.prototype.showLevel = function(level)
{
  this.leaderboard(false);
  for (var index = 0; index < this.level.length; ++index)
  {
    this.level[index](index == level);
  }
}


ko.applyBindings(new LeaderboardViewModel());
