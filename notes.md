# CS 260 Notes

This file represents what I have learned about web programming.

- [My startup](https://startup.cs260.click)
- [My simon](https://simon.cs260.click)

I love web programming

## Helpful links

- [Course instruction](https://github.com/webprogramming260)
- [Canvas](https://byu.instructure.com)
- [MDN](https://developer.mozilla.org)


## AWS

You can have billing alerts set up within AWS.

Server IP: 54.163.151.162

Shell into the server:

    ssh -i ~/keys/cs260.pem ubuntu@54.163.151.162

The class AMI comes with Ubuntu, Node.js, NVM, Caddy, and PM2 already installed.
An elastic IP keeps the address the same even if the server restarts.

## HTML

Tim Berners-Lee invented document format HyperText Markup Language HTML while working at the CERN research laboratory.

Key invention: documents could be interconnected with hyperlinks to allow immediate access to related documents

HTML originally contained only 18 elements/tags the latest has 100+ 

Simple HTML document:
<html>
  <body>
    <p>Hello world!</p>
  </body>
</html>

## React

Interesting things I have learned about React

## CSS 
Cascading Style Sheets (CSS) were first proposed in 1994 by Håko Wium Lie at CERN, in order to give HTML documents visual styling independent of the content's structure.
Before the introduction of CSS, HTML was going to hard code the visual appearance of the content with HTML elements.

Below simple example of CSS that defines the white spacing, color, and shadowing of paragraph text:
p {
  margin: 0;
  padding: 20px 0;
  color: #00539f;
  text-shadow: 3px 3px 1px black;
}

## Javascript
In 1995 Netscape (the maker of the popular browser Navigator) decided to add the ability to script web pages. The initial implementation was led by Brendan Eich and given the name JavaScript. JavaScript turned the previously static web into an interactive experience where a web page could dynamically change based upon a user's interaction.

Below is an example of a simple JavaScript program that combines variables and prints out the result from CS 260 Webprogramming MLS site:

const join = (...a) => {
  return a.reduce((accumulator, currentValue) => accumulator + currentValue);
};

console.log(join(1, 2));
console.log(join('hello', ' ', 'world', '!'));



## Node.js
In 2009 Ryan Dahl created Node.js as the first successful application for deploying JavaScript outside of a browser.



## Technology Stack 

The collection of technologies that you use to create or deliver your web application is called a technology stack.



What our stack looks like: React for the web framework, talking to Caddy as the web server hosted on AWS, running web services with Node.js, and MongoDB as the database hosted on MongoDB Atlas.



