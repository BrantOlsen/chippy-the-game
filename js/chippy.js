function ChippyGame($elem) {
  var self = this;
  
  self.context = $elem[0].getContext("2d");

  self.context.fillRect(0, 0, self.context.canvas.width, self.context.canvas.height);
}

// Class to represent a row in the seat reservations grid
function Score(name, score, date) {
  var self = this;
  self.name = name;
  self.score = score;
  self.date = date;
}

// Overall viewmodel for this screen, along with initial state
function MainViewModel() {
  var self = this;
  
  self.scores = ko.observableArray();
  self.leaderboard = ko.observable(false);
  self.level = new Array();
  self.level.push(ko.observable(false));
  self.chippyGame = new ChippyGame($("#level1"));

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

MainViewModel.prototype.showLeaderboard = function()
{
  // Hide all level tabs.
  this.showLevel(-1);
  
  this.leaderboard(true);

}

MainViewModel.prototype.showLevel = function(level)
{
  this.leaderboard(false);
  for (var index = 0; index < this.level.length; ++index)
  {
    this.level[index](index == level);
  }
}

// Here's a custom Knockout binding that makes elements shown/hidden via jQuery's fadeIn()/fadeOut() methods
// Could be stored in a separate utility library
ko.bindingHandlers.fadeVisible = {
    init: function(element, valueAccessor) {
        // Initially set the element to be instantly visible/hidden depending on the value
        var value = valueAccessor();
        $(element).toggle(ko.utils.unwrapObservable(value)); // Use "unwrapObservable" so we can handle values that may or may not be observable
    },
    update: function(element, valueAccessor) {
        // Whenever the value subsequently changes, slowly fade the element in or out
        var value = valueAccessor();
        ko.utils.unwrapObservable(value) ? $(element).slideDown() : $(element).slideUp();
    }
};

ko.applyBindings(new MainViewModel());
