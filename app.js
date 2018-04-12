// This is a simple *viewmodel* - JavaScript that defines the data and behavior of your UI
function AppViewModel() {
    this.firstName = "Jack";
    this.lastName = "Middlebrook";
}

// Activates knockout.js
ko.applyBindings(new AppViewModel());
