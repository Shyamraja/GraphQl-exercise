let express = require('express');
let bodyParser = require('body-parser');
const { ApolloServer, gql } = require('apollo-server-express');

const app = express();

const schema = gql`
  type Query {
     student(id: ID!): Student,
     students: [Student!]!,
     course(id: ID!): Course,
     courses: [Course!]!,
     grade(id: ID!): Grade,
     grades: [Grade!]!,
     gradesByStudent(studentid: ID!): [Grade!]!, 
     gradesByCourse(courseid: ID!): [Grade!]!
}

  type Student {
    id: ID!,
    name: String,
    email: String,
    studentgroupId: String,
    birthday : String,
  }

  type Course {
    id: ID!,
    name: String,
    description: String,
    teacher: String,
  }

  type Grade {
    id: ID!,
    studentid: ID,
    courseid: ID,
    grade: String,
  }
  

type Mutation {
    createStudent (
    name : String,
    email: String,
    studentgroupId: String,
    birthday : String
    )
     : ItemCreatedResponse!
  
  createCourse(
     name: String,
     description: String,
     teacher: String
  )
  :ItemCreatedResponse!

  createGrade (
      studentid: ID,
      courseid: ID,
      grade: String
  ) 
  : ItemCreatedResponse!
}
type ItemCreatedResponse {
  success: Boolean!
}

`;
let s = 1;

const students = [
  {
    id: s++,
    name : "Shyam",
    email: "shyam123@gmail.com",
    studentgroupId:"DIN17Sp",
    birthday: "1996-02-13",
  
  },
  {
    id: s++,
    name : "Kari",
    email: "kari123@gmail.com",
    studentgroupId:"DIN17Sp",
    birthday: "1980-02-13",
   },
   {
  id: s++,
  name : "Sanna",
  email: "susanna123@gmail.com",
  studentgroupId:"DIN17Sp",
  birthday: "1990-02-13",

   },
  ];
  let c = 1;
  let courses = [
      {
          id: c++,
          name: "Java",
          description: "Java in android",
          teacher: "Kari"
      },
      {
        id: c++,
        name: "Android Application",
        description: "Developing advanced android app",
        teacher: "Veikko"
         },
        
         {
          id: c++,
          name: "Hybrid Application",
          description: "Cordova and reactnative",
          teacher: "Lasse Havarinen"
        },
     
  ];
  let g= 1;
  let grades = [
      {
          id: g++,
          studentid: 1,
          courseid: 1,
          grade: "3" ,
      },
      {
          id: g++,
          studentid: 2,
          courseid: 3,
          grade: "3",
      },
      {
          id: g++,
          studentid: 3,
          courseid: 2,
          grade: "1",
      }
  ];
  
  

const resolvers =
 {
  Query: 
  {
    student: (parent, args, context, info) => {
      return students.find(s => s.id === +args.id);
    },
    students: (parents, args, context, info) => {
      return students;
    },
    course: (parent, args, context, info) => {
      return courses.find(c => c.id === +args.id)
    },
    courses: (parents, args, context, info) => {
      return courses;
    },
    grade: (parents, args, context, info) => {
    return grades.find(g => g.id === +args.id);

    },
   grades: (parent, args, context, info) => {
    return grades;
    },
    gradesByStudent: (parent, args, context, info) => {
      if (args.studentid) {
          return grades.filter(g => g.studentid === +args.studentid);
      }
    },
    gradesByCourse: (parent, args, context, info) => {
      if (args.courseid) {
          return grades.filter(g => g.courseid === +args.courseid);
      }
    }
  }
};
  
  Mutation: {
    createStudent: (parent, args, context, info) => {
        const student = {
           id: ((students.length) + 1).toString(),
            name: args.name,
            email: args.email,
            studentgroupId: args.studentgroupId,
            birthday:args.birthday,
            };
        students.push(student);
        return {success: true};
    }
    createCourse: (parent,args,context, info)=>{
      const course={
        id:((courses.length)+1).toString(),
        name:args.name,
        description:args.description,
        teacher:args.teacher
      };
      courses.push(course);
      return{success:true};
  
    }
    createGrade: (parent, args, context, info) => {
      const grade = {
          id: ((grades.length) + 1),
          studentid: args.studentid,
          courseid: args.courseid,
          grade: args.grade
      };
      grades.push(grade);
      return {success: true}
    }
  
 };
    
    const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    formatError: error => {
      console.log(error);
      return error;
    },
    formatResponse: response => {
      console.log(response);
      return response;
    },
  });
  
  server.applyMiddleware({ app, path: '/graphql' });
  
  app.listen({ port: 8000 }, () => {
    console.log('Apollo Server on http://localhost:8000/graphql');
  });
