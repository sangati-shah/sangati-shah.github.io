// PROBLEM 1
let emp1 = {
    "firstName" : "Sam",
    "department" : "Tech",
    "designation" : "Manager",
    "salary" : 40000,
    "raiseEligible" : "true"
};

let emp2 = {
    "firstName" : "Mary",
    "department" : "Finance",
    "designation" : "Trainee",
    "salary" : 18500,
    "raiseEligible" : "true"
};

let emp3 = {
    "firstName" : "Bill",
    "department" : "HR",
    "designation" : "Executive",
    "salary" : 21200,
    "raiseEligible" : "false"
};
console.log("PROBLEM 1");
console.log(emp1);
console.log(emp2);
console.log(emp3);

// PROBLEM 2
let JSON = {
    "companyName" : "Tech Stars",
    "website" : "www.techstars.site",
    "employees" : [emp1, emp2, emp3]
};
console.log("PROBLEM 2");
console.log(JSON);

// PROBLEM 3
let emp4 = {
    "firstName" : "Anna",
    "department" : "Tech",
    "designation" : "Executive",
    "salary" : 25600,
    "raiseEligible" : "false"
};
console.log("PROBLEM 3");
JSON.employees.push(emp4);
console.log(JSON);  

// PROBLEM 4
empArr = JSON.employees;
let totSal = 0;
for (const emp of empArr){
    totSal += emp.salary;
}
console.log("PROBLEM 4");
console.log(`The Total Salary for all employees is: ${totSal}`);

// PROBLEM 5
function updateSal(JSON, empArr) {
    for (const emp of empArr){
        if (emp.raiseEligible === "true"){
            emp.salary = emp.salary * 1.1;
            emp.raiseEligible = "false";
        }
    }
    console.log(JSON);    
}
console.log("PROBLEM 5");
updateSal(JSON, empArr);

// PROBLEM 6
const wfh = ['Anna', 'Sam'];
for (const emp of empArr) {
    if (wfh.includes(emp.firstName)){
        emp.wfh = "true";
    }
    else{
        emp.wfh = "false";
    }
}
console.log("PROBLEM 6");
console.log(JSON);