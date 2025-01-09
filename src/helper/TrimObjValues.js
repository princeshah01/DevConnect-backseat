function trimObjectValues(obj) {
    const trimedObj = {} ;
    for (const key in obj ){
        if((typeof obj[key]) === "string"){
            
            trimedObj[key] = obj[key].trim();
        }
        else if(Array.isArray(obj[key])){
            trimedObj[key] =  obj[key].map((item)=>item.trim());

        }
        

    }
    return trimedObj ;
    
  }
  
module.exports = trimObjectValues ; 

//   const obj1 = {
//     firstName: "              Jssohhn",
//     lastName: "Dosdsrgg",
//     emailId:"prince.rjb839@gmail.com             ",
//     gender: "Male",
//     dateOfBirth: "                1990-01-01",
//     location : "nepal" ,
//     interests:["coding            " , "reading         " , "cycling"],
//     profilePicture:"https://hrithik.dev/_next/image?url=%2Fimages%2Fuser-image.jpeg",
//     bio:"  my name is hui hui hui i am from nepal a software developer" 
// } 

// const newObj = trimObjectValues(obj1) ;

// console.log(newObj) ;