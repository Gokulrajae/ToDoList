//jshint esversion:6

var items = ["Take Tablets", "Make a call to abc Technology", "Visit the construction work by 4pm"];

var day = "";
let workItems = [];

const express = require("express");
const bodyParser = require("body-parser");
const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get("/", function(req, res) {
  var today = new Date();
  var options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };



  var day = today.toLocaleDateString("en-US", options);
  res.render("list", {
    listTitle: day,
    newListItem: items
  });

});


app.post("/", function(req, res) {
  let item = req.body.newItem;
  console.log(req.body.list);
  if (req.body.list == "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }


});


app.get("/work", function(req, res) {
  res.render("list", {
    listTitle: "Work List",
    newListItem: workItems
  });
});

app.post("/work", function(req, res) {
  let item = req.body.newItem
  workItems.push(item);
});

app.get("/about", function(req, res) {
  res.render("about");
});

app.listen(3000, function() {
  console.log("server started on port 3000");
});


// Easy method to get day

// var day="";
// var weekDays =["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
// console.log(today.getTime());
// if(today.getDay()==6 || today.getDay()==0){
// day =weekDays[today.getDay()];
//

// }else{
// day =weekDays[today.getDay()];
//

// }
//  res.render("list",{kindofDay:day});
