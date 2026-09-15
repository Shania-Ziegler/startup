# CS 260 Notes

This file represents what I have learned about web programming.

- [My startup](https://startup.quantumsanctuary.click)
- [My simon](https://simon.quantumsanctuary.click)

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

An A record maps a domain name to an IP address. A wildcard record (*) covers
every subdomain at once, so startup.quantumsanctuary.click and
simon.quantumsanctuary.click both resolve without separate records.

Use `dig @nameserver domain` to query a specific nameserver directly. That tells
you whether your zone is serving correctly, separate from whether the registry
has propagated yet.

Domain: quantumsanctuary.click

Caddy uses Let's Encrypt and the ACME protocol to request and renew certificates
automatically. Let's Encrypt verifies you own the domain by asking your server to
return a signed response at a temporary URL over HTTP, then issues the cert.

In the Caddyfile, removing `:80` and putting the domain name in its place makes
Caddy serve over 443 and redirect HTTP to HTTPS. Restart with:

    sudo service caddy restart

Caddy also acts as a reverse proxy. `reverse_proxy * localhost:4000` sends
requests for startup.quantumsanctuary.click to a service running internally on
port 4000, so the browser never sees that port.

Let's Encrypt is a non profit with the goal of creating trusted web certificates for free.

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



