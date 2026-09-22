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

Web programmers have altered the web page concept into a web application where a page now represents either a single page application (SPA) or a large group of hyperlinked pages that form a multi-page application (MPA).

HTML elements are represented with enclosing tags that may enclose other elements or text.

Paragraph element associated with tag(p)

Tags are delimited with the less than (<) and greater than (>) symbols. A closing tag will also have a forward slash (/) before its name.

The html element represents top level page structure.

head element contains metadata about the page and the page title.

body element represents the content structure.

main element represents the main content structure.

HTML is mainly about structure using render visual experience wouldn't change until you style with CSS

Every HTML element can have attributes.
Examples: id attribute gives a unique ID for a element to distinguish from other elements 
The class element attribute designates the element as being classified to a named group of elements

Attributes are written inside an element tag with a name followed by an optional value 
You can use ' or " to mark attribute values 

HTML has hyperlinks
A hyperlink in HTML is represented with an anchor (a) element that has an attribute containing the address of the hyperlink reference (href).

HTML defines a header (<!DOCTYPE html>)
Always include on top of file 

You can include comments in your HTML files by starting the comment with <!-- and ending it with -->

HTML uses several reserved characters for defining its file format.

If you want to use those characters in your content then you need to escape them using the entity syntax. 
For example character > Entity is &gt;

Some of the common HTML structural elements include body, header, footer, main, section, aside, p, table, ol/ul, div, and span. 
body.

The body has three children, a header, main, and footer. Each of the body children then contains other structural content.

The header contains a paragraph with a span, and a navigation containing multiple divisions of sub-content.

The main contains multiple sections that contain either an unordered list (ul) or a table. Main also contains an aside for content that does not fit the content flow of the sections.

Block and inline:
A block element is meant to be a distinct block in the flow of the content structure.
An inline element is meant to be inline with the content flow of a block element.

Meaning inline elements do not disrupt the flow of a block elements content

For example, the block element div (division) could have an inline element b in order to bring attention to a portion of its sub-text. Likewise a p (paragraph) element could have a span to mark the paragraph's sub-text as a person's name.

<div>He said <b>don't</b> cross the beams.</div>

<p>Authors such as <span>ee cummings</span> often used unconventional structure.</p>

Replacing navigation div elements with anchor elements that have hyperlinks

<body>
  <p>Body</p>
  <header>
    <p>Header - <span>Span</span></p>
    <nav>
      Navigation
      <div>Div</div>
      <div>Div</div>
    </nav>
  </header>

Transforms into
<body> 
  <p>Body</p> 
  <header> 
    <p>Header - <span>Span</span></p> 
    <nav> 
      Navigation 
      <a href="https://byu.edu">BYU</a> 
      <a href="https://familysearch.org">FamilySearch</a> 
    </nav> 
  </header>
</body>

Change the section ul element text to be "apples", "bananas", and "oranges".
<main>
    <section>
      <p>Section</p>
      <ul>
        <li>apples</li>
        <li>bananas</li>
        <li>oranges</li>

Adding image
<aside>
      <p>Aside</p>
      <img src="https://shorturl.at/FF8tS" width="300">
    </aside>
  </main>

Hyperlink footer
  <div>Footer - <span>Span</span></div> 
    <a href="https://github.com/Shania-Ziegler/startup">GitHub Repository</a>


The footer has a content division with a single span.

key Attributes of element 
<form>

action: Defines the URL of the server-side resource (e.g., an API endpoint) that will process the submitted data.
method: Specifies the HTTP method used to send the data.
GET: Appends form data to the URL in name/value pairs. Used for non-sensitive data like search queries.
POST: Sends data inside the body of the HTTP request. Used for sensitive information (like passwords) or when sending large amounts of data.


For data to be sent to the server, every input within form must have a <name> attribute.
Without the browser will not include that specific inputs data in the submission.

> [!NOTE]
> ## Input Element
>
> Inside a `<form>`, you can include `<input>` elements that represent many different types of user input.
>
> The type of input is set using the `type` attribute:
>
> ```html
> <input type="text">
> ```
>
> | `type` | Meaning |
> |---|---|
> | `text` | Single-line textual value |
> | `password` | Obscured password |
> | `email` | Email address |
> | `tel` | Telephone number |
> | `url` | URL address |
> | `number` | Numerical value |
> | `checkbox` | Inclusive selection — multiple options can be selected |
> | `radio` | Exclusive selection — only one option can be selected |
> | `range` | Range-limited number |
> | `date` | Year, month, and day |
> | `datetime-local` | Date and time |
> | `month` | Year and month |
> | `week` | Week of the year |
> | `color` | Color picker |
> | `file` | Select a local file |
> | `submit` | Button that triggers form submission |

In order to create an input you specify the desired type attribute along with any other attribute associated with that specific input.

> [!NOTE]
> ## Common Input Attributes
>
> Most `<input>` elements share some common attributes:
>
> | Attribute | Meaning |
> |---|---|
> | `name` | The name of the input. If used in a form, this name is submitted with the input value. |
> | `disabled` | Prevents the user from interacting with the input. |
> | `value` | Sets the initial value of the input. |
> | `required` | Means the input must have a value for the form to be valid. |


Common HTML structural elements organize a webpage into meaningful sections:

<html> — the root element that contains the whole HTML document.
<head> — contains information about the page, such as the title, metadata, and links to CSS.
<body> — contains everything that is visible on the webpage.
<header> — contains introductory content, such as a page title or logo.
<nav> — contains navigation links.
<main> — contains the primary content of the page.
<section> — groups related content together.
<article> — contains self-contained content, such as a blog post or news article.
<aside> — contains related or secondary content, such as a sidebar.
<footer> — contains information at the bottom of a page or section, such as copyright or contact information.

<menu> is the semantic version of <ul> for navigation. 

Semantic meaning explained so <div> is non-semantic meaning it's a generic box that tells you nothing. 

<nav>, <header>, <footer>, <aside> are semantic, because the name describes the content's role. 
This is great for developers, screen readers and search engines.

Some additional accessibility for html
- lang="en" on the html element so screen readers know the language
- <label for="..."> tied to each input's id, so clicking the label focuses the input
- alt text on images, describing what the image shows
- headings in order (h1, h2, h3) so the page has a readable outline


<dl> with <dt>/<dd> is for term-and-definition lists.

For sensitive data like passwords, you should use method="post" to ensure credentials aren't appended to the URL in the browser history.



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



