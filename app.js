
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

// const OUTPUT_DIR = path.resolve(__dirname, "output");
// const outputPath = path.join(OUTPUT_DIR, "team.html");

// const render = require("./lib/htmlRenderer");
// const { inherits } = require("util");

//make teamlist to store team members
var teamMembers_ls = [];
//make obj to hold questions for manager
const managerQ = [
    {
        type: "input",
        name: "name",
        message: "Enter manager's name: ",
    },
    {
        type: "input",
        name: "email",
        message: "Enter manager's email: ",

    },
    {
        type: "input",
        name: "officeNum",
        message: "Enter manager's Office Number: ",
    },
    {
        type: "list",
        name: "hasTeam",
        message: "Are there more members to your team?",
        choices: ["Yes", "No"]
    }
]
//make obj to hold questions for employees
const employeeQ = [
    {
        input: "input",
        name: "name",
        message: "enter employee's name: "
    },
    {
        type: "input",
        name: "email",
        message: "enter employee's email: "
    },
    {
        type: "list",
        name: "role",
        message: "what is employee's role? ",
        chocie: ["engineer", "intern"]
    },
    {
        when: input => {
            return input.role == "engineer"
        },
        type: "input",
        name: "github",
        message: "enter Engineer's github username: "
    },
    {
        when: input => {
            return input.role == "intern"
        },
        input: "input",
        name: "school",
        message: "enter Intern's school"
    },
    {
        type: "list",
        name: "addAnother",
        message: "would you like to add another team member?",
        choices: ["yes", "No"]
    }
] 
//function to push to teamlist each of the obj we created
function team_ls_Gen(){
    inquirer.prompt(employeeQ).then(employee_res => {
        if(employee_res == "engineer"){
            var newEmployee = new Engineer(employee_res.name, teamMembers_ls.length + 1, employee_res.email, employee_res.github);
        }else{
            var newEmployee = new Intern(employee_res.name, teamMembers_ls.length + 1, employee_res.email, employee_res.school);
        }
        teamMembers_ls.push(newEmployee);
        if(employee_res.addAnother === "Yes"){
            team_ls_Gen();
        }else{
            html_Gen();
        };
    });

};
//function to build the main html page
function html_Gen(){
    
}
//fimctopm to build to cards for each team member
//function to initalize
function init(){
    inquirer.prompt(managerQ).then(Manager_res => {
        let teamManager = new Manager(Manager_res.name, Manager_res.email, Manager_res.officeNum);
        teamMembers_ls.push(teamManager);
        console.log(teamMembers_ls)
        if (Manager_res.hasTeam === "Yes"){
            team_ls_Gen();
        }else{
            html_Gen();
        }
    })
}
 init();














// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
