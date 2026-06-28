// =====================
// PADOCK ACADEMY
// 共通管理ファイル
// =====================

const GAS_URL =
"https://script.google.com/macros/s/AKfycbyOKtpW7f_8-Hm2AIRDtS51T6n5jU-3Il18KBCnVGhV8SdwpaWttUDTinAgnAbyhCYr/exec";

// 現在ログイン中ユーザー

function getCurrentUser(){

return localStorage.getItem("currentUser");

}

// 修了登録

function completeCourse(course){

const user =
localStorage.getItem("currentUser");

const name =
localStorage.getItem("currentUserName");

if(!user){

console.error("ログインユーザーが見つかりません");

return;

}

// ローカル保存

localStorage.setItem(
user + "_" + course,
"pass"
);

// Googleシート保存

fetch(
GAS_URL,
{
method:"POST",
mode:"no-cors",
headers:{
"Content-Type":"text/plain"
},
body:JSON.stringify({
userId:user,
name:name,
course:course
})
}
)
.then(()=>{

console.log("送信成功");

})
.catch(error=>{

console.error(error);

});
  
}

// 修了確認

function isCompleted(course){

const user =
getCurrentUser();

if(!user){

return false;

}

return localStorage.getItem(
user + "_" + course
) === "pass";

}

// 修了率取得

function getProgress(){

const courses = [

"appearance",
"phone",
"cleaning",
"customer_check",
"hearing",
"questionnaire",
"welcome_drink",
"estimate",
"assessment",
"contract",
"delivery",
"after_follow"

];

let completed = 0;

courses.forEach(course=>{

if(isCompleted(course)){

completed++;

}

});

return Math.round(
(completed / courses.length) * 100
);

}

// 全コース修了判定

function isAcademyCompleted(){

const courses = [

"appearance",
"phone",
"cleaning",
"customer_check",
"hearing",
"questionnaire",
"welcome_drink",
"estimate",
"assessment",
"contract",
"delivery",
"after_follow"

];

return courses.every(
course => isCompleted(course)
);

}
