// //demo
// function Budget() {
//     var x = 23;
//     var name = 'sri';
//     var fun = function() {
//         console.log("name is " + name + " and age is " + x);
//     }
//     return {
//         name: name,
//         func: fun
//     }
// }
// var y = Budget();
// y.func();
// console.log(Budget.fun());//error
// // use IIFE for more privacy, if we write Budget in console whole function appears while in IIFE only public is exposed that is return


// here we write functions in budgetcontroller and UIcontroller and call them in the controller

var budgetcontroller = (function() {
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
    Expense.prototype.calcper = function(totalincome) {
        if (totalincome > 0) {
            this.percentage = Math.round((this.value / totalincome) * 100);
        } else this.percentage = -1;

    }

    Expense.prototype.getPercenatge = function() {
        return this.percentage;
    }

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var total = function(type) {
        var sum = 0;
        data.allItems[type].forEach((cur) => sum += cur.value);
        data.totals[type] = sum;
    }

    var data = {
        // a data structure to store all the values of income and expenses
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };
    return {
        additem: function(type, des, val) {
            let newitem, ID;
            //to add unique id we need to know the last id of the element in array
            //ex:[1 2 3 4 5]next id = 6 but if it has unordered ids 
            //[1 2 4 6 8] next id=9
            //that is last id +1
            //data.allItems[type] - array inc or exp
            //[data.allItems[type].length-1] - inc.length-1(above array-> 5-1=4)
            //means inc[4] = 8  

            //create new id
            //as we dont have any item in array 0-1 results negative so,
            if (data.allItems[type].length > 0) {
                console.log('ds');
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;

            }
            //create new item
            if (type === 'exp') {
                newitem = new Expense(ID, des, val);
                //here we are creating a new obj newitem which contains expense details
            }
            if (type === 'inc') {
                newitem = new Income(ID, des, val);
            }



            //pushing into the respective array
            data.allItems[type].push(newitem);
            // other way of selecting an item from object allitems[type] which is replaced by allitems['inc'] or 'exp'
            // console.log(data);

            //returning
            return newitem;
        },


        calculatebudget: function() {
            //calc total inc and exp
            total('inc');
            total('exp')

            //calc budegt:inc-exp
            data.budget = data.totals.inc - data.totals.exp;

            //calc % of inc 
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100)
            } else {
                data.percentage = -1;
            }
        },

        getbudget: function() {
            return {
                budget: data.budget,
                totalincome: data.totals.inc,
                totalexpenses: data.totals.exp,
                per: data.percentage
            }
        },


        calcpercenatges: function() {
            //for each exp created in exp arr, we need to call the fn
            data.allItems.exp.forEach((el) => {
                el.calcper(data.totals.inc);
            })
        },

        getper: function() {
            var allper = data.allItems.exp.map(function(cur) {
                return cur.getPercenatge();
            });
            return allper;
        },

        // as data structure is private  to test
        testing: function() {
            // console.log(data);
            return data;
        }
    };

})();

// As we are using class names in selectors , by chance if names are changed,then we need to cahnge everywhere so we store classnames in an obj. 
var UIcontroller = (function() {

    var DomStrings = {
        inputtype: '.add__type',
        inputvalue: '.add__value',
        inputdesc: '.add__description',
        bttn: '.add__btn',
        incomecontainer: '.income__list',
        expensecontainer: '.expenses__list',
        budgetlabel: '.budget__value',
        incomelabel: '.budget__income--value',
        expenselabel: '.budget__expenses--value',
        percentagelabel: '.budget__expenses--percentage',
        container: '.container',
        expensesperLabel: '.item__percentage',
        datelabel: '.budget__title--month'
    };
    var formatnumber = function(num, type) {
        var numSplit, int, dec, type;
        /*
            + or - before number
            exactly 2 decimal points
            comma separating the thousands

            2310.4567 -> + 2,310.46
            2000 -> + 2,000.00
            */

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');

        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); //input 23510, output 23,510
        }

        dec = numSplit[1];

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

    };

    var nodeListForEach = function(perar, callbk) {
        for (let i = 0; i < perar.length; i++) {
            callbk(perar[i], i);
        }
    }

    // for input values
    return {
        getinput: function() {
            //when a controller calls this method it should return values so to return 3 values at a time we use obj in return. 
            return {
                type: document.querySelector(DomStrings.inputtype).value,
                description: document.querySelector(DomStrings.inputdesc).value,
                value: +(document.querySelector(DomStrings.inputvalue).value)
            }
        },

        addlistitem: function(obj, type) {
            var markup, element;

            if (type === 'inc') {
                element = document.querySelector(DomStrings.incomecontainer);
                markup =
                    `<div class="item clearfix " id="income-${obj.id} ">
                <div class="item__description ">${obj.description}</div>
                <div class="right clearfix ">
                    <div class="item__value ">${formatnumber(obj.value,type)}</div>
                 <div class="item__delete ">
                    <button class="item__delete--btn "><i class="ion-ios-close-outline "></i></button>
                 </div>
                </div>
            </div>`;

            }
            if (type === 'exp') {
                element = document.querySelector(DomStrings.expensecontainer);

                markup =
                    `<div class="item clearfix " id="expense-${obj.id} ">
            <div class="item__description ">${obj.description}</div>
            <div class="right clearfix ">
                <div class="item__value ">${formatnumber(obj.value,type)}</div>
                <div class="item__percentage ">21%</div>
                <div class="item__delete ">
                    <button class="item__delete--btn "><i class="ion-ios-close-outline "></i></button>
                </div>
            </div>
        </div>`;
            }


            element.insertAdjacentHTML('beforeend', markup);
        },

        //clearing fields
        clearfields: function() {
            var fields = document.querySelectorAll(DomStrings.inputdesc + ',' + DomStrings.inputvalue);

            // var fieldarr = Array.prototype.slice.call(fields);
            // fieldarr.forEach((El) => {
            //     El.value = "";
            // });

            //other way
            Array.from(fields).forEach((el) => {
                el.value = "";
            });
            fields[0].focus();
        },

        displaybudget: function(obj) {

            var type = obj.budget > 0 ? 'inc' : 'exp';
            document.querySelector(DomStrings.budgetlabel).textContent = formatnumber(obj.budget, type);
            document.querySelector(DomStrings.expenselabel).textContent = formatnumber(obj.totalexpenses, 'exp');
            document.querySelector(DomStrings.incomelabel).textContent = formatnumber(obj.totalincome, 'inc');

            if (obj.per > 0) {
                document.querySelector(DomStrings.percentagelabel).textContent = obj.per + '%';
            } else {
                document.querySelector(DomStrings.percentagelabel).textContent = '--';

            }

        },

        displayper: function(perarr) {
            var fields = document.querySelectorAll(DomStrings.expensesperLabel); //nodelist
            //arg is an arr, so for every ele in arr, we need to display arr ele on ui


            //perar[i]=ele in nodelist, below we cahnge textcontent to percentagesarr
            nodeListForEach(fields, function(cur, i) {
                if (perarr[i] > 0) {
                    cur.textContent = perarr[i] + '%';
                } else {
                    cur.textContent = '--';

                }
            });

        },

        displaymonth: function() {
            var now = new Date();
            var year = now.getFullYear();
            var month = now.getMonth();
            var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            document.querySelector(DomStrings.datelabel).textContent = months[month] + ' ' + year;
        },

        changetype: function() {
            var fields = document.querySelectorAll(
                DomStrings.inputtype + ',' +
                DomStrings.inputdesc + ',' +
                DomStrings.inputvalue);

            nodeListForEach(fields, function(cur) {
                cur.classList.toggle('red-focus');
            });

            document.querySelector(DomStrings.bttn).classList.toggle('red');
        },

        // to make domstrings as public
        getdomstrs: function() {
            return DomStrings;
        }
    };
})();

