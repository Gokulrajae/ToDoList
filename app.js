//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const _ = require('lodash');

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://admin-gokul:IMepFxgqsd1LwIoR@cluster0.gipgn.mongodb.net/todolistDB");

var items = ["Take Tablets", "Make a call to abc Technology", "Visit the construction work by 4pm"];
var day = "";
let workItems = [];

var options = {
  weekday: "long",
  day: "numeric",
  month: "long"
};

  var today = new Date().toLocaleDateString("en-US", options);
    //var day = today.toLocaleDateString("en-US", options);

const itemsSchema = new mongoose.Schema({
  name : String
});

const Item = mongoose.model("Item",itemsSchema);

const item1 = new Item({
  name:"welcome to uour todolist"
});

const item2 = new Item({
  name:"Hit + button to add new item"
});

const item3 = new Item({
  name:"<--- Hit this to delete an item"
});

const defaultItems =[item1,item2,item3];

app.get("/", function(req, res) {
Item.find({},function(err , foundItems){
  if(foundItems.length===0){
    Item.insertMany(defaultItems,function(err){
      if(err){
        console.log(err);
      }else{
        console.log(" Inserted successfully");
      }
    });
    res.redirect("/");
  }else{
  res.render("list", {
    listTitle: "today",
    newListItem: foundItems
  });
}
}) ;
});

const listSchema = {
  name : String,
  items:[itemsSchema]
};
const List = mongoose.model("List",listSchema);

app.get("/:customListName",function(req,res){
const customlistName = _.capitalize(req.params.customListName);
List.findOne({name:customlistName},function(err,foundList){
  if(!err){
    if(!foundList){
      const list = new List({
        name :customlistName,
        items:defaultItems
      });
      list.save();
      res.redirect("/" +customlistName);
    }else{
res.render("list",{listTitle:foundList.name , newListItem:foundList.items});
}
}
});

});



app.post("/", function(req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list
  const item = new Item({
    name:itemName
  });

  if(listName==="today"){
item.save();
res.redirect("/");
}else{
  List.findOne({name:listName},function(err,foundList){
  foundList.items.push(item);
  foundList.save();
  res.redirect("/" +listName);
});
}

});



  // console.log(req.body.list);
  // if (req.body.list == "Work") {
  //   workItems.push(item);
  //   res.redirect("/work");
  // } else {
  //   items.push(item);
  //   res.redirect("/");
  // }





app.post("/delete", function(req,res){
const checkedItemId=req.body.checkbox;
const listName =req.body.listName;

if(listName==="today"){
  Item.findByIdAndRemove(checkedItemId,function(err){
    if(!err){
        // console.log("Checked Item Deleted successfully");
        res.redirect("/");
      }
});
}else{
  List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}},function(err, foundList){
    if(!err){
      res.redirect("/"+listName);
    }
  });
}


});




// seperate work list accesed by --->http://localhost:3000/work

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

app.listen(process.env.PORT || 3000, function() {
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
