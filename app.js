
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
        name: "officeNumber",
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
        choices: ["engineer", "intern"]
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
        if(employee_res.role == "engineer"){
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
    let newFile = fs.readFileSync("./templates/main.html");
    fs.writeFileSync("./output/teamPage.html", newFile, function(err){
        if(err) throw err;
    });
    console.log("Page generated");

    for (member of teamMembers_ls){
        if(member.getRole() == "Manager"){
            card_Gen("manager", member.getName(), member.getId(), member.getEmail(), "Office: " + member.getOfficeNumber());
        } else if(member.getRole() == "Engineer"){
            card_Gen("engineer", member.getName(), member.getId(), member.getEmail(), "GitHub: " + member.getGithub());
        } else if(member.getRole() == "Intern"){
            card_Gen("intern",member.getName(), member.getId(), member.getEmail(), "School: " + member.getSchool());
        }
    }

    fs.appendFileSync("./output/teamPage.html", "</div><main></body></html>", function (err){
        if (err) throw err});

}
//function to build to cards for each team member
function card_Gen(memberType, name, id, email, propertyValue){
    let info = fs.readFileSync(`./templates/${memberType}.html`,'utf8');
    info = info.replace("nameHere", name);
    info = info.replace("idHere", `ID: ${id}`);
    info = info.replace("emailHere", `Email: ${email}`)
    info = info.replace("propertyHere", propertyValue);
    fs.appendFileSync("./output/teamPage.html", info, err => { if (err) throw err;})
    console.log("Card appended");
    
}
//function to initalize
function init(){
    inquirer.prompt(managerQ).then(Manager_res => {
        let teamManager = new Manager(Manager_res.name, Manager_res.email, Manager_res.officeNumber);
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