//if we want to get value from UI and add to budgetcontroller then we need to connect them. so we need to create another module. 

var controller = (function(budgetctrl, UIctrl) {
    var initfun = function() {
        var domstr = UIctrl.getdomstrs(); //domstr contains an obj

        //for mouse click
        document.querySelector(domstr.bttn).addEventListener('click', ctrlAddItem);

        //for keypress only enter key which has keycode 13
        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
        document.querySelector(domstr.container).addEventListener('click', ctrldelitem);

        document.querySelector(domstr.inputtype).addEventListener('change', UIctrl.changetype);
    };


    var calcbudget = function() {
        //1.calc budget
        budgetctrl.calculatebudget();

        //2.return budget
        var bud = budgetctrl.getbudget();
        console.log(bud);
        //3.display  on ui
        UIctrl.displaybudget(bud);
    }

    var updatePercentages = function() {
        //1.calc %s
        budgetctrl.calcpercenatges();

        //2.read %s from budget controller
        var percentages = budgetctrl.getper();

        //3.update ui
        console.log(percentages);
        UIctrl.displayper(percentages);
    }

    var ctrlAddItem = function() {

        //1. Get field input values
        var inputvalue = UIctrl.getinput();
        console.log(inputvalue); //inputvalue contains an obj(type,description,value as pairs)

        //2.Add item to budget controller
        var addeditem = budgetctrl.additem(inputvalue.type, inputvalue.description, inputvalue.value);
        console.log(addeditem);

        if (inputvalue.description !== '' && inputvalue.value > 0 && !isNaN(inputvalue.value)) {

            //3.add to ui
            UIctrl.addlistitem(addeditem, inputvalue.type);

            //4.clear fields
            UIctrl.clearfields();

            //5.restrictions
            calcbudget()
            console.log(budgetctrl.testing());

            //6.calc and update %s
            updatePercentages();

        }


    }

    var delfromarr = function(type) {
        // remove from arr
        const q = type.substring(0, 3);
        const z = budgetctrl.testing();
        const r = +type.trim().slice(-1); //index
        const p = z.allItems[q] //array
        p.splice(r, 1)
        calcbudget()
            // console.log(z);

        //other way(only from arr not ui)
        // console.log(selectorID);
        // var el = document.getElementById(selectorID);
        // el.parentNode.removeChild(el);

    };

    var ctrldelitem = function(e) {

        if (e.target.parentNode.classList.contains('item__delete--btn')) {
            var itemid = (e.target.parentNode.parentNode.parentNode.parentNode.id);
            console.log(itemid);
            (document.getElementById(itemid)).remove();
            delfromarr(itemid);
            //calc and update %s
            updatePercentages();


        }

    }
    return {
        init: function() {
            console.log("application started");
            UIctrl.displaymonth();
            UIctrl.displaybudget({
                budget: 0,
                totalincome: 0,
                totalexpenses: 0,
                per: -1
            })
            initfun();
        }
    };

})(budgetcontroller, UIcontroller);
controller.init();

// as it is IIFE it is immediately invoked and return values of IIFE are stored in controller,Budgetctrl and uicontroller but for the functions in controller to be called we need make public and return as object
//controller can only access public members that is objects in return not x,add